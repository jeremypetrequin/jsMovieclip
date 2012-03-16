/**
 * Jsmovieclip,
 * create, animate, & control sprite sheet animation as AS3 movieclip
 * work on all browser (from IE5.5), all smartphones & tablets devices (where jQuery works too of course)
 * @author Jeremy Petrequin
 * @website http://jsmovieclip.jeremypetrequin.fr
 * 
 * a lot of things are currently not working
 * 
 * http://jsperf.com/jquery-backgroundposition-vs-native-backgroundposition
 */
   
;(function($){
    /**
     * tween object
     * @params movieclip object
     
    function Tween(mc) {
        var _mc = mc;

        this.linear = function(x1, x2, y1, y2) {
            var coeff = (y2 -y1) / (x2 - x1), 
            a = y1 - coeff * x1;
            return function(t) {
               return coeff * t + a;
            };
        }

        return this;
    }
    */
    
    
    /**
     * MovieClip object, Let's party begin!
     * @params e : $jquery object
     * @params options : settings object
     */
    function MovieClip($e, options) {

        /**************************************
         *                private properties                 *
         **************************************/ 
        var _settings = {
          width     : 100,              //float : width of a frame
          height     : 100,              //float : width of a frame
          framerate : 25,               //float : framerate of the animation (frames by seconds)
          frames    : 10,               //int : number of frame
          url       : 'img/sprite.png', //string : url of sprite
          debug     : false,            //boolean : display debug or not (a div with the frame number inside the $(elemt)
          stopCallback : null,          //function : callback called when the MC stop
          way : 'h',                    //string : the way of sprite, v for vertical, h for horizontal, * for mixef (need a framesTab so!)
          framesTab : []                //array of objects : {x, Y} of each frames
        },
        _$e = $e || $('<div>'),
        _interval = null,
        _cpt = 0,
        _timer = null,
        _firstFrame = 0,
        _lastFrame = 9,
        _intervalFramerateAnim = null;
        
        
        
        
        /**************************************
         *                 Public properties                  *
         **************************************/ 
        this.playing = false;
        this.loop = false;
        this.reverse = false;
        this.totalFrame = 1;
        this.framerateAnimateSettings = {
            framerate : 25,
            defaultSpeed : {'slow' : 1000, 'fast' : 200},
            defaultDuration : 500
        }
        
        /**
         * Getters & setters
         */
        
        /**
         * setter for an option value
         * @params param : key of option
         * @params value : new value for this key
         * @params that = instance of current MovieClip object, default = this;
         */
        this.setOption = function(param, value, that) {
            that = that || this;
            
            if(param === 'debug') {
                _$e.children('div.frame').remove();
                if(value === true) {_$e.prepend('<div class="frame">'+that.currentFrame(that)+'</div>');}
                _settings.debug = value;
            } else if(param === 'url') {
                _settings.url = value;
                _$e.css('background' , 'url('+_settings.url+')');
                _moveBkg(that);
            } else if(param === 'framerate') {
                that.changeFramerate(value, that);
            } else if(param == 'frames'){
                _settings.frames = value;
                _moveBkg(that);
            } else if(param == 'width') {
                _settings.width = value;
                _moveBkg(that);
            } else if(param == 'stopCallback') {
                _settings.stopCallback = value;
            } else if(param == 'way') {
                _settings.way = value;
                this.calculFrame(null, that);
            } else if(param == 'framesTab') {
                this.calculFrame(value, that);
            }
        }
        
        
        
        /**
         * setter for private properties
         * use it with caution
         * (you can set the option of movieclip, with a new settings object. The method use this.setOption() for all option you specified in your object);
         * 
         * @params param : key
         * @params value : value
         * @params that = instance of current MovieClip object, default = this;
         */
        this.set = function(param, value, that) {
            that = that || this;
            if(param === 'settings') {
                for(var key in value) {
                    that.setOption(key, value[key], that);
                }
            } else {
                eval('_'+param+' = '+value+';')
            }
        }
        
        /**
         * getter for privates properties
         * @params param : key
         * @params that = instance of current MovieClip object, default = this;
         */
        this.get = function(param, that) {
            that = that || this;
            return eval('_'+param);
        }
        
        /**
         * get the current Frame (between 1 & totalFrame);
         * @params that = instance of current MovieClip object, default = this;
         */
        this.currentFrame = function(that) {
            that = that || this;
            return _cpt +1;
        }
        
        
        
        /**************************************
         *                     Public Methods                 *
         **************************************/   
        
        /**
         * play, run the animation
         * @params loop : boolean play in loop or stop at end
         * @params that = instance of current MovieClip object, default = this;
         */
        this.play = function(loop, that) {
            that = that || this;
            that.loop = loop;
            
            that.firstFrame = 0;
            that.lastFrame = _settings.frames -1;
            that.playing = true;
            
            _moveBkg(that);
            //if(_timer) {clearInterval(_timer);_timer = null;}
            _timer = setInterval(function() {_delay(that);}, 1000/_settings.framerate);
            
            
        }
        
        /**
         * change the framerate
         * @params newFramerate : float new framerate wanted or a tween object 
         * @params that = instance of current MovieClip object, default = this;
         */
        this.changeFramerate = function(newFramerate, that) {
            that = that || this;
            console.log('CHANGE FRAMERATE ', newFramerate);
            if(!newFramerate || newFramerate === _settings.framerate) return;
            newFramerate = Math.max(0, newFramerate);
            _settings.framerate = newFramerate;
            if(that.playing === true) {
                if(_timer) {clearInterval(_timer);_timer = null;}
                _timer = setInterval(function() {_delay(that);}, 1000/_settings.framerate);
                _moveBkg();
            }
        }
        
        /**
         * animate the framerate
         * in WORK
         */
        this.animateFramerate = function(from, to, time, anim, that) {
            if(_intervalFramerateAnim) {
                clearInterval(_intervalFramerateAnim);
                _intervalFramerateAnim = null;
            }
            that = that || this;
            if(!that.playing) return;
            from = from == 'current' ? _settings.framerate : from;
            time = typeof(time) == 'string' ? that.framerateAnimateSettings.defaultSpeed[time] : (time || that.framerateAnimateSettings.defaultDuration);
            
            var begin = new Date().getTime();
            //var tw = new Tween(that).linear(begin, begin+time, from, to);
            
            _intervalFramerateAnim = setInterval(function() {
               // console.log(_intervalFramerateAnim);
            }, 1000 / that.framerateAnimateSettings.framerate);
            
        }
        
        
        /**
         * stop the animation
         * @params that = instance of current MovieClip object, default = this;
         */
        this.stop = function(that) {
            that = that || this;
            _firstFrame = 0;
            _lastFrame = _settings.frames -1;
            var wasPlaying = that.playing;
            that.playing = false;
            if(_timer) {
                clearInterval(_timer);
                _timer = null;
            }
            //callback 
            if(_settings.stopCallback && typeof(_settings.stopCallback) === 'function') {
                _settings.stopCallback.call(that, that.currentFrame(that), wasPlaying, that);
            }
        }
        
        /**
         *
         * @params frame : number of frame to go
         * @params that : object instance of current MovieClip object, default = this;
         */
        this.gotoAndStop = function(frame, that) {
            that = that || this;
            frame = Math.max(1, frame);
            frame = Math.min(frame, _settings.frames);
            _cpt = frame - 1;
            _moveBkg(that);
            that.stop();
            
        }
        
        /**
         * play from a specific frame
         * @params frame : number of frame to go
         * @params loop : boolean play in loop or stop at end
         * @params that : object instance of current MovieClip object, default = this;
         */
        this.gotoAndPlay = function(frame, loop, that) {
            that = that || this;
            frame = Math.max(1, frame);
            frame = Math.min(frame, _settings.frames);
            _cpt = frame -1;
            
            that.play(loop);
        }
        
        
        /**
         * play the animation between 2 frames
         * @params first : uint first frame
         * @params last : uint last frame
         * @params loop : boolean play in loop or stop at the end
         * @params that : object instance of current MovieClip object, default = this;
         */
        this.loop = function(firstFrame, lastFrame, loop, that) {
            that = that || this;
             if(that.reverse === false) {
                _firstFrame = Math.max(0, firstFrame-1);
                _lastFrame = Math.min(lastFrame-1, _settings.frames-1);
            } else {
                _lastFrame = Math.max(0, firstFrame-1);
                _firstFrame = Math.min(lastFrame-1, _settings.frames-1);
            }
            
            
            _cpt = (that.reverse === false) ?  _firstFrame : _lastFrame;
            that.loop = loop;
            _moveBkg(that);
            
            if(!that.playing) that.play(loop);
        }
        
        /**
         *
         * @params that = instance of current MovieClip object, default = this;
         */
        this.reverseAnimation = function(that) {
            that = that || this;
            that.reverse = true;
        }
        
        /**
         * 
         * @params that = instance of current MovieClip object, default = this;
         */
        this.verseAnimation = function(that) {
            that = that || this;
            that.reverse = false;
        }
        
        /**
         * toggle the animation
         * @params that = instance of current MovieClip object, default = this;
         */
        this.toggleAnimation = function(that) {
            that = that || this;
            that.reverse = !that.reverse;
        }
        
        /**
         * go to the prev frame
         * @params that = instance of current MovieClip object, default = this;
         */
        this.prevFrame = function(that) {
            that = that || this;
            that.playing = false;
            that.gotoAndStop(that.currentFrame(that) - 1);
        }
        
        /**
         * go to the next frame
         * @params that = instance of current MovieClip object, default = this;
         */
        this.nextFrame = function(that) {
            that = that || this;
            that.playing = false;
            that.gotoAndStop(that.currentFrame(that) + 1);
        }
        
        /**
         * refresh the frame tab
         */
        this.calculFrame = function(tab, that) {
            _settings.framesTab = tab || [];
            that = that || this;
            if(_settings.framesTab.length == 0 && (_settings.way == 'v' || _settings.way == 'h')) {
                var i = 0, L = that.totalFrame, w = _settings.way;
                for(var i = 0; i<L; i++) {
                    _settings.framesTab[i] = w == 'h' ? [-(i*_settings.width), 0] : [0, -(i*_settings.height)];
                }    
            }
            
        }
        
        /**************************************
         *                 private Methods                   *
         **************************************/ 
        
        /**
         * move the bkg with _cpt & a frame width
         * @params that = instance of current object, default = this;
         */
        function _moveBkg(that) {
            that = that || this;
            _$e.css('background-position', _settings.framesTab[_cpt][0]+'px '+_settings.framesTab[_cpt][1]+'px');
            if(_settings.debug) _$e.children('div.frame').text(that.currentFrame(that));
        }
        
        /**
         * enterframe method
         * @params that = instance of current object, default = this;
         */
        function _delay(that) {
            that = that || this;
            if(that.reverse === false) {
                (!that.loop && _cpt === _lastFrame ? that.stop(that) : '');
                if(that.playing === false) return;
                _cpt = (_cpt === _lastFrame) ? _firstFrame : _cpt+1;
            } else {
                (!that.loop && _cpt === _firstFrame ? that.stop(that) : '');
                if(that.playing === false) return;
                _cpt = (_cpt === _firstFrame) ? _lastFrame : _cpt-1;
            }
            if(that.stats) that.stats.update();//for dev
            _moveBkg(that);
        }
        
        /**
         * init
         */
        _settings = $.extend({},_settings, options || {});
        _settings.framesTab = 'dkoekoedkeod';
        console.log(_settings);
        
        _lastFrame = _settings.frames -1;
        this.totalFrame = _settings.frames;
        this.calculFrame(null, this);
        _$e.css('background-image',  'url('+_settings.url+')');
        
        if(_settings.debug === true) _$e.prepend('<div class="frame">1</div>');
    }
    
    

    
    /**************************************
     *             plugin instanciation                 *
     **************************************/ 
    $.fn.movieclip = function(options) {
        if ( this.length ) {
          var mc = new MovieClip(this, options);
          $.data(this, 'Movieclip', mc);  
          return mc;
        }
    };
    
})(jQuery);


