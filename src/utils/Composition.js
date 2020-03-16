function Singleton() {

    return compose( _.toArray( arguments ), {}, true );

};

function Composition() {

    var args = _.toArray( arguments );

    // The last object is assumed to be a prototype if not a function
    // If no prototype is provided it is assumed to be blank
    var proto = _.isFunction( args[ args.length - 1 ] ) ? {} : args.pop();

    return compose( args, proto, false );

};

function compose( mixins, proto, singleton ) {

    for ( var i in mixins ) {
        var m = mixins[ i ];
        if ( !(_.isFunction( m ) || _.isObject( m ) ) ) {
            throw new Error( 'Invalid mixin argument: ' + m );
        }
    }

    _mixins = mixins.slice( 0 );
    mixins  = mixins.reverse();

    // When mixing classes into a singleton, use the prototype methods as "static" methods.
    if ( singleton ) {
        mixins.forEach( function( m, i ) {
            if ( _.isFunction( m ) ) { 
                mixins[ i ] = m.prototype;
            }
        } );
    }

    var constructors = []; // Functions to call in Class's constructor
    var methods      = {}; // Functions to attach to Class's prototype.
    var statics      = {}; // Functions to attach to Class's namespace.

    // Initialize list of prototype methods with proto option
    for ( var key in proto ) {
        methods[ key ] = methods[ key ] || [];
        methods[ key ].push( proto[ key ] );
    }


    for ( var i = 0, l = mixins.length; i < l; i++ ) {

        var mixin = mixins[ i ];

        // If the mixin is a function, add its prototype methods to Class
        if ( _.isFunction( mixin ) ) {

            for ( var key in mixin.prototype ) {

                // We'll deal with the constructor later
                if ( key == 'constructor' ) {
                    continue;
                }
                
                try { 
                    // catch any potential errors in a getter ( three.js ... )
                    mixin.prototype[ key ];
                } catch ( e ) {
                    continue;
                }

                var prop = mixin.prototype[ key ];

                // We only want functions in the prototype. Nothing else can really be "mixed"
                if ( _.isFunction( prop ) ) {
                    methods[ key ] = methods[ key ] || [];
                    methods[ key ].unshift( prop );       
                }
            }

            // Call the mixin as a constructor
            constructors.unshift( mixin );

        } 

        // Copy every property "forward" in the mixin list.
        for ( var key in mixin ) {

            if ( !mixin.hasOwnProperty( key ) ) {
                continue;
            }

            if ( _.isFunction( mixin[ key ] ) ) {

                if ( key == 'constructor' ) {
                    continue;
                }

                // Static methods get merged just like prototype methods ...
                if ( statics[ key ] === undefined ) {
                    statics[ key ] = [];
                    statics[ key ].__methodList = true; // It could have been a static array ...
                }

                statics[ key ].push( mixin[ key ] );
                
            } else { 
            
                // Static properties just get passed forward
                statics[ key ] = mixin[ key ];

            }

        }

    }

    // Define a method in Class's prototype for every method mentioned in a prototype from the mixins list.
    _.each( methods, function( methodList, key ) {
        var target = singleton ? Class : Class.prototype;
        target[ key ] = composition( methodList );
    } );

    // Same goes for statics.
    _.each( statics, function( prop, key ) {
        if ( _.isArray( prop ) && prop.__methodList ) {
            Class[ key ] = composition( prop );
        } else {
            Class[ key ] = prop;
        }
    } );

    var methodNames = _.keys( methods );

    // storing arguments passed to the constructor 
    var $arguments;

    function Class() {
        
        $arguments = arguments;
        constructors.forEach( applyConstructor, this );
        methodNames.forEach( bindMethod, this );

    }

    // new "instanceof" method, checks mixed in ancestors
    Object.defineProperty( singleton ? Class : Class.prototype, 'instanceof', {
        value: function( type ) {
            if ( type === Class ) return true;
            _mixins.forEach( function( m ) {
                return m instanceof type || m === type;
            } )
        }
    } );


    // Should be taken out of this scope once execution order isn't a problem and Composition can be scoped ...

    function bindMethod( method ) { 
        this[ method ] = this[ method ].bind( this );
    }

    function applyConstructor( constructor ) {
        constructor.apply( this, $arguments );
    }
    
    // Returns a function that calls every function in an array of functions.
    function composition( methods ) {

        methods = methods.slice( 0 ).reverse();

        // remove empty functions
        methods = _.filter( methods, getFunctionBody );

        if ( methods.length === 0 ) {
        
            return function() {};
        
        } else if ( methods.length === 1 ) {
        
            return methods[ 0 ];
        
        } else if ( methods.length == 2 ) {
        
            var $0 = methods[ 0 ];
            var $1 = methods[ 1 ];
            return function() {
                this.super = $0.apply( this, arguments );
                return $1.apply( this, arguments );
            }
        
        } else if ( methods.length == 3 ) {
        
            var $0 = methods[ 0 ];
            var $1 = methods[ 1 ];
            var $2 = methods[ 2 ];
            return function() {
                this.super = $0.apply( this, arguments );
                this.super = $1.apply( this, arguments );
                return $2.apply( this, arguments );
            }
            
        }

        var last = methods.pop();
        var len = methods.length;
        var i;

        return function() {
            for ( i = 0; i < len; i++ ) {
                this.super = methods[ i ].apply( this, arguments );
            }
            return last.apply( this, arguments );
        };

    }

     

    function getFunctionBody( fnc ) { 
        var contents = fnc.toString();
        return contents.substring( contents.indexOf( '{' ) + 1, contents.lastIndexOf( '}' ) );
    }

    function getFunctionParams( fnc ) { 
        var contents = fnc.toString();
        var args = contents.substring( contents.indexOf( '(' ) + 1, contents.indexOf( ')' ) );
        if ( !args ) return [];
        return args.split( /\s*,\s*/ );
    }
    

    return Class;

}
