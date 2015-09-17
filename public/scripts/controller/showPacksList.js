myApp.controller('showPacksListCtrl', function ($scope, $http, $stateParams,$state, ngProgress, PacksList) {
    
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
    $scope.alphabets = [];
    $scope.selectedContentTypes = [];
    $scope.isAdded = false;
    $scope.listcurrentPage = 0;
    $scope.listpageSize = 10;
    //Date Picker :::
    $scope.open1 = false;
    $scope.open2 = false;
    $scope.openDatepicker = function (evt) {
        $scope.open2 = false;
        evt.preventDefault();
        evt.stopPropagation();
        $scope.open1 = !$scope.open1;
    }

    $scope.openEndDatepicker = function (evt1) {
        $scope.open1 = false;
        evt1.preventDefault();
        evt1.stopPropagation();
        $scope.open2 = !$scope.open2;
    }
    //--------------------------


    PacksList.getPacks(function( data ){
            $scope.packContentTypes = [];
            $scope.packsList = data.Packs;
            
    },function(error){
        console.log(error);
    });

    // var first = "A", last = "Z";
    // $scope.alphabets[0] = "1";
    // for(var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
    //         $scope.alphabets[j] =  eval("String.fromCharCode(" + i + ")") + " ";        
    // }
    $scope.alphabets = "1ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    $scope.searchStartsWith = function(alphabet){
            //TODO : Highlight  selected letter in frontend.
            var criteria = {
                term : alphabet
            }
            PacksList.getPacksStartsWith(criteria,function( data ){
                $scope.packsList = data.Packs;
            },function(error){
                console.log(error);
            });
    }

    $scope.searchByTitle = function(){
        //TO DO :Validations
         var criteria = {
                text : $scope.search_title
            }
        PacksList.getPacksByTitle(criteria,function( data ){
                 $scope.packsList = data.Packs;
        },function(error){
                console.log(error);
        });
    }
});