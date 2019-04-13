var app = angular.module('login', ["ngRoute"]);

app.run(function ($rootScope, $http, $window, $location, sessionService) {
    $rootScope.totals = function(){
        var data = {};
        $http.post('php/count.php', data).then(function(response){
            $rootScope.total = response.data;
            console.log(response.data);
        }, function(response){
        })
    }
    $rootScope.totals();




//    $rootScope.isActive = function (route) {
//        return route === $location.path();
//    }
//
//    $rootScope.logout = function(){
//        console.log('saddas')
//        var request = {
//            method: "GET",
//            url: "php/logout.php",
//        }
//        $http(request).then(function (response) {
//            console.log(response);
//            sessionService.destroy('token');
//            $window.location.href="login.html";
//
//        },function error(response) {
//
//            console.log(response);
//        })
//
//    }
//
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
    });
})

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
