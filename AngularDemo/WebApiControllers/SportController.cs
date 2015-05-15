using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;

namespace CobaSport.WebApiControllers
{
    public class SportController : ApiController
    {
        private readonly CobaSportsContext db;

        public SportController()
        {
            db = new CobaSportsContext();    
        }

        public IEnumerable<Sport> Get()
        {
            return db.Sports.ToArray();
        }

        public Sport Get(int id)
        {
            return db.Sports.Find(id);
        }

        public void Post([FromBody]Sport value)
        {
            db.Sports.Add(value);
            db.SaveChanges();
        }

        public void Put(int id, [FromBody]string value)
        {
        }

        public void Delete(int id)
        {
            var sport = db.Sports.SingleOrDefault(x => x.Id == id);
            db.Sports.Remove(sport);
            db.SaveChanges();
        }
    }
}
