;( function( scope ) {
    
    var syncMatch = 'default';

    scope.Device = {

        sync: ( function() {
        
            var sync = DEFAULT_SYNC;

            for ( var match in DEVICE_SYNC_DB ) {
                if ( UA.indexOf( match ) !== -1 ) {
                    sync = DEVICE_SYNC_DB[ match ];
                    syncMatch = match;
                }
            }

            return sync;
            
        } )(),
        
    };

    document.getElementById( 'sync-display' ).innerHTML = Device.sync;
    document.getElementById( 'sync-match' ).innerHTML = syncMatch;
    document.getElementById( 'user-agent' ).innerHTML = UA;

} )( this );