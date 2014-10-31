var RR = RR || {};

RR.Detect = (function(){

    var detect = {};

    detect.SCREEN_WIDTH   = 0;
    detect.SCREEN_HEIGHT  = 0;

    detect.LANDSCAPE      = 'LANDSCAPE';
    detect.PORTRAIT       = 'PORTRAIT';

    detect.ORIENTATION;

    detect.HAS_SHAKE      = 'ondevicemotion' in window;

    detect.REQUESTANIMFRAME =   window.requestAnimationFrame       ||
                                window.mozRequestAnimationFrame    ||
                                window.webkitRequestAnimationFrame ||
                                function( callback ){
                                    window.setTimeout(callback, 1000 / 70);
                                };
    updateScreenValues();
    updateOrentation();

    function getOrentation () {
        return (detect.SCREEN_HEIGHT > detect.SCREEN_WIDTH) ? detect.LANDSCAPE : detect.PORTRAIT;
    }

    function updateScreenValues () {
        detect.SCREEN_WIDTH   = window.innerWidth;
        detect.SCREEN_HEIGHT  = window.innerHeight;
    }

    function updateOrentation () {
        detect.ORIENTATION    = getOrentation();
    }

    detect.updateScreenValues = updateScreenValues;
    detect.updateOrentation   = updateOrentation;

    return detect;
})();

RR.EventHandler = (function(){

	function EventHandler(){

		var _this = this,
			body = document.body;

		function init(){
			_this.types = {};

			addWindowResizeEvent();
			addTouchEvents();
			addMouseEvents();
		}

		function addWindowResizeEvent(){
			_this.types.WINDOW_RESIZE = 'WINDOW_RESIZE';

			window.addEventListener('resize', function(){
				if(_this.windowResizeTO)
					clearTimeout(_this.windowResizeTO);

				_this.windowResizeTO = setTimeout(function(){

					WINDOW_WIDTH = window.innerWidth;
					WINDOW_HEIGHT = window.innerHeight;

					_this.dispatchEvent({type:_this.types.WINDOW_RESIZE,data:{width:WINDOW_WIDTH,height:WINDOW_HEIGHT}});

				},200);
			}, false);
		}

		function addTouchEvents(){
			var types = 'TOUCHSTART TOUCHMOVE TOUCHEND'.split(' ');

			for(var i = 0,j = types.length; i < j; i++){
				var type = types[i];

				_this.types[type] = type;

				body.addEventListener(type.toLowerCase(),(function(type){
					return function(e){
						_this.dispatchEvent({type:_this.types[type],data:e});
						e.preventDefault();
					}
				})(type))
			}
		}

		function addMouseEvents(){
			var types = 'MOUSEMOVE MOUSEDOWN MOUSEUP'.split(' ');

			for(var i = 0,j = types.length; i < j; i++){
				var type = types[i];

				_this.types[type] = type;

				body.addEventListener(type.toLowerCase(),(function(type){
					return function(e){
						_this.dispatchEvent({type:_this.types[type],data:e});
						e.preventDefault();
					}
				})(type))
			}
		}

		init();

	};
	
	EventHandler.prototype = new EventDispatcher();

	function EventDispatcher (){
		/**
		 * Adds an listener to an event type
		 * @param type {string}
		 * @param listener {function}
		 */
		this.addEventListener = function ( type, listener ) {
			if ( this._listeners === undefined ) this._listeners = {};

			var listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {
				listeners[ type ] = [];
			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {
				listeners[ type ].push( listener );
			}
		}

		/**
		 * Returns true if the listener exists
		 * @param type {string}
		 * @param listener {function}
		 * @return {Boolean}
		 */
		this.hasEventListener = function ( type, listener ) {
			if ( this._listeners === undefined ) return false;

			var listeners = this._listeners;

			return ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 );
		}

		/**
		 * Removes the listener from the subscriber list
		 * @param type {string}
		 * @param listener {function}
		 */
		this.removeEventListener =  function ( type, listener ) {
			if ( this._listeners === undefined ) return;

			var listeners = this._listeners,
				index = listeners[ type ].indexOf( listener );

			if ( index !== - 1 ) {
				listeners[ type ].splice( index, 1 );
			}
		};

		/**
		 * Dispatches an event of an specific type
		 * @param event {string}
		 */
		this.dispatchEvent = function ( event ) {
			if ( this._listeners === undefined ) return;

			var listeners = this._listeners,
				listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {
				event.target = this;
				for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
					listenerArray[ i ].call( this, event );
				}
			}
		}
	}

	return EventHandler;

})();

