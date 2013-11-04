/**
this is a WIP to use JSMovieclip has promise and can doing things like : 
myMC.play().wait(500).then(...)

*/

(function(w) {
    function JST() {
        JSMovieclip.apply(this, arguments);
            
        this.queue = [];
        for(methodName in JSMovieclip.prototype) {
            //is a method and not "private" ?
            if(typeof this[methodName] === 'function' && methodName.indexOf('_') !== 0) {
                (function(methodName) { //dirty, i'm looking for a proper solution if u have any idea?
                    JST.prototype[methodName] = function() {
                        this.queue.push([methodName, arguments])
                        return JSMovieclip.prototype[methodName].apply(this, arguments);
                    }
                })(methodName);
            }
        }   
    }
    
    JST.prototype  = new JSMovieclip;
    
    JST.prototype.then = function(callback) {
        var lastMethodName = this._getLast()[0];
        var scope = this;
        switch(lastMethodName) {
            
            case 'wait' : 
                setTimeout(function() {
                    scope._call(callback);
                }, this._getLast()[1][0]); 
            break;
            case 'then' : 
            
            break;
            default :
                var tmpStopCB = this.stopCallback || null;
                this.stopCallback =function() {
                    this.stopCallback = tmpStopCB;
                    scope._call(tmpStopCB);
                    scope._call(callback);
                }
            
            break;
        }
        this.queue.push(['then', arguments]);
        
        return this;
    };
    
    JST.prototype.wait = function(delay) {/*
        if(this._getLast()[0] !== 'then') {
            this.queue.push(['wait', arguments]);
            this.then(    
        } else {
            this.queue.push(['wait', arguments]);
        }
*/        
        this.queue.push(['wait', arguments]);
        return this;
    }
    
    JST.prototype.loop = function() {
        
        return this;
    }
    JST.launch = function(repeat) {
         
        return this;                
    }
    
    
    JST.prototype._call = function(cb) {
    console.log(this);
        cb && cb.call(this);
    }
    JST.prototype._getLast = function() {
        return this.queue[this.queue.length -1];
    }
    
    w.JSMovieclipTimeline = JST;
    
})(window);