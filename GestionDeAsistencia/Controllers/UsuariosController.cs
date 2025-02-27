using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.Usuario;
using GestionDeAsistencia.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
                return NotFound("Usuario no encontrado");
            }

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<IActionResult> CrearUsuario([FromBody] Usuario usuario)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            _contexto.Usuarios.Add(usuario);
            await _contexto.SaveChangesAsync();
            return CreatedAtAction(nameof(CrearUsuario), new { id = usuario.UsuarioID }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] Usuario usuario)
        {
            if(id != usuario.UsuarioID)
                return BadRequest("El ID no coincide");

            _contexto.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _contexto.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                if(await _contexto.Usuarios.FindAsync(id) == null)
                    return NotFound("Usuario no encontrado");
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarUsuario(int id)
        {
            var usuario = await _contexto.Usuarios.FindAsync(id);
            if(usuario == null)
                return NotFound("Usuario no encontrado");

            _contexto.Usuarios.Remove(usuario);
            await _contexto.SaveChangesAsync();

            return Ok("Usuario eliminado");
        }

        [HttpPut("{id}/rol")]
        public async Task<IActionResult> ActualizarRolUsuario(int id, [FromBody] ActualizarRolDto request)
        {
            var usuario = await _contexto.Usuarios.FindAsync(id);
            if(usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            usuario.RolID = request.RolID;
            await _contexto.SaveChangesAsync();

            return Ok("Rol actualizado");
        }
    }
}