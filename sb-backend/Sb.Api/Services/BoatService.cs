﻿using Ardalis.GuardClauses;

using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Sb.Api.Models;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;
using Sb.OAuth2;

namespace Sb.Api.Services
{
    public class BoatService
    {
        private readonly SbContext _db;
        private readonly HttpContext _context;
        private readonly IAuthorizationService _authService;
        private readonly IMapper _mapper;

        public BoatService(
            SbContext db,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authService,
            IMapper mapper)
        {
            _db = db;
            _context = contextAccessor.HttpContext;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<Boat> CreateBoat(Boat boat)
        {
            Guard.Against.Null(boat, nameof(boat));
            await _db.Boats.AddAsync(boat);
            await _db.SaveChangesAsync();
            return boat;
        }

        public async Task<BoatDto> GetBoatById(Guid boatId)
        {
            Boat boat = await _db.Boats
                .Where(b => b.Id == boatId)
                .Include(b => b.Modules)
                .FirstOrDefaultAsync();

            Guard.Against.EntityMissing(boat, nameof(boatId));

            BoatDto b = (BoatDto)boat;
            b.Role = b.Crew
                .First(cm => cm.UserId == _context.GetUserId())
                .Role;

            return b;
        }

        public async Task UpdateBoatDetails(Guid boatId, UpdateBoatDetailsRequest edits)
        {
            Boat boat = await _db.Boats.FindAsync(boatId);
            boat.Description = edits.Description;
            boat.Name = string.IsNullOrWhiteSpace(edits.Name) ? boat.Name : edits.Name;
            boat.Banner = edits.Banner ?? boat.Banner;
            _db.Update(boat);
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<Boat>> GetAllBoats(Guid userId)
        {
            return await _db.Boats
                .Where(b => b.Crew.Any(cm => cm.UserId == userId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Boat>> GetBoats(Guid userId, int? page, int? perPage, string search = "")
        {
            User user = await _db.Users.FindAsync(userId);
            Guard.Against.EntityMissing(user, nameof(user));

            return await _db.Boats
                .Where(b => b.Crew.Any(cm => cm.UserId == userId))
                .Where(b => search == string.Empty || b.Name.Contains(search))
                .Skip(page.GetValueOrDefault(0))
                .Take(perPage.GetValueOrDefault(10))
                .ToListAsync();
        }

        public async Task<Code> GenerateCodeInvite(Guid boatId, int? expiresUnix)
        {
            Boat boat = await GetBoat(boatId);

            DateTimeOffset offset = expiresUnix.HasValue
                ? DateTimeOffset.FromUnixTimeSeconds(expiresUnix.Value)
                : DateTimeOffset.UtcNow;

            boat.Code = new Code
            {
                Value = Guid.NewGuid().ToString(),
                ExpiresAt = offset.UtcDateTime
            };

            _db.Boats.Update(boat);
            await _db.SaveChangesAsync();
            return boat.Code;
        }

        public async Task<Code> GetCodeInvite(Guid boatId)
        {
            Boat boat = await GetBoat(boatId);
            Guard.Against.EntityMissing(boat.Code, nameof(boat.Code));
            return boat.Code;
        }


        public async Task<Boat> AcceptCodeInvite(Guid boatId, string code)
        {
            Boat boat = await GetBoat(boatId);
            Guard.Against.EntityMissing(boat.Code, nameof(boat.Code));

            AuthorizedUser user = _context.GetUserFromClaims();
            if (boat.Crew.Any(cm => cm.UserId == Guid.Parse(user.Id)))
                throw new ConflictException();

            if (boat.Code.Value != code)
                throw new ValidationException("Code has expired or is invalid");

            boat.Crew.Add(new CrewMember
            {
                UserId = Guid.Parse(user.Id),
                Role = Role.Sailor
            });
            await _db.UpdateAsync(boat);
            return boat;
        }

        public async Task AddCrewMember(Guid boatId, Guid userId, Role role)
        {
            CrewMember crewMember = await _db.CrewMembers
                .Where(cm => cm.BoatId == boatId)
                .Where(cm => cm.UserId == userId)
                .FirstOrDefaultAsync();

            if (crewMember == null)
            {
                crewMember = new CrewMember
                {
                    BoatId = boatId,
                    UserId = userId,
                    Role = role
                };
                await _db.CrewMembers.AddAsync(crewMember);
                await _db.SaveChangesAsync();
            }
        }

        public async Task DeleteCrewMember(Guid boatId, Guid userId)
        {
            await _db.CrewMembers
                .Where(cm => cm.BoatId == boatId)
                .Where(cm => cm.UserId == userId)
                .ExecuteDeleteAsync();
        }

        //public async Task<IEnumerable<Invite>> CreateInvites(Guid boatId, IEnumerable<Invite> invites)
        //{
        //    Guard.Against.Null(invites, nameof(invites));
        //    Boat boat = await GetBoat(boatId);
        //    //var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
        //    //Guard.Against.Forbidden(authResult);

        //    var existingInvites = await _db.GetAsync<Invite>(i => i.BoatId == boatId);
        //    var newInvites = invites
        //        .Where((i) => !existingInvites.Any(ei => ei.BoatId == i.BoatId));
        //    List<Invite> created = new();
        //    foreach (var invite in newInvites)
        //    {
        //        invite.InviterId = _context.GetUserId().Value;
        //        invite.BoatId = boatId;
        //        created.Add(await _db.InsertAsync(invite));
        //    }

        //    return created;
        //}

        //public async Task<InviteDetails> GetInviteById(Guid boatId, Guid inviteId)
        //{
        //    Invite invite = await _db.GetByIdAsync<Invite>(inviteId);
        //    Guard.Against.EntityMissing(invite, nameof(invite));
        //    Boat boat = await _db.GetByIdAsync<Boat>(boatId);
        //    Guard.Against.EntityMissing(boat, nameof(boat));
        //    CrewMember captain = boat.Crew.First(cm => cm.Role == Role.Captain);
        //    User captainUserData = await _db.GetByIdAsync<User>(captain.UserId);
        //    return new InviteDetails
        //    {
        //        Id = inviteId.ToString(),
        //        BoatName = boat.Name,
        //        Banner = boat.Banner,
        //        Captain = new CrewMemberWithUserInfo
        //        {
        //            UserId = captain.UserId,
        //            Name = captainUserData.Name,
        //            Role = captain.Role
        //        }
        //    };
        //}

        //public async Task AcceptBoatInvite(Guid boatId, Guid inviteId, string email)
        //{
        //    Boat boat = await GetBoat(boatId);

        //    if (boat.Crew.Any(cm => cm.Email == email))
        //        throw new ConflictException();

        //    Invite invite = await _db.GetByIdAsync<Invite>(inviteId);
        //    Guard.Against.EntityMissing(invite, nameof(invite));
        //    if (invite.Email != email) throw new ForbiddenResourceException();

        //    boat.Crew.Add(new CrewMember
        //    {
        //        UserId = _context.GetUserId().Value,
        //        Role = invite.Role,
        //        Info = string.Empty
        //    });

        //    await _db.UpdateAsync(boat);
        //    await _db.DeleteByIdAsync<Invite>(invite.Id);
        //}

        //public async Task<IEnumerable<Invite>> GetPendingInvites(Guid boatId)
        //{
        //    return await _db.GetAsync<Invite>(i => i.BoatId == boatId);
        //}

        private async Task<Boat> GetBoat(Guid boatId)
        {
            Boat boat = await _db.Boats.FindAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));
            return boat;
        }
    }
}
