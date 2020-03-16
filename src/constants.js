var USE_SOUNDCLOUD = url.boolean( 'sc', false );

// Customizable
// ------------------------------- 

// If true, displays seekbar and play button
var USES_TIMELINE = true;

// Aspect ratio of stage, ignored if STAGE_FLUID
var STAGE_ASPECT_RATIO = 16 / 9;

// If true, uses locked aspect ratio
var STAGE_FLUID = false; // todo

// Ignored if STAGE_FLUID
var STAGE_ORIENTATION_LOCK = 'landscape'; // todo

// True if user needs to interact with the stage.
var INTERACTIVE = true; // todo

// Show the previous next and small play buttons
var DISPLAY_PREV_NEXT = false; // todo

// Forces crop if letterbox spacing is smaller than this value
var PINNED_PADDING = 20;

        
// Feel
// ------------------------------- 

var MOUSE_EASING = 0.02;
var TILT_EASING = 0.2;

// Time in ms until controls disappear
var IDLE_TIMEOUT = 500;

// Time after idle switches until idle can switch again
var IDLE_GRACE_PERIOD = 1200;


// ===============================



// Flags
// ------------------------------- 

var DEBUG_ENABLED = true; // todo

var AUTO_PLAY = false;
var AUTO_TIME = 0;
var AUTO_TIME_UNIT = 'seconds';
var MUTE = false;

if ( DEBUG_ENABLED ) {

    AUTO_PLAY = url.boolean( 'p' );
    AUTO_TIME = url.number( 't' ) || url.number( 'r' ) || url.number( 'b' );
    AUTO_TIME_UNIT = url.r ? 'bars' : 0 || url.b ? 'beats' : 0 || 'seconds';
    MUTE = url.boolean( 'm', false );

}

// Enums
// -------------------------------

var DEBUG    = 'Debug';
var MOUSE    = 'Mouse';
var TILT     = 'Tilt';
var VR       = 'Vr';

var OCULUS   = 'OculusRift';
var STEREO   = 'Stereo';
var ANAGLYPH = 'Anaglyph';


// Sniff sniff ...
// -------------------------------

var UA = navigator.userAgent;

var ANDROID    = !!UA.match( /Android/ig );
var BLACKBERRY = !!UA.match( /BlackBerry/ig );
var IOS        = !!UA.match( /iPhone|iPad|iPod/ig );
var OPERAMINI  = !!UA.match( /Opera Mini/ig );
var IEMOBILE   = !!UA.match( /IEMobile/ig );
var WEBOS      = !!UA.match( /webOS/ig );


var ARORA      = !!UA.match( /Arora/ig );
var CHROME     = !!UA.match( /Chrome/ig );
var EPIPHANY   = !!UA.match( /Epiphany/ig );
var FIREFOX    = !!UA.match( /Firefox/ig );
var IE         = !!UA.match( /MSIE/ig );
var MIDORI     = !!UA.match( /Midori/ig );
var OPERA      = !!UA.match( /Opera/ig );
var SAFARI     = !!UA.match( /Safari/ig );


var HANDHELD  = ANDROID || BLACKBERRY || IOS || OPERAMINI || IEMOBILE || WEBOS;
var TOUCH = 'ontouchstart' in window;
var WEBGL = (function() { try { return !!window.WebGLRenderingContext && !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')); } catch(e) { return false; } })();
var ACCELEROMETER = !!window.DeviceOrientationEvent;


;( function( scope ) {
    if ( WEBGL ) { 
        var ctx = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')
        scope.GPU = ctx.getParameter( ctx.VERSION );
    } else { 
        scope.GPU = null;
    }
} )( this );

[ 'HANDHELD', 'TOUCH', 'WEBGL', 'ACCELEROMETER' ].forEach( function( val ) { 
    document.body.classList.toggle( val.toLowerCase(), this[ val ] );
}, this );


// Device
// -------------------------------

var DEFAULT_SYNC = 0.195;

var DEVICE_SYNC_DB = {
    'iPhone OS 8_': 0.229
};


// Math
// ------------------------------- 

var TWO_PI     = Math.PI * 2;
var PI         = Math.PI;
var HALF_PI    = Math.PI * 0.5;
var QUARTER_PI = Math.PI * 0.25;
var RADIANS    = 180 / Math.PI;

var SQRT_HALF  = Math.sqrt( 0.5 );


// Debug
// ------------------------------- 

// Serialize the camera state in the URL when using Controls
var URL_SAVE_CAMERA = false;

// Width of metronome column
var DEBUG_BEAT_COLUMN = 25;

// Colors to use for debug mode
var DEBUG_COLORS = [
    '#EC008B',
    '#FF3000',
    '#FFB600',
    '#FFF000',
    '#00FF67',
    '#00ADEF',
    '#A100FF',
];