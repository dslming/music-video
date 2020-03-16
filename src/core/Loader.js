var Loader = {

    el: document.querySelector( '#loader' ),
    elProgress: document.querySelector( '#loader-progress' ),

    pct: 0,
    t: 0,
    loading: false,

    progress: function( pct, loaded, count ) {
        Loader.pct = pct;
    },

    start: function() {
        Loader.el.classList.add( 'started' );
        Loader.el.classList.add( 'loading' );
        Loader.elProgress.style.transform = 'matrix(1, 0, 0, 0, 0, 0)';
        Loader.loading = true;
        setTimeout( Loader.update, 1500 );
    },

    update: function() {
        if ( !Loader.loading ) return;
        Loader.animationFrame = requestAnimationFrame( Loader.update );
        var y = 427.5;
        Loader.t += ( Loader.pct - Loader.t ) * 0.1;
        Loader.elProgress.style.transform = 'matrix(1, 0, 0, ' + Loader.t + ', 0, ' + ( y - Loader.t * y ) + ')';  
    },

    finish: function() {
        Loader.loading = false;
        Loader.el.classList.add( 'finished' );
        cancelAnimationFrame( Loader.update );
    },

    error: function() {
        
    }

};