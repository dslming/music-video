// http://javascript.boxsheep.com/polyfills/Array-prototype-forEach/
;( function() {
    
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callbackfn, thisArg) {
            var O = Object(this),
                lenValue = O.length,
                len = lenValue >>> 0,
                T,
                k,
                Pk,
                kPresent,
                kValue;
     
            if (typeof callbackfn !== 'function') {
                throw new TypeError();
            }
     
            T = thisArg ? thisArg : undefined;
     
            k = 0;
            while (k < len) {
                Pk = k.toString();
                kPresent = O.hasOwnProperty(Pk);
                if (kPresent) {
                    kValue = O[Pk];
                    callbackfn.call(T, kValue, k, O);
                }
                k += 1;
            }
            return undefined;
        };
    }

} )();