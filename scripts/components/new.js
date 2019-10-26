(function () {
  'use strict';
  angular.module('ariaNg').component('newTask', {
    selector: 'newTask',
    template: `
    <section class="content no-padding">
    <form name="newTaskForm" ng-submit="$ctrl.startDownload()" novalidate>
        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
                <li ng-class="{'active': $ctrl.context.currentTab === 'links'}">
                    <a class="pointer-cursor" ng-click="$ctrl.changeTab('links')" ng-bind="($ctrl.context.taskType === 'torrent' ? 'Torrent File' : ($ctrl.context.taskType === 'metalink' ? 'Metalink File' : 'Links') | translate)">Links</a>
                </li>
                <li ng-class="{'active': $ctrl.context.currentTab === 'options'}">
                    <a class="pointer-cursor" ng-click="$ctrl.changeTab('options')" translate>Options</a>
                </li>
                <li class="divider"></li>
                <li class="nav-toolbar">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-folder-open-o fa-1_1x"></i>
                        </button>
                        <ul class="dropdown-menu right-align">
                            <li><a class="pointer-cursor" ng-click="$ctrl.openTorrent()" translate>Open Torrent File</a></li>
                            <li><a class="pointer-cursor" ng-click="$ctrl.openMetalink()" translate>Open Metalink File</a></li>
                        </ul>
                    </div>
                    <div class="btn-group">
                        <button type="submit" class="btn btn-sm"
                                ng-class="{'btn-default': !$ctrl.context.uploadFile && newTaskForm.$invalid, 'btn-success': $ctrl.context.uploadFile || !newTaskForm.$invalid}"
                                ng-disabled="!$ctrl.context.uploadFile && newTaskForm.$invalid" translate>Download Now
                        </button>&nbsp;
                        <button type="button" class="btn btn-sm dropdown-toggle"
                                ng-class="{'btn-default': !$ctrl.context.uploadFile && newTaskForm.$invalid, 'btn-success': $ctrl.context.uploadFile || !newTaskForm.$invalid}"
                                ng-disabled="!$ctrl.context.uploadFile && newTaskForm.$invalid" data-toggle="dropdown">
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu right-align">
                            <li><a class="pointer-cursor" ng-click="$ctrl.startDownload(true)" translate>Download Later</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        
            <div class="tab-content no-padding">
                <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'links'}">
                    <div class="new-task-table" ng-if="$ctrl.context.taskType === 'urls'">
                        <div class="row">
                            <div class="col-sm-12">
                                <p ng-bind="'format.task.new.download-links' | translate: {count: $ctrl.getValidUrlsCount()}">Download Links:</p>
                                <div class="form-group has-feedback no-margin" ng-class="{ 'has-error' : newTaskForm.urls.$invalid && newTaskForm.urls.$dirty, 'has-success' : newTaskForm.urls.$valid && newTaskForm.urls.$dirty }">
                                    <textarea name="urls" class="form-control" rows="10" ng-auto-focus ng-valid-urls
                                              ng-model="$ctrl.context.urls" ng-required="true" ng-keydown="$ctrl.urlTextboxKeyDown($event)"
                                              ng-placeholder="'Support multiple URLs, one URL per line.' | translate"></textarea>
                                    <div class="form-control-icon" ng-if="newTaskForm.urls.$dirty">
                                        <i class="fa form-control-feedback" ng-class="{'fa-check':newTaskForm.urls.$valid, 'fa-times':newTaskForm.urls.$invalid}"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="new-task-table" ng-if="$ctrl.context.taskType === 'torrent' || $ctrl.context.taskType === 'metalink'">
                        <div class="row">
                            <div class="col-sm-12">
                                <p translate>File Name:</p>
                                <input class="form-control" ng-value="$ctrl.context.uploadFile ? $ctrl.context.uploadFile.fileName : ''" readonly="readonly"/>
                            </div>
                        </div>
                    </div>
                    <input id="file-holder" type="file" style="display: none"/>
                </div>
                
                <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'options'}">
                    <div class="settings-table striped hoverable">
                        <div class="settings-table-title new-task-filter-title">
                            <div class="row">
                                <div class="col-sm-12">
                                    <span translate>Filters</span><span>:&nbsp;</span>
                                    <div class="checkbox checkbox-inline checkbox-primary">
                                        <input id="optionFilterGlobal" type="checkbox" ng-model="$ctrl.context.optionFilter['global']"/>
                                        <label for="optionFilterGlobal" translate>Global</label>
                                    </div>
                                    <div class="checkbox checkbox-inline checkbox-primary">
                                        <input id="optionFilterHttp" type="checkbox" ng-model="$ctrl.context.optionFilter['http']"/>
                                        <label for="optionFilterHttp" translate>Http</label>
                                    </div>
                                    <div class="checkbox checkbox-inline checkbox-primary">
                                        <input id="optionFilterBittorrent" type="checkbox" ng-model="$ctrl.context.optionFilter['bittorrent']"/>
                                        <label for="optionFilterBittorrent" translate>BitTorrent</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <ng-setting ng-repeat="option in $ctrl.context.availableOptions" 
                          ng-if="$ctrl.context.globalOptions && $ctrl.context.optionFilter[option.category]" option="option"
                          default-value="$ctrl.context.globalOptions[option.key]"
                          on-change-value="$ctrl.setOption(key, value, optionStatus)">
                        </ng-setting>

                    </div>
                </div>
            </div>
        </div>
    </form>
    </section>`,
    controller: ['$rootScope', '$location', '$timeout', 'ariaNgCommonService', 'ariaNgLocalizationService', 
        'ariaNgLogService', 'ariaNgFileService', 'ariaNgSettingService', 'aria2TaskService', 'aria2SettingService',
        class NewTaskComponent {
            constructor ($rootScope, $location, $timeout, ariaNgCommonService, ariaNgLocalizationService, 
            ariaNgLogService, ariaNgFileService, ariaNgSettingService, aria2TaskService, aria2SettingService)
        {
            this.$rootScope = $rootScope
            this.$location = $location
            this.$timeout = $timeout
            this.ariaNgCommonService = ariaNgCommonService
            this.ariaNgLocalizationService = ariaNgLocalizationService
            this.ariaNgLogService = ariaNgLogService
            this.ariaNgFileService = ariaNgFileService
            this.ariaNgSettingService = ariaNgSettingService
            this.aria2TaskService = aria2TaskService
            this.aria2SettingService = aria2SettingService
    
            this.tabOrders = ['links', 'options']
            this.parameters = this.$location.search()
    
            this.context = {
                currentTab: 'links',
                taskType: 'urls',
                urls: '',
                uploadFile: null,
                availableOptions: (() => {
                    let keys = this.aria2SettingService.getNewTaskOptionKeys()
                    return this.aria2SettingService.getSpecifiedOptions(keys, {
                        disableRequired: true
                    })
                })(),
                globalOptions: null,
                options: {},
                optionFilter: {
                    global: true,
                    http: false,
                    bittorrent: false
                }
            }
    
            if (this.parameters.url) {
                try {
                    this.context.urls = this.ariaNgCommonService.base64UrlDecode(this.parameters.url)
                } catch (ex) {
                    this.ariaNgLogService.error('[NewTaskController] base64 decode error, url=' + this.parameters.url, ex)
                }
            }
    
            this.$rootScope.swipeActions.extentLeftSwipe = () => {
                let tabIndex = this.tabOrders.indexOf(this.context.currentTab)
    
                if (tabIndex < this.tabOrders.length - 1) {
                    this.changeTab(this.tabOrders[tabIndex + 1])
                    return true
                } else {
                    return false
                }
            };
    
            this.$rootScope.swipeActions.extentRightSwipe = () => {
                let tabIndex = this.tabOrders.indexOf(this.context.currentTab)
    
                if (tabIndex > 0) {
                    this.changeTab(this.tabOrders[tabIndex - 1])
                    return true
                } else {
                    return false
                }
            }
    
            this.$rootScope.loadPromise = this.$timeout(() => {}, 100)
        }
    
        saveDownloadPath (options) {
            if (!options || !options.dir) return
            this.aria2SettingService.addSettingHistory('dir', options.dir)
        }
    
        downloadByLinks (pauseOnAdded, responseCallback) {
            let urls = this.ariaNgCommonService.parseUrlsFromOriginInput(this.context.urls)
            let options = angular.copy(this.context.options)
            let tasks = [];
    
            for (let i = 0; i < urls.length; i++) {
                if (urls[i] === '' || urls[i].trim() === '') {
                    continue
                }
    
                tasks.push({
                    urls: [urls[i].trim()],
                    options: options
                });
            }
    
            this.saveDownloadPath(options)
    
            return this.aria2TaskService.newUriTasks(tasks, pauseOnAdded, responseCallback)
        }
    
        downloadByTorrent (pauseOnAdded, responseCallback) {
            let task = {
                content: this.context.uploadFile.base64Content,
                options: angular.copy(this.context.options)
            }
    
            this.saveDownloadPath(task.options)
    
            return this.aria2TaskService.newTorrentTask(task, pauseOnAdded, responseCallback)
        }
    
        downloadByMetalink (pauseOnAdded, responseCallback) {
            let task = {
                content: this.context.uploadFile.base64Content,
                options: angular.copy(this.context.options)
            }
    
            this.saveDownloadPath(task.options)
    
            return this.aria2TaskService.newMetalinkTask(task, pauseOnAdded, responseCallback)
        }
    
        changeTab (tabName) {
            if (tabName === 'options') {
                this.loadDefaultOption()
            }
    
            this.context.currentTab = tabName
        }
    
        loadDefaultOption () {
            if (this.context.globalOptions) return
            return this.$rootScope.loadPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.aria2SettingService.getGlobalOption(response => {
                        if (response.success) {
                            this.context.globalOptions = response.data
                            resolve()
                        } else reject()
                    })
                }, 100)
            })
        }
    
        openTorrent () {
            this.ariaNgFileService.openFileContent({
                fileFilter: '.torrent',
                fileType: 'binary'
            }, (result) => {
                this.context.uploadFile = result
                this.context.taskType = 'torrent'
                this.changeTab('options')
            }, (error) => {
                this.ariaNgLocalizationService.showError(error)
            }, angular.element('#file-holder'))
        }
    
        openMetalink () {
            this.ariaNgFileService.openFileContent({
                fileFilter: '.meta4,.metalink',
                fileType: 'binary'
            }, (result) => {
                this.context.uploadFile = result
                this.context.taskType = 'metalink'
                this.changeTab('options')
            }, (error) => {
                this.ariaNgLocalizationService.showError(error)
            }, angular.element('#file-holder'))
        }
    
        startDownload (pauseOnAdded) {
            let responseCallback = (response) => {
                if (!response.hasSuccess && !response.success) return
    
                let firstTask = null
    
                if (response.results && response.results.length > 0) {
                    firstTask = response.results[0]
                } else if (response) {
                    firstTask = response
                }
    
                if (this.ariaNgSettingService.getAfterCreatingNewTask() === 'task-detail' && firstTask && firstTask.data) {
                    this.$location.path('/task/detail/' + firstTask.data)
                } else {
                    if (pauseOnAdded) {
                        this.$location.path('/waiting')
                    } else {
                        this.$location.path('/downloading')
                    }
                }
            }
    
            if (this.context.taskType === 'urls') {
                this.$rootScope.loadPromise = this.downloadByLinks(pauseOnAdded, responseCallback)
            } else if (this.context.taskType === 'torrent') {
                this.$rootScope.loadPromise = this.downloadByTorrent(pauseOnAdded, responseCallback)
            } else if (this.context.taskType === 'metalink') {
                this.$rootScope.loadPromise = this.downloadByMetalink(pauseOnAdded, responseCallback)
            }
        }
    
        setOption (key, value, optionStatus) {
            if (value !== '') {
                this.context.options[key] = value
            } else {
                delete this.context.options[key]
            }
    
            optionStatus.setReady()
        }
    
        urlTextboxKeyDown (event) {
            if (event.keyCode === 13 && event.ctrlKey && this.$rootScope.newTaskForm.$valid) {
                this.startDownload(null)
            }
        }
    
        getValidUrlsCount () {
            let urls = this.ariaNgCommonService.parseUrlsFromOriginInput(this.context.urls)
            return urls ? urls.length : 0
        }
    }]
  })
}());