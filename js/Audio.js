var Audio = Backbone.Model.extend({

    initialize: function () {
        var request = new XMLHttpRequest();
        var self = this;

        this.set('context', new webkitAudioContext());

        this.set('masterVolume', this.get('context').createGainNode());
        this.get('masterVolume').connect(this.get('context').destination);

        //onload
        request.addEventListener('load', function (e) {
            //decode
            self.get('context').decodeAudioData(request.response, function (decoded_data) {

                    //fill buffer with decoded data
                    self.set('audioBuffer', decoded_data);

                    //handle decoding error
                }, function (e) {
                    console.log('error', e);
                }

            );
        }, false);

        //load audio file
        request.open('GET', 'audio/piano-a.ogg', true);
        request.responseType = "arraybuffer";
        request.send();
    },

    defaults: {
        context: null,
        audioBuffer: null,
        masterVolume: null,
        notes: [],
        noteNames: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
        baseFreguency: Note.fromLatin('A4').frequency()
    },

    play: function () {

        //not ready yet
        if (null === this.get('audioBuffer')) {
            return false;
        }

        var self = this
            , notes = []
            , basePos = $.inArray(self.simpleLatin(this.get('notes')[0]), self.get('noteNames'));

        $.each(this.get('notes'), function (index) {
            var pos = $.inArray(self.simpleLatin(this), self.get('noteNames'))
                , octave = (index > 0 && pos <= basePos) ? 5 : 4
                , noteName = self.simpleLatin(this) + octave;

            notes.push(Note.fromLatin(noteName));
        });

        $.each(notes, function () {
            var playbackrate = this.frequency() / self.get('baseFreguency');

            var sourceNode = self.get('context').createBufferSource();
            sourceNode.buffer = self.get('audioBuffer');
            sourceNode.connect(self.get('masterVolume'));
            sourceNode.playbackRate.value = playbackrate;
            sourceNode.noteOn(0);
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