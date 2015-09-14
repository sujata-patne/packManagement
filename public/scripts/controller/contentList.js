myApp.controller('contentListCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Packs, $window) {

	$scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
	// $scope.PageTitle = "Add";
	$scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.isAdded = false;

    Packs.getData(function(data){
        $scope.StorePacks = data.StorePacks;
    });

    $scope.packChange  = function(){
        $scope.getContentTypesByPack();
    };

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

    $scope.EditPack = function ( pctID ) {
            $window.location.href = "/#/edit-search-content/" + pctID;
    }
});