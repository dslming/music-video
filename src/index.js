var RECORD_MODE = url.boolean('record');
var TITLE_CAP = url.boolean('title');
var FREEZE_ACCELEROMETER = true;

var IPHONE_5 = GPU && GPU.indexOf('Apple A7 GPU') !== -1;
var MEDIUM = url.boolean('medium', IPHONE_5);
var LITE = url.boolean('lite', !MEDIUM && GPU && GPU.indexOf('IMGSGX543') !== -1);

var PIXEL_RATIO = url.number('pr', Math.min(2, window.devicePixelRatio || 1));

// to restrict 'light' devices to 1x
// var PIXEL_RATIO     = url.number( 'pr', LITE ? 1 : Math.min( 2, window.devicePixelRatio || 1 ) );

var ANTIALIAS = url.boolean('aa', !LITE && PIXEL_RATIO < 2);

var LITE_PERLIN = url.boolean('lp', MEDIUM || LITE);
var NUM_PAIRS = url.number('l', LITE ? 225 : HANDHELD ? 350 : 1000);
var FPS_CAP = url.boolean('fpsc', MEDIUM || LITE);
var RAF = url.boolean('raf', RECORD_MODE);

var QUALITY_OVERRIDE = url.boolean('lite') || url.boolean('medium') || url.boolean('hd');

function trackEvent(a) {
    ga('send', 'summary', a);
}

; (function (scope) {

    var parser = new UAParser();
    var ua = parser.getResult();
    ua.gpu = GPU;
    ua.ascreenWidth = screen.width;
    ua.ascreenHeight = screen.height;

    if (url.boolean('ua')) {
        alert(JSON.stringify(ua, null, 4));
    }

    var UNSUPPORTED = url.boolean('unsupported',
        !WEBGL
        || ua.os.name === 'Android'
        || ua.browser.name === 'IE'
    );


    if (!QUALITY_OVERRIDE && UNSUPPORTED) {
        unsupported();
    } else {
        supported();
    }

    document.body.classList.remove('no-js');

    function unsupported() {
        landing.classList.add('unsupported');
        trackEvent('unsupported');
    }

    function supported() {

        if (url.boolean('landing')) return;
        trackEvent('supported');

        Bootstrap.init([

            'shaders/noise.glsl',
            'shaders/noise-lite.glsl',
            'shaders/background.vs',
            'shaders/background.fs',
            'shaders/background-lite.vs',
            'shaders/background-lite.fs',
            'shaders/pair.vs',
            'shaders/pair.fs',
            'shaders/floor.fs',
            'shaders/floor.vs',
            'shaders/floor-lite.fs',
            'shaders/floor-lite.vs',
            'texture!textures/title.png',
            'texture!textures/cred-aaf.png',
            'texture!textures/cred-nhx.png',
            'texture!textures/cred-popcorn.png',
            // 'texture!textures/play.png',
            // 'texture!textures/credit.png',
            'texture!textures/pastel.gif',
            'texture!textures/pastel2.jpg'


        ], function () {


            console.time('ready');

            if (url.boolean('nc')) {
                document.body.style.cursor = 'none';
            }

            window.addEventListener('keydown', function (e) {

                if (e.keyCode == 65) {
                    var c = new THREE.Color(Pair.maleColors.next());
                    bg.wipe(1.0, c).play();
                }

                if (e.keyCode == 83) {
                    // floor.throb( 0.15 ).play();
                    floor.randomize();
                }

            }, false);

            // scene
            console.time('initScene');
            initScene();
            console.timeEnd('initScene');
            Loop.force();


            // pool
            console.log('PairPool.size = ' + NUM_PAIRS);
            console.time('PairPool.init');
            PairPool.size = NUM_PAIRS;
            PairPool.init(onPairPoolInit, function (pct) {
                Bootstrap.setProgress(0.25 + pct * 0.75);
            });

        });

        function onPairPoolInit() {
            Loop.force();

            console.timeEnd('PairPool.init');


            // shots
            console.time('initShots');
            initShots();
            console.timeEnd('initShots');

            // Stage.freeze();
            // Bootstrap.stopLoader();

            onLoad();

        }

        function onLoad() {
            //about

            var firstNav = true;

            function nav(init) {

                if (window.location.hash === '#about') {
                    loadAboutImages();
                    Stage.showAbout();
                } else {
                    if (firstNav) {
                        firstNav = false;
                        // Stage.freeze();
                        Controls.start();
                        _.defer(function () {
                            FREEZE_ACCELEROMETER = false;
                        });
                    }
                    Stage.hideAbout();
                }

            }

            _.defer(function () {
                document.body.classList.add('loaded');
                Stage.showControls();
                nav();
                window.onhashchange = nav;
                console.timeEnd('ready');

                if (RECORD_MODE) {
                    MUTE = true;
                    // TweenLite.ticker.useRAF( false );
                    // TweenLite.ticker.fps( 1 );

                    setTimeout(function () {

                        Renderer.setSize(1920, 1080);
                        Renderer.setPixelRatio(1);
                    }, 10)

                    setTimeout(function () {
                        Stage.unfreeze();
                        Three.record();
                    }, 100)


                }

            });

            if (FPS_CAP) {
                TweenLite.ticker.fps(30);
            }

            if (TITLE_CAP) {
                _.defer(function () {
                    Stage.hideControls();
                });
            }

        }

        function loadAboutImages() {

            var images = document.querySelectorAll('#about img');
            for (var i = 0, l = images.length; i < l; i++) {
                images[i].setAttribute('src', images[i].getAttribute('data-src'));
            }

        }

    }

})(this);
