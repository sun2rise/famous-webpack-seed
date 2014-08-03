define(function(require, exports, module) {
    require('./resources');
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var logo = new ImageSurface({
        size: [200, 200],
        content: 'http://code.famo.us/assets/famous_logo.svg',
        classes: ['double-sided']
    });

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        transform : function(){
            return Transform.rotateY(0.002 * (Date.now() - initialTime));
        }
    });

    mainContext.add(centerSpinModifier).add(logo);

    console.log('Current target is: '+JSON.stringify(TARGET));
    console.log('Set TARGET variable with "webpack --target=xxx"');

    document.addEventListener("deviceready", function(){
        // Add the cordova.js script tag to your HTML to load cordova.
        //
        //  <script type="text/javascript" src="cordova.js"></script>
        console.log('Cordova loaded succesfully - Device Ready!');
    }, false);
});
