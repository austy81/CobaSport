angular.module('app.services', []).factory('Sport', function ($resource) {
    return $resource('http://localhost:56513/odata/Sports/:id', { id: '@_id' }, {
        'update': { method: 'PUT' },
        'query': { method: 'GET', isArray: false }
    });
});