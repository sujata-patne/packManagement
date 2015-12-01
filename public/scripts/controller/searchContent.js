/**
 * Created by sujata.patne on 11-09-2015.
 */
myApp.controller('searchContentCtrl', function ($scope, $window, $state,$http, $stateParams, ngProgress, Search) {

    $('.removeActiveClass').removeClass('active');
    $('#add-search-content').addClass('active');
    $scope.PageTitle = $state.current.name == "search-content-manual" ? "Edit " : "Add ";
    $scope.pctId = $stateParams.pctId;
    $scope.success = "";
    $scope.limitCount = 10;
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');

    $scope.contentTypeData = {};
    $scope.contentTypeDataDetails = [];

    Search.getContentTypeDetails($scope.pctId, function(data){
        $scope.packDetails = angular.copy(data.packDetails);
        $scope.packSearchDetails = angular.copy(data.packSearchDetails);
        $scope.packId = $scope.packDetails[0].pk_id;
        $scope.display = $scope.packDetails[0].pk_cnt_display_opt;
        $scope.displayName = $scope.packDetails[0].displayName;
        $scope.packType = $scope.packDetails[0].type;

        $scope.contentType = {};
        angular.forEach(ContentTypeDetails, function( displayType, displayKey ){
            if( displayKey == $scope.displayName ){
                angular.forEach(displayType, function(contentType, contentIndex ){
                    if( contentIndex == $scope.packType ){
                        $scope.contentType = displayType[contentIndex];
                    }
                });
            }
        });

        $scope.contentTypeId = $scope.packDetails[0].contentTypeId; //wallpaper
        $scope.ruleType = ($scope.packDetails[0].pk_rule_type) ? $scope.packDetails[0].pk_rule_type : 2; //manual
        $scope.nextRuleDuration = $scope.packDetails[0].pk_nxt_rule_duration;
        $scope.action = 1;
        $scope.noOfRecords = 1;
        $scope.Keywords = angular.copy(data.keywords);
        $scope.Language = angular.copy(data.languages);
        $scope.Genres = angular.copy(data.genres);
        $scope.Sub_Genres = angular.copy(data.subgenres);
        $scope.Mood = angular.copy(data.mood);
        $scope.Photographer = angular.copy(data.photographer);
        $scope.Vendor = angular.copy(data.vendor);
        $scope.Property = angular.copy(data.property);
        $scope.Actor_Actress = angular.copy(data.actor_actress);
        $scope.Singer = angular.copy(data.singers);
        $scope.Music_Director = angular.copy(data.music_directors);
        $scope.Adult = angular.copy(data.adult);
        $scope.list = {
            "Keywords_id": (data.keywords[0]) ? data.keywords[0].cm_id : "",
            "Language_id": (data.languages[0]) ? data.languages[0].cm_id : "",
            "Genres_id": (data.genres[0]) ? data.genres[0].cm_id:"",
            "Sub_Genres_id": (data.subgenres[0])? data.subgenres[0].cm_id:"",
            "Mood_id": (data.mood[0])? data.mood[0].cm_id:"",
            "Photographer_id": (data.photographer[0])? data.photographer[0].cm_id:"",
            "Vendor_id": (data.vendor[0])? data.vendor[0].cm_id:"",
            "Property_id": (data.property[0])? data.property[0].cm_id:"",
            "Actor_Actress_id": (data.actor_actress[0])? data.actor_actress[0].cm_id:"",
            "Singer_id": (data.singers[0])? data.singers[0].cm_id:"",
            "Music_Director_id": (data.music_directors[0])? data.music_directors[0].cm_id:"",
            "Content_Title_id" : (data.content_title[0])? data.content_title[0].cm_id:"",
            "Content_Ids_id" : (data.content_id[0])? data.content_id[0].cm_id:"",
            "property_release_year_id" : (data.property_release_year[0])? data.property_release_year[0].cm_id:null,
            "Rules_id" : (data.rules[0])? data.rules[0].cm_id:"",
            "Adult_id" : (data.adult[0])? data.adult[0].cm_id:""
        };

        /*Form Data*/
         /*angular.forEach($scope.packSearchDetails, function (metadataFields){
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
            if(metadataFields.cm_name === "Singers"){
                $scope.contentTypeData["Singer"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Music Directors"){
                $scope.contentTypeData["Music_Director"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if(metadataFields.cm_name === "Nudity"){
                $scope.contentTypeData["Adult"] = parseInt(metadataFields.pcr_metadata_search_criteria);
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
            if(metadataFields.cm_name === "Property Release Year"){
                $scope.contentTypeData["property_release_year"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }

            $scope.contentTypeData['property_release_year'] = {'releaseYearStart':parseInt(metadataFields.pcr_start_year),'releaseYearEnd':parseInt(metadataFields.pcr_end_year)};

        })*/
        $scope.contentTypeData = setContentTypeData($scope.packSearchDetails);
        $scope.contentTypeData['property_release_year'] = {'releaseYearStart': ( $scope.contentTypeData.property_release_year != undefined && ( $scope.contentTypeData.property_release_year.releaseYearStart != undefined || $scope.contentTypeData.property_release_year.releaseYearStart != '') ) ? $scope.contentTypeData.property_release_year.releaseYearStart : null ,
            'releaseYearEnd': ( $scope.contentTypeData.property_release_year !=undefined && ( $scope.contentTypeData.property_release_year.releaseYearEnd != undefined || $scope.contentTypeData.property_release_year.releaseYearEnd != '') ) ? $scope.contentTypeData.property_release_year.releaseYearEnd : null};
        $scope.contentTypeDataDetails = getSearchedfields($scope.contentTypeData, $scope.list)

        $scope.searchWhere = [
            {cd_id:'start',cd_name:'Title starting with'},
            {cd_id:'end',cd_name:'Title ending with'},
            {cd_id:'anywhere',cd_name:'Anywhere in Title'},
            {cd_id:'exact',cd_name:'Exact Match'}
        ];
        $scope.searchWhereTitle = $scope.searchWhere[0].cd_id;
        $scope.searchWherePropertyTitle = $scope.searchWhere[0].cd_id;

    },function(error){
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

    $scope.setLimit = function (option) {
        $scope.limitCount = (option != 1 )? '':10;
    }
    $scope.resetForm = function () {
        $("#radio_noOfRecords").attr('checked', true);
        $("#radio_manualPack").attr('checked', true);
        $("#radio_addselected").attr('checked', true);
    }

    $scope.submitForm = function (isValid) {
        if (isValid) {

            $scope.contentTypeDataDetails = [];
            //angular.forEach($scope.contentTypeData,function(value,key){
            //    var data = {};
            //
            //    if(key == 'property_release_year' ){
            //       if($scope.contentTypeData[key].releaseYearStart > 0 && $scope.contentTypeData[key].releaseYearEnd > 0){
            //           data[$scope.list[key+'_id']] = 1;
            //           $scope.contentTypeDataDetails.push(data)
            //           //$scope.contentTypeDataDetails[$scope[key+'_id']] = 1;
            //       }
            //    }else{
            //        if(value){
            //            data[$scope.list[key+'_id']] = value;
            //            $scope.contentTypeDataDetails.push(data);
            //            //$scope.contentTypeDataDetails[$scope[key+'_id']] = value;
            //        }
            //    }
            //});
            $scope.contentTypeDataDetails = getSearchedfields($scope.contentTypeData, $scope.list)
            console.log($scope.contentTypeDataDetails);
            var searchData = {
                contentTypeDataDetails:$scope.contentTypeDataDetails,
                contentTypeData:$scope.contentTypeData,
                packId: $scope.packId,
                contentTypeId: $scope.contentTypeId,
                display: $scope.display,
                pctId: $scope.pctId,
                searchWhereTitle: $scope.searchWhereTitle,
                searchWherePropertyTitle: $scope.searchWherePropertyTitle,
                releaseYearStart:  $scope.contentTypeData['property_release_year'].releaseYearStart,
                releaseYearEnd: $scope.contentTypeData['property_release_year'].releaseYearEnd,
                flagForNoOfRecords: $scope.noOfRecords,
                limitCount: $scope.limitCount,
                flagAction: $scope.action,
                ruleType : $scope.ruleType,
                nextRuleDuration : $scope.nextRuleDuration
            }

            if(Object.keys($scope.contentTypeDataDetails).length > 0){
            	ngProgress.start();
                Search.saveSearchCriteria(searchData, function (data) {
                    if (data.success) {
                        //$window.location.href = "/#/show-content-list/"+$scope.pctId+"/"+$scope.limitCount+"/"+$scope.action+"/"+$scope.searchWhereTitle+"/"+$scope.searchWherePropertyTitle;

                        var params = {pctId:$scope.pctId,
                            limitCount:$scope.limitCount,
                            action:$scope.action,
                            title:$scope.searchWhereTitle,
                            property:$scope.searchWherePropertyTitle
                        }
                        $state.go('show-content-list', params)
                        $scope.successvisible = true;
                    }
                    else {searchContentCtrl
                        //toastr.success(data.message)
                        //$scope.error = data.message;
                        $scope.errorvisible = true;
                    }
                    ngProgress.complete();
                },function(error){
                    console.log(error)
                    toastr.error(error)
                });
            }else{
                toastr.error('Please add Search criteria')
            }
        }
    }
});
