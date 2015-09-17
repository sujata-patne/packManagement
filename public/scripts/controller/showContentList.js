myApp.controller('showContentListCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress, Search) {

    $scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
    // $scope.PageTitle = "Add";
    $scope.pctId = $stateParams.pctId;
    $scope.limitCount = $stateParams.limitCount;
    $scope.action = $stateParams.action;
    $scope.title = $stateParams.title;
    $scope.property = $stateParams.property;

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
    $scope.selectedContent = [];
    $scope.contents = [];

    Search.getPackSearchContents({
        pctId: $scope.pctId,
        limitCount: $scope.limitCount,
        action: $scope.action,
        title: $scope.title,
        property: $scope.property
    }, function (data) {
        $scope.searchContentList = angular.copy(data.searchContentList);
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });

    Search.getSavedContents({pctId:$scope.pctId}, function (data) {
        data.contents.forEach(function(value){
            $scope.contents.push(value.pc_cm_id);
            $scope.selectedContent[value.pc_cm_id] = true;
        })
        console.log( $scope.contents)
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });
    $scope.addContent = function (id) {
        if ($scope.selectedContent[id] === true) {
            $scope.contents.push(id);
        }
        if ($scope.selectedContent[id] !== true) {
            var idx = $scope.contents.indexOf(id);
            $scope.contents.splice(idx, 1);
        }
        //console.log($scope.contents);
    }

    $scope.saveSearchContents = function () {
        Search.saveSearchContents({pctId:$scope.pctId, selectedContentList:$scope.contents}, function (data) {
            console.log(data)
            $window.location.href = "/#/search-content/"+$scope.pctId;
        },function(error){
            console.log(error)
            toastr.success(error)
        })
    }
})