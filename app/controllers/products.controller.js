app.controller('productsController', ['$scope', '$timeout', '$http', 'productsService', 'brandsService', 'sizesService','cartService', '$rootScope', '$sce', '$location', '$routeParams', function ($scope, $timeout, $http, productsService, brandsService, sizesService, cartService,$rootScope, $sce, $location, $routeParams) {

    $scope.maxSize = 30;
    $scope.currentPage = 1;
    $scope.checkAll = false;
    $scope.queryParams = $location.search();

    $scope.filter = {
        page: 1,
        top: 12,
        title: '',
        address: '',
        brand_id: '',
        size_id: '',
        gender: '',
        price_discount: false,
        update_date: '',
        insert_date: '',
        priceFrom: '',
        priceTo: ''
    }


    for (var fld in $scope.queryParams) {
        if ($scope.queryParams[fld]) {
            console.log(fld)
            if (fld == "update_date" || fld == 'insert_date') {
                $scope.filter[fld] = new Date($scope.queryParams[fld]);
            } else {
                $scope.filter[fld] = $scope.queryParams[fld];
            }

        }
    }

    $scope.product = {
        title: "",
        title_en: "",
        price_discount: false
    };

    $scope.filterProducts = function () {
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getAllProducts",
            data: {
                name: "getAllBrands",
                param: $scope.filter
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        for (var fld in $scope.filter) {
            if ($scope.filter[fld] != '') {
                if ($scope.filter[fld] == 'update_date' || $scope.filter[fld] == 'insert_date') {
                    $location.search(fld, new Date($scope.filter[fld]));
                } else {
                    $location.search(fld, $scope.filter[fld]);
                }
            } else {
                $location.search(fld, null);
            }
        }
        $scope.filter.top = parseInt($scope.queryParams['top']);

        $http(request).then(function (response) {
            console.log('proizvodi')
            console.log(response.data)
            $scope.products = response.data.response.result;
            $scope.filter.page = parseInt($scope.queryParams['page']);

        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }
    if (!$routeParams.productId) {
        $scope.filterProducts();
    }

    $scope.changeTotal = function () {
        $scope.filter.page = 1;
        $scope.filterProducts();
    }

    $scope.genders = [
        {
            id: 0,
            name: "Male"
        },
        {
            id: 1,
            name: "Female"
        }
    ]



    $scope.editmode = false;
    $scope.addProductModal = function () {
        $scope.product = {
            title: "",
            title_en: "",
            price_discount: false,
            sizes: []

        };
        $scope.selectedsize = [];
        $scope.editmode = false;
        $("#addEditModal").modal("show");
    }

    $scope.addProduct = function (post) {
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        angular.forEach($scope.uploadfiles, function (file) {
            post.append('files[]', file);
        });
        if ($scope.product.price_discount == false) {
            $scope.product.price_discount = 0;
        } else {
            $scope.product.price_discount = 1;
        }
        $scope.product.sizes = $scope.selectedsize;
        post.append('post', JSON.stringify($scope.product));
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=addProduct",
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
            $scope.filterProducts();
        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }

    $scope.editProductModal = function () {
        $scope.editmode = true;
        $("#addEditModal").modal("show");
    }
    
    if ($routeParams.productId) {
        var obj = {
            id: $routeParams.productId
        };
           
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getOneProduct",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }

        $http(request).then(function (response) {
            console.log('data');
            console.log(response);
            $scope.product = response.data.response.result;
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
        
//        productsService.getOne(obj).then(function (response) {
//
//            $scope.product = response.data;
//            if ($scope.product.images.length > 0) {
//                $scope.currentimage = $scope.product.images[0].image_path;
//            }
//        }, function (response) {
//            console.log(response);
//        })

    


//    $scope.editProductModal = function (obj) {
//        $scope.array = [];
//        $scope.arrayimage = [];
//        $scope.editmode = true;
//        $scope.selectedsize = [];
//        var request = {
//            method: "POST",
//            url: "service-proxy/index.php?api=getOneProduct",
//            data: {
//                param: obj
//            },
//            headers: {
//                'Content-Type': "application/json"
//            }
//        }
//
//        $http(request).then(function (response) {
//            console.log('data');
//            console.log(response);
//            $scope.product = response.data.response.result;
//            if ($scope.product.price_discount == 0) {
//                $scope.product.price_discount = false;
//            } else {
//                $scope.product.price_discount = true;
//            }
//            $scope.selectedsize = [];
//            angular.forEach($scope.product.sizes, function (f) {
//                for (var i = 0; i < $scope.sizes.length; i++) {
//                    if ($scope.sizes[i].id == f.id) {
//                        $scope.sizes[i].quantity = f.quantity;
//                        $scope.selectedsize.push($scope.sizes[i]);
//                    }
//                }
//            })
//            for (var i = 0; i < $scope.sizes.length; i++) {
//                if ($scope.selectedsize.indexOf($scope.sizes[i]) === -1) {
//                    $scope.sizes[i].quantity = "";
//                }
//            }
//            console.log($scope.selectedsize);
//            console.log($scope.product.images)
//            if ($scope.product.images) {
//                if ($scope.product.images.length > 0) {
//                    for (var i = 0; i < $scope.product.images.length; i++) {
//                        $scope.arrayimage.push($scope.product.images[i]);
//                    }
//                }
//            }
//            $("#addEditModal").modal("show");
//        }, function (response) {
//            console.log(response);
//        })
//    }
    $scope.editProduct = function (post) {
        var post = new FormData();
        var file = $scope.myFile;
        post.append('file', file);
        angular.forEach($scope.uploadfiles, function (file) {
            post.append('files[]', file);
        });
        if ($scope.product.price_discount == false) {
            $scope.product.price_discount = 0;
        } else {
            $scope.product.price_discount = 1;
        }
        $scope.product.sizes = $scope.selectedsize;
        $scope.product.imagefordelete = {
            array: $scope.selected
        };
        post.append('post', JSON.stringify($scope.product));
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=editProduct",
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
            $scope.filterProducts();
        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }

    $scope.deleteProductModal = function (obj) {
        $scope.product = obj;
        $("#deleteModal").modal("show");
    }

    $scope.deleteProduct = function (id) {
        console.log(id)
        productsService.delete(id).then(function (response) {
            console.log(response);
            $scope.filterProducts();
            $rootScope.totals();
            $("#deleteModal").modal("hide");
        }, function (response) {
            console.log(JSON.stringify(response));
        })
    }

    $scope.detailProductModal = function (obj) {
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getOneProduct",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log(response);
            $scope.product = response.data.response.result;
            if ($scope.product.images.length > 0) {
                $scope.currentimage = $scope.product.images[0].image_path;
            }
            $("#detailModal").modal("show");
        }, function (response) {
            console.log(JSON.stringify(response));
        })
    }

    $scope.slider = function (image, index) {
        console.log('sadsdasda');
        $scope.currentimage = image;
    }

    $scope.formatDate = function (date) {
        return new Date(date);
    }

    //BRANDS
    $scope.getAllBrands = function () {
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getAllBrandSelect",
            data: {
                param: {}
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            $scope.brands = response.data.response.result;
        }, function (response) {
            console.log(JSON.stringify(response));
        })
    }
    $scope.getAllBrands();
    $scope.featuresgroups = {};
    $scope.getFeaturesWithGroups = function () {
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getAllFeatureWithGroups",
            data: {
                param: {}
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log('featuresgroups');
            
            $scope.featuresgroups = response.data.response.result;
            console.log($scope.featuresgroups);
        }, function (response) {
            console.log(JSON.stringify(response));
        })
    }
    $scope.getFeaturesWithGroups();


    //SIZES
    $scope.getAllSizes = function () {
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getAllSizesSelect",
            data: {
                param: {}
            },
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            $scope.sizes = response.data.response.result;

        }, function (response) {
            console.log(JSON.stringify(response));
        })
    }
    $scope.getAllSizes();



    $scope.tinymceOptions = {
        selector: "textarea",
        statusbar: false,
        plugins: ['link image media paste code'],
        toolbar: 'sizeselect | fontselect |  fontsizeselect | undo redo | bold italic | alignleft aligncenter alignright | code | media | paste',
        toolbar2: "print preview media | forecolor backcolor emoticons | fontsize",
        fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt'
    };
    $scope.tinymceHtml = "";
    $scope.updateHtml = function (f) {
        $scope.blogpost = f;
        return $scope.tinymceHtml;
    };

    $scope.selected = [];
    $scope.selectedsize = [];

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
        console.log($scope.selectedsize)
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };


    $scope.isIndeterminate = function () {
        return ($scope.selectedsize.length !== 0 &&
            $scope.selectedsize.length !== $scope.sizes.length);
    };

    $scope.isChecked = function () {
        return $scope.selectedsize.length === $scope.sizes.length;
    };

    $scope.toggleAll = function () {
        if ($scope.selectedsize.length === $scope.sizes.length) {
            $scope.selectedsize = [];
        } else if ($scope.selectedsize.length === 0 || $scope.selectedsize.length > 0) {
            $scope.selectedsize = $scope.sizes.slice(0);
        }
    };

    $scope.uploadedMultipleFile = function (element) {
        console.log($scope.editmode)
        $scope.array = [];
        console.log(element.files);
        console.log('hiii');
        console.log(event.target.result);
        for (var i = 0; i < element.files.length; i++) {
            $scope.currentFiles = element.files[i];
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.array.push(event.target.result);

                $scope.$apply(function ($scope) {
                    console.log(element.files)
                    $scope.files = element.files;
                });
                console.log($scope.array);
            }
            reader.readAsDataURL(element.files[i]);
        }
    }

    $scope.today = function () {
        $scope.filter.update_date = new Date();
    };

    $scope.clear = function () {
        $scope.filter.update_date = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
      ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
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
