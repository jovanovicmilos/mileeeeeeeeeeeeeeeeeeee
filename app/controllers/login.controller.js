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
app.controller('loginController', ['$scope', '$timeout', '$http', 'sessionService','$window', 'SweetAlert','$rootScope', function ($scope, $timeout, $http, sessionService, $window, SweetAlert, $rootScope) {
    $scope.user = {
        email: "",
        password: ""
    }
    

    
    $scope.login = function () {
        var obj = {
            param: {
                email: $scope.user.email,
                pass: $scope.user.password
            }
        };
        var request = {
            method: "POST",
            url:"service-proxy/index.php?api=generateToken",
            data: obj,
            headers: {
                'Content-Type': "application/json"
            }
        }
        $http(request).then(function (response) {
            console.log(response)
            if(response.data.error == undefined){
                $rootScope.logged = true;
                sessionService.set("token", response.data.response.result.token);
                $window.location.href = 'index.html';
            }else{
                SweetAlert.swal(response.data.error.message);
                SweetAlert.swal({
                        title: "Error?",
                        text: response.data.error.message,
                        type: "warning",
                        closeOnConfirm: false
                })
            }

        },function (response) {
            console.log(response)
        })
    }

}])
