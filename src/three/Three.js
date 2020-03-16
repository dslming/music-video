;( function( scope ) {

    var renderer, camera;
    var recording = false;
    scope.Three = Singleton(
        
        Behavior,

        {

            recordTime: 0, 

            start: function( options ) {

                                

                scope.Renderer = new THREE.WebGLRenderer( _.extend( options || {}, { 
                    canvas: Stage.canvas, 
                    antialias: ANTIALIAS, 

                } ) );
                scope.Renderer.setPixelRatio( PIXEL_RATIO );
                scope.Scene = new THREE.Scene();

                // Make sure the camera's full ancestry is added to the scene graph
                // Associate the new camera with the controls
                
                Object.defineProperty( scope.Scene, 'camera', { 

                    get: function() {
                        return camera;
                    },

                    set: function( _camera ) {

                        var wasCamera = !!camera;

                        if ( camera ) {
                            Scene.remove( camera );
                            // _camera.passenger.rotation.set( 0, 0, 0 );
                            // _camera.passenger.quaternion.copy( camera.passenger.quaternion )
                        }

                        var parent = _camera;

                        while ( parent.parent && parent.parent !== Scene ) {
                            parent = parent.parent;
                        }

                        Scene.add( parent );

                        camera = _camera;
                        camera.updateProjectionMatrix();
                        camera.passenger.updateProjectionMatrix();

                        // if ( scope.Controls && Controls.active ) {
                        // if (Controls.object ) {
                            // Controls.stop();
                            // Controls.reset();
                        // }
                        
                        Controls.firstRun = true;
                        Controls.object = _camera;
                        Controls.element = Stage.canvas;

                        if ( Player.now > 0 ) Controls.update();

                        // if ( !HANDHELD ) {
                        // Controls.centerOffsetInstant();

                        // } else { 
                        //     var t = Controls.offsetEasing;
                        //     Controls.offsetEasing = 1;
                        //     clearTimeout( iAmABadProgrammer );
                        //     iAmABadProgrammer = setTimeout( function() {
                        //         Controls.offsetEasing = t;
                        //     }, 0 );
                        // }
                        // hack

                        // Pair.fogUniforms.far.value = _camera.far;

                    } 

                } );

                renderer = Renderer;

                Scene.camera = new Camera();
                Stage.on( 'resize', this.resize, this );

                // this.setEffect( Three.STEREO );

            },

            setEffect: function( type ) {
                renderer = type ? new THREE[ type + 'Effect' ]( Renderer ) : Renderer;
                this.resize();
                this.update();
            }, 

            record: function() {
               recording = true;
               rendercan.record( renderer.domElement ); 
            }, 
            stop: function() {
               recording = false;
               rendercan.stop(); 
            }, 

            update: function() {
                renderer.render( Scene, Scene.camera.passenger );
                if ( RECORD_MODE && recording ) { 
                    // rendercan.grab();
                    Three.recordTime += 1/30;
                    // console.log( Three.recordTime );
                }
            },

            resize: function() {
                Scene.camera.updateProjectionMatrix();
                renderer.setSize( Stage.width, Stage.height );
                renderer.setPixelRatio( PIXEL_RATIO );
                Loop.force();
            },

        } );

} )( this );