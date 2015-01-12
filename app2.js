const personaeByName = (function() {
  var personaeByName_ = {};
  for (var i = 0, persona = null; persona = personae[i]; i++) {
    personaeByName_[persona.name] = persona;
  }
  return personaeByName_;
})();

const personaeByArcana = (function() {
  var personaeByArcana_ = {};
  for (var i = 0, persona = null; persona = personae[i]; i++) {
    if (!personaeByArcana_[persona.arcana]) {
      personaeByArcana_[persona.arcana] = [];
    }
    personaeByArcana_[persona.arcana].push(persona);
  }
  return personaeByArcana_;
})();

const arcanaRank = (function() {
  var arcanaRank_ = {};
  var rank = 0;
  var lastArcana = null;
  for (var i = 0, persona = null; persona = personae[i]; i++) {
    if (persona.arcana == lastArcana) continue;
    lastArcana = persona.arcana;
    arcanaRank_[persona.arcana] = rank++;
  }
  return arcanaRank_;
})();

const personae_names = (function() {
  var personae_names_ = []
  for (var i = 0, persona = null; persona = personae[i]; i++) {
    if (persona.name != "Izanagi-no-Okami") personae_names_.push(persona.name);
  }
  personae_names_.sort(function (a, b) { return personaeByName[a].level - personaeByName[b].level || arcanaRank[personaeByName[a].arcana] -  arcanaRank[personaeByName[b].arcana]; });
  return personae_names_;
})();

function Ctrl1() {
  this.lalala = {"name": "-", "level": "-", "arcana": "-"};
  this.personae_names = personae_names;
  this.personaeByName = personaeByName;
  this.arcanaRank = arcanaRank;
  this.range99 = function(min) {
    var range = [];
    for (var i = min; i < 100; i++) {
      range.push(i);
    }
    return range;
  };
  this.Fuse2 = function() {
    if (this.p1.name == this.p2.name) {
        this.lalala = {"name": "Invalid same Persona fusion.", "level": "-", "arcana": "-"};
	return 0;
    }
    p1 = personaeByName[this.p1.name];
    p2 = personaeByName[this.p2.name];
    var bbb_ = [p1.name, p2.name].sort();
    aaa = angular.Array.filter(specialCombos, function(x) { var ccc = x.sources; ccc.sort(); return angular.equals(bbb_, ccc)});
    if (aaa.length) {
      this.lalala = personaeByName[aaa[0].result];
      return 0;
    }
    else {
      var level = 1 + Math.floor((p1.level + p2.level) / 2);
      var bbb_ = [p1.arcana, p2.arcana].sort();
      var bbb = angular.Array.filter(arcana2Combos, function(x) {var ccc = x.source; ccc.sort(); return angular.equals(ccc, bbb_);});
      if (bbb.length) {
        var arcana = bbb[0].result;
	var personae = personaeByArcana[arcana];

        for (var i = 0, persona = null; persona = personae[i]; i++) {
          if (persona.level >= level) {
	    if (persona.special) continue;
            break;
          }
        }
      
	if (i >= personae.length) {
	  i = personae.length - 1;
	}
        //if (p1.arcana == p2.arcana) {
          //i--;
        //}
	while ( i >= 0 && (personae[i].special || personae[i] == p1 || personae[i] == p2)) i--;

	if (i < 0) {
	  this.lalala = {"name": personae[0].name + ' is the first Persona of the ' + arcana + ' Arcana', "level": "-", "arcana": "-"};
	  return 0;
	}
	this.lalala = personae[i];
	return 0;
      }
      else {
        this.lalala = {"name": "Invalid Arcana combination.", "level": "-", "arcana": "-"};
	return 0;
      }
    }
  }
}
