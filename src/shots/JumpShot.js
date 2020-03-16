;( function( scope ) {
    
    scope.JumpShot = Composition( 

        PairShot,

        function() {

            this.camera.position.z = 100;
            this.camera.distance = this.camera.position.z;
            this.count = 2;
            this.jumpIndex = 0;
            this.insertIndex = 0;
            this.colorIndex = 0;
            this.scale = 1;

        },

        {
            
            start: function() {

                bg.position.y = 0;
                bg.updateMatrix();
                this.camera.add( bg );

                if ( this.useTitle ) {
                    dennisTitle.position.set( 0, 0, -530 );
                    dennisTitle.scale.set( 1, 1, 1 );
                    dennisTitle.material.color = new THREE.Color( 0xffffff );
                    this.container.add( dennisTitle );
                    this.camera.thetaRange = 0;
                    this.camera.phiRange = 0;
                }

                var slice = this.camera.frustumSlice();
                var x = slice.width / ( this.count );
                this.pairs = this.get( this.count )
                this.pairs.forEach( function( p, i ) {
                    p.position.x = map( i + 1, 0, this.count + 1, -slice.width / 2, slice.width / 2 ) ;
                    p.position.y = -300;
                    p.scale.set( this.scale, this.scale, this.scale );
                    p.rotation.x = random.range( 0.2, 0.4 );
                }, this );
                bg.solid( 0 );
            },

            jump: function() {
            
                var pair = this.pairs[ this.jumpIndex % this.pairs.length ];
                this.jumpIndex++;
                var slice = this.camera.frustumSlice();
                this.timeline.add( pair.jump( random( slice.height / 8 ) ), this.now );

            },

            color: function() {
                // bg.colorLow = this.pairs[ this.colorIndex % this.pairs.length ].colorMale.getHex();
                // bg.colorHigh = bg.colorLow;
                bg.solid( this.pairs[ this.colorIndex % this.pairs.length ].colorMale );
                this.colorIndex++;
            },

            insert: function() {

                var pair = this.pairs[ this.insertIndex % this.pairs.length ];
                this.insertIndex++;

                var speed = 1.6;

                this.timeline.add( pair.insert( speed ), this.now );
                // this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], this.now - )

            },

            update: function() {

            }

        } 

    );
        
} )( this );
