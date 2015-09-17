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
    service.getPackSearchContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/showContentList',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.saveSearchCriteria = function (data, success, error) {
        $http.post(service.baseRestUrl + '/saveSearchCriteria', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.getSavedContents = function (pctId, success, error) {
        console.log(pctId)
        $http.post(service.baseRestUrl + '/savedContents', pctId).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.saveSearchContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/saveSearchContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.resetSearchCriteriaContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/resetSearchCriteriaContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    return service;

}]);