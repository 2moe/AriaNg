(function () {
  'use strict';
  angular.module('ariaNg').component('aria2Ng', {
    selector: 'aria2Ng',
    template: `<div class="wrapper" ng-swipe-left="$ctrl.$rootScope.swipeActions.leftSwipe()" ng-swipe-right="$ctrl.$rootScope.swipeActions.rightSwipe()" ng-swipe-disable-mouse>
    <header class="main-header">
        <div class="logo">
            <div class="logo-mini">Aria</div>
            <div class="logo-lg" title="AriaNg {{$ctrl.ariaNgVersion}}">
                <div class="dropdown">
                    <span class="dropdown-toggle" data-toggle="dropdown">
                        <span class="logo-lg-title">AriaNg</span><i class="fa fa-caret-right fa-right-bottom fa-rotate-45 fa-half" aria-hidden="true"></i>
                    </span>
                    <ul class="dropdown-menu dropdown-menu-right rpcselect-dropdown" role="menu">
                        <li ng-repeat="setting in $ctrl.rpcSettings" ng-class="{'active': setting.isDefault}">
                            <a class="pointer-cursor" ng-click="$ctrl.switchRpcSetting(setting)">
                                <span ng-bind="(setting.rpcAlias ? setting.rpcAlias : setting.rpcHost + ':' + setting.rpcPort)">RPC</span>
                                <i class="fa" ng-class="{'fa-check': setting.isDefault}"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <nav class="navbar navbar-static-top" role="navigation">
            <div class="navbar-toolbar">
                <ul class="nav navbar-nav">
                    <li>
                        <a class="toolbar" title="{{'New' | translate}}" ng-href="#!/new">
                            <i class="fa fa-plus"></i>
                            <span translate>New</span>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li class="disabled" ng-class="{'disabled': !$ctrl.isSpecifiedTaskSelected('paused')}">
                        <a class="toolbar" title="{{'Start' | translate}}" ng-click="$ctrl.changeTasksState('start')">
                            <i class="fa fa-play"></i>
                        </a>
                    </li>
                    <li class="disabled" ng-class="{'disabled': !$ctrl.isSpecifiedTaskSelected('active', 'waiting')}">
                        <a class="toolbar" title="{{'Pause' | translate}}" ng-click="$ctrl.changeTasksState('pause')">
                            <i class="fa fa-pause"></i>
                        </a>
                    </li>
                    <li class="disabled" ng-class="{'disabled': !$ctrl.isTaskSelected() && !$ctrl.isSpecifiedTaskShowing('complete', 'error', 'removed')}">
                        <a class="toolbar dropdown-toggle" data-toggle="dropdown" title="{{'Delete' | translate}}">
                            <i class="fa fa-trash-o"></i>
                            <i class="fa fa-caret-right fa-right-bottom fa-rotate-45 fa-half" aria-hidden="true"></i>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li ng-if="$ctrl.isTaskSelected()">
                                <a class="pointer-cursor" ng-click="$ctrl.removeTasks()">
                                    <span translate>Remove Task</span>
                                </a>
                            </li>
                            <li ng-if="$ctrl.taskContext.enableSelectAll && $ctrl.isSpecifiedTaskShowing('complete', 'error', 'removed')">
                                <a class="pointer-cursor" ng-click="$ctrl.clearStoppedTasks()">
                                    <span translate>Clear Stopped Tasks</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li class="disabled" ng-class="{'disabled': !$ctrl.$rootScope.taskContext.enableSelectAll || !$ctrl.$rootScope.taskContext.list || $ctrl.$rootScope.taskContext.list.length < 1}">
                        <a class="toolbar" title="{{'Select All' | translate}}" ng-click="$ctrl.selectAllTasks()">
                            <i class="fa fa-th-large"></i>
                        </a>
                    </li>
                    <li class="disabled" ng-class="{'disabled': !$ctrl.taskContext.enableSelectAll || !$ctrl.taskContext.list || $ctrl.taskContext.list.length < 1}">
                        <a class="toolbar dropdown-toggle" data-toggle="dropdown" title="{{'Display Order' | translate}}">
                            <i class="fa fa-sort-alpha-asc"></i>
                            <i class="fa fa-caret-right fa-right-bottom fa-rotate-45 fa-half" aria-hidden="true"></i>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('default:asc')">
                                    <span translate>Default</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('default')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('name:asc')">
                                    <span translate>By File Name</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('name')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('size:asc')">
                                    <span translate>By File Size</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('size')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('percent:desc')">
                                    <span translate>By Progress</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('percent')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('remain:asc')">
                                    <span translate>By Remaining</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('remain')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('dspeed:desc')">
                                    <span translate>By Download Speed</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('dspeed')}"></i>
                                </a>
                            </li>
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('uspeed:desc')">
                                    <span translate>By Upload Speed</span>
                                    <i class="fa" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('uspeed')}"></i>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a class="toolbar" title="{{'Help' | translate}}" href="https://github.com/mayswind/AriaNg" target="_blank">
                            <i class="fa fa-question-circle-o"></i>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="navbar-toolbar">
                <ul class="nav navbar-nav">
                    <li>
                        <a data-toggle="push-menu" role="button" title="{{'Toggle Navigation' | translate}}">
                            <i class="fa fa-bars"></i>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li class="dropbottom">
                        <a class="dropdown-toggle" data-toggle="dropdown" role="button" title="{{'Shortcut' | translate}}">
                            <i class="fa fa-wrench"></i>
                            <span translate>Shortcut</span>
                            <i class="fa fa-caret-right fa-right-bottom fa-rotate-45 fa-half" aria-hidden="true"></i>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a class="pointer-cursor" ng-click="$ctrl.showQuickSettingDialog('globalSpeedLimit', 'Global Rate Limit')">
                                    <span translate>Global Rate Limit</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="navbar-toolbar" ng-if="$ctrl.globalStatusContext.isEnabled">
              <ul class="nav navbar-nav">
                <li>
                    <a title="{{('Click to pin' | translate)}}" ng-pop-chart ng-data="$ctrl.globalStatusContext.data"
                    ng-container="body" ng-placement="bottom" ng-trigger="click hover" ng-popover-class="global-status-chart">
                    <span class="realtime-speed">
                        <i class="icon-download fa fa-arrow-down"></i>
                        <span ng-bind="($ctrl.globalStat.downloadSpeed | readableVolume) + '/s'"></span>
                    </span>
                    <span class="realtime-speed">
                        <i class="icon-upload fa fa-arrow-up"></i>
                        <span ng-bind="($ctrl.globalStat.uploadSpeed | readableVolume) + '/s'"></span>
                    </span>
                    </a>
                <li>
              </ul>
            </div>
            
            <div class="navbar-searchbar hidden-xs">
                <ul class="nav navbar-nav">
                    <li>
                        <input class="form-control" ng-placeholder="('Search' | translate)" title="{{'Search' | translate}}"
                               ng-model="$ctrl.$rootScope.searchContext.text" />
                        <div class="form-control-icon">
                            <span class="fa fa-search form-control-feedback"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <aside class="main-sidebar">
        <section class="sidebar">
            <ul id="siderbar-menu" class="sidebar-menu" data-widget="tree" data-animation-speed="300">
                <li class="header" translate>Download</li>
                <li data-href-match="/downloading">
                    <a href="#!/downloading"><i class="fa fa-arrow-circle-o-down"></i> <span ng-bind="('Downloading' | translate) + ($ctrl.globalStat && $ctrl.globalStat.numActive > 0 ? ' (' + $ctrl.globalStat.numActive + ')' : '')">Downloading</span></a>
                </li>
                <li data-href-match="/waiting">
                    <a href="#!/waiting"><i class="fa fa-clock-o"></i> <span ng-bind="('Waiting' | translate) + ($ctrl.globalStat && $ctrl.globalStat.numWaiting > 0 ? ' (' + $ctrl.globalStat.numWaiting + ')' : '')">Waiting</span></a>
                </li>
                <li data-href-match="/stopped">
                    <a href="#!/stopped"><i class="fa fa-check-circle-o"></i> <span ng-bind="('Finished / Stopped' | translate) + ($ctrl.globalStat && $ctrl.globalStat.numStopped > 0 ? ' (' + $ctrl.globalStat.numStopped + ')' : '')">Finished / Stopped</span></a>
                </li>
                <li class="header" translate>Settings</li>
                <li data-href-match="/settings/ariang">
                    <a href="#!/settings/ariang"><i class="fa fa-cog"></i> <span translate>AriaNg Settings</span></a>
                </li>
                <li ng-class="{'treeview': true, 'active menu-open': $ctrl.openMenu}">
                    <a  ng-click="$ctrl.openMenu = !$ctrl.openMenu" href="javascript:void(0);">
                        <i class="fa fa-cogs"></i>
                        <span translate>Aria2 Settings</span>
                        <span class="pull-right-container">
                            <i class="fa fa-angle-left pull-right"></i>
                        </span>
                    </a>
                    <ul class="treeview-menu">
                        <li data-href-match="/settings/aria2/basic">
                            <a href="#!/settings/aria2/basic"> <span translate>Basic Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/http-ftp-sftp">
                            <a href="#!/settings/aria2/http-ftp-sftp"> <span translate>HTTP/FTP/SFTP Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/http">
                            <a href="#!/settings/aria2/http"> <span translate>HTTP Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/ftp-sftp">
                            <a href="#!/settings/aria2/ftp-sftp"> <span translate>FTP/SFTP Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/bt">
                            <a href="#!/settings/aria2/bt"> <span translate>BitTorrent Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/metalink">
                            <a href="#!/settings/aria2/metalink"> <span translate>Metalink Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/rpc">
                            <a href="#!/settings/aria2/rpc"> <span translate>RPC Settings</span></a>
                        </li>
                        <li data-href-match="/settings/aria2/advanced">
                            <a href="#!/settings/aria2/advanced"> <span translate>Advanced Settings</span></a>
                        </li>
                    </ul>
                </li>
                <li class="ng-cloak" data-href-match="/debug" ng-if="$ctrl.enableDebugMode()">
                    <a href="#!/debug"><i class="fa fa-wrench"></i> <span translate>AriaNg Debug Console</span></a>
                </li>
                <li data-href-match="/status">
                    <a href="#!/status">
                        <span class="label pull-right" ng-if="$ctrl.globalStatusContext.isEnabled || $ctrl.isCurrentRpcUseWebSocket" ng-class="{'label-primary': $ctrl.$rootScope.taskContext.rpcStatus === 'Connecting', 'label-success': $ctrl.$rootScope.taskContext.rpcStatus === 'Connected', 'label-danger': $ctrl.$rootScope.taskContext.rpcStatus === 'Disconnected'}" ng-bind="$ctrl.$rootScope.taskContext.rpcStatus | translate"></span>
                        <i class="fa fa-server"></i> <span translate>Aria2 Status</span>
                    </a>
                </li>

                <li data-href-match="/decode-url">
                    <a href="#!/decode-url">
                        <i class="fa fa-link"></i> <span>Decode URL</span>
                    </a>
                </li>
            </ul>
        </section>
    </aside>

    <div id="content-wrapper" class="content-wrapper">
        <div id="content-body" class="content-body">
            <div ng-view cg-busy="{ promise: $ctrl.$rootScope.loadPromise, message: ('Loading' | translate) }"></div>
        </div>
    </div>

    <ng-setting-dialog setting="$ctrl.quickSettingContext"></ng-setting-dialog>
    </div>`,
    controller: ['$rootScope', '$route', '$window', '$location', '$document', '$interval', 'clipboard', 'ariaNgBuildConfiguration', 
        'aria2RpcErrors', 'ariaNgCommonService', 'ariaNgNotificationService', 'ariaNgLocalizationService', 'ariaNgSettingService', 
        'ariaNgMonitorService', 'ariaNgTitleService', 'aria2TaskService', 'aria2SettingService', class MainController {
        constructor ($rootScope, $route, $window, $location, $document, $interval, clipboard, ariaNgBuildConfiguration, 
            aria2RpcErrors, ariaNgCommonService, ariaNgNotificationService, ariaNgLocalizationService, ariaNgSettingService, 
            ariaNgMonitorService, ariaNgTitleService, aria2TaskService, aria2SettingService)
        {
            this.$rootScope = $rootScope
            this.$route = $route
            this.$window = $window
            this.$location = $location
            this.$document = $document
            this.$interval = $interval
            this.clipboard = clipboard
            this.ariaNgBuildConfiguration = ariaNgBuildConfiguration
            this.aria2RpcErrors = aria2RpcErrors
            this.ariaNgCommonService = ariaNgCommonService
            this.ariaNgNotificationService = ariaNgNotificationService
            this.ariaNgLocalizationService = ariaNgLocalizationService
            this.ariaNgSettingService = ariaNgSettingService
            this.ariaNgMonitorService = ariaNgMonitorService
            this.ariaNgTitleService = ariaNgTitleService
            this.aria2TaskService = aria2TaskService
            this.aria2SettingService = aria2SettingService

            this.pageTitleRefreshPromise = null
            this.globalStatRefreshPromise = null
            this.globalStat = null
            this.openMenu = false

            if (this.ariaNgSettingService.getBrowserNotification()) {
                this.ariaNgNotificationService.requestBrowserPermission();
            }

            this.ariaNgVersion = this.ariaNgBuildConfiguration.buildVersion

            this.globalStatusContext = {
                isEnabled: this.ariaNgSettingService.getGlobalStatRefreshInterval() > 0,
                data: this.ariaNgMonitorService.getGlobalStatsData()
            }

            this.rpcSettings = this.ariaNgSettingService.getAllRpcSettings()
            this.isCurrentRpcUseWebSocket = this.ariaNgSettingService.isCurrentRpcUseWebSocket()
            this.quickSettingContext = null

            if (this.ariaNgSettingService.getTitleRefreshInterval() > 0) {
                this.pageTitleRefreshPromise = this.$interval(() => {
                    this.refreshPageTitle()
                }, this.ariaNgSettingService.getTitleRefreshInterval())
            }

            if (this.ariaNgSettingService.getGlobalStatRefreshInterval() > 0) {
                this.globalStatRefreshPromise = this.$interval(() => {
                    this.refreshGlobalStat(true, null)
                }, this.ariaNgSettingService.getGlobalStatRefreshInterval())
            }

            this.refreshGlobalStat (true, () => {
                this.refreshPageTitle()
            })

            this.$onDestroy = () => {
                if (this.pageTitleRefreshPromise) {
                    this.$interval.cancel(this.pageTitleRefreshPromise)
                }
    
                if (this.globalStatRefreshPromise) {
                    this.$interval.cancel(this.globalStatRefreshPromise)
                }
            }
        }

        refreshPageTitle () {
            this.$document[0].title = this.ariaNgTitleService.getFinalTitleByGlobalStat({
                globalStat: this.globalStat,
                currentRpcProfile: this.getCurrentRPCProfile()
            })
        }

        refreshGlobalStat (silent, callback) {
            return this.aria2SettingService.getGlobalStat((response) => {
                if (!response.success && response.data.message === this.aria2RpcErrors.Unauthorized.message) {
                    this.$interval.cancel(this.globalStatRefreshPromise)
                    return
                }

                if (response.success) {
                    this.globalStat = response.data
                    this.ariaNgMonitorService.recordGlobalStat(response.data)
                }

                if (callback) {
                    callback(response)
                }
            }, silent)
        }

        getCurrentRPCProfile () {
            if (!this.rpcSettings || this.rpcSettings.length < 1) return null
    
            for (var i = 0; i < this.rpcSettings.length; i++) {
                var rpcSetting = this.rpcSettings[i]
                if (rpcSetting.isDefault) {
                    return rpcSetting
                }
            }
    
            return null
        }

        enableDebugMode () {
            return this.ariaNgSettingService.isEnableDebugMode()
        }
    
        isTaskSelected () {
            return this.$rootScope.taskContext.getSelectedTaskIds().length > 0
        }
    
        isSelectedTasksAllHaveUrl () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks()
    
            if (selectedTasks.length < 1) {
                return false
            }
    
            for (var i = 0; i < selectedTasks.length; i++) {
                if (!selectedTasks[i].singleUrl) {
                    return false
                }
            }
    
            return true
        }
    
        isSelectedTasksAllHaveInfoHash () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks();
    
            if (selectedTasks.length < 1) {
                return false
            }
    
            for (var i = 0; i < selectedTasks.length; i++) {
                if (!selectedTasks[i].bittorrent || !selectedTasks[i].infoHash) {
                    return false
                }
            }
    
            return true
        }

        isSpecifiedTaskSelected () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks()
    
            if (selectedTasks.length < 1) {
                return false;
            }
    
            for (var i = 0; i < selectedTasks.length; i++) {
                for (var j = 0; j < arguments.length; j++) {
                    if (selectedTasks[i].status === arguments[j]) {
                        return true
                    }
                }
            }
    
            return false
        }
    
        isSpecifiedTaskShowing () {
            var tasks = this.$rootScope.taskContext.list
    
            if (tasks.length < 1) {
                return false
            }
    
            for (var i = 0; i < tasks.length; i++) {
                for (var j = 0; j < arguments.length; j++) {
                    if (tasks[i].status === arguments[j]) {
                        return true
                    }
                }
            }
    
            return false
        }
    
        changeTasksState (state) {
            var gids = this.$rootScope.taskContext.getSelectedTaskIds()
    
            if (!gids || gids.length < 1) {
                return
            }
    
            var invoke = null
    
            if (state === 'start') {
                invoke = this.aria2TaskService.startTasks
            } else if (state === 'pause') {
                invoke = this.aria2TaskService.pauseTasks
            } else {
                return
            }
    
            this.$rootScope.loadPromise = invoke(gids, (response) => {
                if (response.hasError && gids.length > 1) {
                    this.ariaNgLocalizationService.showError('Failed to change some tasks state.')
                }
    
                if (!response.hasSuccess) {
                    return
                }
    
                this.refreshGlobalStat(true, null)
    
                if (!response.hasError && state === 'start') {
                    if (this.$location.path() === '/waiting') {
                        this.$location.path('/downloading')
                    } else {
                        this.$route.reload()
                    }
                } else if (!response.hasError && state === 'pause') {
                    if (this.$location.path() === '/downloading') {
                        this.$location.path('/waiting')
                    } else {
                        this.$route.reload()
                    }
                }
            }, (gids.length > 1))
        }

        selectAllTasks () {
            this.$rootScope.taskContext.selectAll()
        }

        retryTask (task) {
            this.ariaNgLocalizationService.confirm('Confirm Retry', 'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.', 'info', () => {
                this.$rootScope.loadPromise = this.aria2TaskService.retryTask(task.gid, (response) => {
                    if (!response.success) {
                        this.ariaNgLocalizationService.showError('Failed to retry this task.')
                        return
                    }
    
                    this.refreshGlobalStat(true, null)
    
                    var actionAfterRetryingTask = this.ariaNgSettingService.getAfterRetryingTask()
    
                    if (response.success && response.data) {
                        if (actionAfterRetryingTask === 'task-list-downloading') {
                            if (this.$location.path() !== '/downloading') {
                                this.$location.path('/downloading')
                            } else {
                                this.$route.reload()
                            }
                        } else if (actionAfterRetryingTask === 'task-detail') {
                            this.$location.path('/task/detail/' + response.data)
                        } else {
                            this.$route.reload()
                        }
                    }
                }, false)
            })
        }
    
        isSelectedTaskRetryable () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks()
    
            if (selectedTasks.length < 1) {
                return false
            }
    
            for (var i = 0; i < selectedTasks.length; i++) {
                if (!this.$rootScope.isTaskRetryable(selectedTasks[i])) {
                    return false
                }
            }
    
            return true
        }

        retryTasks () {
            var tasks = this.$rootScope.taskContext.getSelectedTasks()
    
            if (!tasks || tasks.length < 1) {
                return
            } else if (tasks.length === 1) {
                return this.retryTask(tasks[0])
            }
    
            var retryableTasks = []
            var skipCount = 0
    
            for (var i = 0; i < tasks.length; i++) {
                if (this.$rootScope.isTaskRetryable(tasks[i])) {
                    retryableTasks.push(tasks[i])
                } else {
                    skipCount++
                }
            }
    
            this.ariaNgLocalizationService.confirm('Confirm Retry', 'Are you sure you want to retry the selected task? AriaNg will create same task after clicking OK.', 'info', () => {
                this.$rootScope.loadPromise = this.aria2TaskService.retryTasks(retryableTasks, (response) => {
                    this.refreshGlobalStat(true, null)
    
                    this.ariaNgLocalizationService.showInfo('Operation Result', '{{successCount}} tasks have been retried and {{failedCount}} tasks are failed.', () => {
                        var actionAfterRetryingTask = this.ariaNgSettingService.getAfterRetryingTask()
    
                        if (response.hasSuccess) {
                            if (actionAfterRetryingTask === 'task-list-downloading') {
                                if (this.$location.path() !== '/downloading') {
                                    this.$location.path('/downloading')
                                } else {
                                    this.$route.reload()
                                }
                            } else {
                                this.$route.reload()
                            }
                        }
                    }, {
                        textParams: {
                            successCount: response.successCount,
                            failedCount: response.failedCount,
                            skipCount: skipCount
                        }
                    });
                }, false)
            }, true)
        }
    
        removeTasks () {
            var tasks = this.$rootScope.taskContext.getSelectedTasks()
    
            if (!tasks || tasks.length < 1) return
    
            var removeTasks = () => {
                this.$rootScope.loadPromise = this.aria2TaskService.removeTasks(tasks, (response) => {
                    if (response.hasError && tasks.length > 1) {
                        this.ariaNgLocalizationService.showError('Failed to remove some task(s).')
                    }
    
                    if (!response.hasSuccess) return
    
                    this.refreshGlobalStat(true, null)
    
                    if (!response.hasError) {
                        if (this.$location.path() !== '/stopped') {
                            this.$location.path('/stopped')
                        } else {
                            this.$route.reload()
                        }
                    }
                }, (tasks.length > 1))
            }

            if (this.ariaNgSettingService.getConfirmTaskRemoval()) {
                this.ariaNgLocalizationService.confirm('Confirm Remove', 'Are you sure you want to remove the selected task?', 'warning', removeTasks)
            } else {
                removeTasks()
            }
        }
    
        clearStoppedTasks () {
            this.ariaNgLocalizationService.confirm('Confirm Clear', 'Are you sure you want to clear stopped tasks?', 'warning', () => {
                this.$rootScope.loadPromise = this.aria2TaskService.clearStoppedTasks((response) => {
                    if (!response.success) return
 
                    this.refreshGlobalStat(true, null)
    
                    if (this.$location.path() !== '/stopped') {
                        this.$location.path('/stopped')
                    } else {
                        this.$route.reload()
                    }
                })
            })
        }

        isAllTasksSelected () {
            return this.$rootScope.taskContext.isAllSelected()
        }

        copySelectedTasksDownloadLink () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks()
            var result = ''
    
            for (var i = 0; i < selectedTasks.length; i++) {
                if (i > 0) {
                    result += '\n'
                }
    
                result += selectedTasks[i].singleUrl
            }
    
            if (result.length > 0) {
                this.clipboard.copyText(result)
            }
        }

        copySelectedTasksMagnetLink () {
            var selectedTasks = this.$rootScope.taskContext.getSelectedTasks()
            var result = ''
    
            for (var i = 0; i < selectedTasks.length; i++) {
                if (i > 0) {
                    result += '\n'
                }
    
                result += 'magnet:?xt=urn:btih:' + selectedTasks[i].infoHash
            }
    
            if (result.length > 0) {
                this.clipboard.copyText(result)
            }
        }

        showQuickSettingDialog (type, title) {
            this.quickSettingContext = {
                type: type,
                title: title
            }
        }
    
        switchRpcSetting (setting) {
            if (setting.isDefault) return
    
            this.ariaNgSettingService.setDefaultRpcSetting(setting)
            this.$window.location.reload()
        }
    }]
  })
}());