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

        combos = ferret.getCombinations();

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
