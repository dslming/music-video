;( function( scope ) {
    
    var SpinBehavior = Composition( 
        Behavior,
        function() {
            this.rx = random.range( 0.02, 0.06 );
        },
        {
            update: function() {
                this.target.rotation.x += this.rx;
            } 
        } 
    )

    scope.BulletTimeShot = Composition( 

        PairShot,

        function() {
            this.camera.position.y = 100;
            // this.camera.unserialize( -244.4467,36.0035,203.9082,0.022,-0.5215,0,0.0106,-0.2578,0.0028,0.9661,60,1,30000 );
            // this.camera.unserialize( 151.4984,120.0397,-261.3698,0.1084,-0.0327,-0.0001,0.0542,-0.0163,0.0009,0.9984,96,1,30000 );
            // this.camera.unserialize( 142.4839,-117.4449,0,1.0874,-0.1255,0,0.5163,-0.0537,0.0325,0.8541,96,1,30000 );
        },

        {
            
            start: function() {
                
                bg.visible = false;

                floor.reset();
                floor.colorHigh = Pair.maleColors.next();
                floor.colorLow = Pair.maleColors.next();
                Renderer.setClearColor( floor.colorHigh, 1 );
                floor.position.x = 0;
                this.container.add( floor );

                for ( var i = 0; i < PairPool.size * 0.15; i++ ) {
                    var pair = this.next();
                    pair.position.y = random( 200, 1000 );
                    pair.position.x = random.range( 600 );
                    pair.position.z = random( -1000 );
                    pair.male.visible = true;
                    pair.male.position.z = 0;
                    this.timeline.to( pair.position, Time.bars( pair.position.y / 70 ), { y: 0, ease: Bounce.easeOut }, Time.beats( random( 4 ) ) );
                    var spin = this.behavior( SpinBehavior );
                    spin.target = pair;
                    spin.start();
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                }
                
                for ( var i = 0; i < PairPool.size * 0.2; i++ ) {
                    var pair = this.next();
                    pair.position.y = random( 200, 2100 );
                    pair.position.x = random.range( 5000 );
                    pair.position.z = random( -1000, -6000 );
                    pair.male.visible = true;
                    pair.male.position.z = 0;
                    this.timeline.to( pair.position, Time.bars( pair.position.y / 150 ), { y: 0, ease: Bounce.easeOut }, Time.beats( random( 4 ) ) );
                    var spin = this.behavior( SpinBehavior );
                    spin.target = pair;
                    spin.start();
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                }
                
            },

            update: function() {
                this.camera.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * 200;
                floor.time.y += 0.001;
                this.camera.position.y = 100 + ( noise( this.now / 10, 1 ) - 0.5 ) * 400;
            } 

        } 

    );
        
} )( this );
