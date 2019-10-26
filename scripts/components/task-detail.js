(function () {
  'use strict';
  angular.module('ariaNg').component('ariaNgTaskDetails', {
    selector: 'ariaNgTaskDetails',
    template: `<section class="content no-padding">
    <div class="nav-tabs-custom">
        <ul class="nav nav-tabs" ng-if="$ctrl.task">
            <li ng-class="{'active': $ctrl.context.currentTab === 'overview'}">
                <a class="pointer-cursor" ng-click="$ctrl.changeTab('overview')" translate>Overview</a>
            </li>
            <li ng-class="{'active': $ctrl.context.currentTab === 'pieces'}">
                <a class="pointer-cursor" ng-click="$ctrl.changeTab('pieces')" translate>Pieces</a>
            </li>
            <li ng-class="{'active': $ctrl.context.currentTab === 'filelist'}">
                <a class="pointer-cursor" ng-click="$ctrl.changeTab('filelist')" translate>Files</a>
            </li>
            <li ng-class="{'active': $ctrl.context.currentTab === 'btpeers'}" ng-if="$ctrl.task && $ctrl.task.status === 'active' && $ctrl.task.bittorrent">
                <a class="pointer-cursor" ng-click="$ctrl.changeTab('btpeers')" translate>Peers</a>
            </li>
            <li ng-class="{'active': $ctrl.context.currentTab === 'settings'}" ng-if="$ctrl.task && ($ctrl.task.status === 'active' || $ctrl.task.status === 'waiting' || $ctrl.task.status === 'paused')" class="slim">
                <a class="pointer-cursor" ng-click="$ctrl.changeTab('settings')">
                    <i class="fa fa-gear"></i>
                </a>
            </li>
        </ul>

        <div class="tab-content no-padding">
            <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'overview'}">
                <div id="overview-items" class="settings-table striped hoverable" ng-mousedown="$ctrl.onOverviewMouseDown()" data-toggle="$ctrl.context" data-target="#task-overview-contextmenu">
                    <div class="row" ng-if="$ctrl.task">
                        <div class="setting-key col-sm-4">
                            <span translate>Task Name</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span class="allow-word-break" ng-bind="$ctrl.task.taskName" ng-tooltip-container="body" ng-tooltip-placement="bottom"
                                  ng-tooltip="{{($ctrl.task.bittorrent && $ctrl.task.bittorrent.comment) ? $ctrl.task.bittorrent.comment : $ctrl.task.taskName}}"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task">
                        <div class="setting-key col-sm-4">
                            <span translate>Task Size</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="$ctrl.task.totalLength | readableVolume"></span>
                            <a class="pointer-cursor" ng-if="task.files" ng-click="$ctrl.changeTab('filelist')">
                                <span ng-bind="('format.settings.file-count' | translate: {count: $ctrl.task.selectedFileCount})"></span>
                            </a>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task">
                        <div class="setting-key col-sm-4">
                            <span translate>Task Status</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="$ctrl.task | taskStatus | translate: {errorcode: $ctrl.task.errorCode, verifiedPercent: $ctrl.task.verifiedPercent}"></span>
                            <i class="icon-primary fa fa-question-circle" ng-if="$ctrl.task.errorCode && $ctrl.task.errorCode != '0' && $ctrl.task.errorMessage"
                                  ng-tooltip="{{$ctrl.task.errorMessage}}" ng-tooltip-container="body" ng-tooltip-placement="top"></i>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.status === 'error' && $ctrl.task.errorDescription">
                        <div class="setting-key col-sm-4">
                            <span translate>Error Description</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="$ctrl.task.errorDescription | translate"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task">
                        <div class="setting-key col-sm-4">
                            <span ng-bind="('Progress' | translate) + ($ctrl.task.status === 'active' && $ctrl.task.bittorrent ? ' (' + ('Health Percentage' | translate) + ')' : '')"></span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="($ctrl.task.completePercent | percent: 2) + '%' + ($ctrl.task.status === 'active' && $ctrl.task.bittorrent ? ' (' + ($ctrl.context.healthPercent | percent: 2) + '%' + ')' : '')"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="t$ctrl.ask">
                        <div class="setting-key col-sm-4">
                            <span translate>Download</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="($ctrl.task.completedLength | readableVolume) + ($ctrl.task.status === 'active' ? ' @ ' + ($ctrl.task.downloadSpeed | readableVolume) + '/s' : '')"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.bittorrent">
                        <div class="setting-key col-sm-4">
                            <span translate>Upload</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="($ctrl.task.uploadLength | readableVolume) + ($ctrl.task.status === 'active' ? ' @ ' + ($ctrl.task.uploadSpeed | readableVolume) + '/s' : '')"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.bittorrent">
                        <div class="setting-key col-sm-4">
                            <span translate>Share Ratio</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="($ctrl.task.shareRatio | number: 2)"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.status === 'active' && $ctrl.task.completedLength < $ctrl.task.totalLength">
                        <div class="setting-key col-sm-4">
                            <span translate>Remaining</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="0 <= $ctrl.task.remainTime && $ctrl.task.remainTime < 86400? ($ctrl.task.remainTime | dateDuration: 'second': 'HH:mm:ss') : ('More Than One Day' | translate)"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.status === 'active'">
                        <div class="setting-key col-sm-4">
                            <span ng-bind="($ctrl.task.bittorrent ? ('Seeders' | translate) + ' / ' : '') + ('Connections' | translate)">Connections</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="($ctrl.task.numSeeders ? ($ctrl.task.numSeeders + ' / ') : '') + $ctrl.task.connections"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.bittorrent && $ctrl.task.bittorrent.creationDate">
                        <div class="setting-key col-sm-4">
                            <span translate>Seed Creation Time</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span ng-bind="$ctrl.task.bittorrent.creationDate | amFromUnix | longDate"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.infoHash">
                        <div class="setting-key col-sm-4">
                            <span translate>Info Hash</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span class="allow-word-break" ng-bind="$ctrl.task.infoHash"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.singleUrl">
                        <div class="setting-key col-sm-4">
                            <span translate>Download Url</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span class="allow-word-break" ng-bind="$ctrl.task.singleUrl"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task">
                        <div class="setting-key col-sm-4">
                            <span translate>Download Dir</span>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span class="allow-word-break" ng-bind="$ctrl.task.dir"></span>
                        </div>
                    </div>
                    <div class="row" ng-if="$ctrl.task && $ctrl.task.bittorrent && $ctrl.task.bittorrent.announceList && $ctrl.task.bittorrent.announceList.length > 0">
                        <div class="setting-key col-sm-4">
                            <span translate>BT Tracker Servers</span>
                            <em class="description-inline" ng-bind="'format.settings.total-count' | translate: {count: $ctrl.task.bittorrent.announceList.length}"></em>
                            <i class="icon-expand pointer-cursor fa" ng-if="$ctrl.task.bittorrent.announceList.length > 1"
                               ng-class="{'fa-plus': $ctrl.context.collapseTrackers, 'fa-minus': !$ctrl.context.collapseTrackers}"
                               ng-click="$ctrl.context.collapseTrackers = !$ctrl.context.collapseTrackers"
                               title="{{($ctrl.context.collapseTrackers ? 'Expand' : 'Collapse') | translate}}"></i>
                        </div>
                        <div class="setting-value col-sm-8">
                            <span class="multi-line auto-ellipsis" ng-bind="serverAddress.length ? serverAddress.join(',') : serverAddress" title="{{serverAddress.length ? serverAddress.join(',') : serverAddress}}"
                                 ng-repeat="serverAddress in $ctrl.task.bittorrent.announceList | limitTo: ($ctrl.context.collapseTrackers ? 1 : $ctrl.task.bittorrent.announceList.length)"></span>
                        </div>
                    </div>
                </div>
                <div class="settings-table">
                    <div class="row no-hover no-background" ng-if="$ctrl.context.isEnableSpeedChart && $ctrl.task && $ctrl.task.status === 'active'">
                        <div class="col-sm-12">
                            <div class="task-status-chart-wrapper">
                               <ng-chart ng-data="$ctrl.context.statusData" height="200"></ng-chart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'pieces'}">
                <div class="piece-legends">
                    <div class="piece-legend" title="{{('format.task.pieceinfo' | translate: {completed: $ctrl.task.completedPieces, total: $ctrl.task.numPieces})}}">
                        <div class="piece piece-completed"></div><span translate>Completed</span>
                    </div>
                    <div class="piece-legend" title="{{('format.task.pieceinfo' | translate: {completed: $ctrl.task.completedPieces, total: $ctrl.task.numPieces})}}">
                        <div class="piece"></div><span translate>Uncompleted</span>
                    </div>
                </div>
                <ng-piece-map bit-field="$ctrl.task.bitfield" piece-count="$ctrl.task.numPieces"></ng-piece-map>
            </div>
            <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'filelist'}">
                <div class="task-table">
                    <div class="task-table-title">
                        <div class="row">
                            <div class="col-sm-8">
                                <a ng-click="$ctrl.changeFileListDisplayOrder('name:asc', true)" ng-class="{true: 'default-cursor'}[$ctrl.task.multiDir]" translate>File Name</a>
                                <i ng-if="!task.multiDir" class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetFileListDisplayOrder('name:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetFileListDisplayOrder('name:desc')}"></i>
                                <a ng-click="$ctrl.showChooseFilesToolbar()" ng-if="$ctrl.task && $ctrl.task.files && $ctrl.task.files.length > 1 && ($ctrl.task.status === 'waiting' || $ctrl.task.status === 'paused')" translate>(Choose Files)</a>
                            </div>
                            <div class="col-sm-2">
                                <a ng-click="$ctrl.changeFileListDisplayOrder('percent:desc', true)" ng-class="{true: 'default-cursor'}[$ctrl.task.multiDir]" translate>Progress</a>
                                <i ng-if="!$ctrl.task.multiDir" class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetFileListDisplayOrder('percent:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetFileListDisplayOrder('percent:desc')}"></i>
                            </div>
                            <div class="col-sm-2">
                                <a ng-click="$ctrl.changeFileListDisplayOrder('size:asc', true)" ng-class="{true: 'default-cursor'}[$ctrl.task.multiDir]" translate>File Size</a>
                                <i ng-if="!$ctrl.task.multiDir" class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetFileListDisplayOrder('size:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetFileListDisplayOrder('size:desc')}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="task-table-title" ng-if="$ctrl.context.showChooseFilesToolbar">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary btn-xs" ng-click="$ctrl.selectFiles('auto')"
                                            ng-bind="($ctrl.isAllFileSelected() ? 'Select None' : 'Select All') | translate">Select All</button>
                                    <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a href="javascript:void(0);" ng-click="$ctrl.selectFiles('all')" translate>Select All</a></li>
                                        <li><a href="javascript:void(0);" ng-click="$ctrl.selectFiles('none')" translate>Select None</a></li>
                                        <li><a href="javascript:void(0);" ng-click="$ctrl.selectFiles('reverse')" translate>Select Invert</a></li>
                                    </ul>
                                </div><button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('video')">
                                    <i class="fa fa-file-video-o"></i>
                                    <span translate>Videos</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('audio')">
                                    <i class="fa fa-file-audio-o"></i>
                                    <span translate>Audios</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('picture')">
                                    <i class="fa fa-file-picture-o"></i>
                                    <span translate>Pictures</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('document')">
                                    <i class="fa fa-file-text-o"></i>
                                    <span translate>Documents</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('application')">
                                    <i class="fa fa-file-o"></i>
                                    <span translate>Applications</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.chooseSpecifiedFiles('archive')">
                                    <i class="fa fa-file-archive-o"></i>
                                    <span translate>Archives</span>
                                </button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.showCustomChooseFileModal()">
                                    <i class="fa fa-filter"></i>
                                    <span translate>Custom</span>
                                </button>
                                <button class="btn btn-xs btn-success" ng-click="$ctrl.saveChoosedFiles()" ng-disabled="!$ctrl.isAnyFileSelected()" translate>Confirm</button>
                                <button class="btn btn-xs btn-default" ng-click="$ctrl.cancelChooseFiles()" translate>Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="task-table-body">
                        <div class="row" ng-repeat="file in $ctrl.task.files | fileOrderBy: $ctrl.getFileListOrderType()"
                             data-toggle="$ctrl.context" data-target="#task-filelist-contextmenu"
                             ng-if="!$ctrl.context.collapsedDirs[file.relativePath]" data-file-index="{{file.index}}">
                            <div class="col-sm-10" ng-if="file.isDir" style="{{($ctrl.task.multiDir ? ('padding-left: ' + (file.level * 16) + 'px') : '')}}">
                                <i class="icon-dir-expand pointer-cursor fa" ng-click="$ctrl.collapseDir(file)"
                                   ng-class="{true: 'fa-plus', false: 'fa-minus'}[!!$ctrl.context.collapsedDirs[file.nodePath]]"
                                   title="{{($ctrl.context.collapsedDirs[file.nodePath] ? 'Expand' : 'Collapse') | translate}}">
                                </i><div class="checkbox checkbox-primary checkbox-inline">
                                    <input id="{{'node_' + file.nodePath}}" type="checkbox" ng-disabled="!$ctrl.task || !$ctrl.task.files || $ctrl.task.files.length <= 1 || ($ctrl.task.status !== 'waiting' && $ctrl.task.status !== 'paused')"
                                           ng-model="file.selected" ng-indeterminate="file.partialSelected" ng-change="$ctrl.setSelectedNode(file)"/>
                                    <label for="{{'node_' + file.nodePath}}" class="allow-word-break" ng-bind="file.nodeName" title="{{file.nodeName}}"></label>
                                </div>
                            </div>
                            <div class="col-sm-8" ng-if="!file.isDir" style="{{($ctrl.task.multiDir ? ('padding-left: ' + (11 + 6 + file.level * 16) + 'px') : '')}}">
                                <div class="checkbox checkbox-primary">
                                    <input id="{{'file_' + file.index}}" type="checkbox" ng-disabled="!$ctrl.task || !$ctrl.task.files || $ctrl.task.files.length <= 1 || ($ctrl.task.status !== 'waiting' && $ctrl.task.status !== 'paused')"
                                           ng-model="file.selected" ng-change="$ctrl.setSelectedFile(true)"/>
                                    <label for="{{'file_' + file.index}}" class="allow-word-break" ng-bind="file.fileName" title="{{file.fileName}}"></label>
                                </div>
                            </div>
                            <div class="col-sm-2" ng-if="!file.isDir">
                                <div class="progress">
                                    <div class="progress-bar progress-bar-primary" role="progressbar"
                                         aria-valuenow="{{file.completePercent}}" aria-valuemin="1"
                                         aria-valuemax="100" ng-style="{ width: file.completePercent + '%' }">
                                    <span ng-class="{'progress-lower': file.completePercent < 50}"
                                          ng-bind="(file.completePercent | percent: 2) + '%'"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <span class="task-size" ng-bind="file.length | readableVolume"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'btpeers'}" ng-if="$ctrl.task && $ctrl.task.status === 'active' && $ctrl.task.bittorrent">
                <div class="task-table">
                    <div class="task-table-title">
                        <div class="row">
                            <div class="col-md-4 col-sm-4">
                                <a ng-click="$ctrl.changePeerListDisplayOrder('address:asc', true)" translate>Address</a>
                                <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetPeerListDisplayOrder('address:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetPeerListDisplayOrder('address:desc')}"></i>
                                <span>/</span>
                                <a ng-click="$ctrl.changePeerListDisplayOrder('client:asc', true)" translate>Client</a>
                                <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetPeerListDisplayOrder('client:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetPeerListDisplayOrder('client:desc')}"></i>
                            </div>
                            <div class="col-md-5 col-sm-4">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <span translate>Status</span>
                                    </div>
                                    <div class="col-sm-6 text-right">
                                        <a ng-click="$ctrl.changePeerListDisplayOrder('percent:desc', true)" translate>Progress</a>
                                        <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetPeerListDisplayOrder('percent:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetPeerListDisplayOrder('percent:desc')}"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <a ng-click="$ctrl.changePeerListDisplayOrder('dspeed:desc', true)" translate>Download</a>
                                <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetPeerListDisplayOrder('dspeed:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetPeerListDisplayOrder('dspeed:desc')}"></i>
                                <span>/</span>
                                <a ng-click="$ctrl.changePeerListDisplayOrder('uspeed:desc', true)" translate>Upload</a>
                                <i class="fa" ng-class="{'fa-sort-asc fa-order-asc': $ctrl.isSetPeerListDisplayOrder('uspeed:asc'), 'fa-sort-desc fa-order-desc': $ctrl.isSetPeerListDisplayOrder('uspeed:desc')}"></i>
                                <span translate>Speed</span>
                            </div>
                        </div>
                    </div>
                    <div class="task-table-body">
                        <div class="row" ng-repeat="peer in $ctrl.context.btPeers | peerOrderBy: $ctrl.getPeerListOrderType()"
                             data-toggle="context" data-target="#task-peerlist-contextmenu">
                            <div class="col-md-4 col-sm-4 col-xs-12">
                                <div class="peer-name-wrapper auto-ellipsis" title="{{(peer.client ? peer.client.info : '') + (peer.seeder ? (peer.client.info ? ', ' : '') + ('Seeding' | translate) : '')}}">
                                    <span ng-bind="peer.name | translate"></span><i class="icon-seeder fa fa-angle-double-up" ng-if="peer && peer.seeder"></i>
                                    <span class="peer-client" ng-if="!!peer.client"
                                        ng-bind="peer.client ? ('(' + peer.client.name + (peer.client.version ? ' ' + peer.client.version : '') + ')') : ''"></span>
                                </div>
                            </div>
                            <div class="col-md-5 col-sm-4 col-xs-12">
                                <div class="row">
                                    <div class="col-md-9 col-sm-7 col-xs-12">
                                        <div class="piece-bar-wrapper">
                                            <ng-piece-bar bit-field="peer.bitfield" piece-count="$ctrl.task.numPieces" color="#208fe5"></ng-piece-bar>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-sm-5 hidden-xs text-right">
                                        <span ng-bind="(peer.completePercent | percent: 2) + '%'"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="visible-xs col-xs-4">
                                <span ng-bind="(peer.completePercent | percent: 2) + '%'"></span>
                            </div>
                            <div class="col-md-3 col-sm-4 col-xs-8">
                                <div class="task-peer-download-speed">
                                    <i class="icon-download fa fa-arrow-down"></i>
                                    <span ng-bind="(peer.downloadSpeed | readableVolume) + '/s'"></span>&nbsp;
                                    <i class="icon-upload fa fa-arrow-up"></i>
                                    <span ng-bind="(peer.uploadSpeed | readableVolume) + '/s'"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row" ng-if="!context.btPeers || context.btPeers.length < 1">
                            <div class="col-sm-12 text-center">
                                <span translate>No connected peers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane" ng-class="{'active': $ctrl.context.currentTab === 'settings'}" ng-if="task && ($ctrl.task.status === 'active' || $ctrl.task.status === 'waiting' || $ctrl.task.status === 'paused')">
                <div class="settings-table striped hoverable">
                    <ng-setting ng-repeat="option in $ctrl.context.availableOptions" option="option"
                                ng-model="$ctrl.context.options[option.key]" default-value="option.defaultValue"
                                on-change-value="$ctrl.setOption(key, value, optionStatus)"></ng-setting>
                </div>
            </div>
        </div>
    </div><!-- /.nav-tabs-custom -->
    <div id="task-overview-contextmenu">
        <ul class="dropdown-menu" role="menu">
            <li>
                <a id="mnu-overview-copy" tabindex="-1" class="mnu-copy pointer-cursor" title="{{'Copy' | translate}}" ng-click="$ctrl.copySelectedRowText()">
                    <i class="fa fa-copy fa-fw"></i>
                    <span translate>Copy</span>
                </a>
            </li>
        </ul>
    </div>
    <div id="task-filelist-contextmenu">
        <ul class="dropdown-menu" role="menu">
            <li ng-if="$ctrl.task.multiDir">
                <a tabindex="-1" class="pointer-cursor" title="{{'Expand All' | translate}}" ng-click="$ctrl.collapseAllDirs(false)">
                    <i class="fa fa-plus fa-fw"></i>
                    <span translate>Expand All</span>
                </a>
            </li>
            <li ng-if="$ctrl.task.multiDir">
                <a tabindex="-1" class="pointer-cursor" title="{{'Collapse All' | translate}}" ng-click="$ctrl.collapseAllDirs(true)">
                    <i class="fa fa-minus fa-fw"></i>
                    <span translate>Collapse All</span>
                </a>
            </li>
            <li class="dropdown dropdown-submenu" ng-if="!$ctrl.task.multiDir">
                <a tabindex="-1" title="{{'Display Order' | translate}}" href="javascript:void(0);">
                    <i class="fa fa-sort-alpha-asc fa-fw"></i>
                    <span translate>Display Order</span>
                </a>
                <ul class="dropdown-menu" style="right: 160px;">
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changeFileListDisplayOrder('default:asc')">
                            <span translate>Default</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetFileListDisplayOrder('default')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changeFileListDisplayOrder('name:asc')">
                            <span translate>By File Name</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetFileListDisplayOrder('name')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changeFileListDisplayOrder('percent:desc')">
                            <span translate>By Progress</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetFileListDisplayOrder('percent')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changeFileListDisplayOrder('size:asc')">
                            <span translate>By File Size</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetFileListDisplayOrder('size')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changeFileListDisplayOrder('selected:desc')">
                            <span translate>By Selected Status</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetFileListDisplayOrder('selected')}"></i>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <div id="task-peerlist-contextmenu">
        <ul class="dropdown-menu" role="menu">
            <li class="dropdown dropdown-submenu">
                <a tabindex="-1" title="{{'Display Order' | translate}}" href="javascript:void(0);">
                    <i class="fa fa-sort-alpha-asc fa-fw"></i>
                    <span translate>Display Order</span>
                </a>
                <ul class="dropdown-menu" style="right: 160px;">
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('default:asc')">
                            <span translate>Default</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('default')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('address:asc')">
                            <span translate>By Peer Address</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('address')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('client:asc')">
                            <span translate>By Client Name</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('client')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('percent:desc')">
                            <span translate>By Progress</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('percent')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('dspeed:desc')">
                            <span translate>By Download Speed</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('dspeed')}"></i>
                        </a>
                    </li>
                    <li>
                        <a class="pointer-cursor" ng-click="$ctrl.changePeerListDisplayOrder('uspeed:desc')">
                            <span translate>By Upload Speed</span>
                            <i class="fa fa-fw" ng-class="{'fa-check': $ctrl.isSetPeerListDisplayOrder('uspeed')}"></i>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <div id="custom-choose-file-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" translate>Custom Choose File</h4>
                </div>
                <div class="modal-body no-padding">
                    <div class="settings-table striped hoverable">
                        <div class="row" ng-repeat="(extensionTypeName, extensionTypeInfo) in $ctrl.context.fileExtensions">
                            <div class="setting-key setting-key-without-desc col-sm-4" ng-bind="extensionTypeInfo.name | translate"></div>
                            <div class="setting-value col-sm-8">
                                <div class="checkbox checkbox-primary checkbox-inline" ng-repeat="info in extensionTypeInfo.extensions">
                                    <input id="{{info.extension}}" type="checkbox" ng-model="info.selected"
                                           ng-indeterminate="info.selectedCount > 0 && info.unSelectedCount > 0"
                                           ng-change="setSelectedExtension(info.extension, info.selected)">
                                    <label for="{{info.extension}}" ng-bind="info.extension"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" translate>Close</button>
                </div>
            </div>
        </div>
    </div>
    </section>`,
    bindings: {},
    controller: ['$rootScope', '$routeParams', '$interval', 'clipboard', 'ariaNgFileTypes', 'ariaNgCommonService', 'ariaNgSettingService', 'ariaNgMonitorService', 
        'aria2TaskService', 'aria2SettingService', class TaskDetailController {
        constructor($rootScope, $routeParams, $interval, clipboard, ariaNgFileTypes, ariaNgCommonService, ariaNgSettingService, ariaNgMonitorService, 
            aria2TaskService, aria2SettingService) {
            this.$rootScope = $rootScope
            this.extentLeftSwipe = $rootScope.swipeActions.extentLeftSwipe
            this.extentRightSwipe = $rootScope.swipeActions.extentRightSwipe
            this.$routeParams = $routeParams
            this.$interval = $interval
            this.clipboard = clipboard
            this.ariaNgFileTypes = ariaNgFileTypes
            this.ariaNgCommonService = ariaNgCommonService
            this.ariaNgSettingService = ariaNgSettingService
            this.ariaNgMonitorService = ariaNgMonitorService
            this.aria2TaskService = aria2TaskService
            this.aria2SettingService = aria2SettingService
    
            this.tabOrders = ['overview', 'pieces', 'filelist', 'btpeers']
            this.downloadTaskRefreshPromise = null
            this.pauseDownloadTaskRefresh = false
            this.currentRowTriggeredMenu = null
            this.context = {
                currentTab: 'overview',
                isEnableSpeedChart: this.ariaNgSettingService.getDownloadTaskRefreshInterval() > 0,
                showChooseFilesToolbar: false,
                fileExtensions: [],
                collapsedDirs: {},
                btPeers: [],
                healthPercent: 0,
                collapseTrackers: true,
                statusData: this.ariaNgMonitorService.getEmptyStatsData(this.$routeParams.gid),
                availableOptions: [],
                options: []
            }
            this.task = {}

            $('#custom-choose-file-modal').on('hide.bs.modal', () => {
                this.context.fileExtensions = null;
            })

            if (this.ariaNgSettingService.getDownloadTaskRefreshInterval() > 0) {
                this.downloadTaskRefreshPromise = this.$interval(() => {
                    if (this.task && (this.task.status === 'complete' || this.task.status === 'error' || this.task.status === 'removed')) {
                        this.$interval.cancel(this.downloadTaskRefreshPromise )
                        return
                    }
                    this.refreshDownloadTask(true)
                }, this.ariaNgSettingService.getDownloadTaskRefreshInterval())
            }

            this.$onDestroy = () => {
                if (this.downloadTaskRefreshPromise) {
                    this.$interval.cancel(this.downloadTaskRefreshPromise)
                }
            }

            this.$rootScope.loadPromise = this.refreshDownloadTask(false)
        }

        getAvailableOptions (status, isBittorrent) {
            let keys = this.aria2SettingService.getAvailableTaskOptionKeys(status, isBittorrent)
    
            return this.aria2SettingService.getSpecifiedOptions(keys, {
                disableRequired: true
            })
        }

        processTask (task) {
            if (!task) return
    
            if (task.status !== 'active' || !task.bittorrent) {
                if (this.tabOrders.indexOf('btpeers') >= 0) this.tabOrders.splice(this.tabOrders.indexOf('btpeers'), 1)
            }
    
            if (!this.task || this.task.status !== task.status) {
                this.context.availableOptions = this.getAvailableOptions(task.status, !!task.bittorrent)
            }
    
            if (this.task) {
                delete this.task.verifiedLength
                delete this.task.verifyIntegrityPending
            }
    
            this.task = this.ariaNgCommonService.copyObjectTo(task, this.task)
    
            this.$rootScope.taskContext.list = [this.task]
            this.$rootScope.taskContext.selected = {}
            this.$rootScope.taskContext.selected[this.task.gid] = true

            angular.element('#task-overview-contextmenu').on('hide.bs.context', () => {
                this.currentRowTriggeredMenu = null
            })
    
            this.ariaNgMonitorService.recordStat(task.gid, task)
        }

        processPeers (peers) {
            if (!peers) {
                return
            }
    
            if (!this.ariaNgCommonService.extendArray(peers, this.context.btPeers, 'peerId')) {
                this.context.btPeers = peers
            }
    
            this.context.healthPercent = this.aria2TaskService.estimateHealthPercentFromPeers(this.task, this.context.btPeers)
        }

        requireBtPeers (task) {
            return (task && task.bittorrent && task.status === 'active')
        }

        refreshDownloadTask (silent) {
            if (this.pauseDownloadTaskRefresh) {
                return
            }
    
            let processError = (text = null) => {
                this.$interval.cancel(this.downloadTaskRefreshPromise)
            }
    
            let includeLocalPeer = true
            let addVirtualFileNode = true
    
            if (!this.task) {
                return this.aria2TaskService.getTaskStatus(this.$routeParams.gid, (response) => {
                    if (!response.success) {
                        return processError(response.data.message)
                    }
    
                    let task = response.data;
    
                    this.processTask(task)
    
                    if (this.requireBtPeers(task)) {
                        this.aria2TaskService.getBtTaskPeers(task, (response) => {
                            if (response.success) {
                                this.processPeers(response.data)
                            }
                        }, silent, includeLocalPeer)
                    }
                }, silent, addVirtualFileNode)
            } else {
                return this.aria2TaskService.getTaskStatusAndBtPeers(this.$routeParams.gid, (response) => {
                    if (!response.success) {
                        return processError(response.data.message)
                    }
    
                    this.processTask(response.task)
                    this.processPeers(response.peers)
                }, silent, this.requireBtPeers(this.task), includeLocalPeer, addVirtualFileNode)
            }
        }

        setSelectFiles (silent) {
            if (!this.task || !this.task.files) return
    
            let gid = this.task.gid
            let selectedFileIndex = []
    
            for (let file in this.task.files) {

                if (file && file['selected'] && !file['isDir']) {
                    selectedFileIndex.push(file['index'])
                }
            }
    
            this.pauseDownloadTaskRefresh = true
    
            return this.aria2TaskService.selectTaskFile(gid, selectedFileIndex, (response) => {
                this.pauseDownloadTaskRefresh = false
    
                if (response.success) {
                    this.refreshDownloadTask(false)
                }
            }, silent)
        }

        setSelectedNode (node, value) {
            if (!node) return
    
            if (node.files && node.files.length) {
                for (let i = 0; i < node.files.length; i++) {
                    let fileNode = node.files[i]
                    fileNode.selected = value
                }
            }
    
            if (node.subDirs && node.subDirs.length) {
                for (let i = 0; i < node.subDirs.length; i++) {
                    let dirNode = node.subDirs[i]
                    this.setSelectedNode(dirNode, value)
                }
            }
    
            node.selected = value
            node.partialSelected = false
        }


        updateDirNodeSelectedStatus (node) {
            if (!node) return
    
            let selectedSubNodesCount = 0
            let partitalSelectedSubNodesCount = 0
    
            if (node.files && node.files.length) {
                for (let i = 0; i < node.files.length; i++) {
                    let fileNode = node.files[i]
                    selectedSubNodesCount += (fileNode.selected ? 1 : 0)
                }
            }
    
            if (node.subDirs && node.subDirs.length) {
                for (let i = 0; i < node.subDirs.length; i++) {
                    let dirNode = node.subDirs[i]
                    this.updateDirNodeSelectedStatus(dirNode)
                    selectedSubNodesCount += (dirNode.selected ? 1 : 0);
                    partitalSelectedSubNodesCount += (dirNode.partialSelected ? 1 : 0)
                }
            }
    
            node.selected = (selectedSubNodesCount > 0 && selectedSubNodesCount === (node.subDirs.length + node.files.length))
            node.partialSelected = ((selectedSubNodesCount > 0 && selectedSubNodesCount < (node.subDirs.length + node.files.length)) || partitalSelectedSubNodesCount > 0)
        }

        updateAllDirNodesSelectedStatus () {
            if (!this.task || !this.task.multiDir) return
    
            for (let i = 0; i < this.task.files.length; i++) {
                let node = this.task.files[i]
    
                if (!node.isDir) {
                    continue
                }
    
                this.updateDirNodeSelectedStatus(node)
            }
        }

        changeTab (tabName) {
            if (tabName === 'settings') {
                this.loadTaskOption(this.task)
            }
    
            this.context.currentTab = tabName
        }

        extentLeftSwipe () {
            let tabIndex = this.tabOrders.indexOf(this.context.currentTab)
    
            if (tabIndex < this.tabOrders.length - 1) {
                this.changeTab(this.tabOrders[tabIndex + 1])
                return true
            } else {
                return false
            }
        }

        extentRightSwipe () {
            let tabIndex = this.tabOrders.indexOf(this.context.currentTab)

            if (tabIndex > 0) {
                this.changeTab(this.tabOrders[tabIndex - 1])
                return true
            } else {
                return false
            }
        }

        changeFileListDisplayOrder (type, autoSetReverse) {
            if (this.task && this.task.multiDir) return
    
            let oldType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getFileListDisplayOrder())
            let newType = this.ariaNgCommonService.parseOrderType(type)
    
            if (autoSetReverse && newType.type === oldType.type) {
                newType.reverse = !oldType.reverse
            }
    
            this.ariaNgSettingService.setFileListDisplayOrder(newType.getValue())
        }

        isSetFileListDisplayOrder (type) {
            let orderType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getFileListDisplayOrder())
            let targetType = this.ariaNgCommonService.parseOrderType(type)
    
            return orderType.equals(targetType)
        };
    
        getFileListOrderType () {
            if (this.task && this.task.multiDir) {
                return null
            }
    
            return this.ariaNgSettingService.getFileListDisplayOrder()
        }

        showChooseFilesToolbar () {
            if (!this.context.showChooseFilesToolbar) {
                this.pauseDownloadTaskRefresh = true
                this.context.showChooseFilesToolbar = true
            } else {
                this.cancelChooseFiles()
            }
        }

        isAnyFileSelected () {
            if (!this.task || !this.task.files) return false
    
            for (let i = 0; i < this.task.files.length; i++) {
                let file = this.task.files[i]
    
                if (!file.isDir && file.selected) {
                    return true
                }
            }
            return false
        }

        isAllFileSelected () {
            if (!this.task || !this.task.files) return false
    
            for (let i = 0; i < this.task.files.length; i++) {
                let file = this.task.files[i]
    
                if (!file.isDir && !file.selected) {
                    return false
                }
            }
            return true
        }

        selectFiles (type) {
            if (!this.task || !this.task.files) return
    
            if (type === 'auto') {
                if (this.isAllFileSelected()) {
                    type = 'none'
                } else {
                    type = 'all'
                }
            }
    
            for (let i = 0; i < this.task.files.length; i++) {
                let file = this.task.files[i]
    
                if (file.isDir) {
                    continue
                }
    
                if (type === 'all') {
                    file.selected = true
                } else if (type === 'none') {
                    file.selected = false
                } else if (type === 'reverse') {
                    file.selected = !file.selected
                }
            }
    
            this.updateAllDirNodesSelectedStatus()
        }

        chooseSpecifiedFiles (type) {
            if (!this.task || !this.task.files || !this.ariaNgFileTypes[type]) return
    
            let files = this.task.files
            let extensions = this.ariaNgFileTypes[type].extensions
            let fileIndexes = []
            let isAllSelected = true
    
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
    
                if (file.isDir) {
                    continue
                }
    
                let extension = this.ariaNgCommonService.getFileExtension(file.fileName)
    
                if (extension) {
                    extension = extension.toLowerCase()
                }
    
                if (extensions.indexOf(extension) >= 0) {
                    fileIndexes.push(i)
    
                    if (!file.selected) {
                        isAllSelected = false
                    }
                }
            }
    
            for (let i = 0; i < fileIndexes.length; i++) {
                let index = fileIndexes[i]
                let file = files[index]
    
                if (file && !file.isDir) {
                    file.selected = !isAllSelected
                }
            }
    
            this.updateAllDirNodesSelectedStatus()
        }

        saveChoosedFiles () {
            if (this.context.showChooseFilesToolbar) {
                this.$rootScope.loadPromise = this.setSelectFiles(false)
                this.context.showChooseFilesToolbar = false
            }
        }
    
        cancelChooseFiles () {
            if (this.context.showChooseFilesToolbar) {
                this.pauseDownloadTaskRefresh = false
                this.refreshDownloadTask(true)
                this.context.showChooseFilesToolbar = false
            }
        }

        showCustomChooseFileModal () {
            if (!this.task || !this.task.files) {
                return
            }
    
            let files = this.task.files
            let extensionsMap = {}
    
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
    
                if (file.isDir) {
                    continue
                }
    
                let extension = this.ariaNgCommonService.getFileExtension(file.fileName)
    
                if (extension) {
                    extension = extension.toLowerCase()
                }
    
                let extensionInfo = extensionsMap[extension]
    
                if (!extensionInfo) {
                    let extensionName = extension

                    if (extensionName.length > 0 && extensionName.charAt(0) === '.') {
                        extensionName = extensionName.substring(1)
                    }
    
                    extensionInfo = {
                        extension: extensionName,
                        classified: false,
                        selected: false,
                        selectedCount: 0,
                        unSelectedCount: 0
                    };
    
                    extensionsMap[extension] = extensionInfo
                }
    
                if (file.selected) {
                    extensionInfo.selected = true
                    extensionInfo.selectedCount++
                } else {
                    extensionInfo.unSelectedCount++
                }
            }
    
            let allClassifiedExtensions = {}
    
            for (let type in this.ariaNgFileTypes) {
                if (!this.ariaNgFileTypes.hasOwnProperty(type)) {
                    continue
                }

                let extensionTypeName = this.ariaNgFileTypes[type].name
                let allExtensions = this.ariaNgFileTypes[type].extensions
                let extensions = []
    
                for (let i = 0; i < allExtensions.length; i++) {
                    let extension = allExtensions[i]
                    let extensionInfo = extensionsMap[extension]
    
                    if (extensionInfo) {
                        extensionInfo.classified = true;
                        extensions.push(extensionInfo)
                    }
                }
    
                if (extensions.length > 0) {
                    allClassifiedExtensions[type] = {
                        name: extensionTypeName,
                        extensions: extensions
                    };
                }
            }
    
            let unClassifiedExtensions = []
    
            for (let extension in extensionsMap) {
                if (!extensionsMap.hasOwnProperty(extension)) {
                    continue
                }
    
                let extensionInfo = extensionsMap[extension]
    
                if (!extensionInfo.classified) {
                    unClassifiedExtensions.push(extensionInfo)
                }
            }
    
            if (unClassifiedExtensions.length > 0) {
                allClassifiedExtensions.other = {
                    name: 'Other',
                    extensions: unClassifiedExtensions
                };
            }
    
            this.context.fileExtensions = allClassifiedExtensions
            angular.element('#custom-choose-file-modal').modal()
        }

        setSelectedExtension (selectedExtension, selected) {
            if (!this.task || !this.task.files) return
    
            let files = this.task.files
    
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
    
                if (file.isDir) {
                    continue
                }
    
                let extension = this.ariaNgCommonService.getFileExtension(file.fileName)
    
                if (extension) {
                    extension = extension.toLowerCase()
                }
    
                if (extension !== '.' + selectedExtension) {
                    continue
                }
    
                file.selected = selected
            }
    
            this.updateAllDirNodesSelectedStatus()
            
        }

        setSelectedFile (updateNodeSelectedStatus) {
            if (updateNodeSelectedStatus) {
                this.updateAllDirNodesSelectedStatus()
            }
    
            if (!this.context.showChooseFilesToolbar) {
                this.setSelectFiles(true)
            }
        }

        collapseDir (dirNode, newValue, forceRecurse) {
            let nodePath = dirNode.nodePath
    
            if (angular.isUndefined(newValue)) {
                newValue = !this.context.collapsedDirs[nodePath]
            }
    
            if (newValue || forceRecurse) {
                for (let i = 0; i < dirNode.subDirs.length; i++) {
                    this.collapseDir(dirNode.subDirs[i], newValue, null)
                }
            }
    
            if (nodePath) {
                this.context.collapsedDirs[nodePath] = newValue
            }
        }

        collapseAllDirs (newValue) {
            if (!this.task || !this.task.files) return
    
            for (let i = 0; i < this.task.files.length; i++) {
                let node = this.task.files[i]
    
                if (!node.isDir) {
                    continue
                }
    
                this.collapseDir(node, newValue, true)
            }
        }
      /*
        setSelectedNode (dirNode) {
            setSelectedNode(dirNode, dirNode.selected);
            updateAllDirNodesSelectedStatus();
    
            if (!$scope.context.showChooseFilesToolbar) {
                $scope.setSelectedFile(false);
            }
        };
      */

        changePeerListDisplayOrder (type, autoSetReverse) {
            let oldType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getPeerListDisplayOrder())
            let newType = this.ariaNgCommonService.parseOrderType(type)

            if (autoSetReverse && newType.type === oldType.type) {
                newType.reverse = !oldType.reverse
            }

            this.ariaNgSettingService.setPeerListDisplayOrder(newType.getValue())
        }

        isSetPeerListDisplayOrder (type) {
            let orderType = this.ariaNgCommonService.parseOrderType(this.ariaNgSettingService.getPeerListDisplayOrder())
            let targetType = this.ariaNgCommonService.parseOrderType(type)
    
            return orderType.equals(targetType)
        }
    
        getPeerListOrderType () {
            return this.ariaNgSettingService.getPeerListDisplayOrder()
        }
    
        loadTaskOption  (task) {
            this.$rootScope.loadPromise = this.aria2TaskService.getTaskOptions(task.gid, (response) => {
                if (response.success) {
                    this.context.options = response.data
                }
            })
        }
    
        setOption (key, value, optionStatus) {
            return this.aria2TaskService.setTaskOption(this.task.gid, key, value, (response) => {
                if (response.success && response.data === 'OK') {
                    optionStatus.setSuccess()
                } else {
                    optionStatus.setFailed(response.data.message)
                }
            }, true)
        }

        copySelectedRowText () {
            if (!this.currentRowTriggeredMenu) {
                return
            }
    
            let name = this.currentRowTriggeredMenu.find('.setting-key > span').text().trim()
            let value = "";
    
            this.currentRowTriggeredMenu.find('.setting-value > span').each((i, element) => {
                if (i > 0) {
                    value += '\n'
                }
    
                value += angular.element(element).text().trim()
            });
    
            let info = name + ': ' + value
            this.clipboard.copyText(info)
        }

        onOverviewMouseDown () {
            angular.element('#overview-items .row[contextmenu-bind!="true"]').contextmenu({
                target: '#task-overview-contextmenu',
                before: (e, context) => {
                    this.currentRowTriggeredMenu = context
                }
            }).attr('contextmenu-bind', 'true')
        }
    }]
  })
}());