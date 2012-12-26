JSMovieClip
=========

JS movieclip is a small javascript library to quickly and easily create, integrate, and control animations in an HTML page.

It is compatible with all browsers, from Internet Explorer 6, as well as smartphone (iOS. ..). 

JS MovieClip uses "sprite", that is it say a large image containing all the frames of its animation. Then, It will allow to play and control the animation with stop, play, gotoAndPlay ... as any flasher does.

V1 stable
----------
First, you need a DOM element, div or what you want : 
````HTML
<div id="my-element"></div>
````

Then, you need to apply it the width and the height of a frame (each frame need to have the same size) and the sprite as background :
````CSS
#my-element {
    width : 200px;
    height : 200px;
    background:url(sprite.png) no-repeat;
}
````

And now, instanciate a new JSMovieclip object : 
````javascript
var movieclip = new JSMovieclip(document.getElementById('my-element'), params);
````

First parameter may be a DOM element, an array of DOM elements, a jQuery (or Zepto..) object, a NodeList...

Second parameter is options, it can be : 
````javascript
{
    frames : [],
    direction : 'h' || 'v',
    frame_number : 0,
    stopCallbach : fn,
    framerate : 25,
    width : 0,
    height : 0
}
````


there are some public methods :

play the animation from the frame where you are, boolean loop to specifie if we want to loop or not
````javascript
mc.play(loop : boolean); 
````

stop the animation (dispatch the stop callback)
````javascript
mc.stop();
````

play the animation from the frame "frame", boolean loop to specifie if we want to loop or not
````javascript
mc.gotoAndPlay(frame:int, loop:boolean); 
````

go and stop directly at a frame
````javascript
mc.gotoAndStop(frame:int);
````

block the animation between two specifics frames :     
````javascript
mc.loopBetween(frameStart:int, frameEnd:int);
````

all animation are now between frameStart and frameEnd animation 
````javascript
mc.loopBetween(1, 10).play(true); //play animation between first frame and 10's
````

If you call ````mc.loopBetween();```` you can call clearLoopBetween to reset first et lastFrame to the default
````javascript
mc.clearLoopBetween();
````

get currentl frame
````javascript
mc.currentFrame():int
````

go back to a frame
````javascript
mc.prevFrame();
````

go to the next frame
````javascript
mc.nextFrame();
````

if play : stop, if stop : play, boolean loop to specifie if we want to loop or not
````javascript
mc.toggle(loop:boolean);
````

Change the way of playing : 
````javascript
mc.changeWay(1); // play in the normal way
mc.changeWay(-1); // invert the playing
mc.changeWay(-1, true); //the second param, a boolean to stay a the same frame
````

Get current way of playing, return 1 or -1
````javascript
mc.getWay():int
````

All method are chainable (except currentFrame() and getWay() ), so you can do :
````javascript
mc.loopBetween(12, 14).gotoAndPlay(12)
````

V1 jQuery plugin version
----------
Instance :
````javascript
$('element(s)').JSMovieclip(params);
````

recover the movieclip object
````javascript
var mc = $('#element').data('JSMovieclip'); 
````

You can now apply all the public method on mc object
````javascript
mc.play();
mc.stop();
//....
````    


