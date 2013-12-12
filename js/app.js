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

    fretboard.set('activeFrets', {
        4: 4,
        5: 10
    });

    fretboard.set('activeRoots', {
        4: 4,
        5: 8
    });

    setTimeout(function () {
        fretboard.set('activeRoots', {
            4: 6,
            5: 9
        });
    }, 1000);


});
