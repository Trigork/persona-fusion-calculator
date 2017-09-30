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

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //

var personaFusion = angular.module('personaFusionApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when(
        '/list',
        {templateUrl: 'template/list.html',
        controller: 'listCtrl',
        controllerAs: 'pList'}
    )
    .when(
        '/list/:sort_by',
        {templateUrl: 'template/list.html',
        controller: 'listCtrl',
        controllerAs: 'pList'}
    )
    .when(
        '/persona/:persona_name',
        {templateUrl: 'template/calc.html',
        controller: 'calcCtrl',
        controllerAs: 'pCalc'
      }
    )
    .when(
        '/fusion/normal',
        {templateUrl: 'template/normal.html',
        controller: 'fuse2Ctrl',
        controllerAs: 'f2'
      }
    )
    .when(
        '/fusion/normal/:p1/:p2',
        {templateUrl: 'template/normal.html',
        controller: 'fuse2Ctrl',
        controllerAs: 'f2'
      }
    )
    .when(
        '/fusion/triangle',
        {templateUrl: 'template/triple.html',
        controller: 'fuse3Ctrl',
        controllerAs: 'f3'
      }
    )
    .when(
        '/fusion/triangle/:p1/:p2/:p3',
        {templateUrl: 'template/triple.html',
        controller: 'fuse3Ctrl',
        controllerAs: 'f3'
      }
    )
    .otherwise({
        redirectTo: '/list'
    })
}]);

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
