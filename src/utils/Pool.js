var Pool = Composition(

    {
        init: function( callback, progress ) {
            this.position = 0;
            this.items = [];

            var itemsPerFrame = LITE ? 1 : HANDHELD ? 5 : 15;

            var addItem = function() {
                
                if ( this.items.length + itemsPerFrame < this.size ) {
                    requestAnimationFrame( addItem );
                }
                for ( var i = 0; i < itemsPerFrame && this.items.length < this.size; i++ ) { 
                    var item = this.create();
                    item.busy = false;
                    this.items.push( item );
                }
                
                progress( this.items.length / this.size );
                if ( this.items.length >= this.size ) { 
                    callback();
                }

            }.bind( this );

            addItem();

        },

        create: function() {
            return {};   
        },

        next: function( requirements ) {

            if ( !_.isFunction( requirements ) ) {
                requirements = where( requirements );
            }

            var item, i = 0;
            
            do {

                item = this.items[ this.position++ % this.items.length ];  
                i++;

            } while ( item.busy && requirements( item ) && i < this.items.length );
            
            if ( item.busy ) {
                console.warn( 'No available items!' );
            }
            
            item.busy = true;
            return item;

        },

        return: function( item ) {
            item.busy = false;
        } 
        
    }

);