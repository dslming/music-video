;( function( scope ) {
    
    scope.MelodyShot1 = Composition( 

        PairShot,

        function() {

            this.camera.position.z = 225;
            this.camera.distance = this.camera.position.z;
            this.camera.position.y = 30;

            this.divisionScale = 60;
            this.intervalScale = 15;

            this.melody = [ 5, null, 7, null, null/*bend*/, null, 0, -2, 0, null, -2, null, -2, null, 0, null, 2, 5, null/*lob*/ ];

        },

        {
            
            start: function() {

                bg.reset();
                this.camera.add( bg );
                bg.visible = true;
                bg.randomize();

                bg.colorHigh = Pair.maleColors.next();
                bg.colorLow = Pair.maleColors.next();
                bg.noiseScale = 2.5;
                this.melody.forEach( function( interval, div ) { 
                    
                    if ( interval === null ) return;

                    var pair = this.next();
                
                    this.position( pair.position, interval, div );

                    pair.rotation.reorder( 'YXZ' );

                    pair.rotation.x = random.range( QUARTER_PI, HALF_PI );

                    pair.rotation.y = -HALF_PI;
                    pair.male.position.z = 300;
                    pair.male.visible = false;

                    this.timeline.add( pair.insert( 1.3 ), Time.div( div - 0.15 ) - 0.46 + this.offset );

                }, this );
                
                // bend

                var bender = this.next();
                bender.rotation.reorder( 'YXZ' );
                bender.male.position.z = 1000;

                var intStart = 0;
                var divStart = 3.4;
                var intEnd = 2;
                var divEnd = 4;

                var start = this.position( bender.position, intStart, divStart );
                var end = this.position( {}, intEnd, divEnd );
                end.ease = Expo.easeOut;

                bender.rotation.y = -HALF_PI;
                bender.rotation.x = Math.atan2( end.y - start.y, end.x - start.x );

                this.timeline.add( bender.insert( 1.3 ), Time.div( divStart ) - 0.46 + this.offset );
                this.timeline.to( bender.position, Time.div( divEnd - divStart ), end, Time.div( divStart ) + this.offset );

                this.timeline.to( bender.scale, Time.div( divMid ), { z: 0.25, x: 1.5, y: 1.5, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.fromTo( bender.scale, Time.div( divEnd ), { z: 0.01, x: 2, y: 2 }, { z: 1, x: 1, y: 1, ease: Elastic.easeOut, immediateRender: false }, Time.div( divStart + 1 ) + this.offset );

                var lobber = this.next();
                lobber.rotation.reorder( 'YXZ' );
                lobber.male.position.z = 1000;

                var intMin = 0;
                var intMax = 7;

                var divStart = this.melody.length - 1 - 0.45;
                var divMid = 2.5;
                var divEnd = 4;

                var start = this.position( lobber.position, intMin, divStart );
                
                var mid = this.position( {}, intMax, divStart + divMid );
                mid.ease = Expo.easeOut;

                var end = this.position( {}, - 3, divStart + divEnd );
                end.ease = Expo.easeIn;

                var angle = Math.atan2( mid.y - start.y, mid.x - start.x );

                lobber.rotation.y = -HALF_PI;
                lobber.rotation.x = angle;

                this.timeline.add( lobber.insert( 1.3 ), Time.div( divStart ) - 0.46 + this.offset );

                this.timeline.to( lobber.scale, Time.div( divMid ), { z: 0.25, x: 1.5, y: 1.5, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.scale, Time.div( divEnd - divMid ), { z: 1, x: 1, y: 1, ease: Elastic.easeOut }, Time.div( divStart + divMid ) + this.offset );
                this.timeline.fromTo( lobber.scale, Time.div( divEnd ), { z: 0.01, x: 2, y: 2 }, { z: 1, x: 1, y: 1, ease: Elastic.easeOut, immediateRender: false }, Time.div( divStart + divEnd ) + this.offset );
                
                this.timeline.to( lobber.position, Time.div( divMid ), mid, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.position, Time.div( divEnd - divMid ), end, Time.div( divStart + divMid ) + this.offset );

                end.x += Time.div( 4 ) * this.divisionScale;
                this.timeline.to( lobber.position, Time.div( divEnd - divMid ), end, Time.div( divStart + divEnd ) + this.offset );

                this.timeline.to( lobber.rotation, Time.div( divMid ), { x: 0, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.rotation, Time.div( divEnd - divMid ), { x: -HALF_PI - 0.2, ease: Expo.easeIn }, Time.div( divStart + divMid ) + this.offset );
                this.timeline.to( lobber.rotation, Time.div( divEnd - divMid ), { x: -HALF_PI - 0.3, ease: Expo.easeIn }, Time.div( divStart + divEnd ) + this.offset );

                this.update();

            },

            position: function( vector, interval, div ) {
                
                vector.x = div * this.divisionScale;
                vector.y = interval * this.intervalScale;

                return vector;

            },
 
            update: function() {

                this.camera.position.x = ( Time.to.div( this.now ) - Time.beats( 3 ) ) * this.divisionScale;

            } 

        } 

    );
        
} )( this );
