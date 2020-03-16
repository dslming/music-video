;( function( scope ) {
    
    scope.HonkBehavior = Composition( 
        
        Behavior, 

        function() {
            this.origin = new THREE.Vector3();
            this.amplitude = 10;
            this.cameraScale = true;
        },

        {
            start: function() {
            
                this.origin.copy( this.target.scale );
                this.target.strokeInflate( 1 );

                
            },
            update: function() {
            
                var amplitude = this.amplitude * ( this.cameraScale ? Scene.camera.position.length() * 0.00035 : 1 );

                this.target.scale.copy( this.origin );


                this.target.scale.x += Volumes[ 'dennis bballstab' ].at() * amplitude;
                this.target.scale.y += Volumes[ 'dennis bballstab' ].at() * amplitude;
                this.target.scale.z += Volumes[ 'dennis bballstab' ].at() * amplitude;



            },

            stop: function() {
            
                this.target.scale.copy( this.origin );
                
            }
        }

    );

} )( this );