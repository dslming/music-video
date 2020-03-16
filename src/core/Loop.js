;( function( scope ) {
    
    scope._Loop = Composition( 

        Events,

        function() {

            this.delta = 0;
            this.playing = false;
            this.prevNow = 0;
            this.now = 0;

            this.force = _.debounce( this.force, 0 );

        },

        {
            stop: function() {

                if ( RAF ) cancelAnimationFrame( this.request );
                else TweenLite.ticker.removeEventListener( 'tick', this.loop );
                // 
                if ( !this.playing ) return;


                this.playing = false;
                this.trigger( 'stop' );

            },

            start: function() {

                if ( this.playing ) return;

                if ( RAF ) {
                    this.request = requestAnimationFrame( this.loop );
                    console.trace( 'wtf' );
                } else {
                    TweenLite.ticker.addEventListener( 'tick', this.loop );
                }

                this.playing = true;
                this.now = this.prevNow = now();
                this.trigger( 'start' );
                this.loop();


            },

            force: function() {
                if ( !this.playing ) {
                    this.delta = 0;
                    this.trigger( 'beforeupdate' );
                    this.trigger( 'update' );
                }
            },

            loop: function () {

                if ( this.frozen ) { 
                    return;
                }
                this.prevNow = this.now;
                this.now = now();
                this.delta = this.now - this.prevNow;
                this.trigger( 'beforeupdate' );
                this.trigger( 'update' );
                
            },

        } 

    );
    
    scope.Loop = new _Loop();

    var now; 

    if ( window.performance && _.isFunction( window.performance.now ) ) {
        now = function() {
            return performance.now() * 0.001;
        }
    } else if ( _.isFunction( Date.now ) ) {
        now = function() {
            return Date.now() * 0.001;
        }
    } else { 
        now = function() {
            return new Date().getTime() * 0.001;
        }
    }

} )( this );