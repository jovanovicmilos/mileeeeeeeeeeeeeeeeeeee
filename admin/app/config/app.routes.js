app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/', {
        templateUrl: "app/views/products/products.html",
        controller: "productsController"
    })
    .when('/brands', {
        templateUrl: "app/views/brands/brands.html",
        controller: "brandsController"
    })
    .when('/sizes', {
        templateUrl: "app/views/sizes/sizes.html",
        controller: "sizesController"
    })
    .otherwise({redirectTo: '/'});
}])