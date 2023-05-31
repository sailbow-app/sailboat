﻿using Microsoft.AspNetCore.Mvc;

using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    public class UsersController : ApiControllerBase
    {
        public UsersController(
            IRepository repo,
            BoatService boatService)
        {
            _repo = repo;
            _boatService = boatService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUserById(
            Guid userId,
            [FromServices] IUserService userService)
        {
            return Ok(await userService.GetUserById(userId));
        }

        [HttpGet("mates")]
        public async Task<ActionResult<IEnumerable<CrewMember>>> GetMates()
        {
            Guid userId = HttpContext.GetUserId().GetValueOrDefault();
            var boats = await _boatService.GetAllBoats(userId);
            IEnumerable<Guid> mateUserIds = boats
                .SelectMany(boat => boat.Crew
                    .Where(cm => cm.UserId != userId))
                .Select(cm => cm.UserId);

            var users = await _repo.GetAsync<User>(u => mateUserIds.Contains(u.Id));
            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<User>>> SearchUsers(string q)
        {
            var searchResults = await _repo
                .GetAsync<User>(u => u.Email.Contains(q) || u.Name.Contains(q));
            return Ok(searchResults);
        }

        private readonly IRepository _repo;
        private readonly BoatService _boatService;
    }
}
