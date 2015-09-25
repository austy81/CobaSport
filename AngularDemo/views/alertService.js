angular.module('app.alertServices', [])
    .factory('$alertService', function($rootScope) {
        var alertService = {};

        // create an array of alerts available globally
        $rootScope.alerts = [];

        //types: info, warning, danger, success, 
        alertService.add = function (type, msg) {
            $rootScope.alerts = [];
            $rootScope.alerts.push({ 'type': type, 'msg': msg, close: function () { alertService.closeAlert(this); } });
            setTimeout(function() {
                $rootScope.alerts.shift();
                $rootScope.$apply();
            }, 8000);
        };

        alertService.closeAlert = function(alert) {
            alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
        }

        alertService.closeAlertIdx = function(index) {
            $rootScope.alerts.splice(index, 1);
        };

        $rootScope.clearAllAlerts = function () {
            $rootScope.alerts = [];
        };

        return alertService;
    });