namespace GestionDeAsistencia.Dtos.HorasLaboradas
{
    public class RegistrarHorasLaboradas
    {
        public int ProfesorID { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
    }
}