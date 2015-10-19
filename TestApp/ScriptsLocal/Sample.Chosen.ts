module Sample.Chosen {

    interface IBook {
        ID: string;
        name: string;
        author?: string;
        value?: number;
        rating?: number;
    }
    var data: IBook[] = [
        { ID: 'B00CGOSBTU', name: 'Dark Space', author: 'Jasper T. Scott', rating: 4.0 },
        { ID: 'B007Y6LHAA', name: 'The Backworlds: Living on the Edge', author: 'M. Pax', rating: 3.5 },
        { ID: 'B00YR3S2SI', name: '2287 A.D. - After Destruction', author: 'R. Brown', rating: 3.6 },
        { ID: 'B00S8FCJCQ', name: 'The Three-Body Problem', author: 'Cixin Liu', rating: 4.5 },
        { ID: 'B004GJXQ20', name: 'A Game of Thrones', author: 'George R. R. Martin', rating: 4.5 },
        { ID: 'B004H4XAXO', name: 'The Way of Kings: The Stormlight Archive', author: ' Brandon Sanderson', rating: 4.7 },
        { ID: 'B00L3S2LWS', name: 'The Abyss Beyond Dreams', author: 'Peter F. Hamilton', rating: 4.3 },
        { ID: 'B0047T70VW', name: 'The Windup Girl', author: ' Paolo Bacigalupi', rating: 3.9 },
        { ID: 'B00I5NVFS0', name: 'Frostborn: The Undying Wizard', author: 'Jonathan Moeller', rating: 4.3 },
        { ID: 'B00C2RSA9C', name: 'The Human Division', author: 'John Scalzi', rating: 4.1 },
        { ID: 'B00I2WNYJW', name: 'Capital in the Twenty-First Century', author: 'Thomas Piketty', rating: 4.0 },
    ];
    var model = {
        books: data,
        selected: <IBook[]>[],
        single: <IBook>data[1],
    };

    new Vue({
        el: '#sample',
        data: model,
    });
    model.single = data[0];
}
