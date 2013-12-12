$(function () {


    /**
     * init clock
     *
     * @type {Clock}
     */
    var clock = new Clock();

    /**
     * init fretboard view
     *
     * @type {FretboardView}
     */
    var fretboard = new FretboardView({
        model: new Fretboard(),
        el: $('.fretboard')
    });

    /**
     * init chords collection
     *
     * @type {Collection}
     */
    var chords = new Backbone.Collection([], {
        model: Chord
    });

    /**
     * draw chord on chord add
     */
    chords.on('add', function (chord) {
        new ChordView({
            model: chord,
            container: $('.chords'),
            id: chords.length
        });
    });

    /**
     * draw frets on chord select
     */
    chords.on('select', function (chord) {
        //find focused pattern for current chord
        fretboard.setNotes(chord.get('notes'));
        //lights
        fretboard.showDots();
    });

    /**
     * add chord
     */
    $('button.add-chord')
        .on('click', function () {
            chords.add(new Chord());
        })
        .trigger('click');

    /**
     * focus change
     */
    fretboard.model.on('change:focus', function () {
        $('.chords .chord.active .select').click();
    });


    /**
     * transport start/stop
     */
    $('button.play').on('click', function () {
        if ($(this).hasClass('playing')) {
            clock.stop();
        }
        else {
            clock.start();
        }
        $(this).toggleClass('playing');
    });

    /**
     * start sequencer
     */
    clock.on('start', function () {
        var firstChord = $('.chords .chord:first-child');
        firstChord.find('button.select').trigger('click');
        firstChord.find('.ticks li:first-child').addClass('active');
    });

    /**
     * sequencer tick
     */
    clock.on('tick', function () {
        var current = $('.chords .chord .ticks li.active');
        var next = current.next();

        if (0 === next.length) {
            var currentChord = current.closest('.chord');
            var nextChord = (currentChord.next().length > 0) ? currentChord.next() : $('.chords .chord:first-child');
            nextChord.find('button.select').trigger('click');
            var next = nextChord.find('.ticks li:first-child');
        }

        next.addClass('active');
        current.removeClass('active');
    });

    /**
     * sequencer stop
     */
    clock.on('stop', function () {
        $('.chords .chord .ticks li').removeClass('active');
    });

});
