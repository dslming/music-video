;( function( scope ) {
    
    scope.SexyShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 80;
            this.camera.distance = this.camera.position.z;
            this.distance = 1;
            this.ry = random.sign() * ( HALF_PI - HALF_PI / 1.5 );
            this.rx = random.range( HALF_PI / 2 );
            this.camera.thetaRange = PI;
        },

        {
            
            start: function() {
                this.pair = this.next();
                this.pair.rotation.set( this.rx, this.ry, 0 );

                // bg.colorHigh = this.pair.colorMale;
                // this.pair.rotation.z = random.range( HALF_PI / 2 );
                this.pair.male.visible = true;
                this.update();
                // this.pair.visible = false;

                if ( this.credit ) {
                    this.container.add( creditNHX );
                    creditNHX.position.z = -10;
                    creditNHX.position.y = 20;
                    creditNHX.position.x = 45.5;
                    creditNHX.scale.setLength( 0.12 );
                }

                if ( this.background ) {

                    bg.visible = false;
                    Renderer.setClearColor( this.pair.colorMale, 1 );

                }

                
            },

            update: function() {


                var t = this.now / this.len;

                this.pair.male.position.z = map( t, 0, 1, 50 * this.distance, 0 );
                this.pair.male.rotation.z = map( t, 0, 0.7, HALF_PI / 3 * this.distance, 0 );

                this.pair.female.position.z = map( t, 0, 1, -50 * this.distance, 0 );
                this.pair.rotation.z = map( t, 0, 1, -HALF_PI / 3 * this.distance, 0 );

            } 

        } 

    );

} )( this );
