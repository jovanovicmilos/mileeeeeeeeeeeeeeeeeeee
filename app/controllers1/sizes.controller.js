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
        console.log($scope.filter)
        sizesService.getAllSizes($scope.filter).then(function (response) {
            console.log(response);
            $scope.sizes = response.data;
        }, function (response) {
            console.log(response);
        })
    }
    
    $scope.filterSizes();

    $scope.editmode = false;
    $scope.addSizeModal = function () {
        $scope.my
        $scope.size = {
            name: ""
        };
        $scope.editmode = false;
        $("#addEditModal").modal("show");
    }

    $scope.addSize = function (post) {
        console.log(post);
        var post = new FormData();
        post.append('post', JSON.stringify($scope.size));
        console.log($scope.size)
        sizesService.add(post).then(function (response) {
            console.log(response);
            console.log(response.data);
            $scope.filterSizes();
            $("#addEditModal").modal("hide");

        }, function (response) {
            console.log(response);
        })
    }


    $scope.editSizeModal = function () {
        $scope.editmode = true;
        $("#addEditModal").modal("show");
    }


    $scope.editSizeModal = function (obj) {
        $scope.editmode = true;
        sizesService.getOne(obj).then(function (response) {
            $scope.size = response.data;
            $("#addEditModal").modal("show");
        }, function (response) {
            console.log(response);
        })
    }
    
    $scope.editSize = function (post) {
        var post = new FormData();
        console.log($scope.size);
        post.append('post', JSON.stringify($scope.size));
        sizesService.edit(post).then(function (response) {
            console.log(response.data);
            $scope.filterSizes();
            $('#addEditModal').modal('hide');
        }, function (response) {
            console.log(response);
        })
    }

    $scope.deleteSizeModal = function (size) {
        $scope.size = size;
        $("#deleteModal").modal("show");
    }
    
    $scope.deleteSize = function (id) {
        sizesService.delete(id).then(function (response) {
            console.log(response)
            $scope.filterSizes();
            $("#deleteModal").modal("hide");
        }, function (response) {
            console.log(response);
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