RR.ObjectController = (function(){

	function ObjectController( ctx ){
		Array.call(this);

		this._mouseDistanceTraveled = 0;
		this._mouseX    = 0;
		this._mouseY    = 0;
		this._colors    = [];
		this._ctx       = ctx;

		var _this = this;

		fillColorArray();
		
		function fillColorArray(){
			for(var i = 0,j = 360; i < j; i++){
				_this._colors.push(hsvToHex(i/360,1,1));
			}

			function hsvToHex(h, s, v) {
				var r, g, b;

				var i = Math.floor(h * 6);
				var f = h * 6 - i;
				var p = v * (1 - s);
				var q = v * (1 - f * s);
				var t = v * (1 - (1 - f) * s);

				switch (i % 6) {
					case 0: r = v, g = t, b = p; break;
					case 1: r = q, g = v, b = p; break;
					case 2: r = p, g = v, b = t; break;
					case 3: r = p, g = q, b = v; break;
					case 4: r = t, g = p, b = v; break;
					case 5: r = v, g = p, b = q; break;
				}

				r = toTwoString(Math.round(r * 255).toString(16));
				g = toTwoString(Math.round(g * 255).toString(16));
				b = toTwoString(Math.round(b * 255).toString(16));


				function toTwoString(v){
					if( v.length < 2 )
						v = '0'+v;

					return v;
				}

				return '#'+r+g+b;
			}
		}
	};

	ObjectController.prototype = [];

	ObjectController.prototype.setContext = function(ctx){
		this._ctx = ctx;
	};

	ObjectController.prototype.updateMovementValue = function(x, y, deltaX, deltaY){

		this.updateLastDelta(deltaX,deltaY);
		this.updateLastPos(x,y);

		this._mouseDistanceTraveled += Math.round(Math.abs((deltaX + deltaY) / 2));

		if(this._mouseDistanceTraveled >= 30){
			this._mouseDistanceTraveled = 0;
			this.spawn();
		}
	};

	ObjectController.prototype.updateLastPos = function(x,y){
		this._mouseX = x;
		this._mouseY = y;
	};

	ObjectController.prototype.updateLastDelta = function(deltaX,deltaY){
		this._mouseDeltaX = deltaX;
		this._mouseDeltaY = deltaY;
	};

	ObjectController.prototype.getColor = function(){
		return this._colors[Math.round(this._mouseX / RR.Detect.SCREEN_WIDTH * this._colors.length)];
	};

	ObjectController.prototype.spawn = function(){
		var ctx     = this._ctx,
			color   = this.getColor(),
			bubble  = new RR.Bubble(this.length,this._mouseX,this._mouseY,this._mouseDeltaX / 3,this._mouseDeltaY / 3,color,ctx);

		this.push(bubble);
	};

	ObjectController.prototype.draw = function(){
		for(var i = 0, j = this.length; i < j; i++){
			this[i].draw();
		}

		this.update();
	};

	ObjectController.prototype.update = function(){
		for(var i = 0, j = this.length; i < j; i++){
			if(!this[i].isVisible()){
				this.splice(i,1);
				i--;
				j--;
			}
		}
	};

	return ObjectController;

})();

