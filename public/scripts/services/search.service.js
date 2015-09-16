myApp.service('Search', ['$http', function ($http) {

	var service = {};
    service.baseRestUrl = '';

    //PrePopulate Add Search form  :
    service.getContentTypeDetails = function (pctId, success, error) {
        $http.get(service.baseRestUrl + '/contentTypeDetails/'+pctId).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.saveSearchData = function (data, success, error) {
        $http.post(service.baseRestUrl + '/saveSearchData', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    
    return service;

}]);