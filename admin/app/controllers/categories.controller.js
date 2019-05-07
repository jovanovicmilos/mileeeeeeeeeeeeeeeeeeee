app.controller('categoriesController', ['$scope', '$timeout', '$http', 'sizesService', function($scope, $timeout, $http, sizesService) {
    $scope.maxSize = 10;
    $scope.currentPage = 1;


    $scope.category = {
        id: null,
        name: "",
    };
    //get all Sizes
    $scope.filterSizes = () => {
        var request = {
            method: "GET",
            url: `${baseUrl}/category`,
            headers: {}
        }
        $http(request).then(response => {
            if (response) {
                $scope.categories = response.data;;
            }
            console.log(response.data)
        }, err => console.log(err))
    }

    $scope.filterSizes();

    $scope.addSizeModal = () => {
        $scope.category = { name: "" };
        $("#addEditModal").modal("show");
    }

    $scope.addSize = (obj) => {
        var request = {
            method: "POST",
            url: `${baseUrl}/category/create`,
            data: {
                name: obj.name
            }
        }
        console.log(request)
        $http(request).then(() => {
            $scope.filterSizes();
            $("#addEditModal").modal("hide");
        }, (response) => console.log(response))
    }


    $scope.editSizeModal = (id) => {
        var request = {
            method: "GET",
            url: `${baseUrl}/category/show/${id}`,
        }

        $http(request).then(response => {
            console.log(response);
            if (response.data) {
                $scope.category = response.data;
                $("#addEditModal").modal("show");
            }
        }, (response) => console.log(response))
    }

    $scope.editSize = (obj) => {
        var request = {
            method: "POST",
            url: `${baseUrl}/category/update`,
            data: {
                id: obj.id,
                name: obj.name
            }
        }
        console.log(request)
        $http(request).then((response) => {
            $scope.filterSizes();
            $("#addEditModal").modal("hide");
        }, (response) => console.log(response))
    }

    $scope.deleteSizeModal = (category) => {
        $scope.category = category;
        $("#deleteModal").modal("show");
    }

    $scope.delete = (id) => {
        var request = {
            method: "GET",
            url: `${baseUrl}/category/delete/${id}`,
        }
        $http(request).then((response) => {
            console.log(response);
            $("#deleteModal").modal("hide");
            $scope.filterSizes();
        }, (response) => console.log(response))
    }


}])


app.directive('ngFile', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            element.bind('change', function() {
                $parse(attrs.ngFile).assign(scope, element[0].files)
                scope.$apply();
            });
        }
    };
}]);