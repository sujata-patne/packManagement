myApp.controller('searchContentRuleCtrl', function ($scope, $window, $http, $stateParams, $state, ngProgress, Search) {
    $('.removeActiveClass').removeClass('active');
    $('#add-search-content').addClass('active');
    $scope.PageTitle = $state.current.name == "edit-store" ? "Edit " : "Add ";
    $scope.pctId = $stateParams.pctId;
    $scope.success = "";
    $scope.limitCount = 5;
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.contentTypeDataDetails = [];
    //$scope.ContentRender = $scope.ContentTypeDetails[1].Auto[0].FullTrack;
    $scope.contentTypeData = {};
    //$scope.contentTypeData = ['Language','Actor_Actress','Genres','SubGenres','Mood','Photographer']
    Search.getContentTypeDetails($scope.pctId, function (data) {
        $scope.packDetails = angular.copy(data.packDetails);
        $scope.packSearchDetails = angular.copy(data.packSearchDetails);
        $scope.packId = $scope.packDetails[0].pk_id;
        $scope.display = $scope.packDetails[0].pk_cnt_display_opt; //463 id of Auto
        $scope.displayName = $scope.packDetails[0].displayName; //Auto
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

        $scope.contentTypeId = $scope.packDetails[0].contentTypeId; //wallpaper / Full track id.
        $scope.ruleType = ($scope.packDetails[0].pk_rule_type) ? $scope.packDetails[0].pk_rule_type : 1; //manual
        $scope.nextRuleDuration = $scope.packDetails[0].pk_nxt_rule_duration;
        $scope.action = 1;
        $scope.noOfRecords = 1;
        $scope.Rules = angular.copy(data.rules);
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

        $scope.Keywords_id = data.keywords[0] ? data.keywords[0].cm_id : '';
        $scope.Language_id = data.languages[0] ? data.languages[0].cm_id : '';
        $scope.Genres_id = data.genres[0].cm_id;
        $scope.Sub_Genres_id = data.subgenres[0].cm_id;
        $scope.Mood_id = data.mood[0].cm_id;
        $scope.Photographer_id = data.photographer[0].cm_id;
        $scope.Vendor_id = data.vendor[0].cm_id;
        $scope.Property_id = data.property[0].cm_id;
        $scope.Actor_Actress_id = data.actor_actress[0].cm_id;
        $scope.Singer_id = data.singers[0].cm_id;
        $scope.Music_Director_id = data.music_directors[0].cm_id;

        $scope.Content_Title_id = data.content_title[0].cm_id;
        $scope.Content_Ids_id = data.content_id[0].cm_id;
        $scope.property_release_year_id = data.property_release_year[0].cm_id;
        $scope.Rules_id = data.rules[0].cm_id;

        /*Form Data*/

        $scope.contentTypeData = setContentTypeData($scope.packSearchDetails);
        $scope.contentTypeData['property_release_year'] = { 'releaseYearStart': '', 'releaseYearEnd': '' };
        $scope.contentTypeData['Rules'] = data.rules[0].cd_id;

        $scope.searchWhere = [
            { cd_id: 'start', cd_name: 'Title starting with' },
            { cd_id: 'end', cd_name: 'Title ending with' },
            { cd_id: 'anywhere', cd_name: 'Anywhere in Title' },
            { cd_id: 'exact', cd_name: 'Exact Match' }
        ];
        $scope.searchWhereTitle = $scope.searchWhere[0].cd_id;
        $scope.searchWherePropertyTitle = $scope.searchWhere[0].cd_id;

    }, function (error) {
        //console.log(error)
        toastr.error(error)
    });
    $scope.getContentData = function () { };
    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for (var i = 1; i < 50; i++) {
        range.push(year - i);
    }
    $scope.years = range;

    $scope.setLimit = function (option) {
        $scope.limitCount = (option != 1) ? '' : 10;
    }
    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.contentTypeDataDetails = [];

            angular.forEach($scope.contentTypeData, function (value, key) {
                var data = {};
                if (key == 'property_release_year') {
                    if ($scope.contentTypeData[key].releaseYearStart > 0 && $scope.contentTypeData[key].releaseYearEnd > 0) {
                        data[$scope[key + '_id']] = 1;
                        $scope.contentTypeDataDetails.push(data);
                    }
                } else {
                    if (value) {
                        data[$scope[key + '_id']] = value;
                        $scope.contentTypeDataDetails.push(data);
                    }
                }
            })
            var searchData = {
                contentTypeDataDetails: $scope.contentTypeDataDetails,
                contentTypeData: $scope.contentTypeData,
                packId: $scope.packId,
                contentTypeId: $scope.contentTypeId,
                display: $scope.display,
                pctId: $scope.pctId,
                searchWhereTitle: $scope.searchWhereTitle,
                searchWherePropertyTitle: $scope.searchWherePropertyTitle,
                releaseYearStart: $scope.contentTypeData['property_release_year'].releaseYearStart,
                releaseYearEnd: $scope.contentTypeData['property_release_year'].releaseYearEnd,
                flagForNoOfRecords: $scope.noOfRecords,
                limitCount: $scope.limitCount,
                flagAction: $scope.action,
                ruleType: $scope.ruleType,
                nextRuleDuration: $scope.nextRuleDuration
            }
            ngProgress.start();
            Search.saveSearchCriteria(searchData, function (data) {
                if (data.success) {
                    // $window.location.href = "/#/show-content-list/"+$scope.pctId+"/"+$scope.limitCount+"/"+$scope.action+"/"+$scope.searchWhereTitle+"/"+$scope.searchWherePropertyTitle;
                    var params = { pctId: $scope.pctId,
                        limitCount: $scope.limitCount,
                        action: $scope.action,
                        title: $scope.searchWhereTitle,
                        property: $scope.searchWherePropertyTitle
                    }
                    $state.go('show-content-list', params)
                    $scope.successvisible = true;
                }
                else {
                    toastr.error(error);
                    //$scope.error = data.message;
                    $scope.errorvisible = true;
                }
                ngProgress.complete();
            }, function (error) {
                toastr.error(error)
            });
        }
    }
});