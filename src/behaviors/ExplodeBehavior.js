var ExplodeBehavior = Composition( 
    Behavior,
    {
        Rate: 1
    },
    function() {
        this.speed1 = new THREE.Vector3();
        this.speed2 = new THREE.Vector3();
        this.vector = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.decay = 0.5;
    },
    {
        start: function() {
            this.speed1.subVectors( this.target.getWorldPosition(), this.center );
            this.speed1.x += random.range( 1 );
            this.speed1.y += random.range( 1 );
            this.speed1.z += random.range( 1 );
            this.speed1.add( this.offset );
            this.speed2.copy( this.speed1 );
        },
        update: function() {

            this.speed1.multiplyScalar( this.decay );
            this.vector.copy( this.speed1 );
            this.vector.multiplyScalar( Player.delta * 10 * ExplodeBehavior.Rate );
            this.target.position.add( this.vector );

            this.vector.copy( this.speed2 );
            this.vector.multiplyScalar( Player.delta * 10 * ExplodeBehavior.Rate );
            this.target.position.add( this.vector );

        }
    } 
);
