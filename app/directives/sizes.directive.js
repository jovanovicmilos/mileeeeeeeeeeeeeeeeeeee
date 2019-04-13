app.directive("addSize", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/sizes/modals/add.html',
        replace: true
    }
})

app.directive("deleteSize", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/sizes/modals/delete.html',
        replace: true
    }
})



