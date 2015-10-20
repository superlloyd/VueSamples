var Sample;
(function (Sample) {
    var MapControl;
    (function (MapControl) {
        var model = {
            markers: null,
        };
        new Vue({
            el: '#sample',
            data: model,
        });
        GoogleMapInitDeferred.then(function () {
            model.markers = [
                new google.maps.LatLng(-27.468, 153.025),
                new google.maps.LatLng(-27.478, 153.035),
                new google.maps.LatLng(-27.458, 153.015),
                new google.maps.LatLng(-27.458, 153.055),
            ];
        });
    })(MapControl = Sample.MapControl || (Sample.MapControl = {}));
})(Sample || (Sample = {}));
