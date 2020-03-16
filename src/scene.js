;( function( scope ) {

    scope.initScene = function() {
        

        Three.start( {
            antialias: false
        } );

        Renderer.setClearColor( 0xffffff, 1 );


        var geometry = new THREE.SphereGeometry( Scene.camera.far * 0.9, LITE ? 20 : 32, 12 );
        var vs = Assets( 'shaders/background.vs' );
        var fs = Assets( 'shaders/noise.glsl' ) + Assets( 'shaders/background.fs' );
        
        var vsLite = Assets( 'shaders/background-lite.vs' )
        var fsLite =  Assets( 'shaders/noise-lite.glsl' ) + Assets( 'shaders/background-lite.fs' );

        scope.bg = new Background();
        bg.init( LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry );

        var geometry = new THREE.CylinderGeometry( 3000, 3000, 0, 20 );
        
        var vs = Assets( 'shaders/floor.vs' );
        var fs = Assets( 'shaders/noise.glsl' ) + Assets( 'shaders/floor.fs' );

        var vsLite = Assets( 'shaders/floor-lite.vs' )
        var fsLite =  Assets( 'shaders/noise-lite.glsl' ) + Assets( 'shaders/floor-lite.fs' );


        console.timeEnd( 'initFloor' );

        console.timeEnd( 'initBackground' );

        scope.floor = new Background();

        floor.init( LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry );
        floor.mesh.position.y = -10;
        floor.mesh.updateMatrix();
        floor.solid( 0x027AC0 );

        console.time( 'initBackground' );

        
        scope.dennisTitle = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1024, 512 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/title.png' ), 
            transparent: true
        } ) );


        scope.creditNHX = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 256 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-nhx.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );

        scope.creditAAF = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1024, 512 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-aaf.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );

        scope.creditPopcorn = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 256 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-popcorn.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );
        

        dennisTitle.material.map.minFilter = THREE.LinearFilter;
        dennisTitle.material.map.magFilter = THREE.NearestFilter;
        
        creditNHX.material.map.minFilter = THREE.LinearFilter;
        creditNHX.material.map.magFilter = THREE.NearestFilter;

        creditAAF.material.map.minFilter = THREE.LinearFilter;
        creditAAF.material.map.magFilter = THREE.NearestFilter;

        creditPopcorn.material.map.minFilter = THREE.LinearFilter;
        creditPopcorn.material.map.magFilter = THREE.NearestFilter;


    }; 

} )( this );