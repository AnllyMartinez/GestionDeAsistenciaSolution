using System.ComponentModel.DataAnnotations;

namespace GestionDeAsistencia.Modelos
{
    public class Rol
    {
        [Key]
        public int RolID { get; set; }

        [Required]
        public string NombreRol { get; set; }

        public string Descripcion { get; set; }
    }
}