var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress','angularUtils.directives.dirPagination','ngFileUpload','validation', 'validation.rule']);
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
})
    .run(function ($state) {
        $state.go("add-pack");
    })