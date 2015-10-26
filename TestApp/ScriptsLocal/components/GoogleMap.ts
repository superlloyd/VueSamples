var GoogleMapInitDeferred = $.Deferred();
function gmapInitialized() {
    // Map component, i.e. 'google-map' tag
    // include gmap API after this script:     
    // <script src="https://maps.googleapis.com/maps/api/js?callback=gmapInitialized" async defer> </script>
    GoogleMapInitDeferred.resolve();
}

Vue.component('google-map', function (resolve, reject) {
    GoogleMapInitDeferred.done(tpl => {
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
                width: {
                    type: String,
                    required: false,
                    default: '510pt',
                },
                height: {
                    type: String,
                    required: false,
                    default: '340pt',
                },
                markers: null, // google.maps.LatLng | google.maps.LatLng[]
            },
            attached: function () {
                var getv = (x, y) => x == undefined ? y : x;
                var mm: HTMLElement = this.$el;
                mm.style.width = this.width;
                mm.style.height = this.height;
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
