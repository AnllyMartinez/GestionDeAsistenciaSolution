using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.Asistencia;
using GestionDeAsistencia.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenciasController : ControllerBase
    {
        private readonly GestionAsistenciaContext _context;

        public AsistenciasController(GestionAsistenciaContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarAsistencia([FromBody] RegistrarAsistenciaDto request)
        {
            var hoy = DateTime.Now.Date;

            // Verificar si ya existe una asistencia del mismo tipo en el mismo día
            bool existeRegistro = await _context.Asistencias
                .AnyAsync(a => a.UsuarioID == request.UsuarioID &&
                               a.Tipo == request.Tipo &&
                               a.FechaHora.Date == hoy);

            if(existeRegistro)
            {
                return BadRequest(new { Mensaje = $"Ya existe un registro {request.Tipo} para hoy." });
            }

            var asistencia = new Asistencia
            {
                UsuarioID = request.UsuarioID,
                FechaHora = DateTime.Now,
                Tipo = request.Tipo,
                RegistradoPor = request.RegistradoPor
            };

            _context.Asistencias.Add(asistencia);
            await _context.SaveChangesAsync();
            return Ok(new { Mensaje = $"{request.Tipo} registrada" });
        }

        [HttpGet]
        public async Task<IActionResult> TraerAsistencias([FromQuery] int? usuarioID, [FromQuery] DateTime? fecha)
        {
            var query = _context.Asistencias.AsQueryable();
            if(usuarioID.HasValue)
                query = query.Where(a => a.UsuarioID == usuarioID.Value);

            if(fecha.HasValue)
            {
                var startDate = fecha.Value.Date;
                var endDate = startDate.AddDays(1);
                query = query.Where(a => a.FechaHora >= startDate && a.FechaHora < endDate);
            }

            var asistencias = await query.OrderByDescending(x => x.FechaHora).Include(x => x.Usuario).ToListAsync();
            return Ok(asistencias);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> TraerAsistencia(int id)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if(asistencia == null)
                return NotFound("Asistencia no encontrada");
            return Ok(asistencia);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarAsistencia(int id)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if(asistencia == null)
                return NotFound("Asistencia no encontrada");

            _context.Asistencias.Remove(asistencia);
            await _context.SaveChangesAsync();
            return Ok("Asistencia eliminada");
        }
    }
}