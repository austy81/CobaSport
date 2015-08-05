using System;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.OData;
using CobaSports.Models;

namespace CobaSports.Controllers
{
    [AuthWebApi("GET","POST","PUT")]
    public class MeetingPlayersController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/MeetingPlayers
        [EnableQuery]
        public IQueryable<MeetingPlayer> GetMeetingPlayers()
        {
            return db.MeetingPlayers;
        }

        // GET: odata/MeetingPlayers(5)
        [EnableQuery]
        public SingleResult<MeetingPlayer> GetMeetingPlayer([FromODataUri] int key)
        {
            return SingleResult.Create(db.MeetingPlayers.Where(meetingPlayer => meetingPlayer.Id == key));
        }

        // PUT: odata/MeetingPlayers(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<MeetingPlayer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MeetingPlayer meetingPlayer = await db.MeetingPlayers.FindAsync(key);
            if (meetingPlayer == null)
            {
                return NotFound();
            }


            patch.TrySetPropertyValue("Timestamp", DateTime.Now);
            patch.Put(meetingPlayer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingPlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meetingPlayer);
        }

        // POST: odata/MeetingPlayers
        public async Task<IHttpActionResult> Post(MeetingPlayer meetingPlayer)
        {
            meetingPlayer.Timestamp = DateTime.Now;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            db.MeetingPlayers.Add(meetingPlayer);
            await db.SaveChangesAsync();

            return Created(meetingPlayer);
        }

        // PATCH: odata/MeetingPlayers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<MeetingPlayer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MeetingPlayer meetingPlayer = await db.MeetingPlayers.FindAsync(key);
            if (meetingPlayer == null)
            {
                return NotFound();
            }

            patch.Patch(meetingPlayer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingPlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meetingPlayer);
        }

        // DELETE: odata/MeetingPlayers(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            MeetingPlayer meetingPlayer = await db.MeetingPlayers.FindAsync(key);
            if (meetingPlayer == null)
            {
                return NotFound();
            }

            db.MeetingPlayers.Remove(meetingPlayer);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/MeetingPlayers(5)/Meeting
        [EnableQuery]
        public SingleResult<Meeting> GetMeeting([FromODataUri] int key)
        {
            return SingleResult.Create(db.MeetingPlayers.Where(m => m.Id == key).Select(m => m.Meeting));
        }

        // GET: odata/MeetingPlayers(5)/Player
        [EnableQuery]
        public SingleResult<Player> GetPlayer([FromODataUri] int key)
        {
            return SingleResult.Create(db.MeetingPlayers.Where(m => m.Id == key).Select(m => m.Player));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MeetingPlayerExists(int key)
        {
            return db.MeetingPlayers.Count(e => e.Id == key) > 0;
        }
    }
}
