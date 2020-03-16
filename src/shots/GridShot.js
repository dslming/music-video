;( function( scope ) {
    
    scope.GridShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 300;
            this.camera.fov = 60;
            this.rows = 5;
            this.cols = 5;
            this.padding = -100;
            this.camera.distance = this.camera.position.z;

            this.appearTracks = [];
            this.impactTracks = [];

            // this.cy = -600;

        },

        {
            
            start: function() {


                Renderer.setClearColor( 0xffffff, 1 );

                this.height = this.camera.frustumSlice().height - this.padding * 2;
                this.width = this.camera.frustumSlice().width - this.padding * 2;

                // console.log( this.height, this.width, this.padding, this.camera, this.camera.frustumSlice().left, this.camera.frustumSlice().top );

                var rowCenter = ~~( this.cols / 2 );
                var colCenter = ~~( this.rows / 2 );

                this.pairs = this.get( this.rows * this.cols );

                this.pairs.forEach( function( p, i ) {

                    var col = ~~( i / 5 )
                    var row = i % 5;

                    p.position.y = ( col - colCenter ) / this.cols * -this.width;
                    p.position.x = ( row - rowCenter ) / this.rows * this.height * 0.9;
                    p.rotation.x = random.range( Math.PI / 8, Math.PI / 4 );
                    p.rotation.y = random.range( Math.PI / 8, Math.PI / 4 );
                    p.male.position.z = 500; 
                    p.visible = false;
                    p.appear = this.behavior( StretchAppear );
                    p.appear.amplitude = 2;
                    p.appear.target = p;

                }, this );

                this.pairs = _.shuffle( this.pairs );

                // console.log( this.pairs );


                this.trackEvents = {};
                this.appearTracks.forEach( function( name ) { 
                    this.trackEvents[ name ] = Volumes[ name ].peaksBetween( this.in, this.max );
                }, this  );
                

                var i = 0;
                _.each( this.trackEvents, function( trackEvents, trackName ) { 
                    trackEvents.forEach( function( time ) { 
                        time -= this.in;
                        if ( i < this.pairs.length ) {
                            var appear = this.pairs[ i ].appear;
                            this.timeline.call( appear.start, [], appear, time + Time.seconds( 0.1 )  );
                        }
                        i++;
                    }, this )
                }, this );

                this.trackEvents = {};
                this.impactTracks.forEach( function( name ) { 
                    this.trackEvents[ name ] = Volumes[ name ].peaksBetween( this.impactIn, this.max );
                }, this  );

                var i = 1;
                _.each( this.trackEvents, function( trackEvents, trackName ) { 
                    
                    // console.log( trackEvents.length, trackName );

                    trackEvents.forEach( function( time ) { 
                        
                        time -= this.in; 

                        if ( i < this.pairs.length ) {
                            
                            var pair = this.pairs[ i ];
                            var appear = pair.appear;

                            this.timeline.add( pair.insert( 1 ), time - Time.seconds( 0.4 ) );
                            this.timeline.to( pair.male.position, Time.beats( 1 ), { z: -40, ease: Quad.easeOut }, time + 0.1 );
                            this.timeline.to( pair.female.position, Time.beats( 1 ), { z: -40, ease: Quad.easeOut }, time + 0.1 );
                            this.timeline.to( pair.rotation, Time.beats( 1 ), { x: pair.rotation.x + 0.3, ease: Quad.easeOut }, time + 0.1 );
                            
                            this.timeline.call( appear.start, [], appear, time );
                            this.timeline.set( appear, { amplitude: 5 }, time );
                
                            this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], Renderer, time )
                            this.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, time + Time.frames( 2 ) )

                            if ( trackName == 'dennis drums' ) {
                                var shake = this.behavior( Shake );
                                shake.target = this.camera;
                                this.timeline.call( shake.start, [], shake, time );
                                this.timeline.call( shake.stop, [], shake, time + 0.1 );
                            }

                        }

                        i++;

                    }, this )

                }, this );

                // var zoom = this.behavior( CameraTween );
                // zoom.target = this.camera;
                // zoom.dest = [-41.0921,-22.0631,-272.0158,-0.0802,0.0881,0,-0.04,0.044,0.0018,0.9982,60,1,30000];
                // zoom.duration = Time.beats( 0.5 );
                // zoom.easing = Easing.Exponential.In;

                // this.timeline.call( zoom.start, [], zoom, this.in );

                this.pairs.forEach( function( p, i ) {
                    this.timeline.to( p.scale, Time.beats( 0.3 ), { x: 0.001, y: 0.001, z: 0.001, ease: Back.easeIn }, this.max - Time.beats( 0.5 ) - this.in + i / this.pairs.length * Time.beats( 0.25 ));
                }, this )

            },

            update: function() {
                // this.camera.position.z = cmap( this.now, 0, this.max - this.in, 0, 1 );
                // this.camera.position.z = Easing.Quadratic.InOut( this.camera.position.z );
                // this.camera.position.z = map( this.camera.position.z, 0, 1, 300, 350 );
                // this.pairs.forEach( function( pair ) { 
                //     console.log( pair.scale.length(), pair.visible );
                // }, this );
            } 

        } 

    );
        
} )( this );
