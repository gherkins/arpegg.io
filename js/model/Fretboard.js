var Fretboard = Backbone.Model.extend({

    defaults: {
        activeFrets: {},
        activeRoots: {},
        focus: {},
        stringOffsets: [0, 4, 11, 7, 2, 9, 4],
        noteNames: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"]
    },


    isPlayable: function (poss, combo) {

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

    },

    /**
     * convert latin note name to simplified notename
     *
     * @param string latin
     */
    simpleLatin: function (latin) {

        var name = latin.substr(0, 1);
        var acc = latin.substr(1);

        var index = $.inArray(name, this.get('noteNames'));

        switch (acc) {
            case '#':
                index += 1;
                break;
            case 'x':
                index += 2;
                break;
            case 'b':
                index -= 1;
                break;
            case 'bb':
                index -= 2;
                break;
            default:
                break;
        }

        return this.get('noteNames')[index];

    }

});