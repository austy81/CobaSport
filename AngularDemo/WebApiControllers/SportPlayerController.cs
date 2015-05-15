using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Http;
using CobaSports.Models;

namespace CobaSports.WebApiControllers
{
    public class SportPlayerController : ApiController
    {
        private readonly CobaSportsContext db;

        public SportPlayerController()
        {
            db = new CobaSportsContext();    
        }

        public IEnumerable<SportPlayer> Get(int id)
        {
            return db.SportPlayer.Where(x=>x.SportId == id).ToArray();
        }

        [Route("api/sportplayer/sport/{sportId}/players")]
        public IEnumerable<Player> GetPlayersBySportId(int sportId)
        {
            return db.Players.Where(x => x.SportPlayer.Any(y => y.SportId == sportId));
        }

        [Route("api/sportplayer/player/{playerId}/sports")]
        public IEnumerable<Sport> GetSportsByPlayerId(int playerId)
        {
            return db.Sports.Where(x => x.SportPlayer.Any(y => y.PlayerId == playerId));
        }

        public void Post([FromBody]SportPlayer value)
        {
            db.SportPlayer.Add(value);
            db.SaveChanges();
        }

        public void Put(int id, [FromBody]string value)
        {
        }

        [Route("api/sportplayer/sport/{sportId}/player/{playerId}")]
        public void Delete(int sportId, int playerId)
        {
            var sportPlayer = db.SportPlayer.Where(x => x.SportId == sportId && x.PlayerId == playerId);
            db.SportPlayer.RemoveRange(sportPlayer);
            db.SaveChanges();
        }
    }
}