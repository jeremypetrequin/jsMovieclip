/**
* @author Badger
* create movieclip in Javascript as Flash
* with frame by frame animation
* & control animation with play(), stop(), gotoAndPlay(), gotoAndStop()
* http://jsmovieclip.jeremypetrequin.fr
*/

var Movieclip = {
      
   _settings : {
      'width' : 100,
      'framerate' : 25,
      'frames' : 10,
      'url' : 'img/sprite.png',
      'debug' : false,
      'callBack' : null
   },
  
   _elmt : null,
   _interval : null,
   _cpt : 0,
   _playing : false,
   _loop : false,
   _firstFrame : 0,
   _lastFrame : 1,
   _reverse : false,
   _timer : null,
    init : function(options, elmt ) {
        this._settings = $.extend({},this._settings,options);
        
        this._elmt = elmt;
        this._firstFrame = 0;
        this._lastFrame = this._settings.frames -1;
        $(this._elmt).css({
          display : 'block',
          background : 'url('+this._settings.url+')'
        });
        if(this._settings.debug) $(this._elmt).prepend('<div class="frame">1</div>');
        return this;
    },
    reverseAnimation : function () {
        this._reverse = true;
    },
    verseAnimation : function () {
        this._reverse = false;
    },
    toggle : function(loop) {
        (!mc._playing ? this.play(loop) : this.stop());
    },
    currentFrame : function () {
        return this._cpt +1;
    },
    play : function(loop) { //loop = boolean play loop or a single
        this._firstFrame = 0;
        this._lastFrame = this._settings.frames -1;
        this._playing = true;
        this._loop = loop || true;
        var _that = this;
        var f = 1000/this._settings.framerate;
        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this._timer = setInterval(function() { _that._delay(_that); }, f);
        
        this._delay(this);
    },
    prevFrame : function () {
      this._playing = false;
      (this._cpt > 0 ? this.gotoAndStop(this._cpt-1) : '');
    },
    nextFrame : function () {
       this._playing = false;
       (this._cpt < this._settings.frames-1 ? this.gotoAndStop(this._cpt+1) : '');
    },
    _delay : function (_this) {
        
        if(_this._reverse === false) {
            (!_this._loop && _this._cpt == _this._lastFrame ? _this.stop() : '');
            if(!_this._playing) return;
            _this._cpt = (_this._cpt == _this._lastFrame) ? _this._firstFrame : _this._cpt+1;
        } else {
            (!_this._loop && _this._cpt == _this._firstFrame ? _this.stop() : '');
            if(!_this._playing) return;
            _this._cpt = (_this._cpt == _this._firstFrame) ? _this._lastFrame : _this._cpt-1;
        }

        $(_this._elmt).each(function(){
             $(this).css('background-position', -(_this._cpt*_this._settings.width));
             if(_this._settings.debug) $(this).children('.frame').html(_this.currentFrame());
         });
    },
    loop: function (firstFrame, lastFrame, loop) {
        if(this._reverse) {
            this._firstFrame = (firstFrame-1 < 0) ? 0 : firstFrame-1;
            this._lastFrame = ((lastFrame-1) >(this._settings.frames-1)) ? this._settings.frames-1 : lastFrame-1;
        } else {
            this._firstFrame = (firstFrame-1 < 0) ? 0 : firstFrame-1;
            this._lastFrame = ((lastFrame-1) >(this._settings.frames-1)) ? this._settings.frames-1 : lastFrame-1;
        }
        
        this._cpt = (!this._reverse) ? this._firstFrame : this._lastFrame;
        this._loop = loop;
        var _this = this;
        $(this._elmt).each(function(){
            $(this).css('background-position', -(_this._cpt*_this._settings.width));
        });
        if(!this._playing) {
            this._playing = true;
            var f = 1000/this._settings.framerate;
            //setTimeout(function() {_this._delay(_this);}, f);
            if(this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            var _that = this;
            this._timer = setInterval(function() { _that._delay(_that); }, f);
        }
    },
    stop : function( ) {
        this._firstFrame = 0;
        this._lastFrame = this._settings.frames -1;
        this._playing = false;
        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if(this._settings.callBack && typeof(this._settings.callBack) == 'function') this._settings.callBack();
        
    },
    gotoAndPlay : function(frame, loop) {// frame : uint between 1 & frametotal
        frame = (!this._reverse) ? frame -2 : frame;
        this._cpt = (frame > this._settings.frames)? this._settings.frames%frame : frame;
        this.play(loop);
    },
    gotoAndStop : function(frame) { // frame : uint between 1 & frametotal
        //this._cpt = (this._cpt == 0)? 1 : this._cpt-1;
        this._cpt = (frame > this._settings.frames)? this._settings.frames%frame : frame-1;
        $(this._elmt).css('background-position', -(this._cpt*this._settings.width));
           // var x = parseFloat($(this).css('background-position').split(' ')[0].replace('px', ''));
        this.stop();
    }
  };


// Make sure Object.create is available in the browser (for our prototypal inheritance)
// Courtesy of Papa Crockford
// Note this is not entirely equal to native Object.create, but compatible with our use-case
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
        F.prototype = o;
        return new F();
    };
}
(function($){
  // Start a plugin
  $.fn.movieclip = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        // Create a new Movieclip object via the Prototypal Object.create
        var mc = Object.create(Movieclip);
        // Run the initialization function of the movieclip
        mc.init(options, this); // `this` refers to the element
        // Save the instance of the movieclip object in the element's data store
        $.data(this, 'Movieclip', mc);
      });
    }
  };
})(jQuery);