module Sample.MapControl {
    export var MapInitDefered = $.Deferred();
}
function gmapInitialized() {
    Sample.MapControl.MapInitDefered.resolve();
}
// Map component, i.e. 'google-map' tag
// include gmap API after this script:     
// <script src="https://maps.googleapis.com/maps/api/js?callback=gmapInitialized" async defer> </script>
Vue.component('google-map', function (resolve, reject) {
    Sample.MapControl.MapInitDefered.done(tpl => {
        resolve({
            template: '<div id={{id}}></div>',
            data: function () {
                return {
                    map: <google.maps.Map>null,
                    mapMarkers: <google.maps.Marker[]>[],
                };
            },
            props: {
                id: {
                    type: String,
                    required: true,
                },
                lat: {
                    type: Number,
                    required: false,
                },
                lng: {
                    type: Number,
                    required: false,
                },
                zoom: {
                    type: Number,
                    required: false,
                },
                markers: null, // google.maps.LatLng | google.maps.LatLng[]
            },
            attached: function () {
                var getv = (x, y) => x == undefined ? y : x;
                var lat
                var map = new google.maps.Map(this.$el, {
                    center: new google.maps.LatLng(getv(this.lat, -27.468), getv(this.lng, 153.025)),
                    zoom: getv(this.zoom, 10),
                });
                this.map = map;
            },
            watch: {
                'markers': function (newVal, oldVal) {
                    var prev = <google.maps.Marker[]>this.mapMarkers;
                    $.each(prev, (i, x) => x.setMap(null));
                    if (!newVal) {
                        this.mapMarkers = [];
                        return;
                    }
                    if (newVal.length === undefined) {
                        newVal = [newVal];
                    }
                    var map = <google.maps.Map>this.map;
                    var na = <google.maps.LatLng[]>newVal;
                    this.mapMarkers = na.map((value, index, array) => {
                        var m = new google.maps.Marker({
                            position: value,
                            map: map,
                            title: 'Hello World!'
                        });
                        return m;
                    });
                },
            }
        });
    });
})

module Sample.MapControl {
    var model = {
        markers: <google.maps.LatLng[]>null,
    };
    new Vue({
        el: '#sample',
        data: model,
    });
    Sample.MapControl.MapInitDefered.then(() => {
        model.markers = [
            new google.maps.LatLng(-27.468, 153.025),
            new google.maps.LatLng(-27.478, 153.035),
            new google.maps.LatLng(-27.458, 153.015),
            new google.maps.LatLng(-27.458, 153.055),
        ];
    });
}
