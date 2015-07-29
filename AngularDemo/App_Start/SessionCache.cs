using System;
using System.Runtime.Caching;
using CobaSports.Models.oauth;

namespace CobaSports
{
    public static class SessionCache
    {
        private static MemoryCache cache { get; set; }
        private static readonly CacheItemPolicy policy = new CacheItemPolicy() {SlidingExpiration = new TimeSpan(0, 1, 0, 0)};

        static SessionCache()
        {
            cache = new MemoryCache("SessionCache");
        }

        public static void AddOrUpdate(ServerSessionObject serverSessionObject)
        {
            if (cache.Contains(serverSessionObject.sessionId))
                cache.Remove(serverSessionObject.sessionId);

            cache.Add(serverSessionObject.sessionId,serverSessionObject,policy);
        }

        public static ServerSessionObject GetServerSessionObject(string sessionId)
        {
            if (sessionId == null) return null;
            var serverSessionObject = (ServerSessionObject)cache.Get(sessionId);
            return serverSessionObject;
        }

        public static ClientSessionObject GetClientSessionObject(string sessionId)
        {
            var serverSessionObject = GetServerSessionObject(sessionId);
            if (serverSessionObject == null) return null;

            var clientSessionObject = new ClientSessionObject();
            clientSessionObject.token = serverSessionObject.token;
            clientSessionObject.sessionId = serverSessionObject.sessionId;
            clientSessionObject.playerId = serverSessionObject.player != null ? serverSessionObject.player.Id : (int?)null;
            
            return (clientSessionObject);
        }

        public static bool Remove(string sessionId)
        {
            if (sessionId == null) return false;
            if (!cache.Contains(sessionId)) return false;

            cache.Remove(sessionId);
            return true;
        }

    }
}