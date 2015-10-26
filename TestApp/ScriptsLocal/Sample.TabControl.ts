module Sample.KO1 {

    new Vue({
        el: '#sample',
        computed: {
            fullName: function () {
                return this.firstName + ' ' + this.lastName;
            }
        }
    });
}
