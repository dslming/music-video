;( function() {
    
    var transforms = {

        translate: function( x, y, z ) {
            return 'translate(' + x + 'px,' + y + 'px, ' + ( z || 0 ) + 'px )';
        },

        scale: function( x, y ) {
            return 'scale( ' + x + ', ' + y + ' )';
        },

        rotate: function( rad ) {
            return 'rotate( ' + rad + 'rad )';
        }

    }

} )();

var css = {

    vendorPrefix: '-webkit-', // todo

    transform: function() {
    
        var el = arguments[ 0 ];

        var args = Array.prototype.split( arguments, 1 );

        var transformStrings = [];
        
        var currentArgs = [];
        var currentTransform;

        args.forEach( function( arg ) {
        
            if ( _.isString( arg ) ) {

                if ( currentTransform ) {
                    apply();
                }

                currentTransform = transforms[ arg ];

            } else {

                currentArgs.push( a );

            }
            
        } );

        if ( currentArgs.length ) {
            apply();
        }

        function apply() {
            transformStrings.push( currentTransform.apply( this, currentArgs ) );
            currentArgs.length = 0;
        } 

        var transformProperty = css.vendorPrefix + 'transform';

        el.style[ transformProperty ] = transformStrings.join( ' ' );

    }

}