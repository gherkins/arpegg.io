Ferret = function () {

    this.combos = [];

    this.getCombinations = function (notes) {

        if (0 === notes.length) {
            return [];
        }

        this.combos = [];

        var self = this;


        $(notes).each(function (noteIndex, note) {

            self.combos[noteIndex] = [];

            //possibilities for each note
            $('.fret[data-note="' + note + '"]').each(function (fretIndex, fret) {

                fret = $(fret);
                var poss = {
                    note: note,
                    string: fret.data('string'),
                    fret: fret.data('fret')
                };

                if (0 === noteIndex) {
                    self.combos[noteIndex].push([poss]);
                }
                else {
                    $(self.combos[noteIndex - 1]).each(function (prevComboIndex, prevCombo) {
                        if (self.isPlayable(poss, prevCombo)) {
                            var combo = $.extend([], prevCombo);
                            combo.push(poss);
                            self.combos[noteIndex].push(combo);
                        }
                    });
                }

            });

        });

        this.combos = this.combos[notes.length - 1];

        this.combos.sort(function (a, b) {
            if (a[0].fret > b[0].fret) {
                return 1;
            }
            if (a[0].fret < b[0].fret) {
                return -1;
            }
            return 0;
        });

        return this.combos;
    };

    this.isPlayable = function (poss, combo) {

        var root = combo[0];
        var last = combo[combo.length - 1];

        //direction is upwards
        if (poss.string > last.string) {
            return false;
        }

        //restrict movement, if not on last string
        if (1 !== poss.string) {

            //more than 3 frets away from last poss
            if (poss.fret - last.fret < -4 || poss.fret - last.fret > 4) {
                return false;
            }

            //more than 3 frets away from root
            if (poss.fret - root.fret < -3 || poss.fret - root.fret > 3) {
                return false;
            }
            
        }

        //skips more than 2 strings
        if (last.string - poss.string > 2) {
            return false;
        }

        //check with each existing dot
        for (var i = 0; i < combo.length; i++) {
            var current = combo[i];

            //already used dot
            if (current.fret === poss.fret && current.string === poss.string) {
                return false;
            }

            //dot spreads to far from existing
            if (current.fret - poss.fret < -4 || current.fret - poss.fret > 4) {
                return false;
            }
        }

        return true;

    }
};