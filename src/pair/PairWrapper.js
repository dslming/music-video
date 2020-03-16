var PairWrapper = Composition( 
    Group, 
    function( pair ) {
        this.pair = pair;
        this.add( pair );
    }
);