﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using Sb.Data.Models;

namespace Sb.Data;
public class SbContext : DbContext
{
    public SbContext() : base() { }
    public SbContext(DbContextOptions<SbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<CrewMember> CrewMembers { get; set; }
    public DbSet<Boat> Boats { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<ModuleOption> ModuleOptions { get; set; }
    public DbSet<ModuleSettings> ModuleSettings { get; set; }
    //public DbSet<DateModuleOption> DateModuleOptions { get; set; }
    //public DbSet<LocationModuleOption> LocationModuleOptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
    }
}