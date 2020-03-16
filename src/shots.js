;( function( scope ) {

    scope.initShots = function() {
        
        // Drift arpeggio intro
        // ------------------------------- 

        // var firstShot = new DriftShot( 50, 1.2, 0, true, -1, 40, false );
        // this 0.01 is new ....
        // addShot( 0.01.beats, firstShot );

        if ( url.boolean( 'single' ) ) {

            var singleShot = new TestShot();
            addShot( 0, singleShot, true );

            setTimeout(function() { 
                Stage.hideControls();
            }, 1000);


        } else { 

            var introShot = new IntroShot();
            addShot( 0.00.beats, introShot, true );
            Player.timeline.add(
                bg.wipe( 3.5.beats, 0xffffff )
            , 0.35.beats );
            var anotherDrift = new DriftShot( 50, 0.3, 30, false, undefined );
            anotherDrift.popFrequency = 1;
            addSimultaneousShot( 0.01.beats, anotherDrift, false )

        }


        // var sexyShot0 = new SexyShot();
        // sexyShot0.len = 15.0.beats;
        // sexyShot0.distance = 1.0;
        // sexyShot0.rx = 0;
        // sexyShot0.ry = QUARTER_PI;
        // addSimultaneousShot( 0.01.beats, sexyShot0, false );
       

        // var lonelyShot = new LonelyShot();
        // addSimultaneousShot( 0.01.beats, lonelyShot, false );
        // Player.timeline.to( introShot.camera.position, 5.0.beats, { y: 0 }, 0.01.beats )

        addCameraTween( 0.01.beats, 5.0.beats, Easing.Quintic.InOut, [0, 0, 100, 0, 0, 0, 0, 0, 0, 1, 50, 1, 30000] );

        Player.timeline.call( function() {
            
            Player.timeline.to( Scene.camera, 5.0.beats, { thetaRange: 0.1, phiRange: 0.1 }, 0.01.beats );
            Player.timeline.to( Scene.camera, 5.0.beats, { thetaRange: TWO_PI / 2, phiRange: PI / 2 }, 5.2.beats );

        }, [], this, 0.01.beats );




        // addShot( 6.0.beats, new DriftShot( 50, 0.6, 10, false, undefined, 0, false ) );
        // addShot 10,( new DriftShot( 50, 0.3, 20 ) ); 

        var thirdDriftShot = new DriftShot( 120, 0.8, 20, false, undefined );
        // thirdDriftShot.popFrequency = 2;
        thirdDriftShot.camera.position.z = 500;
        
        addShot( 8.5.beats, thirdDriftShot );
        // addShot( 12.0.beats, new DriftShot( 150, 0.004, 200, false, 1, -600 ) );

        // var sexyShot00 = new SexyShot();
        // sexyShot00.len = 7.0.beats;
        // sexyShot00.distance = 0.6;
        // sexyShot00.camera.position.z = 70;
        // addShot( 12.0.beats, sexyShot00 );
        // Player.timeline.$( 12.0.beats, bg.soak, bg, 5.0.beats )

        addShot( 14.0.beats, new DriftShot( 300, 0.8, 30, true, 1 ) );   
        // addShot 24,( new DriftShot( 170, 0.5, 800, true, 1 ) );


        // Swirl arpeggio intro
        // ------------------------------- 




        var sexyShot01 = new SexyShot();
        sexyShot01.len = 10.0.beats;
        sexyShot01.distance = 0.5;
        sexyShot01.camera.position.z = 70;
        sexyShot01.camera.distance = 70;
        sexyShot01.credit = true;
        sexyShot01.rx = 0;
        sexyShot01.ry = -HALF_PI / 2;

        var swirlShot = new SwirlShot();


        addShot( 18.0.beats, sexyShot01 );

        // var stupidIdea = new DriftShot( 100, 0.8, 5 );
        // stupidIdea.popFrequency = 3;
        // addSimultaneousShot( 18.0.beats, stupidIdea, false ); 

        Player.timeline.$( 18.0.beats, function() {  
            bg.position.y = 0;
            bg.updateMatrix();
            sexyShot01.camera.add( bg );
            bg.clear(); 
            bg.colorHigh = sexyShot01.pair.colorMale;
        } );

        Player.timeline.$( 18.0.beats, bg.soak( 6.0.beats ) );

        // addCut( 21.0.beats, swirlShot, [ 411.0211, -21.1656, -40.3824, -2.9398, 1.121, 2.9594, -0.0233, 0.844, 0.0369, 0.5345, 120, 1, 30000 ] )
        // addCut( 21.0.beats, swirlShot, [ 205.4160, -17.2923, -19.5788, 1.1508, 1.4336, -1.1473, 0.0455, 0.6856, -0.0430, 0.7253, 120, 1, 30000 ] );
        
        addShot( 23.9.beats, swirlShot );
        Player.timeline.$( 23.9.beats, bg.clear );
        // Player.timeline.$( 24.0.beats, bg.solid, bg, 0xffffff );

        var lastSwirlCut = [ 572.695, -9.9965, -2.8112, 1.8449, 1.5527, -1.845, 0.0062, 0.7088, -0.0062, 0.7053, 120, 1, 30000 ];
        var swirlZoomAnticipatePosition = [ 576.695, -9.9965, -2.8112, 1.8449, 1.5527, -1.845, 0.0062, 0.7088, -0.0062, 0.7053, 120, 1, 30000 ]
        addCut( 28.3.beats, swirlShot, lastSwirlCut )
        
     

        // Drop zoom
        // ------------------------------- 

        var swirlZoomAnticipate = new CameraTween();
        var swirlZoomAnticipateIn = 31.2.beats;

        swirlZoomAnticipate.target = swirlShot.camera;
        swirlZoomAnticipate.in = swirlZoomAnticipateIn;
        swirlZoomAnticipate.out = 31.6.beats;
        swirlZoomAnticipate.easing = Easing.Quadratic.Out;
        swirlZoomAnticipate.origin = lastSwirlCut;
        swirlZoomAnticipate.dest = swirlZoomAnticipatePosition;

        Player.timeline.call( swirlZoomAnticipate.start, [], swirlZoomAnticipate, swirlZoomAnticipateIn );

        var swirlZoom = new CameraTween();
        var swirlZoomIn = 31.6.beats;
        var swirlZoomArrive = [177.4396, -28.7578, -24.0123, 2.2665, 1.5707963267948966, -2.2773, 0.0523, 0.7506, -0.0599, 0.6559, 70, 1, 30000];

        swirlZoom.target = swirlShot.camera;
        swirlZoom.out = 32.0.beats;
        swirlZoom.easing = Easing.Exponential.In;
        swirlZoom.origin = swirlZoomAnticipatePosition;
        swirlZoom.dest = swirlZoomArrive;

        Player.timeline.call( swirlZoom.start, [], swirlZoom, swirlZoomIn );
        Player.timeline.call( swirlShot.freeze, [], swirlShot, 32.0.beats );
        Player.timeline.call( function() {
            creditPopcorn.visible = false;
            creditAAF.visible = false;
        }, [], this, 32.0.beats );

        // Player.timeline.$( swirlZoomIn, swirlShot, { lookAt: 'hero1' } );

        // Impact cuts
        // -------------------------------

        var swirlFarAway =[2213.7401, -11854.7396, 15926.2202, 0.6399, 0.111, -0.0823, 0.3116, 0.0656, -0.0216, 0.9477, 60, 1, 30000];
        addCut( 34.5.beats, swirlShot, swirlFarAway );
        Player.timeline.$( 34.5.beats, function() {
            bg.visible = false;   
        } );
        Player.timeline.$( 34.5.beats, swirlShot, { lookAt: undefined } );

        var secondInsertCut = [11342.6987, 199.8479, 647.309, -0.2995, 1.5111, 0.299, -0.0064, 0.6866, 0.006, 0.7269, 60, 1, 30000];
        addCut( 35.5.beats, swirlShot, secondInsertCut );
        Player.timeline.$( 35.5.beats, function() {
            bg.randomize();
            bg.visible = true;   
        } )
        Player.timeline.$( 35.5.beats, swirlShot, { lookAt: 'hero2' } );
        Player.timeline.$( 35.5.beats, function() {
            for ( var i = 0, l = swirlShot.pairs.length; i < l; i++ ) { 
                swirlShot.pairs[ i ].strokeInflate( 1 );
            }
        } )

        // Tom fill
        // ------------------------------- 

        var tomFillShot = new JumpShot();

        tomFillShot.useTitle = true;

        var tomFillTime = Time.bbd( 9, 3, 1 );
        var tomFillDur = Time.seconds( ( 32 + 10 / 24 ) - ( 31 + 20 / 24 ) );

        var d = Time.seconds( tomFillDur / 5 );
        addShot( Time.bbd( 9, 3, 1 ) - Time.seconds( 0.62 ), tomFillShot );

        Player.timeline.call( tomFillShot.jump, [], tomFillShot, tomFillTime);
        Player.timeline.call( tomFillShot.jump, [], tomFillShot, tomFillTime + d );
        Player.timeline.call( tomFillShot.insert, [], tomFillShot, tomFillTime );
        // Player.timeline.call( tomFillShot.color, [], tomFillShot, tomFillTime + Time.seconds( 0.18 ) );
        Player.timeline.call( tomFillShot.insert, [], tomFillShot, tomFillTime + Time.seconds( 0.1 ) );
        // Player.timeline.call( tomFillShot.color, [], tomFillShot, tomFillTime + Time.seconds( 0.31 ) );


        // Second impact set
        // -------------------------------

        var introImpactShot = new IntroImpactShot();
        addShot( Time.bbd( 10, 0, 2 ), introImpactShot );
        introImpactShot.offset = -2.0.div;

        Player.timeline.$( Time.bbd(10, 2, 2 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 1.0.div );
        } );
        Player.timeline.$( Time.bbd(10, 2, 3 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 1.0.div );
        } );
        Player.timeline.$( Time.bbd(10, 3, 2 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 2.0.div );
        } );


        var introImpactShot2 = new IntroImpactShot();
        addShot( Time.bbd( 11, 0, 0 ), introImpactShot2 );
        introImpactShot2.curdleLength = Time.bbd( 0, 2, 0 );


        // Pre-verse fill
        // ------------------------------- 

        var laserFillShot = new JumpShot();
        laserFillShot.scale = 0.6;

        var i = 0;
        var jumps = _.filter( Volumes[ 'dennis bballstab' ].peaks, function( t ) {
            return t > Time.seconds( 38 ) && t < Time.seconds( 38.8 ) && i++ < 8;
        } );

        laserFillShot.count = jumps.length / 2;

        jumps.forEach( function( time, i ) { 
            if ( i < 4 ) {
                Player.timeline.call( laserFillShot.jump, [], laserFillShot, time );
            } else { 
                Player.timeline.call( laserFillShot.insert, [], laserFillShot, time - Time.seconds( 0.23 ) );
                Player.timeline.call( laserFillShot.color, [], laserFillShot, time );
            }
        }.bind( this ) );

        addShot( Time.bbd( 11, 2, 3 ), laserFillShot );




        // First verse rain  
        // ------------------------------- 

        var rainShot = new RainShot();
        rainShot.max = Time.bbd( 20, 0, 0 );
        rainShot.tracks = [ 
            'dennis 7-Kick 808 2', 
            'dennis drums', 
            'dennis sunvox', 
            'dennis pokey', 
            'dennis 20-808BD_T5D7_X', 
            'dennis crash2' 
        ];


        addShot( Time.bbd( 12, 0, 2 ), rainShot );

        addCut( Time.bars( 14 ), rainShot, RainShot.cuts.kicks );
        // Player.timeline.$( 14.0.bars, rainShot.camera, { distance: RainShot.cuts.kicks[ 2 ] } );
        addCut( Time.bars( 15 ), rainShot, RainShot.cuts.hihats );
        // Player.timeline.$( 15.0.bars, rainShot.camera, { distance: RainShot.cuts.hihats[ 2 ] } );
        addCut( Time.bars( 16 ), rainShot, RainShot.cuts.forward );
        addCut( Time.bars( 17 ), rainShot, RainShot.cuts.underneath );
        // Player.timeline.$( 17.0.bars, rainShot.camera, { distance: RainShot.cuts.underneath[ 2 ] } );
        addCut( Time.bars( 18.25 ), rainShot, RainShot.cuts.pokes );
        

        // function curdleKick( time ) {

        //     Player.timeline.$( time, function( ) {
        //         bg.colorLow = 0xffffff;
        //         bg.noiseScale = 100;
        //     } );
        //     Player.timeline.$( time, bg.throb( 0.1.beats ) );
        // }

        // curdleKick( Time.bbd( 14, 0, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 1, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 2, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 2, 2 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 3, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 3, 2 ) + 0.5.div );
        // curdleKick( Time.bbd( 15, 0, 0 ) + 0.5.div );

        // Grid shot 1
        // -------------------------------

        var gridHack = new GridShot();
        gridHack.cols = 0;
        gridHack.rows = 0;


        var gridShot = new GridShot();
        gridShot.padding = 10;
        gridShot.cols = 5;
        gridShot.rows = 3;
        gridShot.appearTracks = [ 'dennis funny' ];
        gridShot.impactIn = 25.0.bars;
        gridShot.impactTracks = [
            'dennis human',
            'dennis 28-Vox1C5',
            'dennis drums',
            'dennis fx2',
        ];
        gridShot.max = Time.bars( 26, 3 );
        // addShot( Time.bbd( 23, 2, 0 ), gridHack );
        addShot( Time.bbd( 23, 3, 0 ), gridShot );

        
        // Grid shot 2
        // -------------------------------

        var gridShot2 = new GridShot();
        gridShot2.padding = 10;
        gridShot2.cols = 5;
        gridShot2.rows = 3;
        gridShot2.appearTracks = [ 'dennis funny' ];
        gridShot2.max = 28.0.bars;
        addShot( Time.bars( 26, 2 ), gridShot2 );

        
        // Sexy Sexion 
        // -------------------------------

        Player.timeline.set( bg, { visible: false }, 27.0.bars )

        var sexyShot = new SexyShot();
        sexyShot.len = 1.0.bars;
        sexyShot.distance = 0.65;
        sexyShot.background = true;

        var sexyShot1 = new SexyShot();
        sexyShot1.len = 1.0.bars;
        sexyShot1.distance = 0.4;
        sexyShot1.camera.position.z = 65; 
        sexyShot1.camera.distance = 65;
        sexyShot1.background = true;

        var sexyShot2 = new SexyShot();
        sexyShot2.len = 1.0.bars; 
        sexyShot2.distance = 0.3;
        sexyShot2.background = true;
        sexyShot2.camera.position.z = 50;
        sexyShot2.camera.distance = 50;

        addShot( 27.0.bars, sexyShot )
        addShot( Time.bbd( 27, 2 ), sexyShot1 )
        addShot( Time.bbd( 27, 3 ), sexyShot2 );


        // Melody cutaway
        // -------------------------------

        var melodyShot = new MelodyShot1();
        melodyShot.offset = Time.div( 1 ); 
        addShot( 28.0.bars - melodyShot.offset, melodyShot );


        // Bullet time
        // -------------------------------

        var bulletTimeShot = new BulletTimeShot();
        addShot( 29.75.bars, bulletTimeShot );
        bulletTimeShot.in -= 1.0.bars;


        // Roller coaster
        // -------------------------------

        var snakeShot = new SnakeShot();
        snakeShot.duration = 1.0.bars;
        snakeShot.tracks = //_.keys( Volumes );
        [ 
            'dennis 7-Kick 808 2', 
            'dennis drums', 
            'dennis sunvox', 
            'dennis pokey', 
            'dennis 20-808BD_T5D7_X', 
            'dennis lasersynth', 
            'dennis supersaw', 
            'dennis human', 
            'dennis crash2' 
        ];
        addShot( 30.5.bars, snakeShot );


        var refuseShot = new RefuseShot();
        addShot( 32.25.bars, refuseShot );


        // Tables turn
        // -------------------------------

        addShot( 34.0.bars, new TableTurnShot() );
        addShot( 36.0.bars, new TableTurnShot() );


        // Finale
        // -------------------------------

        var parabolaShot = new ParabolaShot();
        parabolaShot.duration = Time.bbd( 8, 0, 2 );
        parabolaShot.out = 43.0.bars
        addShot( 38.0.bars, parabolaShot ); 

        addCut( 38.4.bars, parabolaShot, [1653.0005, 67.2793, 2539.1972, 0.0322, -0.5003, -0.0001, 0.0156, -0.2475, 0.004, 0.9687, 60, 1, 30000] );

        var melodyShot2 = new MelodyShot2();
        melodyShot2.offset = Time.div( 1 );
        addSimultaneousShot( 39.0.bars - melodyShot.offset, melodyShot2 );

        addCameraTween( 39.25.bars, 0.65.bars, Easing.Quadratic.InOut, [ 7023.3928, 455.9658, 1994.6711, -0.0203, 0.5741, 0, -0.0097, 0.2831, 0.0029, 0.959, 74.9, 1, 30000 ] );

        addCut( 40.0.bars, melodyShot2, [8555.6028, 201.9867, -1227.3187, -0.0342, 2.3509, 0, -0.0066, 0.9227, 0.0158, 0.3851, 90.6, 1, 30000] );//[ 4640.6824 * 2, 1269.0682, 416.5563, -1.5708, 0.0043, 0.0001, -0.7071, 0.0015, 0.0015, 0.7071, 90.6, 1, 30000 ] );
        addCut( 40.5.bars, melodyShot2, [ 4811.8696 * 2, -0.5813, 1741.9753, 0.1224, 0.7048, 0, 0.0574, 0.3445, -0.0211, 0.9368, 101.6, 1, 90000 ] );

        var latticeShot1 = new LatticeShot();
        // latticeShot1.duration = Time.bbd( 5, 1, 3 ); 
        addSimultaneousShot( Time.bbd( 41 ), latticeShot1, false );
        
        if ( !LITE && !HANDHELD ) {

            var followShot = new FollowShot();
            followShot.out = Time.bbd( 43 );
            followShot.tracks = _.keys( Volumes );
            addSimultaneousShot( Time.bbd( 40.9 ), followShot, false );
            Player.timeline.$( followShot.out, followShot.stop, followShot );

        }

        addCameraTween( Time.bbd( 41 ), Time.bbd( 2 ), Easing.Quadratic.In, [ -3306.5978, 64929.6176, -1626.5002, 1.5452, 0.6987, -2.9452, -0.1796, 0.6767, -0.693, -0.1718, 105.5, 1, 90000 ] );

        // Player.timeline.$( 43.0.bars, followShot.stop, followShot );

        addCameraTween( Time.bbd( 43, 2 ), 6.0.beats, Easing.Quadratic.In, [ -1878.9144, -400681.0666, -1465.7254, -0.1252, 0.1231, 0, -0.0624, 0.0614, 0.0038, 0.9962, 105.5, 1, 100000 ] );
        Player.timeline.$( 46.0.bars, latticeShot1.stop, latticeShot1 );
        Player.timeline.$( 42.0.bars, melodyShot2.stop, melodyShot2 );
        Player.timeline.$( 42.5.bars, parabolaShot.stop, parabolaShot );


        var floorShot = new FloorShot();
        addShot( Time.bbd( 44.5 ), floorShot );
        

        Player.timeline.fromTo( bg, 4.0.beats, { threshhold: 0.5 }, { threshhold: 0, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 43 ) );
        // Player.timeline.to( bg, 2.0.beats, { noiseScale: 4, ease: Quint.easeOut }, Time.bbd( 43 ) );

        // Player.timeline.$( 41, function() {
          
        //     Scene.camera.add( bg );
        //     bg.position.set( 0, 0, 0 );
        //     bg.colorHigh = floor.colorHigh;
        //     bg.colorLow = Pair.maleColors.next();
        //     bg.threshhold = 0.5;
        //     bg.visible = true;
        //     bg.scale.set( 2.0, 2.0, 2.0 );  
        // } )

        // var snakeShot3 = new SnakeShot();
        // snakeShot3.tracks = _.keys( Volumes );
        // snakeShot3.duration = 2.21.bars;
        // addSimultaneousShot( Time.bbd( 43, 2, 0 ), snakeShot3, false );

        // var latticeShot2 = new ParabolaShot();
        // latticeShot2.duration = Time.bbd( 10, 0, 2 );
        // addShot( Time.bbd( 44, 1 ), latticeShot2 );


        // var dudShot = new DudTossShot();
        // addShot( 46.0.bars, dudShot );


    }

    var currentShots = [];

    function addShot( time, shot ) {
        
        currentShots.forEach( function( s ) { s.out = time; } );
        currentShots.length = 0;

        Player.timeline.$( time, Shot.stopAll );
        
        addSimultaneousShot( time, shot );

    }

    function showBackground( time ) {

        Player.timeline.$( time, function() {
            Scene.camera.add( bg );
        } );

    }

    function hideBackground( time ) {

        Player.timeline.$( time, function() {
            if ( bg.parent ) bg.parent.remove( bg );
        } );        
    }

    function addSimultaneousShot( time, shot, shotInitializesCamera ) {

        currentShots.push( shot );

        shot.in = time;

        var state;

        if ( shotInitializesCamera === false ) {
            Player.timeline.$( time, function() {
                state = Scene.camera.serialize();
            }, this );
        }

        Player.timeline.call( shot.start, [], shot, time );

        if ( shotInitializesCamera === false ) {
            Player.timeline.$( time, function() {
                shot.camera.unserialize( state );
            }, this );
        }

    }

    function addCut( time, shot, arr ) {
        Player.timeline.call( shot.camera.unserialize, [ arr ], shot.camera, time );
    }

    function addCameraTween( time, duration, ease, dest ) {
        var tween = new CameraTween();
        tween.easing = ease;
        tween.duration = duration;
        tween.dest = dest;
        Player.timeline.$( time, function() {
            tween.target = Scene.camera;
            tween.start();
        }, this );
    }


    scope.addShot = addShot;    
} )( this );
