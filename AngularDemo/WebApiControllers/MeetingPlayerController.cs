using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;

namespace CobaEnrollments.WebApiControllers
{
    public class MeetingPlayerController : ApiController
    {
        private readonly CobaSportsContext db;

        public MeetingPlayerController()
        {
            db = new CobaSportsContext();    
        }

        [Route("api/player/{playerId}/meetings")]
        public IEnumerable<Meeting> GetMeetingsByPlayerId(int playerId)
        {
            return db.Meetings.Where(x=>x.MeetingPlayer.Any(y => y.PlayerId == playerId));
        }

        [Route("api/meeting/{meetingId}/players")]
        public IEnumerable<Player> GetPlayersByMeetingId(int meetingId)
        {
            return db.Players.Where(x => x.MeetingPlayer.Any(y => y.MeetingId == meetingId));
        }

        public MeetingPlayer Get(int id)
        {
            return db.MeetingPlayers.Find(id);
        }

        public void Post([FromBody]MeetingPlayer value)
        {
            db.MeetingPlayers.Add(value);
            db.SaveChanges();
        }

        public void Put(int id, [FromBody]string value)
        {
        }

        public void Delete(int id)
        {
            var Enrollment = db.MeetingPlayers.SingleOrDefault(x => x.Id == id);
            db.MeetingPlayers.Remove(Enrollment);
            db.SaveChanges();
        }
    }
}
