using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<IHttpActionResult> Get(int id)
        {
            var data = await db.Sports.FindAsync(id);
            return Ok(data);
        }

        public async Task<IHttpActionResult> Post([FromBody]Sport value)
        {
            var savedEntity = db.Sports.Add(value);
            await db.SaveChangesAsync();

            return Created<Sport>("api/sports/" + savedEntity.Id, value);
        }

        public async Task<IHttpActionResult> Put([FromBody]Sport value) 
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);
            if (value.Id < 1) return BadRequest("Entity does not contains Id.");

            db.Entry(value).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok();
        }


        public async Task<IHttpActionResult> Delete(int id)
        {
            var record = await db.Sports.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (record != null)
            {
                db.Sports.Remove(record);
                await db.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }
    }
}
