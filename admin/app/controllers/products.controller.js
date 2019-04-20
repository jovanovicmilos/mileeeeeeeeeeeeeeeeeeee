function Product() {
    this.age = null;
    this.brand_id = null;
    this.description = '';
    this.description_en = '';
    this.features = [];
    this.color = '';
    this.gender = null;
    this.item_information = '';
    this.item_information_en = '';
    this.price = null;
    this.price_discount = false;
    this.price_new = 0;
    this.sizes = [];
    this.title = '';
    this.title_en = '';
    this.deleteCoverImage = false;
    this.parent_id = null;
}
app.controller('productsController', ['$scope', '$http', 'productsService', 'multpipleSelectService', '$rootScope', '$sce', '$location', function ($scope, $http, productsService, multpipleSelectService, $rootScope, $sce, $location) {

    $scope.maxSize = 30;
    $scope.currentPage = 1;
    $scope.checkAll = false;
    $scope.queryParams = $location.search();
    $scope.array = [];
    $scope.arrayimage = [];
    $scope.files = [];
    $scope.arrayMain = [];
    $scope.arrayimageMain = [];
    $scope.filesMain = [];

    $scope.filter = {
        page: 1,
        top: 10,
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

    $scope.product = new Product();
    console.log($scope.product);
    $scope.filterProducts = function () {
        var request = {
            method: "GET",
            url: `${baseUrl}/product`,
            params: {
                page: 1,
                size: 10
            },
            headers: {
                'Content-Type': "application/json"
            }
        }

        $scope.filter.top = parseInt($scope.queryParams['top']);

        $http(request).then(function (response) {
            console.log('proizvodi')
            console.log(response.data.content)
            $scope.products = response.data.content;
            $scope.multipleSelect = multpipleSelectService;
            $scope.filter.page = parseInt($scope.queryParams['page']);

        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }
    $scope.filterProducts();

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
    $scope.addProductModal = function (product) {
        $scope.array = [];
        $scope.arrayMain = [];
        $scope.arrayimage = [];
        $scope.arrayimageMain = [];
        $scope.product = new Product();
        
        if (product) {
            if (product.parent_id) {
                $scope.product.parent_id = product.parent_id;
            } else {
                $scope.product.parent_id = product.id;
            }
        }

        console.log($scope.product);

        $scope.selectedsize = [];
        $scope.editmode = false;
        angular.forEach(angular.element("input[type='file']"), (inputElem) => angular.element(inputElem).val(null));
        $scope.image_source = "";
        $("#addEditModal").modal("show");
    }

    $scope.dblclick = false;
    $scope.addProduct = function (post) {
        $scope.dblclick = true;
        var post = new FormData();
        
        post.append('file', $scope.coverImage, 'cover');

        angular.forEach($scope.files, function (file, index) {
            post.append('files[]', file, file.priority);
        });

        angular.forEach($scope.filesMain, function (file) {
            post.append('filesMainImages[]', file, file.priority);
        });

        $scope.product.price_discount ? $scope.product.price_discount = 1 : $scope.product.price_discount = 0;
        $scope.product.features = $scope.selectedfeature;
        $scope.product.sizes = $scope.selectedsize;
        console.log($scope.product);
        post.append('post', JSON.stringify($scope.product));
        var request = {
            method: "POST",
            url: `${baseUrl}/product/create`,
            data: post,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Process-Data': false
            }
        }
        console.log(request);

        $http(request).then(function (response) {
            console.log('add prod response ', response);
            $scope.uploadfiles = [];
            $scope.uploadfilesMain = [];
            $("#addEditModal").modal("hide");
            $scope.filterProducts();
            $scope.dblclick = false;
        }, function (response) {
            console.log(response);
            $scope.dblclick = false;
        })
    }

    $scope.editProductModal = function (obj) {
        $scope.array = [];
        $scope.arrayimage = [];
        $scope.editmode = true;
        $scope.selectedsize = [];
        console.log(obj);
        var request = {
            method: "GET",
            url: `${baseUrl}/product/show/${obj.id}`
        }

        $http(request).then(function (response) {
            console.log('data');
            console.log(response);
            $scope.product = response.data;
            $scope.product.price = parseFloat($scope.product.price);
            $scope.product.price_new = parseFloat($scope.product.price_new);
            if ($scope.product.price_discount == 0) {
                $scope.product.price_discount = false;
            } else {
                $scope.product.price_discount = true;
            }
            $scope.selectedsize = [];
            angular.forEach($scope.product.sizes, function (f) {
                for (var i = 0; i < $scope.sizes.length; i++) {
                    if ($scope.sizes[i].id == f.id) {
                        $scope.selectedsize.push($scope.sizes[i]);
                    }
                }
            })

            // $scope.selectedfeature = [];
            // angular.forEach($scope.product.features, function (f) {
            //     $scope.selectedfeature.push(f.id);
            // })
            console.log($scope.selectedsize);
            console.log($scope.product.images)
            if ($scope.product.images) {
                if ($scope.product.images.length > 0) {
                    for (var i = 0; i < $scope.product.images.length; i++) {
                        $scope.arrayimage.push($scope.product.images[i]);
                    }
                }
            }
            $("#addEditModal").modal("show");
        }, function (response) {
            console.log(response);
        })
    }
    $scope.editProduct = function (post) {
        var post = new FormData();
        var file = $scope.coverImage;
        post.append('file', file);
        angular.forEach($scope.uploadfiles, function (file) {
            post.append('files[]', file);
        });
        angular.forEach($scope.uploadfilesMain, function (file) {
            post.append('filesMainImages[]', file);
        });
        if ($scope.product.price_discount == false) {
            $scope.product.price_discount = 0;
        } else {
            $scope.product.price_discount = 1;
        }
        $scope.product.features = $scope.selectedfeature;
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
            $scope.uploadfilesMain = [];
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
        var obj = {
            id: id
        }
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=deleteProduct",
            data: {
                param: obj
            },
            headers: {
                'Content-Type': "application/json"
            }
        }

        $http(request).then(function (response) {
            console.log(response);
            $scope.filterProducts();
            $rootScope.totals();
            $("#deleteModal").modal("hide");
        }, function (response) {
            console.log(JSON.stringify(response))
        })

        //        console.log(id)
        //        productsService.delete(id).then(function (response) {
        //            console.log(response);
        //            $scope.filterProducts();
        //            $rootScope.totals();
        //            $("#deleteModal").modal("hide");
        //        }, function (response) {
        //            console.log(JSON.stringify(response));
        //        })
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
    $scope.selectedfeature = [];
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

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    //SIZES
    $scope.getAllSizes = function () {
        var request = {
            method: "GET",
            url: `${baseUrl}/size`,
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log(response);
            $scope.sizes = response.data;

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
        console.log($scope.selectedfeature)
    };

    // $('.modal').scroll(function() {
    //     const offsetInput = $('.colorpicker-input').offset().top;
    //     $('.colorpicker.dropdown').css({'top': `${offsetInput + 26}px`});
    // })

    // $('.colorpicker-input').click(function() {
    //     console.log('hii');
    //     const offsetInput = $('.colorpicker-input').offset().top;
    //     $('.colorpicker.dropdown').hide();
    //     setTimeout(() => {
    //         $('.colorpicker.dropdown').show();

    //         $('.colorpicker.dropdown').css({'top': `${offsetInput + 26}px`});

    //     }, 10)
    // })

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

    $scope.uploadCoverImage = function (element) {
        var reader = new FileReader();
        reader.onload = function (event) {
            $scope.image_source = event.target.result
            $scope.$apply(($scope) => $scope.coverImage = element.files[0]);
        }
        reader.readAsDataURL(element.files[0]);
    }

    $scope.uploadSliderImages = function (element) {
        $scope.array = [];

        $scope.model[0][0].items = [];
        for (var i = 0; i < element.files.length; i++) {

            $scope.files = [];
            $scope.files = [].slice.call(element.files);
            console.log($scope.files);

            var reader = new FileReader();
            reader.name = element.files[i].name;
            reader.onload = function (event) {
                $scope.obj = {};
                $scope.obj.image_path = event.target.result;
                $scope.obj.image_name = event.target.name;

                $scope.obj.effectAllowed = "all";

                $scope.model[0][0].items.push($scope.obj);
                $scope.array.push($scope.obj);

                $scope.uploadfiles = [];
                console.log(Array.from(element.files))
                for (var i = 0; i < Array.from(element.files).length - 1; i++) {
                    $scope.array[i].priority = i;
                    element.files[i].priority = i;
                }

                $scope.array.push(event.target.result);
                $scope.array.pop();
                $scope.$apply(($scope) => { });
            }
            reader.readAsDataURL(element.files[i]);
        }
    }


    $scope.uploadMainImages = function (element) {
        console.log(element)
        $scope.arrayMain = [];

        $scope.model[0][0].items = [];
        for (var i = 0; i < element.files.length; i++) {

            $scope.filesMain = [];
            $scope.filesMain = [].slice.call(element.files);
            console.log($scope.filesMain);

            var reader = new FileReader();
            reader.name = element.files[i].name;
            reader.onload = function (event) {
                $scope.obj = {};
                $scope.obj.image_path = event.target.result;
                $scope.obj.image_name = event.target.name;
                $scope.obj.color = null;

                $scope.obj.effectAllowed = "all";

                $scope.model[0][0].items.push($scope.obj);
                $scope.arrayMain.push($scope.obj);

                $scope.uploadfilesMain = [];
                console.log(Array.from(element.files))
                for (var i = 0; i < Array.from(element.files).length - 1; i++) {
                    $scope.arrayMain[i].priority = i;
                    element.files[i].priority = i;
                    element.files[i].color = 1;
                }

                $scope.arrayMain.push(event.target.result);
                $scope.arrayMain.pop();
                $scope.$apply(($scope) => { });
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

    //DRAG AND DROP
    $scope.dragoverCallback = function (index, external, type, callback) {
        return index < 10; // Disallow dropping in the third row.
    };

    $scope.dropCallback = function (index, item, external, type) {
        return item;
    };

    $scope.logEvent = function (message) {

    };

    $scope.logListEvent = function (action, index, external, type) {
        var message = external ? 'External ' : '';
        message += type + ' element was ' + action + ' position ' + index;

    };
    // Initialize model
    $scope.model = [[]];
    var id = 10;
    angular.forEach(['all'], function (effect, i) {
        var container = {
            items: [],
            effectAllowed: effect
        };
        for (var k = 0; k < 7; ++k) {
            container.items.push({
                label: effect + ' ' + id++,
                effectAllowed: effect
            });
        }
        $scope.model[i % $scope.model.length].push(container);
    });

    $scope.$watch('array', function (model) {

        for (var i = 0; i < model.length; i++) {
            model[i].priority = i + $scope.arrayimage.length + 1;
        }

        var convArr = Array.from($scope.files);
        $scope.files = convArr;
        $scope.files.sort(function (a, b) {
            return a.priority - b.priority;
        })


        for (var j = 0; j < $scope.files.length; j++) {

            model.forEach(function (f) {
                if (f.image_name == $scope.files[j].name) {
                    $scope.files[j].priority = f.priority;
                    $scope.files[j].name = f.image_name;
                }
            })

        }
        console.log($scope.files);
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.$watch('arrayMain', function (model) {
        console.log(model);
        for (var i = 0; i < model.length; i++) {
            model[i].priority = i + $scope.arrayimage.length + 1;
        }

        var convArr = Array.from($scope.filesMain);
        $scope.filesMain = convArr;
        $scope.filesMain.sort(function (a, b) {
            return a.priority - b.priority;
        })


        for (var j = 0; j < $scope.filesMain.length; j++) {

            model.forEach(function (f) {
                if (f.image_name == $scope.filesMain[j].name) {
                    $scope.filesMain[j].priority = f.priority;
                    $scope.filesMain[j].name = f.image_name;
                }
            })
        }
        console.log($scope.filesMain);
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.$watch('arrayimage', function (model) {
        console.log(model)
        console.log('changed')
        if (model != undefined) {
            for (var i = 0; i < model.length; i++) {
                model[i].priority = i + 1;
            }
        }

    }, true);

    $scope.$watch('arrayimageMain', function (model) {
        console.log(model)
        if (model != undefined) {
            for (var i = 0; i < model.length; i++) {
                model[i].priority = i + 1;
            }
        }

    }, true);

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
