app.directive("addProduct", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/products/modals/add.html',
        replace: true
    }
})
app.directive("deleteProduct", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/products/modals/delete.html',
        replace: true
    }
})
app.directive("detailProduct", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/products/modals/details.html',
        replace: true
    }
})


