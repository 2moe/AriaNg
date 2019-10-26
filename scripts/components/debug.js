(function () {
    'use strict';
    angular.module('ariaNg').component('ariaNgDebug', {
        selector: 'ariaNgDebug',
        template: `<section class="content no-padding ng-cloak" ng-if="$ctrl.enableDebugMode()">
        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a class="pointer-cursor" ng-bind="('format.debug.latest-logs' | translate: {count: $ctrl.logMaxCount})">Latest Logs</a>
                </li>
                <li class="slim">
                    <a class="pointer-cursor" ng-click="$ctrl.reloadLogs()">
                        <i class="fa fa-refresh"></i>
                    </a>
                </li>
            </ul>
            <div class="tab-content no-padding">
                <div class="settings-table striped hoverable">
                    <div class="row" ng-repeat="log in $ctrl.logs | reverse">
                        <div class="col-sm-12">
                            <span class="label label-default" ng-bind="'#' + ($index + 1)"></span>
                            <span ng-bind="log.time | longDate"></span>
                            <span class="label" ng-class="{'DEBUG':'label-default', 'INFO':'label-primary', 'WARN':'label-warning', 'ERROR':'label-danger'}[log.level]" ng-bind="log.level"></span>
                            <span ng-bind="log.content"></span>
                            <a class="pointer-cursor" ng-click="$ctrl.showLogDetail(log)" ng-if="log.attachment"><i class="fa fa-file-o"></i> <span translate>Show Detail</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div id="log-detail-modal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" translate>Log Detail</h4>
                    </div>
                    <div class="modal-body no-padding">
                        <div class="settings-table striped">
                            <div class="row">
                                <div class="col-sm-12">
                                    <span ng-bind="$ctrl.currentLog.time | longDate"></span>
                                    <span class="label" ng-class="{'DEBUG':'label-default', 'INFO':'label-primary', 'WARN':'label-warning', 'ERROR':'label-danger'}[$ctrl.currentLog.level]" ng-bind="$ctrl.currentLog.level"></span>
                                    <span ng-bind="$ctrl.currentLog.content"></span>
                                </div>
                            </div>
                            <div class="row" ng-if="$ctrl.currentLog.attachment">
                                <div class="col-sm-12">
                                    <pre ng-bind="$ctrl.currentLog.attachment | json"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>`,
        controller: ['$rootScope', '$location', '$timeout', 'ariaNgConstants', 'ariaNgLocalizationService', 'ariaNgLogService', 'ariaNgSettingService',
          class ariaNgDebugController {
            constructor ($rootScope, $location, $timeout, ariaNgConstants, ariaNgLocalizationService, ariaNgLogService, ariaNgSettingService) {
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.$timeout = $timeout;
                this.ariaNgConstants = ariaNgConstants;
                this.ariaNgLocalizationService = ariaNgLocalizationService;
                this.ariaNgLogService = ariaNgLogService;
                this.ariaNgSettingService = ariaNgSettingService;
    
                this.logMaxCount = this.ariaNgConstants.cachedDebugLogsLimit;
                this.currentLog = null;
                this.logs = null;

                this.$rootScope.loadPromise = this.$timeout(() => {
                    if (!this.ariaNgSettingService.isEnableDebugMode()) {
                        this.ariaNgLocalizationService.showError('Access Denied!', () => {
                            if (!this.ariaNgSettingService.isEnableDebugMode()) {
                                this.$location.path('/settings/ariang');
                            }
                        })
                        return;
                    }
            
                    this.reloadLogs();
                }, 100)

                $('#log-detail-modal').on('hide.bs.modal', () => {
                    this.currentLog = null;
                })
            }
    
            enableDebugMode () {
                return this.ariaNgSettingService.isEnableDebugMode();
            }
    
            reloadLogs () {
                this.logs = this.ariaNgLogService.getDebugLogs().slice();
            }
    
            showLogDetail (log) {
                this.currentLog = log;
                angular.element('#log-detail-modal').modal();
            }
        }]
    });
}());