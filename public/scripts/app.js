/**
 * Created by sujata.patne on 7/6/2015.
 */
var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngProgress']);

myApp.config(function ($stateProvider) {
    $stateProvider
        .state("dashboard", {
            templateUrl: "partials/dashboard.html",
            controller: "dashboardCtrl",
            url: "/"
        })
        .state("add-pack", {
            templateUrl: "partials/add-pack.html",
            controller: "addPackCtrl",
            url: "/add-pack"
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