angular.module('app.services', []).factory('Sport', function ($resource) {
    return $resource('http://localhost:56513/odata/Sports(:Id)', { Id: '@_Id' }, {
        'update': { method: 'PUT' },
        'query': { method: 'GET', isArray: false }
    });
});