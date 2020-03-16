function Volume( args, sampleRate ) {

    if ( _.isArray( args ) ) {
        args = { frames: window.UInt8Array ? new UInt8Array( args ) : args };
    }

    this.frames = args.frames;
    this.sampleRate = sampleRate || 60;
    this.max = _.max( frames );
    this.peaks = [];

    this.smoothing = args.smoothing || 0;
    this.gate = args.gate || 0.02;
    this.thresh = args.thresh || 0.8;
    this.decay = args.decay || 4;


    this.frames.forEach( function( v, f ) {

        this.frames[ f ] = v / 0x4000;

    }, this );
    

    var decay = 0;
    var prevPeak = 0;

    this.frames.forEach( function( v, f ) {
        
        var smooth = this._at( f, this.smoothing )

        if ( v > this.gate && v * this.thresh > smooth ) {
            if ( v > prevPeak && decay > 0 ) {
                this.peaks.pop();
            }
            this.peaks.push( Time.frames( f ) );
            decay = this.decay;
        }
        

        if ( decay > 0 ) {
            decay--;
            return;
        }

        
        
    }, this )

}

Volume.forPeaks = function( tracks, start, end, iterator, context ) {
    
    tracks = tracks || _.keys( Volumes );

    var trackEvents = {};
    var total = 0;
    
    tracks.forEach( function( track ) { 

        var peaks = Volumes[ track ].peaksBetween( start, end );
        trackEvents[ track ] = peaks;
        total += peaks.length;

    }, this );

    if ( iterator ) {

        var globalNoteIndex = 0;
        var trackIndex = 0;

        _.each( trackEvents, function( peaks, track ) {
            
            var trackNoteIndex = 0;

            console.log( track, peaks.length );

            peaks.forEach( function( time ) {
                iterator.call( context, time - start, 

                // this guy is all bad.
                {
                    track: track,
                    trackIndex: trackIndex,
                    absoluteTime: time,
                    relativeTime: time - start,
                    noteIndex: globalNoteIndex++,
                    total: total,
                    trackNoteIndex: trackNoteIndex++,
                    trackTotal: peaks.length
                } 


                );
            } );    
            
            trackIndex++;

        } )        
        
    }

    return trackEvents;

};

Volume.prototype.peaksBetween = function( start, end ) {
    if ( end === undefined ) {
        end = Infinity;
    }
    if ( start === undefined ) {
        start = 0;
    }
    var peaks = [];
    this.peaks.forEach( function( time ) { 
        if ( time >= start && time <= end ) {
            peaks.push( time );
        }
    }.bind( this ) );
    return peaks;
}


Volume.prototype.at = function( millis, smoothing ) {

    if ( millis == undefined ) {
        millis = Player.now;
    }
    var frame = this.samples( millis );
    return this._at( frame, smoothing ); 
    
};

Volume.prototype.millis = function( samples ) {
    return samples / this.sampleRate * 1000;
};

Volume.prototype.samples = function( time ) {

    return ~~( time * this.sampleRate );
    
};

Volume.prototype._at = function( frame, smoothing ) {

    smoothing = smoothing || 1;

    var vols = this.frames.slice( Math.max( 0, frame - smoothing ), frame );

    var avg = _.reduce( vols, function( memo, num ) {
        return memo + num;
    }, 0 );

    return avg / vols.length;

};

