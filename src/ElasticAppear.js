var ElasticAppear = Composition( 
    
    Behavior,

    function() {
    
        this.duration = Time.seconds( 0.1 );
        this.amplitude = 1;
        this.period = 1;
        this.p3 = this.period / TWO_PI * ( Math.asin( 1 / this.amplitude ) || 0 );
        this.scale = 1;
    },

    {
        start: function() {
            this.target.visible = true;
        },
        update: function() {
            var t = clamp( this.now / this.duration, 0, 1 ) ;
            var s = this.ease( t ) || 0.000001;
            s *= this.scale;
            this.target.scale.set( s, s, s ) ;
        },
        stop: function() {
            this.target.scale.set( this.scale, this.scale, this.scale );
        },
        ease: function( t ) {
            return this.amplitude * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p3 ) * TWO_PI / this.period ) + 1;
        } 
    }

)