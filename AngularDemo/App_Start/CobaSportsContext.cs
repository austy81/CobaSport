using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Text;
using CobaSports.Models;

namespace CobaSports
{
    public class CobaSportsContext : DbContext
    {

        public CobaSportsContext()
            : base("CobaSports")
        {
            Configuration.ProxyCreationEnabled = false;

            if (!Database.Exists())
                Database.Create();
        }

        public DbSet<MeetingPlayer> MeetingPlayers { get; set; }
        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Sport> Sports { get; set; }
        public DbSet<SportPlayer> SportPlayers { get; set; }
        public DbSet<UserInfoLocal> UserInfoLocals { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public override int SaveChanges()
        {
            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                var sb = new StringBuilder();

                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }

                throw new DbEntityValidationException(
                    "Entity Validation Failed - errors follow:\n" +
                    sb, ex
                    ); // Add the original exception as the innerException
            }
        }
    }
}