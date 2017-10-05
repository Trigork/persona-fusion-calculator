personaFusion
.controller('calcCtrl', function($window, $route, $routeParams, $scope, $filter){

  var vm = this;
  window.calc=this;
  this.ceil = Math.ceil;

  $scope.filter = "";

  this.persona_name = $routeParams.persona_name;

  this.getRank = function(persona){
      return arcanaRank[persona.arcana];
  }

  this.addRecipe = function(recipe) {
    recipe.cost = 0;
    for (var i = 0, source = null; source = recipe.sources[i]; i++) {
      var level = source.level;
      recipe.cost += (27 * level * level) + (126 * level) + 2147;
    }

    // Sort so that the "3rd persona" in triangle fusion (the one that needs
    // to have the highest current level) is always listed first.  In case
    // of a tie in level, the persona with the lowest arcana rank is used.
    recipe.sources = $filter('orderBy')(recipe.sources, [ '-level', this.getRank ]);
    if (recipe.sources.length == 2) {
      recipe.sources.push("");
    }
    $scope.allRecipes.push(recipe);
  }

  this.fuse2 = function(arcana, persona1, persona2) {
    var level = Math.floor((persona1.level + persona2.level) / 2);
    var personae = personaeByArcana[arcana];

    if (persona1.arcana == persona2.arcana) {

      for (var i = personae.length-1, persona = null; persona = personae[i]; i--) {
        if (persona.level <= level) {
          if (persona.special) continue;
          break;
        }
      }

    } else {

      for (var i = 0, persona = null; persona = personae[i]; i++) {
        if (persona.level > level) {
           if (persona.special) continue;
           break;
        }
      }

    }

    if (i >= personae.length) {
      i = personae.length - 1;
    }

    while ( i >= 0 && (personae[i].special || personae[i] == persona1 || personae[i] == persona2)) i--;

    return personae[i];
  }

  this.fuse3 = function(arcana, persona1, persona2, persona3) {
    var level = 5 + Math.floor(
      (persona1.level + persona2.level + persona3.level) / 3);
    if (persona1.arcana == persona2.arcana && persona2.arcana == persona3.arcana){
      level -= 5;
    }
    var personae = personaeByArcana[arcana];

    var found = false;
    for (var i = 0, persona = null; persona = personae[i]; i++) {
      if (persona.level > level) {
        if (persona.special) continue;
        found = true;
        break;
      }
    }
    if (!found) return null;

    // In same arcana fusion, skip over the ingredients.
    if (persona1.arcana == arcana
        && persona2.arcana == arcana
        && persona3.arcana == arcana) {
      while (persona1.name == personae[i].name
             || persona2.name == personae[i].name
             || persona3.name == personae[i].name) {
        i++;
        if (!personae[i]) return null;
      }
    }

    if (personae[i].special){i++;}

    return personae[i];
  }

  this.getRecipes = function() {
    var recipes = [];

    // Check special recipes.
    if (this.persona.special) {
      for (var i = 0, combo = null; combo = specialCombos[i]; i++) {
        if (this.persona.name == combo.result) {
          var recipe = {'sources': []};
          for (var j = 0, source = null; source = combo.sources[j]; j++) {
            recipe.sources.push(personaeByName[source]);
          }
          this.addRecipe(recipe);
          return;
        }
      }
    }

    // Consider straight fusion.
    function filter2Way(persona1, persona2, result) {
      if (persona1.name == this.persona.name) return true;
      if (persona2.name == this.persona.name) return true;
      if (result.name == this.persona.name) return false;
      return true;
    }

    var recipes = this.getArcanaRecipes(this.persona.arcana, filter2Way);
    for (var i = 0, recipe = null; recipe = recipes[i]; i++) {
      this.addRecipe(recipe);
    }

    // Consider triangle fusion.
    var arcana_ = this.persona.arcana; // closure ref.; broken this in callback
    var combos = $filter('filter')(arcana3Combos, {result: arcana_ });
    for (var i = 0, combo = null; combo = combos[i]; i++) {
      // For every possible 3-way fusion, consider all recipes to produce
      // arcana A, plus an arcana B if it's higher, plus vice versa.
      function persona3IsValid(persona1, persona2, persona3) {
        if (persona3 == persona1) return false;
        if (persona3 == persona2) return false;

        if (persona3.level < persona1.level) return false;
        if (persona3.level < persona2.level) return false;

        if (persona3.level == persona1.level) {
          return arcanaRank[persona3.arcana] < arcanaRank[persona1.arcana];
        }
        if (persona3.level == persona2.level) {
          return arcanaRank[persona3.arcana] < arcanaRank[persona2.arcana];
        }

        var forbiddenCombo = true;
        forbiddenCombos.forEach(function(forbidden){
            if(forbidden.sources.includes(persona1.name)
            && forbidden.sources.includes(persona2.name)){
              forbiddenCombo = false;
            }

            if(forbidden.sources.includes(persona1.name)
            && forbidden.sources.includes(persona3.name)){
              forbiddenCombo = false;
            }

            if(forbidden.sources.includes(persona2.name)
             && forbidden.sources.includes(persona3.name)){
              forbiddenCombo = false;
            }
        });

        return forbiddenCombo;
      }

      function find3WayRecipes(arcana1, arcana2) {
        var step1Recipes = this.getArcanaRecipes(arcana1);
        for (var i = 0, step1Recipe = null; step1Recipe = step1Recipes[i]; i++) {
          var persona1 = step1Recipe.sources[0];
          var persona2 = step1Recipe.sources[1];
          var personae = personaeByArcana[arcana2];
          for (var j = 0, persona3 = null; persona3 = personae[j]; j++) {
            if (persona3IsValid(persona1, persona2, persona3)) {
              var result = this.fuse3(
                  this.persona.arcana, persona1, persona2, persona3);
              if (!result || result.name != this.persona.name) continue;

              this.addRecipe({'sources': [
                  step1Recipe.sources[0], step1Recipe.sources[1], persona3]});
            }
          }
        }
      }
      find3WayRecipes.call(this, combo.source[0], combo.source[1]);
      if (combo.source[1] != combo.source[0]) {
        find3WayRecipes.call(this, combo.source[1], combo.source[0]);
      }
    }
  };

  this.getArcanaRecipes = function(arcanaName, filterCallback) {
    var recipes = [];
    var combos = $filter('filter')(arcana2Combos, {result: arcanaName });
    for (var i = 0, combo = null; combo = combos[i]; i++) {
      var personae1 = personaeByArcana[combo.source[0]];
      var personae2 = personaeByArcana[combo.source[1]];
      for (var j = 0, persona1 = null; persona1 = personae1[j]; j++) {
        for (var k = 0, persona2 = null; persona2 = personae2[k]; k++) {
          if (persona1.arcana == persona2.arcana && k <= j) continue;
          var result = this.fuse2(combo.result, persona1, persona2);
          // if (result && (persona1.arcana == persona2.arcana) && arcanaName == "Fool") {
          //   // console.log(result.name + ": " + persona1.name + " + " + persona2.name);
          //   // console.log(persona1.name + "==" + this.persona.name + " ret true");
          //   // console.log(persona2.name + "==" + this.persona.name + " ret true");
          //   // console.log(result.name + "==" + this.persona.name + " ret false");
          // }
          if (!result) continue;
          if (filterCallback
              && filterCallback.call(this, persona1, persona2, result)) {
            continue;
          }

          recipes.push({'sources': [persona1, persona2]});
        }
      }
    }
    return recipes;
  };

  this.persona = personaeByName[vm.persona_name];
  if (!this.persona) return;

  $scope.allRecipes = [];
  this.getRecipes();
  $scope.allRecipes = $filter('orderBy')($scope.allRecipes, 'cost');
  this.maxCost = 0;
  for (var i = 0, recipe = null; recipe = $scope.allRecipes[i]; i++) {
    recipe.num = i;
    this.maxCost = Math.max(this.maxCost, recipe.cost);
  }

  $scope.perPage = 100;
  $scope.lastPage = Math.floor($scope.allRecipes.length / $scope.perPage);
  $scope.pageNum = 0;

  this.paginateAndFilter = function() {
    if ($scope.pageNum < 0) $scope.pageNum = 0;
    if ($scope.pageNum > this.lastPage) $scope.pageNum = this.lastPage;
    $scope.recipes = $filter('filter')($scope.allRecipes, $scope.filter);
    $scope.numRecipes = $scope.recipes.length;
    $scope.recipes = $scope.recipes.slice(
        $scope.pageNum * $scope.perPage,
        $scope.pageNum * $scope.perPage + $scope.perPage);

  };

  $scope.$watch('filter', this.paginateAndFilter);
  $scope.$watch('pageNum', this.paginateAndFilter, false);

});
