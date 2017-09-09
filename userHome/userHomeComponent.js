(function () {
    "use strict"

    angular.module(ymcGlobals.appName)
        .component('userHome',
        {
            templateUrl: '/app/admin/modules/userHome/userHome.html',
            controller: 'userHomeController',
            controllerAs: 'homeVm'
        });

})();
