using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

public record RegisterDto([Required, EmailAddress] string Email, [Required, MinLength(6)] string Password, [Required] string DisplayName);
public record LoginDto([Required] string Email, [Required] string Password);
public record RefreshDto([Required] string RefreshToken, string? DeviceHint);
public record RevokeDto(string? RefreshToken);

[Route("api/auth")]
public class AuthController(AppDbContext db, IPasswordHasher<User> hasher, TokenService tokens) : ApiBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email)) return Conflict(new { message = "Email đã được sử dụng." });

        var user = new User { Email = email, DisplayName = dto.DisplayName.Trim() };
        user.PasswordHash = hasher.HashPassword(user, dto.Password);
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var rt = await tokens.CreateRefreshTokenAsync(user, null);
        return Ok(new { token = tokens.CreateAccessToken(user), refreshToken = rt.Token, user = new { user.Id, user.Email, user.DisplayName } });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        if (email == "demo") email = "notebookai@demo.local";
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password) == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Sai email hoặc mật khẩu." });

        var rt = await tokens.CreateRefreshTokenAsync(user, null);
        return Ok(new { token = tokens.CreateAccessToken(user), refreshToken = rt.Token, user = new { user.Id, user.Email, user.DisplayName } });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshDto dto)
    {
        var newRt = await tokens.RotateAsync(dto.RefreshToken, dto.DeviceHint);
        if (newRt is null) return Unauthorized(new { message = "Refresh token không hợp lệ hoặc đã hết hạn." });
        return Ok(new { token = tokens.CreateAccessToken(newRt.User!), refreshToken = newRt.Token });
    }

    [HttpPost("revoke")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Revoke(RevokeDto dto)
    {
        var uid = UserId;
        if (string.IsNullOrEmpty(dto.RefreshToken))
        {
            await tokens.RevokeAllAsync(uid);
            return Ok(new { message = "Đã thu hồi toàn bộ phiên." });
        }
        var ok = await tokens.RevokeAsync(dto.RefreshToken, uid);
        return ok ? Ok(new { message = "Đã thu hồi phiên." }) : NotFound(new { message = "Không tìm thấy phiên." });
    }

    [HttpPost("revoke-all")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> RevokeAll()
    {
        await tokens.RevokeAllAsync(UserId);
        return Ok(new { message = "Đã đăng xuất khỏi mọi thiết bị." });
    }

    [HttpPost("demo")]
    public async Task<IActionResult> DemoLogin()
    {
        const string demoEmail = "notebookai@demo.local";
        const string demoPassword = "MindSprint123!";
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == demoEmail);
        if (user is null)
        {
            user = new User { Email = demoEmail, DisplayName = "Notebook AI Demo" };
            user.PasswordHash = hasher.HashPassword(user, demoPassword);
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }
        var rt = await tokens.CreateRefreshTokenAsync(user, null);
        return Ok(new { token = tokens.CreateAccessToken(user), refreshToken = rt.Token, user = new { user.Id, user.Email, user.DisplayName } });
    }

    [Microsoft.AspNetCore.Authorization.Authorize, HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await db.Users.FindAsync(UserId);
        if (user is null) return Unauthorized(new { message = "Người dùng không tồn tại." });
        return Ok(new { user.Id, user.Email, user.DisplayName });
    }
}
