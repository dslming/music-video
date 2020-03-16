var Vector = Composition( 
    THREE.Vector3,
    {
        set: function( x ) {
            if ( !arguments.length ) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            return this;
        },
        randomize: function( len ) {
            this.x = random.range( 1 );
            this.y = random.range( 1 );
            this.z = random.range( 1 );
            this.normalize();
            this.setLength( len );
            return this;
        }
    } 
);

Vector.temp = new Vector();