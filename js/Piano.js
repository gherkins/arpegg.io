var Piano = Backbone.Model.extend({

    initialize: function () {

    },

    defaults: {
        notes: [],
        noteNames: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
        baseFreguency: Note.fromLatin('A4').frequency()
    },

    play: function () {

        var self = this
            , notes = []
            , basePos = $.inArray(self.simpleLatin(this.get('notes')[0]), self.get('noteNames'))

        $.each(this.get('notes'), function (index) {
            var pos = $.inArray(self.simpleLatin(this), self.get('noteNames'))
                , octave = (index > 0 && pos <= basePos) ? 5 : 4
                , noteName = self.simpleLatin(this) + octave;
            notes.push(Note.fromLatin(noteName));
        });

        $.each(notes, function () {
            var diff = 100 * (self.get('baseFreguency') - this.frequency()) / this.frequency();
            console.log(diff);
        });

    },


    /**
     * convert latin note name to simplified notename
     *
     * @param string latin
     */
    simpleLatin: function (latin) {

        var name = latin.substr(0, 1)
            , acc = latin.substr(1)
            , index = $.inArray(name, this.get('noteNames'));

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