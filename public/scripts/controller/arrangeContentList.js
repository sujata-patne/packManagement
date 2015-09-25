myApp.controller('arrangeContentListCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress,Upload, Search,arrangeContents) {


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
        $scope.packDetails = angular.copy(data.packDetails);

        $scope.contentType = $scope.packDetails[0].type;
        $scope.display = $scope.packDetails[0].pk_cnt_display_opt;
        $scope.displayName = $scope.packDetails[0].displayName;
        $scope.packName = $scope.packDetails[0].pk_name;
 
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });

    $scope.checkForDuplicates = function(id) {
    	var unique = [];
    	var duplicate = [];
    	var previous_value = 0;
        angular.forEach($scope.sequence,function(value,key) {
        	if( unique.length == 0 ) {
                unique.push( parseInt( value ) );
            } else if( unique.indexOf(parseInt( value ) ) == -1 ) {
                unique.push( parseInt( value ) );
            } else {
            	duplicate.push( parseInt( value ) );
            }
        	$scope.unique = unique;
        	$scope.duplicate = duplicate;
        });
        if( $scope.duplicate.length > 0 ) {
        	toastr.error("Duplicate values not allowed!");
        	$scope.sequence[id] = "";
        }
    }
    
    $scope.arrangeContent = function () {
        $scope.arrangedContentList = {};
        angular.forEach($scope.sequence,function(value,key) {
            var data = {};
            data[key] = value;
            $scope.arrangedContentList[key] = value;
        })
    }
    $scope.addMoreSearchContents = function () {
        $scope.arrangeContent();
        console.log('test '+$scope.pctId)
        arrangeContents.saveArrangedContents({pctId:$scope.pctId, arrangedContentList:$scope.arrangedContentList}, function (data) {
            //$window.location.href = "/#/search-content/"+$scope.pctId;
            var filename = 'search-content-'+$scope.displayName.toLowerCase()
            $state.go(filename, {pctId:$scope.pctId})
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.error(error)
        })
    }

    $scope.savePublishedContents = function () {
        $scope.arrangeContent(); 
        arrangeContents.savePublishedContents({pctId:$scope.pctId, arrangedContentList:$scope.arrangedContentList}, function (data) {
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.error(error)
        })
    }

    $scope.saveArrangedContents = function(){
        $scope.arrangeContent();
        arrangeContents.saveArrangedContents({pctId:$scope.pctId, arrangedContentList:$scope.arrangedContentList}, function (data) {
            if( data.error === true ) {
            	toastr.error(data.message);
            }else {
            	toastr.success(data.message);
            }
        },function(error){
            console.log(error)
            toastr.error(error)
        })
    }

    $(".progress").hide();


    $scope.fileUploads = [];
    $scope.uploadSubmit = function(index,cm_id){
             $scope.files = $scope.fileUploads;
             var valid = true;
             if($scope.files.length == 0){
                valid = false;
                toastr.error("Please select images to upload.");
             }
             if($scope.files[index].length > 2){
                valid = false;
                toastr.error("Max 2 files allowed per content type");
             }

             if(valid){
                      angular.forEach($scope.files[index], function(file) {
                        if (file && !file.$error) {
                            file.upload = Upload.upload({
                              url: '/UploadFile',
                              fields: {'cm_id': cm_id},
                              file: file
                            });

                            file.upload.then(function (response) {
                              $timeout(function () {
                                file.result = response.data;
                              });
                            }, function (response) {
                              if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                            });

                            file.upload.progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                                $("#"+index).html("Uploaded: "+progressPercentage+"%");
                                $scope.fileUploads[index].progress = Math.min(100, parseInt(100.0 * 
                                                       evt.loaded / evt.total));

                                if( progressPercentage == 100 ){
                                    window.location.reload();
                                }
                            });
                        }   
                     }); 
             }
           
    }

    $(document).ready(function() {
        // $("a.grouped_elements").fancybox();
        $("a.grouped_elements").fancybox({
            'transitionIn'  :   'elastic',
            'transitionOut' :   'elastic',
            'speedIn'       :   600, 
            'speedOut'      :   200, 
            'maxWidth'      :   400,
            'maxHeight'     :   400,
            'modal'         : false,
            'closeBtn'      : true
        });
    });
})