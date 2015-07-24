﻿using System;
using System.Runtime.Caching;
using CobaSports.Models.oauth;

namespace CobaSports.App_Start
{
    public class SessionCache
    {
        private static MemoryCache cache { get; set; }
        private static readonly CacheItemPolicy policy = new CacheItemPolicy() {SlidingExpiration = new TimeSpan(0, 1, 0, 0)};

        static SessionCache()
        {
            cache = new MemoryCache("SessionCache");
        }

        public static void AddOrUpdate(Token token)
        {
            if (cache.Contains(token.token))
                cache.Remove(token.token);

            cache.Add(token.token,token,policy);
        }

        public static Token Get(string tokenValue)
        {
            return (Token)cache.Get(tokenValue);
        }

    }
}