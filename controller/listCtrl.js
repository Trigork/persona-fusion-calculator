personaFusion
.controller('listCtrl',
 function($window, $route, $routeParams, $scope){
  var vm = this;
  vm.filter = "";
  vm.personae = personae;
  vm.sortBy = $routeParams.sort_by || 'name';
});
