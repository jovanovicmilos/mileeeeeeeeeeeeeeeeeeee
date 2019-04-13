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
        console.log($scope.filter)
        brandsService.getAll($scope.filter).then(function (response) {
            console.log('nekretnine')
            console.log(response);
            $scope.brands = response.data;
        }, function (response) {
            console.log(response);
        })
    }
    $scope.filterBrands();

    $scope.editmode = false;
    $scope.addBrandModal = function () {
        $scope.my
        $scope.brand = {
            name: ""
        };
        $scope.editmode = false;
        $("#addEditModal").modal("show");
    }

    $scope.addBrand = function (post) {
        console.log(post);
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        post.append('post', JSON.stringify($scope.brand));
        console.log($scope.brand)
        brandsService.add(post).then(function (response) {
            console.log(response);
            console.log(response.data);
            $scope.image_source = "";
            $scope.myFile = "";
            $scope.filterBrands();
            $rootScope.totals();
            $('#addEditModal').modal('hide');

        }, function (response) {
            console.log(response);
        })
    }

    $scope.editBrandModal = function () {
        $scope.editmode = true;
        $("#addEditModal").modal("show");
    }


    $scope.editBrandModal = function (obj) {
        $scope.myFile = null;
        $scope.editmode = true;
        brandsService.getOne(obj).then(function (response) {
            $scope.brand = response.data;
            $scope.image_source = "images/brands/" + $scope.brand.image_path;
            $("#addEditModal").modal("show");
        }, function (response) {
            console.log(response);
        })
    }
    $scope.editBrand = function (post) {
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        console.log($scope.brand);
        post.append('post', JSON.stringify($scope.brand));
        brandsService.edit(post).then(function (response) {
            console.log(response.data);
            $scope.uploadfiles = [];
            $scope.filterBrands();
            $('#addEditModal').modal('hide');
        }, function (response) {
            console.log(response);
        })
    }

    $scope.deleteBrandModal = function (brand) {
        $scope.brand = brand;
        $("#deleteModal").modal("show");
    }
    
    $scope.deleteBrand = function (id) {
        brandsService.delete(id).then(function (response) {
            console.log(response)
            $scope.filterBrands();
            $('#deleteModal').modal('hide');
        }, function (response) {
            console.log(response);
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