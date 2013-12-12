$(function () {

    var fretboard = new Fretboard();

    new FretboardView({
        model: fretboard,
        el: $('.fretboard')
    });

    var ferret = new Ferret();

    var chords = new Backbone.Collection([], {
        model: Chord
    });

    chords.on('add', function (chord) {
        new ChordView({
            model: chord,
            container: $('.chords'),
            id: chords.length
        });
    });

    chords.on('change', function (model) {
        var notes = [];
        $.each(chords.models, function () {
            if (0 === this.get('notes').length) {
                return true;
            }
            notes.push(this.get('notes'));
        });

        console.log(notes);

    });

    $('button.add-chord').on('click', function () {
        chords.add(new Chord());
    });

//    fretboard.set('activeFrets', [
//        {
//            string: 6,
//            fret: 5,
//            text: 'b3'
//        },
//        {
//            string: 6,
//            fret: 8,
//            text: '5'
//        },
//        {
//            string: 6,
//            fret: 10,
//            text: 'b7'
//        }
//    ]);


});
