namespace Sample.Youtue {

    var clips = [
        { name: '10 Video Games That Left Us Emotionally Devastated', tag: 'gYi9Xfguf_g' },
        { name: 'Tested: Microsoft Surface Book Review', tag: 'UBF3EreWIm8' },
        { name: 'Star Wars: The Force Awakens Official Trailer', tag: 'ecH49e_Pw20' },
    ];

    new Vue({
        el: '#sample',
        data: {
            selection: null,
            clips: clips,
        },
    });

}