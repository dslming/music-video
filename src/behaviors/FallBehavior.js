
var FallBehavior = Composition( 
    Behavior,
    function() {

        var s = random( 0.8, 1 );
        this.s = s;

        this.origin = new THREE.Vector3(); 
        this.magnitude = 1;
        this.rx = random.range( PI ) * 0.1;
        this.ry = random.range( PI ) * s * 0.1;
        this.rz = random.range( PI ) * 0.1;
    },
    {
        start: function() {
            this.origin.copy( this.target.position );
        },
        update: function() {
            this.target.position.y = this.origin.y + - 700 * this.s * ( this.now * this.now ) * this.magnitude;
            this.target.rotation.x = this.now * this.rx - Math.PI / 2;
            this.target.rotation.y = this.now * this.ry;
            this.target.rotation.z = this.now * this.rz;
        } 
    } 
)
