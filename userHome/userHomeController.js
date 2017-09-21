(function () {
    "use strict";
    angular.module(ymcGlobals.appName)
        .controller('userHomeController', userHomeController);
    userHomeController.$inject = ['userHomeService', '$stateParams', 'userService', '$scope', '$state', 'personService'];

    function userHomeController(userHomeService, $stateParams, userService, $scope, $state, personService) {
        var vm = this;     
        vm.$onInit = _init;
        vm.$scope = $scope;
        vm.personId = $stateParams.id;
        vm.startDateBeforeRender = _startDateBeforeRender;
        vm.startDateOnSetTime = _startDateOnSetTime;
        vm.endDateBeforeRender = _endDateBeforeRender;
        vm.endDateOnSetTime = _endDateOnSetTime;
        vm.deleteEvent = _deleteEvent;
        vm.closer = _closer;        
        vm.userHomeService = userHomeService;
        vm.userService = userService;       
        vm.personService = personService;
        vm.userService = userService;
        vm.isPressed = false;
        vm.appointForm = null;
        vm.sendToSql = {};
        vm.item = {};
        vm.events = [];
        vm.appointments = [];
        vm.appointmentTypes = [];
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        vm.userInfo = null; // info about the currently logged-in user
        vm.person = null // personBase for the person being examined
        var firstDayOfMonth = new Date(y, m, 1);
        var lastDayOfMonth = new Date(y, m + 1, 1);
        var firstDayIso = firstDayOfMonth.toISOString();
        var lastDayIso = lastDayOfMonth.toISOString();

        function _init() {
            vm.userService.getUserInfo()
                .then(function (data) {
                    // if vm.getId was not specified or the logged-in user is not an Admin,
                    // show them their own home page.
                    if (data && data.item) {
                        vm.userInfo = data.item;
                        vm.roleNames = data.item.roles;
                        if (!vm.roleNames || !vm.roleNames.includes("Admin") || !vm.getId) {
                            vm.getId = data.item.id;
                        }
                    }
                    return vm.personService.personSelectById(vm.getId);
                })
                .then(function (data) {
                    if (data && data.item) {
                        vm.person = data.item;
                    }
                    // should get all sessions for date range and personId
                    return vm.userHomeService.getAppointmentTypes();
                }
                )
                .then(function (data) {
                    vm.appointmentTypes = data;
                    _searchDBForEvents(vm.getId, firstDayIso, lastDayIso);
                }, _getAllError)
        }

        function _searchDBForEvents(id, start, end) {
            vm.sendToSql = { PersonId: id, CriteriaStartDate: start, CriteriaEndDate: end };
            vm.userHomeService.getCalendarEvents(vm.sendToSql)
                .then(_getAllSuccess, _getAllError);
            vm.userHomeService.getAppointments(vm.sendToSql)
                .then(_getAppointmentsSuccess, _getAllError); 
        }

        function _splitDates(x) {
            return x.split("T")[0].split("-");
        }

                //---------DATETIMEPICKER VALIDATIONS--------------------
        //Function that checks if the Due Date is set so it can gray out a date to pick after that date
        function _startDateBeforeRender($dates) {
            if (vm.item && vm.item.criteriaEndDate) {//Checks truthiness, if DueDate is set
                var activeDate = moment(vm.item.criteriaEndDate);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }

        //Function that checks if the assigned date is set or not so it can disable dates before it
        function _endDateBeforeRender($view, $dates) {
            if (vm.item && vm.item.criteriaStartDate) {
                var activeDate = moment(vm.item.criteriaStartDate).subtract(1, $view).add(1, 'minute');
                
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }

        function _deleteEvent() {
            swal({
                title: "Are you sure?",
                text: "Activity will be deleted forever!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "red",
                confirmButtonText: "DELETE",
                cancelButtonColor: "blue"
            })
                .then
                (function (isConfirm) {
                    if (isConfirm) {
                        vm.userHomeService.deleteAppointment(vm.item.id)
                            .then(_deleteSuccess, _deleteError);
                    }
                })
        }

        function _deleteSuccess(data) {
            for (var i = 0; i < vm.appointments.length; i++) {
                if (vm.appointments[i].id == vm.item.id) {
                    swal("Deleted!", "Activity has been deleted.", "success");
                    vm.remove(i);
                    vm.item = {};
                }
            }
            vm.appointForm.$setPristine();
            vm.isPressed = false;
            angular.element(document.querySelector('#modal-edit-event')).modal('hide');
        }

        function _deleteError(error) {
            if (error && error.message) {
                $.growl({
                    message: 'Failed to get info from database',
                }, {
                        element: 'body',
                        allow_dismiss: true,
                        offset: { x: 20, y: 85 },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2000,
                        url_target: '_blank',
                        mouse_over: false,
                    });
            }
        }

        //Uses $scope to broadcast that the start date is changed, which in turn triggers the end-datetimepicker to rerender
        function _startDateOnSetTime() {
            vm.$scope.$broadcast('start-date-changed');
        }

        //Uses $scope to broadcast that the end date is changed, which in turn triggers the start-datetimepicker to rerender
        function _endDateOnSetTime() {
            vm.$scope.$broadcast('end-date-changed');
        }

        function _getUserSuccess(data) {
            vm.getId = data.item.id;
            _searchDBForEvents(vm.getId, firstFormat, lastFormat);
        }

        function _getUserError(error) {
            if (error && error.message) {
                $.growl({
                    message: 'Failed to get info from database',
                }, {
                        element: 'body',
                        allow_dismiss: true,
                        offset: { x: 20, y: 85 },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2000,
                        url_target: '_blank',
                        mouse_over: false,
                    });
            }
        }

        function _getAllSuccess(data) {   
            if (data != null) {
                vm.events.length = 0;
                for (var i = 0; i < data.length; i++) {
                    var beginDate = data[i].startDatetime;
                    var endDate = data[i].endDatetime;
                    vm.events.push({ type: 'party', title: data[i].sessionName, start: beginDate, end: endDate, allDay: false, sessId: data[i].sessionId, session: true });
                }
            }
        }

        function _getAppointmentsSuccess(data) {
            vm.appointments.length = 0;
            if (data != null) {
                for (var x = 0; x < data.length; x++) {
                    var beginDate = moment(data[x].startDate);
                    var endDate = moment(data[x].endDate);
                    vm.appointments.push({ title: data[x].name, start: beginDate, end: endDate, allDay: false, className: 'bgm-lightgreen', id: data[x].id, eventId: data[x].appointmentTypeId, descript: data[x].description});
                }
            }
        }

        function _getAllError(error) {
            if (error && error.message) {
                $.growl({
                    message: 'Failed to get info from database',
                }, {
                        element: 'body',
                        allow_dismiss: true,
                        offset: { x: 20, y: 85 },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2000,
                        url_target: '_blank',
                        mouse_over: false,
                    });
            }
        }

        function _closer() {
            vm.item = {};
            vm.isPressed = false;
        }
        
        /* event source that calls a function on every view switch */
        vm.eventsF = function (start, end, timezone, callback) {
            _searchDBForEvents(vm.getId, start.toISOString(), end.toISOString());
            callback(vm.events); //Refresh Session Events in Calendar
            callback(vm.appointments); //Refresh Personal Events in Calendar
        };

        vm.calEventsExt = {
            color: '#8BC34A',
            textColor: '#fff',
            events: []
        };

        /* ADD EVENT */
        vm.addEvent = function () {
            vm.isPressed = true;
            if (vm.appointForm.$valid) {
                vm.events.push({
                    title: vm.item.Name,
                    start: vm.item.criteriaStartDate,
                    end: vm.item.criteriaEndDate,
                    allDay: false,
                    className: 'bgm-lightgreen'
                });
                vm.item.PersonId = vm.getId;    
                vm.userHomeService.postAppointment(vm.item)
                    .then(_postAppointmentSuccess, _postAppointmentError);
            } 
        };

        vm.updateEvent = function () {
            vm.isPressed = true;
            if (vm.appointForm.$valid && vm.item.id) {
                for (var i = 0; i < vm.appointments.length; i++) {
                    if (vm.appointments[i].id == vm.item.id) {
                        vm.appointments[i].title = vm.item.Name;
                        vm.appointments[i].start = vm.item.criteriaStartDate;
                        vm.appointments[i].end = vm.item.criteriaEndDate;
                        vm.appointments[i].eventId = vm.item.appointmentTypeId;
                        vm.appointments[i].descript = vm.item.description;
                    }
                }
                vm.item.PersonId = vm.getId;
                vm.userHomeService.updateAppointment(vm.item)
                    .then(_updateAppointmentSuccess, _updateAppointmentError);
            }
        };

        function _postAppointmentSuccess(data) {
            vm.isPressed = false;
            vm.appointForm.$setPristine();
            $.growl({
                message: 'Activity Posted Successfully',
            }, {
                    element: 'body',
                    type: 'success',
                    allow_dismiss: true,
                    offset: { x: 20, y: 85 },
                    spacing: 10,
                    z_index: 1031,
                    delay: 2000,
                    url_target: '_blank',
                    mouse_over: false,
                });
            vm.item = {};
            angular.element(document.querySelector('#modal-new-event')).modal('hide');
        }

        function _postAppointmentError(error) {
            if (error && error.message) {
                $.growl({
                    message: 'Failed to get info from database',
                }, {
                        element: 'body',
                        allow_dismiss: true,
                        offset: { x: 20, y: 85 },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2000,
                        url_target: '_blank',
                        mouse_over: false,
                    });
            }
        }

        function _updateAppointmentSuccess(data) {
            vm.isPressed = false;
            vm.appointForm.$setPristine();
            $.growl({
                message: 'Activity Posted Successfully',
            }, {
                    element: 'body',
                    type: 'success',
                    allow_dismiss: true,
                    offset: { x: 20, y: 85 },
                    spacing: 10,
                    z_index: 1031,
                    delay: 2000,
                    url_target: '_blank',
                    mouse_over: false,
                });
            vm.item = {};
            angular.element(document.querySelector('#modal-edit-event')).modal('hide');
        }

        function _updateAppointmentError(error) {
            if (error && error.message) {
                $.growl({
                    message: 'Failed to get info from database',
                }, {
                        element: 'body',
                        allow_dismiss: true,
                        offset: { x: 20, y: 85 },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2000,
                        url_target: '_blank',
                        mouse_over: false,
                    });
            }
        }

        /* Remove event from front end (Appointments array)*/
        vm.remove = function (index) {
            vm.appointments.splice(index, 1);
        };
        /* Change View */
        vm.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        vm.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        vm.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
        };
        /* config object */
        vm.uiConfig = {
            calendar: {
                height: 500,
                fixedWeekCount: false,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'prev, next'
                },
                eventClick: function (event, jsEvent, view) {
                    if (event.session) {
                         //HERE WE SHOULD ALSO CHECK IF THE LOGGED IN USER IS AN ADMIN
                        $state.go('sessionDetail', { id: event.sessId }, { reload: true });
                    } 
                    else {
                        var isoDate = moment(event).toISOString();
                        angular.element(document.querySelector('#modal-edit-event')).modal('show');
                        for (var i = 0; i < vm.appointments.length; i++) {
                            if (vm.appointments[i].id == event.id) {
                                vm.item.Name = event.title;
                                vm.item.criteriaStartDate = event.start;
                                vm.item.criteriaEndDate = event.end;
                                vm.item.appointmentTypeId = event.eventId;
                                vm.item.description = event.descript;
                                vm.item.id = event.id;
                            }
                        }
                        _startDateOnSetTime();
                        _endDateOnSetTime();
                    }         
                },
                eventDrop: vm.alertOnDrop,
                eventResize: vm.alertOnResize,
                eventRender: vm.eventRender,
                dayClick: function (date, jsEvent, view) {
                    angular.element(document.querySelector('#modal-new-event')).modal('show');
                    vm.item.criteriaStartDate = date;
                    _startDateOnSetTime();
                }          
            }
        };

        vm.alertOnEventClick  = function () {
            console.log("THIS WORKS");
        }

        vm.eventSources1 = [vm.calEventsExt, vm.newEvents];
        vm.eventSources = [vm.calEventsExt, vm.eventsF, vm.events, vm.appointments];
    }
})();
