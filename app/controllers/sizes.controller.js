app.controller('sizesController', ['$scope', '$timeout', '$http','sizesService', function ($scope, $timeout, $http, sizesService) {
   $scope.maxSize = 10;
    $scope.currentPage = 1;

    $scope.filter = {
        page: $scope.currentPage - 1,
        name: '',
        top: 10
    }
    
    $scope.size = {
        title: "",
        title_en: "",
        price_discount: false
    };
    //get all Sizes
    $scope.filterSizes = function () {
        $scope.filter.page = $scope.currentPage - 1;
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=getAllSizes",
            data: {
                param: {
                    page: $scope.filter.page,
                    name: $scope.filter.name,
                    top: 10
                }
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        console.log(request)
        $http(request).then(function (response) {
            console.log(response)
            $scope.sizes = response.data.response.result;

        },function (response) {
            console.log(response)
        })
    }
    
    $scope.filterSizes();

    $scope.editmode = false;
    $scope.addSizeModal = function () {
        $scope.size = { name: "" };
        $scope.editmode = false;
        $("#addEditModal").modal("show");
    }

    $scope.addSize = function (obj) {
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=addSize",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        console.log(request)
        $http(request).then(function (response) {
            console.log(response);
            $scope.filterSizes();
            $("#addEditModal").modal("hide");

        },function (response) {
            console.log(response)
        })
    }


    $scope.editSizeModal = function (obj) {
        $scope.editmode = true;
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=getOneSize",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log(response);
            $scope.size = response.data.response.result;
            $("#addEditModal").modal("show");
        },function (response) {
            console.log(response)
        })
    }
    
    $scope.editSize = function (obj) {
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=editSize",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        console.log(request)
        $http(request).then(function (response) {
            console.log(response);
            $scope.filterSizes();
            $("#addEditModal").modal("hide");
        },function (response) {
            console.log(response)
        })
    }

    $scope.deleteSizeModal = function (size) {
        $scope.size = size;
        $("#deleteModal").modal("show");
    }
    
    $scope.deleteSize = function (obj) {
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=deleteSize",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log(response);
            $("#deleteModal").modal("hide");
            $scope.filterSizes();
        },function (response) {
            console.log(response)
        })
    }
    

}])


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