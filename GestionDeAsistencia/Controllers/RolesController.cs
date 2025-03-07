using GestionDeAsistencia.Data;
using GestionDeAsistencia.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly GestionAsistenciaContext _contexto;

        public RolesController(GestionAsistenciaContext context)
        {
            _contexto = context;
        }

        [HttpGet]
        public async Task<IActionResult> TraerRoles()
        {
            var roles = await _contexto.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> TraerRol(int id)
        {
            var rol = await _contexto.Roles.FindAsync(id);
            if(rol == null)
                return NotFound(new { Mensaje = "Rol no encontrado" });
            return Ok(rol);
        }

        [HttpPost]
        public async Task<IActionResult> CrearRol([FromBody] Rol rol)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            _contexto.Roles.Add(rol);
            await _contexto.SaveChangesAsync();
            return CreatedAtAction(nameof(CrearRol), new { id = rol.RolID }, rol);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarRol(int id, [FromBody] Rol rol)
        {
            if(id != rol.RolID)
                return BadRequest(new { Mensaje = "El ID no coincide" });

            _contexto.Entry(rol).State = EntityState.Modified;

            try
            {
                await _contexto.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                if(await _contexto.Roles.FindAsync(id) == null)
                    return NotFound(new { Mensaje = "Rol no encontrado" });
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarRol(int id)
        {
            var rol = await _contexto.Roles.FindAsync(id);
            if(rol == null)
                return NotFound(new { Mensaje = "Rol no encontrado" });

            _contexto.Roles.Remove(rol);
            await _contexto.SaveChangesAsync();
            return Ok(new { Mensaje = "Rol eliminado" });
        }
    }
}