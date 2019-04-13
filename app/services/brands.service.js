app.service("brandsService", function($http) {
    return {
        add: function(obj) {
            url = "php/brands/add.php";
            return $http({
                method: "POST",
                url: url,
                data: obj,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Process-Data': false
                }
            })
        },
        edit: function(obj) {
            url = "php/brands/edit.php";
            return $http({
                method: "POST",
                url: url,
                data: obj,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Process-Data': false
                }
            })
        },
        delete: function(id) {
            url = "php/brands/delete.php";
            return $http.post(url, id);
        },
        getAll: function(filter) {
            url = "php/brands/getAll.php";
            return $http.post(url, filter);
        },
        getOne: function(obj) {
            url = "php/brands/getOne.php";
            return $http.post(url, obj);
        },
        getallSelect: function() {
            url = "php/brands/getAllSelect.php";
            return $http.get(url);
        }
    }
})
