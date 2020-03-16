;( function( scope ) {

    var Types = scope.Assets.Types;
    

    // Plain Text
    // ------------------------------- 

    Types.text = get;
    Types.vs = get;
    Types.fs = get;
    Types.glsl = get;
    Types.woff2 = get;

    Types.json = function( url, load, error ) {
        get( url, function( text ) {
            load( JSON.parse( text ) );
        }, error );
    };


    // CSV
    // ------------------------------- 

    Types.csv = function( url, load, error ) {
    
        get( url, function( text ) {
            
            var lines = text.split( '\n' );
            var columns = lines[ 0 ].split( ',' );

            lines = lines.slice( 1 );
            lines.forEach( function( line, i ) {

                var cells = line.split( ',' );
                var obj = {};

                cells.forEach( function( val, i ) {

                    var col = columns[ i ];
                    if ( col.toLowerCase() == 'time' ) {
                        var match = val.match( /(\d+):(\d+).(\d+)/ );
                        if ( match ) {
                            var millis = parseInt( match[ 3 ] );
                            var seconds = parseInt( match[ 2 ] );
                            var minutes = parseInt( match[ 1 ] );
                            obj.time = Time.seconds( seconds + millis / 1000 + minutes * 60 );
                        }
                    }
                    obj[ col ] = val;

                } );

                lines[ i ] = obj;
            } );
            
            lines.columns = columns;

            load( lines );

        }, error );
        
    };


    // Volume
    // ------------------------------- 

    Types.volume = function( url, load, error ) {
    
        var volume = {};

        get( url, function( text ) {
            var json = JSON.parse( text );
            for ( var name in json ) {
                volume[ name ] = new Volume( json[ name ] ); 
            }
            load( volume );
        }, error );

        
    };


    // Images
    // ------------------------------- 

    Types.png = image;
    Types.jpg = image;
    Types.jpeg = image;
    Types.gif = image;

    function image( path, load ) {
        var img = new Image();
        img.onload = function() { 
            load( img );
        };
        img.src = path;
    };


    // Binary
    // ------------------------------- 

    Types.buffer = getBuffer;

    Types.mid = function( path, load, error ) { 
        getBuffer( path, function( buffer ) {
            load( new MIDIFile( buffer ) );
        }, error )
    };


    // three.js
    // ------------------------------- 

    if ( scope.THREE ) {

        Types.texture = function( path, load, error ) {
            THREE.ImageUtils.loadTexture( path, THREE.UVMapping, load, error );
        }

        Types.texturecube = function( path, load, error ) {
            var paths = [];
            _.each( [ 'px', 'nx', 'py', 'ny', 'pz', 'nz' ], function( suf ) {
                paths.push( path.replace( '*', suf ) );
            } );
            THREE.ImageUtils.loadTextureCube( paths, THREE.UVMapping, load, error );
        }

        if ( THREE.OBJLoader ) {
            
            var loader = new THREE.OBJLoader();

            Types.obj = function( url, load, error ) {
                loader.load( url, load );
            };

        }

    }


    // pixi.js
    // ------------------------------- 

    if ( scope.PIXI ) {

        Types.sprite = function( path, load, error ) {

            var loader = new PIXI.ImageLoader( path );
            loader.onLoaded = function() {
                load( new PIXI.Sprite( PIXI.TextureCache[ path ] ) );
            };
            loader.load();

        };

        Types.spritesheet = function( path, load, error ) {
        
            var size = 2048; // todo

            var ogPath = path.toString();

            path = path.replace( '{s}', size );
            path = path.replace( '{n}', 0 );

            path += '.json';

            get( path, function( text ) {

                var json = JSON.parse( text );
                var sheets = _.map( _.range( json.sheets ), function( n ) {
                
                   return ogPath.replace( '{s}', size ).replace( '{n}', n ) + '.json'; 
                    
                } );

                var loader = new PIXI.AssetLoader( sheets );
                loader.onComplete = load;
                loader.load();

            }, error );            

        };

    }
    

    // Sound Manager
    // ------------------------------- 

    // if ( scope.soundManager ) {

    //     var soundManagerStarted = false;

    //     var promise = new Promise();

    //     if ( !soundManagerStarted ) {

    //         soundManagerStarted = true;

    //         soundManager = new SoundManager();

    //         soundManager.useHighPerformance = true;
    //         soundManager.useFastPolling = true;
    //         soundManager.useHTML5Audio = true;
    //         soundManager.onready( promise.resolve );

    //         soundManager.url = Assets.basePath + 'swf/';
    //         soundManager.beginDelayedInit();

    //     }

    //     var sound = function( url, load, error ) {
    //         promise.then( function() {
    //             var name = url;
    //             var s = soundManager.createSound( {
    //                 url: url,
    //                 stream: true,
    //                 autoLoad: true,
    //                 onload: function() {
    //                     // console.log( 'sound loaded', s );
    //                 }
    //             } );
    //             load( s );
    //         } );
    //     };

    //     Types.mp3 = sound;
    //     Types.ogg = sound;
    //     Types.wav = sound;

    // }
    
    if ( USE_SOUNDCLOUD ) { 

        SC.initialize( {
          client_id: "ed034dcadbbd510234561d90b4ef5868"
        } );

        Types.mp3 = function( url, load, error ) {

            SC.whenStreamingReady( function() {
                SC.stream( '/tracks/208519540?secret_token=s-v7Hc6', {
                    autoLoad: true, 
                }, function( sound ) {
                    load( sound );
                } )
            } );
            
        }


    } else {


        var sound = function( url, load, error ) {
            var audio = document.createElement( 'audio' );
            audio.setAttribute( 'preload', 'auto' );
            audio.setAttribute( 'src', url );
            load( audio );
        };

        Types.mp3 = sound;
        Types.ogg = sound;
        Types.wav = sound;

    }


} )( this );