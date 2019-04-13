app.controller('autocompleteController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    
   
    
    $scope.getRestaurant = function () {
        return savevalueService.get();
    }
}])