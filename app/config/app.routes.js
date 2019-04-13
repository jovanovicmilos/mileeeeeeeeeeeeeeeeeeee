app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: "app/views/home.html",
            controller: "productsController"
        })
        .when('/products', {
            templateUrl: "app/views/products.html",
            controller: "productsController"
        })
        .when('/product/:productId', {
            templateUrl: "app/views/product.html",
            controller: "productsController"
        })
        .when('/cart', {
            templateUrl: "app/views/cart.html",
            controller: "productsController"
        })
        .when('/login', {
            templateUrl: "app/views/login.html",
            controller: "loginController"
        })
        .when('/registration', {
            templateUrl: "app/views/registration.html",
            controller: "loginController"
        })
        .otherwise({
            redirectTo: '/'
        });
}])
