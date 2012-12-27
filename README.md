JSMovieClip
=========

JS movieclip is a small javascript library to quickly and easily create, integrate, and control animations in an HTML page.

It is compatible with all browsers, from Internet Explorer 6, as well as smartphone (iOS. ..). 

JS MovieClip uses "sprite", that is it say a large image containing all the frames of its animation. Then, It will allow to play and control the animation with stop, play, gotoAndPlay ... as any flasher does.

V1 stable
----------

Instance : 

    var movieclip = new JSMovieclip(document.getElementById('div-id'), params);

In first param, you can passe : a dom element, an array of a dom elements, a NodeList, a jQuery object...

You can pass some options in params: 

    {
        frames : [],
        direction : 'h' || 'v',
        frame_number : 0,
        stopCallback : fn,
        framerate : 25,
        width : 0,
        height : 0
    }



there are some public methods :

play the animation from the frame where you are, boolean loop to specifie if we want to loop or not

    mc.play(loop : boolean); 


stop the animation (dispatch the stop callback)

    mc.stop();


play the animation from the frame "frame", boolean loop to specifie if we want to loop or not

    mc.gotoAndPlay(frame:int, loop:boolean); 


go and stop directly at a frame

    mc.gotoAndStop(frame:int);


block the animation between two specifics frames :     

    mc.loopBetween(frameStart:int, frameEnd:int);

all animation are now between frameStart and frameEnd animation between frameStart & frameEnd

    mc.loopBetween(1, 10).play(true); //will play animation between first frame and 10's


return currently frame

    mc.currentFrame():int


go back to a frame

    mc.prevFrame();


go to the next frame

    mc.nextFrame();


if play : stop, if stop : play, boolean loop to specifie if we want to loop or not

    mc.toggle(loop:boolean);

Change the way of playing : 

    mc.changeWay(1); // play in the normal way
    mc.changeWay(-1); // invert the playing
    mc.changeWay(-1, true); //the second param, a boolean to stay a the same frame


All method are chainable (except currentFrame() ), so you can do :

    mc.loopBetween(12, 14).gotoAndPlay(12)

V1 jQuery plugin version
----------
Instance :

    $('element(s)').JSMovieclip(params);

recover the movieclip object

    var mc = $('#element').data('JSMovieclip'); 

You can now apply all the public method on mc object

    mc.play();
    mc.stop();
    //....
    


