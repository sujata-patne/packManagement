myApp.controller('showContentListCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Packs) {

	$scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
	// $scope.PageTitle = "Add";
	$scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypes = [];
    $scope.selectedContentTypes = [];
    $scope.isAdded = false;

    $scope.contentList = [{id:1,title:'Dil dhadakne do',property_name:'Zindagi na milegi',release_yr:2011,singer:'xyz'},
                          {id:2,title:'Aa Zara',property_name:'Murder 2',release_yr:2010,singer:'abc'}
                        ];
    
});