app.directive("addBrand", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/brands/modals/add.html',
        replace: true
    }
})
app.directive("deleteBrand", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/brands/modals/delete.html',
        replace: true
    }
})
