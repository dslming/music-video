;( function( scope ) {
    
    var G = 980 * 4;

    scope.ParabolaShot = Composition( 
        PairShot,
        function() {

            this.timeScale = 1000;
            this.camera.unserialize( -989.2992,470.5407,1087.0526,-0.0207,-1.2376,0,-0.0084,-0.58,-0.006,0.8145,60,1,30000 );


            // this.camera.unserialize( 760.6408, 743.3592, -1071.3161, -0.0925, -1.6163, -0.0001, -0.032, -0.7222, -0.0335, 0.6901, 60, 1, 30000 );

            this.throbFrequency = 2.0.beats;
            this.camera.phiRange /= 2;
            
            this.minZ = 1850;
            this.maxZ = -1850;

        },  
        {
            start: function() {

                Renderer.setClearColor( 0xffffff, 1 );
                bg.reset();
                this.camera.add( bg );
                bg.threshhold = 2;

                var throbTimeline = new TimelineLite( { paused: true } );
                var throbAttack = 0.3;
                var ta = 0.5;
                var tb = 0.55;
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: ta }, { threshhold: tb, ease: Elastic.easeOut } );
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: tb }, { threshhold: ta, ease: Elastic.easeOut }, this.throbFrequency / 2 );
                this.throbTimeline = throbTimeline;

                var a = Pair.maleColors.next();
                var b = Pair.maleColors.next();

                floor.reset();
                Renderer.setClearColor( a, 1 );
                bg.colorHigh = floor.colorHigh = a;
                floor.colorLow = b;
                bg.colorLow = 0xffffff;
                floor.noiseScale = 1.0;
                this.container.add( floor );

                for ( var i = 0; i < Time.bars( 8 ); i += Time.div( 0.25 ) ) {
                    
                    // var pair = this.next();
                    // pair.position.x = i * this.timeScale;
                    // pair.rotation.x = HALF_PI;
                    // pair.male.visible = true;
                    // pair.female.visible = false;
                    // pair.male.position.z = 0;

                    // var jump = this.behavior( JumpBehavior );
                    // jump.target = pair;
                    // jump.duration = Time.div( random( 4, 5 ) );
                    // this.timeline.call( jump.start, [], jump, i - jump.duration );
                    // this.timeline.fromTo( pair.scale, random( 0.05, 0.1 ), { z: 0.1 }, { z: 1, ease: Elastic.easeOut, immediateRender: false }, i );
                    // this.timeline.fromTo( pair.position, 0.5, { z: 0 }, { z: 40, ease: Elastic.easeOut, immediateRender: false }, i );

                }

                var sx = 0;
                var sc = 0;

                var tracks = _.keys( Volumes );
                var totalTracks = tracks.length;
                tracks.splice( tracks.indexOf( 'dennis drums' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis supersaw' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis 8-Drum Rack' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis elephant' ), 1 );

                if ( MEDIUM || LITE ) {
                    tracks.splice( tracks.indexOf( 'dennis supersaw-1' ), 1 );
                    tracks.splice( tracks.indexOf( 'dennis supersawmono2' ), 1 );
                    tracks.splice( tracks.indexOf( 'dennis BELLS' ), 1 );

                }

                Volume.forPeaks( tracks, this.in, Time.bbd( 41 ), 
                    function( time, info ) {
                        


                        if ( time < 1.5.beats ) { 
                            return;
                        }

                        var pair = this.next();
                        pair.position.x = time * this.timeScale;
                        pair.rotation.x = HALF_PI;
                        pair.sparkle = 1;
                        pair.scale.set( 3, 3, 3 );
                        pair.position.z = map( info.trackIndex, 0, totalTracks - 1, this.minZ, this.maxZ );
                        // console.log( pair.position.z );

                        sx += pair.position.x;
                        sc++;

                        pair.male.visible = true;
                        pair.female.visible = false;
                        pair.male.position.z = 0;

                        time += 0.1;

                        var jump = this.behavior( JumpBehavior );
                        jump.target = pair;
                        this.timeline.fromTo( pair.scale, random( 0.05, 0.1 ), { z: 0.1 }, { z: 2, ease: Elastic.easeOut, immediateRender: false }, time );
                        this.timeline.fromTo( pair.position, 0.3, { y: 0 }, { y: -40, ease: Elastic.easeOut, immediateRender: false }, time );

                        jump.duration = Time.div( random( 4, 8 ) );
                        this.timeline.call( jump.start, [], jump, Math.max( time - jump.duration, 0 ) );



                    }, this );

                floor.position.x = sx / sc;
                floor.scale.set( 3, 3, 3 );

            },
            update: function() {
                Pair.sparkleSeed.value.y -= 0.01;
                // this.camera.position.x = ( this.now ) * this.timeScale;

                floor.time.y += 0.003;


                // console.log( Player.now, this.throbFrequency );
                this.throb = ~~( ( Player.now + ( window.number || 0 ) ) / this.throbFrequency );
                if ( this.throb > this.lastThrob) {
                    floor.time.y += 0.1;
                    this.throbTimeline.restart();
                }

                this.lastThrob = this.throb;
            } 
        } 
    );
        
    var JumpBehavior = Composition( 
        Behavior,
        function() {
            this.height = random( 0, 800 );
            this.origin = new THREE.Vector3();
        },
        {
            start: function() {
                this.d = this.duration - ( 2 * this.height ) / ( G * this.duration );
                this.c = ( - G * this.d / 2 - Math.sqrt( G * G * this.d * this.d / 4 + 2 * G * this.height ) ) / -G;
                this.origin.copy( this.target.female.position );
                // this.origin.y = 0;
                this.y = random.range( 200, 300 );
                this.x = random.range( 200, 300 );
                this.rx = random( TWO_PI * 4 );
            },

            update: function() {
                this.target.female.visible = true;
                this.target.female.position.x = map( this.now, 0, this.duration, this.origin.x + this.x, this.origin.x );               
                this.target.female.position.z = ( G * this.now - G * this.c ) / 2 * ( this.d + this.now - this.c );
                this.target.female.position.y = map( this.now, 0, this.duration, this.origin.y + this.y, this.origin.y );               
                this.target.female.rotation.x = map( this.now, 0, this.duration, this.rx, HALF_PI );               
            },
            stop: function() {
                this.target.female.position.set( 0, 0, 0 );
                this.target.female.rotation.set( 0, 0, 0 );
            } 
        }
    )

} )( this );