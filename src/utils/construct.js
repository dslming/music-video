function construct(ctor, params) {
    var obj, newobj;

    // Create the object with the desired prototype
    if (typeof Object.create === "function") {
        // ECMAScript 5 
        obj = Object.create(ctor.prototype);
    }
    else if ({}.__proto__) {
        // Non-standard __proto__, supported by some browsers
        obj = {};
        obj.__proto__ = ctor.prototype;
        if (obj.__proto__ !== ctor.prototype) {
            // Setting it didn't work
            obj = makeObjectWithFakeCtor();
        }
    }
    else {
        // Fallback
        obj = makeObjectWithFakeCtor();
    }

    // Set the object's constructor
    obj.constructor = ctor;

    // Apply the constructor function
    newobj = ctor.apply(obj, params);

    // If a constructor function returns an object, that
    // becomes the return value of `new`, so we handle
    // that here.
    if (typeof newobj === "object") {
        obj = newobj;
    }

    // Done!
    return obj;

    // Subroutine for building objects with specific prototypes
    function makeObjectWithFakeCtor() {
        function fakeCtor() {
        }
        fakeCtor.prototype = ctor.prototype;
        return new fakeCtor();
    }
}