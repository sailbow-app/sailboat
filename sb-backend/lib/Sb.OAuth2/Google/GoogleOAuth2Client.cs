﻿using System;
using System.Threading.Tasks;

using Newtonsoft.Json;

using RestSharp;
using RestSharp.Authenticators.OAuth2;

namespace Sb.OAuth2
{
    public class GoogleOAuth2Client : OAuth2Client
    {
        public GoogleOAuth2Client(ClientCredentials credentials) : base(
            new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            credentials)
        {
            Defaults.Scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
        }

        public override async Task<AuthorizedUser> GetAuthorizedUserAsync(string token)
        {
            RestClient client = CreateGoogleRestClient("https://www.googleapis.com", token);
            RestRequest request = new("oauth2/v3/userinfo", Method.Get);
            RestResponse res = await client.ExecuteAsync(request);
            EnsureSuccess(res);
            return JsonConvert.DeserializeObject<GoogleUserInfo>(res.Content, SerializerSettings);
        }

        public override async Task RevokeTokenAsync(string token)
        {
            RestClient client = CreateGoogleRestClient("https://oauth2.googleapis.com", token);
            RestRequest request = new("revoke", Method.Get);
            request.AddParameter("token", token);
            await client.ExecuteAsync(request);
        }

        private RestClient CreateGoogleRestClient(string baseUrl, string accessToken)
        {
            RestClientOptions options = new(baseUrl)
            {
                MaxTimeout = TimeSpan.FromSeconds(60).Milliseconds,
                Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(accessToken, "Bearer")
            };

            return new RestClient(options);
        }
    }
}
