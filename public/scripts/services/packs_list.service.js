myApp.service('PacksList', ['$http', function ($http) {

	var service = {};
    service.baseRestUrl = '';

    //PrePopulate Add Pack form  : 
    service.getPacks = function (success, error ) {
        $http.post(service.baseRestUrl + '/getPacks').success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.getPacksStartsWith = function (data,success, error ) {
        $http.post(service.baseRestUrl + '/getPacksStartsWith',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.getPacksByTitle = function (data,success, error ) {
        $http.post(service.baseRestUrl + '/getPacksByTitle',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    return service;
}]);