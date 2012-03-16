JSMovieClip
=========

JS movieclip is a JQuery plugin to create, integrate, and control animations quickly and easily in an HTML page.

It is compatible with all browsers, from Internet Explorer 6, as well as smartphone (iOS. ..). This is an efficient alternative for Flash, in some animations.

JS MovieClip uses "sprite", ie a large image containing all the frames of its animation. It will then allow to read and control the animation with stop, play, gotoAndPlay ... as any flasher does.

V0 stable
----------
Instance : 
    $('#element').movieclip(); 

Some options: 
    $('#element').movieclip({
      'width' : 100, //number, width of a frame, in px
      'framerate' : 25, //number, framerate (fps), default = 25 fps
      'frames' : 10, //int, number of frame in animation
      'url' : 'img/sprite.png', //string, url of sprite
      'debug' : false, //boolean, display debug or not
      'callBack' : null //callback function for 'stop()',
    });

recover the movieclip object
    var mc = $('#element').data('Movieclip'); 

there are some public methos :

    mc.play(loop : boolean); 
play the animation from the frame where we are, boolean loop to specifie if we want loop or not

    mc.stop();
stop the animation (dispatch the stop callback)

    mc.gotoAndPlay(frame:int, loop:boolean); 
play the animation from the frame "frame", boolean loop to specifie if we want loop or not

    mc.gotoAndStop(frame:int);
go and stop directly at a frame
    
    mc.loop(frameStart:int, frameEnd:int, loop:boolean);
play animation between frameStart & frameEnd, boolean loop to specifie if we want loop or not

    mc.currentFrame():int
return currently frame

    mc.prevFrame();
back of a frame

    mc.nextFrame();
advance of a frame

    mc.reverseAnimation();
reverse all animation

    mc.verseAnimation();
animations puts in the good way

    mc.toggle(loop:boolean);
if play : stop, if stop : play, boolean loop to specifie if we want loop or not



