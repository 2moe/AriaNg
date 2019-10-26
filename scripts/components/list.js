(function () {
  'use strict';
  angular.module('ariaNg').component('listDownload', {
    selector: 'listDownload',
    template: `<section class="content no-padding">
    <div id="task-table" class="task-table">
        <div class="task-table-title">
            <div class="row">
                <div class="col-md-8 col-sm-7">
                    <div class="row">
                        <div class="col-sm-8">
                            <a ng-click="$ctrl.changeDisplayOrder('name:asc', true)" translate>File Name</a>
                            <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetDisplayOrder('name:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetDisplayOrder('name:desc')}"></i>
                        </div>
                        <div class="col-sm-4">
                            <a ng-click="$ctrl.changeDisplayOrder('size:asc', true)" translate>File Size</a>
                            <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetDisplayOrder('size:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetDisplayOrder('size:desc')}"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-sm-3">
                    <div class="row">
                        <div class="col-sm-6">
                            <a ng-click="$ctrl.changeDisplayOrder('percent:desc', true)" translate>Progress</a>
                            <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetDisplayOrder('percent:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetDisplayOrder('percent:desc')}"></i>
                        </div>
                        <div class="col-sm-6">
                            <a ng-click="$ctrl.changeDisplayOrder('remain:asc', true)" translate>Remaining</a>
                            <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetDisplayOrder('remain:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetDisplayOrder('remain:desc')}"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 col-sm-2">
                    <a ng-click="$ctrl.changeDisplayOrder('dspeed:desc', true)" translate>Download Speed</a>
                    <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetDisplayOrder('dspeed:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetDisplayOrder('dspeed:desc')}"></i>
                </div>
            </div>
        </div>
        <div class="task-table-body" ng-class="{'draggable': $ctrl.isSupportDragTask()}" dragula="'task-list'" dragula-model="$ctrl.$rootScope.taskContext.list">
            <div class="row pointer-cursor" ng-repeat="task in $ctrl.$rootScope.taskContext.list | filter: $ctrl.$rootScope.filterTask | taskOrderBy: $ctrl.getOrderType()"
                 data-gid="{{task.gid}}" data-selected="{{!!$ctrl.$rootScope.taskContext.selected[task.gid]}}" data-toggle="$ctrl.$rootScope.context" data-target="#task-table-contextmenu"
                 ng-click="$ctrl.$rootScope.taskContext.selected[task.gid] = !$ctrl.$rootScope.taskContext.selected[task.gid]">
                <div class="col-md-8 col-sm-7 col-xs-12">
                    <div class="checkbox checkbox-primary" ng-class="{'checkbox-hide': !$ctrl.$rootScope.taskContext.selected[task.gid]}">
                        <input id="{{'task_' + task.gid}}" type="checkbox" ng-model="$ctrl.$rootScope.taskContext.selected[task.gid]"/>
                        <label for="{{'task_' + task.gid}}">
                            <span class="task-name auto-ellipsis" ng-bind="task.taskName" title="{{task.taskName}}"></span>
                        </label>
                    </div>
                    <div class="task-files">
                        <span class="ng-binding-2" ng-bind="task.totalLength | readableVolume"></span>
                        <a ng-href="#!/task/detail/{{task.gid}}" title="{{'Click to view task detail' | translate}}">
                            <span ng-if="task.files" ng-bind="('format.settings.file-count' | translate: {count: task.selectedFileCount})"></span>
                        </a><i class="icon-error fa fa-times" ng-if="task && task.status === 'error' && task.errorDescription" title="{{task.errorDescription | translate}}"></i><i class="icon-seeder fa fa-arrow-up" ng-if="task && task.status === 'active' && task.seeder" title="{{'Seeding' | translate}}"></i>
                        <a ng-if="$ctrl.$rootScope.isTaskRetryable(task)" ng-click="$ctrl.$rootScope.retryTask(task)" title="{{'Retry' | translate}}" translate>Retry</a>
                    </div>
                </div>
                <div class="col-md-2 col-sm-3 col-xs-12">
                    <div class="progress">
                        <div class="progress-bar" role="progressbar"
                             ng-class="{'progress-bar-primary': task.status !== 'error', 'progress-bar-warning': task.status === 'error'}"
                             aria-valuenow="{{task.completePercent}}" aria-valuemin="1"
                             aria-valuemax="100" ng-style="{ width: task.completePercent + '%' }">
                            <span ng-class="{'progress-lower': task.completePercent < 50}"
                                ng-bind="(task.completePercent | percent: 2) + '%'"></span>
                        </div>
                    </div>
                    <div>
                        <span class="task-last-time"
                              ng-bind="task.status === 'waiting' ? '--:--:--' : (task.status === 'paused' ? '' : (task.status === 'active' ? ((0 <= task.remainTime && task.remainTime < 86400) ? (task.remainTime | dateDuration: 'second': 'HH:mm:ss') : ('More Than One Day' | translate)) : ''))"></span>
                        <span class="task-download-speed visible-xs-inline pull-right"
                              ng-bind="(task.status === 'active' && !task.verifyIntegrityPending && !task.verifiedLength ? (!task.seeder || task.downloadSpeed > 0 ? (task.downloadSpeed | readableVolume) + '/s' : '-') : (task | taskStatus: true | translate: {errorcode: task.errorCode, verifiedPercent: task.verifiedPercent}))"></span>
                        <span class="task-seeders pull-right" ng-bind="task.status === 'active' ? ((task.numSeeders ? (task.numSeeders + '/') : '') + task.connections) : ''"></span>
                    </div>
                </div>
                <div class="col-md-2 col-sm-2 hidden-xs">
                    <span class="task-download-speed" title="{{task.status === 'active' ? (('Download Speed' | translate) + ': ' + (task.downloadSpeed | readableVolume) + '/s') + (task.bittorrent ? ', ' + ('Upload Speed' | translate) + ': ' + (task.uploadSpeed | readableVolume) + '/s' : '') : ''}}"
                          ng-bind="(task.status === 'active' && !task.verifyIntegrityPending && !task.verifiedLength ? (!task.seeder || task.downloadSpeed > 0 ? (task.downloadSpeed | readableVolume) + '/s' : '-') : (task | taskStatus: true | translate: {errorcode: task.errorCode, verifiedPercent: task.verifiedPercent}))"></span>
                </div>
                <div class="task-right-arrow visible-md visible-lg">
                    <a ng-href="#!/task/detail/{{task.gid}}" title="{{'Click to view task detail' | translate}}">
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>
        </div>
        <div id="task-table-contextmenu">
            <ul class="dropdown-menu" role="menu">
                <li ng-if="$ctrl.$rootScope.isSelectedTaskRetryable()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Retry Selected Tasks' | translate}}" ng-click="$ctrl.$rootScope.retryTasks()">
                        <i class="fa fa-refresh fa-fw"></i>
                        <span translate>Retry Selected Tasks</span>
                    </a>
                </li>
                <li class="divider" ng-if="$ctrl.$rootScope.isSelectedTaskRetryable()"></li>
                <li ng-if="$ctrl.isSpecifiedTaskSelected('paused')">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Start' | translate}}" ng-click="$ctrl.$rootScope.changeTasksState('start')">
                        <i class="fa fa-play fa-fw"></i>
                        <span translate>Start</span>
                    </a>
                </li>
                <li ng-if="$ctrl.isSpecifiedTaskSelected('active', 'waiting')">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Pause' | translate}}" ng-click="$ctrl.$rootScope.changeTasksState('pause')">
                        <i class="fa fa-pause fa-fw"></i>
                        <span translate>Pause</span>
                    </a>
                </li>
                <li ng-if="$ctrl.$rootScope.isTaskSelected()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Delete' | translate}}" ng-click="$ctrl.$rootScope.removeTasks()">
                        <i class="fa fa-trash-o fa-fw"></i>
                        <span translate>Delete</span>
                    </a>
                </li>
                <li class="divider" ng-if="$ctrl.$rootScope.isTaskSelected()"></li>
                <li class="dropdown dropdown-submenu">
                    <a tabindex="-1" title="{{'Display Order' | translate}}" href="javascript:void(0);">
                        <i class="fa fa-sort-alpha-asc fa-fw"></i>
                        <span translate>Display Order</span>
                    </a>
                    <ul class="dropdown-menu" style="right: 160px;">
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('default:asc')">
                                <span translate>Default</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('default')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('name:asc')">
                                <span translate>By File Name</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('name')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('size:asc')">
                                <span translate>By File Size</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('size')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('percent:desc')">
                                <span translate>By Progress</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('percent')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('remain:asc')">
                                <span translate>By Remaining</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('remain')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('dspeed:desc')">
                                <span translate>By Download Speed</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('dspeed')}"></i>
                            </a>
                        </li>
                        <li>
                            <a class="pointer-cursor" ng-click="$ctrl.changeDisplayOrder('uspeed:desc')">
                                <span translate>By Upload Speed</span>
                                <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetDisplayOrder('uspeed')}"></i>
                            </a>
                        </li>
                    </ul>
                </li>
                <li ng-if="$ctrl.hasRetryableTask()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Select All Failed Tasks' | translate}}" ng-click="$ctrl.selectAllFailedTasks()">
                        <i class="fa fa-fw"></i>
                        <span translate>Select All Failed Tasks</span>
                    </a>
                </li>
                <li ng-if="$ctrl.hasCompletedTask()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Select All Completed Tasks' | translate}}" ng-click="$ctrl.selectAllCompletedTasks()">
                        <i class="fa fa-fw"></i>
                        <span translate>Select All Completed Tasks</span>
                    </a>
                </li>
                <li>
                    <a tabindex="-1" class="pointer-cursor" title="{{'Select All' | translate}}" ng-click="$ctrl.selectAllTasks()">
                        <i class="fa fa-th-large fa-fw"></i>
                        <span translate>Select All</span>
                    </a>
                </li>
                <li class="divider" ng-if="isSelectedTasksAllHaveUrl() || isSelectedTasksAllHaveInfoHash()"></li>
                <li ng-if="isSelectedTasksAllHaveUrl()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Copy Download Url' | translate}}" ng-click="copySelectedTasksDownloadLink()">
                        <i class="fa fa-copy fa-fw"></i>
                        <span translate>Copy Download Url</span>
                    </a>
                </li>
                <li ng-if="isSelectedTasksAllHaveInfoHash()">
                    <a tabindex="-1" class="pointer-cursor" title="{{'Copy Magnet Link' | translate}}" ng-click="copySelectedTasksMagnetLink()">
                        <i class="fa fa-copy fa-fw"></i>
                        <span translate>Copy Magnet Link</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    </section>`,
    controller: ['$rootScope', '$window', '$location', '$interval', '$element', 'dragulaService', 
      'aria2RpcErrors', 'ariaNgCommonService', 'ariaNgSettingService', 'aria2TaskService', 
        class DownloadListController {
         constructor ($rootScope, $window, $location, $interval, $element, dragulaService, aria2RpcErrors, 
            ariaNgCommonService, ariaNgSettingService, aria2TaskService)
        {
            this.$rootScope = $rootScope
            this.$window = $window
            this.$location = $location
            this.$interval = $interval
            this.$element = $element
            this.dragulaService = dragulaService
            this.aria2RpcErrors = aria2RpcErrors
            this.ariaNgCommonService = ariaNgCommonService
            this.ariaNgSettingService = ariaNgSettingService
            this.aria2TaskService = aria2TaskService

            this.location = this.$location.path().substring(1)
            this.downloadTaskRefreshPromise = null
            this.pauseDownloadTaskRefresh = false
            this.needRequestWholeInfo = true

            if (this.ariaNgSettingService.getDownloadTaskRefreshInterval() > 0) {
                this.downloadTaskRefreshPromise = this.$interval(() => {
                    this.refreshDownloadTask(true);
                }, this.ariaNgSettingService.getDownloadTaskRefreshInterval());
            }
        
            this.dragulaService.options(this, 'task-list', {
                revertOnSpill: true,
                moves: () => {
                    return this.isSupportDragTask()
                }
            })
        
            this.$onInit = () => {
                $element.on('task-list.drop-model', (el, target, source) => {
                    let element = angular.element(target)
                    let gid = element.attr('data-gid')
                    let index = element.index()
            
                    this.pauseDownloadTaskRefresh = true
            
                    this.aria2TaskService.changeTaskPosition(gid, index, () => {
                        this.pauseDownloadTaskRefresh = false
                    }, true)
                })
            }

            this.$onDestroy = () => {
                this.pauseDownloadTaskRefresh = true
                if (this.downloadTaskRefreshPromise) {
                    this.$interval.cancel(this.downloadTaskRefreshPromise)
                }
            }

            this.$rootScope.loadPromise = this.refreshDownloadTask(false)
        }

        refreshDownloadTask (silent) {
            if (this.pauseDownloadTaskRefresh) return
    
            return this.aria2TaskService.getTaskList(this.location, this.needRequestWholeInfo, (response) => {
                if (this.pauseDownloadTaskRefresh) return
    
                if (!response.success) {
                    if (response.data.message === this.aria2RpcErrors.Unauthorized.message) {
                        this.$interval.cancel(this.downloadTaskRefreshPromise)
                    }
    
                    return
                }
    
                let isRequestWholeInfo = response.context.requestWholeInfo
                let taskList = response.data
    
                if (isRequestWholeInfo) {
                    this.$rootScope.taskContext.list = taskList
                    this.needRequestWholeInfo = false
                } else {
                    if (this.$rootScope.taskContext.list && this.$rootScope.taskContext.list.length > 0) {
                        for (let i = 0; i < this.$rootScope.taskContext.list.length; i++) {
                            let task = this.$rootScope.taskContext.list[i]
                            delete task.verifiedLength
                            delete task.verifyIntegrityPending
                        }
                    }
    
                    if (this.ariaNgCommonService.extendArray(taskList, this.$rootScope.taskContext.list, 'gid')) {
                        this.needRequestWholeInfo = false
                    } else {
                        this.needRequestWholeInfo = true
                    }
                }
    
                if (this.$rootScope.taskContext.list && this.$rootScope.taskContext.list.length > 0) {
                    this.aria2TaskService.processDownloadTasks(this.$rootScope.taskContext.list)
    
                    if (!isRequestWholeInfo) {
                        let hasFullStruct = false
    
                        for (let i = 0; i < this.$rootScope.taskContext.list.length; i++) {
                            let task = this.$rootScope.taskContext.list[i]
    
                            if (task.hasTaskName || task.files || task.bittorrent) {
                                hasFullStruct = true
                                break
                            }
                        }
    
                        if (!hasFullStruct) {
                            this.needRequestWholeInfo = true
                            this.$rootScope.taskContext.list.length = 0
                            return
                        }
                    }
                }
    
                this.$rootScope.taskContext.enableSelectAll = this.$rootScope.taskContext.list && this.$rootScope.taskContext.list.length > 0
            }, silent)
        }

        selectAllTasks () {
            this.$rootScope.taskContext.selectAll()
        }
    
        selectAllFailedTasks () {
            this.$rootScope.taskContext.selectAllFailed()
        }
    
        selectAllCompletedTasks () {
            this.$rootScope.taskContext.selectAllCompleted()
        }

        hasRetryableTask () {
            return this.$rootScope.taskContext.hasRetryableTask()
        }
    
        hasCompletedTask () {
            return this.$rootScope.taskContext.hasCompletedTask()
        }

        isSetDisplayOrder (type) {
            let orderType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getDisplayOrder())
            let targetType = this.ariaNgCommonService.parseOrderType(type)
    
            return orderType.equals(targetType)
        }

        changeDisplayOrder (type, autoSetReverse) {

            let oldType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getDisplayOrder())
            let newType = this.ariaNgCommonService.parseOrderType(type)

            if (autoSetReverse && newType.type === oldType.type) {
                newType.reverse = !oldType.reverse
            }
    
            this.ariaNgSettingService.setDisplayOrder(newType.getValue())
        }

        getOrderType () {
            return this.ariaNgSettingService.getDisplayOrder()
        }
    
        isSupportDragTask () {
            let displayOrder = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getDisplayOrder())
    
            return this.location === 'waiting' && displayOrder.type === 'default'
        }

    }]
  })
}());
