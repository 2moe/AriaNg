(function () {
    'use strict';

    angular.module('ariaNg').config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/downloading', {
                template: '<list-download/>'
            })
            .when('/waiting', {
                template: '<list-download/>'
            })
            .when('/stopped', {
                template: '<list-download/>'
            })
            .when('/new', {
                template: '<new-task/>'
            })
            .when('/new/:url', {
                template: '',
                controller: 'CommandController'
            })
            .when('/task/detail/:gid', {
                template: '<aria-ng-task-details/>'
            })
            .when('/settings/ariang', {
                templateUrl: 'views/settings-ariang.html',
                controller: 'AriaNgSettingsController'
            })
            .when('/settings/ariang/:extendType', {
                templateUrl: 'views/settings-ariang.html',
                controller: 'AriaNgSettingsController'
            })
            .when('/settings/aria2/basic', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/http-ftp-sftp', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/http', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/ftp-sftp', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/bt', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/metalink', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/rpc', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/aria2/advanced', {
                templateUrl: 'views/settings-aria2.html',
                controller: 'Aria2SettingsController'
            })
            .when('/settings/rpc/set', {
                template: '',
                controller: 'CommandController'
            })
            .when('/settings/rpc/set/:protocol/:host/:port/:interface/:secret?', {
                template: '',
                controller: 'CommandController'
            })
            .when('/debug', {
                template: '<aria-ng-debug/>'
            })
            .when('/status', {
                template: '<aria-ng-status/>'
            })
            .when('/decode-url', {
                template: '<aria-ng-utils-decode/>'
            })
            .otherwise({
                redirectTo: '/downloading'
            });
    }]);
}());
