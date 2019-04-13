app.controller('brandsController', ['$scope', '$timeout', '$http','brandsService', function ($scope, $timeout, $http, brandsService) {
   $scope.maxSize = 10;
    $scope.currentPage = 1;

    $scope.filter = {
        page: $scope.currentPage - 1,
        name: '',
        top: 10
    }
    $scope.brand = {
        title: "",
        title_en: "",
        price_discount: false
    };

    //get all Brands
    $scope.filterBrands = function () {
        $scope.filter.page = $scope.currentPage - 1;
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=getAllBrands",
            data: {
                name: "getAllBrands",
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
            $scope.brands = response.data.response.result;

        },function (response) {
            console.log(response)
        })
    }
    $scope.filterBrands();

    $scope.editmode = false;
    $scope.addBrandModal = function () {
        $scope.brand = {
            name: ""
        };
        $scope.editmode = false;
        $("#addEditModal").modal("show");
    }

    $scope.addBrand = function (post) {
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        post.append('post', JSON.stringify($scope.brand));
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=addBrand",
            data: post,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Process-Data': false
            }
        }
        $http(request).then(function (response) {
            console.log(response.data);
            $scope.uploadfiles = [];
            $("#addEditModal").modal("hide");
            $scope.filterBrands();
        },function (response) {
            console.log(JSON.stringify(response))
        })
    }

    $scope.editBrandModal = function (obj) {
        $scope.myFile = null;
        $scope.editmode = true;
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=getOneBrand",
            data: {
                name: "getOneBrand",
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            $scope.brand = response.data.response.result;
            $scope.image_source = "images/brands/" + $scope.brand.image_path;
            $("#addEditModal").modal("show");
        },function (response) {
            console.log(response)
        })
    }

    $scope.editBrand = function (post) {
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        post.append('post', JSON.stringify($scope.brand));
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=editBrand",
            data: post,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Process-Data': false
            }
        }

        $http(request).then(function (response) {
            console.log(response.data);
            $scope.uploadfiles = [];
            $("#addEditModal").modal("hide");
            $scope.filterBrands();
        },function (response) {
            console.log(JSON.stringify(response))
        })
    }

    $scope.deleteBrandModal = function (brand) {
        $scope.brand = brand;
        $("#deleteModal").modal("show");
    }
    
    $scope.deleteBrand = function (obj) {
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=deleteBrand",
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
            $scope.image_source = "images/brands/" + $scope.brand.image_path;
            $scope.filterBrands();
        },function (response) {
            console.log(response)
        })
    }
    
    $scope.uploadedFile = function (element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            $scope.image_source = event.target.result
            $scope.$apply(function ($scope) {
                $scope.files = element.files;
            });
        }
        reader.readAsDataURL(element.files[0]);
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