(function () {
    'use strict';

    angular.module('ariaNg').directive('ngChart', ['$window', 'chartTheme', function ($window, chartTheme) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                options: '=ngData'
            },
            link: function (scope, element, attrs) {
                var options = {
                    ngTheme: 'dark'
                };

                angular.extend(options, attrs);

                var wrapper = element.find('div');
                var wrapperParent = element.parent();
                var parentHeight = wrapperParent.height();

                var height = parseInt(attrs.height) || parentHeight || 200;
                wrapper.css('height', height + 'px');

                var chart = echarts.init(wrapper[0], chartTheme.get(options.ngTheme));

                var setOptions = function (value) {
                    chart.setOption(value);
                };

                angular.element($window).on('resize', function () {
                    chart.resize();
                    scope.$apply();
                });

                scope.$watch('options', function (value) {
                    if (value) {
                        setOptions(value);
                    }
                }, true);

                scope.$on('$destroy', function() {
                    if (chart && !chart.isDisposed()) {
                        chart.dispose();
                    }
                });
            }
        };
    }]).directive('ngPopChart', ['$window', 'chartTheme', function ($window, chartTheme) {
        return {
            restrict: 'A',
            scope: {
                options: '=ngData'
            },
            link: function (scope, element, attrs) {
                var options = {
                    ngTheme: 'dark',
                    ngPopoverClass: '',
                    ngContainer: 'body',
                    ngTrigger: 'click',
                    ngPlacement: 'top'
                };

                angular.extend(options, attrs);

                var chart = null;
                var loadingIcon = '<div class="loading"><i class="fa fa-spinner fa-spin fa-2x"></i></div>';

                element.popover({
                    container: options.ngContainer,
                    content: '<div class="chart-pop-wrapper"><div class="chart-pop ' + options.ngPopoverClass + '">' + loadingIcon +'</div></div>',
                    html: true,
                    placement: options.ngPlacement,
                    template: '<div class="popover chart-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
                    trigger: options.ngTrigger
                }).on('shown.bs.popover', function () {
                    var wrapper = angular.element('.chart-pop');
                    var wrapperParent = wrapper.parent();
                    var parentHeight = wrapperParent.height();

                    wrapper.empty();

                    var height = parseInt(attrs.height) || parentHeight || 200;
                    wrapper.css('height', height + 'px');

                    chart = echarts.init(wrapper[0], chartTheme.get(options.ngTheme));
                }).on('hide.bs.popover', function () {
                    if (chart && !chart.isDisposed()) {
                        chart.dispose();
                    }
                }).on('hidden.bs.popover', function () {
                    angular.element('.chart-pop').empty().append(loadingIcon);
                });

                var setOptions = function (value) {
                    if (chart && !chart.isDisposed()) {
                        chart.setOption(value);
                    }
                };

                scope.$watch('options', function (value) {
                    if (value) {
                        setOptions(value);
                    }
                }, true);
            }
        };
    }]).factory('chartTheme', ['chartDarkTheme', function (chartDarkTheme) {
        var themes = {
            darkTheme: chartDarkTheme
        };

        return {
            get: function (name) {
                return themes[name + 'Theme'] ? themes[name + 'Theme'] : {};
            }
        };
    }]).factory('chartDarkTheme', function () {
        return {
            color: ['rgb(104, 238, 51)', '#3a89e9'],
            backgroundColor: '#111',
            label: {
                textStyle: {
                    color: '#FFF'
                }
            },
            legend: {
                top: 'bottom'
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#233333',
                        type: 'dashed',
                        width: 1
                    },
                    crossStyle: {
                        color: '#008acd',
                        width: 1
                    }
                }
            },
            grid: {
                x: 40,
                y: 20,
                x2: 30,
                y2: 50
            },
            categoryAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f38d09'
                    }
                }
            },
            valueAxis: {
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#FFF'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f38d09'
                    }
                },
                splitArea: {
                    show: false
                }
            },
            line: {
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            type: 'solid'
                        }
                    }
                },
                smooth: true,
                symbolSize: 6
            },
            textStyle: {
                fontFamily: 'Hiragino Sans GB, Microsoft YaHei, STHeiti, Helvetica Neue, Helvetica, Arial, sans-serif'
            },
            animationDuration: 500
        };
    });
}());
