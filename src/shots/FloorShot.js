;( function( scope ) {
    
    var vec = new THREE.Vector3();
    var box = new THREE.Box3();
    var quat = new THREE.Quaternion();

    scope.FloorShot = Composition( 

        PairShot,

        function() {

            this.camera.position.y = 3;
            this.camera.position.z = 425;
            this.camera.rotation.z = 0.075;
            // this.camera.lookAt( Scene.position );

            this.top = 2000;
            this.bottom = -9000;

        },

        {
            
            start: function() {

                this.pairs = this.getPct( 1 / 4 );


                bg.visible = false;
                Renderer.setClearColor( 0xffffff, 1 );

                floor.reset();
                floor.colorHigh = 0xffffff;
                floor.noiseScale = 10;
                floor.colorLow = 0xeeeeee;
                this.container.add( floor );

                floor.position.y = this.bottom;

                this.planetPairs = this.getPct( 1 / 8 );

                this.planetPairs.forEach( function( p, i ) {
                    var j = i / this.planetPairs.length;
                    var d = lerp( 400, 0, j );
                    var a = j * Math.PI * 6 + random( 0.5 ) * random.sign();

                    // p.position.set( random.range(), random.range(), random.range() );
                    p.position.y = lerp( this.top - 500, this.bottom + 1000, i / this.planetPairs.length );
                    p.position.x = this.camera.position.x + Math.cos( a ) * d;
                    p.position.z = this.camera.position.z + Math.sin(  a ) * d - 600;
                    this.container.add( p );

                    p.female.visible =  i % 2 === 0;
                    p.male.visible = !p.female.visible;
                    p.male.position.set( 0, 0, 0 );

                    var s = random( 1, 2 );
                    p.scale.set( s, s, s );

                }, this );


                this.pairs.forEach( function( p, i ) {

                    // if ( i % 2 === 0 ) {
                    //     p.female.visible = false;
                    //     p.male.position.set( 0, 0, 0 );
                    // } else {
                    //     p.male.visible = false;
                    //     // p.female.rotation.y = Math.PI * 2 * random();
                    // }

                    p.male.visible = true;
                    p.male.position.set( 0, 0, 0 );
                    p.matrixAutoUpdate = false;
                    p.straightenFemale();
                    p.rotation.reorder('YXZ');
                    // p.rotation.x -= Math.PI / 2;
                    // p.rotation.y += random.angle();
                    // p.rotation.x = random( Math.PI * 2 );
                    // var i = Math.round( random.range() );
                    // if ( i === -1 ) {
                    //     p.rotation.x = Math.PI / 2;
                    // } else if ( i === 1 ) {
                    //     p.rotation.x = -Math.PI / 2;
                    // }


                    p.position.set( random.range( 500 ), 0, random( 0, -1000 ) );
                    p.position.setLength( Math.pow( random(), 0.5 ) * 1500 + 100 )
                    p.position.x += this.camera.position.x;
                    p.position.z += this.camera.position.z;
                    p.position.y = this.bottom;
                    p.updateMatrix();

                }, this );

                // this.hero = this.next();
                // this.hero.straightenFemale();
                // this.hero.male.position.z = 1200;
                // this.hero.male.visible = true;
                // this.hero.male.position.set( 0, 0, 0 );
                // // this.hero.male.rotation.z += random.range( PI / 16, PI / 8 );
                // this.hero.male.rotation.y += random.range( PI / 16, PI / 8 );
                // this.hero.male.rotation.z += random.range( PI / 16, PI / 8 );
                // this.hero.position.z = 240;
                // this.hero.rotation.reorder( 'YXZ' );
                // this.hero.rotation.y += Math.PI / 1.8
                // this.hero.position.x = -30;
                // this.hero.position.y = -20;

                // box.setFromObject( this.hero.female );

                // // this.hero.female.position.y += ( box.max.y - box.min.y );
                // // this.hero.female.position.z += ( box.max.x - box.min.x ) / 2;

                // this.hero.male.position.y = this.hero.female.position.y;
                // this.hero.rotation.reorder( 'ZXY' );

                // var b = 1.75.beats;//2.0beats;

                this.timeline.fromTo( this.camera.position, 2.0.beats, { y: this.top }, { y: this.bottom, ease: Quad.easeIn }, 0 );
                this.timeline.to( this.camera.position, 1.75.div, { y: this.bottom + 20, ease: Quad.easeOut }, 2.0.beats );

                // this.timeline.$( 2.0.beats + b, 0.75.beats, this.hero.male.position, { z: 4 } );
                // this.timeline.$( 2.75.beats + b, Group.prototype.toWorld, this.hero.male );
                // this.timeline.fromTo( this.hero.male.scale, 2.5.beats, { z: 0.01 }, { z: 1, ease: Elastic.easeOut }, 2.75.beats + b );
                // this.timeline.to( this.hero.rotation, 1.1.beats, { z: PI / 7, ease: Expo.easeOut }, 2.75.beats + b );
                // this.timeline.to( this.hero.rotation, 0.375.beats, { z: 0, ease: Bounce.easeOut }, 4.0.beats + b );
                // this.timeline.to( this.hero.position, 1.9.beats, { x: -75, ease: Expo.easeOut }, 2.75.beats + b );
                // this.timeline.$( 2.75.beats + b, 0.25.beats, this.hero.male.position, { y: 55, ease: Expo.easeOut } );
                // this.timeline.$( 3.00.beats + b, 0.35.beats, this.hero.male.position, { y: 40 } );
                // this.timeline.$( 2.75.beats + b, 1.5.beats, this.hero.male.position, { x: 60, z: 250 } );
                // this.timeline.$( 2.75.beats + b, 1.5.beats, this.hero.male.rotation, { z: TWO_PI, y: random.range( PI, PI * 2 ) } );
                // this.timeline.$( 3.35.beats + b, 0.5.beats, this.hero.male.position, { y: -90, ease: Expo.easeIn } );

                // this.timeline.$( 2.75.beats, Group.prototype.toWorld, this.hero.male );
                // this.timeline.$( 2.75.beats, 0.4.beats, this.hero.male.position, { x: 0, y: 30, z: 230, ease: Expo.easeOut } );
                // this.timeline.$( 2.75.beats, 0.4.beats, this.hero.male.rotation, { y: rot.y / 2, z: rot.z / 2, ease: Expo.easeOut } );

                // this.timeline.$( 3.15.beats, 0.3.beats, this.hero.male.position, { x: 60, y: -10, z: 250, ease: Expo.easeIn } );
                // this.timeline.$( 3.15.beats, 0.3.beats, this.hero.male.rotation, { y: rot.y, z: rot.z, ease: Expo.easeIn } );


                Scene.camera.thetaRange = TWO_PI / 10;
                Scene.camera.phiRange = PI / 4;

            },

            update: function() {



            }

        } 

    );
        
} )( this );
