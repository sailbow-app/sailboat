﻿namespace Sb.OAuth2
{
    public class TokenResponseBase
    {
        internal TokenResponseBase() { }
        public string AccessToken { get; set; }
        public string ExpiresIn { get; set; }
        public string Scope { get; set; }
        public string TokenType { get; set; }
    }
}