using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionDeAsistencia.Modelos
{
    public class HorasLaborales
    {
        [Key]
        public int RegistroID { get; set; }

        [ForeignKey("Usuario")]
        public int ProfesorID { get; set; }

        public Usuario Profesor { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public DateTime HoraInicio { get; set; }

        [Required]
        public DateTime HoraFin { get; set; }

        // Calculado como diferencia entre hora fin y hora inicio en horas
        public double TotalHoras { get; set; }
    }
}