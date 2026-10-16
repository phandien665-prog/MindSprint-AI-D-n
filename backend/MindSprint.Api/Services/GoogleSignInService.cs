using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;

namespace MindSprint.Api.Services;

public record GoogleIdentity(string Subject, string Email, string DisplayName);

public class GoogleSignInException(int status, string code, string message) : Exception(message)
{
    public int Status { get; } = status;
    public string Code { get; } = code;
}

public interface IGoogleTokenValidator
{
    Task<GoogleIdentity> ValidateAsync(string credential, string nonce, CancellationToken cancellationToken);
}

public class GoogleTokenValidator(IConfiguration configuration) : IGoogleTokenValidator
{
    public async Task<GoogleIdentity> ValidateAsync(string credential, string nonce, CancellationToken cancellationToken)
    {
        var clientId = configuration["Google:ClientId"]?.Trim();
        if (string.IsNullOrEmpty(clientId))
            throw new GoogleSignInException(503, "google_not_configured", "Đăng nhập Google chưa được bật.");
        try
        {
            // Google's library verifies signature, issuer, intended audience and lifetime.
            var payload = await GoogleJsonWebSignature.ValidateAsync(credential,
                new GoogleJsonWebSignature.ValidationSettings { Audience = [clientId] })
                .WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
            // Read the nonce only AFTER the whole ID token has passed signature validation.
            var verifiedNonce = new JwtSecurityTokenHandler().ReadJwtToken(credential)
                .Claims.FirstOrDefault(c => c.Type == "nonce")?.Value;
            if (!payload.AudienceAsList.Contains(clientId) || verifiedNonce != nonce || !payload.EmailVerified ||
                string.IsNullOrWhiteSpace(payload.Subject) || payload.Subject.Length > 255 ||
                string.IsNullOrWhiteSpace(payload.Email) || payload.Email.Length > 254 ||
                !new EmailAddressAttribute().IsValid(payload.Email))
                throw new GoogleSignInException(401, "google_invalid_credential",
                    "Không thể xác minh tài khoản Google. Hãy chọn lại tài khoản.");
            var email = payload.Email.Trim().ToLowerInvariant();
            var name = string.IsNullOrWhiteSpace(payload.Name) ? email : payload.Name.Trim();
            return new GoogleIdentity(payload.Subject, email, name[..Math.Min(name.Length, 100)]);
        }
        catch (Exception ex) when (ex is InvalidJwtException or ArgumentException or FormatException)
        {
            throw new GoogleSignInException(401, "google_invalid_credential",
                "Thông tin đăng nhập Google không hợp lệ hoặc đã hết hạn. Hãy chọn lại tài khoản.");
        }
        catch (Exception ex) when (ex is HttpRequestException or TimeoutException)
        {
            throw new GoogleSignInException(503, "google_unavailable",
                "Chưa thể kết nối Google để xác minh. Vui lòng thử lại sau.");
        }
    }
}

// Short-lived, one-use nonces bind a Google credential to this sign-in attempt.
// Single-process store: a multi-instance deployment needs a shared, atomic nonce store.
public class GoogleLoginChallenges(TimeProvider clock)
{
    private readonly Dictionary<string, DateTimeOffset> pending = new();
    private readonly object gate = new();

    public string? Create()
    {
        lock (gate)
        {
            var now = clock.GetUtcNow();
            foreach (var key in pending.Where(p => p.Value <= now).Select(p => p.Key).ToArray()) pending.Remove(key);
            if (pending.Count >= 4096) return null;
            var nonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            pending.Add(nonce, now.AddMinutes(5));
            return nonce;
        }
    }

    public bool IsValid(string nonce)
    {
        lock (gate) return pending.TryGetValue(nonce, out var expires) && expires > clock.GetUtcNow();
    }

    public bool Consume(string nonce)
    {
        lock (gate)
        {
            if (!pending.Remove(nonce, out var expires)) return false;
            return expires > clock.GetUtcNow();
        }
    }
}

public class GoogleAccountService(AppDbContext db, IPasswordHasher<User> hasher)
{
    // Changes remain tracked but unsaved until the controller consumes the nonce.
    public async Task<User> ResolveAsync(GoogleIdentity identity, string? existingPassword, CancellationToken ct)
    {
        var linked = await db.Users.FirstOrDefaultAsync(u => u.GoogleSubject == identity.Subject, ct);
        if (linked is not null) return linked;

        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == identity.Email, ct);
        if (user is not null)
        {
            if (user.GoogleSubject is not null)
                throw new GoogleSignInException(409, "google_account_conflict",
                    "Email này đã liên kết với tài khoản Google khác. Hãy đăng nhập bằng phương thức hiện tại.");
            // Never silently merge accounts, including accounts with a verified Google email.
            if (string.IsNullOrEmpty(existingPassword))
                throw new GoogleSignInException(409, "google_link_required",
                    "Email này đã có tài khoản. Nhập mật khẩu hiện tại để liên kết Google và giữ dữ liệu của bạn.");
            if (hasher.VerifyHashedPassword(user, user.PasswordHash, existingPassword) == PasswordVerificationResult.Failed)
                throw new GoogleSignInException(401, "google_link_password_invalid", "Mật khẩu hiện tại không đúng.");
            user.GoogleSubject = identity.Subject;
            return user;
        }

        user = new User { Email = identity.Email, DisplayName = identity.DisplayName, GoogleSubject = identity.Subject };
        // A Google-only account has no predictable password or shared default password.
        user.PasswordHash = hasher.HashPassword(user, Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)));
        db.Users.Add(user);
        return user;
    }
}
