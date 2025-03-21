﻿using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.Login;
using GestionDeAsistencia.Dtos.Usuario;
using GestionDeAsistencia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacionController : ControllerBase
    {
        private GestionAsistenciaContext _context;
        private readonly JwtServicio _jwtService;

        public AutenticacionController(GestionAsistenciaContext context, JwtServicio jwtService)
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

        [HttpPost("inicioSesion")]
        public async Task<ActionResult<UsuarioDto>> Login([FromBody] InicioSesionDto login)
        {
            var hashedContrasena = HashContrasena(login.Contrasena);
            var usuario = await _context.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Email == login.Email && u.Contraseña == hashedContrasena);

            if(usuario == null)
                return Unauthorized("Credenciales inválidas");

            var token = _jwtService.GenerarToken(usuario.Email, usuario.UsuarioID, usuario.Rol.NombreRol);

            var usuarioDto = new UsuarioDto
            {
                UsuarioID = usuario.UsuarioID,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Rol = usuario.Rol.NombreRol,
                Token = token
            };

            return Ok(usuarioDto);
        }

        [Authorize]
        [HttpPut("actualizarContrasena/{id}")]
        public async Task<IActionResult> ActualizarPassword(int id, [FromBody] ActualizarContrasenaDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if(usuario == null)
            {
                return NotFound(new { Mensaje = "Usuario no encontrado" });
            }

            usuario.Contraseña = HashContrasena(dto.NuevaContrasena);
            await _context.SaveChangesAsync();

            return Ok(new { Mensaje = "Contraseña actualizada exitosamente" });
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UsuarioDto>> ObtenerUsuarioActual()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var usuario = await _context.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Email == email);

            var usuarioDto = new UsuarioDto
            {
                UsuarioID = usuario.UsuarioID,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Rol = usuario.Rol.NombreRol,
                Token = _jwtService.GenerarToken(usuario.Email, usuario.UsuarioID, usuario.Rol.NombreRol)
            };

            return usuarioDto;
        }
    }
}