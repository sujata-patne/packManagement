myApp.controller('addPackCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Packs) {

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

    Packs.getData(function(data){

    	$scope.ContentTypes = data.ContentTypes;
    	$scope.PackTypes = data.PackTypes;
    });

    $scope.submitForm = function (isValid) {
        $scope.successvisible = false;
        $scope.errorvisible = false;
            var packData = {
                pack_name: $scope.packname,
                pack_desc: $scope.packdesc,
                pack_type: $scope.packtype,
                pack_content_type: $scope.selectedContentTypes
            };
        if (isValid) {
            Packs.addEditPack(packData,function(data){
             ngProgress.start();
                if(data.success){

                    $scope.isAdded  = true;
                    $scope.pack_added_name = data.pack_grid[0].pk_name;
                    $scope.type_added_name = data.pack_grid[0].type; 
                    $scope.pack_grid = data.pack_grid;
                    $scope.success = data.message;
                    $scope.successvisible = true;
                }else{
                    $scope.error = data.message;
                    $scope.errorvisible = true;
                }
                ngProgress.complete();
            });
        }
    };



});