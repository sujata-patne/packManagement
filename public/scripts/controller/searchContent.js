/**
 * Created by sujata.patne on 11-09-2015.
 */

myApp.controller('searchContentCtrl', function ($scope, $window, $http, $stateParams,$state, ngProgress, Search) {
    $('.removeActiveClass').removeClass('active');
    $('#add-search-content').addClass('active');
    $scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
    $scope.pctId = $stateParams.id;
    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.ContentTypeDetails = angular.copy(ContentTypeDetails);
    $scope.Wallpaper = $scope.ContentTypeDetails[0].Manual[0].Wallpaper;
    $scope.contentTypeData = {};

    //$scope.contentTypeData = ['Language','Actor_Actress','Genres','SubGenres','Mood','Photographer']
    Search.getContentTypeDetails($scope.pctId, function(data){
        $scope.packDetails = angular.copy(data.packDetails);
        $scope.packSearchDetails = angular.copy(data.packSearchDetails);
        $scope.packId = $scope.packDetails[0].pk_id;
        $scope.display = $scope.packDetails[0].pk_cnt_display_opt;
        $scope.contentTypeId = $scope.packDetails[0].contentTypeId; //wallpaper
        $scope.ruleType = ($scope.packDetails[0].pk_rule_type) ? $scope.packDetails[0].pk_rule_type : 2; //manual
        $scope.nextRuleDuration = $scope.packDetails[0].pk_nxt_rule_duration;
        $scope.action = 1;
        $scope.noOfRecords = 1;
        $scope.limitCount = 10;

        $scope.Keywords = angular.copy(data.keywords);
        $scope.Language = angular.copy(data.languages);
        $scope.Genres = angular.copy(data.genres);
        $scope.Sub_Genres = angular.copy(data.subgenres);
        $scope.Mood = angular.copy(data.mood);
        $scope.Photographer = angular.copy(data.photographer);
        $scope.Vendor = angular.copy(data.vendor);
        $scope.Property = angular.copy(data.property);
        $scope.Actor_Actress = angular.copy(data.actor_actress);

        $scope.Keywords_id = data.keywords[0].cm_id;
        $scope.Language_id = data.languages[0].cm_id;
        $scope.Genres_id = data.genres[0].cm_id;
        $scope.Sub_Genres_id = data.subgenres[0].cm_id;
        $scope.Mood_id = data.mood[0].cm_id;
        $scope.Photographer_id = data.photographer[0].cm_id;
        $scope.Vendor_id = data.vendor[0].cm_id;
        $scope.Property_id = data.property[0].cm_id;
        $scope.Actor_Actress_id = data.actor_actress[0].cm_id;
        $scope.Content_Title_id = data.content_title[0].cm_id;
        $scope.Content_Ids_id = data.content_id[0].cm_id;

        /*Form Data*/
        var searchCriteriaData = {};
        angular.forEach($scope.packSearchDetails, function (metadataFields){
            if(metadataFields.cm_name === "Content Title"){
                $scope.contentTypeData["Content_Title"] = metadataFields.pcr_metadata_search_criteria;
            }
            if(metadataFields.cm_name === "Property"){
                $scope.contentTypeData["Property"] = metadataFields.pcr_metadata_search_criteria;
            }
            if(metadataFields.cm_name === "Search Keywords"){
                $scope.contentTypeData["Keywords"] = metadataFields.pcr_metadata_search_criteria;
            }
            if(metadataFields.cm_name === "Content Ids"){
                $scope.contentTypeData["Content_Ids"] = metadataFields.pcr_metadata_search_criteria;
            }
            if(metadataFields.cm_name === "Languages"){
                $scope.contentTypeData["Language"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Celebrity"){
                $scope.contentTypeData["Actor_Actress"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Genres"){
                $scope.contentTypeData["Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Sub Genres"){
                $scope.contentTypeData["Sub_Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Mood"){
                $scope.contentTypeData["Mood"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Photographer"){
                $scope.contentTypeData["Photographer"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Vendor"){
                $scope.contentTypeData["Vendor"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
        })
        //console.log($scope.contentTypeData)
        $scope.searchWhere = [
            {cd_id:'start',cd_name:'Title starting with'},
            {cd_id:'end',cd_name:'Title ending with'},
            {cd_id:'anywhere',cd_name:'Anywhere in Title'},
            {cd_id:'exact',cd_name:'Exact Match'}
        ];
        $scope.searchWhereTitle = $scope.searchWhere[0].cd_id;
        $scope.searchWherePropertyTitle = $scope.searchWhere[0].cd_id;

    },function(error){
        //console.log(error)
        toastr.success(error)
    });
    $scope.getContentData = function(){};
    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for(var i=1;i<50;i++) {
        range.push(year - i);
    }
    $scope.years = range;

    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.contentTypeDataDetails = [];
            angular.forEach($scope.contentTypeData,function(value,key){
                var data = {};
                data[$scope[key+'_id']] = value;
                $scope.contentTypeDataDetails.push(data);
            })

            var searchData = {
                contentTypeDataDetails:$scope.contentTypeDataDetails,
                contentTypeData:$scope.contentTypeData,
                packId: $scope.packId,
                contentTypeId: $scope.contentTypeId,
                display: $scope.display,
                pctId: $scope.pctId,
                searchWhereTitle: $scope.searchWhereTitle,
                searchWherePropertyTitle: $scope.searchWherePropertyTitle,
                releaseDurationStart: $scope.releaseDurationStart,
                releaseDurationEnd: $scope.releaseDurationEnd,
                flagForNoOfRecords: $scope.noOfRecords,
                limitCount: $scope.limitCount,
                flagAction: $scope.action,

                ruleType : $scope.ruleType,
                nextRuleDuration : $scope.nextRuleDuration
            }
           // console.log(searchData)
            ngProgress.start();
            Search.saveSearchData(searchData, function (data) {
                if (data.success) {
                    $window.location.href = "/#/show-content-list/"+$scope.pctId+"/"+$scope.limitCount+"/"+$scope.action+"/"+$scope.searchWhereTitle+"/"+$scope.searchWherePropertyTitle;
                    toastr.success(data.message)
                    //Search.addPackSearchResult(data.SearchCriteriaResult);
                    //console.log(data.SearchCriteriaResult)
                    $scope.successvisible = true;
                }
                else {
                    toastr.success(data.message)
                    //$scope.error = data.message;
                    $scope.errorvisible = true;
                }
                ngProgress.complete();
            },function(error){
                console.log(error)
                toastr.success(error)
            });
        }
    }
});