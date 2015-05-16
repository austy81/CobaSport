using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;

namespace CobaMeetings.WebApiControllers
{
    public class MeetingController : ApiController
    {
        private readonly CobaSportsContext db;

        public MeetingController()
        {
            db = new CobaSportsContext();    
        }

        public IEnumerable<Meeting> Get()
        {
            var meetings = db.Meetings.OrderByDescending(x=>x.Timestamp).ToArray();
            return meetings;
        }

        public Meeting Get(int id)
        {
            return db.Meetings.Find(id);
        }

        public void Post([FromBody]Meeting value)
        {
            value.Timestamp = value.Timestamp.Date;
            db.Meetings.Add(value);
            db.SaveChanges();
        }

        public void Put(int id, [FromBody]string value)
        {
        }

        public void Delete(int id)
        {
            var Meeting = db.Meetings.SingleOrDefault(x => x.Id == id);
            db.Meetings.Remove(Meeting);
            db.SaveChanges();
        }
    }
}