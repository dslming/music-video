;( function( scope ) {
    
    var StreamBehavior = Composition( 

        Behavior,

        {
            Rate: 1
        },

        function() {
            
            this.width = 18000;
            this.height = 13000;
            this.depth = 6500;

        },

        {

            start: function() {
                this.speed = random( 1000, 20000 );
                this.target.position.y = random.range( this.height / 2 );
                this.target.position.x = random.range( this.width / 2 );
                this.target.position.z = random( -this.depth );
                this.rx = random.range( 20 );
                this.ry = random.range( 20 );
            },

            update: function() {
                this.target.position.x += this.speed * StreamBehavior.Rate * Player.delta;
                this.target.position.x += this.width / 2;
                this.target.position.x %= this.width;
                this.target.position.x -= this.width / 2;
                this.target.rotation.x += this.rx * StreamBehavior.Rate * Player.delta;
                this.target.rotation.y += this.ry * StreamBehavior.Rate * Player.delta;
            } 

        }

    )

    scope.IntroImpactShot = Composition( 

        PairShot,

        function() {
            // this.camera.unserialize( 0,-0.2488,499.6,0,0,1.1872,0,0,0.5593,0.8289,95.5,1,30000 );
            this.camera.position.z = 4000;
            this.camera.distance = 60;
            this.camera.thetaRange = 0;
            this.camera.phiRange = 0;
            this.camera.fov = 95.5;
            this.offset = 0;
        },

        {
            
            start: function() {

                bg.clear();

                bg.reset();
                this.camera.add( bg );
                
                StreamBehavior.Rate = 2;

                Renderer.setClearColor( 0xffffff, 1 );

                var pair = this.next();

                this.pair = pair;
                
                pair.rotation.reorder( 'YXZ' );
                pair.rotation.x = random.range( 0.03, QUARTER_PI / 2 );
                pair.rotation.y = random.range( 0.03, QUARTER_PI / 2 );
                pair.rotation.z = random( TWO_PI );

                var zoom = this.behavior( CameraTween );
                var dest = new Camera();
                dest.position.z = 60;

                // var roll = random.angle();

                // this.camera.rotation.z = roll;
                // dest.rotation.z = roll;

                zoom.target = this.camera;
                zoom.dest = dest;
                zoom.easing = Easing.Back.In;
                zoom.duration = 1.0.div;

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.duration = 4.0.div;
                shake.magnitude.set( 0, 5, 0 );

                var dest = new THREE.Vector3( 0, 0, -50 );
                dest.applyEuler( pair.rotation );
                dest.add( pair.position );


                this.timeline.$( this.offset + 2.0.div, zoom.start, zoom );
                this.timeline.$( this.offset + 2.0.div + zoom.duration, function() {
                    this.camera.thetaRange = PI;
                    this.camera.phiRange = PI;
                }.bind( this ) );
                this.timeline.$( this.offset + 2.0.div, 1.0.div, pair.position, { z: -6000, y: 3000 }, { z: 0, y: 0, immediateRender: true } );
                this.timeline.$( this.offset + 3.0.div, StreamBehavior, 'Rate', 0.1 );
                this.timeline.$( this.offset + 3.0.div, 8.0.div, pair.position, { x: 2 } );
                this.timeline.$( this.offset + 6.0.div, StreamBehavior, 'Rate', 0.005 );
                this.timeline.$( this.offset + 6.0.div, 6.0.div, pair.position, { x: dest.x, y: dest.y, z: dest.z } );
                this.timeline.$( this.offset + 6.0.div, 6.0.div, pair.rotation, { x: pair.rotation.x - 2 } );
                this.timeline.$( this.offset + 6.0.div, Renderer.setClearColor, Renderer, pair.colorMale, 1 );
                this.timeline.$( this.offset + 6.0.div - 0.3.sec, pair.insert( 1.5 ) );
                this.timeline.$( this.offset + 6.0.div - 0.2.sec, pair.male, 'visible', true );

                this.timeline.$( this.offset + 6.0.div, bg.curdle( new THREE.Color( 0xffffff ), pair.colorMale, this.curdleLength ) );

                var dest = new THREE.Vector3( 0, 0, -2800 );
                dest.applyEuler( pair.rotation );
                dest.add( pair.position );


                this.timeline.$( this.offset + 10.0.div, 8.0.div, pair.position, { x: dest.x, y: dest.y, z: dest.z } );
                this.timeline.$( this.offset + 10.0.div, 8.0.div, pair.rotation, { x: pair.rotation.x - 120 } );
                this.timeline.$( this.offset + 10.0.div, StreamBehavior, 'Rate', 2 );
                this.timeline.$( this.offset + 10.0.div, Renderer.setClearColor, Renderer, 0xffffff, 1 );



                this.get( PairPool.size / 8 ).forEach( function( pair ) { 

                    var stream = this.behavior( StreamBehavior );
                    stream.target = pair;
                    stream.start();
                    
                    pair.scale.setLength( random( 3, 6 ) );

                    var behavior = this.behavior( HonkBehavior );
                    behavior.cameraScale = false;
                    behavior.amplitude = 80;
                    behavior.target = pair;
                    behavior.start();

                }, this );


            },

            update: function() {

                
                bg.time.x += 0.01 * 0.5 * 0.125;
                bg.time.y += 0.001 * 0.5 * 0.125;
            } 

        } 

    );
        
} )( this );
