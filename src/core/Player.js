;( function( scope ) {


    var sound;
    var smoother = new PlayheadSmoother();

    var recordPlayhead = 0;
    var recordDone = false;
    var recordIntroPauseTime = 10;
    var smoothed;
    var focusTimeout;
    

    Bootstrap.on( 'load', load );
    Bootstrap.on( 'done', done );

    scope.Player = Singleton( 
        
        Events,

        {

            playing: false,
            now: 0,
            prevNow: 0,
            delta: 0,

            playPause: playPause,
            play: play,
            pause: pause,

            setPosition: setPosition,

            // toggleFreeze: toggleFreeze,
            // freeze: freeze,
            // unfreeze: unfreeze

        }

    );

    function load() {

        sound = Assets( Bootstrap.paths.mp3 );
        
        window.sound = sound;

        if ( MUTE ) {
            sound.setAttribute( 'muted', 'muted' );
        }

        if ( !USE_SOUNDCLOUD && !RECORD_MODE ) {
            sound.addEventListener( 'ended', onEnded );
            sound.addEventListener( 'pause', onPause );
        }

        Player.timeline = new Timeline( { paused: true } );
        Player.timeline.time( 0, false );

        Loop.on( 'update', update );

        if ( AUTO_PLAY ) {
            Player.play();
        }

        if ( AUTO_TIME ) {
            Player.setPosition( Time[ AUTO_TIME_UNIT ]( AUTO_TIME ) );
        }


    } 

    function done() {
        Player.timeline.time( Player.timeline.time() + 0.0001, false );
        Loop.force();
    } 


    function play() {

        if ( Player.playing || Stage.frozen ) return;

        Player.playing = true;

        if ( url.r ) {
            Player.setPosition( Time[ AUTO_TIME_UNIT ]( AUTO_TIME ) );
        }

        if ( USE_SOUNDCLOUD ) {
            sound.play( {
                volume: MUTE ? 0 : 100,
                onfinish: onEnded
            })
        } else { 
            sound.play();
        }

        trackEvent( 'play' );

        onPlay();
        
    }

    function pause() {
        Player.playing = false;
        sound.pause();
        onPause();
    }

    function onEnded() {
        clearTimeout( focusTimeout );
        Loop.stop();
        Stage.showControls();
        Stage.freeze();
        Scene.camera.thetaRange = TWO_PI / 10;
        Scene.camera.phiRange = PI / 4;
        container.classList.add( 'end' );
        trackEvent( 'finish' );
        
        if ( RECORD_MODE ) {
            Three.stop();
            rendercan.grab();
        }

    }

    function playPause() {
        Player.playing ? Player.pause() : Player.play();
    }


    function setPosition( time ) {
        if ( USE_SOUNDCLOUD ) sound.setPosition( Time.to.millis( time ) );
        else sound.currentTime = time;
        Loop.force();
    }



    function update() {



        if ( RECORD_MODE ) { 
            smoothed = Math.max(0, Three.recordTime - recordIntroPauseTime );


            if ( Three.recordTime > 147 + recordIntroPauseTime && !recordDone ) {
                Loop.stop();
                recordDone = true;
                setTimeout( function() {
                    Three.stop();
                }, 1000 )

                setTimeout( function( ) { 
                    rendercan.grab();
                }, 3000 );
                
                setTimeout( function( ) { 
                    window.location.reload();
                }, 5000 );

            }
        } else { 


            clearTimeout( focusTimeout );
            if ( Player.playing ) {
                focusTimeout = setTimeout( pause, 1000 );
            }

            if ( USE_SOUNDCLOUD ) {
                smoothed = smoother.update( Time.millis( sound.position || 0 ) );
            } else { 
                smoothed = sound.currentTime;//smoother.update( sound.currentTime );
            }

        }

        if ( RECORD_MODE && recordDone ) {
            return;
        }


        Player.prevNow = Player.now;
        Player.now = clamp( smoothed + Device.sync, 0, Project.duration );
        Player.delta = Player.now - Player.prevNow;
        
        Player.timeline.time( Player.now, false );

    }


    function onPlay() {
        clearTimeout( focusTimeout );
        Player.trigger( 'play' );
        Loop.start();
    }

    function onPause() {
        clearTimeout( focusTimeout );
        Player.trigger( 'pause' );
        Loop.stop();
        smoother.clear();
    }


    function PlayheadSmoother() {
        var started = false;
        var MAX_LEAD = 15/60;
        var prevPosition, nextPosition, position = 0;
        var lead = 0;

        this.clear = function() {
            prevPosition = undefined;
        };

        this.update = function( p ) {
            p = p || 0;
            if ( p !== 0 ) {
                started = true;
            }
            if ( started && p === prevPosition ) {
                lead += Loop.delta;
                lead = Math.min( lead, MAX_LEAD );
                nextPosition = p + lead;
            } else  {
                lead = 0;
                nextPosition = p;
            }

            prevPosition = p;

            if ( nextPosition >= position ) {
                position = nextPosition
            }

            return position;
        };

    }
    
} )( this );