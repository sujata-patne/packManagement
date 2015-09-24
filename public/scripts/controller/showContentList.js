myApp.controller('showContentListCtrl', function ($scope, $timeout, $http, $stateParams,$state, ngProgress, Search,showContents) {
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
    $scope.listpageSize = 10;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypes = [];
    $scope.selectedContentTypes = [];
    $scope.isAdded = false;
    $scope.action = $stateParams.action;
    $scope.selectedContent = [];
    $scope.removedContent = [];
    $scope.contents = [];
    Search.getPackSearchContents({pctId: $scope.pctId, limitCount: $scope.limitCount, action: $scope.action, title: $scope.title, property: $scope.property}, function (data) {
        $scope.searchContentList = angular.copy(data.searchContentList);
        $scope.packDetails = angular.copy(data.packDetails);

        $scope.contentType = $scope.packDetails[0].type;
        $scope.parentType = $scope.packDetails[0].parent_type;
        $scope.display = $scope.packDetails[0].pk_cnt_display_opt;
        $scope.displayName = $scope.packDetails[0].displayName;
        $scope.packName = $scope.packDetails[0].pk_name;
        $scope.searchContentList.forEach(function(value){
            $scope.removedContent.push(value.cm_id);
        });
    }, function (error) {
        //console.log(error)
        toastr.success(error)
    });

    Search.getSavedContents({pctId:$scope.pctId}, function (data) {
        $scope.contents = [];
        $scope.unselectedContents = [];
        data.contents.forEach(function(value){
            if($scope.action == 1){ // add option
                $scope.contents.push(value.pc_cm_id);
            } 
            $scope.selectedContent[value.pc_cm_id] = true;
        })
        if($scope.action == 2){ // remove option

            angular.forEach($scope.removedContent, function(value, key){
                $scope.contents.push(value);
            })
        } 
    }, function (error) { 
        toastr.success(error)
    });

    $scope.addSelectedContents = function (id) {

        if ($scope.selectedContent[id] === true) {
            $scope.contents.push(id);
        }
        if ($scope.selectedContent[id] !== true) {
            var idx = $scope.contents.indexOf(id);
            $scope.contents.splice(idx, 1);
            $scope.unselectedContents.push(id);
        }
    }


    $scope.removeContent = function (id) {
        $scope.contents = [];
        $scope.selectedContent = [];
        var idx = $scope.removedContent.indexOf(id);

        $scope.removedContent.splice(idx, 1);
        $scope.searchContentList.splice(idx, 1);
        $scope.unselectedContents.push(id);

        angular.forEach($scope.removedContent, function(value, key){
            $scope.contents.push(value);
        })
        console.log($scope.unselectedContents)
    }

    $scope.addMoreSearchContents = function () {
        showContents.showArrangeContents({pctId:$scope.pctId, selectedContentList:$scope.contents,unselectedContentsList:$scope.unselectedContents}, function (data) {
            //$window.location.href = "/#/search-content/"+$scope.pctId;
            var filename = 'search-content-'+$scope.displayName.toLowerCase()
            $state.go(filename, {pctId:$scope.pctId}) 
        },function(error){
            console.log(error)
            toastr.error(error)
        })
    }

    $scope.showPublishContents = function (displayName) {
       if(displayName == 'Auto'){
                angular.forEach($scope.searchContentList,function(value){
                    // $scope.contents.push(value);
                    //$scope.addSelectedContents(value.cm_id);
                    $scope.contents.push(value.cm_id);
                });
                if($scope.contents.length > 0){
                        showContents.showPublishContents({pctId:$scope.pctId, selectedContentList:$scope.contents,unselectedContentsList:$scope.unselectedContents}, function (data) {
                            //$window.location.href = "/#/arrange-content-list/"+$scope.pctId;
                            // $state.go('arrange-content-list', {pctId:$scope.pctId})
                            toastr.success(data.message)
                        },function(error){
                            console.log(error)
                            toastr.error(error)
                        });
                    }
       }else{
                    if($scope.contents.length > 0){
                        showContents.showPublishContents({pctId:$scope.pctId, selectedContentList:$scope.contents,unselectedContentsList:$scope.unselectedContents}, function (data) {
                            //$window.location.href = "/#/arrange-content-list/"+$scope.pctId;
                            $state.go('arrange-content-list', {pctId:$scope.pctId})
                            toastr.success(data.message)
                        },function(error){
                            console.log(error)
                            toastr.error(error)
                        })
                    }else{
                        toastr.error('Please select at least one record to publish!')
                    }
       }
    }

    $scope.showArrangeContents = function () {
        console.log($scope.contents)
        if($scope.contents.length > 0){
            showContents.showArrangeContents({pctId:$scope.pctId, selectedContentList:$scope.contents,unselectedContentsList:$scope.unselectedContents}, function (data) {
                //$window.location.href = "/#/arrange-content-list/"+$scope.pctId;
                $timeout(function(){
                    $state.go('arrange-content-list', {pctId:$scope.pctId})
                    toastr.success(data.message)
                },1000)


            },function(error){
                console.log(error)
                toastr.error(error)
            })
        }else{
            toastr.error('Please select at least one record to arrange!')
        }
    }

    $scope.showResetRules = function () {
        showContents.showResetRules({pctId:$scope.pctId}, function (data) {
            //$window.location.href = "/#/search-content/"+$scope.pctId;
            var filename = 'search-content-'+$scope.displayName.toLowerCase()
            console.log(filename)
            $state.go(filename, {pctId:$scope.pctId})
            toastr.success(data.message)
        },function(error){
            console.log(error)
            toastr.error(error)
        })

    }



    $(document).ready(function() {

        // $("a.grouped_elements").fancybox();

        $("a.grouped_elements").fancybox({
            'transitionIn'  :   'elastic',
            'transitionOut' :   'elastic',
            'speedIn'       :   600, 
            'speedOut'      :   200, 
            // 'overlayShow'   :   false,
            'showCloseButton' : true
        });
    
    });
})