var dataActions = {
    'update': { method: 'PUT' },
    'query': { method: 'GET', isArray: false }
};
var key = { Id: '@_Id' };
var oDataUrl = '/odata/';
var idParam = '(:Id)';

angular.module('app.dataServices', [])
    .factory('Sport', function ($resource) {
    return $resource(oDataUrl + 'Sports' + idParam, key, dataActions);
    }).factory('Player', function ($resource) {
        return $resource(oDataUrl + 'Players' + idParam, key, dataActions);
    }).factory('Meeting', function ($resource) {
        return $resource(oDataUrl + 'Meetings' + idParam, key, dataActions);
    }).factory('SportPlayer', function ($resource) {
        return $resource(oDataUrl + 'SportPlayers' + idParam, key, dataActions);
    }).factory('MeetingPlayer', function ($resource) {
        return $resource(oDataUrl + 'MeetingPlayers' + idParam, key, dataActions);
    });