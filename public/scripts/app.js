var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress','angularUtils.directives.dirPagination','ngFileUpload','validation', 'validation.rule','ngMessages']); 
myApp.directive("compareWithStartDate", function () {
    return {
        restrict: "A",
        require: "?ngModel",
        link: function (scope, element, attributes, ngModel) {
            validateEndDate = function (endDate, startDate) {
                if (endDate && startDate) {
                    return endDate >= startDate;
                }
                else {
                    return true;
                }
            }

            // use $validators.validation_name to do the validation
            ngModel.$validators.checkEndDate = function (modelValue) {
                var startdate = parseInt(attributes.startDate);
                var enddate = parseInt(modelValue);
                return validateEndDate(enddate, startdate);
            };
            
            // use $observe if we need to keep an eye for changes on a passed value
            attributes.$observe('startDate', function (value) {
                var startdate = parseInt(value);
                var enddate = parseInt(ngModel.$viewValue);
                
                // use $setValidity method to determine the validation result 
                // the first parameter is the validation name, this name is the same in ng-message template as well
                // the second parameter sets the validity (true or false), we can pass a function returning a boolean
                ngModel.$setValidity("checkEndDate", validateEndDate(enddate, startdate));
            });
        }
    };
});
var ContentTypeDetails = [
    {'Manual': [
                    {'Wallpaper': [
                                {'Language': 'Language'},
                                {'Actor/Actress': 'Actor_Actress'},
                                {'Genres': 'Genres'},
                                {'Sub Genres': 'Sub_Genres'},
                                {'Mood': 'Mood'},
                                {'Vendor': 'Vendor'},
                                {'Photographer': 'Photographer'}
                            ]
                    },
                    {'FullTrack': [
                                {'Language': 'Language'},
                                {'Actor/Actress': 'Actor_Actress'},
                                {'Singer':'Singer'},
                                {'Music Director':'Music_Director'},
                                {'Vendor': 'Vendor'},
                                {'Genres': 'Genres'},
                                {'Sub Genres': 'Sub_Genres'},
                                {'Mood': 'Mood'}
                            ]
                    }
              ]
    },
    {'Auto': [
                    {'FullTrack': [
                                {'Language': 'Language'},
                                {'Actor/Actress': 'Actor_Actress'},
                                {'Singer':'Singer'},
                                {'Music Director':'Music_Director'},
                                {'Vendor': 'Vendor'},
                                {'Genres': 'Genres'},
                                {'Sub Genres': 'Sub_Genres'},
                                {'Mood': 'Mood'}
                            ]
                    }
              ]
    },
	{ 'Rule Based': [
                     { 'FullTrack': [
                                { 'Language': 'Language' },
                                { 'Actor/Actress': 'Actor_Actress' },
                                { 'Singer': 'Singer' },
                                { 'Music Director': 'Music_Director' },
                                { 'Vendor': 'Vendor' },
                                { 'Genres': 'Genres' },
                                { 'Sub Genres': 'Sub_Genres' },
                                { 'Mood': 'Mood' }
                            ]
                     }
              ]
    }
];
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
myApp.config(function ($stateProvider) {
    $stateProvider
        .state("add-pack", {
            templateUrl: "partials/add-pack.html",
            controller: "addPackCtrl",
            url: "/add-pack"
        })
        .state("edit-pack", {
            templateUrl: "partials/add-pack.html",
            controller: "addPackCtrl",
            url: "/edit-pack/:id"
        })
        .state("search-content-manual", {
            templateUrl: "partials/add-search-content.html",
            controller: "searchContentCtrl",
            url: "/search-content-manual/:pctId"
        })
        .state("search-content-auto", {
            templateUrl: "partials/add-search-content-auto.html",
            controller: "searchContentAutoCtrl",
            url: "/search-content-auto/:pctId"
        })
        .state("search-content-rule", {
            templateUrl: "partials/add-search-content-rule.html",
            controller: "searchContentRuleCtrl",
            url: "/search-content-rule/:id"
        })
        .state("add-content-list", {
            templateUrl: "partials/add-content-list.html",
            controller: "contentListCtrl",
            url: "/add-content-list"
        })
        .state("show-content-list", {
            templateUrl: "partials/show-content-list.html",
            controller: "showContentListCtrl",
            url: "/show-content-list/:pctId/:limitCount/:action/:title/:property"
        })
        .state("arrange-content-list", {
            templateUrl: "partials/arrange-content-list.html",
            controller: "arrangeContentListCtrl",
            url: "/arrange-content-list/:pctId"
        })
        .state("show-packs-list", {
            templateUrl: "partials/show-packs-list.html",
            controller: "showPacksListCtrl",
            url: "/show-packs-list"
        })
        .state('users', {
            templateUrl: 'partials/add-edit-users.html',
            controller: 'usersCtrl',
            url: '/users'
        })
        .state('accountforgot', {
            templateUrl: 'partials/account-changepassword.html',
            controller: '',
            url: '/accountforgot'
        })
        .state("changepassword", {
            templateUrl: 'partials/account-changepassword.html',
            controller: 'usersCtrl',
            url: '/changepassword'
        })
}).run(function ($state) {
    $state.go("add-pack");
})