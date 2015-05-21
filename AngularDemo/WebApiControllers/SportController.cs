using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;

namespace CobaSport.WebApiControllers
{
    public class SportController : ApiController
    {
        private readonly CobaSportsContext db = new CobaSportsContext();

        public IEnumerable<Sport> Get()
        {
            return db.Sports;
        }

        public IHttpActionResult Get(int id)
        {
            return Ok(db.Sports.Find(id));
        }

        public IHttpActionResult Post([FromBody]Sport value)
        {
            var savedEntity = db.Sports.Add(value);
            db.SaveChanges();

            return Ok(savedEntity.Id);
        }

        public IHttpActionResult Put([FromBody]Sport value) 
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);
            if (value.Id < 1) return BadRequest("Entity does not contains Id.");

            db.Entry(value).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Ok(value);
        }


        public IHttpActionResult Delete(int id)
        {
            var sport = db.Sports.SingleOrDefault(x => x.Id == id);
            db.Sports.Remove(sport);
            db.SaveChanges();
            return Ok();
        }
    }
}
