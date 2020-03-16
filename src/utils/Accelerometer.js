;( function( scope ) {
    
    Bootstrap.on( 'init', init );
    Bootstrap.on( 'done', done );

    scope.Accelerometer = Singleton( 
    
        Events,
        
        {

            orientation: 0,

            gamma: 0,
            beta: 0,
            alpha: 0,

            on: function( e, fnc, ctx ) { 
                e === 'change' && changePromise.then( fnc );
            }

        }

    );

    var changePromise = new Promise();

    function init() {
        window.addEventListener( 'orientationchange', triggerChange, false );
        window.addEventListener( 'deviceorientation', triggerChange, false );
        Accelerometer.on( 'change', onChange );
    } 

    function done() {
        triggerChange();
    } 
    
    function onChange( e ) {
        if ( e ) {
            Accelerometer.alpha = ( e.alpha || 0 ).deg;
            Accelerometer.gamma = ( e.gamma || 0 ).deg;
            Accelerometer.beta = ( e.beta || 0 ).deg;
        }
        Accelerometer.orientation = getOrientation();


        changePromise.resolve();
    }

    function triggerChange( e ) {
        Accelerometer.trigger( 'change', e );
    }

    function getOrientation() {

        if ( _.isNumber( window.orientation ) ) {
            return window.orientation.deg;
        }

        var orientation;

        if ( _.isString( screen.orientation ) ) {
            orientation = screen.orientation;
        } else if ( screen.orientation ) {
            orientation = screen.orientation.type;
        } else if ( screen.mozOrientation ) {
            orientation = screen.mozOrientation;
        } else { 
            return 0;
        }

        switch ( orientation ) {
            case 'landscape-primary':
                return 90.0.deg;
            case 'landscape-secondary':
                return -90.0.deg;
            case 'portrait-secondary':
                return 180.0.deg;
            case 'portrait-primary':
                return 0;
        }

    }


} )( this );