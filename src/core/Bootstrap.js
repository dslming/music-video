;( function( scope ) {

    scope.Bootstrap = Singleton( 
        
        Events,
        
        {

            paths: {
                midi: 'mid/' + Project.slug + '.mid',
                mp3: 'mp3/' + Project.slug + '.mp3',
                csv: 'csv/' + Project.slug + '.csv', 
                peaks: 'peaks/' + Project.slug + '.json',
                volumes: 'volume!volume/' + Project.slug + '.json'
            },

            setProgress: function( pct ) {
                progress.style.transform = 
                progress.style.webkitTransform = 
                'scale( ' + pct + ', 1 )';
            }, 

            init: function( files, callback ) {

                Bootstrap.trigger( 'init' );

                files = files.concat( _.values( Bootstrap.paths ) );
                
                Assets.load( {

                    files: files,
                    basePath: 'assets/',
                    progress: function( pct ) {
                        Bootstrap.setProgress( pct * 0.25 );
                    }

                } ).then( function() {

                    scope.Midi    = Assets( Bootstrap.paths.midi );
                    scope.Csv     = Assets( Bootstrap.paths.csv );
                    scope.Volumes = Assets( Bootstrap.paths.volumes );
                    scope.Peaks   = Assets( Bootstrap.paths.peaks );

                    Bootstrap.trigger( 'load' );

                    callback();

                    Bootstrap.trigger( 'done' );

                } );

            }

        }

    );
    
} )( this );