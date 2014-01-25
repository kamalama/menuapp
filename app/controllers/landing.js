

app.controller('landing', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.addToCook =function(ingredient){
    if(!($scope.toCook[ingredient.ingredientName])){
      $scope.toCook[ingredient.ingredientName] = ingredient;
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
      sharedProperties.setToCook($scope.toCook);
    }
    ingredientMethods.getSuggestedIngredients($scope);
  };

  $scope.removeFromToCook =function(ingredient){
    if($scope.toCook[ingredient.ingredientName]){
      delete($scope.toCook[ingredient.ingredientName]);
      sharedProperties.setToCook($scope.toCook);
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
    }
    ingredientMethods.getSuggestedIngredients($scope);
  };

  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  ingredientMethods.getTopIngredients($scope);

});