app.controller('productsController', ['$scope', '$timeout', '$http', 'productsService', 'brandsService', 'sizesService', '$rootScope', '$sce', '$routeParams', 'cartService', function ($scope, $timeout, $http, productsService, brandsService, sizesService, $rootScope, $sce, $routeParams, cartService) {

    $scope.maxSize = 10;
    $scope.currentPage = 1;

    $scope.filter = {
        page: $scope.currentPage - 1,
        title: '',
        address: '',
        top: 12
    }

    $scope.product = {
        title: "",
        title_en: "",
        price_discount: false
    };
    //get all Products
    $scope.filterProducts = function () {

        $scope.filter.page = $scope.currentPage - 1;
        productsService.getAll($scope.filter).then(function (response) {
            $scope.products = response.data;
        }, function (response) {
            console.log(response);
        })
    }
    $scope.filterProducts();

    if ($routeParams.productId) {
        var obj = {
            id: $routeParams.productId
        };
        productsService.getOne(obj).then(function (response) {

            $scope.product = response.data;
            if ($scope.product.images.length > 0) {
                $scope.currentimage = $scope.product.images[0].image_path;
            }
        }, function (response) {
            console.log(response);
        })

    }


    $scope.slider = function (image, index) {
        $scope.currentimage = image;
    }

    $scope.formatDate = function (date) {
        return new Date(date);
    }

    //BRANDS
    $scope.getAllBrands = function () {
        brandsService.getallSelect().then(function (response) {
            console.log(response)
            $scope.brands = response.data;
        }, function (response) {
            console.log(response);
        })
    }
    $scope.getAllBrands();
    //SIZES
    $scope.getAllSizes = function () {
        sizesService.getallSelect().then(function (response) {
            $scope.sizes = response.data;
        }, function (response) {
            console.log(response);
        })
    }
    $scope.getAllSizes();

    $scope.slider = function (index, direction) {
        $scope.slideleft = index - 1;
        $scope.slideright = index + 1;
        switch (direction) {
            case 'center':
                $scope.currentimage = $scope.product.images[index].image_path;
                break;
            case 'left':
                for (var i = 0; i < $scope.product.images.length; i++) {
                    if ($scope.currentimage == $scope.product.images[i].image_path) {
                        if (i != 0) {
                            $scope.currentimage = $scope.product.images[i - 1].image_path;
                        }
                    }
                }
                break;
            case 'right':
                for (var i = 0; i < $scope.product.images.length; i++) {
                    if ($scope.currentimage == $scope.product.images[i].image_path) {
                        var i = i + 1;
                        if (i != $scope.product.images.length) {
                            $scope.currentimage = $scope.product.images[i].image_path;
                        }
                    }
                }
                break;
        }

        setTimeout(function () {
            var heightimg = $('.slider-box img').height();
            var widthimg = $('.slider-box img').width();
            if (heightimg > widthimg) {
                $('.slider-box img').css({
                    'height': '350px',
                    'width': 'auto'
                })
            } else {
                $('.slider-box img').css({
                    'width': '350px',
                    'height': 'auto'
                })
            }
        }, 50);
    }

    if (cartService.get('cart') == undefined) {
        $rootScope.cart = [];
    } else {
        $rootScope.cart = JSON.parse(cartService.get('cart'));
    }

    $scope.addToCart = function (product, i) {
        console.log(i);
        var item = new Object;
        item.id = product.id;
        item.title = product.title;
        item.title_en = product.title_en;
        if (product.price_discount == 1) {
            item.price = product.price_new;
        } else {
            item.price = product.price;
        }
        item.quantity = 1;
        if(product.images != undefined){
            item.image_path = product.images[0].image_path;
        }

        if(i == 1){
            item.image_path = product.image_path;
        }
        if ($rootScope.cart.length === 0) {
            $rootScope.cart.push(item);
            cartService.set('cart', JSON.stringify($rootScope.cart));
        } else {
            var repeat = false;
            for (var i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].id === item.id) {
                    repeat = true;
                }
            }
            if (!repeat) {
                $rootScope.cart.push(item);
                cartService.set('cart', JSON.stringify($rootScope.cart));
            }
        }
        console.log($rootScope.cart)
    }
    
    $scope.totalPrice = function () {
        var price = 0;
        for (var i = 0; i < $rootScope.cart.length; i++) {
            var quantity = $rootScope.cart[i].price * $rootScope.cart[i].quantity;
            price = price + quantity;
        }
        cartService.set('cart', JSON.stringify($rootScope.cart));
        return price;
    }
    
    $scope.removeFromCart = function(product){
        $rootScope.cart.splice($rootScope.cart.indexOf(product), 1);
        cartService.set('cart', JSON.stringify($rootScope.cart));
    }
    
    $scope.quantityChange = function(item, operation){
        if(operation == 'minus'){
            if(item.quantity != 0){
                item.quantity--;
            }
            
        }else{
            console.log(item.quantity)
            item.quantity = item.quantity + 1;
        }
    }
    
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
