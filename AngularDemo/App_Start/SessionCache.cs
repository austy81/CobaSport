﻿using System;
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
            if (cache.Contains(serverSessionObject.token))
                cache.Remove(serverSessionObject.token);

            cache.Add(serverSessionObject.token,serverSessionObject,policy);
        }

        public static ServerSessionObject GetServerSessionObject(string token)
        {
            if (token == null) return null;
            var serverSessionObject = (ServerSessionObject)cache.Get(token);
            return serverSessionObject;
        }

        public static ClientSessionObject GetClientSessionObject(string token)
        {
            var serverSessionObject = GetServerSessionObject(token);
            if (serverSessionObject == null) return null;

            var clientSessionObject = new ClientSessionObject();
            clientSessionObject.token = serverSessionObject.token;
            //clientSessionObject.sessionId = serverSessionObject.sessionId;
            clientSessionObject.player = serverSessionObject.player;
            
            return (clientSessionObject);
        }

        public static bool Remove(string token)
        {
            if (token == null) return false;
            if (!cache.Contains(token)) return false;

            cache.Remove(token);
            return true;
        }

    }
}