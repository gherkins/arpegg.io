/**
 * view for the fretboard
 */
var FretboardView = Backbone.View.extend({

    /**
     * event bindings
     */
    events: {
        "change .focus": "setFocus"
    },


    /**
     * init
     * @constructs
     */
    initialize: function () {
        this.render();
        this.listenTo(this.model, "change:activeFrets", this.showDots);

    },

    /**
     * render template
     */
    render: function () {

        var self = this;
        var tpl = $("#fretboard-template").html();
        this.$el.html(Handlebars.compile(tpl));
        this.showDots();
        this.setFocus();

        //populate fret note-attributes
        this.$el.find('.fret').each(function () {
            $(this).attr('data-note', function () {
                var offset = self.model.get('stringOffsets')[$(this).data('string')];
                var index = (offset + $(this).data('fret')) % 12;
                return self.model.get('noteNames')[index];
            });
        });
    },

    /**
     * draw all dots for current activeFrets
     */
    showDots: function () {
        var self = this;
        this.$el.find('.fret span').fadeOut('fast');

        $.each(this.model.get('activeFrets'), function () {
            self.showDot(this, '');
        });
    },

    /**
     * draw single dot on fretboard
     * @param fret
     */
    showDot: function (fret) {

        var span = $('<span></span>')
            .text(fret.text)
            .addClass('highlight')
            .addClass(fret.cssclass);

        var fret = this.$el
            .find('.fret')
            .filter('[data-string="' + fret.string + '"]')
            .filter('[data-fret="' + fret.fret + '"]');

        fret.find('span').remove();
        fret.append(span);

    },


    /**
     * set focused area on fretboard and
     * on model
     *
     * @param e
     */
    setFocus: function (e) {

        var focus = {
//            string: this.$el.find('.focus[data-focus="string"]').val(),
            fret: parseInt(this.$el.find('.focus[data-focus="fret"]').val())
        }

        this.model.set('focus', focus);

        this.$el
            .find('.fret')
            .removeClass('focus')
//            .filter('[data-string="' + focus.string + '"]')
            .filter('[data-fret="' + focus.fret + '"]')
            .addClass('focus');

    },


    /**
     * activate set of notes on fretboard
     * FIXME: cleanup / outsource...
     *
     * @param notes
     * @returns {boolean}
     */
    setNotes: function (notes) {

        var combos = [];

        if (0 === notes.length) {
            return false;
        }

        var self = this;

        //draw paths for all requested notes
        $(notes).each(function (noteIndex, note) {

            note = self.model.simpleLatin(note);

            combos[noteIndex] = [];

            //paths get longer for each note
            self.$el
                .find('.fret')
                .filter('[data-note="' + note + '"]')
                .each(function (fretIndex, fret) {

                    fret = $(fret);
                    var path = {
                        note: note,
                        string: fret.data('string'),
                        fret: fret.data('fret'),
                        text: note,
                        cssclass: (0 === noteIndex) ? 'root' : ''
                    };

                    if (0 === noteIndex) {
                        combos[noteIndex].push([path]);
                    }
                    else {
                        $(combos[noteIndex - 1]).each(function (prevComboIndex, prevCombo) {
                            if (self.model.isPlayable(path, prevCombo)) {
                                var combo = $.extend([], prevCombo);
                                combo.push(path);
                                combos[noteIndex].push(combo);
                            }
                        });
                    }

                });

        });

        //last set has paths with all notes in it
        combos = combos[notes.length - 1];

        combos.sort(function (a, b) {

            a = Math.abs(self.model.get('focus').fret - self.model.getPathAvgFret(a));
            b = Math.abs(self.model.get('focus').fret - self.model.getPathAvgFret(b));

            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            return 0;
        });

        self.model.set('activeFrets', combos.pop());

        return true;
    }

});