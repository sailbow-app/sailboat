﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json.Linq;

namespace Sb.Data.Models
{
    [PersistenceModel("Modules")]
    public class Module : EntityBase
    {
        public string BoatId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int? FinalizedOptionId { get; set; }
        public ModuleSettings Settings { get; set; }
        public IEnumerable<ModuleData> Data { get; set; } = Enumerable.Empty<ModuleData>();
    }

    public class ModuleSettings
    {
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }
    }

    [PersistenceModel("ModuleData")]
    public class ModuleData : EntityBase
    {
        public List<string> Votes { get; set; } = new List<string>();
        public string Author { get; set; }
    }

    public class DateModuleData : ModuleData
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
    public enum ModuleType
    {
        Date
    }
}