namespace GestionDeAsistencia.Dtos.Usuario
{
    public class ActualizarUsuarioDto
    {
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Email { get; set; }
        public int? RolID { get; set; }
    }
}
