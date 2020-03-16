;( function( scope ) {


    var THETA_RANGE = TWO_PI;
    var PHI_RANGE = PI;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;

    var firstPerson = new THREE.Quaternion();
    var firstPersonEuler = new THREE.Euler();

    var quat = new THREE.Quaternion();

    var orientation;

    ;( function( scope ) {
        

        var deviceOrientation = {};
        var screenOrientation = 0;

        var radians = Math.PI / 180;
        var zee = new THREE.Vector3( 0, 0, 1 );
        var euler = new THREE.Euler();
        var q0 = new THREE.Quaternion();
        var q1 = new THREE.Quaternion(); // - PI/2 around the x-axis
        var q2 = new THREE.Quaternion(); // - PI/2 around the x-axis
        q1.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -PI / 2 );
        q2.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -PI / 2 );

        window.addEventListener( 'deviceorientation', onDeviceOrientation, false );
        window.addEventListener( 'orientationchange', onOrientationChange, false );
        // onOrientationChange();

        function onOrientationChange() {
            var orient = window.orientation ? window.orientation * radians : 0; // O
            orientation = orient;
            q0.setFromAxisAngle( zee, - orient )
        }

        function onDeviceOrientation( event ) {
            
            var alpha  = event.gamma ? event.alpha * radians: 0; // Z
            var beta   = event.beta  ? event.beta  * radians: 0; // X'
            var gamma  = event.gamma ? event.gamma * radians: 0; // Y''

            euler.set( gamma, beta, -alpha, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

            firstPerson.setFromEuler( euler ); // orient the device
            firstPerson.multiply( q1 ); // camera looks out the back of the device, not the top
            // firstPerson.multiply( q2 );
            firstPerson.multiply( q0 ); // adjust for screen orientation
            firstPersonEuler.setFromQuaternion( firstPerson );

        }

    } )( this );

    scope.Controls = new ( Composition(

        Behavior,

        function( object, element ) {

            this.object = object;

            this.mode = HANDHELD && ACCELEROMETER ? TILT : MOUSE;

            this.moveSpeed = 1;
            this.panSpeed = 10;
            this.rotateSpeed = 5;
            this.rollSpeed = 0.0025;
            this.fovSpeed = 0.05;

            this.offsetEasing = 1;
            this.speedMultiplier = 1;

            this.thetaRange = THETA_RANGE;
            this.phiRange = PHI_RANGE;

            this.phiOffset = 0;

            this.mouseIdle = false;
            this.mouseIdleTimeout = null;
            this.mouseIdleTimeoutLength = 8000;

            // "local"

            this.rollDirection = 0;
            this.localDirection = new THREE.Vector3();
            this.parentDirection = new THREE.Vector3();

            this.targetOffset = new THREE.Quaternion();
            this.targetOffsetAlign = new THREE.Quaternion();

            this.debugObject = makeDebugObject();

            this.firstRun = true;

            // listeners

            this.preventDefault = function( e ) { e.preventDefault() };
            this.updateUrl = _.throttle( this.updateUrl.bind( this ), 100, { leading: false, trailing: true } );
            _.bindAll( this, 'onDrag', 'onMouseWheel', 'onMouseMove', 'onMouseIdle', 'onKeyUp', 'onKeyDown', 'onAccelerometerChange' );

            // getters / setters

            function debug() {
                if ( this.mode === DEBUG ) {
                    this.updateDebugMesh();
                    this.updateUrl();
                }
            }


            Object.defineProperties( this, { 
                theta: {
                    get: function() {
                        return this.object.rotation.y;
                    }, 
                    set: function( v ) {
                        this.move( 0, 0, -this.distance );
                        this.object.rotation.y = clamp( v, -THETA_RANGE / 2, THETA_RANGE / 2 );
                        this.move( 0, 0, this.distance );
                        debug();
                    } 
                },
                phi: {
                    get: function() {
                        return this.object.rotation.x;
                    },
                    set: function( v ) {
                        this.move( 0, 0, -this.distance );
                        this.object.rotation.x = clamp( v, -PHI_RANGE / 2, PHI_RANGE / 2 );
                        this.move( 0, 0, this.distance );
                        debug();
                    }
                },
                roll: {
                    get: function() {
                        return this.object.rotation.z
                    },
                    set: function( v ) {
                        this.object.rotation.z = v;
                        this.updateDebugMesh();
                        this.updateUrl();
                    } 
                },
                distance: {
                    get: function() {
                        return this.object._targetDistance;
                    },
                    set: function( v ) {
                        if (v < 0 ) return;
                        this.move( 0, 0, v - this.object._targetDistance );
                        this.updateDebugMesh();
                        this.object._targetDistance = v;
                        this.updateUrl();
                    }
                },
                thetaRange: {
                    get: function() {
                        return this.object.thetaRange;
                    }
                },
                phiRange: {
                    get: function() {
                        return this.object.phiRange;
                    } 
                }

            } )

        },

        {
            update: function() {
                
                this.object.passenger.rotation.reorder( 'YXZ' );

                var offsetEasing;

                if ( this.mode === MOUSE ) { 
                    if ( !this.mouseIdle ) {
                        this.updateMouseOffset();
                        offsetEasing = this.offsetEasing;
                    } else { 
                        offsetEasing = 0.01;
                    }
                } else if ( !FREEZE_ACCELEROMETER ) {
                    var offset = -HALF_PI / 2;
                    if ( window.orientation === 90 ) { 
                        offset *= -1;
                    }
                    var g = cnormalize( Accelerometer.gamma + offset, -HALF_PI / 2, HALF_PI / 2 ) * 0.5 + 0.25;
                    var b = cnormalize( Accelerometer.beta, HALF_PI / 2, -HALF_PI / 2 );

                    this.setTargetOffset( b, g );
                    offsetEasing = this.firstRun ? 1 : this.offsetEasing;
                }


                this.move( 0, 0, -this.distance, true );
                this.object.passenger.quaternion.slerp( this.targetOffset, offsetEasing );
                this.move( 0, 0, this.distance, true );

                this.firstRun = false;
                
                if ( this.mode === DEBUG ) {

                    v.copy( this.localDirection );
                    v.multiplyScalar( this.moveSpeed * this.speedMultiplier );
                    this.move( v.x, v.y, v.z );

                    v.copy( this.parentDirection );
                    v.multiplyScalar( this.moveSpeed * this.speedMultiplier );
                    this.object.position.add( v );

                    if ( this.fovDirection ) {
                        this.object.fov += this.fovDirection * this.fovSpeed * this.speedMultiplier;
                        this.updateUrl();
                    }

                    if ( this.rollDirection ) {
                        this.roll += this.rollDirection * this.rollSpeed * this.speedMultiplier;
                    }

                    if ( this.localDirection.lengthSq() || this.fovDirection || this.parentDirection.lengthSq() ) {
                        this.updateUrl();
                    }

                }

            },
            move: function( x, y, z, offset ) {
                v.set( x, y, z );
                v.applyEuler( ( offset ? this.object.passenger : this.object ).rotation );
                this.object.position.add( v );
            },
            setTargetOffset: function( nx, ny ) {


                var theta = lerp( -this.thetaRange / 2, this.thetaRange / 2, nx );
                var phi = lerp( -this.phiRange / 2, this.phiRange / 2, ny );


                var invert = Stage.screenRotation === HALF_PI;


                var s = window.orientation === 90 ? -1 : 1;

                q.copy( this.object.quaternion ).conjugate();
                v.set( 0, 1, 0 );
                v.applyQuaternion( q );

                m1.identity();
                m1.multiply( m2.makeRotationAxis( v, s * theta ) );
                m1.multiply( m2.makeRotationX( s * phi )  );

                this.targetOffset.setFromRotationMatrix( m1 );

            },
            centerOffset: function() {
                mouseX = window.innerWidth / 2;
                mouseY = window.innerHeight / 2;
            }, 
            onMouseIdle: function() {
                // document.body.style.cursor = 'none';
                if ( this.mouseIdle ) return;
                this.mouseIdle = true;
                this.centerOffset();
                this.updateMouseOffset();
                // document.body.classList.add( 'cursor-none' );
            }, 
            updateMouseOffset: function() {
               var nx = cnormalize( mouseX, Stage.right, Stage.left ) * 0.5 + 0.25;
               var ny = cnormalize( mouseY, Stage.bottom, Stage.top ) * 0.5 + 0.25;
               this.setTargetOffset( nx, ny ); 
            }, 
            centerOffsetInstant: function() {
                this.targetOffset.set( 0, 0, 0, 1 );
                this.object.passenger.quaternion.copy( this.targetOffset );
                this.object.quaternion.copy( this.targetOffset );
            }, 
            onAccelerometerChange: function() {

                // var g = cnormalize( firstPersonEuler.x, 0, PI );
                // var b = cnormalize( firstPersonEuler.z, 0, PI );
                // console.log( firstPersonEuler.x, x, g );
                // console.log( firstPersonEuler.y, b );
                // this.setTargetOffset( b, g );
                // this.targetOffset.setFromEuler( firstPersonEuler );

            },
            onMouseMove: function( e ) {
                if ( this.mouseIdle ) {
                    // document.body.classList.remove( 'cursor-none' );
                    // console.trace( 'mousemove' );
                }
                clearTimeout( this.mouseIdleTimeout );
                this.mouseIdleTimeout = setTimeout( this.onMouseIdle, this.mouseIdleTimeoutLength );
                this.mouseIdle = false;
                this.mouse( e.clientX, e.clientY );
            },
            mouse: function( _mx, _my ) {
                mouseX = _mx;
                mouseY = _my;
                this.offsetEasing = MOUSE_EASING;
            }, 
            easeCircularOutIn: function( x ) {
                var k = 2 * clamp( x, 0, 1 ) - 1, k2 = k * k;
                if ( x < 0.5 ) {
                    return 0.5 * Math.sqrt( 1 - k2 );
                }
                return -0.5 * Math.sqrt( 1 - k2 ) + 1;
            }, 
            onMouseWheel: function( e ) {
                this.distance -= e.wheelDelta * 0.03 * this.speedMultiplier;
                _.defer( this.updateDebugMesh.bind( this ) );
            },
            onMouseOut: function( e ) {
                e = e ? e : window.event;
                var from = e.relatedTarget || e.toElement;
                if (!from || from.nodeName == "HTML") {
                    this.offsetEasing = 0.01;
                    this.centerOffset();
                    // stop your drag event here
                    // for now we can just use an alert
                }

            },
            onDrag: function( e ) {

                if ( e.srcEvent.button == 0 ) {
                    this.theta -= 2 * Math.PI * e.velocityX / this.element.offsetWidth * this.rotateSpeed;
                    this.phi -= 2 * Math.PI * e.velocityY / this.element.offsetHeight * this.rotateSpeed;
                } else if ( e.srcEvent.button == 2 ) {
                    this.move( e.velocityX * this.panSpeed * this.speedMultiplier, -e.velocityY * this.panSpeed * this.speedMultiplier, 0 );
                } else if ( e.srcEvent.button == 3 ) {
                    this.move( e.velocityX * this.panSpeed * this.speedMultiplier, 0, -e.velocityY * this.panSpeed * this.speedMultiplier );
                }

            },
            onKeyDown: function ( e ) {
                switch ( e.keyCode ) {
                    /* d */ case 68: return this.localDirection.x = 1;
                    /* a */ case 65: return this.localDirection.x = -1;
                    /* s */ case 83: return this.localDirection.z = 1;
                    /* w */ case 87: return this.localDirection.z = -1;
                    /* 2 */ case 50: return this.parentDirection.y = 1;
                    /* x */ case 88: return this.parentDirection.y = -1;
                    /* q */ case 81: return this.rollDirection = 1;
                    /* e */ case 69: return this.rollDirection = -1;
                    /* r */ case 82: return this.roll = 0;
                    /* z */ case 90: return this.distance = 0;
                    /* ] */ case 219: return this.fovDirection = -1;
                    /* \ */ case 220: return this.object.fov = 60;
                    /* [ */ case 221: return this.fovDirection = 1;
                    /* ⇧ */ case 16: return this.speedMultiplier = 10;
                }
            },
            onKeyUp: function( e ) {
                switch ( e.keyCode ) { 
                    /* a d */ case 68: case 65: return this.localDirection.x = 0;  
                    /* s w */ case 83: case 87: return this.localDirection.z = 0; 
                    /* 2 x */ case 50: case 88: return this.parentDirection.y = 0;
                    /* q e */ case 81: case 69: return this.rollDirection = 0;
                    /* [ ] */ case 219: case 221: return this.fovDirection = 0;
                    /*  ⇧  */ case 16: return this.speedMultiplier = 1;
                }
            },
            bindDebug: function() {
                
                this.originalOrder = this.object.rotation.order;
                this.object.rotation.reorder( 'ZYX' );

                this.object.add( this.debugObject );
                this.updateDebugMesh();

                window.addEventListener( 'keydown', this.onKeyDown, false );
                window.addEventListener( 'keyup', this.onKeyUp, false ); 
                window.addEventListener( 'mousewheel', this.onMouseWheel, false );
                this.element.addEventListener( 'contextmenu', this.preventDefault, false ); 
                
                this.$element = new Hammer( this.element );
                this.$element.on( 'pan', this.onDrag );

                if ( url.c ) {
                    this.object.unserialize( _.map( url.c.split( ',' ), parseFloat ) );
                }

            },
            unbindDebug: function() {
                
                this.object.remove( this.debugObject );
                this.object.rotation.reorder( this.originalOrder );

                window.removeEventListener( 'keydown', this.onKeyDown, false );
                window.removeEventListener( 'keyup', this.onKeyUp, false ); 
                window.removeEventListener( 'mousewheel', this.onMouseWheel, false ); 
                this.element.removeEventListener( 'contextmenu', this.preventDefault, false ); 

                this.$element.off( 'pan', this.onDrag );

                if ( URL_SAVE_CAMERA ) {
                    history.replaceState( {}, '', url.removeProp( 'c' ) );
                }

            },
            start: function() {
                
                this.firstRun = true;
                
                switch ( this.mode ) {
                    case DEBUG: return this.bindDebug();
                    case MOUSE: return this.bindMouse();
                    case TILT: return this.bindTilt();
                }

            },
            stop: function() {

                switch ( this.mode ) {
                    case DEBUG: return this.unbindDebug();
                    case MOUSE: return this.unbindMouse();
                    case TILT: return this.unbindTilt();
                }
            },
            reset: function() {
               
               this.move( 0, 0, -this.distance, true );
               this.object.passenger.quaternion.copy( new THREE.Quaternion() );
               this.move( 0, 0, this.distance, true );
            }, 
            setMode: function( mode ) {
                
                var active = this.active;
                
                if ( active ) this.stop();
                
                this.mode = mode;
                
                if ( active ) this.start();

            },
            bindMouse: function() {
                window.addEventListener( 'mousemove', this.onMouseMove, false );
                document.addEventListener( 'mouseout', this.onMouseOut, false );
                this.offsetEasing = MOUSE_EASING;
                this.phiOffset = 0;
            },
            unbindMouse: function() {
                this.element.removeEventListener( 'mousemove', this.onMouseMove, false );
            },
            bindTilt: function() {
                Accelerometer.on( 'change', this.onAccelerometerChange );
                this.offsetEasing = TILT_EASING;
                this.phiOffset = 0; 
            },
            unbindTilt: function() {
                Accelerometer.off( 'change', this.onAccelerometerChange );
            },
            updateDebugMesh: function() {
                this.debugObject.position.z = -this.distance;
                this.debugObject.quaternion.copy( this.object.quaternion ).inverse();
            },
            updateUrl: function() {
                if ( URL_SAVE_CAMERA ) {
                    history.replaceState( {}, '', url.prop( 'c', this.object.serialize() ) );    
                }
            }
        } 
    ) )();

    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();
    var q = new THREE.Quaternion();
    var v = new THREE.Vector3();
    var z = new THREE.Vector3( 0, 0, 1 );
    var euler = new THREE.Euler();

    var up = new THREE.Vector3(0, 1, 0);
    var v0 = new THREE.Vector3(0, 0, 0);

    function makeDebugObject() {

        var debugObject = new THREE.Object3D();

        var centerGeom = new THREE.BoxGeometry( 10, 10, 10 );
        var centerMat = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
        var center = new THREE.Mesh( centerGeom, centerMat );

        var axisHelper = new THREE.AxisHelper( 100 );
        debugObject.add( axisHelper );

        debugObject.add( center );

        return debugObject 

    } 


} )( this );