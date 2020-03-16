var PairJiggle = Composition( 
    ElasticAppear, 
    function() {
        this.duration = random( 0.5, 1 );
        this.amplitude = random( 1, 1.5 );
        this.period = random( 0.2 , 0.3 );
    }
);