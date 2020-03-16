;( function( scope ) {

    
    var canvas = document.getElementById( 'debug-canvas' );
    var ctx = canvas.getContext( '2d' );
    
    scope.Debug = Singleton( 
        Behavior,
        {
            canvas: canvas,
            ctx: ctx,
            enabled: false,
            toggle: toggle,
            start: start,
            stop: stop,
            clear: clear,
            update: update    
        }
    );

    var syncDir = 0;
    var initted = false;

    function toggle() {
        if ( container.classList.contains( 'debug' ) ) {
            Debug.stop();
        } else {
            Debug.start();
        }
        Loop.force();
    } 

    function start() {

        if ( !initted ) {
            init();
        }

        document.getElementById( 'quarter-note' ).innerHTML = ( 60 / Project.bpm ).toFixed( 3 );

        container.classList.add( 'debug' );
        Loop.on( 'beforeupdate', Debug.clear );
            
    }

    function stop() {
        container.classList.remove( 'debug' );
        Loop.off( 'beforeupdate', Debug.clear );
        Debug.clear();
    } 

    function clear() {
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
    } 

    function update() {

        offsetSync( 0.001 * syncDir );

        var beats = 8;

        var h = Math.floor( DEBUG_BEAT_COLUMN / 2 );

        for ( var i = 0; i < beats; i++ ) {

            var div = Math.pow( 2, i );

            var color = DEBUG_COLORS[ i % DEBUG_COLORS.length ];

            var on = Math.ceil( Player.now / Time.div( div ) ) % 2 == 0;
            ctx.globalAlpha = 1;

            var x = Math.ceil( Stage.width / 2 ) + 3;
            var w = Math.ceil( DEBUG_BEAT_COLUMN / 2 ) ;
            var y = Math.ceil( i * ( h + 1 ) );

            ctx.fillStyle = !on ? '#000' : color;
            ctx.fillRect( x - 1, y, w, h );

        }

        on = Math.ceil( Player.now / Time.bars( 1 ) ) % 2 == 0;
        h *= beats;
        h += beats - 1;
        w = Math.ceil( DEBUG_BEAT_COLUMN / 2 );
        y = 0;
        x = Math.ceil( Stage.width / 2 + DEBUG_BEAT_COLUMN / 2 ) + 3;

        ctx.fillStyle = !on ? '#000' : '#fff';
        ctx.fillRect( x, y, w, h );

        var numStems = _.keys( Volumes ).length;

        w = Math.ceil( Stage.width / ( Math.round( numStems / 2 ) * 2 ) );
        i = 0;

        for ( var stem in Volumes ) {

            y = i > numStems / 2 ? Stage.height / 2 : Stage.height;
            ii = i;
            if ( i > numStems / 2 ) {
                ii -= Math.ceil( numStems / 2 ); 
            }

            var amp = Volumes[ stem ];

            var smooth = amp.at( Player.now, amp.smoothing );
            var vol = amp.at( Player.now );


            var h = Math.ceil( vol * Stage.height / 2 );
            var h2 = Math.ceil( smooth * Stage.height / 2 )

            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#666';
            ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3) + 1, Math.ceil( y - h ), w - 1, h );


            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#666';
            ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3) + 1, Math.ceil( y - h2 ), w - 1, h2 - h );

            ctx.globalAlpha = 0.6;
            ctx.save();
            ctx.fillStyle = '#666'
            ctx.textAlign = 'right';
            ctx.translate( Math.ceil( Stage.width / 2 + w * ii + 1 + w / 2 - w * 3 ) + 0.5, y - 20.5 );
            ctx.rotate( Math.PI / 4 );
            ctx.fillText( stem, 0, 0 );
            ctx.restore();


            if ( vol > amp.gate && vol * amp.thresh > smooth ) {


                ctx.globalAlpha = 1;
                ctx.fillStyle = DEBUG_COLORS[ i % DEBUG_COLORS.length ];
                ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii ) + 1, y - Stage.height / 2, w - 1, Math.ceil( Stage.height / 2 ) );

            }


            i++;

        }
        
    } 
    
    function debugPeaks() {
        
        setTimeout( function() {
            
            var i = 0;

            _.each( Volumes, function( v ) {
                
                ( function( i ) {
                
                    v.peaks.forEach( function( p ) {
                    
                        peakEvent( p, i );
                        
                    } );
                    
                } )( i++ );
                
                
            } );
            
        }, 500 )

        
        function peakEvent( e, i ) {

            var opacity = { value: 1 }, width, w, y, ii;
            
            var numStems = _.keys( Volumes ).length;
            var n = numStems / 2;

            Player.timeline.fromTo( opacity, 0.02, { value: 1 }, {

                value: 1,

                onUpdate: function() {

                    if ( !Debug.active ) return;

                    w = Math.ceil( Stage.width / ( Math.round( n ) * 2 ) );

                    y = i > n ? 0 : Stage.height / 2;
                    ii = i;
                    if ( i > n ) {
                        ii -= Math.ceil( n ); 
                    }

                    ctx.globalAlpha = 1;
                    ctx.fillStyle = DEBUG_COLORS[ i % DEBUG_COLORS.length ];
                    ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3 ) + 1, y, w - 1, Stage.height / 2 );


                },

                ease: Expo.easeOut

            }, e );

        }
        
    } 


    function init() {

        initted = true;

        numStems = _.keys( Volumes ).length;
        
        debugCsv();
        debugSync();
        debugPeaks();
        
        Midi.query( { type: 'noteOn' } ).forEach( debugMidi );
        
        
    };

    function debugCsv() {
        
        var csvDisplay = document.getElementById( 'debug-csv' );

        var lastRow;

        Csv.forEach( function( row, c ) {

            var lines = [];

            for ( var col in row ) {
                lines.push( '<dt id="csv-' + col + '">' + col + '</dt><dd>' + row[ col ] + '</dd>' );
            }

            var str = lines.join( '\n' );


            Player.timeline.call( function() {
            
                if ( !Debug.active ) return;

                csvDisplay.innerHTML = str
                
                for ( var col in row ) {
                    if ( lastRow && lastRow[ col ] !== row[ col ] ) {

                        ( function( el ) {
                            
                            el.style.opacity = 1;
                            _.defer( function() {
                                el.style.opacity = '';
                            } );                            
                        
                        } )( document.getElementById( 'csv-' + col ) );

                    }
                }

                lastRow = row;

                
            }, [], this, row.time );

        } );

    } 

    function debugMidi( e ) {

        var noteRange = 50;

        var opacity = { value: 1 }, width, w, t, c, h, y;

        var start = 1;//Math.max( 0.5, e.velocity / 100 );
        Player.timeline.fromTo( opacity, 0.02, { value: start }, {

            value: 1,

            onUpdate: function() {

                if ( !Debug.active ) return;

                width = Stage.width / 2;

                w = Math.floor( Math.min( width / ( Midi.tracks.length - 1 ) ), width / 2 );
                t = ( e.track || 1 ) - 1;

                c = Math.round( t / ( Midi.tracks.length - 1 ) * 360 ); 
                h = 1;

                y = Math.floor( map( e.note, 60 + noteRange, 60 - noteRange, 0, Stage.height ) );

                ctx.globalCompositeOperation = 'source-over';

                ctx.globalAlpha = opacity.value;
                ctx.fillStyle = DEBUG_COLORS[ t % DEBUG_COLORS.length ];
                ctx.fillRect( w * t, 0, w - 1, Stage.height );

                ctx.globalAlpha = Math.pow( opacity.value, 3 );
                ctx.fillStyle = '#fff';
                // ctx.fillRect( w * t, 0, w - 1, Stage.height );

                ctx.globalAlpha = 1;
                ctx.fillStyle = 'rgba( 255, 255, 255, ' + opacity.value + ' )';
                ctx.fillRect( w * t, y, w - 1, h );

            },

            ease: Expo.easeOut

        }, e.time );

    }

    function debugSync() {
    
        var syncUp = document.getElementById( 'sync-up' );
        var syncDown = document.getElementById( 'sync-down' );
        var debugSync = document.getElementById( 'debug-sync' );

        new Hammer( debugSync ).on( 'tap', function( e ) {
        
            if ( e.tapCount == 2 ) {
                offsetSync( -Device.sync );
            }
            
        } )

        function _offsetSync( dir ) {
            return function( e ) {
                Player.play();
                debugSync.classList.remove( 'hidden' );
                syncDir = dir;
            } 
        } 

        function syncEnd( e ) {
            e.stopPropagation();
            debugSync.classList.add( 'hidden' );
            syncDir = 0;
        } 


        if ( TOUCH ) syncUp.addEventListener( 'touchstart', _offsetSync( 1 ), false );
        else syncUp.addEventListener( 'mousedown', _offsetSync( 1 ), false );

        if ( TOUCH ) syncUp.addEventListener( 'touchend', syncEnd, false );
        else syncUp.addEventListener( 'mouseup', syncEnd, false );
        
        if ( TOUCH ) syncDown.addEventListener( 'touchstart', _offsetSync( -1 ), false );
        else syncDown.addEventListener( 'mousedown', _offsetSync( -1 ), false );

        if ( TOUCH ) syncDown.addEventListener( 'touchend', syncEnd, false );
        else syncDown.addEventListener( 'mouseup', syncEnd, false );
        
    } 

    function offsetSync( delta ) {
    
        Device.sync += delta;
        document.getElementById( 'sync-display' ).innerHTML = Device.sync.toFixed( 3 );    
        
    } 


} )( this );