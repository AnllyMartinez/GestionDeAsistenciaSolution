namespace GestionDeAsistencia.Dtos.Asistencia
{
    public class RegistrarAsistenciaDto
    {
        public int UsuarioID { get; set; }
        public string Tipo { get; set; } // "Entrada" o "Salida"
        public int RegistradoPor { get; set; }
    }
}