app.factory('sessionService', ['$http', '$window', '$location', '$route', '$timeout', function ($http, $window, $location, $route, $timeout) {
    return {
        set: function (key, value) {
            return localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);
        },
        destroy: function (key) {
            return localStorage.removeItem(key);
        }
    }
}])

app.factory('cartService', ['$http', '$window', '$location', '$route', '$timeout', function ($http, $window, $location, $route, $timeout) {
    

    return {
        set: function (key, value) {
            localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);   
        },
        destroy: function (key) {
            return localStorage.removeItem(key);
        }
    }
}])