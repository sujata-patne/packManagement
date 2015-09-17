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
    $scope.listpageSize = 5;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypes = [];
    $scope.selectedContentTypes = [];
    $scope.isAdded = false;
    $scope.selectedContent = [];
    $scope.contents = [];

    Search.getSavedContents({pctId:$scope.pctId}, function (data) {
        $scope.searchContentList = angular.copy(data.contents);
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });


})