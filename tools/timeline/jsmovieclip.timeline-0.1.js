/**
this is a WIP to use JSMovieclip with promise and doing things like : 
myMC.play().wait(500).changeWay().gotoAndPlay(1, false).launch(repeatNumber, fn());


@todo : pause and resume the queue
*/

(function(w) {
    function JST() {
        JSMovieclip.apply(this, arguments);
            
        this.queue = [];
        this.queueIndex = 0;
        this.lockQueue = false;
        this.callbackEndQueue = null;
        this.repeatNumber = 1;
        this._cptRepeat = 0;
        this.debug = false;
        
        var scope = this;
        for(var methodName in JSMovieclip.prototype) {
            //is a method and not "private" ?
            if(typeof this[methodName] === 'function' && methodName.indexOf('_') !== 0) {
                (function(methodName) { //dirty, i'm looking for a proper solution if u have any idea?
                    JST.prototype[methodName] = function() {
                        if(!scope.lockQueue) {
                          scope.queue.push([methodName, arguments])
                          return scope;  
                        } else {
                           return JSMovieclip.prototype[methodName].apply(this, arguments);    
                        }
                    }
                })(methodName);
            }
        }   
    }
    
    JST.prototype  = new JSMovieclip;
    
    JST.prototype.wait = function(delay) { 
        this.queue.push(['wait', arguments]);
        return this;
    }
    
    JST.prototype.launch = function(repeatNumber, cb) {
        this.callbackEndQueue = cb || null;
        this.lockQueue = true;
        this.queueIndex = -1;
        this.repeatNumber = typeof repeatNumber === 'number' || typeof repeatNumber === 'string' ? parseInt(repeatNumber) : (repeatNumber === true ? -1 : 1);
        this._walk();
        return this;                
    }
    JST.prototype.clear = function() {
        this.queue = [];
        this.lockQueue = false;
        this.queueIndex = -1;
        this.repeatNumber = 1;
        this._cptRepeat = 0;
    }
    JST.prototype._walk = function() {
        var scope = this;
        this.queueIndex++;       
        if(this.queueIndex >= this.queue.length) {
            if(this.repeatNumber !== -1) {
                this._cptRepeat++;
                if(this._cptRepeat > this.repeatNumber) {
                    this.callbackEndQueue && this.callbackEndQueue();
                    return;
                }
            }
           this.queueIndex = 0; 
        }

        var method = this.queue[this.queueIndex],
        methodName = method[0];
        if(this.debug && w.console) console.log(methodName, method[1]);
        switch(methodName) {
            
            case 'wait' : 
                setTimeout(function() {
                    scope._walk();
                }, method[1][0]); 
            break;
            case 'loopBetween':
            case 'updateFrames' :
            case 'changeWay' : 
                JSMovieclip.prototype[methodName].apply(scope, method[1]);
                scope._walk();
            break;
            default :
                var tmpStopCB = this.stopCallback || null;
                this.stopCallback =function() {
                    this.stopCallback = tmpStopCB;
                    scope._call(tmpStopCB);
                    scope._walk();
                }
                JSMovieclip.prototype[methodName].apply(scope, method[1]);
            break;
        }
    }
    
    JST.prototype._call = function(cb) {
        cb && cb.call(this);
    }
    JST.prototype._getLast = function() {
        return this.queue[this.queue.length -1];
    }
    
    w.JSMovieclipTimeline = JST;
    
})(window);