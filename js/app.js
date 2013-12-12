$(function () {


    var fretboard = new FretboardView({
        model: new Fretboard(),
        el: $('.fretboard')
    });

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

    chords.on('change', function (chord) {
        //find focused pattern for current chord
        fretboard.setNotes(chord.get('notes'));
        //lights
        fretboard.showDots();
    });

    $('button.add-chord').on('click', function () {
        chords.add(new Chord());
    });

});
