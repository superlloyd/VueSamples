var GoogleMapInitDeferred = $.Deferred();
function gmapInitialized() {
    // Map component, i.e. 'google-map' tag
    // include gmap API after this script:     
    // <script src="https://maps.googleapis.com/maps/api/js?callback=gmapInitialized" async defer> </script>
    GoogleMapInitDeferred.resolve();
}
Vue.component('google-map', function (resolve, reject) {
    GoogleMapInitDeferred.done(function (tpl) {
        resolve({
            template: '<div id={{id}}></div>',
            data: function () {
                return {
                    map: null,
                    mapMarkers: [],
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
                markers: null,
            },
            attached: function () {
                var getv = function (x, y) { return x == undefined ? y : x; };
                var lat;
                var map = new google.maps.Map(this.$el, {
                    center: new google.maps.LatLng(getv(this.lat, -27.468), getv(this.lng, 153.025)),
                    zoom: getv(this.zoom, 10),
                });
                this.map = map;
            },
            watch: {
                'markers': function (newVal, oldVal) {
                    var prev = this.mapMarkers;
                    $.each(prev, function (i, x) { return x.setMap(null); });
                    if (!newVal) {
                        this.mapMarkers = [];
                        return;
                    }
                    if (newVal.length === undefined) {
                        newVal = [newVal];
                    }
                    var map = this.map;
                    var na = newVal;
                    this.mapMarkers = na.map(function (value, index, array) {
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
});
