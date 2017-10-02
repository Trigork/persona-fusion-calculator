// Derive data:
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

var personaFusion = angular.module('personaFusionApp', ['ngRoute', 'ngAnimate', 'angularUtils.directives.dirPagination'])
.run(
function($location, $rootScope, $route, $routeParams, appConfig){
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            document.title = appConfig.baseTitle + ' | ' + current.$$route.title;
            if ($routeParams.persona_name){
              document.title += " (" + $routeParams.persona_name + ")"
            }
            if ($routeParams.p1 && $routeParams.p2){
              document.title += " ( " + $routeParams.p1 + " + " + $routeParams.p2;
              if ($routeParams.p3){
                document.title += " + " + $routeParams.p3;
              }
              document.title += " )";
            }
        }
    });

  $rootScope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  }

  $rootScope.goPersona = function ( persona ) {
      $location.path("persona/" + persona.name)
  };

  $rootScope.sort = function(keyname){
        $rootScope.sortKey = keyname;   //set the sortKey to the param passed
        $rootScope.reverse = !$rootScope.reverse; //if true make it false and vice versa
    }

  $rootScope.version = appConfig.version
  $rootScope.versionalias = appConfig.versionalias
});
