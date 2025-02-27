using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionDeAsistencia.Modelos
{
    public class Asistencia
    {
        [Key]
        public int AsistenciaID { get; set; }

        [ForeignKey("Usuario")]
        public int UsuarioID { get; set; }

        public Usuario Usuario { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        // Valores: "Entrada" o "Salida"
        [Required]
        public string Tipo { get; set; }

        // Usuario que realizo el registro
        public int RegistradoPor { get; set; }
    }
}