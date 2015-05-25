﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using CobaSports.Models;

namespace CobaSports.Controllers
{
    public class SportPlayersController : ODataController
    {
        private CobaSportsContext db = new CobaSportsContext();

        // GET: odata/SportPlayers
        [EnableQuery]
        public IQueryable<SportPlayer> GetSportPlayers()
        {
            return db.SportPlayer;
        }

        // GET: odata/SportPlayers(5)
        [EnableQuery]
        public SingleResult<SportPlayer> GetSportPlayer([FromODataUri] int key)
        {
            return SingleResult.Create(db.SportPlayer.Where(sportPlayer => sportPlayer.Id == key));
        }

        // PUT: odata/SportPlayers(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<SportPlayer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SportPlayer sportPlayer = await db.SportPlayer.FindAsync(key);
            if (sportPlayer == null)
            {
                return NotFound();
            }

            patch.Put(sportPlayer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SportPlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sportPlayer);
        }

        // POST: odata/SportPlayers
        public async Task<IHttpActionResult> Post(SportPlayer sportPlayer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SportPlayer.Add(sportPlayer);
            await db.SaveChangesAsync();

            return Created(sportPlayer);
        }

        // PATCH: odata/SportPlayers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<SportPlayer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SportPlayer sportPlayer = await db.SportPlayer.FindAsync(key);
            if (sportPlayer == null)
            {
                return NotFound();
            }

            patch.Patch(sportPlayer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SportPlayerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(sportPlayer);
        }

        // DELETE: odata/SportPlayers(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            SportPlayer sportPlayer = await db.SportPlayer.FindAsync(key);
            if (sportPlayer == null)
            {
                return NotFound();
            }

            db.SportPlayer.Remove(sportPlayer);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SportPlayers(5)/Player
        [EnableQuery]
        public SingleResult<Player> GetPlayer([FromODataUri] int key)
        {
            return SingleResult.Create(db.SportPlayer.Where(m => m.Id == key).Select(m => m.Player));
        }

        // GET: odata/SportPlayers(5)/Sport
        [EnableQuery]
        public SingleResult<Sport> GetSport([FromODataUri] int key)
        {
            return SingleResult.Create(db.SportPlayer.Where(m => m.Id == key).Select(m => m.Sport));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SportPlayerExists(int key)
        {
            return db.SportPlayer.Count(e => e.Id == key) > 0;
        }
    }
}