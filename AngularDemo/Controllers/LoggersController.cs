using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;
using CobaSports.Models;

namespace CobaSports.Controllers
{

    public class LoggersController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/Logs
        [EnableQuery]
        public IQueryable<Logger> GetLogs()
        {
            return db.Logger;
        }

        // GET: odata/Logs(5)
        [EnableQuery]
        public SingleResult<Logger> GetLog([FromODataUri] int key)
        {
            return SingleResult.Create(db.Logger.Where(log => log.Id == key));
        }

        // PUT: odata/Logs(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Logger> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Logger log = await db.Logger.FindAsync(key);
            if (log == null)
            {
                return NotFound();
            }

            patch.Put(log);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(log);
        }

        // POST: odata/Logs
        public async Task<IHttpActionResult> Post(Logger log)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Logger.Add(log);
            await db.SaveChangesAsync();

            return Created(log);
        }

        // PATCH: odata/Logs(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Logger> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Logger log = await db.Logger.FindAsync(key);
            if (log == null)
            {
                return NotFound();
            }

            patch.Patch(log);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(log);
        }

        // DELETE: odata/Logs(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Logger log = await db.Logger.FindAsync(key);
            if (log == null)
            {
                return NotFound();
            }

            db.Logger.Remove(log);
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

        private bool LogExists(int key)
        {
            return db.Logger.Count(e => e.Id == key) > 0;
        }
    }
}
