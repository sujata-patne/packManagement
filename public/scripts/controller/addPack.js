myApp.controller('addPackCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress, Packs) {

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
                    $scope.selectedPack = data.pack_grid[0].pk_id;
                    $scope.pack_added_date = data.pack_grid[0].pk_created_on;
                    $scope.pack_modified_date = data.pack_grid[0].pk_modified_on;
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
            },function(error){
                console.log(error)
                toastr.success(error)
            });
        }
    };

    $scope.resetForm = function () {
        $scope.successvisible = false;
        $scope.errorvisible = false;
    }

    $scope.EditPack = function ( pctID ) {
            $window.location.href = "/#/add-search-content/" + pctID;
    }

    $scope.BlockUnBlockContentType = function( packId,contentTypeId, isActive ){
                    var active = 1;
                    if (isActive == 1) {
                        active = 0;
                    }
                    if (confirm("Are you want to sure " + (active == 0 ? 'block' : 'unblock') + ' this plan ?')) {
                        var data = {
                            contentTypeId: contentTypeId,
                            active: active,
                            packId: packId,
                            Status: active == 0 ? 'blocked' : 'unblocked'
                        }
                        ngProgress.start();
                        Packs.blockUnBlockContentType(data, function (data) {
                            if (data.success) {
                                $scope.getContentTypesByPack();
                                $scope.success = data.message;
                                $scope.successvisible = true;
                            }
                            else {
                                $scope.error = data.message;
                                $scope.errorvisible = true;
                            }
                            ngProgress.complete();
                        },function(err){
                            console.log(err);
                        });
                    }
            

    }

$scope.getContentTypesByPack = function(){
            var grid = {
                            packId : $scope.selectedPack
                       };
             Packs.getContentTypesByPack(grid,function(data){
                    $scope.isAdded  = true;
                    $scope.pack_added_date = data.PackContentTypes[0].pk_created_on;
                    $scope.pack_modified_date = data.PackContentTypes[0].pk_modified_on;
                    $scope.pack_added_name = data.PackContentTypes[0].pk_name;
                    $scope.type_added_name = data.PackContentTypes[0].type; 
                    $scope.pack_grid = data.PackContentTypes;
             });
    }
});