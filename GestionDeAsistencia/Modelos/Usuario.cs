using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionDeAsistencia.Modelos
{
    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }

        [Required]
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Contraseña { get; set; }

        // Relación con Rol
        [ForeignKey("Rol")]
        public int RolID { get; set; }

        public Rol Rol { get; set; }
    }
}