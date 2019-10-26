(function () {
  'use strict';
  angular.module('ariaNg').component('cmdController', {
    selector: 'cmdController',
    controller: ['$rootScope', '$window', '$location', '$routeParams', 'ariaNgDefaultOptions', 'ariaNgCommonService', 
        'ariaNgLocalizationService', 'ariaNgLogService', 'ariaNgSettingService', 'aria2TaskService', 'aria2SettingService', class CommandController {
        constructor ($rootScope, $window, $location, $routeParams, ariaNgDefaultOptions, ariaNgCommonService, 
            ariaNgLocalizationService, ariaNgLogService, ariaNgSettingService, aria2TaskService, aria2SettingService) {
                this.$rootScope = $rootScope
                this.$window = $window
                this.$location = $location
                this.$routeParams = $routeParams
                this.ariaNgDefaultOptions = ariaNgDefaultOptions
                this.ariaNgCommonService = ariaNgCommonService
                this.ariaNgLocalizationService = ariaNgLocalizationService
                this.ariaNgLogService = ariaNgLogService
                this.ariaNgSettingService = ariaNgSettingService
                this.aria2TaskService = aria2TaskService
                this.aria2SettingService = aria2SettingService

                this.path = this.$location.path()

                this.allParameters = angular.extend({}, this.$routeParams, this.$location.search())

                if (!this.doCommand(this.path, this.allParameters)) {
                    this.$location.path('/downloading')
                }
        }

        doNewTaskCommand (url, params) {
            try {
                url = this.ariaNgCommonService.base64UrlDecode(url)
            } catch (ex) {
                this.ariaNgLocalizationService.showError('URL is not base64 encoded!')
                return false
            }
    
            let options = {}
            let isPaused = false
    
            if (params) {
                for (let key in params) {
                    if (!params.hasOwnProperty(key)) {
                        continue
                    }
    
                    if (this.aria2SettingService.isOptionKeyValid(key)) {
                        options[key] = params[key]
                    }
                }
    
                if (params.pause === 'true') {
                    isPaused = true
                }
            }
    
            this.$rootScope.loadPromise = this.aria2TaskService.newUriTask({
                urls: [url],
                options: options
            }, isPaused, function (response) {
                if (!response.success) return false
    
                if (isPaused) {
                    this.$location.path('/waiting')
                } else {
                    this.$location.path('/downloading')
                }
            });
    
            this.ariaNgLogService.info('[CommandController] new download: ' + url)
    
            return true
        }

        doSetRpcCommand (rpcProtocol, rpcHost, rpcPort, rpcInterface, secret) {
            rpcPort = rpcPort || this.ariaNgDefaultOptions.rpcPort
            rpcInterface = rpcInterface || this.ariaNgDefaultOptions.rpcInterface
            secret = secret || this.ariaNgDefaultOptions.secret
    
            this.ariaNgLogService.info('[CommandController] set rpc: ' + rpcProtocol + '://' + rpcHost + ':' + rpcPort + '/' + rpcInterface + ', secret: ' + secret);
    
            if (!rpcProtocol || (rpcProtocol !== 'http' && rpcProtocol !== 'https' && rpcProtocol !== 'ws' && rpcProtocol !== 'wss')) {
                this.ariaNgLocalizationService.showError('Protocol is invalid!')
                return false
            }
    
            if (!rpcHost) {
                this.ariaNgLocalizationService.showError('RPC host cannot be empty!')
                return false
            }
    
            if (secret) {
                try {
                    secret = this.ariaNgCommonService.base64UrlDecode(secret)
                } catch (ex) {
                    this.ariaNgLocalizationService.showError('RPC secret is not base64 encoded!')
                    return false
                }
            }
    
            let newSetting = {
                rpcAlias: '',
                rpcHost: rpcHost,
                rpcPort: rpcPort,
                rpcInterface: rpcInterface,
                protocol: rpcProtocol,
                httpMethod: this.ariaNgDefaultOptions.httpMethod,
                secret: secret
            };
    
            if (this.ariaNgSettingService.isRpcSettingEqualsDefault(newSetting)) {
                this.$location.path('/downloading')
            } else {
                this.ariaNgSettingService.setDefaultRpcSetting(newSetting, {
                    keepCurrent: false,
                    forceSet: true
                })
    
                this.$location.path('/downloading')
                this.$window.location.reload()
            }
    
            return true
        }

        doCommand (path, params) {
            if (path.indexOf('/new') === 0) {
                return this.doNewTaskCommand(params.url, params)
            } else if (path.indexOf('/settings/rpc/set') === 0) {
                return this.doSetRpcCommand(params.protocol, params.host, params.port, params.interface, params.secret)
            } else {
                this.ariaNgLocalizationService.showError('Parameter is invalid!')
                return false
            }
        }
    }]
  })
}());