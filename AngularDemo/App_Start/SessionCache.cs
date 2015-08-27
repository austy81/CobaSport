using System;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Runtime.Caching;
using CobaSports.Models;
using CobaSports.Models.oauth;

namespace CobaSports
{
    public static class SessionCache
    {
        private static MemoryCache cache { get; set; }
        private static readonly CacheItemPolicy policy = new CacheItemPolicy() {SlidingExpiration = new TimeSpan(0, 1, 0, 0)};
        private static CobaSportsContext db = new CobaSportsContext();

        static SessionCache()
        {
            cache = new MemoryCache("SessionCache");
        }

        public static void AddOrUpdate(ServerSessionObject serverSessionObject)
        {
            AddOrUpdateServerCache(serverSessionObject);
            AddOrUpdateDatabase(serverSessionObject);
        }

        private static void AddOrUpdateDatabase(ServerSessionObject serverSessionObject)
        {
            db.Set<UserInfoLocal>().AddOrUpdate(serverSessionObject.userInfo);
            db.SaveChanges();
        }

        public static void AddOrUpdateServerCache(ServerSessionObject serverSessionObject)
        {
            if (cache.Contains(serverSessionObject.userInfo.Token))
                cache.Remove(serverSessionObject.userInfo.Token);

            cache.Add(serverSessionObject.userInfo.Token, serverSessionObject, policy);            
        }

        public static ServerSessionObject GetServerSessionObject(string token)
        {
            if (token == null) return null;
            var serverSessionObject = (ServerSessionObject)cache.Get(token);
            if (serverSessionObject == null)
            {
                var userInfo = db.UserInfoLocals.SingleOrDefault(x => x.Token == token);
                if (userInfo != null)
                {
                    var player = db.Players.SingleOrDefault(x => x.Id == userInfo.PlayerId);
                    
                    serverSessionObject = new ServerSessionObject
                    {
                        userInfo = userInfo,
                        player = player
                    };
                    AddOrUpdateServerCache(serverSessionObject);
                }

            }
            return serverSessionObject;
        }

        public static ClientSessionObject GetClientSessionObject(string token)
        {
            var serverSessionObject = GetServerSessionObject(token);
            if (serverSessionObject == null) return null;

            var clientSessionObject = new ClientSessionObject();
            clientSessionObject.token = serverSessionObject.userInfo.Token;
            clientSessionObject.player = serverSessionObject.player;
            
            return (clientSessionObject);
        }

        public static bool Remove(string token)
        {
            if (token == null) return false;
            if (!cache.Contains(token)) return false;

            cache.Remove(token);
            var userInfoLocal = db.UserInfoLocals.FirstOrDefault(x => x.Token == token);
            if (userInfoLocal != null)
            {
                userInfoLocal.Token = null;
                db.SaveChanges();
            }

            return true;
        }

    }
}