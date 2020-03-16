;( function( scope ) {
    
    var lastDir = random.sign();

    scope.DriftBehavior = Composition( 

        Behavior,

        {
            
            start: function( pct, y, z, offset, useZ ) {

                var distance = this.camera.frustumSlice( - this.camera.position.z ).width;
            

                this.z = z || 0;
                this.y = y || 0;
                this.duration = random( 10, 20 );
                this.distance = distance * pct;
                this.offset = offset || 0;

                this.slope = random.range( 1 / STAGE_ASPECT_RATIO );
                this.rz = random.range( 0.1, 0.2 );
                this.dir = lastDir;
                // lastDir *= -1;
                
                this.useZ = useZ;

                this.update();

            },

            update: function() {

                var xd = this.useZ ? 'z' : 'x'; 
                var zd = this.useZ ? 'x' : 'z';

                this.target.position[ xd ] = this.dir * ( this.offset + map( this.now + this.offset / 1000, 0, this.duration, -this.distance / 2, this.distance / 2 ) );
                this.target.position.y = this.slope * this.target.position[ xd ] + this.y;
                this.target.position[ zd ] = this.z;

                this.target.rotation.z = this.now  * this.rz;

            } 

        }

    );



    scope.DriftShot = Composition( 

        PairShot,

        function( cameraDistance, screenTravel, numPairs, useZ, dir, offset, useMidi ) {

            this.camera.position.z = cameraDistance;
            this.screenTravel = screenTravel;
            this.numPairs = numPairs || 1;

            this.useZ = useZ;
            this.offset = offset || 0;

            this.dir = dir;

            this.useMidi = useMidi === undefined ? true : useMidi;

        },

        {
            start: function() { 


                lastDir = this.dir || random.sign();

                var behavior = this.behavior( DriftBehavior );
                behavior.target = this.next();
                behavior.camera = this.camera;
                behavior.start( 
                    this.screenTravel,
                    0,
                    0,
                    this.offset,
                    this.useZ );

                this.camera.distance = this.camera.position.distanceTo( behavior.target.position );

                for ( var i = 1; i < this.numPairs; i++ ) {

                    var behavior = this.behavior( DriftBehavior );
                    behavior.target = this.next();
                    behavior.target.scale.setLength( random( 0.85, 1.2 ) );
                    behavior.camera = this.camera;
                    behavior.start( 
                        random( 0.4, 0.6 ), 
                        random.range( 200 ), 
                        map( i, 0, this.numPairs, -600, this.useZ ? 600 : 0 ),
                        random.range( 1000 ) + this.offset,
                        this.useZ 
                    ); 

                }

                if ( this.useMidi ) {

                    var popEvents = _.filter( Midi.events, where( { 

                        type: 'noteOn', 
                        track: 2, 
                        time: between( this.in, this.out ) 

                    } ) );

                    popEvents.forEach( function( note, i ) { 

                        if ( this.popFrequency && i % this.popFrequency != 1 ) {
                            return;
                        }

                        var pair = this.next();
                        pair.scale.set( 0.0001, 0.0001, 0.0001 );
                        var behavior = this.behavior( DriftBehavior );
                        behavior.camera = this.camera;
                        behavior.target = pair;
                        behavior.start( 
                            random( 0.6, 1.0 ), 
                            random( 200 ) * random.sign(), 
                            random( -300, 300  ),
                            random( 100 ) * random.sign() - random( -300, 400 ),
                            this.useZ
                        );

                        var jiggle = this.behavior( PairJiggle );
                        jiggle.target = pair;
                        jiggle.scale = random( 0.85, 1.2 );

                        this.timeline.$( note.time - this.in, jiggle.start );

                    }, this );

                }

            }

        } 

    );
} )( this );