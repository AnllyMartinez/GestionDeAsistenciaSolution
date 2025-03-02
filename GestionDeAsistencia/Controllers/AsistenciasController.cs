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
            var asistencia = new Asistencia
            {
                UsuarioID = request.UsuarioID,
                FechaHora = DateTime.Now,
                Tipo = request.Tipo,
                RegistradoPor = request.RegistradoPor
            };

            _context.Asistencias.Add(asistencia);
            await _context.SaveChangesAsync();
            return Ok(new { Mensaje = "Asistencia registrada" });
        }

        [HttpGet]
        public async Task<IActionResult> TraerAsistencias([FromQuery] int? usuarioID)
        {
            var query = _context.Asistencias.AsQueryable();
            if(usuarioID.HasValue)
                query = query.Where(a => a.UsuarioID == usuarioID.Value);

            //if(fecha.HasValue)
            //{
            //    var startDate = fecha.Value.Date;
            //    var endDate = startDate.AddDays(1);
            //    query = query.Where(a => a.FechaHora >= startDate && a.FechaHora < endDate);
            //}
            var asistencias = await query.OrderByDescending(x => x.FechaHora).ToListAsync();
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

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarAsistencia(int id, [FromBody] RegistrarAsistenciaDto request)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if(asistencia == null)
                return NotFound("Asistencia no encontrada");

            asistencia.UsuarioID = request.UsuarioID;
            asistencia.Tipo = request.Tipo;

            await _context.SaveChangesAsync();
            return Ok("Asistencia actualizada");
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