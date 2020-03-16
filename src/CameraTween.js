;( function( scope ) {

    scope.CameraTween = Composition( 
        
        Behavior,

        // todo: kill constructor
        function( target, duration, origin, dest, easing ) {

            this.target = target;
            this.duration = duration || 0;
            this.easing = easing || Easing.Linear.None;

            this.origin = origin;
            this.dest = dest;

            this._origin = new Camera();
            this._dest = new Camera();

        },

        {
            start: function() {

                if ( !this.origin )  {
                    this._origin.copy( this.target );
                } else { 
                    interpretArgument( this.origin, this._origin );
                }
                
                interpretArgument( this.dest, this._dest );


                if ( !this._dest ) {
                    throw new Error( 'Missing argument for Camera destination.' );
                }

                this.target.copy( this._origin );

            },
            update: function() {
                var k = clamp( this.easing( this.now / this.duration ), 0, 1 );
                this.target.quaternion.copy( this._origin.quaternion ).slerp( this._dest.quaternion, k );
                this.target.position.copy( this._origin.position ).lerp( this._dest.position, k );
                this.target.fov = lerp( this._origin.fov, this._dest.fov, k );
                this.target.updateProjectionMatrix();
            },
            stop: function() {
                this.target.copy( this._dest );
            } 
        }

    );


    function interpretArgument( target, camera ) {

        if ( target.instanceof && target.instanceof( Camera ) ) {

            camera.copy( target );    

        } else if ( target.instanceof && target.instanceof( Child ) ) { 

            camera.position.copy( target );
            camera.quaternion.copy( target );

        } else if ( _.isArray( target ) ) { 

            camera.unserialize( target );

        } else { 

            console.log( target );
            throw new Error( 'Unrecognized target type.' );

        }
    }   
    
} )( this );