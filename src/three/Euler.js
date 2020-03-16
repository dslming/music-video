var Euler = Composition( 
    THREE.Euler,
    {
        randomize: function() {
            this.x = random.angle();
            this.y = random.angle();
            this.z = random.angle();
            return this;
        }
    } 
);

Euler.temp = new THREE.Euler();