myApp.controller('addPackCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress, Packs) {
    $('.removeActiveClass').removeClass('active');
    $('#add-pack').addClass('active');
	$scope.PageTitle = $state.current.name == "edit-pack" ? "Edit " : "Add ";
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
    $scope.edit_mode = false;
    var preData;
    //Used for prepopulating add pack page.
    preData = {
            state : "add-pack"
        }
    if($stateParams.id){
            //Change predata  for edit mode accordingly.
            $scope.edit_mode = true;
            preData.state  = "edit-pack";
            preData.packId = $stateParams.id;
    }
   

    Packs.getData(preData,function( data ){
        if($stateParams.id){
                $scope.packname = data.PackDetails[0].pk_name;
                $scope.packdesc = data.PackDetails[0].pk_desc;
                $scope.packtype = data.PackDetails[0].pk_cnt_display_opt;
                $scope.selectedContentTypes = [];
                data.PackDetails.forEach(function(el){
                     $scope.selectedContentTypes.push(el.cd_id);
                });
        }
    	$scope.ContentTypes = data.ContentTypes;
    	$scope.PackTypes = data.PackTypes;
    },function(error){
        console.log(error);
    });

    $scope.submitForm = function ( isValid ) {
        $scope.successvisible = false;
        $scope.errorvisible = false;
            var packData = {
                pack_name: $scope.packname,
                pack_desc: $scope.packdesc,
                pack_type: $scope.packtype,
                pack_content_type: $scope.selectedContentTypes
            };
        if (isValid) {
            if($stateParams.id){
                    packData.packId = $stateParams.id;
                    ngProgress.start();
                    Packs.editPack(packData,function(data){
                       $scope.result(data);
                        
                    },function(error){
                        console.log(error);
                    });
                    ngProgress.complete();
            }else{
                    Packs.addPack(packData,function(data){
                         ngProgress.start();
                         $scope.result(data);   
                         ngProgress.complete();
                    },function(error){
                        console.log(error);
                    });
            }
        }
    };

    $scope.result = function( data ){
         if(data.success){
                $scope.getResultData(data);
                $scope.success = data.message;
                $scope.successvisible = true;
         }else{
                $scope.error = data.message;
                $scope.errorvisible = true;
         }
    }

    $scope.getResultData = function( data ){
        $scope.isAdded  = true;
        $scope.selectedPack = data.pack_grid[0].pk_id;
        $scope.pack_added_date = data.pack_grid[0].pk_created_on;
        $scope.pack_modified_date = data.pack_grid[0].pk_modified_on;
        $scope.pack_added_name = data.pack_grid[0].pk_name;
        $scope.type_added_name = data.pack_grid[0].type; 
        $scope.pack_grid = data.pack_grid;
    }


    $scope.resetForm = function () {
        $scope.successvisible = false;
        $scope.errorvisible = false;
        $scope.isAdded = false;
    }

    $scope.EditPack = function ( pctID,type_added_name ) {
        type_added_name = type_added_name.toLowerCase() == "rule based" ? "rule" : type_added_name.toLowerCase();
        // $window.location.href = "/#/search-content-"+displayName+"/" + pctID;
        $state.go('search-content-'+type_added_name, {pctId:pctID}); 
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

    $scope.showArrangeList = function ( pctID ) {
        // $window.location.href = "/#/arrange-content-list/"+pctID;
         $state.go('arrange-content-list', {pctId:pctID}); 

    }
});