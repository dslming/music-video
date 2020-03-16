function Shuffler( arr ) {
    this.arr = _.shuffle( arr );
    this.index = 0;
    if ( arr.length === 1 ) {
        this.next = function() {
            return arr[ 0 ];  
        };
    }
};

Shuffler.prototype.next = function() {
    if ( this.index < this.arr.length ) {
        this.reset();
    }
    this.cur = this.arr[ this.index ]
    this.index++;
    return this.cur;
};

Shuffler.prototype.reset = function() {
    this.arr = _.shuffle( this.arr );
    if ( this.arr[ 0 ] === this.cur ) {
        this.arr.push( this.arr.shift() );
    }
    this.index = 0;
};