RR.BubbleConnector = (function(){

	function BubbleConnector ( ctx ){
		this._ctx         = ctx;
		this._maxDistance = 100;
		this._strokeFactor = .01;
	};

	BubbleConnector.prototype.setContext = function(ctx){
		this._ctx = ctx;
	};

	BubbleConnector.prototype.draw = function(bubbles){
		var ctx = this._ctx,
			connections = this.getConnections(bubbles);

		for(var i = 0, j = connections.length; i < j; i++){
			var c = connections[i];
			ctx.beginPath();
			ctx.moveTo(c.start.x, c.start.y);
			ctx.lineTo(c.end.x, c.end.y);

			var gradient = ctx.createLinearGradient(c.start.x, c.start.y,c.end.x, c.end.y)
			gradient.addColorStop(0,c.start.color);
			gradient.addColorStop(1,c.end.color);

			ctx.strokeStyle = gradient;

			ctx.lineCap = 'butt';
			ctx.lineWidth = this._strokeFactor * c.distance;
			ctx.stroke();
		}
	};

	BubbleConnector.prototype.getConnections = function(bubbles){
		var connections = [];

		if(bubbles.length <= 1)
			return connections;

		for(var i = 0, j = bubbles.length; i < j ; i++){
			for(var k = i + 1, l = bubbles.length; k < l; k++){
				var b1 = bubbles[i],
					b2 = bubbles[k],
					startPoint  = {x: b1.getX(), y: b1.getY(), color : b1.getColor()},
					endPoint    = {x: b2.getX(), y: b2.getY(), color : b2.getColor()},
					distance    = getDistance(startPoint,endPoint);

				if(distance <= this._maxDistance){
					connections.push({
						start : startPoint,
						end   : endPoint,
						distance : distance
					})
				}
			}
		}


		function getDistance(start,end){
			return Math.sqrt(Math.pow(Math.abs(start.x-end.x),2) + Math.pow(Math.abs(start.y-end.y),2));
		}

		return connections;
	};

	return BubbleConnector;

})();

RR.Bubble = (function(){

	function Bubble ( index, x, y, sx, sy, color, ctx ){

		this._index        = index;
		this._x         = x;
		this._y         = y;
		this._speedX    = sx;
		this._speedY    = sy;

		this._color     = color;
		this._ctx       = ctx;

		this._radius    = 1;
		this._maxRadius = 10;
		this._radiusSpeed = 1;

		this.DESTROY = 'DESTROY';
	};

	Bubble.prototype.getX = function(){
		return this._x;
	};

	Bubble.prototype.getY = function(){
		return this._y;
	};

	Bubble.prototype.getColor = function(){
		return this._color;
	};

	Bubble.prototype.draw = function(){
		var ctx = this._ctx;

		ctx.fillStyle = this._color;
		ctx.beginPath();
		ctx.arc(this._x,this._y,this._radius,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		this.update();
	};

	Bubble.prototype.update = function(){
		if(this._radius <= this._maxRadius)
			this._radius += this._radiusSpeed;

		this._x += this._speedX;
		this._y += this._speedY;
	};

	Bubble.prototype.destroy = function(){
		this.dispatchEvent({type: this.DESTROY,data:this});
	};

	Bubble.prototype.isVisible = function(){
		return !(this._x < -this._maxRadius || this._x > RR.Detect.SCREEN_WIDTH + this._maxRadius || this._y < -this._maxRadius || this._y > RR.Detect.SCREEN_HEIGHT + this._maxRadius)
	};
	
	return Bubble;

})();


window.onload = function(){

  'use strict';
  
    var detect  = RR.Detect,
        events  = new RR.EventHandler(),
        objCon  = new RR.ObjectController(),
        bCon    = new RR.BubbleConnector(),
        canvas  = document.createElement('canvas'),
        ctx     = canvas.getContext('2d');

    // Setting up the canvas
    canvas.width    = detect.SCREEN_WIDTH;
    canvas.height   = detect.SCREEN_HEIGHT;

    document.body.appendChild(canvas);

    objCon.setContext(ctx);
    bCon.setContext(ctx);

    render();

    // Callback to the mouse move event on the canvas
    events.addEventListener(events.types.MOUSEMOVE,function(event){
        var e       = event.data,
            deltaX  = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
            deltaY  = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        objCon.updateMovementValue(e.pageX,e.pageY,deltaX,deltaY);
    });

    // Callback to the window resize event
    events.addEventListener(events.types.WINDOW_RESIZE,function(){
        detect.updateScreenValues();
        detect.updateOrentation();

        canvas.width    = detect.SCREEN_WIDTH;
        canvas.height   = detect.SCREEN_HEIGHT;
    });

    function render(){
        RR.Detect.REQUESTANIMFRAME.call(window,render);
        
        ctx.clearRect(0,0,canvas.width,canvas.height);

        bCon.draw(objCon);
        objCon.draw();
    }

};