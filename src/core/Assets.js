;( function( scope ) {

    scope.Assets = function( asset ) {
        
        // refer to loaded assets with or without path bangs
        // so you can load and request assets with the same string
        asset = asset.substring( asset.indexOf( '!' ) + 1 );

        if ( !Assets.loaded[ asset ] ) {
            console.error( 'Request for unloaded asset: ' + asset );
            return;
        }

        return Assets.loaded[ asset ];

    };

    _.extend( Assets, {

        Types: {},
        loaded: {},
        promises: {},
        basePath: '',

        getExtension: function( path ) {
            return /(?:\.([^.]+))?$/.exec( path )[ 1 ];
        },

        getType: function( pathBang ) {
            
            var loader;
            var path = pathBang;
            var bang = /^(.*)!(.*)/.exec( pathBang );

            if ( bang ) {
                loader = Assets.Types[ bang[ 1 ] ];
                path = bang[ 2 ];
            } else {
                loader = Assets.Types[ Assets.getExtension( pathBang ) ];
            }

            if ( !loader ) {
                console.error( 'Unrecognized file type: ' + pathBang );
                return;
            }

            return { loader: loader, path: path };

        },

        load: function( args ) {

            args = _.defaults( args, {
                files: [],
                basePath: Assets.basePath,
                progress: function() {}
            } );

            var loaded = 0;
            var promises = [];

            args.files.forEach( function( pathBang ) { 
                
                var type = Assets.getType( pathBang );
                var loader = type.loader;
                var path = type.path;

                var promise = Assets.promises[ path ];
                
                if ( !promise ) {
                    
                    promise = Assets.promises[ path ] = new Promise();
                    
                    loader( args.basePath + path, function( asset ) {
                        Assets.loaded[ path ] = asset;
                        promise.resolve();
                    } );

                }

                promise.then( function() {
                    loaded++;
                    args.progress( loaded / args.files.length, loaded, args.files.length );
                } );                

                promises.push( promise );

            } );

            return Promise.all( promises );

        }

    } );

} )( this );
