var Shot = Composition(

    Behavior,

    {

        active: {},
        count: 0,

        stopAll: function() {
            for ( var id in Shot.active ) {
                Shot.active[ id ].stop();
            }  
        }

    },

    function() {
        
        this.id = Shot.count++;
        this.camera = new Camera();
        this.container = new Group();
        this.timeline = new Timeline( { paused: true } );

        this._behaviors = [];

    },

    {

        behaviors: function( count, behavior, itr, context ) {
        
            for ( var i = 0; i < count; i++ ) {
                itr.call( context, this.behavior( behavior ) );
            }

        },

        behavior: function( behavior ) {
        
            var b = new behavior();
            this._behaviors.push( b );
            return b;
            
        },

        start: function() {


            Scene.camera = this.camera;
            this.camera.start();

            this.show();

            Shot.active[ this.id ] = this;

        },

        stop: function() {

            this.camera.stop();

            for ( var i = 0, l = this._behaviors.length; i < l; i++ ) {
                this._behaviors[ i ].stop();
            }

            this._behaviors.length = 0;
            this.hide();

            delete Shot.active[ this.id ];

        },

        update: function() {
            this.timeline.time( this.now, false );
        },

        show: function() {
            Scene.add( this.container );
        },

        hide: function() {
            Scene.remove( this.container );
        }

    }

);