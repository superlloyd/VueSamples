
module Sample.MapControl {
    var model = {
        markers: <google.maps.LatLng[]>null,
    };
    new Vue({
        el: '#sample',
        data: model,
    });
    GoogleMapInitDeferred.then(() => {
        model.markers = [
            new google.maps.LatLng(-27.468, 153.025),
            new google.maps.LatLng(-27.478, 153.035),
            new google.maps.LatLng(-27.458, 153.015),
            new google.maps.LatLng(-27.458, 153.055),
        ];
    });
}
