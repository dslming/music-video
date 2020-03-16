// returns a throttled function that will only run until
// at least min millseconds have elapsed since it's creation

// will only run once if invoked multiple times

// useful when you have to wait for an animation to finish

function throttled( fnc, min ) {
    
    var disabled = true, called;

    setTimeout( function() {
        disabled = false;
        if ( called ) {
            fnc.apply( this, called );
        }
    }, min );

    return function() {
        if ( !disabled && !called ) {
            fnc.apply( this, _.toArray( arguments ) );
        } else {
            called = _.toArray( arguments );
        }
    }

}