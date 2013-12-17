var LoadSave = Backbone.Model.extend({

    defaults: {
        timeout: null
    },

    load: function (hash) {

        var data = null;

        try {
            data = JSON.parse(decodeURIComponent(hash));

            //set tempo
            $('.tempo').val(data.tempo).trigger('change');

            //set focus
            fretboard.model.set('focus', data.focus);

            $.each(data.chords, function () {
                $('.add-chord').trigger('click');
                var chord = $('.chord.active');
                chord.find('select').val(this.key);
                $.each(this.intervals, function (key, val) {
                    chord.find('input[data-interval="' + val + '"]')
                        .prop('checked', true)
                        .trigger('change');
                });
                chord.trigger('click');
            });

            fretboard.showFocusRange();
            fretboard.showDots();

            //clear hash
            window.location.hash = '';

            return true;

        }
        catch (e) {
        }

        return false;

    },

    save: function () {
        var data = {
            chords: [],
            tempo: clock.get('tempo'),
            focus: fretboard.model.get('focus')
        };


        $('.chords .chord').each(function () {

            var chord = {
                key: $(this).find('select').val(),
                intervals: []
            }

            $(this).find('input:checked').each(function () {
                chord.intervals.push($(this).data('interval'));
            });

            data.chords.push(chord);

        });


        data = JSON.stringify(data);

        var a = document.createElement('a');
        a.href = location.href;
        a.hash = data;

        return a.href;
    }

});
