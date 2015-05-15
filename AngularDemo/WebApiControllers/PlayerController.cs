using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CobaSports.Models;

namespace CobaSports.WebApiControllers
{
    public class PlayerController : ApiController
    {
        private readonly CobaSportsContext db;

        public PlayerController()
        {
            db = new CobaSportsContext();    
        }

        public IEnumerable<Player> Get()
        {
            return db.Players.ToArray();
        }

        public Player Get(int id)
        {
            return db.Players.Find(id);
        }

        public void Post([FromBody]Player value)
        {
            db.Players.Add(value);
            db.SaveChanges();
        }

        public void Put(int id, [FromBody]string value)
        {
        }

        public void Delete(int id)
        {
            var Player = db.Players.SingleOrDefault(x => x.Id == id);
            db.Players.Remove(Player);
            db.SaveChanges();
        }
    }
}