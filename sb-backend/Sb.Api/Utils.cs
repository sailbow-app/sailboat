﻿using Microsoft.AspNetCore.Http;

using Newtonsoft.Json;

using Sb.Api.Models;
using Sb.OAuth2;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Sb.Api
{
    internal static class Utils
    {
        public static List<Claim> AddIfValid(this List<Claim> claims, string type, string value)
        {
            if (value != null && !string.IsNullOrWhiteSpace(type))
                claims.Add(new Claim(type, value));
            return claims;
        }

        public static string GetClaim(this HttpContext context, string type)
        {
            return context.User.Claims.FirstOrDefault(c => c.Type == type)?.Value;
        }

        public static string GetHeader(this HttpContext context, string name)
        {
            return context.Request.Headers[name].ToString();
        }

        public static TokenBase GetProviderTokens(this HttpContext context)
        {
            string providerTokens = context.GetClaim(CustomClaimTypes.ProviderTokens);

            if (!string.IsNullOrWhiteSpace(providerTokens))
            {
                return JsonConvert.DeserializeObject<TokenBase>(providerTokens);
            }
            return null;
        }

        public static IdentityProvider? GetIdentityProvider(this HttpContext context)
        {
            string providerString = context.GetClaim(CustomClaimTypes.Provider);

            if (Enum.TryParse(providerString, out IdentityProvider provider))
                return provider;

            return null;
        }

        public static AuthorizedUser GetUserFromClaims(this HttpContext context)
        {
            return new AuthorizedUser
            {
                Id = context.GetClaim(CustomClaimTypes.Id),
                Email = context.GetClaim(ClaimTypes.Email),
                Name = context.GetClaim(ClaimTypes.Name),
                Picture = context.GetClaim(CustomClaimTypes.Picture)
            };
        }
    }
}