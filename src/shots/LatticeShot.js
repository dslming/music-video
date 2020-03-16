;( function( scope ) {
    
    scope.LatticeShot = Composition( 

        PairShot,

        function() {
            if ( LITE || HANDHELD ) {

                this.dimension = 4;
                this.size = 7000 * ( 6 / 5 ) * ( 5 / 4 );    
            } else { 

                this.dimension = 5;
                this.size = 7000 * 6 / 5;
            }
            // this.camera.position.z = this.size * 3;
            // this.camera.unserialize( 2127.3655, 435.1724, 21640.2702, 0.9703, -0.1164, -0.0862, 0.4674, -0.0314, -0.0109, 0.8834, 60, 1, 30000 );
        },

        {
            
            start: function() {
                
                bg.reset();
                this.camera.add( bg );
                bg.noiseScale = 4;


                this.timeline.fromTo( this.container.scale, 5.0.div, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, ease: Expo.easeOut, immediateRender: true }, 0.1 );
                this.container.position.y = 63000;

                this.meteors = this.get( 5 );
                this.meteors.forEach( function( pair, i  ) { 
                    
                    var s = i === 4 ? 400 : 180;
                    pair.scale.set( s, s, s );
                    pair.position.z = -10000;
                    pair.sparkle = 1;
                    var container = new Group();
                    container.add( pair );
                    // container.rotation.x = random.angle();
                    // container.rotation.y = random.angle();
                    container.rotation.z = random.angle();

                }, this );

                ExplodeBehavior.Rate = 1;

                this.pairs = this.get( Math.pow( this.dimension, 3 ) );
                this.pairs.forEach( function( pair, i ) { 

                    pair.sparkle = 1;

                    var x = i % this.dimension;
                    var y = ~~( i / this.dimension ) % this.dimension;
                    var z = ~~( i / ( this.dimension * this.dimension ) );

                    pair.position.x = ( x - ~~( this.dimension / 2 ) ) * this.size;
                    pair.position.y = ( y - ~~( this.dimension / 2 ) ) * this.size;
                    pair.position.z = ( z - ~~( this.dimension / 2 ) ) * this.size;

                    pair.scale.set( 60, 60, 60 );
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                    pair.male.visible = false;
                    pair.male.position.z = 700;

                    pair.explode = this.behavior( ExplodeBehavior );
                    pair.explode.target = pair;
                    pair.explode.decay = 0.5;

                    pair.fall = this.behavior( FallBehavior );
                    pair.fall.target = pair;
                    pair.fall.magnitude = 7;

                    this.timeline.to( pair.scale, 0.5.beats, { z: 0.01, x: 0.01, y: 0.01 }, 3.3.bars - i * 0.025 );

                }.bind( this ) );

                // this.extras = this.get( ` ).forEach( function( pair ) { 
                    
                //     pair.position.x = random.range( this.size * 2, this.size * 4 );
                //     pair.position.z = random.range( this.size * 2, this.size * 4 );
                //     pair.position.y = random.range( this.size * 2, this.size * 4 );
                //     pair.scale.set( 5, 5, 5 );
                //     pair.male.visible = false;

                // }, this );

                this.pairs = _.shuffle( this.pairs );

                Volume.forPeaks( _.keys( Volumes ), this.in, this.out, 
                function( time, info ) {

                    var t = Math.max( 0, time - 0.3 );

                    if ( info.noteIndex < this.pairs.length ) {
                        this.timeline.add( this.pairs[ info.noteIndex ].insert( 1.5 ), t );
                        this.timeline.set( this.pairs[ info.noteIndex ].male, { visible: true }, t );
                    }

                }, this );

                this.course = [];
                var x = 0, z = this.camera.position.z, speed = 10;
                for ( var now = 0, inc = Time.frames( 1 ); now < this.duration; now += inc ) {
                    var angle = ( noise( x * 0.00001, z * 0.00001, now * 0.003 ) - 0.5 ) * 4 * TWO_PI;
                    x -= Math.sin( angle ) * speed;
                    z -= Math.abs( Math.cos( angle ) * speed );
                    this.course.push( [ x, z, angle ] );
                }

                var m = 0;
                var meteorStrike = function( time, dur1 ) {

                    time -= this.in;

                    this.timeline.$( time, this.explode, this, m );
                    var meteor = this.meteors[ m++ ];

                    var dur = 1.0.bars;// dur || 0.5.beats ;
                    var dist = 100000 * dur / 0.5.beats;
                     dur1 = dur1 || 1.5.div;
                    var dist1 = 300;


                    this.timeline.$( time - dur, function() {
                        Scene.camera.passenger.add( meteor.parent );
                        // meteor.position.y = 1500;
                    } );

                    this.timeline.$( time - 0.1.sec, function() {
                        meteor.parent.toWorld();
                        // bg.threshhold -= 0.05;
                    } );

                    this.timeline.$( time - dur, dur, meteor.position, { x: -dist }, { x: -dist1, immediateRender: true } );
                    this.timeline.$( time, dur1, meteor.position, { x: -dist1 }, { x: dist1 } );
                    this.timeline.$( time, dur1, meteor.rotation, { x: random.angle() / 30, y: random.angle() / 30 } );
                    this.timeline.$( time + dur1, dur, meteor.position, { x: dist1 }, { x: dist }, { x: random.angle() * 30, y: random.angle() * 30 } );
                    this.timeline.$( time + dur + dur1, dur, meteor, { visible: false } );


                }.bind( this );

                meteorStrike( Time.bbd( 42, 2, 0 ) );
                meteorStrike( Time.bbd( 42, 2, 2 ) );
                meteorStrike( Time.bbd( 42, 3, 0 ) );
                meteorStrike( Time.bbd( 42, 3, 2 ) );
                meteorStrike( Time.bbd( 43, 0, 0 ), 1.0.beats );
                
                this.timeline.$( Time.bbd( 43 ) - this.in, ExplodeBehavior, 'Rate', 6 )
                this.timeline.$( Time.bbd( 43 ) - this.in, function() {
                    bg.toWorld();
                    Renderer.setClearColor( 0xffffff, 1 );
                    this.pairs.forEach( function( pair ) { 
                        pair.explode.speed2.setLength( 10 );
                        pair.fall.start()
                    }, this );

                }, this )
                
            },

            explode: function( meteorIndex ) {
              
                this.pairs.forEach( function( pair ) { 
                    pair.explode.center = this.meteors[ meteorIndex ].getWorldPosition();
                    pair.explode.start();
                    pair.explode.speed2.setLength( 6 );
                }, this );

            },

            update: function() {
                if ( Player.now > Time.bbd( 43, 1 ) ) {
                    Scene.camera.lookAt( this.meteors[ 4 ].getWorldPosition() );
                }
                    Pair.sparkleSeed.value.y -= 0.01;

                // this.camera.position.y = pos[ 0 ];
                // this.camera.position.z = pos[ 1 ];
                // this.camera.rotation.x = pos[ 2 ];

                // if ( prev ) {
                //     this.camera.rotation.z += ( -80 * ( prev[ 2 ] - pos[ 2 ] ) - this.camera.rotation.z ) * 0.05;
                // }

            } 

        } 

    );
        
} )( this );
