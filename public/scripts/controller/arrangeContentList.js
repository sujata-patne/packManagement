myApp.controller('arrangeContentListCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress, Search) {

    $scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
    // $scope.PageTitle = "Add";
    $scope.pctId = $stateParams.pctId;

    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    $scope.listcurrentPage = 0;
    $scope.listpageSize = 10;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypes = [];
    $scope.isAdded = false;
    $scope.published = [];
    $scope.sequence = [];

    Search.getSavedContents({pctId:$scope.pctId}, function (data) {
        $scope.searchContentList = angular.copy(data.contents);
        $scope.sequence = angular.copy(data.packContentsSequence);
        $scope.published = angular.copy(data.packContentsPublished);

       // console.log($scope.searchContentList)
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });
    $scope.addMoreSearchContents = function () {
        $scope.arrangedContentList = {};
        angular.forEach($scope.sequence,function(value,key) {
            var data = {};
            data[key] = value;
            $scope.arrangedContentList[key] = value;

        })
        console.log($scope.arrangedContentList)
        Search.arrangeContents({pctId:$scope.pctId, arrangedContentList:$scope.arrangedContentList}, function (data) {
            $window.location.href = "/#/search-content/"+$scope.pctId;
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.success(error)
        })
    }

    $scope.publishContents = function () {
        $scope.publishedContentList = {};

        /*angular.forEach($scope.searchContentList,function(value,key) {
            $scope.publishedContentList[key] = value.cm_id;
        })*/
        angular.forEach($scope.sequence,function(value,key) {
            var data = {};
            data[key] = value;
            $scope.publishedContentList[key] = value;

        })
        //console.log($scope.publishedContentList)
        Search.publishContents({pctId:$scope.pctId, publishedContentList:$scope.publishedContentList}, function (data) {
            //$window.location.href = "/#/search-content/"+$scope.pctId;
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.success(error)
        })
    }
    $scope.saveSearchContents = function(){
        $scope.arrangedContentList = {};

        angular.forEach($scope.sequence,function(value,key) {
            var data = {};
            data[key] = value;
            $scope.arrangedContentList[key] = value;

        })
        //console.log($scope.arrangedContentList)
        Search.arrangeContents({pctId:$scope.pctId, arrangedContentList:$scope.arrangedContentList}, function (data) {
            //$window.location.href = "/#/search-content/"+$scope.pctId;
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.success(error)
        })
    }

})