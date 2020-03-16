Array.prototype.remove = function( i ) {
    this.splice( i, 1 );  
};

Array.prototype.clear = function() {
    while ( this.length > 0 ) {
        this.pop();
    }  
};