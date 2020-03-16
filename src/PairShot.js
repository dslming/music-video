;( function( scope ) {

    scope.PairShot = Composition(

        Shot,

        function() {
            this.checkedOut = {};
        },

        {
            getPct: function( pct, req ) {
                return this.get( ~~( PairPool.size * pct ), req );
            },
            get: function( count, req ) {
                var pairs = [];
                for ( var i = 0; i < count; i++ ) {
                    pairs.push( this.next( req ) );
                }
                return pairs;
            },
            next: function( req ) {
                var pair = PairPool.next( req );
                this.checkedOut[ pair.id ] = pair;
                pair.reset();
                this.container.add( pair );
                return pair;
            },
            stop: function() {
                for ( var id in this.checkedOut ) {
                    var pair = this.checkedOut[ id ];
                    PairPool.return( pair );
                    pair.reset();
                    delete this.checkedOut[ pair.id ];
                }
            },
            start: function() {
                // floor.reset();
                // bg.reset();
                // Pair.setFogDistance( Pair.DefaultFogDistance );
                // bg.updateMatrix();
                // // floor.visible = false;
                // console.log( 'PairShot Start' );
            },
            update: function() {
                // console.log( _.filter( this.checkedOut, function( p ) {return p.strokeVisible} ).length );
                // _.each( this.checkedOut, function( pair ) {
                //     var dist = pair.position.distanceToSquared( Scene.camera.passenger.position );
                //     if ( dist > Pair.maxStrokeDistanceSquared / Math.pow( Scene.camera.fov * 200, 2 ) ) {
                //         pair.hideStroke();
                //     } else { 
                //         pair.showStroke();
                //     }
                // } );
            } 
        }

    );

} )( this );