var app = angular.module('estore', ["ngRoute", "ui.bootstrap", "ui.tinymce", "ngSanitize", "dndLists"]);
baseUrl = 'http://localhost/mileeeeeeeeeeeeeeeeeeee/api/index.php';

app.run(function ($rootScope, $http, $window, $location, sessionService) {

    $rootScope.totals = function () {
        var obj = {
            param: {
                email: '',
                pass: ''
            }
        };
        var request = {
            method: "GET",
            url: baseUrl + "/size",
            data: obj,
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + sessionService.get('token')
            }
        }
        $http(request).then(function (response) {
            console.log(response.data);
            $rootScope.total = response.data;
        }, function (response) {
            console.log(JSON.stringify(response));
        })
    };

    $rootScope.totals();

    $rootScope.isLogged = false;
    if (!sessionService.get("token")) {
        $window.location.href = "login.html";
    } else {
        $rootScope.isLogged = true;
    }

    $rootScope.userDropdopn = false;

    var getLoggedUser = function () {
        var obj = {
            param: {
                email: '',
                pass: ''
            }
        };
        var request = {
            method: "POST",
            url: "service-proxy/index.php?api=getLoggedUser",
            data: obj,
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + sessionService.get('token')
            }
        }
        $http(request).then(function (response) {
            $rootScope.loggeduser = response.data.response.result;
        }, function (response) {
            console.log(JSON.stringify(response))
        })
    };
    getLoggedUser();

    $rootScope.logout = function () {
        sessionService.destroy('token');
        $window.location.href = "login.html";
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) { });
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
