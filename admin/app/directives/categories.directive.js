app.directive("addCategory", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/categories/modals/add.html',
        replace: true
    }
})

app.directive("deleteCategory", function () {
    return {
        restrict: 'AE',
        templateUrl: 'app/views/categories/modals/delete.html',
        replace: true
    }
})



