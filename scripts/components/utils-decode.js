(function () {
  'use strict';
  angular.module('ariaNg').component('ariaNgUtilsDecode', {
    selector: 'ariaNgUtilsDecode',
    template: `<section class="content no-padding">
          <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                  <li ng-class="{'active': $ctrl.currentTab === 'decodeUrl'}">
                      <a class="pointer-cursor" ng-click="$ctrl.changeTab('decodeUrl')">Decode URL</a>
                  </li>
                  <li class="nav-toolbar">
                    <div class="btn-group">
                       <a ng-if="$ctrl.url" type="submit" class="btn btn-sm"
                        ng-click="$ctrl.decode($ctrl.url)"
                        ng-class="{'btn-default': !$ctrl.url , 'btn-success': $ctrl.url}"
                        ng-disabled="!$ctrl.url" translate>Decode
                       </a>&nbsp;
                       <a ng-if="$ctrl.url" type="submit" class="btn btn-sm"
                        ng-click="$ctrl.encode($ctrl.url)"
                        ng-class="{'btn-default': !$ctrl.url , 'btn-success': $ctrl.url}"
                        ng-disabled="!$ctrl.url" translate>Encode
                       </a>
                    </div>
                  </li>
              </ul>

            <div class="tab-content no-padding">
              <div class="tab-pane" ng-class="{'active': $ctrl.currentTab === 'decodeUrl'}">
                  <div class="new-task-table">
                      <div class="row">
                          <div class="col-sm-12">
                              <div class="form-group has-feedback no-margin">
                                  <textarea name="urls" class="form-control" rows="10" autofocus="autofocus"
                                  ng-model="$ctrl.url"
                                  ng-placeholder="'Add url to decode.'"></textarea>
                               </div>
                          </div>
                       </div>
                   </div>
               </div>
           </div>

          <div class="tab-content no-padding">
              <div class="tab-pane" ng-class="{'active': $ctrl.currentTab === 'decodeUrl'}">
                <div class="new-task-table">
                      <div class="row">
                          <div class="col-sm-12">
                              <div class="form-group has-feedback no-margin">
                                <textarea name="urls" class="form-control" rows="10"
                                  ng-model="$ctrl.decoded"></textarea>
                              </div>
                          </div>
                      </div>
                   </div>
                 </div>
              </div>
          </div>
      </section>`,
    controller: ['$rootScope', '$timeout', class aria2UtilsDecode {
      constructor($rootScope, $timeout) {
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.url = '';
        this.currentTab = '';
        this.decoded = '';

        this.$rootScope.loadPromise = this.$timeout(() => { }, 100);
      }

      changeTab(tab) {
        this.currentTab = tab;
      }

      decode(url) {
        this.decoded = decodeURIComponent(url);
      }

      encode(url) {
        this.decoded = encodeURIComponent(url);
      }
    }]
  });
}());