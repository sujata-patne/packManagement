myApp.directive("compareWithStartDate", function () {
    return {
        restrict: "A",
        require: "?ngModel",
        link: function (scope, element, attributes, ngModel) {
            validateEndDate = function (endDate, startDate) {
                if (endDate && startDate) {
                    return endDate >= startDate;
                }
                else {
                    return true;
                }
            }

            // use $validators.validation_name to do the validation
            ngModel.$validators.checkEndDate = function (modelValue) {
                var startdate = parseInt(attributes.startDate);
                var enddate = parseInt(modelValue);
                return validateEndDate(enddate, startdate);
            };
            
            // use $observe if we need to keep an eye for changes on a passed value
            attributes.$observe('startDate', function (value) {
                var startdate = parseInt(value);
                var enddate = parseInt(ngModel.$viewValue);
                
                // use $setValidity method to determine the validation result 
                // the first parameter is the validation name, this name is the same in ng-message template as well
                // the second parameter sets the validity (true or false), we can pass a function returning a boolean
                ngModel.$setValidity("checkEndDate", validateEndDate(enddate, startdate));
            });
        }
    };
});

myApp.directive('loadingSpinner',function(){

    return {
        restrict:'EA',
        template:" <center><span class='center-block' ng-show='loading'><i class='fa fa-spinner fa-spin'></i></span></center>"
    }

});

myApp.directive("requestLoading",function(){
    return {
        templateUrl:"../../partials/loading.html"

    };
});