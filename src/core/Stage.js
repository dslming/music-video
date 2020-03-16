;( function( scope ) {

    Bootstrap.on( 'init', init );
    Bootstrap.on( 'done', done );

    var frozenLoop = new _Loop();
    
    scope.Stage = Singleton(

        Events,

        {
            
            el: document.getElementById( 'container' ),
            canvas: document.getElementById( 'canvas' ),

            openCatalogue: openCatalogue,
            closeCatalogue: closeCatalogue,
            
            showControls: showControls,
            hideControls: hideControls,

            showAbout: showAbout, 
            hideAbout: hideAbout, 

            mouseX: 0,
            mouseY: 0,            

            // should probably be part of player?
            frozen: false,
            freeze: freeze,
            unfreeze: unfreeze,
            frozenLoop: frozenLoop, 
            toggleFreeze: toggleFreeze,

            // extends Events.on for special behavior for Stage.on( 'resize' ) ... 
            // binding to resize invokes the callback once in addition to binding
            // uses a promise to ensure the stage has been resized once beforehand
            on: function( e, fnc, ctx ) { 
                e === 'resize' && resizePromise.then( fnc );
            }

        }

    );

    var Stage = scope.Stage;

    var classList = Stage.el.classList;
    
    var resizePromise = new Promise();
    
    // var durRect = duration.getBoundingClientRect();
    // var posRect = position.getBoundingClientRect();

    var titleScreen = true;
    
    var controls = classList.contains( 'controls' );

    function init() {


        hammer( 'canvas' )          .on( 'tap', pressCanvas );
        // hammer( 'catalogue' )       .on( 'tap', toggleCatalogue );
        // hammer( 'logo' )            .on( 'tap', toggleCatalogue );
        // hammer( 'prev' )            .on( 'tap', Player.prev );
        // hammer( 'next' )            .on( 'tap', Player.next );
        // hammer( 'play-bottom' )     .on( 'tap', function() {
        //     Stage.unfreeze();
        // } );
        // hammer( 'play-pause' )      .on( 'tap', Player.playPause );
        hammer( 'big-play' )        .on( 'tap', unfreeze );
        // hammer( 'track-container' ) .on( 'tap panleft panright panup pandown', scrub )
        

        hammer( 'fb' ).on( 'tap', popup( 'https://www.facebook.com/sharer/sharer.php?u=' + Project.url, 550, 200, 'fb' ) );
        hammer( 'twitter' ).on( 'tap', popup( 'https://twitter.com/home?status=' + Project.url, 550, 225, 'twitter' ) );

        document.addEventListener( 'mouseout', function( e ) {
            !e.relatedTarget || e.relatedTarget.nodeName == "HTML" && hideControls();
        }, false );

        if ( !INTERACTIVE ) {
            window.addEventListener( 'mousemove', showControls, false );
        }

        window.addEventListener( 'mousemove', updateMousePosition, false );
        window.addEventListener( 'resize', triggerResize, false );
        // window.addEventListener( 'orientationchange', triggerResize, false );
        
        // Loop.on( 'update', updateSeekbar );
        
        Player.on( 'pause', onPause );
        Player.on( 'play', onPlay );

        // frozenLoop.on( 'update', checkOrientation );

        Stage.on( 'resize', onResize );

        classList.add( 'title-screen' );

        window.addEventListener( 'keydown', function( e ) {

            switch ( e.keyCode ){ 
                case 32: return Player.playPause();
            }

            if ( DEBUG_ENABLED ) { 
             
                switch( e.keyCode ) {

                    case 192: return Debug.toggle();
                    case 27: return toggleFreeze();

                    case 96: return Three.setEffect();
                    case 97: return Three.setEffect( OCULUS );
                    case 98: return Three.setEffect( STEREO );
                    case 99: return Three.setEffect( ANAGLYPH );

                    case 100: case 188: return Controls.setMode( DEBUG );
                    case 101: case 190: return Controls.setMode( MOUSE );
                    case 102: case 191: return Controls.setMode( TILT );    

                }   
                

            }

        }, false );

        // var art = document.getElementById( 'album-art' );
        // var artImg = art.querySelector( 'img' );
        // var panel = document.getElementById( 'panel-container' );

        // panel.addEventListener( 'scroll', function() {
        //     art.style.top = -panel.scrollTop / 2 + 'px';
        //     artImg.style.webkitFilter = 'blur( ' + cmap( panel.scrollTop, 0, panel.offsetWidth, 0, 10 ) + 'px )';
        // }, false );

    }

    function popup( url, w, h ) {
        return function() {
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);
            return window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left );
        }
    }

    function done() {
        
        triggerResize();
        
        classList.remove( 'hidden' );

    }

    function openCatalogue( e ) {
        if ( classList.contains( 'panel' ) ) return;
        showControls();
        classList.add( 'panel' );
        Player.pause();
    }
    
    function closeCatalogue() {
        if ( !classList.contains( 'panel' ) ) return;
        classList.remove( 'panel' );
    }

    function toggleCatalogue() {
        classList.contains( 'panel' ) ? closeCatalogue() : openCatalogue();
    }


    function toggleFreeze() {

        Stage.frozen ? unfreeze() : freeze();

    }

    function freeze() {

        if ( Stage.frozen ) return;
        
        Stage.frozen = true;




        frozenLoop.on( 'update', Controls.update, Controls );
        frozenLoop.on( 'update', Three.update, Three );

        frozenLoop.start();
        // Controls.start();

        Player.off( 'pause', onPause );
        Player.pause();

        // hideControls();

    } 

    function unfreeze( dontPlay ) {
        
        Stage.frozen = false;

        frozenLoop.off( 'update', Controls.update, Controls );
        frozenLoop.off( 'update', Three.update, Three );

        frozenLoop.stop();
        // Controls.stop();

        
        if ( dontPlay !== true ) {
            Player.on( 'pause', onPause );
            Player.play();
        }

    } 

    function onPlay() {
        Loop.off( 'update', checkOrientation );
        titleScreen = false;
        classList.add( 'playing' );
        classList.remove( 'title-screen' );
        classList.remove( 'paused' );
        setTimeout( closeCatalogue, 200 );
        hideControls();
    }

    function onPause() {
        classList.add( 'paused' );
        classList.remove( 'playing' );
        showControls();
    } 

    function showControls() {
        if ( Stage.frozen ) return;
        classList.add( 'controls' );
        Loop.on( 'update', updateSeekbar );
    } 

    function hideControls() {
        if ( Player.playing || Stage.frozen ) {
            classList.remove( 'controls' );
            Loop.off( 'update', updateSeekbar );
        }
    }

    function showAbout() {
        trackEvent( 'about' );
        Stage.unfreeze( true );
        document.getElementById('about').style.display = 'block';
    }

    function hideAbout() {
        document.getElementById('about').style.display = 'none';
        Stage.freeze();
    }

    
    function toggleControls() {
        classList.contains( 'controls' ) ? hideControls() : showControls();
    }

    function checkOrientation() {

        var holdingItWrong = HANDHELD 
            && titleScreen 
            && Accelerometer.orientation === 0.0.deg
            // && Math.abs( Accelerometer.gamma - Math.PI / 2 ) > Math.PI / 3;


        // if ( holdingItWrong ) {
        //     orientationMessage.style.display = 'block';
        // } else { 
            // orientationMessage.style.display = 'none';
        // }



    }

    function pressCanvas() {
        // toggleControls();
        showControls();
        Player.pause();
        closeCatalogue();
    }

    function updateSeekbar() {

        var posStr = timeString( Player.now );
        var durStr = timeString( Project.duration );
        var knobWidth = Player.now / Project.duration * 100 + '%';

        // if ( position.innerHTML !== posStr ) position.innerHTML = posStr;
        // if ( duration.innerHTML !== durStr ) duration.innerHTML = durStr;
        // if ( knob.style.width !== knobWidth ) knob.style.width = knobWidth;

    }

    function scrub( e ) {

        var max = Stage.portrait ? posRect.top : posRect.right;
        var min = Stage.portrait ? durRect.bottom : durRect.left;

        var val = Stage.portrait ? e.center.y : e.center.x;

        var p = map( val, max, min, 0, Project.duration );

        Player.setPosition( p );

    }

    function updateMousePosition( e ) {
        Stage.mouseX = e.clientX - Stage.left;
        Stage.mouseY = e.clientY - Stage.top;
    } 

    function triggerResize() {
        Stage.trigger( 'resize' );
    }


    function onResize() {

        var width = Math.min( Stage.el.parentElement.offsetWidth, window.innerWidth );
        var height = Math.min( Stage.el.parentElement.offsetHeight, window.innerHeight );
        
        Stage.portrait = HANDHELD && height >= width;

        var x =  Stage.portrait ? height : width;
        var y = !Stage.portrait ? height : width;

        var stageWidth = x;
        var stageHeight = x / STAGE_ASPECT_RATIO;

        var pinned = stageHeight >= y - ( header.offsetHeight * 2 + PINNED_PADDING )
        var pinnedSnapFill = pinned && stageHeight < y;

        var barHeight = header.offsetHeight + controls.offsetHeight;

        if ( pinnedSnapFill ) {
            stageHeight = y;
            stageWidth = STAGE_ASPECT_RATIO * y;
        }

        stageHeight = Math.min( stageHeight, y );
        stageWidth = Math.min( stageWidth, x );

        Stage.height = Debug.canvas.height = canvas.height = stageHeight;
        Stage.width = Debug.canvas.width = canvas.width = stageWidth;

        Stage.el.style.width = '';
        Stage.el.style.marginLeft = '';

        Stage.el.style.height = stageHeight + 'px';
        Stage.el.style.width = stageWidth + 'px';

        Stage.el.style.top = ( y - stageHeight ) / 2 + 'px';
        Stage.el.style.left = ( x - stageWidth ) / 2 + 'px';

        if ( Stage.portrait ) {
            Stage.el.style.top = Stage.width + 'px';
            if ( !pinned ) {
                Stage.el.style.left = ( y - Stage.height ) / 2 + 'px';
            }
        }

        classList.toggle( 'pinned', pinned );
        classList.remove( 'unsized' );

        // durRect = duration.getBoundingClientRect();
        // posRect = position.getBoundingClientRect();

        var box = Stage.el.getBoundingClientRect();

        Stage.top = box.top;
        Stage.left = box.left;
        Stage.right = box.right;
        Stage.bottom = box.bottom;

        resizePromise.resolve();

        Loop.force();

    }

    function timeString( time ) {
        var mod = Math.floor( time % Time.minutes( 1 ) );
        if ( mod < 1 ) mod = '00'
        else if ( mod < 10 ) mod = '0' + mod;
        return Math.floor( time / Time.minutes( 1 ) ) + ':' + mod
    }

} )( this );