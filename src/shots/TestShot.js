;( function( scope ) {
    
    scope.TestShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 200;
            this.camera.position.x = 5 * 50 / 2;
            this.camera.position.y = 3 * 50 / 2;
        },

        {
            
            start: function() {


                for ( var i = 0; i < 24; i++ ) { 
                    var pair = this.next();
                    pair.position.x = i % 6 * 50;
                    pair.position.y = ~~( i / 6 ) * 50;
                    pair.male.visible = i % 2 === 0;
                    pair.male.position.set( 0, 0, 0 );
                }

                // this.pair1.male.visible = true;
                // this.pair1.male.position.set( 0, 0, 0 );
                // this.pair2 = this.next();

            },

            update: function() {
                // var s = Math.sin( Date.now() * 0.0005 );
                // this.pair1.rotation.x += 0.01;
                // this.pair1.rotation.x += 0.01;
                // this.pair1.position.x = s * 50;

                // this.pair1.sparkle = s * 0.5 + 0.5;

            } 

        } 

    );
        
} )( this );
