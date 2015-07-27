using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.OData;
using CobaSports.Models;

namespace CobaSports.Controllers
{
    [AuthWebApi("GET")]
    public class MeetingsController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/Meetings
        [EnableQuery(MaxExpansionDepth = 3)]
        public IQueryable<Meeting> GetMeetings()
        {
            return db.Meetings;
        }

        // GET: odata/Meetings(5)
        [EnableQuery]
        public SingleResult<Meeting> GetMeeting([FromODataUri] int key)
        {
            return SingleResult.Create(db.Meetings.Where(meeting => meeting.Id == key));
        }

        // PUT: odata/Meetings(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Meeting> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Meeting meeting = await db.Meetings.FindAsync(key);
            if (meeting == null)
            {
                return NotFound();
            }

            patch.Put(meeting);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meeting);
        }

        // POST: odata/Meetings
        public async Task<IHttpActionResult> Post(Meeting meeting)
        {
            meeting.Timestamp = meeting.Timestamp.AddHours(12); //Dirty trick to work with UTC times
            meeting.Timestamp = meeting.Timestamp.Date;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Meetings.Add(meeting);
            await db.SaveChangesAsync();

            return Created(meeting);
        }

        // PATCH: odata/Meetings(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Meeting> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Meeting meeting = await db.Meetings.FindAsync(key);
            if (meeting == null)
            {
                return NotFound();
            }

            patch.Patch(meeting);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meeting);
        }

        // DELETE: odata/Meetings(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Meeting meeting = await db.Meetings.FindAsync(key);
            if (meeting == null)
            {
                return NotFound();
            }

            db.Meetings.Remove(meeting);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Meetings(5)/MeetingPlayer
        [EnableQuery]
        public IQueryable<MeetingPlayer> GetMeetingPlayer([FromODataUri] int key)
        {
            return db.Meetings.Where(m => m.Id == key).SelectMany(m => m.MeetingPlayers);
        }

        // GET: odata/Meetings(5)/Sport
        [EnableQuery]
        public SingleResult<Sport> GetSport([FromODataUri] int key)
        {
            return SingleResult.Create(db.Meetings.Where(m => m.Id == key).Select(m => m.Sport));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MeetingExists(int key)
        {
            return db.Meetings.Count(e => e.Id == key) > 0;
        }
    }
}
