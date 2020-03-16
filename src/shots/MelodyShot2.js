;( function( scope ) {
    
    scope.MelodyShot2 = Composition( 

        PairShot,

        function() {

            this.camera.unserialize( 3527.0987, 1790.2596, 2178.8685, -0.2575, -0.0234, -0.1249, -0.1274, -0.0196, -0.0634, 0.9896, 97.9, 1, 30000 );

            this.divisionScale = 60;
            this.intervalScale = 15;

            this.melody = [ 5, null, null, null, 
                            7, null, null, null, 
                            5, null, null, null, 
                            7, null, null, null, 
                            5, null, null, null,
                            null, 0, 1, 4, null, 3, null, 1, null, 0 ];

            this.container.scale.setLength( 15 );
            this.container.position.y = 1200;

        },

        {
            
            start: function() {
                
                bg.reset();
                this.camera.add( bg );
                
                
                this.melody.forEach( function( interval, div ) { 

                    if ( interval === null ) return;

                    div /= 2;

                    var pair = this.next();

                    pair.sparkle = 1;                
                    this.position( pair.position, interval, div );

                    pair.rotation.reorder( 'YXZ' );

                    pair.rotation.x = random.range( QUARTER_PI, HALF_PI );

                    pair.rotation.y = -HALF_PI;
                    pair.male.position.z = 1500;
                    pair.male.visible = false;

                    this.timeline.add( pair.insert( 1.3 ), Time.div( div - 0.15 ) - 0.4 + this.offset );
                    this.timeline.$( div.div * 0.25, div.div * 0.6, pair.position, { y: pair.position.y + 800 }, 
                        { y: pair.position.y, ease: Expo.easeOut, immediateRender: true } );

                }, this );
                
                this.update();


            },

            position: function( vector, interval, div ) {
                
                vector.x = div * this.divisionScale;
                vector.y = interval * this.intervalScale;

                return vector;

            },

            update: function() {

                // this.camera.position.x = ( Time.to.div( this.now ) - Time.beats( 3 ) ) * this.divisionScale;

            }

        } 

    );
        
} )( this );
