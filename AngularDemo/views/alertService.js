angular.module('app.alertServices', [])
    .factory('$alertService', function($rootScope) {
        var alertService = {};

        // create an array of alerts available globally
        $rootScope.alerts = [];

        alertService.add = function(type, msg) {
            $rootScope.alerts.push({ 'type': type, 'msg': msg, close: function() { alertService.closeAlert(this); } });
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