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
var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};
  this.Fuse3 = function() {
    var p = [this.p1, p2 = this.p2, p3 = this.p3].sort(function (a, b) { return a.level - b.level || arcanaRank[b.arcana] -  arcanaRank[a.arcana]; });
    var pn = [p[0].name, p[1].name, p[2].name].sort();
    var text = "p1: " + p[0].name + " (" + p[0].level + " " + p[0].arcana + ")\n" + 
               "p2: " + p[1].name + " (" + p[1].level + " " + p[1].arcana + ")\n" +
               "p3: " + p[2].name + " (" + p[2].level + " " + p[2].arcana + ")";
    //alert(text);
    if (arrayUnique(pn).length < 3) {
      this.lalala = {"name": "Invalid same Persona fusion.", "level": "-", "arcana": "-"};
      return 0;
    }
    aaa = angular.Array.filter(specialCombos, function(x) { var ccc = x.sources; ccc.sort(); return angular.equals(pn, ccc)});
    if (aaa.length) {
      this.lalala = personaeByName[aaa[0].result];
      return 0;
    }
    var bbb_ = [p[0].arcana, p[1].arcana].sort();
    var bbb = angular.Array.filter(arcana2Combos, function(x) {var ccc = x.source; ccc.sort(); return angular.equals(ccc, bbb_);});
    if (bbb.length) {
      var ddd_ = [bbb[0].result, p[2].arcana].sort();
      if (arrayUnique(ddd_).length == 1) {
        var ddd = [{"result": ddd_[0], "source": ddd_}];
      }
      else {
        var ddd = angular.Array.filter(arcana3Combos, function(x) {var ccc = x.source; ccc.sort(); return angular.equals(ccc, ddd_);});
      }

      if (ddd.length) {
        /* I feel cheated. DoubleJump guide lied to me. The level is NOT calculated by the CURRENT level of the ingredients, but the game uses the DEFAULT level. Example: Scathach Lv99 + Pixie Lv2 + Orobas Lv 9 should fusion into Clotho, instead I get Fortuna.  */
        //var level = 5 + Math.floor( (p[0].level + p[1].level + p[2].level) / 3 );
        var level = 5 + Math.floor( (personaeByName[p[0].name].level + personaeByName[p[1].name].level + personaeByName[p[2].name].level) / 3 );
        
        var arcana = ddd[0].result;
        var personae = personaeByArcana[arcana];

        var found = false;
        for (var i = 0, persona = null; persona = personae[i]; i++) {
          if (persona.level >= level) {
            if (persona.special) continue;
            found = true;
            break;
          }
        }
        if (!found) {
          this.lalala = {"name":"Invalid result", "arcana":"?", "level":"?"};
          return 0;
        }
        if (i>=personae.length && personae[personae.length-1].special) i = personae.length - 2;

        // In same arcana fusion, skip over the ingredients.
        if (p[0].arcana == arcana
            && p[1].arcana == arcana
            && p[2].arcana == arcana) {
          while (p[0].name == personae[i].name
                 || p[1].name == personae[i].name
                 || p[2].name == personae[i].name) {
            i++;
            if (!personae[i]) {
              this.lalala = {"arcana":"Invalid result", "name":"#", "level":"#"};
              return 0;
            }
          }
        }

	if (i < 0) {
	  this.lalala = {"name": personae[0].name + ' is the first Persona of the ' + arcana + ' Arcana', "level": "-", "arcana": "-"};
	  return 0;
	}

        this.lalala = personae[i];
        //this.lalala = {"name": "(" + p[0].arcana + " x " + p[1].arcana + " = " + bbb[0].result + ") x " + p[2].arcana + " = " + arcana, "level": "-", "arcana": "-"};
        return 0;
      }
      else {
        this.lalala = {"name": "Weird. This should NOT happen", "level": "-", "arcana": "-"};
        return 0;
      }
    }
    else {
      this.lalala = {"name": "Invalid arcana combination (" + p[0].name + " x " + p[1].name + ").", "level": "-", "arcana": "-"};
      return 0;
    }
  }
}
