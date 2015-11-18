/**
 * Created by sujata.patne on 18-09-2015.
 */
myApp.service('arrangeContents', ['$http', function ($http) {

    var service = {};
    service.baseRestUrl = '';
    service.saveArrangedContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/saveArrangedContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    service.savePublishedContents = function (data, success, error) {
        $http.post(service.baseRestUrl + '/savePublishedContents', data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }
    return service;

}]);