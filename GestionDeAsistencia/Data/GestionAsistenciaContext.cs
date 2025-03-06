using GestionDeAsistencia.Modelos;
using Microsoft.EntityFrameworkCore;

namespace GestionDeAsistencia.Data
{
    public class GestionAsistenciaContext : DbContext
    {
        public GestionAsistenciaContext(DbContextOptions<GestionAsistenciaContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
    }
}