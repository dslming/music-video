;( function( scope ) {
    
    var LiftBehavior = Composition( 

        Behavior, 

        function() {
            this.speed = random( 50, 250 ) * 1.5;
        }, 

        {
            start: function() {
                this.origin = this.target.position.y;
                this.rx = this.target.rotation.x;
                this.ry = this.target.rotation.y;
            },
            update: function() {
                this.target.rotation.x = lerp( this.rx, HALF_PI, Easing.Quadratic.InOut( clamp( this.now / Time.bars( 0.33 ) , 0, 1 ) ) );
                this.target.position.y = Easing.Quadratic.In( this.now / this.duration ) * ( this.speed * this.duration ) + this.origin;
            } 
        }

    )

    var DropBehavior = Composition( 

        Behavior,

        function() {
            this.speed = 800;
        },

        {

            start: function() {
                Group.prototype.toWorld.call( this.target.male );
                this.origin = this.target.position.y;
                this.len = this.origin / this.speed;

            },
            update: function() {
                var t = cmap( this.now, 0, this.len, 0, 1 );
                t = Easing.Quadratic.In( t );
                this.target.male.position.y = lerp( this.target.position.y, 0, t );
            } 


        }

    )

    var LaunchBehavior = Composition( 

        Behavior,

        function() {
            this.speed = random( 3000, 6000 );
        },

        {

            start: function() {
                this.origin = this.target.position.y;       
            },
            update: function() {
                this.target.position.y = this.origin + this.now * this.speed;
            }
        }
    )

    scope.RefuseShot = Composition( 

        PairShot,

        function() {

            this.count = 100;
            this.camera.fov = 90;
            this.camera.y = 300;
            this.dir = -1;

        },

        {
            
            start: function() {

                this.pairs = [];
                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                floor.reset();
                Renderer.setClearColor( 0x000000, 1 );
                floor.colorHigh = 0x000000;
                floor.colorLow = 0x222222;
                this.container.add( floor );

                this.duration = Time.frames( this.count ) * 10;

                var shake = this.behavior( Shake );
                shake.magnitude.set( 0, 9, 0 );
                shake.target = this.camera;
                shake.duration = this.duration - Time.bars( 0.5 );

                this.timeline.call( shake.start, [], shake, 1.0.bars );

                for ( var now = 0, inc = Time.frames( 10 ); now < this.duration; now += inc ) {
                    var angle = noise( x * 0.006, z * 0.002, seed ) * 4 * TWO_PI;
                    x -= Math.sin( angle ) * speed * 2 ;
                    z -= Math.abs( Math.cos( angle ) * speed );
                    y = 0;
                    this.course.push( [ x, y, z, angle ] );
                }

                for ( var i = 0; i < this.count; i++ ) {
                    var pair = this.next();
                    var pos = this.getPos( Time.frames( i ) );
                    pair.position.set( pos[ 0 ] + random.range( 100 ), pos[ 1 ], pos[ 2 ] + random.range( 100 ) );
                    pair.rotation.reorder( 'YXZ' )
                    pair.rotation.y = random.range( PI );
                    pair.rotation.x += random.range( 0.3 );

                    pair.male.visible = true;
                    pair.male.position.set( 0, 0, 0 );

                    var lift = this.behavior( LiftBehavior );
                    lift.duration = Time.bars( 3 );
                    lift.target = pair;

                    var center = i == ~~( this.count / 7 );

                    this.timeline.call( lift.start, [], lift, random( 0, Time.beats( 2 ) ) );

                    if ( i == 0 ) {
                        this.camera.position.set( pos[ 0 ], 0, pos[ 2 ] + 150 );
                    }
                    if ( center ) {
                        this.center = pair;
                    }

                    this.pairs.push( pair );

                }

                this.pairs = _.shuffle( this.pairs );

                var j = 0;
                for ( var i = Time.bars( 0.5 ); i < Time.bars( 3 ); i += Time.div( 0.125 / 1.5 ) ) {

                        if ( j >= this.pairs.length ) {
                            break;
                        }
                        var pair = this.pairs[ j++ ];
                        pair.drop = this.behavior( DropBehavior );
                        pair.drop.target = pair;
                        this.timeline.call( pair.drop.start, [], pair.drop, i + 1.0.beats );

                        pair.launch = this.behavior( LaunchBehavior );
                        pair.launch.target = pair;
                        pair.maleLaunch = this.behavior( LaunchBehavior );
                        pair.maleLaunch.target = pair.male;;
                        
                        this.timeline.call( pair.launch.start, [], pair.launch, i + Time.bars( 1 ) );
                        this.timeline.call( pair.maleLaunch.start, [], pair.drop, i + Time.bars( 1 ) );

                }

                var lockCamera = function() {
                    this.camera.position.copy( this.center.position );
                    this.camera.position.z += 200;
                    this.camera.position.x += 200;
                    this.camera.position.y = 0;
                    this.update();
                };



                this.timeline.call( this.camera.unserialize, [[637.0572,-27.2998,-150.3776,0.3725,0.6159,0,0.1765,0.2978,-0.0561,0.9365,90,1,30000]], this.camera, Time.bars( 1 ) );
                this.timeline.call( lockCamera, [], this, Time.bars( 1 ) );



            },

            getPos: function( time ) {
                return this.course[ ~~( Time.to.frames( time ) ) ];
            },

            update: function() {
                // this.dir = ~~Time.to.frames( this.now ) % 2 == 0 ? -1 : 1;
                this.camera.lookAt( this.center.position );
                // this.camera.position.y += 8 * this.dir * clamp( this.now / Time.bars( 2 ), 0, 1 );
                        
            } 

        } 

    );
        
} )( this );
