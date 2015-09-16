var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress']);
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
    ]},
    {'Auto': [
        {'Wallpaper': [
            [{'name': 'Keywords'}, {'type': 'text'}],
            [{'name': 'Language'}, {'type': 'dropdown'}],
            [{'name': 'Actor/Actress'}, {'type': 'dropdown'}],
            [{'name': 'Genres'}, {'type': 'dropdown'}],
            [{'name': 'Sub Genres'}, {'type': 'dropdown'}],
            [{'name': 'Mood'}, {'type': 'dropdown'}],
            [{'name': 'Photographer'}, {'type': 'dropdown'}]
            ]
        }
    ]
}];

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
        .state("add-search-content", {
            templateUrl: "partials/add-search-content.html",
            controller: "searchContentCtrl",
            url: "/add-search-content"
        })
        .state("edit-search-content", {
            templateUrl: "partials/add-search-content.html",
            controller: "searchContentCtrl",
            url: "/edit-search-content/:id"
        })
        .state("add-content-list", {
            templateUrl: "partials/add-content-list.html",
            controller: "contentListCtrl",
            url: "/add-content-list"
        })
        .state("show-content-list", {
            templateUrl: "partials/show-content-list.html",
            controller: "showContentListCtrl",
            url: "/show-content-list"
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