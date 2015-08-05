using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.OData;
using CobaSports.Models;

namespace CobaSports.Controllers
{
    [AuthWebApi("GET","POST")]
    public class SportsController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/Sports
        [EnableQuery]
        public IQueryable<Sport> GetSports()
        {
            return db.Sports;
        }

        // GET: odata/Sports(5)
        [EnableQuery]
        public SingleResult<Sport> GetSport([FromODataUri] int key)
        {
            return SingleResult.Create(db.Sports.Where(sport => sport.Id == key));
        }

        // PUT: odata/Sports(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Sport> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Sport sport = await db.Sports.FindAsync(key);
            if (sport == null)
            {
                return NotFound();
            }

            patch.Put(sport);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SportExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sport);
        }

        // POST: odata/Sports
        public async Task<IHttpActionResult> Post(Sport sport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Sports.Add(sport);
            await db.SaveChangesAsync();

            return Created(sport);
        }

        // PATCH: odata/Sports(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Sport> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Sport sport = await db.Sports.FindAsync(key);
            if (sport == null)
            {
                return NotFound();
            }

            patch.Patch(sport);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SportExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sport);
        }

        // DELETE: odata/Sports(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Sport sport = await db.Sports.FindAsync(key);
            if (sport == null)
            {
                return NotFound();
            }

            db.Sports.Remove(sport);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SportExists(int key)
        {
            return db.Sports.Count(e => e.Id == key) > 0;
        }
    }
}
