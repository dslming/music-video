var StretchAppear = Composition( 
    
    Behavior,

    function() {
    
        this.duration = Time.seconds( 0.6, 3 );
        this.amplitude = 1;
        this.amplitude2 = random( 3, 4 );
        this.period = 0.25 * this.duration;
        this.period2 = 0.5 * this.duration;
        this.p3 = this.period / TWO_PI * ( Math.asin( 1 / this.amplitude ) || 0 );
        this.p32 = this.period2 / TWO_PI * ( Math.asin( 1 / this.amplitude2 ) || 0 );
        this.scale = 1;
    },

    {
        start: function() {
            this.target.visible = true;
            this.xPhased = random.chance();
        },
        update: function() {
            var t = clamp( this.now / this.duration, 0, 1 ) ;
            var s1 = this.ease1( t ) || 0.000001;
            var s2 = this.ease2( t ) || 0.000001;
            s1 *= this.scale;
            s2 *= this.scale;
            if ( this.xPhased ) {
                this.target.scale.set( s2, s1, 1 ) ;
            } else { 
                this.target.scale.set( s1, s2, 1 ) ;
            }
        },
        stop: function() {
            this.target.scale.set( this.scale, this.scale, this.scale );
        },
        ease1: function( t ) {
            return this.amplitude * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p3 ) * TWO_PI / this.period ) + 1;
        },
        ease2: function( t ) {
            return this.amplitude2 * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p32 ) * TWO_PI / this.period2 ) + 1;
        } 
    }

)