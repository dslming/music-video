;( function( scope ) {
    
    scope.OutroImpactShot = Composition( 

        PairShot,

        function() {
        },

        {
            
            start: function() {

                Renderer.setClearColor( 0, 1 );

                var pair = this.next();
                this.pair = pair;

                pair.rotation.reorder( 'YXZ' );
                pair.rotation.x = random.range( QUARTER_PI / 2, HALF_PI * 0.3 );
                pair.rotation.z = random( TWO_PI );
                pair.male.position.z = 600;

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.duration = Time.div( 0.5 );
                shake.magnitude.set( 1, 5, 0 );

                this.timeline.add( pair.insert( 1.8 ), 0 );
                this.timeline.call( shake.start, [], shake, Time.div( 1.5 ) );
                this.timeline.call( Renderer.setClearColor, [ pair.colorMale ], Renderer, Time.div( 1 ) );
                this.timeline.call( Renderer.setClearColor, [ 0, 1 ], Renderer, Time.div( 1.2 ) );

                var dest = new THREE.Vector3();
                dest.copy( pair.position );

                var vel = new THREE.Vector3( 0, 0, -600 );
                vel.applyEuler( pair.rotation );
                dest.add( vel );

                this.timeline.to( pair.position, Time.div( 30 ), { x: dest.x, y: dest.y, z: dest.z }, Time.div( 1.5 ) );
                // this.timeline.to( pair.rotation, Time.div( 30 ), { x: -5 }, Time.div( 2 ) );
                this.update();



            },

            update: function() {
                this.camera.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * 100;
                this.camera.position.y = ( noise( this.now / 10, 1 ) - 0.5 ) * 100;
                // this.camera.lookAt( this.pair.position );
            } 

        } 

    );
        
} )( this );
