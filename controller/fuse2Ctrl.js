personaFusion
.controller('fuse2Ctrl', function($filter, $route, $routeParams, $location){
  this.result = {"error": "", "personae": []};
  this.personae_names = personae_names;
  this.personaeByName = personaeByName;
  this.arcanaRank = arcanaRank;

  this.p1 = {};
  this.p2 = {};

  this.range99 = function(min) {
    var range = [];
    for (var i = min; i < 100; i++) {
      range.push(i);
    }
    return range;
  };

  this.Fuse = function() {
    $location.url('/fusion/normal/' + this.p1.name + '/' + this.p2.name);
  }

  this.Fuse2 = function() {
    this.result = {"error": "", "personae": []};
    if (this.p1.name == this.p2.name) {
        this.result.error = "Invalid same Persona fusion.";
	return 0;
    }
    p1 = this.p1;
    p2 = this.p2;
    var bbb_ = [p1.name, p2.name].sort();
    aaa = $filter('filter')(specialCombos, function(x) { var ccc = x.sources; ccc.sort(); return angular.equals(bbb_, ccc)});
    if (aaa.length) {
      this.result.personae.push(personaeByName[aaa[0].result]);
      return 0;
    }
    else {
      var level = Math.floor((p1.level + p2.level) / 2);
      var bbb_ = [p1.arcana, p2.arcana].sort();
      var bbb = $filter('filter')(arcana2Combos, function(x) {var ccc = x.source; ccc.sort(); return angular.equals(ccc, bbb_);});
      if (bbb.length) {
        var arcana = bbb[0].result;
	var personae = personaeByArcana[arcana];

        for (var i = 0, persona = null; persona = personae[i]; i++) {
          if (persona.level > level) {
	           if (persona.special) continue;
             break;
          }
        }

	if (i >= personae.length) {
	  i = personae.length - 1;
	}
        if (p1.arcana == p2.arcana) {
          i--;
        }
	while ( i >= 0 && (personae[i].special || personae[i] == p1 || personae[i] == p2)) i--;

	if (i < 0) {
	  this.result.error = personae[0].name + ' is the first Persona of the ' + arcana + ' Arcana';
	  return 0;
	}
	this.result.personae.push(personae[i]);
	return 0;
      }
      else {
        this.result.error = "Invalid Arcana combination."
	return 0;
      }
    }
  }

  if(personaeByName[$routeParams.p1] && personaeByName[$routeParams.p2]){
    this.p1 = personaeByName[$routeParams.p1];
    this.p2 = personaeByName[$routeParams.p2];
    this.Fuse2();
  }
});