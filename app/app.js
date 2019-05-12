var app = angular.module('estore', ["ngRoute", "ngSanitize"]);
baseUrl = 'http://localhost/mileeeeeeeeeeeeeeeeeeee/api/index.php';

app.run(function ($rootScope, $http, $window, $location, sessionService ) {
    
 
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
    
    $rootScope.logged = false;
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
            if(response.data.response.status == 200){
                 $rootScope.logged = true;
            }
           
            $rootScope.loggeduser = response.data.response.result;
        }, function (response) {
            console.log(JSON.stringify(response))
        })
    }
    getLoggedUser();
    
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        
        if(!sessionService.get('token')){
            $rootScope.logged = false;
        }
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
