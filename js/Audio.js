var Audio = Backbone.Model.extend({

    initialize: function () {
        this.set('context', new webkitAudioContext());

        this.set('masterVolume', this.get('context').createGainNode());
        this.get('masterVolume').connect(this.get('context').destination);
        this.loadAudio('audio/piano-a.ogg', 'pianoBuffer');
        this.loadAudio('audio/click1.wav', 'clickBuffer');

    },

    loadAudio: function (file, key) {
        var request = new XMLHttpRequest();
        var self = this;

        //onload
        request.addEventListener('load', function (e) {
            //decode
            self.get('context').decodeAudioData(request.response, function (decoded_data) {

                    //fill buffer with decoded data
                    self.set(key, decoded_data);

                    //handle decoding error
                }, function (e) {
                    console.log('error', e);
                }

            );
        }, false);

        //load audio file
        request.open('GET', file, true);
        request.responseType = "arraybuffer";
        request.send();
    },

    defaults: {
        context: null,
        pianoBuffer: null,
        clickBuffer: null,
        masterVolume: null,
        notes: [],
        noteNames: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
        baseFreguency: Note.fromLatin('A4').frequency()
    },

    playChord: function (chordNotes) {

        //not ready yet
        if (null === this.get('pianoBuffer')) {
            return false;
        }

        var self = this
            , notes = []
            , basePos = $.inArray(self.simpleLatin(chordNotes[0]), self.get('noteNames'));

        $.each(chordNotes, function (index) {
            var pos = $.inArray(self.simpleLatin(this), self.get('noteNames'))
                , octave = (index > 0 && pos <= basePos) ? 5 : 4
                , noteName = self.simpleLatin(this) + octave;

            notes.push(Note.fromLatin(noteName));
        });

        $.each(notes, function () {
            var playbackrate = this.frequency() / self.get('baseFreguency');

            var sourceNode = self.get('context').createBufferSource();
            sourceNode.buffer = self.get('pianoBuffer');
            sourceNode.connect(self.get('masterVolume'));
            sourceNode.playbackRate.value = playbackrate;
            sourceNode.noteOn(0);
        });

    },

    playClick: function () {

        //not ready yet
        if (null === this.get('clickBuffer')) {
            return false;
        }

        var sourceNode = this.get('context').createBufferSource();
        sourceNode.buffer = this.get('clickBuffer');
        sourceNode.connect(this.get('masterVolume'));
        sourceNode.noteOn(0);
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