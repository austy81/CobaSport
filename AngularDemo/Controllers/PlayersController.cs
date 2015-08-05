using System.Collections.Generic;
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
    public class PlayersController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/Players
        [EnableQuery(MaxExpansionDepth = 3)]
        public IQueryable<Player> GetPlayers()
        {
            return db.Players;
        }

        // GET: odata/Players(5)
        [EnableQuery]
        public SingleResult<Player> GetPlayer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Players.Where(player => player.Id == key));
        }

        // PUT: odata/Players(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Player> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Player player = await db.Players.FindAsync(key);
            if (player == null)
            {
                return NotFound();
            }

            patch.Put(player);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(player);
        }

        // POST: odata/Players
        public async Task<IHttpActionResult> Post(Player player)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Players.Add(player);
            await db.SaveChangesAsync();

            return Created(player);
        }

        // PATCH: odata/Players(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Player> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Player player = await db.Players.FindAsync(key);
            if (player == null)
            {
                return NotFound();
            }

            patch.Patch(player);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(player);
        }

        // DELETE: odata/Players(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Player player = await db.Players.FindAsync(key);
            if (player == null)
            {
                return NotFound();
            }

            IEnumerable<UserInfoLocal> userInfoes = db.LocalUserInfos.Where(x => x.PlayerId == player.Id);
            db.LocalUserInfos.RemoveRange(userInfoes);

            db.Players.Remove(player);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Players(5)/MeetingPlayer
        [EnableQuery]
        public IQueryable<MeetingPlayer> GetMeetingPlayer([FromODataUri] int key)
        {
            return db.Players.Where(m => m.Id == key).SelectMany(m => m.MeetingPlayers);
        }

        // GET: odata/Players(5)/SportPlayer
        [EnableQuery]
        public IQueryable<SportPlayer> GetSportPlayer([FromODataUri] int key)
        {
            return db.Players.Where(m => m.Id == key).SelectMany(m => m.SportPlayers);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PlayerExists(int key)
        {
            return db.Players.Count(e => e.Id == key) > 0;
        }
    }
}
