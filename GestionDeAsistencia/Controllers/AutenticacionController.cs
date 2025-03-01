using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.Login;
using GestionDeAsistencia.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacionController : ControllerBase
    {
        private GestionAsistenciaContext _context;
        private readonly JwtService _jwtService;

        public AutenticacionController(GestionAsistenciaContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        private string HashContrasena(string contrasena)
        {
            using(SHA256 sha256Hash = SHA256.Create())
            {
                var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(contrasena));
                var builder = new StringBuilder();
                foreach(var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            var hashedContrasena = HashContrasena(login.Contrasena);
            var usuario = await _context.Usuarios.Include(u => u.Rol)
                                .FirstOrDefaultAsync(u => u.Email == login.Email && u.Contraseña == hashedContrasena);
            if(usuario == null)
                return Unauthorized("Credenciales inválidas");

            var token = _jwtService.GenerarToken(usuario.Email, usuario.UsuarioID, usuario.Rol.NombreRol);
            return Ok(new { Token = token });
        }
    }
}