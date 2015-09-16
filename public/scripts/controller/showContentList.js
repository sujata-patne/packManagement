myApp.controller('showContentListCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Search) {

	$scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
	// $scope.PageTitle = "Add";
    $scope.pctId = $stateParams.id;
    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    $scope.listcurrentPage = 0;
    $scope.listpageSize = 5;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypes = [];
    $scope.selectedContentTypes = [];
    $scope.isAdded = false;
    $scope.action = $stateParams.action;
    console.log($scope.action)
    Search.getPackSearchContents({pctId:$stateParams.pctId, limitCount:$stateParams.limitCount, action:$stateParams.action, title:$stateParams.title, property:$stateParams.property},function(data) {
        $scope.searchContentList = angular.copy(data.searchContentList);
    },function(error){
        //console.log(error)
        toastr.success(error)
    })

    /*Search.getPackSearchResult(function(searchContentList) {
        $scope.searchContentList = angular.copy(searchContentList);
        //console.log($scope.searchContentList)
    })*/
});