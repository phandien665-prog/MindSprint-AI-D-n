using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindSprint.Api.Data;
using MindSprint.Api.Models;

namespace MindSprint.Api.Services;

/// <summary>
/// #5 – JWT access token (15 phút) + refresh token (7 ngày).
/// Thu hồi toàn bộ phiên: RevokeAllAsync; thu hồi 1 phiên: RevokeAsync.
/// </summary>
public class TokenService(IConfiguration cfg, AppDbContext db)
{
    private static readonly int RefreshDays = 7;

    // ── Access token ──────────────────────────────────────────────────────────
    public string CreateAccessToken(User u)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!));
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
            new Claim(ClaimTypes.Email,           u.Email),
            new Claim(ClaimTypes.Name,            u.DisplayName)
        };
        // Access token ngắn hạn: mặc định 15 phút (cấu hình Jwt:AccessMinutes)
        var minutes = int.Parse(cfg["Jwt:AccessMinutes"] ?? "15");
        var token = new JwtSecurityToken(
            cfg["Jwt:Issuer"], cfg["Jwt:Audience"], claims,
            expires: DateTime.UtcNow.AddMinutes(minutes),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>Giữ nguyên để không vỡ code cũ (Login trả về token trực tiếp).</summary>
    public string Create(User u) => CreateAccessToken(u);

    // ── Refresh token ─────────────────────────────────────────────────────────
    public async Task<RefreshToken> CreateRefreshTokenAsync(User u, string? deviceHint)
    {
        // Xoá các token hết hạn (dọn dẹp nhẹ)
        var expiredCutoff = DateTime.UtcNow;
        var expired = await db.RefreshTokens
            .Where(r => r.UserId == u.Id && (r.IsRevoked || r.ExpiresAt < expiredCutoff))
            .ToListAsync();
        db.RefreshTokens.RemoveRange(expired);

        var rt = new RefreshToken
        {
            UserId    = u.Id,
            Token     = GenerateSecureToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshDays),
            DeviceHint = deviceHint?.Length > 200 ? deviceHint[..200] : deviceHint
        };
        db.RefreshTokens.Add(rt);
        await db.SaveChangesAsync();
        return rt;
    }

    /// <summary>Xác thực refresh token, trả về User nếu hợp lệ.</summary>
    public async Task<User?> ValidateRefreshTokenAsync(string token)
    {
        var rt = await db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == token);

        if (rt is null || rt.IsRevoked || rt.ExpiresAt < DateTime.UtcNow) return null;
        return rt.User;
    }

    /// <summary>Xoay vòng: thu hồi token cũ, tạo token mới (rotation).</summary>
    public async Task<RefreshToken?> RotateAsync(string oldToken, string? deviceHint)
    {
        var rt = await db.RefreshTokens.Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == oldToken);
        if (rt is null || rt.IsRevoked || rt.ExpiresAt < DateTime.UtcNow) return null;

        rt.IsRevoked = true; // vô hiệu hoá cũ
        var newRt = new RefreshToken
        {
            UserId     = rt.UserId,
            User       = rt.User,
            Token      = GenerateSecureToken(),
            ExpiresAt  = DateTime.UtcNow.AddDays(RefreshDays),
            DeviceHint = deviceHint ?? rt.DeviceHint
        };
        db.RefreshTokens.Add(newRt);
        await db.SaveChangesAsync();
        return newRt;
    }

    /// <summary>Thu hồi 1 refresh token (đăng xuất trên thiết bị hiện tại).</summary>
    public async Task<bool> RevokeAsync(string token, int userId)
    {
        var rt = await db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token && r.UserId == userId);
        if (rt is null) return false;
        rt.IsRevoked = true;
        await db.SaveChangesAsync();
        return true;
    }

    /// <summary>Thu hồi TOÀN BỘ phiên của user (đăng xuất mọi thiết bị).</summary>
    public async Task RevokeAllAsync(int userId)
    {
        await db.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.IsRevoked, true));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private static string GenerateSecureToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
}
