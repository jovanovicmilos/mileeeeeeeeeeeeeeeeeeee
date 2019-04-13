app.service("sizesService", function($http) {
    return {
        add: function(obj) {
            url = "php/sizes/add.php";
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
            url = "php/sizes/edit.php";
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
        getAllSizes: function(obj) {
            url = "php/sizes/getAllSizes.php";
            return $http.post(url, obj);
        },
        getOne: function(filter) {
            url = "php/sizes/getOneSize.php";
            return $http.post(url, filter);
        },
        delete: function(id) {
            url = "php/sizes/delete.php";
            return $http.post(url, id);
        },
        getallSelect: function() {
            url = "php/sizes/getAllSelect.php";
            return $http.get(url);
        }
    }
})
