myApp.service('Packs', ['$http', function ($http) {

	var service = {};
    service.baseRestUrl = '';

    //PrePopulate Add Pack form  : 
    service.getData = function ( data,success, error ) {
        console.log(service.baseRestUrl + '/getData');
        $http.post(service.baseRestUrl + '/getData',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.getContentTypesByPack = function ( data, success, error ) {
        $http.post(service.baseRestUrl + '/getContentTypesByPack',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.blockUnBlockContentType = function ( data, success, error ) {
        $http.post(service.baseRestUrl + '/blockUnBlockContentType',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }


    service.addPack = function (data,success, error) {
        $http.post(service.baseRestUrl + '/addPack',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }

    service.editPack = function (data,success, error) {
        $http.post(service.baseRestUrl + '/editPack',data).success(function (items) {
            success(items);
        }).error(function (err) {
            error(err);
        });
    }


    

    return service;

}]);