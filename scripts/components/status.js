(function () {
  'use strict';
  angular.module('ariaNg').component('ariaNgStatus', {
    selector: 'ariaNgStatus',
    template: `<section class="content no-padding">
        <div class="settings-table striped hoverable">
            <div class="row">
                <div class="setting-key col-sm-4">
                    <span translate>Aria2 RPC Address</span>
                </div>
                <div class="setting-value col-sm-8">
                    <span ng-bind="$ctrl.host"></span>
                </div>
            </div>
            <div class="row">
                <div class="setting-key col-sm-4">
                    <span translate>Aria2 Status</span>
                </div>
                <div class="setting-value col-sm-8">
                    <span class="label" ng-class="{'label-primary': $ctrl.status === 'Connecting', 'label-success': $ctrl.status === 'Connected', 'label-danger': $ctrl.status === 'Disconnected'}"
                        ng-bind="$ctrl.status | translate"></span>
                </div>
            </div>
            <div class="row ng-cloak" ng-if="$ctrl.serverStatus">
                <div class="setting-key col-sm-4">
                    <span translate>Aria2 Version</span>
                </div>
                <div class="setting-value col-sm-8">
                    <span ng-bind="$ctrl.serverStatus.version"></span>
                </div>
            </div>
            <div class="row ng-cloak" ng-if="$ctrl.serverStatus">
                <div class="setting-key col-sm-4">
                    <span translate>Enabled Features</span>
                </div>
                <div class="setting-value col-sm-8">
                    <div class="checkbox checkbox-primary checkbox-compact default-cursor" ng-repeat="feature in $ctrl.serverStatus.enabledFeatures">
                        <input id="{{'feature_' + $index}}" type="checkbox" checked="checked" disabled="disabled" class="default-cursor"/>
                        <label for="{{'feature_' + $index}}" class="text-cursor">
                            <span ng-bind="feature"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="row ng-cloak" ng-if="$ctrl.serverStatus">
                <div class="setting-key setting-key-without-desc col-sm-4">
                    <span translate>Operations</span>
                </div>
                <div class="setting-value col-sm-8">
                    <button class="btn btn-sm btn-primary" ng-click="$ctrl.saveSession()" promise-btn>
                        <span translate>Save Session</span>
                    </button>
                    <button class="btn btn-sm btn-danger" ng-click="$ctrl.shutdown()">
                        <span translate>Shutdown Aria2</span>
                    </button>
                </div>
            </div>
        </div>
    </section>`,
    controller: ['$rootScope', 'ariaNgLocalizationService', 'ariaNgSettingService', 'aria2SettingService', class Aria2StatusController {
        constructor($rootScope, ariaNgLocalizationService, ariaNgSettingService, aria2SettingService) {
            this.$rootScope = $rootScope
            this.ariaNgLocalizationService = ariaNgLocalizationService
            this.ariaNgSettingService = ariaNgSettingService
            this.aria2SettingService = aria2SettingService
            this.host = this.ariaNgSettingService.getCurrentRpcUrl()
            this.status = 'Connecting'
            this.serverStatus = null
            this.loadPromise()
        }

        saveSession () {
            return this.aria2SettingService.saveSession(response => {
                if (response.success && response.data === 'OK') {
                    this.ariaNgLocalizationService.showOperationSucceeded('Session has been saved successfully.')
                }
            })
        }

        shutdown () {
            this.ariaNgLocalizationService.confirm('Confirm Shutdown', 'Are you sure you want to shutdown aria2?', 'warning', () => {
                return this.aria2SettingService.shutdown(response => {
                    if (response.success && response.data === 'OK') {
                        this.ariaNgLocalizationService.showOperationSucceeded('Aria2 has been shutdown successfully.')
                    }
                })
            }, true)
        }

        loadPromise () {
            this.$rootScope.loadPromise = this.aria2SettingService.getAria2Status(response => {
                if (response.success) {
                    this.status = 'Connected'
                    this.serverStatus = response.data
                } else {
                    this.status = 'Disconnected'
                }
            })
        }
    }]
 })
}());