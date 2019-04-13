app.controller('sizesController', ['$scope', '$timeout', '$http', 'sizesService', function($scope, $timeout, $http, sizesService) {
    $scope.maxSize = 10;
    $scope.currentPage = 1;


    $scope.size = {
        id: null,
        size: "",
    };
    //get all Sizes
    $scope.filterSizes = () => {
        var request = {
            method: "GET",
            url: `${baseUrl}/size`,
            headers: {}
        }
        $http(request).then(response => {
            if (response) {
                $scope.sizes = response.data;;
            }
            console.log(response.data)
        }, err => console.log(err))
    }

    $scope.filterSizes();

    $scope.addSizeModal = () => {
        $scope.size = { name: "" };
        $("#addEditModal").modal("show");
    }

    $scope.addSize = (obj) => {
        var request = {
            method: "POST",
            url: `${baseUrl}/size/create`,
            data: {
                size: obj.size
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
            url: `${baseUrl}/size/show/${id}`,
        }

        $http(request).then(response => {
            if (response.data) {
                $scope.size = response.data;
                $("#addEditModal").modal("show");
            }
        }, (response) => console.log(response))
    }

    $scope.editSize = (obj) => {
        var request = {
            method: "POST",
            url: `${baseUrl}/size/update`,
            data: {
                id: obj.id,
                size: obj.size
            }
        }
        console.log(request)
        $http(request).then((response) => {
            console.log(response);
            $scope.filterSizes();
            $("#addEditModal").modal("hide");
        }, (response) => console.log(response))
    }

    $scope.deleteSizeModal = (size) => {
        $scope.size = size;
        $("#deleteModal").modal("show");
    }

    $scope.deleteSize = (id) => {
        var request = {
            method: "GET",
            url: `${baseUrl}/size/delete/${id}`,
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