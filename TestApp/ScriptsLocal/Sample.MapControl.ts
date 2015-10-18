module Sample.MapControl {
    export var MapInitDefered = $.Deferred();
}
function gmapInitialized() {
    Sample.MapControl.MapInitDefered.resolve();
}
module Sample.MapControl {

    Vue.component('google-map', function (resolve, reject) {
        MapInitDefered.done(tpl => {
            resolve({
                template: '<div id={{id}}></div>',
                data: function () {
                    return {
                        map: <google.maps.Map>null,
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
                },
                attached: function () {
                    var getv = (x, y) => x == undefined ? y : x;
                    var lat
                    var map = new google.maps.Map(this.$el, {
                        center: new google.maps.LatLng(getv(this.lat, -27.468), getv(this.lng, 153.025)),
                        zoom: getv(this.zoom, 10),
                    });
                    this.map = map;
                }
            });
        });
    })
}

module Sample.KO1 {
    new Vue({
        el: '#sample',
    });
}
