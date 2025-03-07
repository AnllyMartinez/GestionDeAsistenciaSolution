using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.Usuario;
using GestionDeAsistencia.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly GestionAsistenciaContext _contexto;

        public UsuariosController(GestionAsistenciaContext contexto)
        {
            this._contexto = contexto;
        }

        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> TraerUsuarios()
        {
            var usuarios = await _contexto.Usuarios.Include(u => u.Rol).ToListAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> TraerUsuario(int id)
        {
            var usuario = await _contexto.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.UsuarioID == id);

            if(usuario == null)
            {
                return NotFound(new { Mensaje = "Usuario no encontrado" });
            }

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<IActionResult> CrearUsuario([FromBody] CrearUsuarioDto usuario)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuarioModelo = new Usuario
            {
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Email = usuario.Email,
                Contraseña = HashContrasena(usuario.Email),
                RolID = usuario.RolID
            };

            _contexto.Usuarios.Add(usuarioModelo);
            await _contexto.SaveChangesAsync();
            return CreatedAtAction(nameof(CrearUsuario), new { id = usuarioModelo.UsuarioID }, usuarioModelo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] ActualizarUsuarioDto dto)
        {
            var usuarioExistente = await _contexto.Usuarios.FindAsync(id);
            if(usuarioExistente == null)
            {
                return NotFound(new { Mensaje = "Usuario no encontrado" });
            }

            // Actualizar solo las propiedades que se han enviado
            if(!string.IsNullOrEmpty(dto.Nombre))
            {
                usuarioExistente.Nombre = dto.Nombre;
            }

            if(!string.IsNullOrEmpty(dto.Apellido))
            {
                usuarioExistente.Apellido = dto.Apellido;
            }

            if(!string.IsNullOrEmpty(dto.Email))
            {
                usuarioExistente.Email = dto.Email;
            }

            if(dto.RolID.HasValue)
            {
                usuarioExistente.RolID = dto.RolID.Value;
            }

            try
            {
                await _contexto.SaveChangesAsync();
            }
            catch(Exception)
            {
                if(await _contexto.Usuarios.FindAsync(id) == null)
                {
                    return NotFound(new { Mensaje = "Usuario no encontrado" });
                }
                throw;
            }

            return Ok(new { Mensaje = "Usuario actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarUsuario(int id)
        {
            var usuario = await _contexto.Usuarios.FindAsync(id);
            if(usuario == null)
                return NotFound(new { Mensaje = "Usuario no encontrado" });

            _contexto.Usuarios.Remove(usuario);
            await _contexto.SaveChangesAsync();

            return Ok(new { Mensaje = "Usuario eliminado" });
        }

        [HttpPut("{id}/rol")]
        public async Task<IActionResult> ActualizarRolUsuario(int id, [FromBody] ActualizarRolDto request)
        {
            var usuario = await _contexto.Usuarios.FindAsync(id);
            if(usuario == null)
            {
                return NotFound(new { Mensaje = "Usuario no encontrado" });
            }

            usuario.RolID = request.RolID;
            await _contexto.SaveChangesAsync();

            return Ok(new { Mensaje = "Rol actualizado" });
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
    }
}