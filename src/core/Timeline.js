;( function( scope ) {

    scope.Timeline = Composition( 

        TimelineLite,

        function() {

            this.timeScale( Time.seconds( 1 ) );

        },

        {

            /*

            // call
            timeline.$( time, function, context, param1, param2.. )

            // add
            timeline.$( time, timeline );
            timeline.$( time, tween );

            // set
            timeline.$( time, target, toObj );
            timeline.$( time, target, prop, toVal );

            // to
            timeline.$( time, duration, target, toObj, easing );
            timeline.$( time, duration, target, prop, toVal, easing );

            // fromTo
            timeline.$( time, duration, target, fromObj, toObj, easing );
            timeline.$( time, duration, target, prop, fromVal, toVal, easing ); 

            ------------------------------- */

            '$': function( $1, $2, $3, $4, $5, $6, $7 ) {
                                
                var args = _.toArray( arguments );

                $1 = Math.max( 0, $1 );

                // set
                if ( _.isObject( $3 ) && !_.isFunction( $2 ) && args.length == 3 ) {
                    return this.set( $2, $3, $1 );
                }

                // set
                if ( _.isString( $3 ) ) { 
                    var obj = {};
                    obj[ $3 ] = $4;
                    return this.set( $2, obj, $1 );   
                }

                // call
                if ( _.isFunction( $2 ) ) {
                    return this.call( $2, args.slice( 3 ), $3, $1 );
                }

                // nest
                if ( $2.instanceof && $2.instanceof( Timeline ) || $2 instanceof TimelineLite || $2 instanceof TweenLite ) {
                    return this.add( $2, $1 );
                }

                // tweens
                if ( _.isNumber( $2 ) ) {

                    // to

                    if ( _.isObject( $4 ) && ( _.isFunction( $5 ) || $5 === undefined ) ) {
                        $4.ease = $4.ease || $5 || Linear.easeNone;
                        return this.to( $3, $2, $4, $1 );
                    }

                    if ( _.isString( $4 ) && _.isNumber( $5 ) && !_.isNumber( $6 ) ) {
                        var obj = { ease: $6 || Linear.easeNone };
                        obj[ $4 ] = $5;
                        return this.to( $3, $2, obj, $1 );
                    }

                    // fromTo

                    if ( _.isObject( $4 ) && _.isObject( $5 ) ) {
                        $5.ease = $5.ease || $6 || Linear.easeNone;
                        $5.immediateRender = $5.immediateRender || false;
                        return this.fromTo( $3, $2, $4, $5, $1 );
                    }

                    if ( _.isString( $4 ) && _.isNumber( $5 ) && _.isNumber( $6 ) ) {
                        $6.ease = $6.ease || $7 || Linear.easeNone;
                        $6.immediateRender = $6.immediateRender || false;
                        return this.fromTo( $3, $2, $4, $5, $1 );
                    }


                }

            } 

        }

    );

} )( this );