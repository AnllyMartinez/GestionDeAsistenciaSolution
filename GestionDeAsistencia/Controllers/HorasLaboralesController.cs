using GestionDeAsistencia.Data;
using GestionDeAsistencia.Dtos.HorasLaboradas;
using GestionDeAsistencia.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionDeAsistencia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorasLaboralesController : ControllerBase
    {
        private readonly GestionAsistenciaContext _context;

        public HorasLaboralesController(GestionAsistenciaContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarHoras([FromBody] RegistrarHorasLaboradas request)
        {
            var hoy = DateTime.Now.Date;

            // Verificar si ya existe un registro de horas
            bool existeRegistro = await _context.HorasLaborales
                .AnyAsync(a => a.ProfesorID == request.ProfesorID && (a.Fecha.Date) == hoy);

            if(existeRegistro)
            {
                return BadRequest(new { Mensaje = $"Ya existe un registro de horas laboradas para hoy." });
            }
            var totalHoras = (request.HoraFin - request.HoraInicio).TotalHours;
            var registro = new HorasLaborales
            {
                ProfesorID = request.ProfesorID,
                Fecha = request.Fecha,
                HoraInicio = request.HoraInicio,
                HoraFin = request.HoraFin,
                TotalHoras = totalHoras
            };

            _context.HorasLaborales.Add(registro);
            await _context.SaveChangesAsync();
            return Ok(new { Mensaje = $"Horas laborales registradas" });
        }

        [HttpGet]
        public async Task<IActionResult> TraerHorasLaborales([FromQuery] int? profesorID, [FromQuery] DateTime? fecha)
        {
            var query = _context.HorasLaborales.AsQueryable();
            if(profesorID.HasValue)
                query = query.Where(h => h.ProfesorID == profesorID.Value);
            if(fecha.HasValue)
            {
                var startDate = fecha.Value.Date;
                var endDate = startDate.AddDays(1);
                query = query.Where(h => h.Fecha >= startDate && h.Fecha < endDate);
            }
            var registros = await query.OrderBy(x => x.Fecha).Include(x => x.Profesor).ToListAsync();
            return Ok(registros);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> TraerHorasLaboralesPorId(int id)
        {
            var registro = await _context.HorasLaborales.FindAsync(id);
            if(registro == null)
                return NotFound("Registro no encontrado");
            return Ok(registro);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarHorasLaborales(int id, [FromBody] RegistrarHorasLaboradas request)
        {
            var registro = await _context.HorasLaborales.FindAsync(id);
            if(registro == null)
                return NotFound("Registro no encontrado");

            registro.ProfesorID = request.ProfesorID;
            registro.Fecha = request.Fecha;
            registro.HoraInicio = request.HoraInicio;
            registro.HoraFin = request.HoraFin;
            registro.TotalHoras = (request.HoraFin - request.HoraInicio).TotalHours;

            await _context.SaveChangesAsync();
            return Ok("Registro actualizado");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> BorrarHorasLaborales(int id)
        {
            var registro = await _context.HorasLaborales.FindAsync(id);
            if(registro == null)
                return NotFound("Registro no encontrado");

            _context.HorasLaborales.Remove(registro);
            await _context.SaveChangesAsync();
            return Ok("Registro eliminado");
        }
    }
}