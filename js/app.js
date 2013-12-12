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

    $('button.add-chord').on('click', function () {
        chords.add(new Chord());
    });

//    fretboard.set('activeFrets', {
//        4: 4,
//        5: 10
//    });
//
//    fretboard.set('activeRoots', {
//        4: 4,
//        5: 8
//    });


});
