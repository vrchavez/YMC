(function () {
    "use strict";
    angular.module(ymcGlobals.appName)
        .factory('userHomeService', userHomeService);
    userHomeService.$inject = ['$http', '$q'];

    function userHomeService($http, $q) {
        return {
            getCalendarEvents: _getCalendarEvents
            , getAppointments: _getAppointments
            , getAppointmentTypes: _getAppointmentTypes
            , postAppointment: _postAppointment
            , updateAppointment: _updateAppointment
            , deleteAppointment: _deleteAppointment
        };

        function _getCalendarEvents(data) {
            var settings = {
                url: '/api/CalendarEvents/',
                method: 'GET',
                cache: false,
                contentType: 'json; charset=UTF-8',
                withCredentials: true,
                params: data
            };
            return $http(settings)
                .then(_getEventsComplete, _getEventsFailed);
        }

        function _getEventsComplete(response) {
            return response.data.items;
        }

        function _getEventsFailed(error) {
            var msg = 'Failed to insert dog';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _getAppointments(data) {
            var settings = {
                url: '/api/appointment/',
                method: 'GET',
                cache: false,
                contentType: 'json; charset=UTF-8',
                withCredentials: true,
                params: data
            };
            return $http(settings)
                .then(_getAppointmentsComplete, _getAppointmentsFailed);
        }

        function _getAppointmentsComplete(response) {
            return response.data.items;
        }

        function _getAppointmentsFailed(error) {
            var msg = 'Failed to insert dog';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _getAppointmentTypes() {
            var settings = {
                url: '/api/appointmentType',
                method: 'GET',
                cache: false,
                contentType: 'json; charset=UTF-8',
                withCredentials: true,
            };
            return $http(settings)
                .then(_getAppointmentTypesComplete, _getAppointmentTypesFailed);
        }

        function _getAppointmentTypesComplete(response) {
            return response.data.items;
        }

        function _getAppointmentTypesFailed(error) {
            var msg = 'Failed to insert dog';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _postAppointment(data) {
            var settings = {
                url: '/api/appointment',
                method: 'POST',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                withCredentials: true
            };
            return $http(settings)
                .then(_postAppointmentComplete, _postAppointmentFailed);
        }

        function _postAppointmentComplete(response) {
            // unwrap the data from the response
            return response.data;
        }

        function _postAppointmentFailed(error) {
            var msg = 'Failed To Post';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _updateAppointment(data) {
            var settings = {
                url: '/api/appointment/' + data.id,
                method: 'PUT',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                withCredentials: true
            };
            return $http(settings)
                .then(_updateAppointmentComplete, _updateAppointmentFailed);
        }

        function _updateAppointmentComplete(response) {
            // unwrap the data from the response
            return response.data;
        }

        function _updateAppointmentFailed(error) {
            var msg = 'Failed To Post';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _deleteAppointment(data) {
            var settings = {
                url: '/api/appointment/' + data,
                method: 'DELETE',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                withCredentials: true
            };
            return $http(settings)
                .then(_deleteAppointmentComplete, _deleteAppointmentFailed);
        }

        function _deleteAppointmentComplete(response) {
            // unwrap the data from the response
            return response.data;
        }

        function _deleteAppointmentFailed(error) {
            var msg = 'Failed To Post';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }
    }
})();
