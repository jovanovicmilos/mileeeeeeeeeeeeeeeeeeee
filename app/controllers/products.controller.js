
app.controller('productsController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    
    $scope.products = [];

    $scope.filter = {
        page: 1,
        size: 10,
        searchTitle: '',
        searchGender: '',
        searchType: '',
        priceFrom: '',
        priceTo: ''
    }

    $scope.getAllProducts = function () {
        console.warn($scope.filter);
        var request = {
            method: "GET",
            url: `${baseUrl}/product`,
            params: $scope.filter,
            headers: {
                'Content-Type': "application/json"
            }
        }


        $http(request).then(function (response) {
            console.log('proizvodi client')
            console.log(response.data)
            $scope.products = response.data;

        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }

    $scope.getAllProducts();
}])

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                    if (Math.round(element[0].files[0].size / 1024) > 2048) {
                        document.getElementById("imgUpload").value = "";
                        $("#imgSrc").hide();
                        alert("Your image size must be lower than 2mb!");
                    } else {
                        $("#imgSrc").show();
                    }
                });
            });
        }
    };
}]);

app.directive('ngFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {

                $parse(attrs.ngFile).assign(scope, element[0].files)
                scope.$apply();
            });
        }
    };
}]);
