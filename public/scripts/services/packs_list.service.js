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
    return service;
}]);