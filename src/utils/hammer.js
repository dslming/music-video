//extend to allow right click
//input mouse map is not a public property of Hammer, so copy it here
var MOUSE_INPUT_MAP = {
    mousedown: Hammer.INPUT_START,
    mousemove: Hammer.INPUT_MOVE,
    mouseup: Hammer.INPUT_END
};
//override
Hammer.inherit(Hammer.MouseInput, Hammer.Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        //modified to handle all buttons
        //left=0, middle=1, right=2
        if (eventType & Hammer.INPUT_START) {
            this.pressed = true;
        }

        if (eventType & Hammer.INPUT_MOVE && ev.which === 0) {
            eventType = Hammer.INPUT_END;
        }
        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & Hammer.INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
                        button: ev.button,
            pointers: [ev],
            changedPointers: [ev],
            pointerType: 'mouse',
            srcEvent: ev
        });
    }
});

function hammer( id ) {
    return new Hammer( document.getElementById( id ) );
}