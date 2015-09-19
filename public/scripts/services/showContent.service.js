/**
 * Created by sujata.patne on 18-09-2015.
 */
myApp.service('showContents', ['$http', function ($http) {

    var service = {};
    service.baseRestUrl = '';
    service.showArrangeContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/showArrangeContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.showPublishContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/showPublishContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.showResetRules = function (data, success, error) {
        $http.post(service.baseRestUrl + '/showResetRules', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    return service;

}]);