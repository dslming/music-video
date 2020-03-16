var HandheldBehavior = Composition( 

    Behavior,

    function() {
        this.magnitude = new THREE.Vector3( 200, 200, 0 );
    },

    {
        update: function() {
            this.target.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * this.magnitude.x;
            this.target.position.y = ( noise( this.now / 10, 1 ) - 0.5 ) * this.magnitude.y;    
        }
    }

);