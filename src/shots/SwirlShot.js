;( function( scope ) {
    
    var SwirlBehavior = Composition( 
        Behavior,
        function() {
        
            this.radius = random( 10, 50 );
            this.verticalSpeed = 1.2
            this.angleSpeed = lerp( 0.0001, 0.02, this.radius / 50 );
            this.seed = random( 0.5, 2 );
            // this.rx = random.range( 0.02, 1.4 );
            // this.ry = random.range( 0.02, 1.4 );

        },
        {

            start: function() {
            }, 
            update: function() {
                var angle = ( this.n * 2 - ( this.now * 0.7 + 18 ) * this.angleSpeed + 0.3 ) % 3;
                this.target.position.x = ( angle ) * 240 + 60;
                this.target.position.y = this.radius * Math.sin( -angle * TWO_PI );
                this.target.position.z = this.radius * Math.cos ( -angle * TWO_PI) ;
                // this.target.rotation.x = this.now * this.rx;
                // this.target.rotation.y = this.now * this.ry;
            }

        } 
    ); 

    var ThrobBehavior = Composition( 
    
        Behavior,
    
        function() {
            this.amplitude = random( 0.5, 2 );
            // this.duration = random( 5, 40 ).div;
        },
    
        {
            update: function() {
                var t = Easing.Elastic.Out( this.now / 2 );
                var a = ( 1 - t ) * this.amplitude;
                var d = ( this.origin + a - this.target.scale.x ) * 0.23;
                d = clamp( d, -0.15, 0.15 );
                var v = this.target.scale.x + d;
                this.target.scale.set( v, v, v );
            }
        }
    
    );


    scope.SwirlShot = Composition( 

        {
            Count: 1,
        },

        PairShot,

        function() {
            this.container.add( creditAAF );
            this.container.add( creditPopcorn );
            
            creditAAF.scale.setLength( 0.425 );
            creditAAF.position.x = -125;

            creditPopcorn.rotation.y = HALF_PI
            creditPopcorn.scale.setLength( 3 );
            creditPopcorn.position.z = -850;
        }, 

        {
            start: function() {

                bg.position.y = 0;
                bg.updateMatrix();
                this.camera.add( bg );
                
                this.camera.thetaRange = PI * 0.25;
                this.camera.phiRange = PI * 0.5;
                this.lookAt = undefined;

                this.hero1 = this.next();
                this.heroGroup1 = new PairWrapper( this.hero1 );
                this.heroGroup1.position.copy( { x: 158.4396, y: -25.7578, z: -22.0123 } );
                this.heroGroup1.rotation.y = Math.PI * 0.5;
                this.heroGroup1.rotation.y += random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup1.rotation.x = random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup1.visible = false;
                this.heroGroup1.scale.set( 0.4, 0.4, 0.4 );

                this.hero2 = this.next();
                this.heroGroup2 = new PairWrapper( this.hero2 );
                this.heroGroup2.position.z = -30;
                this.heroGroup2.rotation.y = random.range( 0.1, 0.15 ) * Math.PI;
                // this.heroGroup2.rotation.x = random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup2.visible = false;
                this.heroGroup2.scale.set( 0.4, 0.4, 0.4 );


                // Impact 1
                // -------------------------------  



                Player.timeline.set( this.heroGroup1, { visible: true }, 32.0.beats );
                Player.timeline.to( this.heroGroup1.position, 0.75, { x: this.heroGroup1.position.x - 2, ease: Linear.easeNone }, 32.75.beats );
                Player.timeline.to( this.hero1.rotation, 0.75, { x: 0.15, ease: Linear.easeNone }, 32.75.beats );
                Player.timeline.add( this.hero1.insert(), 32.75.beats - Time.seconds( 0.4 ) );
                Player.timeline.add( bg.curdle( new THREE.Color( 0xffffff ), this.hero1.colorMale ), 32.75.beats )

                Player.timeline.call( this.explode, [], this, 32.75.beats );

                Player.timeline.call( this.setExplodeSpeed, [ 800 ], this, 33.5.beats );
                // Player.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, 33.5.beats );
                Player.timeline.to( this.hero1.position, Time.seconds( 6 ), { z: -8000, ease: Linear.easeNone }, 33.5.beats );
                Player.timeline.to( this.hero1.rotation, Time.seconds( 6 ), { x: 480, ease: Linear.easeNone }, 33.5.beats );

                Player.timeline.call( this.setExplodeSpeed, [ 200 ], this, 34.5.beats );


                Player.timeline.set( this.heroGroup2, { visible: true }, 35.8.beats );
                Player.timeline.fromTo( this.hero2.position, 0.5.beats, { z: -20000 }, { z: 0, ease: Linear.easeNone }, 35.5.beats );
                Player.timeline.fromTo( this.hero2.rotation, 0.5.beats, { x: 100 }, { x: 0, ease: Linear.easeNone }, 35.5.beats );


                // Impact 2
                // ------------------------------- 
                Player.timeline.call( this.setExplodeSpeed, [ 20 ], this, 36.0.beats );
                Player.timeline.to( this.hero2.position, 0.75, { z: 4, ease: Linear.easeNone }, 36.0.beats );
                Player.timeline.to( this.hero2.rotation, 0.75, { x: 0.25, ease: Linear.easeNone }, 36.0.beats );

                Player.timeline.add( this.hero2.insert(), 36.75.beats - Time.seconds( 0.4 ) );
                // Player.timeline.$( function() {
                    
                // }, [], this, 36.75.beats )
                Player.timeline.add( bg.curdle( new THREE.Color( 0xffffff ), this.hero2.colorMale ), 36.75.beats )
                // Player.timeline.$( 36.75.beats, bg.curdle, bg, { r: 1, g: 1, b: 1 }, this.hero2.colorMale )
                // Player.timeline.call( Renderer.setClearColor, [ this.hero2.colorMale, 1 ], Renderer, 36.75.beats );
                // Player.timeline.$( 36.75.beats, bg.colorLow, { x: 1, y: 1, z: 1 } );
                // Player.timeline.$( 36.75.beats, bg.colorHigh, { x: 0, y: 0, z: 0 } );
                // Player.timeline.$( 36.75.beats, bg, { threshhold: 0.5 } );

                Player.timeline.to( this.hero2.position, 0.75, { z: -8, ease: Linear.easeNone }, 36.75.beats );
                Player.timeline.to( this.hero2.rotation, 0.75, { x: -0.5, ease: Linear.easeNone }, 36.75.beats );

                Player.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, 37.5.beats );
                Player.timeline.to( this.hero2.position, 6, { z: -8000, ease: Linear.easeNone }, 37.5.beats );
                Player.timeline.to( this.hero2.rotation, 6, { x: -480, ease: Linear.easeNone }, 37.5.beats );


                this.popCount = 0;

                ExplodeBehavior.Rate = 1;

                this.heroGroup2.visible = false; 
                this.heroGroup1.visible = false;
                
                Scene.add( this.heroGroup1 );
                this.camera.add( this.heroGroup2 );

                this.pairs = this.get( PairPool.size / 4 );

                this.poppers = [];
                this.sploders = [];
                this.drifts = [];

                this.pairs.forEach( function( pair, n ) {

                    pair.male.matrixAutoUpdate = false;
                    pair.female.matrixAutoUpdate = false;

                    pair.rotation.x = random.angle();
                    pair.rotation.y = random.angle();
                    pair.rotation.z = random.angle(); 
                    var popper = n % 2 === 0;

                    var s = random( 0.09, 0.15 ) * 1.35;
                    pair.scale.set( s, s, s )
                
                    var behavior = this.behavior( SwirlBehavior );
                    this.drifts.push( behavior );
                    behavior.n = n / this.pairs.length;
                    behavior.target = pair;
                    behavior.start();
                    behavior.update();
                    
                    var behavior = this.behavior( ExplodeBehavior );
                    behavior.target = pair;
                    behavior.center = this.heroGroup1.position;
                    this.sploders.push( behavior );
                    
                    var behavior = this.behavior( HonkBehavior );
                    behavior.target = pair;
                    behavior.start();
                    pair.strokeInflate( 1 / s * 0.35 );

                    if ( popper ) {
                        var behavior = this.behavior( PairJiggle );
                        behavior.target = pair;
                        behavior.amplitude = 2;
                        behavior.scale = s;
                        pair.scale.set( s, s, s )
                        pair.visible = false;
                        this.poppers.unshift( behavior );
                    }

                    var throb = this.behavior( ThrobBehavior );
                    throb.target = pair;
                    throb.origin = pair.scale.x;
                    pair.throb = throb;                        

                }, this );

                this.poppers = _.shuffle( this.poppers );

                Midi.query( { type: 'noteOn', track: 3 } ).forEach( function( note ) { 

                    if ( note.time < this.in ) return;

                    var time = note.time - this.in;

                    // this.timeline.$( time, bg.splat, bg, 1.0.beats );
                    // this.timeline.$( time, bg.colorHigh, bg, Pair.maleColors.next() );
                    // this.timeline.$( time, bg.uniforms.colorHigh.value, { x: 0, y: 0, z : 0 } );

                    this.pairs.forEach( function( pair, i ) { 

                        if ( !pair.throb ) return;

                        this.timeline.$( time + i / this.pairs.length * 1.0.div, pair.throb.start, pair.throb );

                    }, this );

                }, this );

                Midi.query( { type: 'noteOn', track: 2 } ).forEach( function( note ) { 

                    if ( note.time < this.in ) return;
                    
                    for ( var i = 0; i < 2; i ++ ) {

                        var b = this.poppers[ this.popCount++ % this.poppers.length ];
                        this.timeline.$( note.time - this.in, b.start );
                    }

                }, this );

            },
            update: function() {
                
                // bg.time.x += 0.01 * 0.125;
                // bg.time.y += 0.001 * 0.125;

                if ( this.lookAt ) {
                    this.camera.lookAt( this[ this.lookAt ].position );
                    // this.camera.distance = this.camera.distanceTo( this[ this.lookAt ].position );
                }

            },
            explode: function() {

                this.setExplodeSpeed( 80 );
                this.sploders.forEach( function( behavior ) {
                    behavior.start();
                } )

            },
            setExplodeSpeed: function( s ) {

                this.sploders.forEach( function( behavior ) {
                    behavior.speed2.setLength( s );
                } );

            },
            freeze: function() {

                this.drifts.forEach( function( d ) {
                    d.stop();
                } );

            },
            stop: function() {
                this.poppers.clear();
            } 
        }

    )


} )( this );