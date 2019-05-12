
app.controller('productsController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    
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

    $scope.sizes = [];

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
    $scope.slickConfigLoaded = false;
    $scope.getOneProduct = function(id) {
        console.log('hi ', id);
        var request = {
            method: "GET",
            url: `${baseUrl}/product/show/${id}`
        }

        $http(request).then(function (response) {
            console.log(response);
            $scope.product = response.data;
            $scope.slickConfigLoaded = true;
            $scope.product.price = parseFloat($scope.product.price);
            $scope.product.price_new = parseFloat($scope.product.price_new);
            $scope.product.price_discount == 0 ? $scope.product.price_discount = false : $scope.product.price_discount = true;
        }, (error) => console.log(error))
    }

    if ($routeParams.productId) {
        console.log('test');
        $scope.getOneProduct($routeParams.productId);
    }

    const getAllSizes = () => {
        var request = {
            method: "GET",
            url: `${baseUrl}/size`,
            headers: {}
        }
        $http(request).then(response => {
            $scope.sizes = response.data;;
            console.log(response.data)
        }, err => console.log(err))
    }
    getAllSizes();

    $scope.isSizeExist = function(id) {
        if ($scope.product && $scope.product.sizes) {
            return !$scope.product.sizes.some(item => item.id === id);
        }
    }
    $scope.number = [{label: 1}, {label: 2}, {label: 3}, {label: 4}, {label: 5}, {label: 6}, {label: 7}, {label: 8}];

    
    // $scope.slickConfig = {

    //     method: {},
    //     dots: true,
    //     infinite: false,
    //     speed: 300,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     event: {
    //         beforeChange: function (event, slick, currentSlide, nextSlide) {

    //         },
    //         afterChange: function (event, slick, currentSlide, nextSlide) {
    //             $scope.slickCurrentIndex = currentSlide;
    //         },
    //         breakpoint: function (event, slick, breakpoint) {

    //         },
    //         destroy: function (event, slick) {

    //         },
    //         edge: function (event, slick, direction) {

    //         },
    //         reInit: function (event, slick) {

    //         },
    //         init: function (event, slick) {

    //         },
    //         setPosition: function (evnet, slick) {

    //         },
    //         swipe: function (event, slick, direction) {

    //         }
    //     },
    //     responsive: [
    //       {
    //           breakpoint: 1024,
    //           settings: {
    //               slidesToShow: 2,
    //               slidesToScroll: 1,
    //               infinite: true,
    //               dots: true
    //           }
    //       },
    //       {
    //           breakpoint: 600,
    //           settings: {
    //               slidesToShow: 2,
    //               slidesToScroll: 1
    //           }
    //       },
    //       {
    //           breakpoint: 480,
    //           settings: {
    //               slidesToShow: 1,
    //               slidesToScroll: 1
    //           }
    //       }
    //     ]
    // };

    $scope.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: false,
        autoplaySpeed: 3000,
        slidesToShow: 2,
        method: {},
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
            }
        }
    };
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
