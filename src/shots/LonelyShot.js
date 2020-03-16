;( function( scope ) {
    
    scope.LonelyShot = Composition( 

        PairShot,

        function() {
        },

        {
            
            start: function() {
                var z = random( TWO_PI );
                this.pair = this.next();
                this.pair.scale.setLength( 1.0 );
                this.timeline.fromTo( this.pair.position, 12.0.beats, { x: -100 }, { x: 40 }, 0 );
                this.timeline.fromTo( this.pair.rotation, 12.0.beats, { z: z }, { z: z + random( PI / 4, PI / 2 ) * random.sign() }, 0 );

            },

            update: function() {
            } 

        } 

    );
        
} )( this );

