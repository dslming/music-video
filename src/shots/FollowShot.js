;( function( scope ) {
    
    scope.FollowShot = Composition( 

        PairShot,

        function() {
            this.camera.fov = 90;
            this.rollStrength = 10;
            this.camera.rotation.reorder( 'YXZ' );
        },

        {
            
            start: function() {

                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                Volume.forPeaks( this.tracks, this.in, this.out, 

                    function( time, info ) {
                        
                        var vol = Volumes[ info.track ].at( time );
                        var offset = 0;// map( vol, 0, 1, 0, Time.div( 1 ) );

                        var pair = this.next();
                        
                        var r = time * ( TWO_PI  );
                        // var d = map( vol, 0, 1, 100, 30 );
                        var d = 1000;

                        var container = new Group();
                        container.add( pair );

                        pair.rotation.x = r + PI;
                        pair.sparkle = 1;

                        pair.position.x = 0 -Math.cos( r ) * d;
                        pair.position.y = 2350 - Math.sin( r ) * d;
                        

                        pair.scale.set( 7, 7, 7 );

                        pair.visible = false;

                        var position = function() {
                            Scene.camera.passenger.add( container );
                            container.toWorld();
                            pair.position.z = -2400 * map( this.now, 0, this.duration, 1, 3 );
                        };

                        this.timeline.set( pair, { visible: true }, time  );
                        this.timeline.$( time - 0.3, position, this );

                        var y = pair.position.y;

                        this.timeline.fromTo( pair.position, 0.1, { y: -400 + y }, { y: y, ease: Expo.easeInOut, immediateRender: false }, time - 0.3 )
                            .to( pair.position, 0.5, { y: 2 + y, ease: Linear.easeNone }, time ) 
                            .to( pair.position, 2, { y: -10000, ease: Expo.easeIn }, time + 0.3 );

                        this.timeline.add( pair.insert( 1.8 ), time - 0.2 );

                    }, this );

            }

        } 

    );
        
} )( this );
