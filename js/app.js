var chords
    , clock
    , audio
    , loadsave
    , fretboard
    , domid = 0;

$(function () {

    FastClick.attach(document.body);

    /**
     * init Audio
     * @type {Audio}
     */
    audio = new Audio()

    /**
     * @type {Clock}
     */
    clock = new Clock();

    /**
     * init URL storage
     * @type {LoadSave}
     */
    loadsave = new LoadSave();

    /**
     * init fretboard view
     *
     * @type {FretboardView}
     */
    fretboard = new FretboardView({
        model: new Fretboard(),
        el: $('.fretboard')
    });

    /**
     * init chords collection
     *
     * @type {Collection}
     */
    chords = new Backbone.Collection([], {
        model: Chord
    });

    /**
     * draw chord on chord add
     */
    chords.on('add', function (chord) {
        new ChordView({
            model: chord,
            container: $('.chords'),
            domid: domid++
        });
    });

    /**
     * draw frets on chord select
     */
    chords.on('change select', function (chord) {
        //find focused pattern for current chord
        fretboard.setNotes(chord.get('notes'));
        //lights
        fretboard.showDots();
    });

    //save on chords change add remove
    chords.on('add change remove', function (chord) {
        loadsave.save();
    });

    /**
     * playback chord
     */
    chords.on('play', function (chord) {
        audio.playChord(chord.get('notes'));
    });

    /**
     * add chord
     */
    $('button.add-chord')
        .on('click', function () {
            chords.add(new Chord());
        });

    //try to load chord from URL
    if (false === loadsave.load(window.location.hash.substr(1))) {
        $('button.add-chord').trigger('click');
    }


    /**
     * focus change
     */
    fretboard.model.on('change:focus', function () {
        $('.chords .chord.active')
            .removeClass('active')
            .click();

        loadsave.save();
    });


    /**
     * transport start/stop
     */
    $('.actions button.play').on('click', function () {
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
        audio.playClick();
        var firstChord = $('.chords .chord:first-child');
        firstChord.find('button.select, button.play').trigger('click');
        firstChord.find('.ticks li:first-child').addClass('active');
    });

    /**
     * sequencer tick
     */
    clock.on('tick', function () {
        audio.playClick();
        var current = $('.chords .chord .ticks li.active');
        var next = current.next();

        if (0 === next.length) {
            var currentChord = current.closest('.chord');
            var nextChord = (currentChord.next().length > 0) ? currentChord.next() : $('.chords .chord:first-child');
            nextChord.find('button.select, button.play').trigger('click');
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


    /**
     * tempo slider
     */
    $('input.tempo')
        .on('change', function () {
            $('span.bpm').text($(this).val());
            clock.setTempo($(this).val());
            loadsave.save();
        })
        .trigger('change');

});
