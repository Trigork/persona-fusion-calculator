personaFusion
.config(['$routeProvider', '$locationProvider', 'appConfig',
  function($routeProvider, $locationProvider, appConfig) {
    $routeProvider
    .when(
        '/list/',
        {
        title: 'Persona List',
        templateUrl: 'template/list.html',
        controller: 'listCtrl',
        controllerAs: 'pList'}
    )
    .when(
        '/persona/:persona_name',
        {
        title: 'Persona Recipes',
        templateUrl: 'template/calc.html',
        controller: 'calcCtrl',
        controllerAs: 'pCalc'
      }
    )
    .when(
        '/fusion/normal',
        {
        title: 'Normal Fusion',
        templateUrl: 'template/normal.html',
        controller: 'fuse2Ctrl',
        controllerAs: 'f2'
      }
    )
    .when(
        '/fusion/normal/:p1/:p2',
        {
        title: 'Normal Fusion',
        templateUrl: 'template/normal.html',
        controller: 'fuse2Ctrl',
        controllerAs: 'f2'
      }
    )
    .when(
        '/fusion/triangle',
        {
        title: 'Triangle Fusion',
        templateUrl: 'template/triple.html',
        controller: 'fuse3Ctrl',
        controllerAs: 'f3'
      }
    )
    .when(
        '/fusion/triangle/:p1/:p2/:p3',
        {
        title: 'Triangle Fusion',
        templateUrl: 'template/triple.html',
        controller: 'fuse3Ctrl',
        controllerAs: 'f3'
      }
    )
}]);
