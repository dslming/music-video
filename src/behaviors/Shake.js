;( function( scope ) { 

    var vector = new THREE.Vector3();

    scope.Shake = Composition( 
        
        Behavior,

        function() {
            this.magnitude = new THREE.Vector3( 0, 2, 0 );
            this.origin = new THREE.Vector3();
            this.duration = Time.beats( 0.25 );
            this.dir = 1;
        },

        {
            start: function() {
                // this.origin.copy( this.target.position );
            },
            update: function() {

                vector.copy( this.magnitude );
                vector.multiplyScalar( this.dir * Easing.Exponential.Out( this.now / this.duration ) );
                // this.target.position.add( vector );
                // this.dir *= -1;

                // this.target.position.copy( this.origin );
                // this.target.position.x += this.magnitude.x * this.dir;
                // this.target.position.y += this.magnitude.y * this.dir;
                // this.target.position.z += this.magnitude.z * this.dir;
                // this.dir *= -1;
            },
            stop: function() {
                // this.target.position.copy( this.origin );
            } 
        }

    );

} )( this );