;( function( scope ) {

    scope.Time = Singleton( {
        
        seconds: _.identity,
        sec: _.identity,

        minutes: function( minutes ) {
            return minutes * 60;
        },

        millis: function( millis ) {
            return millis / 1000;
        },

        frames: function( frames ) {
            return frames / 60;
        },

        beats: function( beats ) {
            return beats * this.minutes( 1 ) / Project.bpm;
        },

        bars: function( bars ) {
            return bars * this.beats( Project.bar );
        },

        div: function( div ) {
            return div * this.beats( 1 / Project.bar );
        },

        ticks: function( ticks ) {
            return ticks * this.div( 1 / 240 );
        },

        bbd: function( bars, beats, div, ticks ) {
            return this.bars( bars ) + this.beats( beats || 0 ) + this.div( div || 0 ) + this.ticks( ticks || 0 )
        }

    } );

    var to = {};
    
    _.keys( Time ).forEach( function( conversion ) { 
        
        to[ conversion ] = function( v ) {
            return 1 / Time[ conversion ]( 1 / v );  
        };

        Object.defineProperty( Number.prototype, conversion, {
            get: function() {
                return Time[ conversion ]( this );
            }
        } );

    }, this );

    Time.to = to;

} )( this );