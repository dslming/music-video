;( function( scope ) {
    
    scope.SnakeShot = Composition( 

        PairShot,

        function() {
            this.camera.fov = 90;
            this.rollStrength = 10;
            this.camera.rotation.reorder( 'YXZ' );
            this.camera.thetaRange = PI;
            this.camera.phiRange = PI;
            this.cameraContainer = new THREE.Object3D();
            this.container.add( this.cameraContainer );
            this.cameraContainer.add( this.camera );
            this.camera.distance = 150;
            this.camera.position.z = 0;
        },

        {
            
            start: function() {
                
                floor.reset();
                floor.colorHigh = Pair.maleColors.next();
                floor.colorLow = Pair.maleColors.next();
                this.container.add( floor );
                Renderer.setClearColor( floor.colorHigh, 1 );

                floor.scale.set( 2.0, 2.0, 2.0 );

                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                for ( var now = 0, inc = Time.frames( 1 ); now < this.duration + 1.0.bars; now += inc ) {
                    var angle = noise( x * 0.0002, z * 0.0002, seed ) * 4 * TWO_PI;
                    x += Math.sin( angle ) * speed;
                    z += Math.cos( angle ) * speed;
                    y = angle;
                    this.course.push( [ x, y, z, angle ] );
                }
                    var _this = this;

                Volume.forPeaks( this.tracks, this.in, this.out, 
                    function( time, info ) {
                        

                        var vol = Volumes[ info.track ].at( time );
                        var offset = 0.5.div;// map( vol, 0, 1, 0, Time.div( 1 ) );

                        var pos = this.getPos(  time + offset  );
                        var pair = this.next( { colorMale: Pair.maleColors[ info.trackIndex % Pair.maleColors ] } );
                        
                        var r = info.noteIndex * ( TWO_PI * 0.01 );
                        var d = random.range( 30, 80 );

                        if ( !pos ) return;

                        pair.position.x = pos[ 0 ];
                        pair.position.y = pos[ 1 ];
                        pair.position.z = pos[ 2 ];
                        pair.rotation.x = r + PI;

                        if ( info.trackNoteIndex == info.trackTotal - 1 && info.track == 'dennis pokey' ) {
                            this.camera.add( pair );
                            pair.position.set( 0, 0, -100 );
                            pair.rotation.set( 0, random.range( 0.2 ), random.range( 0.2 ) );
                            this.timeline.$( time, function() {
                                floor.visible = false;
                                Renderer.setClearColor( 0x000000, 1 );
                                _this.freezeCamera = true;
                            } );

                        } else {
                            pair.position.x -= Math.cos( pos[ 3 ] + r ) * d;
                            pair.position.y -= Math.sin( pos[ 3 ] + r ) * d / STAGE_ASPECT_RATIO;
                        }

                        // console.log( info.noteIndex, info.total,info.trackNoteIndex, info.trackTotal );

                        pair.visible = false;
                        this.timeline.set( pair, { visible: true }, time - 0.1 );

                        var y = pair.position.y ;

                        this.timeline.fromTo( pair.position, 0.1, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: false }, time - 0.1 )
                            .to( pair.position, 0.5, { y: 2 + y, ease: Linear.easeNone }, time ) 
                            .to( pair.position, 0.5, { y: -1000, ease: Expo.easeIn }, time + 0.3 );

                        this.timeline.add( pair.insert( 1.8 ), time - 0.2 );

                    }, this );

            },

            getPos: function( time ) {
              
                return this.course[ ~~( Time.to.frames( time ) ) ];

            },

            update: function() {

                var t = Math.max( 0, this.now + Time.div( 2 ) );

                var pos = this.getPos( t );
                var prev = this.getPos( t - Time.frames( 1 ) );

                if ( !pos || this.freezeCamera ) return;

                this.cameraContainer.position.x = pos[ 0 ];
                this.cameraContainer.position.y = pos[ 1 ];
                this.cameraContainer.position.z = pos[ 2 ];
                this.cameraContainer.rotation.y = pos[ 3 ];


                if ( prev) {
                    this.cameraContainer.rotation.z += ( this.rollStrength * ( pos[ 3 ] - prev[ 3 ] ) - this.cameraContainer.rotation.z ) * 0.1 ;
                //     // this.camera.rotation.x = Math.atan2( pos[ 1 ] - prev[ 1 ], pos[ 0 ] - prev[ 0 ] );

                }

            } 

        } 

    );
        
} )( this );
