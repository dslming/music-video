
var SwarmBehavior = Composition( 

    Behavior,

    {
        Rate: 1
    },

    function() {
        
        this.width = 1000;
        this.height = 1000;
        this.depth = 6500;
        this.minSpeed = 100;
        this.maxSpeed = 200;
    },

    {

        start: function() {
            this.target.female.visible = random.chance();
            this.target.male.visible = !this.target.female.visible;
            this.target.male.position.set( 0, 0, 0 );
            this.target.position.set( random( -this.width / 2, this.width / 2 ), 
                random( -this.height / 2, this.height / 2 ), 
                random( -this.depth / 2, this.depth / 2 ) 
            );
            this.speed = random( this.minSpeed, this.maxSpeed );
            this.rotationSpeed = random( 0.01, 0.2 ) * random.sign();
        },

        update: function() {
            this.target.position.z -= this.speed * SwarmBehavior.Rate;
            this.target.rotation.z += this.rotationSpeed * SwarmBehavior.Rate;
            if ( this.target.position.z < -this.depth / 2 ) {
                this.target.position.set(
                    random( -this.width / 2, this.width / 2 ), 
                    random( -this.height / 2, this.height / 2 ), 
                    this.depth / 2
                )
            }
        } 

    }

)