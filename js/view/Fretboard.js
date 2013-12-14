/**
 * view for the fretboard
 */
var FretboardView = Backbone.View.extend({

    /**
     * event bindings
     */
    events: {
        "click .fret": "setFocus"
    },

    focusTimeout: null,

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

        //populate fret note-attributes
        this.$el.find('.fret').each(function () {
            $(this).attr('data-note', function () {
                var offset = self.model.get('stringOffsets')[$(this).data('string')];
                var index = (offset + $(this).data('fret')) % 12;
                return self.model.get('noteNames')[index];
            });
        });
        this.showFocusRange();
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

        var fret = $(e.currentTarget)
            , focus = {
                string: parseInt(fret.data('string')),
                fret: parseInt(fret.data('fret'))
            }

        this.model.set('focus', focus);
        this.showFocusRange();
        this.showDots();

    },

    showFocusRange: function () {

        this.$el.find('.fret').removeClass('focus');

        var string = this.model.get('focus').string;

        for (var i = (string - 1); i < (string + 2); i++) {
            var focusFret = this.$el
                .find('.fret')
                .filter('[data-string="' + i + '"]')
                .filter('[data-fret="' + this.model.get('focus').fret + '"]')
//            focusFret
//                .add(focusFret.next())
//                .add(focusFret.next().next())
//                .add(focusFret.prev())
//                .add(focusFret.prev().prev())
                .addClass('focus');
        }

    },


    /**
     * activate set of notes on fretboard
     * FIXME: cleanup / outsource...
     *
     * @param notes
     * @returns {boolean}
     */
    setNotes: function (notes) {

        var self = this
            , paths = [];

        if (0 === notes.length || undefined === self.model.get('focus').fret) {
            return false;
        }


        //draw paths for all requested notes
        $(notes).each(function (noteIndex, note) {

            note = self.model.simpleLatin(note);

            paths[noteIndex] = [];

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

                    var focusFretDist = Math.abs(self.model.get('focus').fret - path.fret);
                    if (focusFretDist > 3) {
                        return true;
                    }

                    var focusStringDist = Math.abs(self.model.get('focus').string - path.string);
                    if (focusStringDist > 3) {
                        return true;
                    }

                    if (0 === noteIndex) {
                        paths[noteIndex].push([path]);
                    }
                    else {
                        $(paths[noteIndex - 1]).each(function (prevComboIndex, prevCombo) {
                            if (self.model.isPlayable(path, prevCombo)) {
                                var combo = $.extend([], prevCombo);
                                combo.push(path);
                                paths[noteIndex].push(combo);
                            }
                        });
                    }

                });

        });

        //last set has paths with all notes in it
        paths = paths[notes.length - 1];

        paths.sort(function (a, b) {
            return self.model.sortPaths(a, b);
        });

        self.model.set('activeFrets', paths.pop());

        return true;
    }

});