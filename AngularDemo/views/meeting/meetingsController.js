app.controller('meetingsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        var apiUrl = 'http://localhost:56513/odata';
        var apiController = '/meeting/';
        var apiSportsController = '/sport/';

        $scope.meetingsList = [];
        $scope.sport = {};
        $scope.isCreatingNewMeeting = false;

        $scope.toggleIsCreatingNewMeeting = function() {
            $scope.isCreatingNewMeeting = !$scope.isCreatingNewMeeting;
        }

        var getSport = function(sportId) {
            $http.get(apiUrl + apiSportsController + sportId)
                .success(function(data) {
                $scope.sport = data;
            });
        }

        var getMeetings = function(sportId) {
            $http.get(apiUrl + apiController)
                .success(function (data) {
                    $scope.meetingsList = [];
                    var index;
                    for (index = 0; index < data.length; ++index) {
                        if (data[index].SportId == sportId)
                            $scope.meetingsList.push(data[index]);
                    }
                });
        }

        $scope.deleteMeeting = function (id) {
            $http.delete(apiUrl + apiController + id).success(function() {
                getMeetings($routeParams.sportId);
            });
        }

        $scope.createNewMeeting = function() {

            var data = {
                Timestamp: $scope.newMeetingDate,
                SportId: $routeParams.sportId
            };
            $scope.newMeeting = '';

            $http.post(apiUrl + apiController, data)
                .success(function(data, status, headers, config) {
                    getMeetings($routeParams.sportId);
                })
                .error(function(data, status, headers, config) {

                });
        }

        getMeetings($routeParams.sportId);
        getSport($routeParams.sportId);

        $scope.today = function () {
            $scope.newMeetingDate = new Date();
        };
        $scope.today();

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

    }
]);