;( function( scope ) {

    var position = new THREE.Vector3();
    var rotation = new THREE.Euler();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3( 1, 1, 1 );
    
    var Group = Composition( 
        THREE.Object3D,
        {
            reset: function() {
                
                this.visible = true;

                this.matrixAutoUpdate = true;
                this.matrixWorldNeedsUpdate = false;
                
                this.castShadow = false;
                this.receiveShadow = false;
                this.frustumCulled = true;
                
                this.position.copy( position );
                this.rotation.copy( rotation );
                
                this.quaternion.copy( quaternion );
                
                this.scale.copy( scale );

                this.up.copy( THREE.Object3D.DefaultUp );

                if ( this.parent ) {
                    this.parent.remove( this );
                }

            },
            toWorld: function() {
            
                Scene.updateMatrixWorld();
                if ( this.parent ) {
                    this.parent.updateMatrixWorld();
                }
                this.updateMatrixWorld();

                this.position.copy( this.getWorldPosition() );
                this.quaternion.copy( this.getWorldQuaternion() );
                this.scale.copy( this.getWorldScale() );
                if ( this.parent ) {
                    this.parent.remove( this );
                    Scene.add( this );
                }
                
            } 
        }
    );

    var Child = Composition( Group );

    scope.Group = Group;
    scope.Child = Child;

} )( this );