using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;
using System;

namespace CobaEnrollments.WebApiControllers
{
    public class MeetingPlayerController : ApiController
    {
        private readonly CobaSportsContext db;

        public MeetingPlayerController()
        {
            db = new CobaSportsContext();    
        }

        [Route("api/meetingplayer/player/{playerId}")]
        public IEnumerable<MeetingPlayer> GetMeetingpPlayerByPlayerId(int playerId)
        {
            return db.MeetingPlayers.Where(x=>x.PlayerId == playerId);
        }

        [Route("api/meetingplayer/meeting/{meetingId}")]
        public IEnumerable<MeetingPlayer> GetMeetingPlayersByMeetingId(int meetingId)
        {
            return db.MeetingPlayers.Where(x => x.MeetingId == meetingId);
        }

        public MeetingPlayer Get(int id)
        {
            return db.MeetingPlayers.Find(id);
        }

        public MeetingPlayer Post([FromBody]MeetingPlayer value)
        {
            value.Timestamp = DateTime.Now;
            db.MeetingPlayers.Add(value);
            db.SaveChanges();

            return value;
        }

        public void Put([FromBody]MeetingPlayer value)
        {
            value.Timestamp = DateTime.Now;
            db.Entry(value).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
        }

        public void Delete(int id)
        {
            var meetingPlayer = db.MeetingPlayers.SingleOrDefault(x => x.Id == id);
            db.MeetingPlayers.Remove(meetingPlayer);
            db.SaveChanges();
        }
    }
}
