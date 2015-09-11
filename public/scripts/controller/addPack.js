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
    Packs.getData(function(data){

    	$scope.ContentTypes = data.ContentTypes;
    	$scope.PackTypes = data.PackTypes;
    });

    $scope.submitForm = function (isValid) {
        $scope.successvisible = false;
        $scope.errorvisible = false;
        ngProgress.start();
            var packData = {
                pack_name: $scope.packname,
                pack_desc: $scope.packdesc,
                pack_type: $scope.packtype,
                pack_content_type: $scope.selectedContentTypes
            };
        if (isValid) {
            Packs.addEditPack(packData,function(data){
                if(data.success){
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