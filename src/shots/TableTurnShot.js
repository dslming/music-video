;( function( scope ) {
    
    scope.TableTurnShot = Composition( 

        PairShot,

        function() {
            this.camera.unserialize( -15.7036,-6.1413,80.4846,-0.1467,-0.6351,0,-0.0696,-0.3114,-0.0229,0.9474,60,1,30000 );
            this.camera.distance = this.camera.position.length();

            this.swarmDepth = 10000;
            this.swarmContainer = new THREE.Object3D();
            this.swarmContainer.position.z = -this.swarmDepth / 3;

            this.camera.thetaRange = 0.5;
            this.camera.phiRange = 0.5;
            this.camera.distance = 0;

            this.container.add( this.swarmContainer );

        }, 

        { 
             
            start: function() {


                this.superSparkle = false;

                SwarmBehavior.Rate = 1;
                this.swarmContainer.visible = true;

                Renderer.setClearColor( 0x000000, 1 );
                bg.reset();
                this.camera.add( bg );
                bg.visible = true;
                bg.noiseScale = 2;
                bg.colorLow = 0xffffff;
                bg.colorHigh = 0x000000;


                bg.threshhold = 1;
                bg.time.set( 0, 0, 0 );
                if ( LITE_PERLIN ) {
                    bg.scale.setLength( 0.45 );
                }

                this.decoy = this.next();

                this.decoy.female.visible = true;
                this.decoy.male.visible = true;
                
                this.timeline.fromTo( this.decoy.male.position, Time.bbd( 0, 0, 2 ), { z: 400 }, { z: 40, immediateRender: false, ease: Linear.easeNone }, Time.div( 0 ) );
                this.timeline.fromTo( this.decoy.male.position, Time.bbd( 0, 4 ), { z: 40 }, { z: 34, immediateRender: false, ease: Linear.easeNone }, Time.bbd( 0, 0, 2 ) );
                
                this.timeline.$( 2.0.div, function() {
                    SwarmBehavior.Rate = 0.002;
                } );

                this.timeline.to( this.decoy, Time.bbd( 0, 1, 2 ) * 2, { sparkle: 1, ease: Linear.easeNone }, Time.bbd( 0, 1, 2 ) );
                
                this.camera1 = new Camera();
                this.camera1.unserialize( -66.7461,14.5528,73.8503,-0.1725,-0.8826,-0.0001,-0.0779,-0.4255,-0.0368,0.9008,60,1,30000  );
                this.camera1.distance = this.camera1.position.length();
                this.camera1.lookAt( this.decoy.position );

                this.camera2 = new Camera();
                this.camera2.unserialize( -3.1921,62.2693,88.457,-0.874,-0.0104,-0.0002,-0.4232,-0.0047,-0.0023,0.906,60,1,30000  );
                this.camera2.distance = this.camera2.position.length();
                // this.camera2.lookAt( this.decoy.position );

                // this.timeline.$( Time.bbd( 0, 1, 2 ), function() {
                //     Controls.centerOffsetInstant();
                //     Scene.camera = this.camera1;
                // }.bind( this ) )

                // this.timeline.$( Time.bbd( 0, 1, 2 ) * 2, function() {
                //     // Scene.camera = this.camera2;
                // }.bind( this ) )

                this.timeline.call( this.camera.unserialize, [-66.7461,14.5528,73.8503,-0.1725,-0.8826,-0.0001,-0.0779,-0.4255,-0.0368,0.9008,60,1,30000], this.camera, Time.bbd( 0, 1, 2 ) );
                this.timeline.call( this.camera.unserialize, [-3.1921,62.2693,88.457,-0.874,-0.0104,-0.0002,-0.4232,-0.0047,-0.0023,0.906,60,1,30000], this.camera, Time.bbd( 0, 1, 2 ) * 2 );

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.magnitude.set( 5, 0, 0 );
                shake.duration = Time.div( 5 );

                this.sis = this.next();
                this.sis.visible = false;
                this.sis.sparkle = 1;

                this.timeline.fromTo( this.sis.rotation, Time.div( 1 ), { z: TWO_PI * 8 }, { z: 0, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 3, 3 ) )
                this.timeline.fromTo( this.sis.position, Time.div( 1 ), { x: -505, y: 0, z: 36 }, { x: -10, y: 0, z: 36, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 3, 3 ) )
                this.timeline.set( this.sis, { visible: true }, Time.bbd( 0, 3, 3 ) )

                this.timeline.to( this.decoy.male.rotation, Time.bbd( 0, 1, 2 ), { y: 0.5, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )
                this.timeline.to( this.decoy.male.position, Time.bbd( 0, 1, 2 ), { x: 40, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )

                this.timeline.to( this.sis.rotation, Time.bbd( 0, 1, 2 ), { z: 0.2, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 4 ) )
                this.timeline.to( this.sis.position, Time.bbd( 0, 1, 2 ), { x: -26, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )

                this.timeline.fromTo( this.sis.scale, Time.bbd( 0, 1, 2 ), { x: 0.1 }, { x: 1, ease: Elastic.easeOut, immediateRender: false }, Time.bbd( 0, 4 ) )
                this.timeline.fromTo( this.decoy.male.scale, Time.bbd( 0, 2 ), { x: 0.1 }, { x: 1, ease: Elastic.easeOut, immediateRender: false }, Time.bbd( 0, 4 ) )

                this.timeline.call( shake.start, [], shake, Time.bbd( 0, 4 ) );
                
                this.timeline.call( this.camera.unserialize, [-6.3611,-5.2826,43.4969,-0.0797,-1.5701,-0.0003,-0.0281,-0.7063,-0.0283,0.7068,60,1,30000], this.camera, Time.bbd( 0, 5, 0 ) )
                this.timeline.call( function() {
                    this.swarmContainer.visible = false;
                }, [], this, 5.0.beats );
                this.timeline.to( bg, 4.0.beats, { threshhold: 0.6, ease: Linear.easeNone }, 3.0.beats );
                this.timeline.to( bg, 0.5.beats, { noiseScale: 6, ease: Expo.easeOut }, 7.0.beats );
                
                if ( LITE_PERLIN ) this.timeline.to( bg.time, 2.0.beats, { z: 20, ease: Linear.easeOut }, 7.0.beats );
                else this.timeline.to( bg.time, 2.0.beats, { x: 20, ease: Linear.easeOut }, 7.0.beats );

                this.timeline.to( this.decoy.male.rotation, Time.bbd( 0, 2 ), { y: TWO_PI * 20 - HALF_PI, ease: Linear.easeNone }, Time.bbd( 0, 5 ) )
                this.timeline.to( this.decoy.male.position, Time.bbd( 0, 2 ), { x: 1000, ease: Linear.easeNone }, Time.bbd( 0, 5 ) )

                var intercept = function() {

                    this.decoy.female.rotation.set( 0, -HALF_PI, 0 );
                    this.decoy.female.scale.set( 30, 30, 30 );
                    this.decoy.sparkle = 1;
                };


                var shake2 = this.behavior( Shake );
                shake2.target = this.decoy;
                shake2.magnitude.set( 0, 30, 0 );
                shake2.duration = Time.div( 4 );

                this.timeline.call( intercept, [], this, Time.bbd( 0, 6 ) );
                this.timeline.fromTo( this.decoy.female.position, Time.div( 0.2 ), { x: 1000, y: -300, z: 0 }, { y: -30, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 6 ) );
                this.timeline.fromTo( this.decoy.female.rotation, Time.div( 0.2 ), { z: random( QUARTER_PI, HALF_PI ) }, { z: 0.1, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 6 ) );
                this.timeline.to( this.decoy.female.position, Time.div( 8 ), { y: 0, ease: Linear.easeNone }, Time.bbd( 0, 6, 0.2 ) );
                this.timeline.to( this.decoy.female.rotation, Time.div( 8 ), { z: 0, ease: Linear.easeNone }, Time.bbd( 0, 6, 0.2 ) );

                this.timeline.call( shake2.start, [], shake2, Time.bbd( 0, 7 ) );
                this.timeline.set( this, { superSparkle: true }, Time.bbd( 0, 7 ) );

                // this.timeline.call( Renderer.setClearColor, [ this.decoy.colorMale, 1 ], Renderer, Time.bbd( 0, 7 ) )
                this.timeline.set( this.decoy, { visible: false }, Time.bbd( 0, 7 ) )
                this.timeline.set( this.decoy.male, { visible: false }, Time.bbd( 0, 7 ) )

                this.timeline.set( this.decoy, { visible: true }, Time.bbd( 0, 7 ) + Time.frames( 3 ) )

                // var catchup = function() {
                //     console.log( this );

                //     var tween = this.behavior( CameraTween );
                //     tween.target = this.camera;
                //     tween.dest = new Camera();
                //     tween.dest.position.copy( this.decoy.male.position );
                //     tween.dest.position.x -= 40;
                //     tween.origin = this.camera;
                //     tween.duration = Time.div( 5 );
                //     tween.start();


                // }.bind( this );

                // this.timeline.call( catchup, [], this, Time.bbd( 0, 6 ) );

                this.swarmPairs = this.get( 125 );
                this.swarmPairs.forEach( function( p ) {
                    this.swarmContainer.add( p );
                    var b = this.behavior( SwarmBehavior );
                    b.depth = this.swarmDepth;
                    b.target = p;
                    // p.swarmBehavior = b
                    // p.swarmBehavior.start();                    
                    b.start();
                }, this );
            },

            update: function() {

                // if ( this.superSparkle ) {
                    Pair.sparkleSeed.value.y -= 0.01;
                // }
                // Pair.sparkleSeed.value.w += 0.01;
            } 

        } 

    );
        
} )( this );
