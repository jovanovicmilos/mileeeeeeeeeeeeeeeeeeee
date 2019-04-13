app.service("productsService", function($http) {
    return {
        add: function(obj) {
            url = "php/products/add.php";
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
            url = "php/products/edit.php";
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
            url = "php/products/delete.php";
            return $http.post(url, id);
        },
        getAll: function(filter) {
            url = "php/products/getAll.php";
            return $http.post(url, filter);
        },
        getOne: function(obj) {
            url = "php/products/getOne.php";
            return $http.post(url, obj);
        }
       
//        getallFeatures: function(obj) {
//            url = "php/products/getAll.php";
//            return $http.post(url, obj);
//        },
//		getallFeaturesWithGroups: function(obj) {
//            url = "php/products/getAllWtihGroups.php";
//            return $http.post(url, obj);
//        },
//        getallMunicipalities: function(obj) {
//            url = "php/municipalities/getAll.php";
//            return $http.post(url, obj);
//        },
//        getallLocations: function(obj) {
//            url = "php/locations/getAll.php";
//            return $http.post(url, obj);
//        },
//        getallSettlements: function(obj) {
//            url = "php/settlements/getAll.php";
//            return $http.post(url, obj);
//        },
//        getallAgents: function(obj) {
//            url = "php/agents/getAll.php";
//            return $http.post(url, obj);
//        },
//        getallTypes: function(obj) {
//            url = "php/types/getAll.php";
//            return $http.post(url, obj);
//        }
       
    }
})