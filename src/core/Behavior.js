var Behavior = Composition( 

    Events,

    function() {

        this.active = false;
        this.paused = false;
        this.now = 0;

    },

    {
        _update: function() {


            this.now = Player.now - this.in;
            if ( this.duration !== undefined && this.now > this.duration ) {
                return this.stop();
            }
            this.frames++;
            this.update();
        },

        _on: function() {
            Loop.on( 'update', this._update, this );
        },

        _off: function() {
            Loop.off( 'update', this._update, this );
        },

        update: function() {},

        start: function() {
            
            if ( this.active ) {
                this.in = undefined;
                this.out = undefined;
                this.stop();
            }
            
            if ( this.in === undefined ) {
                this.in = Player.now;
            }

            if ( this.out !== undefined ) {
                this.duration = this.out - this.in;
            } else if ( this.duration !== undefined ) {
                this.out = this.in + this.duration;
            }

            this.active = true;
            this.frames = 0;
            this.now = 0;
            this._on();
            this.trigger( 'start' );

        },
        
        pause: function() {
            if ( !this.active || this.paused ) return;  
            this.paused = true;
            this._off();
            this.trigger( 'pause' );
        },

        resume: function() {
            if ( !this.active || !this.paused ) return;
            this.paused = false;
            this._on();
            this.trigger( 'resume' );
        }, 

        stop: function() {
            if ( !this.active ) return;
            this.active = false;
            this.paused = false;
            this._off();
            this.trigger( 'stop' );
        }

    } 

);