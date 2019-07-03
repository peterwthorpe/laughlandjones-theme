(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

/* ES6 changes:
	- declare and export _gsScope at top.
	- set var TweenLite = the result of the main function
	- export default TweenLite at the bottom
	- return TweenLite at the bottom of the main function
	- pass in _gsScope as the first parameter of the main function (which is actually at the bottom)
	- remove the "export to multiple environments" in Definition().
 */
var _gsScope = typeof window !== "undefined" ? window : typeof module !== "undefined" && module.exports && typeof global !== "undefined" ? global : undefined || {};

var TweenLite = function (window) {

	"use strict";

	var _exports = {},
	    _doc = window.document,
	    _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
	if (_globals.TweenLite) {
		return _globals.TweenLite; //in case the core set of classes is already loaded, don't instantiate twice.
	}
	var _namespace = function _namespace(ns) {
		var a = ns.split("."),
		    p = _globals,
		    i;
		for (i = 0; i < a.length; i++) {
			p[a[i]] = p = p[a[i]] || {};
		}
		return p;
	},
	    gs = _namespace("com.greensock"),
	    _tinyNum = 0.00000001,
	    _slice = function _slice(a) {
		//don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
		var b = [],
		    l = a.length,
		    i;
		for (i = 0; i !== l; b.push(a[i++])) {}
		return b;
	},
	    _emptyFunc = function _emptyFunc() {},
	    _isArray = function () {
		//works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
		var toString = Object.prototype.toString,
		    array = toString.call([]);
		return function (obj) {
			return obj != null && (obj instanceof Array || (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && !!obj.push && toString.call(obj) === array);
		};
	}(),
	    a,
	    i,
	    p,
	    _ticker,
	    _tickerActive,
	    _defLookup = {},


	/**
  * @constructor
  * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
  * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
  * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
  * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
  *
  * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
  * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
  * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
  * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
  * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
  * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
  * sandbox the banner one like:
  *
  * <script>
  *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
  * </script>
  * <script src="js/greensock/v1.7/TweenMax.js"></script>
  * <script>
  *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
  * </script>
  * <script src="js/greensock/v1.6/TweenMax.js"></script>
  * <script>
  *     gs.TweenLite.to(...); //would use v1.7
  *     TweenLite.to(...); //would use v1.6
  * </script>
  *
  * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
  * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
  * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
  * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
  */
	Definition = function Definition(ns, dependencies, func, global) {
		this.sc = _defLookup[ns] ? _defLookup[ns].sc : []; //subclasses
		_defLookup[ns] = this;
		this.gsClass = null;
		this.func = func;
		var _classes = [];
		this.check = function (init) {
			var i = dependencies.length,
			    missing = i,
			    cur,
			    a,
			    n,
			    cl;
			while (--i > -1) {
				if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
					_classes[i] = cur.gsClass;
					missing--;
				} else if (init) {
					cur.sc.push(this);
				}
			}
			if (missing === 0 && func) {
				a = ("com.greensock." + ns).split(".");
				n = a.pop();
				cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

				//exports to multiple environments
				if (global) {
					_globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
					/*
     if (typeof(module) !== "undefined" && module.exports) { //node
     	if (ns === moduleName) {
     		module.exports = _exports[moduleName] = cl;
     		for (i in _exports) {
     			cl[i] = _exports[i];
     		}
     	} else if (_exports[moduleName]) {
     		_exports[moduleName][n] = cl;
     	}
     } else if (typeof(define) === "function" && define.amd){ //AMD
     	define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
     }
     */
				}
				for (i = 0; i < this.sc.length; i++) {
					this.sc[i].check();
				}
			}
		};
		this.check(true);
	},


	//used to create Definition instances (which basically registers a class that has dependencies).
	_gsDefine = window._gsDefine = function (ns, dependencies, func, global) {
		return new Definition(ns, dependencies, func, global);
	},


	//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
	_class = gs._class = function (ns, func, global) {
		func = func || function () {};
		_gsDefine(ns, [], function () {
			return func;
		}, global);
		return func;
	};

	_gsDefine.globals = _globals;

	/*
  * ----------------------------------------------------------------
  * Ease
  * ----------------------------------------------------------------
  */
	var _baseParams = [0, 0, 1, 1],
	    Ease = _class("easing.Ease", function (func, extraParams, type, power) {
		this._func = func;
		this._type = type || 0;
		this._power = power || 0;
		this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
	}, true),
	    _easeMap = Ease.map = {},
	    _easeReg = Ease.register = function (ease, names, types, create) {
		var na = names.split(","),
		    i = na.length,
		    ta = (types || "easeIn,easeOut,easeInOut").split(","),
		    e,
		    name,
		    j,
		    type;
		while (--i > -1) {
			name = na[i];
			e = create ? _class("easing." + name, null, true) : gs.easing[name] || {};
			j = ta.length;
			while (--j > -1) {
				type = ta[j];
				_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
			}
		}
	};

	p = Ease.prototype;
	p._calcEnd = false;
	p.getRatio = function (p) {
		if (this._func) {
			this._params[0] = p;
			return this._func.apply(null, this._params);
		}
		var t = this._type,
		    pw = this._power,
		    r = t === 1 ? 1 - p : t === 2 ? p : p < 0.5 ? p * 2 : (1 - p) * 2;
		if (pw === 1) {
			r *= r;
		} else if (pw === 2) {
			r *= r * r;
		} else if (pw === 3) {
			r *= r * r * r;
		} else if (pw === 4) {
			r *= r * r * r * r;
		}
		return t === 1 ? 1 - r : t === 2 ? r : p < 0.5 ? r / 2 : 1 - r / 2;
	};

	//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
	a = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
	i = a.length;
	while (--i > -1) {
		p = a[i] + ",Power" + i;
		_easeReg(new Ease(null, null, 1, i), p, "easeOut", true);
		_easeReg(new Ease(null, null, 2, i), p, "easeIn" + (i === 0 ? ",easeNone" : ""));
		_easeReg(new Ease(null, null, 3, i), p, "easeInOut");
	}
	_easeMap.linear = gs.easing.Linear.easeIn;
	_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


	/*
  * ----------------------------------------------------------------
  * EventDispatcher
  * ----------------------------------------------------------------
  */
	var EventDispatcher = _class("events.EventDispatcher", function (target) {
		this._listeners = {};
		this._eventTarget = target || this;
	});
	p = EventDispatcher.prototype;

	p.addEventListener = function (type, callback, scope, useParam, priority) {
		priority = priority || 0;
		var list = this._listeners[type],
		    index = 0,
		    listener,
		    i;
		if (this === _ticker && !_tickerActive) {
			_ticker.wake();
		}
		if (list == null) {
			this._listeners[type] = list = [];
		}
		i = list.length;
		while (--i > -1) {
			listener = list[i];
			if (listener.c === callback && listener.s === scope) {
				list.splice(i, 1);
			} else if (index === 0 && listener.pr < priority) {
				index = i + 1;
			}
		}
		list.splice(index, 0, { c: callback, s: scope, up: useParam, pr: priority });
	};

	p.removeEventListener = function (type, callback) {
		var list = this._listeners[type],
		    i;
		if (list) {
			i = list.length;
			while (--i > -1) {
				if (list[i].c === callback) {
					list.splice(i, 1);
					return;
				}
			}
		}
	};

	p.dispatchEvent = function (type) {
		var list = this._listeners[type],
		    i,
		    t,
		    listener;
		if (list) {
			i = list.length;
			if (i > 1) {
				list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
			}
			t = this._eventTarget;
			while (--i > -1) {
				listener = list[i];
				if (listener) {
					if (listener.up) {
						listener.c.call(listener.s || t, { type: type, target: t });
					} else {
						listener.c.call(listener.s || t);
					}
				}
			}
		}
	};

	/*
  * ----------------------------------------------------------------
  * Ticker
  * ----------------------------------------------------------------
  */
	var _reqAnimFrame = window.requestAnimationFrame,
	    _cancelAnimFrame = window.cancelAnimationFrame,
	    _getTime = Date.now || function () {
		return new Date().getTime();
	},
	    _lastUpdate = _getTime();

	//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
	a = ["ms", "moz", "webkit", "o"];
	i = a.length;
	while (--i > -1 && !_reqAnimFrame) {
		_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
		_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
	}

	_class("Ticker", function (fps, useRAF) {
		var _self = this,
		    _startTime = _getTime(),
		    _useRAF = useRAF !== false && _reqAnimFrame ? "auto" : false,
		    _lagThreshold = 500,
		    _adjustedLag = 33,
		    _tickWord = "tick",
		    //helps reduce gc burden
		_fps,
		    _req,
		    _id,
		    _gap,
		    _nextTime,
		    _tick = function _tick(manual) {
			var elapsed = _getTime() - _lastUpdate,
			    overlap,
			    dispatch;
			if (elapsed > _lagThreshold) {
				_startTime += elapsed - _adjustedLag;
			}
			_lastUpdate += elapsed;
			_self.time = (_lastUpdate - _startTime) / 1000;
			overlap = _self.time - _nextTime;
			if (!_fps || overlap > 0 || manual === true) {
				_self.frame++;
				_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
				dispatch = true;
			}
			if (manual !== true) {
				//make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
				_id = _req(_tick);
			}
			if (dispatch) {
				_self.dispatchEvent(_tickWord);
			}
		};

		EventDispatcher.call(_self);
		_self.time = _self.frame = 0;
		_self.tick = function () {
			_tick(true);
		};

		_self.lagSmoothing = function (threshold, adjustedLag) {
			if (!arguments.length) {
				//if lagSmoothing() is called with no arguments, treat it like a getter that returns a boolean indicating if it's enabled or not. This is purposely undocumented and is for internal use.
				return _lagThreshold < 1 / _tinyNum;
			}
			_lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited
			_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
		};

		_self.sleep = function () {
			if (_id == null) {
				return;
			}
			if (!_useRAF || !_cancelAnimFrame) {
				clearTimeout(_id);
			} else {
				_cancelAnimFrame(_id);
			}
			_req = _emptyFunc;
			_id = null;
			if (_self === _ticker) {
				_tickerActive = false;
			}
		};

		_self.wake = function (seamless) {
			if (_id !== null) {
				_self.sleep();
			} else if (seamless) {
				_startTime += -_lastUpdate + (_lastUpdate = _getTime());
			} else if (_self.frame > 10) {
				//don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
				_lastUpdate = _getTime() - _lagThreshold + 5;
			}
			_req = _fps === 0 ? _emptyFunc : !_useRAF || !_reqAnimFrame ? function (f) {
				return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
			} : _reqAnimFrame;
			if (_self === _ticker) {
				_tickerActive = true;
			}
			_tick(2);
		};

		_self.fps = function (value) {
			if (!arguments.length) {
				return _fps;
			}
			_fps = value;
			_gap = 1 / (_fps || 60);
			_nextTime = this.time + _gap;
			_self.wake();
		};

		_self.useRAF = function (value) {
			if (!arguments.length) {
				return _useRAF;
			}
			_self.sleep();
			_useRAF = value;
			_self.fps(_fps);
		};
		_self.fps(fps);

		//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
		setTimeout(function () {
			if (_useRAF === "auto" && _self.frame < 5 && (_doc || {}).visibilityState !== "hidden") {
				_self.useRAF(false);
			}
		}, 1500);
	});

	p = gs.Ticker.prototype = new gs.events.EventDispatcher();
	p.constructor = gs.Ticker;

	/*
  * ----------------------------------------------------------------
  * Animation
  * ----------------------------------------------------------------
  */
	var Animation = _class("core.Animation", function (duration, vars) {
		this.vars = vars = vars || {};
		this._duration = this._totalDuration = duration || 0;
		this._delay = Number(vars.delay) || 0;
		this._timeScale = 1;
		this._active = !!vars.immediateRender;
		this.data = vars.data;
		this._reversed = !!vars.reversed;

		if (!_rootTimeline) {
			return;
		}
		if (!_tickerActive) {
			//some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
			_ticker.wake();
		}

		var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
		tl.add(this, tl._time);

		if (this.vars.paused) {
			this.paused(true);
		}
	});

	_ticker = Animation.ticker = new gs.Ticker();
	p = Animation.prototype;
	p._dirty = p._gc = p._initted = p._paused = false;
	p._totalTime = p._time = 0;
	p._rawPrevTime = -1;
	p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
	p._paused = false;

	//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
	var _checkTimeout = function _checkTimeout() {
		if (_tickerActive && _getTime() - _lastUpdate > 2000 && ((_doc || {}).visibilityState !== "hidden" || !_ticker.lagSmoothing())) {
			//note: if the tab is hidden, we should still wake if lagSmoothing has been disabled.
			_ticker.wake();
		}
		var t = setTimeout(_checkTimeout, 2000);
		if (t.unref) {
			// allows a node process to exit even if the timeout’s callback hasn't been invoked. Without it, the node process could hang as this function is called every two seconds.
			t.unref();
		}
	};
	_checkTimeout();

	p.play = function (from, suppressEvents) {
		if (from != null) {
			this.seek(from, suppressEvents);
		}
		return this.reversed(false).paused(false);
	};

	p.pause = function (atTime, suppressEvents) {
		if (atTime != null) {
			this.seek(atTime, suppressEvents);
		}
		return this.paused(true);
	};

	p.resume = function (from, suppressEvents) {
		if (from != null) {
			this.seek(from, suppressEvents);
		}
		return this.paused(false);
	};

	p.seek = function (time, suppressEvents) {
		return this.totalTime(Number(time), suppressEvents !== false);
	};

	p.restart = function (includeDelay, suppressEvents) {
		return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, suppressEvents !== false, true);
	};

	p.reverse = function (from, suppressEvents) {
		if (from != null) {
			this.seek(from || this.totalDuration(), suppressEvents);
		}
		return this.reversed(true).paused(false);
	};

	p.render = function (time, suppressEvents, force) {
		//stub - we override this method in subclasses.
	};

	p.invalidate = function () {
		this._time = this._totalTime = 0;
		this._initted = this._gc = false;
		this._rawPrevTime = -1;
		if (this._gc || !this.timeline) {
			this._enabled(true);
		}
		return this;
	};

	p.isActive = function () {
		var tl = this._timeline,
		    //the 2 root timelines won't have a _timeline; they're always active.
		startTime = this._startTime,
		    rawTime;
		return !tl || !this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime(true)) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale - _tinyNum;
	};

	p._enabled = function (enabled, ignoreTimeline) {
		if (!_tickerActive) {
			_ticker.wake();
		}
		this._gc = !enabled;
		this._active = this.isActive();
		if (ignoreTimeline !== true) {
			if (enabled && !this.timeline) {
				this._timeline.add(this, this._startTime - this._delay);
			} else if (!enabled && this.timeline) {
				this._timeline._remove(this, true);
			}
		}
		return false;
	};

	p._kill = function (vars, target) {
		return this._enabled(false, false);
	};

	p.kill = function (vars, target) {
		this._kill(vars, target);
		return this;
	};

	p._uncache = function (includeSelf) {
		var tween = includeSelf ? this : this.timeline;
		while (tween) {
			tween._dirty = true;
			tween = tween.timeline;
		}
		return this;
	};

	p._swapSelfInParams = function (params) {
		var i = params.length,
		    copy = params.concat();
		while (--i > -1) {
			if (params[i] === "{self}") {
				copy[i] = this;
			}
		}
		return copy;
	};

	p._callback = function (type) {
		var v = this.vars,
		    callback = v[type],
		    params = v[type + "Params"],
		    scope = v[type + "Scope"] || v.callbackScope || this,
		    l = params ? params.length : 0;
		switch (l) {//speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
			case 0:
				callback.call(scope);break;
			case 1:
				callback.call(scope, params[0]);break;
			case 2:
				callback.call(scope, params[0], params[1]);break;
			default:
				callback.apply(scope, params);
		}
	};

	//----Animation getters/setters --------------------------------------------------------

	p.eventCallback = function (type, callback, params, scope) {
		if ((type || "").substr(0, 2) === "on") {
			var v = this.vars;
			if (arguments.length === 1) {
				return v[type];
			}
			if (callback == null) {
				delete v[type];
			} else {
				v[type] = callback;
				v[type + "Params"] = _isArray(params) && params.join("").indexOf("{self}") !== -1 ? this._swapSelfInParams(params) : params;
				v[type + "Scope"] = scope;
			}
			if (type === "onUpdate") {
				this._onUpdate = callback;
			}
		}
		return this;
	};

	p.delay = function (value) {
		if (!arguments.length) {
			return this._delay;
		}
		if (this._timeline.smoothChildTiming) {
			this.startTime(this._startTime + value - this._delay);
		}
		this._delay = value;
		return this;
	};

	p.duration = function (value) {
		if (!arguments.length) {
			this._dirty = false;
			return this._duration;
		}
		this._duration = this._totalDuration = value;
		this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
		if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
			this.totalTime(this._totalTime * (value / this._duration), true);
		}
		return this;
	};

	p.totalDuration = function (value) {
		this._dirty = false;
		return !arguments.length ? this._totalDuration : this.duration(value);
	};

	p.time = function (value, suppressEvents) {
		if (!arguments.length) {
			return this._time;
		}
		if (this._dirty) {
			this.totalDuration();
		}
		return this.totalTime(value > this._duration ? this._duration : value, suppressEvents);
	};

	p.totalTime = function (time, suppressEvents, uncapped) {
		if (!_tickerActive) {
			_ticker.wake();
		}
		if (!arguments.length) {
			return this._totalTime;
		}
		if (this._timeline) {
			if (time < 0 && !uncapped) {
				time += this.totalDuration();
			}
			if (this._timeline.smoothChildTiming) {
				if (this._dirty) {
					this.totalDuration();
				}
				var totalDuration = this._totalDuration,
				    tl = this._timeline;
				if (time > totalDuration && !uncapped) {
					time = totalDuration;
				}
				this._startTime = (this._paused ? this._pauseTime : tl._time) - (!this._reversed ? time : totalDuration - time) / this._timeScale;
				if (!tl._dirty) {
					//for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
					this._uncache(false);
				}
				//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
				if (tl._timeline) {
					while (tl._timeline) {
						if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
							tl.totalTime(tl._totalTime, true);
						}
						tl = tl._timeline;
					}
				}
			}
			if (this._gc) {
				this._enabled(true, false);
			}
			if (this._totalTime !== time || this._duration === 0) {
				if (_lazyTweens.length) {
					_lazyRender();
				}
				this.render(time, suppressEvents, false);
				if (_lazyTweens.length) {
					//in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
					_lazyRender();
				}
			}
		}
		return this;
	};

	p.progress = p.totalProgress = function (value, suppressEvents) {
		var duration = this.duration();
		return !arguments.length ? duration ? this._time / duration : this.ratio : this.totalTime(duration * value, suppressEvents);
	};

	p.startTime = function (value) {
		if (!arguments.length) {
			return this._startTime;
		}
		if (value !== this._startTime) {
			this._startTime = value;
			if (this.timeline) if (this.timeline._sortChildren) {
				this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
			}
		}
		return this;
	};

	p.endTime = function (includeRepeats) {
		return this._startTime + (includeRepeats != false ? this.totalDuration() : this.duration()) / this._timeScale;
	};

	p.timeScale = function (value) {
		if (!arguments.length) {
			return this._timeScale;
		}
		var pauseTime, t;
		value = value || _tinyNum; //can't allow zero because it'll throw the math off
		if (this._timeline && this._timeline.smoothChildTiming) {
			pauseTime = this._pauseTime;
			t = pauseTime || pauseTime === 0 ? pauseTime : this._timeline.totalTime();
			this._startTime = t - (t - this._startTime) * this._timeScale / value;
		}
		this._timeScale = value;
		t = this.timeline;
		while (t && t.timeline) {
			//must update the duration/totalDuration of all ancestor timelines immediately in case in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
			t._dirty = true;
			t.totalDuration();
			t = t.timeline;
		}
		return this;
	};

	p.reversed = function (value) {
		if (!arguments.length) {
			return this._reversed;
		}
		if (value != this._reversed) {
			this._reversed = value;
			this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, true);
		}
		return this;
	};

	p.paused = function (value) {
		if (!arguments.length) {
			return this._paused;
		}
		var tl = this._timeline,
		    raw,
		    elapsed;
		if (value != this._paused) if (tl) {
			if (!_tickerActive && !value) {
				_ticker.wake();
			}
			raw = tl.rawTime();
			elapsed = raw - this._pauseTime;
			if (!value && tl.smoothChildTiming) {
				this._startTime += elapsed;
				this._uncache(false);
			}
			this._pauseTime = value ? raw : null;
			this._paused = value;
			this._active = this.isActive();
			if (!value && elapsed !== 0 && this._initted && this.duration()) {
				raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
				this.render(raw, raw === this._totalTime, true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
			}
		}
		if (this._gc && !value) {
			this._enabled(true, false);
		}
		return this;
	};

	/*
  * ----------------------------------------------------------------
  * SimpleTimeline
  * ----------------------------------------------------------------
  */
	var SimpleTimeline = _class("core.SimpleTimeline", function (vars) {
		Animation.call(this, 0, vars);
		this.autoRemoveChildren = this.smoothChildTiming = true;
	});

	p = SimpleTimeline.prototype = new Animation();
	p.constructor = SimpleTimeline;
	p.kill()._gc = false;
	p._first = p._last = p._recent = null;
	p._sortChildren = false;

	p.add = p.insert = function (child, position, align, stagger) {
		var prevTween, st;
		child._startTime = Number(position || 0) + child._delay;
		if (child._paused) if (this !== child._timeline) {
			//we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
			child._pauseTime = this.rawTime() - (child._timeline.rawTime() - child._pauseTime);
		}
		if (child.timeline) {
			child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
		}
		child.timeline = child._timeline = this;
		if (child._gc) {
			child._enabled(true, true);
		}
		prevTween = this._last;
		if (this._sortChildren) {
			st = child._startTime;
			while (prevTween && prevTween._startTime > st) {
				prevTween = prevTween._prev;
			}
		}
		if (prevTween) {
			child._next = prevTween._next;
			prevTween._next = child;
		} else {
			child._next = this._first;
			this._first = child;
		}
		if (child._next) {
			child._next._prev = child;
		} else {
			this._last = child;
		}
		child._prev = prevTween;
		this._recent = child;
		if (this._timeline) {
			this._uncache(true);
		}
		return this;
	};

	p._remove = function (tween, skipDisable) {
		if (tween.timeline === this) {
			if (!skipDisable) {
				tween._enabled(false, true);
			}

			if (tween._prev) {
				tween._prev._next = tween._next;
			} else if (this._first === tween) {
				this._first = tween._next;
			}
			if (tween._next) {
				tween._next._prev = tween._prev;
			} else if (this._last === tween) {
				this._last = tween._prev;
			}
			tween._next = tween._prev = tween.timeline = null;
			if (tween === this._recent) {
				this._recent = this._last;
			}

			if (this._timeline) {
				this._uncache(true);
			}
		}
		return this;
	};

	p.render = function (time, suppressEvents, force) {
		var tween = this._first,
		    next;
		this._totalTime = this._time = this._rawPrevTime = time;
		while (tween) {
			next = tween._next; //record it here because the value could change after rendering...
			if (tween._active || time >= tween._startTime && !tween._paused && !tween._gc) {
				if (!tween._reversed) {
					tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
				} else {
					tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
				}
			}
			tween = next;
		}
	};

	p.rawTime = function () {
		if (!_tickerActive) {
			_ticker.wake();
		}
		return this._totalTime;
	};

	/*
  * ----------------------------------------------------------------
  * TweenLite
  * ----------------------------------------------------------------
  */
	var TweenLite = _class("TweenLite", function (target, duration, vars) {
		Animation.call(this, duration, vars);
		this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

		if (target == null) {
			throw "Cannot tween a null target.";
		}

		this.target = target = typeof target !== "string" ? target : TweenLite.selector(target) || target;

		var isSelector = target.jquery || target.length && target !== window && target[0] && (target[0] === window || target[0].nodeType && target[0].style && !target.nodeType),
		    overwrite = this.vars.overwrite,
		    i,
		    targ,
		    targets;

		this._overwrite = overwrite = overwrite == null ? _overwriteLookup[TweenLite.defaultOverwrite] : typeof overwrite === "number" ? overwrite >> 0 : _overwriteLookup[overwrite];

		if ((isSelector || target instanceof Array || target.push && _isArray(target)) && typeof target[0] !== "number") {
			this._targets = targets = _slice(target); //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
			this._propLookup = [];
			this._siblings = [];
			for (i = 0; i < targets.length; i++) {
				targ = targets[i];
				if (!targ) {
					targets.splice(i--, 1);
					continue;
				} else if (typeof targ === "string") {
					targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
					if (typeof targ === "string") {
						targets.splice(i + 1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
					}
					continue;
				} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || targ[0].nodeType && targ[0].style && !targ.nodeType)) {
					//in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
					targets.splice(i--, 1);
					this._targets = targets = targets.concat(_slice(targ));
					continue;
				}
				this._siblings[i] = _register(targ, this, false);
				if (overwrite === 1) if (this._siblings[i].length > 1) {
					_applyOverwrite(targ, this, null, 1, this._siblings[i]);
				}
			}
		} else {
			this._propLookup = {};
			this._siblings = _register(target, this, false);
			if (overwrite === 1) if (this._siblings.length > 1) {
				_applyOverwrite(target, this, null, 1, this._siblings);
			}
		}
		if (this.vars.immediateRender || duration === 0 && this._delay === 0 && this.vars.immediateRender !== false) {
			this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
			this.render(Math.min(0, -this._delay)); //in case delay is negative
		}
	}, true),
	    _isSelector = function _isSelector(v) {
		return v && v.length && v !== window && v[0] && (v[0] === window || v[0].nodeType && v[0].style && !v.nodeType); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
	},
	    _autoCSS = function _autoCSS(vars, target) {
		var css = {},
		    p;
		for (p in vars) {
			if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || _plugins[p] && _plugins[p]._autoCSS)) {
				//note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
				css[p] = vars[p];
				delete vars[p];
			}
		}
		vars.css = css;
	};

	p = TweenLite.prototype = new Animation();
	p.constructor = TweenLite;
	p.kill()._gc = false;

	//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

	p.ratio = 0;
	p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
	p._notifyPluginsOfEnabled = p._lazy = false;

	TweenLite.version = "2.1.3";
	TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
	TweenLite.defaultOverwrite = "auto";
	TweenLite.ticker = _ticker;
	TweenLite.autoSleep = 120;
	TweenLite.lagSmoothing = function (threshold, adjustedLag) {
		_ticker.lagSmoothing(threshold, adjustedLag);
	};

	TweenLite.selector = window.$ || window.jQuery || function (e) {
		var selector = window.$ || window.jQuery;
		if (selector) {
			TweenLite.selector = selector;
			return selector(e);
		}
		if (!_doc) {
			//in some dev environments (like Angular 6), GSAP gets loaded before the document is defined! So re-query it here if/when necessary.
			_doc = window.document;
		}
		return !_doc ? e : _doc.querySelectorAll ? _doc.querySelectorAll(e) : _doc.getElementById(e.charAt(0) === "#" ? e.substr(1) : e);
	};

	var _lazyTweens = [],
	    _lazyLookup = {},
	    _numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
	    _relExp = /[\+-]=-?[\.\d]/,

	//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
	_setRatio = function _setRatio(v) {
		var pt = this._firstPT,
		    min = 0.000001,
		    val;
		while (pt) {
			val = !pt.blob ? pt.c * v + pt.s : v === 1 && this.end != null ? this.end : v ? this.join("") : this.start;
			if (pt.m) {
				val = pt.m.call(this._tween, val, this._target || pt.t, this._tween);
			} else if (val < min) if (val > -min && !pt.blob) {
				//prevents issues with converting very small numbers to strings in the browser
				val = 0;
			}
			if (!pt.f) {
				pt.t[pt.p] = val;
			} else if (pt.fp) {
				pt.t[pt.p](pt.fp, val);
			} else {
				pt.t[pt.p](val);
			}
			pt = pt._next;
		}
	},
	    _blobRound = function _blobRound(v) {
		return (v * 1000 | 0) / 1000 + "";
	},

	//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
	_blobDif = function _blobDif(start, end, filter, pt) {
		var a = [],
		    charIndex = 0,
		    s = "",
		    color = 0,
		    startNums,
		    endNums,
		    num,
		    i,
		    l,
		    nonNumbers,
		    currentNum;
		a.start = start;
		a.end = end;
		start = a[0] = start + ""; //ensure values are strings
		end = a[1] = end + "";
		if (filter) {
			filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
			start = a[0];
			end = a[1];
		}
		a.length = 0;
		startNums = start.match(_numbersExp) || [];
		endNums = end.match(_numbersExp) || [];
		if (pt) {
			pt._next = null;
			pt.blob = 1;
			a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
		}
		l = endNums.length;
		for (i = 0; i < l; i++) {
			currentNum = endNums[i];
			nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex) - charIndex);
			s += nonNumbers || !i ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
			charIndex += nonNumbers.length;
			if (color) {
				//sense rgba() values and round them.
				color = (color + 1) % 5;
			} else if (nonNumbers.substr(-5) === "rgba(") {
				color = 1;
			}
			if (currentNum === startNums[i] || startNums.length <= i) {
				s += currentNum;
			} else {
				if (s) {
					a.push(s);
					s = "";
				}
				num = parseFloat(startNums[i]);
				a.push(num);
				a._firstPT = { _next: a._firstPT, t: a, p: a.length - 1, s: num, c: (currentNum.charAt(1) === "=" ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : parseFloat(currentNum) - num) || 0, f: 0, m: color && color < 4 ? Math.round : _blobRound }; //limiting to 3 decimal places and casting as a string can really help performance when array.join() is called!
				//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
			}
			charIndex += currentNum.length;
		}
		s += end.substr(charIndex);
		if (s) {
			a.push(s);
		}
		a.setRatio = _setRatio;
		if (_relExp.test(end)) {
			//if the end string contains relative values, delete it so that on the final render (in _setRatio()), we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
			a.end = null;
		}
		return a;
	},

	//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
	_addPropTween = function _addPropTween(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
		if (typeof end === "function") {
			end = end(index || 0, target);
		}
		var type = _typeof(target[prop]),
		    getterName = type !== "function" ? "" : prop.indexOf("set") || typeof target["get" + prop.substr(3)] !== "function" ? prop : "get" + prop.substr(3),
		    s = start !== "get" ? start : !getterName ? target[prop] : funcParam ? target[getterName](funcParam) : target[getterName](),
		    isRelative = typeof end === "string" && end.charAt(1) === "=",
		    pt = { t: target, p: prop, s: s, f: type === "function", pg: 0, n: overwriteProp || prop, m: !mod ? 0 : typeof mod === "function" ? mod : Math.round, pr: 0, c: isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : parseFloat(end) - s || 0 },
		    blob;

		if (typeof s !== "number" || typeof end !== "number" && !isRelative) {
			if (funcParam || isNaN(s) || !isRelative && isNaN(end) || typeof s === "boolean" || typeof end === "boolean") {
				//a blob (string that has multiple numbers in it)
				pt.fp = funcParam;
				blob = _blobDif(s, isRelative ? parseFloat(pt.s) + pt.c + (pt.s + "").replace(/[0-9\-\.]/g, "") : end, stringFilter || TweenLite.defaultStringFilter, pt);
				pt = { t: blob, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: overwriteProp || prop, pr: 0, m: 0 }; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
			} else {
				pt.s = parseFloat(s);
				if (!isRelative) {
					pt.c = parseFloat(end) - pt.s || 0;
				}
			}
		}
		if (pt.c) {
			//only add it to the linked list if there's a change.
			if (pt._next = this._firstPT) {
				pt._next._prev = pt;
			}
			this._firstPT = pt;
			return pt;
		}
	},
	    _internals = TweenLite._internals = { isArray: _isArray, isSelector: _isSelector, lazyTweens: _lazyTweens, blobDif: _blobDif },
	    //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
	_plugins = TweenLite._plugins = {},
	    _tweenLookup = _internals.tweenLookup = {},
	    _tweenLookupNum = 0,
	    _reservedProps = _internals.reservedProps = { ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, immediateRender: 1, repeat: 1, repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1, lazy: 1, onOverwrite: 1, callbackScope: 1, stringFilter: 1, id: 1, yoyoEase: 1, stagger: 1 },
	    _overwriteLookup = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0 },
	    _rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
	    _rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
	    _nextGCFrame = 30,
	    _lazyRender = _internals.lazyRender = function () {
		var l = _lazyTweens.length,
		    i,
		    tween;
		_lazyLookup = {};
		for (i = 0; i < l; i++) {
			tween = _lazyTweens[i];
			if (tween && tween._lazy !== false) {
				tween.render(tween._lazy[0], tween._lazy[1], true);
				tween._lazy = false;
			}
		}
		_lazyTweens.length = 0;
	};

	_rootTimeline._startTime = _ticker.time;
	_rootFramesTimeline._startTime = _ticker.frame;
	_rootTimeline._active = _rootFramesTimeline._active = true;
	setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

	Animation._updateRoot = TweenLite.render = function () {
		var i, a, p;
		if (_lazyTweens.length) {
			//if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
			_lazyRender();
		}
		_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
		_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
		if (_lazyTweens.length) {
			_lazyRender();
		}
		if (_ticker.frame >= _nextGCFrame) {
			//dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
			_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
			for (p in _tweenLookup) {
				a = _tweenLookup[p].tweens;
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc) {
						a.splice(i, 1);
					}
				}
				if (a.length === 0) {
					delete _tweenLookup[p];
				}
			}
			//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
			p = _rootTimeline._first;
			if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
				while (p && p._paused) {
					p = p._next;
				}
				if (!p) {
					_ticker.sleep();
				}
			}
		}
	};

	_ticker.addEventListener("tick", Animation._updateRoot);

	var _register = function _register(target, tween, scrub) {
		var id = target._gsTweenID,
		    a,
		    i;
		if (!_tweenLookup[id || (target._gsTweenID = id = "t" + _tweenLookupNum++)]) {
			_tweenLookup[id] = { target: target, tweens: [] };
		}
		if (tween) {
			a = _tweenLookup[id].tweens;
			a[i = a.length] = tween;
			if (scrub) {
				while (--i > -1) {
					if (a[i] === tween) {
						a.splice(i, 1);
					}
				}
			}
		}
		return _tweenLookup[id].tweens;
	},
	    _onOverwrite = function _onOverwrite(overwrittenTween, overwritingTween, target, killedProps) {
		var func = overwrittenTween.vars.onOverwrite,
		    r1,
		    r2;
		if (func) {
			r1 = func(overwrittenTween, overwritingTween, target, killedProps);
		}
		func = TweenLite.onOverwrite;
		if (func) {
			r2 = func(overwrittenTween, overwritingTween, target, killedProps);
		}
		return r1 !== false && r2 !== false;
	},
	    _applyOverwrite = function _applyOverwrite(target, tween, props, mode, siblings) {
		var i, changed, curTween, l;
		if (mode === 1 || mode >= 4) {
			l = siblings.length;
			for (i = 0; i < l; i++) {
				if ((curTween = siblings[i]) !== tween) {
					if (!curTween._gc) {
						if (curTween._kill(null, target, tween)) {
							changed = true;
						}
					}
				} else if (mode === 5) {
					break;
				}
			}
			return changed;
		}
		//NOTE: Add tiny amount to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
		var startTime = tween._startTime + _tinyNum,
		    overlaps = [],
		    oCount = 0,
		    zeroDur = tween._duration === 0,
		    globalStart;
		i = siblings.length;
		while (--i > -1) {
			if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
				//ignore
			} else if (curTween._timeline !== tween._timeline) {
				globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
				if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
					overlaps[oCount++] = curTween;
				}
			} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= _tinyNum * 2)) {
				overlaps[oCount++] = curTween;
			}
		}

		i = oCount;
		while (--i > -1) {
			curTween = overlaps[i];
			l = curTween._firstPT; //we need to discern if there were property tweens originally; if they all get removed in the next line's _kill() call, the tween should be killed. See https://github.com/greensock/GreenSock-JS/issues/278
			if (mode === 2) if (curTween._kill(props, target, tween)) {
				changed = true;
			}
			if (mode !== 2 || !curTween._firstPT && curTween._initted && l) {
				if (mode !== 2 && !_onOverwrite(curTween, tween)) {
					continue;
				}
				if (curTween._enabled(false, false)) {
					//if all property tweens have been overwritten, kill the tween.
					changed = true;
				}
			}
		}
		return changed;
	},
	    _checkOverlap = function _checkOverlap(tween, reference, zeroDur) {
		var tl = tween._timeline,
		    ts = tl._timeScale,
		    t = tween._startTime;
		while (tl._timeline) {
			t += tl._startTime;
			ts *= tl._timeScale;
			if (tl._paused) {
				return -100;
			}
			tl = tl._timeline;
		}
		t /= ts;
		return t > reference ? t - reference : zeroDur && t === reference || !tween._initted && t - reference < 2 * _tinyNum ? _tinyNum : (t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum ? 0 : t - reference - _tinyNum;
	};

	//---- TweenLite instance methods -----------------------------------------------------------------------------

	p._init = function () {
		var v = this.vars,
		    op = this._overwrittenProps,
		    dur = this._duration,
		    immediate = !!v.immediateRender,
		    ease = v.ease,
		    startAt = this._startAt,
		    i,
		    initPlugins,
		    pt,
		    p,
		    startVars,
		    l;
		if (v.startAt) {
			if (startAt) {
				startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
				startAt.kill();
			}
			startVars = {};
			for (p in v.startAt) {
				//copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
				startVars[p] = v.startAt[p];
			}
			startVars.data = "isStart";
			startVars.overwrite = false;
			startVars.immediateRender = true;
			startVars.lazy = immediate && v.lazy !== false;
			startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
			startVars.onUpdate = v.onUpdate;
			startVars.onUpdateParams = v.onUpdateParams;
			startVars.onUpdateScope = v.onUpdateScope || v.callbackScope || this;
			this._startAt = TweenLite.to(this.target || {}, 0, startVars);
			if (immediate) {
				if (this._time > 0) {
					this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
				} else if (dur !== 0) {
					return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
				}
			}
		} else if (v.runBackwards && dur !== 0) {
			//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
			if (startAt) {
				startAt.render(-1, true);
				startAt.kill();
				this._startAt = null;
			} else {
				if (this._time !== 0) {
					//in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
					immediate = false;
				}
				pt = {};
				for (p in v) {
					//copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
					if (!_reservedProps[p] || p === "autoCSS") {
						pt[p] = v[p];
					}
				}
				pt.overwrite = 0;
				pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
				pt.lazy = immediate && v.lazy !== false;
				pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
				this._startAt = TweenLite.to(this.target, 0, pt);
				if (!immediate) {
					this._startAt._init(); //ensures that the initial values are recorded
					this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
					if (this.vars.immediateRender) {
						this._startAt = null;
					}
				} else if (this._time === 0) {
					return;
				}
			}
		}
		this._ease = ease = !ease ? TweenLite.defaultEase : ease instanceof Ease ? ease : typeof ease === "function" ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
		if (v.easeParams instanceof Array && ease.config) {
			this._ease = ease.config.apply(ease, v.easeParams);
		}
		this._easeType = this._ease._type;
		this._easePower = this._ease._power;
		this._firstPT = null;

		if (this._targets) {
			l = this._targets.length;
			for (i = 0; i < l; i++) {
				if (this._initProps(this._targets[i], this._propLookup[i] = {}, this._siblings[i], op ? op[i] : null, i)) {
					initPlugins = true;
				}
			}
		} else {
			initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
		}

		if (initPlugins) {
			TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
		}
		if (op) if (!this._firstPT) if (typeof this.target !== "function") {
			//if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
			this._enabled(false, false);
		}
		if (v.runBackwards) {
			pt = this._firstPT;
			while (pt) {
				pt.s += pt.c;
				pt.c = -pt.c;
				pt = pt._next;
			}
		}
		this._onUpdate = v.onUpdate;
		this._initted = true;
	};

	p._initProps = function (target, propLookup, siblings, overwrittenProps, index) {
		var p, i, initPlugins, plugin, pt, v;
		if (target == null) {
			return false;
		}
		if (_lazyLookup[target._gsTweenID]) {
			_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
		}

		if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) {
			//it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
			_autoCSS(this.vars, target);
		}
		for (p in this.vars) {
			v = this.vars[p];
			if (_reservedProps[p]) {
				if (v) if (v instanceof Array || v.push && _isArray(v)) if (v.join("").indexOf("{self}") !== -1) {
					this.vars[p] = v = this._swapSelfInParams(v, this);
				}
			} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {

				//t - target 		[object]
				//p - property 		[string]
				//s - start			[number]
				//c - change		[number]
				//f - isFunction	[boolean]
				//n - name			[string]
				//pg - isPlugin 	[boolean]
				//pr - priority		[number]
				//m - mod           [function | 0]
				this._firstPT = pt = { _next: this._firstPT, t: plugin, p: "setRatio", s: 0, c: 1, f: 1, n: p, pg: 1, pr: plugin._priority, m: 0 };
				i = plugin._overwriteProps.length;
				while (--i > -1) {
					propLookup[plugin._overwriteProps[i]] = this._firstPT;
				}
				if (plugin._priority || plugin._onInitAllProps) {
					initPlugins = true;
				}
				if (plugin._onDisable || plugin._onEnable) {
					this._notifyPluginsOfEnabled = true;
				}
				if (pt._next) {
					pt._next._prev = pt;
				}
			} else {
				propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
			}
		}

		if (overwrittenProps) if (this._kill(overwrittenProps, target)) {
			//another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
			return this._initProps(target, propLookup, siblings, overwrittenProps, index);
		}
		if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
			this._kill(propLookup, target);
			return this._initProps(target, propLookup, siblings, overwrittenProps, index);
		}
		if (this._firstPT) if (this.vars.lazy !== false && this._duration || this.vars.lazy && !this._duration) {
			//zero duration tweens don't lazy render by default; everything else does.
			_lazyLookup[target._gsTweenID] = true;
		}
		return initPlugins;
	};

	p.render = function (time, suppressEvents, force) {
		var self = this,
		    prevTime = self._time,
		    duration = self._duration,
		    prevRawPrevTime = self._rawPrevTime,
		    isComplete,
		    callback,
		    pt,
		    rawPrevTime;
		if (time >= duration - _tinyNum && time >= 0) {
			//to work around occasional floating point math artifacts.
			self._totalTime = self._time = duration;
			self.ratio = self._ease._calcEnd ? self._ease.getRatio(1) : 1;
			if (!self._reversed) {
				isComplete = true;
				callback = "onComplete";
				force = force || self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
			}
			if (duration === 0) if (self._initted || !self.vars.lazy || force) {
				//zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
				if (self._startTime === self._timeline._duration) {
					//if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
					time = 0;
				}
				if (prevRawPrevTime < 0 || time <= 0 && time >= -_tinyNum || prevRawPrevTime === _tinyNum && self.data !== "isPause") if (prevRawPrevTime !== time) {
					//note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
					force = true;
					if (prevRawPrevTime > _tinyNum) {
						callback = "onReverseComplete";
					}
				}
				self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
			}
		} else if (time < _tinyNum) {
			//to work around occasional floating point math artifacts, round super small values to 0.
			self._totalTime = self._time = 0;
			self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
			if (prevTime !== 0 || duration === 0 && prevRawPrevTime > 0) {
				callback = "onReverseComplete";
				isComplete = self._reversed;
			}
			if (time > -_tinyNum) {
				time = 0;
			} else if (time < 0) {
				self._active = false;
				if (duration === 0) if (self._initted || !self.vars.lazy || force) {
					//zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && self.data === "isPause")) {
						force = true;
					}
					self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}
			}
			if (!self._initted || self._startAt && self._startAt.progress()) {
				//if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately. Also, we check progress() because if startAt has already rendered at its end, we should force a render at its beginning. Otherwise, if you put the playhead directly on top of where a fromTo({immediateRender:false}) starts, and then move it backwards, the from() won't revert its values.
				force = true;
			}
		} else {
			self._totalTime = self._time = time;

			if (self._easeType) {
				var r = time / duration,
				    type = self._easeType,
				    pow = self._easePower;
				if (type === 1 || type === 3 && r >= 0.5) {
					r = 1 - r;
				}
				if (type === 3) {
					r *= 2;
				}
				if (pow === 1) {
					r *= r;
				} else if (pow === 2) {
					r *= r * r;
				} else if (pow === 3) {
					r *= r * r * r;
				} else if (pow === 4) {
					r *= r * r * r * r;
				}
				self.ratio = type === 1 ? 1 - r : type === 2 ? r : time / duration < 0.5 ? r / 2 : 1 - r / 2;
			} else {
				self.ratio = self._ease.getRatio(time / duration);
			}
		}

		if (self._time === prevTime && !force) {
			return;
		} else if (!self._initted) {
			self._init();
			if (!self._initted || self._gc) {
				//immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
				return;
			} else if (!force && self._firstPT && (self.vars.lazy !== false && self._duration || self.vars.lazy && !self._duration)) {
				self._time = self._totalTime = prevTime;
				self._rawPrevTime = prevRawPrevTime;
				_lazyTweens.push(self);
				self._lazy = [time, suppressEvents];
				return;
			}
			//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
			if (self._time && !isComplete) {
				self.ratio = self._ease.getRatio(self._time / duration);
			} else if (isComplete && self._ease._calcEnd) {
				self.ratio = self._ease.getRatio(self._time === 0 ? 0 : 1);
			}
		}
		if (self._lazy !== false) {
			//in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
			self._lazy = false;
		}
		if (!self._active) if (!self._paused && self._time !== prevTime && time >= 0) {
			self._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
		}
		if (prevTime === 0) {
			if (self._startAt) {
				if (time >= 0) {
					self._startAt.render(time, true, force);
				} else if (!callback) {
					callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
				}
			}
			if (self.vars.onStart) if (self._time !== 0 || duration === 0) if (!suppressEvents) {
				self._callback("onStart");
			}
		}
		pt = self._firstPT;
		while (pt) {
			if (pt.f) {
				pt.t[pt.p](pt.c * self.ratio + pt.s);
			} else {
				pt.t[pt.p] = pt.c * self.ratio + pt.s;
			}
			pt = pt._next;
		}

		if (self._onUpdate) {
			if (time < 0) if (self._startAt && time !== -0.0001) {
				//if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
				self._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
			}
			if (!suppressEvents) if (self._time !== prevTime || isComplete || force) {
				self._callback("onUpdate");
			}
		}
		if (callback) if (!self._gc || force) {
			//check _gc because there's a chance that kill() could be called in an onUpdate
			if (time < 0 && self._startAt && !self._onUpdate && time !== -0.0001) {
				//-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
				self._startAt.render(time, true, force);
			}
			if (isComplete) {
				if (self._timeline.autoRemoveChildren) {
					self._enabled(false, false);
				}
				self._active = false;
			}
			if (!suppressEvents && self.vars[callback]) {
				self._callback(callback);
			}
			if (duration === 0 && self._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
				//the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
				self._rawPrevTime = 0;
			}
		}
	};

	p._kill = function (vars, target, overwritingTween) {
		if (vars === "all") {
			vars = null;
		}
		if (vars == null) if (target == null || target === this.target) {
			this._lazy = false;
			return this._enabled(false, false);
		}
		target = typeof target !== "string" ? target || this._targets || this.target : TweenLite.selector(target) || target;
		var simultaneousOverwrite = overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline,
		    firstPT = this._firstPT,
		    i,
		    overwrittenProps,
		    p,
		    pt,
		    propLookup,
		    changed,
		    killProps,
		    record,
		    killed;
		if ((_isArray(target) || _isSelector(target)) && typeof target[0] !== "number") {
			i = target.length;
			while (--i > -1) {
				if (this._kill(vars, target[i], overwritingTween)) {
					changed = true;
				}
			}
		} else {
			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if (target === this._targets[i]) {
						propLookup = this._propLookup[i] || {};
						this._overwrittenProps = this._overwrittenProps || [];
						overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
						break;
					}
				}
			} else if (target !== this.target) {
				return false;
			} else {
				propLookup = this._propLookup;
				overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
			}

			if (propLookup) {
				killProps = vars || propLookup;
				record = vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && ((typeof vars === "undefined" ? "undefined" : _typeof(vars)) !== "object" || !vars._tempKill); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
				if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
					for (p in killProps) {
						if (propLookup[p]) {
							if (!killed) {
								killed = [];
							}
							killed.push(p);
						}
					}
					if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) {
						//if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
						return false;
					}
				}

				for (p in killProps) {
					if (pt = propLookup[p]) {
						if (simultaneousOverwrite) {
							//if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
							if (pt.f) {
								pt.t[pt.p](pt.s);
							} else {
								pt.t[pt.p] = pt.s;
							}
							changed = true;
						}
						if (pt.pg && pt.t._kill(killProps)) {
							changed = true; //some plugins need to be notified so they can perform cleanup tasks first
						}
						if (!pt.pg || pt.t._overwriteProps.length === 0) {
							if (pt._prev) {
								pt._prev._next = pt._next;
							} else if (pt === this._firstPT) {
								this._firstPT = pt._next;
							}
							if (pt._next) {
								pt._next._prev = pt._prev;
							}
							pt._next = pt._prev = null;
						}
						delete propLookup[p];
					}
					if (record) {
						overwrittenProps[p] = 1;
					}
				}
				if (!this._firstPT && this._initted && firstPT) {
					//if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
					this._enabled(false, false);
				}
			}
		}
		return changed;
	};

	p.invalidate = function () {
		if (this._notifyPluginsOfEnabled) {
			TweenLite._onPluginEvent("_onDisable", this);
		}
		var t = this._time;
		this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
		this._notifyPluginsOfEnabled = this._active = this._lazy = false;
		this._propLookup = this._targets ? {} : [];
		Animation.prototype.invalidate.call(this);
		if (this.vars.immediateRender) {
			this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
			this.render(t, false, this.vars.lazy !== false);
		}
		return this;
	};

	p._enabled = function (enabled, ignoreTimeline) {
		if (!_tickerActive) {
			_ticker.wake();
		}
		if (enabled && this._gc) {
			var targets = this._targets,
			    i;
			if (targets) {
				i = targets.length;
				while (--i > -1) {
					this._siblings[i] = _register(targets[i], this, true);
				}
			} else {
				this._siblings = _register(this.target, this, true);
			}
		}
		Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
		if (this._notifyPluginsOfEnabled) if (this._firstPT) {
			return TweenLite._onPluginEvent(enabled ? "_onEnable" : "_onDisable", this);
		}
		return false;
	};

	//----TweenLite static methods -----------------------------------------------------

	TweenLite.to = function (target, duration, vars) {
		return new TweenLite(target, duration, vars);
	};

	TweenLite.from = function (target, duration, vars) {
		vars.runBackwards = true;
		vars.immediateRender = vars.immediateRender != false;
		return new TweenLite(target, duration, vars);
	};

	TweenLite.fromTo = function (target, duration, fromVars, toVars) {
		toVars.startAt = fromVars;
		toVars.immediateRender = toVars.immediateRender != false && fromVars.immediateRender != false;
		return new TweenLite(target, duration, toVars);
	};

	TweenLite.delayedCall = function (delay, callback, params, scope, useFrames) {
		return new TweenLite(callback, 0, { delay: delay, onComplete: callback, onCompleteParams: params, callbackScope: scope, onReverseComplete: callback, onReverseCompleteParams: params, immediateRender: false, lazy: false, useFrames: useFrames, overwrite: 0 });
	};

	TweenLite.set = function (target, vars) {
		return new TweenLite(target, 0, vars);
	};

	TweenLite.getTweensOf = function (target, onlyActive) {
		if (target == null) {
			return [];
		}
		target = typeof target !== "string" ? target : TweenLite.selector(target) || target;
		var i, a, j, t;
		if ((_isArray(target) || _isSelector(target)) && typeof target[0] !== "number") {
			i = target.length;
			a = [];
			while (--i > -1) {
				a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
			}
			i = a.length;
			//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
			while (--i > -1) {
				t = a[i];
				j = i;
				while (--j > -1) {
					if (t === a[j]) {
						a.splice(i, 1);
					}
				}
			}
		} else if (target._gsTweenID) {
			a = _register(target).concat();
			i = a.length;
			while (--i > -1) {
				if (a[i]._gc || onlyActive && !a[i].isActive()) {
					a.splice(i, 1);
				}
			}
		}
		return a || [];
	};

	TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function (target, onlyActive, vars) {
		if ((typeof onlyActive === "undefined" ? "undefined" : _typeof(onlyActive)) === "object") {
			vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
			onlyActive = false;
		}
		var a = TweenLite.getTweensOf(target, onlyActive),
		    i = a.length;
		while (--i > -1) {
			a[i]._kill(vars, target);
		}
	};

	/*
  * ----------------------------------------------------------------
  * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
  * ----------------------------------------------------------------
  */
	var TweenPlugin = _class("plugins.TweenPlugin", function (props, priority) {
		this._overwriteProps = (props || "").split(",");
		this._propName = this._overwriteProps[0];
		this._priority = priority || 0;
		this._super = TweenPlugin.prototype;
	}, true);

	p = TweenPlugin.prototype;
	TweenPlugin.version = "1.19.0";
	TweenPlugin.API = 2;
	p._firstPT = null;
	p._addTween = _addPropTween;
	p.setRatio = _setRatio;

	p._kill = function (lookup) {
		var a = this._overwriteProps,
		    pt = this._firstPT,
		    i;
		if (lookup[this._propName] != null) {
			this._overwriteProps = [];
		} else {
			i = a.length;
			while (--i > -1) {
				if (lookup[a[i]] != null) {
					a.splice(i, 1);
				}
			}
		}
		while (pt) {
			if (lookup[pt.n] != null) {
				if (pt._next) {
					pt._next._prev = pt._prev;
				}
				if (pt._prev) {
					pt._prev._next = pt._next;
					pt._prev = null;
				} else if (this._firstPT === pt) {
					this._firstPT = pt._next;
				}
			}
			pt = pt._next;
		}
		return false;
	};

	p._mod = p._roundProps = function (lookup) {
		var pt = this._firstPT,
		    val;
		while (pt) {
			val = lookup[this._propName] || pt.n != null && lookup[pt.n.split(this._propName + "_").join("")];
			if (val && typeof val === "function") {
				//some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
				if (pt.f === 2) {
					pt.t._applyPT.m = val;
				} else {
					pt.m = val;
				}
			}
			pt = pt._next;
		}
	};

	TweenLite._onPluginEvent = function (type, tween) {
		var pt = tween._firstPT,
		    changed,
		    pt2,
		    first,
		    last,
		    next;
		if (type === "_onInitAllProps") {
			//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
			while (pt) {
				next = pt._next;
				pt2 = first;
				while (pt2 && pt2.pr > pt.pr) {
					pt2 = pt2._next;
				}
				if (pt._prev = pt2 ? pt2._prev : last) {
					pt._prev._next = pt;
				} else {
					first = pt;
				}
				if (pt._next = pt2) {
					pt2._prev = pt;
				} else {
					last = pt;
				}
				pt = next;
			}
			pt = tween._firstPT = first;
		}
		while (pt) {
			if (pt.pg) if (typeof pt.t[type] === "function") if (pt.t[type]()) {
				changed = true;
			}
			pt = pt._next;
		}
		return changed;
	};

	TweenPlugin.activate = function (plugins) {
		var i = plugins.length;
		while (--i > -1) {
			if (plugins[i].API === TweenPlugin.API) {
				_plugins[new plugins[i]()._propName] = plugins[i];
			}
		}
		return true;
	};

	//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
	_gsDefine.plugin = function (config) {
		if (!config || !config.propName || !config.init || !config.API) {
			throw "illegal plugin definition.";
		}
		var propName = config.propName,
		    priority = config.priority || 0,
		    overwriteProps = config.overwriteProps,
		    map = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_mod", mod: "_mod", initAll: "_onInitAllProps" },
		    Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin", function () {
			TweenPlugin.call(this, propName, priority);
			this._overwriteProps = overwriteProps || [];
		}, config.global === true),
		    p = Plugin.prototype = new TweenPlugin(propName),
		    prop;
		p.constructor = Plugin;
		Plugin.API = config.API;
		for (prop in map) {
			if (typeof config[prop] === "function") {
				p[map[prop]] = config[prop];
			}
		}
		Plugin.version = config.version;
		TweenPlugin.activate([Plugin]);
		return Plugin;
	};

	//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
	a = window._gsQueue;
	if (a) {
		for (i = 0; i < a.length; i++) {
			a[i]();
		}
		for (p in _defLookup) {
			if (!_defLookup[p].func) {
				window.console.log("GSAP encountered missing dependency: " + p);
			}
		}
	}

	_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

	return TweenLite;
}(_gsScope, "TweenLite");

var globals = _gsScope.GreenSockGlobals;
var nonGlobals$1 = globals.com.greensock;
var SimpleTimeline = nonGlobals$1.core.SimpleTimeline;
var Animation = nonGlobals$1.core.Animation;
var Ease = globals.Ease;






var TweenPlugin = globals.TweenPlugin;

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

_gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function () {

	var TimelineLite = function TimelineLite(vars) {
		SimpleTimeline.call(this, vars);
		var self = this,
		    v = self.vars,
		    val,
		    p;
		self._labels = {};
		self.autoRemoveChildren = !!v.autoRemoveChildren;
		self.smoothChildTiming = !!v.smoothChildTiming;
		self._sortChildren = true;
		self._onUpdate = v.onUpdate;
		for (p in v) {
			val = v[p];
			if (_isArray(val)) if (val.join("").indexOf("{self}") !== -1) {
				v[p] = self._swapSelfInParams(val);
			}
		}
		if (_isArray(v.tweens)) {
			self.add(v.tweens, 0, v.align, v.stagger);
		}
	},
	    _tinyNum = 0.00000001,
	    TweenLiteInternals = TweenLite._internals,
	    _internals = TimelineLite._internals = {},
	    _isSelector = TweenLiteInternals.isSelector,
	    _isArray = TweenLiteInternals.isArray,
	    _lazyTweens = TweenLiteInternals.lazyTweens,
	    _lazyRender = TweenLiteInternals.lazyRender,
	    _globals = _gsScope._gsDefine.globals,
	    _copy = function _copy(vars) {
		var copy = {},
		    p;
		for (p in vars) {
			copy[p] = vars[p];
		}
		return copy;
	},
	    _applyCycle = function _applyCycle(vars, targets, i) {
		var alt = vars.cycle,
		    p,
		    val;
		for (p in alt) {
			val = alt[p];
			vars[p] = typeof val === "function" ? val(i, targets[i], targets) : val[i % val.length];
		}
		delete vars.cycle;
	},
	    _pauseCallback = _internals.pauseCallback = function () {},
	    _slice = function _slice(a) {
		//don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
		var b = [],
		    l = a.length,
		    i;
		for (i = 0; i !== l; b.push(a[i++])) {}
		return b;
	},
	    _defaultImmediateRender = function _defaultImmediateRender(tl, toVars, fromVars, defaultFalse) {
		//default to immediateRender:true unless otherwise set in toVars, fromVars or if defaultFalse is passed in as true
		var ir = "immediateRender";
		if (!(ir in toVars)) {
			toVars[ir] = !(fromVars && fromVars[ir] === false || defaultFalse);
		}
		return toVars;
	},

	//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
	_distribute = function _distribute(v) {
		if (typeof v === "function") {
			return v;
		}
		var vars = (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" ? v : { each: v },
		    //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
		ease = vars.ease,
		    from = vars.from || 0,
		    base = vars.base || 0,
		    cache = {},
		    isFromKeyword = isNaN(from),
		    axis = vars.axis,
		    ratio = { center: 0.5, end: 1 }[from] || 0;
		return function (i, target, a) {
			var l = (a || vars).length,
			    distances = cache[l],
			    originX,
			    originY,
			    x,
			    y,
			    d,
			    j,
			    max,
			    min,
			    wrap;
			if (!distances) {
				wrap = vars.grid === "auto" ? 0 : (vars.grid || [Infinity])[0];
				if (!wrap) {
					max = -Infinity;
					while (max < (max = a[wrap++].getBoundingClientRect().left) && wrap < l) {}
					wrap--;
				}
				distances = cache[l] = [];
				originX = isFromKeyword ? Math.min(wrap, l) * ratio - 0.5 : from % wrap;
				originY = isFromKeyword ? l * ratio / wrap - 0.5 : from / wrap | 0;
				max = 0;
				min = Infinity;
				for (j = 0; j < l; j++) {
					x = j % wrap - originX;
					y = originY - (j / wrap | 0);
					distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
					if (d > max) {
						max = d;
					}
					if (d < min) {
						min = d;
					}
				}
				distances.max = max - min;
				distances.min = min;
				distances.v = l = vars.amount || vars.each * (wrap > l ? l - 1 : !axis ? Math.max(wrap, l / wrap) : axis === "y" ? l / wrap : wrap) || 0;
				distances.b = l < 0 ? base - l : base;
			}
			l = (distances[i] - distances.min) / distances.max;
			return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
		};
	},
	    p = TimelineLite.prototype = new SimpleTimeline();

	TimelineLite.version = "2.1.3";
	TimelineLite.distribute = _distribute;
	p.constructor = TimelineLite;
	p.kill()._gc = p._forcingPlayhead = p._hasPause = false;

	/* might use later...
 //translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
 function localToGlobal(time, animation) {
 	while (animation) {
 		time = (time / animation._timeScale) + animation._startTime;
 		animation = animation.timeline;
 	}
 	return time;
 }
 	//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
 function globalToLocal(time, animation) {
 	var scale = 1;
 	time -= localToGlobal(0, animation);
 	while (animation) {
 		scale *= animation._timeScale;
 		animation = animation.timeline;
 	}
 	return time * scale;
 }
 */

	p.to = function (target, duration, vars, position) {
		var Engine = vars.repeat && _globals.TweenMax || TweenLite;
		return duration ? this.add(new Engine(target, duration, vars), position) : this.set(target, vars, position);
	};

	p.from = function (target, duration, vars, position) {
		return this.add((vars.repeat && _globals.TweenMax || TweenLite).from(target, duration, _defaultImmediateRender(this, vars)), position);
	};

	p.fromTo = function (target, duration, fromVars, toVars, position) {
		var Engine = toVars.repeat && _globals.TweenMax || TweenLite;
		toVars = _defaultImmediateRender(this, toVars, fromVars);
		return duration ? this.add(Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
	};

	p.staggerTo = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		var tl = new TimelineLite({ onComplete: onCompleteAll, onCompleteParams: onCompleteAllParams, callbackScope: onCompleteAllScope, smoothChildTiming: this.smoothChildTiming }),
		    staggerFunc = _distribute(vars.stagger || stagger),
		    startAt = vars.startAt,
		    cycle = vars.cycle,
		    copy,
		    i;
		if (typeof targets === "string") {
			targets = TweenLite.selector(targets) || targets;
		}
		targets = targets || [];
		if (_isSelector(targets)) {
			//if the targets object is a selector, translate it into an array.
			targets = _slice(targets);
		}
		for (i = 0; i < targets.length; i++) {
			copy = _copy(vars);
			if (startAt) {
				copy.startAt = _copy(startAt);
				if (startAt.cycle) {
					_applyCycle(copy.startAt, targets, i);
				}
			}
			if (cycle) {
				_applyCycle(copy, targets, i);
				if (copy.duration != null) {
					duration = copy.duration;
					delete copy.duration;
				}
			}
			tl.to(targets[i], duration, copy, staggerFunc(i, targets[i], targets));
		}
		return this.add(tl, position);
	};

	p.staggerFrom = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		vars.runBackwards = true;
		return this.staggerTo(targets, duration, _defaultImmediateRender(this, vars), stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
	};

	p.staggerFromTo = function (targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		toVars.startAt = fromVars;
		return this.staggerTo(targets, duration, _defaultImmediateRender(this, toVars, fromVars), stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
	};

	p.call = function (callback, params, scope, position) {
		return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
	};

	p.set = function (target, vars, position) {
		return this.add(new TweenLite(target, 0, _defaultImmediateRender(this, vars, null, true)), position);
	};

	TimelineLite.exportRoot = function (vars, ignoreDelayedCalls) {
		vars = vars || {};
		if (vars.smoothChildTiming == null) {
			vars.smoothChildTiming = true;
		}
		var tl = new TimelineLite(vars),
		    root = tl._timeline,
		    hasNegativeStart,
		    time,
		    tween,
		    next;
		if (ignoreDelayedCalls == null) {
			ignoreDelayedCalls = true;
		}
		root._remove(tl, true);
		tl._startTime = 0;
		tl._rawPrevTime = tl._time = tl._totalTime = root._time;
		tween = root._first;
		while (tween) {
			next = tween._next;
			if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
				time = tween._startTime - tween._delay;
				if (time < 0) {
					hasNegativeStart = 1;
				}
				tl.add(tween, time);
			}
			tween = next;
		}
		root.add(tl, 0);
		if (hasNegativeStart) {
			//calling totalDuration() will force the adjustment necessary to shift the children forward so none of them start before zero, and moves the timeline backwards the same amount, so the playhead is still aligned where it should be globally, but the timeline doesn't have illegal children that start before zero.
			tl.totalDuration();
		}
		return tl;
	};

	p.add = function (value, position, align, stagger) {
		var self = this,
		    curTime,
		    l,
		    i,
		    child,
		    tl,
		    beforeRawTime;
		if (typeof position !== "number") {
			position = self._parseTimeOrLabel(position, 0, true, value);
		}
		if (!(value instanceof Animation)) {
			if (value instanceof Array || value && value.push && _isArray(value)) {
				align = align || "normal";
				stagger = stagger || 0;
				curTime = position;
				l = value.length;
				for (i = 0; i < l; i++) {
					if (_isArray(child = value[i])) {
						child = new TimelineLite({ tweens: child });
					}
					self.add(child, curTime);
					if (typeof child !== "string" && typeof child !== "function") {
						if (align === "sequence") {
							curTime = child._startTime + child.totalDuration() / child._timeScale;
						} else if (align === "start") {
							child._startTime -= child.delay();
						}
					}
					curTime += stagger;
				}
				return self._uncache(true);
			} else if (typeof value === "string") {
				return self.addLabel(value, position);
			} else if (typeof value === "function") {
				value = TweenLite.delayedCall(0, value);
			} else {
				throw "Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.";
			}
		}

		SimpleTimeline.prototype.add.call(self, value, position);

		if (value._time || !value._duration && value._initted) {
			//in case, for example, the _startTime is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
			curTime = (self.rawTime() - value._startTime) * value._timeScale;
			if (!value._duration || Math.abs(Math.max(0, Math.min(value.totalDuration(), curTime))) - value._totalTime > 0.00001) {
				value.render(curTime, false, false);
			}
		}

		//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
		if (self._gc || self._time === self._duration) if (!self._paused) if (self._duration < self.duration()) {
			//in case any of the ancestors had completed but should now be enabled...
			tl = self;
			beforeRawTime = tl.rawTime() > value._startTime; //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
			while (tl._timeline) {
				if (beforeRawTime && tl._timeline.smoothChildTiming) {
					tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
				} else if (tl._gc) {
					tl._enabled(true, false);
				}
				tl = tl._timeline;
			}
		}

		return self;
	};

	p.remove = function (value) {
		if (value instanceof Animation) {
			this._remove(value, false);
			var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
			value._startTime = (value._paused ? value._pauseTime : tl._time) - (!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale; //ensure that if it gets played again, the timing is correct.
			return this;
		} else if (value instanceof Array || value && value.push && _isArray(value)) {
			var i = value.length;
			while (--i > -1) {
				this.remove(value[i]);
			}
			return this;
		} else if (typeof value === "string") {
			return this.removeLabel(value);
		}
		return this.kill(null, value);
	};

	p._remove = function (tween, skipDisable) {
		SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
		var last = this._last;
		if (!last) {
			this._time = this._totalTime = this._duration = this._totalDuration = 0;
		} else if (this._time > this.duration()) {
			this._time = this._duration;
			this._totalTime = this._totalDuration;
		}
		return this;
	};

	p.append = function (value, offsetOrLabel) {
		return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
	};

	p.insert = p.insertMultiple = function (value, position, align, stagger) {
		return this.add(value, position || 0, align, stagger);
	};

	p.appendMultiple = function (tweens, offsetOrLabel, align, stagger) {
		return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
	};

	p.addLabel = function (label, position) {
		this._labels[label] = this._parseTimeOrLabel(position);
		return this;
	};

	p.addPause = function (position, callback, params, scope) {
		var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
		t.vars.onComplete = t.vars.onReverseComplete = callback;
		t.data = "isPause";
		this._hasPause = true;
		return this.add(t, position);
	};

	p.removeLabel = function (label) {
		delete this._labels[label];
		return this;
	};

	p.getLabelTime = function (label) {
		return this._labels[label] != null ? this._labels[label] : -1;
	};

	p._parseTimeOrLabel = function (timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
		var clippedDuration, i;
		//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
		if (ignore instanceof Animation && ignore.timeline === this) {
			this.remove(ignore);
		} else if (ignore && (ignore instanceof Array || ignore.push && _isArray(ignore))) {
			i = ignore.length;
			while (--i > -1) {
				if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
					this.remove(ignore[i]);
				}
			}
		}
		clippedDuration = typeof timeOrLabel === "number" && !offsetOrLabel ? 0 : this.duration() > 99999999999 ? this.recent().endTime(false) : this._duration; //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
		if (typeof offsetOrLabel === "string") {
			return this._parseTimeOrLabel(offsetOrLabel, appendIfAbsent && typeof timeOrLabel === "number" && this._labels[offsetOrLabel] == null ? timeOrLabel - clippedDuration : 0, appendIfAbsent);
		}
		offsetOrLabel = offsetOrLabel || 0;
		if (typeof timeOrLabel === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) {
			//if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
			i = timeOrLabel.indexOf("=");
			if (i === -1) {
				if (this._labels[timeOrLabel] == null) {
					return appendIfAbsent ? this._labels[timeOrLabel] = clippedDuration + offsetOrLabel : offsetOrLabel;
				}
				return this._labels[timeOrLabel] + offsetOrLabel;
			}
			offsetOrLabel = parseInt(timeOrLabel.charAt(i - 1) + "1", 10) * Number(timeOrLabel.substr(i + 1));
			timeOrLabel = i > 1 ? this._parseTimeOrLabel(timeOrLabel.substr(0, i - 1), 0, appendIfAbsent) : clippedDuration;
		} else if (timeOrLabel == null) {
			timeOrLabel = clippedDuration;
		}
		return Number(timeOrLabel) + offsetOrLabel;
	};

	p.seek = function (position, suppressEvents) {
		return this.totalTime(typeof position === "number" ? position : this._parseTimeOrLabel(position), suppressEvents !== false);
	};

	p.stop = function () {
		return this.paused(true);
	};

	p.gotoAndPlay = function (position, suppressEvents) {
		return this.play(position, suppressEvents);
	};

	p.gotoAndStop = function (position, suppressEvents) {
		return this.pause(position, suppressEvents);
	};

	p.render = function (time, suppressEvents, force) {
		if (this._gc) {
			this._enabled(true, false);
		}
		var self = this,
		    prevTime = self._time,
		    totalDur = !self._dirty ? self._totalDuration : self.totalDuration(),
		    prevStart = self._startTime,
		    prevTimeScale = self._timeScale,
		    prevPaused = self._paused,
		    tween,
		    isComplete,
		    next,
		    callback,
		    internalForce,
		    pauseTween,
		    curTime,
		    pauseTime;
		if (prevTime !== self._time) {
			//if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
			time += self._time - prevTime;
		}
		if (self._hasPause && !self._forcingPlayhead && !suppressEvents) {
			if (time > prevTime) {
				tween = self._first;
				while (tween && tween._startTime <= time && !pauseTween) {
					if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && self._rawPrevTime === 0)) {
						pauseTween = tween;
					}
					tween = tween._next;
				}
			} else {
				tween = self._last;
				while (tween && tween._startTime >= time && !pauseTween) {
					if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
						pauseTween = tween;
					}
					tween = tween._prev;
				}
			}
			if (pauseTween) {
				self._time = self._totalTime = time = pauseTween._startTime;
				pauseTime = self._startTime + (self._reversed ? self._duration - time : time) / self._timeScale;
			}
		}
		if (time >= totalDur - _tinyNum && time >= 0) {
			//to work around occasional floating point math artifacts.
			self._totalTime = self._time = totalDur;
			if (!self._reversed) if (!self._hasPausedChild()) {
				isComplete = true;
				callback = "onComplete";
				internalForce = !!self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				if (self._duration === 0) if (time <= 0 && time >= -_tinyNum || self._rawPrevTime < 0 || self._rawPrevTime === _tinyNum) if (self._rawPrevTime !== time && self._first) {
					internalForce = true;
					if (self._rawPrevTime > _tinyNum) {
						callback = "onReverseComplete";
					}
				}
			}
			self._rawPrevTime = self._duration || !suppressEvents || time || self._rawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
			time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.
		} else if (time < _tinyNum) {
			//to work around occasional floating point math artifacts, round super small values to 0.
			self._totalTime = self._time = 0;
			if (time > -_tinyNum) {
				time = 0;
			}
			if (prevTime !== 0 || self._duration === 0 && self._rawPrevTime !== _tinyNum && (self._rawPrevTime > 0 || time < 0 && self._rawPrevTime >= 0)) {
				callback = "onReverseComplete";
				isComplete = self._reversed;
			}
			if (time < 0) {
				self._active = false;
				if (self._timeline.autoRemoveChildren && self._reversed) {
					//ensures proper GC if a timeline is resumed after it's finished reversing.
					internalForce = isComplete = true;
					callback = "onReverseComplete";
				} else if (self._rawPrevTime >= 0 && self._first) {
					//when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
					internalForce = true;
				}
				self._rawPrevTime = time;
			} else {
				self._rawPrevTime = self._duration || !suppressEvents || time || self._rawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				if (time === 0 && isComplete) {
					//if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
					tween = self._first;
					while (tween && tween._startTime === 0) {
						if (!tween._duration) {
							isComplete = false;
						}
						tween = tween._next;
					}
				}
				time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
				if (!self._initted) {
					internalForce = true;
				}
			}
		} else {
			self._totalTime = self._time = self._rawPrevTime = time;
		}
		if ((self._time === prevTime || !self._first) && !force && !internalForce && !pauseTween) {
			return;
		} else if (!self._initted) {
			self._initted = true;
		}

		if (!self._active) if (!self._paused && self._time !== prevTime && time > 0) {
			self._active = true; //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
		}

		if (prevTime === 0) if (self.vars.onStart) if (self._time !== 0 || !self._duration) if (!suppressEvents) {
			self._callback("onStart");
		}

		curTime = self._time;
		if (curTime >= prevTime) {
			tween = self._first;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (curTime !== self._time || self._paused && !prevPaused) {
					//in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
					break;
				} else if (tween._active || tween._startTime <= curTime && !tween._paused && !tween._gc) {
					if (pauseTween === tween) {
						self.pause();
						self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
					}
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
					}
				}
				tween = next;
			}
		} else {
			tween = self._last;
			while (tween) {
				next = tween._prev; //record it here because the value could change after rendering...
				if (curTime !== self._time || self._paused && !prevPaused) {
					//in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
					break;
				} else if (tween._active || tween._startTime <= prevTime && !tween._paused && !tween._gc) {
					if (pauseTween === tween) {
						pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
						while (pauseTween && pauseTween.endTime() > self._time) {
							pauseTween.render(pauseTween._reversed ? pauseTween.totalDuration() - (time - pauseTween._startTime) * pauseTween._timeScale : (time - pauseTween._startTime) * pauseTween._timeScale, suppressEvents, force);
							pauseTween = pauseTween._prev;
						}
						pauseTween = null;
						self.pause();
						self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
					}
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
					}
				}
				tween = next;
			}
		}

		if (self._onUpdate) if (!suppressEvents) {
			if (_lazyTweens.length) {
				//in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
				_lazyRender();
			}
			self._callback("onUpdate");
		}

		if (callback) if (!self._gc) if (prevStart === self._startTime || prevTimeScale !== self._timeScale) if (self._time === 0 || totalDur >= self.totalDuration()) {
			//if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
			if (isComplete) {
				if (_lazyTweens.length) {
					//in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				if (self._timeline.autoRemoveChildren) {
					self._enabled(false, false);
				}
				self._active = false;
			}
			if (!suppressEvents && self.vars[callback]) {
				self._callback(callback);
			}
		}
	};

	p._hasPausedChild = function () {
		var tween = this._first;
		while (tween) {
			if (tween._paused || tween instanceof TimelineLite && tween._hasPausedChild()) {
				return true;
			}
			tween = tween._next;
		}
		return false;
	};

	p.getChildren = function (nested, tweens, timelines, ignoreBeforeTime) {
		ignoreBeforeTime = ignoreBeforeTime || -9999999999;
		var a = [],
		    tween = this._first,
		    cnt = 0;
		while (tween) {
			if (tween._startTime < ignoreBeforeTime) {
				//do nothing
			} else if (tween instanceof TweenLite) {
				if (tweens !== false) {
					a[cnt++] = tween;
				}
			} else {
				if (timelines !== false) {
					a[cnt++] = tween;
				}
				if (nested !== false) {
					a = a.concat(tween.getChildren(true, tweens, timelines));
					cnt = a.length;
				}
			}
			tween = tween._next;
		}
		return a;
	};

	p.getTweensOf = function (target, nested) {
		var disabled = this._gc,
		    a = [],
		    cnt = 0,
		    tweens,
		    i;
		if (disabled) {
			this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
		}
		tweens = TweenLite.getTweensOf(target);
		i = tweens.length;
		while (--i > -1) {
			if (tweens[i].timeline === this || nested && this._contains(tweens[i])) {
				a[cnt++] = tweens[i];
			}
		}
		if (disabled) {
			this._enabled(false, true);
		}
		return a;
	};

	p.recent = function () {
		return this._recent;
	};

	p._contains = function (tween) {
		var tl = tween.timeline;
		while (tl) {
			if (tl === this) {
				return true;
			}
			tl = tl.timeline;
		}
		return false;
	};

	p.shiftChildren = function (amount, adjustLabels, ignoreBeforeTime) {
		ignoreBeforeTime = ignoreBeforeTime || 0;
		var tween = this._first,
		    labels = this._labels,
		    p;
		while (tween) {
			if (tween._startTime >= ignoreBeforeTime) {
				tween._startTime += amount;
			}
			tween = tween._next;
		}
		if (adjustLabels) {
			for (p in labels) {
				if (labels[p] >= ignoreBeforeTime) {
					labels[p] += amount;
				}
			}
		}
		return this._uncache(true);
	};

	p._kill = function (vars, target) {
		if (!vars && !target) {
			return this._enabled(false, false);
		}
		var tweens = !target ? this.getChildren(true, true, false) : this.getTweensOf(target),
		    i = tweens.length,
		    changed = false;
		while (--i > -1) {
			if (tweens[i]._kill(vars, target)) {
				changed = true;
			}
		}
		return changed;
	};

	p.clear = function (labels) {
		var tweens = this.getChildren(false, true, true),
		    i = tweens.length;
		this._time = this._totalTime = 0;
		while (--i > -1) {
			tweens[i]._enabled(false, false);
		}
		if (labels !== false) {
			this._labels = {};
		}
		return this._uncache(true);
	};

	p.invalidate = function () {
		var tween = this._first;
		while (tween) {
			tween.invalidate();
			tween = tween._next;
		}
		return Animation.prototype.invalidate.call(this);
	};

	p._enabled = function (enabled, ignoreTimeline) {
		if (enabled === this._gc) {
			var tween = this._first;
			while (tween) {
				tween._enabled(enabled, true);
				tween = tween._next;
			}
		}
		return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
	};

	p.totalTime = function (time, suppressEvents, uncapped) {
		this._forcingPlayhead = true;
		var val = Animation.prototype.totalTime.apply(this, arguments);
		this._forcingPlayhead = false;
		return val;
	};

	p.duration = function (value) {
		if (!arguments.length) {
			if (this._dirty) {
				this.totalDuration(); //just triggers recalculation
			}
			return this._duration;
		}
		if (this.duration() !== 0 && value !== 0) {
			this.timeScale(this._duration / value);
		}
		return this;
	};

	p.totalDuration = function (value) {
		if (!arguments.length) {
			if (this._dirty) {
				var max = 0,
				    self = this,
				    tween = self._last,
				    prevStart = 999999999999,
				    prev,
				    end;
				while (tween) {
					prev = tween._prev; //record it here in case the tween changes position in the sequence...
					if (tween._dirty) {
						tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
					}
					if (tween._startTime > prevStart && self._sortChildren && !tween._paused && !self._calculatingDuration) {
						//in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
						self._calculatingDuration = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add(), like _parseTimeOrLabel().
						self.add(tween, tween._startTime - tween._delay);
						self._calculatingDuration = 0;
					} else {
						prevStart = tween._startTime;
					}
					if (tween._startTime < 0 && !tween._paused) {
						//children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
						max -= tween._startTime;
						if (self._timeline.smoothChildTiming) {
							self._startTime += tween._startTime / self._timeScale;
							self._time -= tween._startTime;
							self._totalTime -= tween._startTime;
							self._rawPrevTime -= tween._startTime;
						}
						self.shiftChildren(-tween._startTime, false, -9999999999);
						prevStart = 0;
					}
					end = tween._startTime + tween._totalDuration / tween._timeScale;
					if (end > max) {
						max = end;
					}
					tween = prev;
				}
				self._duration = self._totalDuration = max;
				self._dirty = false;
			}
			return this._totalDuration;
		}
		return value && this.totalDuration() ? this.timeScale(this._totalDuration / value) : this;
	};

	p.paused = function (value) {
		if (value === false && this._paused) {
			//if there's a pause directly at the spot from where we're unpausing, skip it.
			var tween = this._first;
			while (tween) {
				if (tween._startTime === this._time && tween.data === "isPause") {
					tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
				}
				tween = tween._next;
			}
		}
		return Animation.prototype.paused.apply(this, arguments);
	};

	p.usesFrames = function () {
		var tl = this._timeline;
		while (tl._timeline) {
			tl = tl._timeline;
		}
		return tl === Animation._rootFramesTimeline;
	};

	p.rawTime = function (wrapRepeats) {
		return wrapRepeats && (this._paused || this._repeat && this.time() > 0 && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(wrapRepeats) - this._startTime) * this._timeScale;
	};

	return TimelineLite;
}, true);

var TimelineLite = globals.TimelineLite;

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

_gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function () {

	var TimelineMax = function TimelineMax(vars) {
		TimelineLite.call(this, vars);
		this._repeat = this.vars.repeat || 0;
		this._repeatDelay = this.vars.repeatDelay || 0;
		this._cycle = 0;
		this._yoyo = !!this.vars.yoyo;
		this._dirty = true;
	},
	    _tinyNum = 0.00000001,
	    TweenLiteInternals = TweenLite._internals,
	    _lazyTweens = TweenLiteInternals.lazyTweens,
	    _lazyRender = TweenLiteInternals.lazyRender,
	    _globals = _gsScope._gsDefine.globals,
	    _easeNone = new Ease(null, null, 1, 0),
	    p = TimelineMax.prototype = new TimelineLite();

	p.constructor = TimelineMax;
	p.kill()._gc = false;
	TimelineMax.version = "2.1.3";

	p.invalidate = function () {
		this._yoyo = !!this.vars.yoyo;
		this._repeat = this.vars.repeat || 0;
		this._repeatDelay = this.vars.repeatDelay || 0;
		this._uncache(true);
		return TimelineLite.prototype.invalidate.call(this);
	};

	p.addCallback = function (callback, position, params, scope) {
		return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
	};

	p.removeCallback = function (callback, position) {
		if (callback) {
			if (position == null) {
				this._kill(null, callback);
			} else {
				var a = this.getTweensOf(callback, false),
				    i = a.length,
				    time = this._parseTimeOrLabel(position);
				while (--i > -1) {
					if (a[i]._startTime === time) {
						a[i]._enabled(false, false);
					}
				}
			}
		}
		return this;
	};

	p.removePause = function (position) {
		return this.removeCallback(TimelineLite._internals.pauseCallback, position);
	};

	p.tweenTo = function (position, vars) {
		vars = vars || {};
		var copy = { ease: _easeNone, useFrames: this.usesFrames(), immediateRender: false, lazy: false },
		    Engine = vars.repeat && _globals.TweenMax || TweenLite,
		    duration,
		    p,
		    t;
		for (p in vars) {
			copy[p] = vars[p];
		}
		copy.time = this._parseTimeOrLabel(position);
		duration = Math.abs(Number(copy.time) - this._time) / this._timeScale || 0.001;
		t = new Engine(this, duration, copy);
		copy.onStart = function () {
			t.target.paused(true);
			if (t.vars.time !== t.target.time() && duration === t.duration() && !t.isFromTo) {
				//don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
				t.duration(Math.abs(t.vars.time - t.target.time()) / t.target._timeScale).render(t.time(), true, true); //render() right away to ensure that things look right, especially in the case of .tweenTo(0).
			}
			if (vars.onStart) {
				//in case the user had an onStart in the vars - we don't want to overwrite it.
				vars.onStart.apply(vars.onStartScope || vars.callbackScope || t, vars.onStartParams || []); //don't use t._callback("onStart") or it'll point to the copy.onStart and we'll get a recursion error.
			}
		};
		return t;
	};

	p.tweenFromTo = function (fromPosition, toPosition, vars) {
		vars = vars || {};
		fromPosition = this._parseTimeOrLabel(fromPosition);
		vars.startAt = { onComplete: this.seek, onCompleteParams: [fromPosition], callbackScope: this };
		vars.immediateRender = vars.immediateRender !== false;
		var t = this.tweenTo(toPosition, vars);
		t.isFromTo = 1; //to ensure we don't mess with the duration in the onStart (we've got the start and end values here, so lock it in)
		return t.duration(Math.abs(t.vars.time - fromPosition) / this._timeScale || 0.001);
	};

	p.render = function (time, suppressEvents, force) {
		if (this._gc) {
			this._enabled(true, false);
		}
		var self = this,
		    prevTime = self._time,
		    totalDur = !self._dirty ? self._totalDuration : self.totalDuration(),
		    dur = self._duration,
		    prevTotalTime = self._totalTime,
		    prevStart = self._startTime,
		    prevTimeScale = self._timeScale,
		    prevRawPrevTime = self._rawPrevTime,
		    prevPaused = self._paused,
		    prevCycle = self._cycle,
		    tween,
		    isComplete,
		    next,
		    callback,
		    internalForce,
		    cycleDuration,
		    pauseTween,
		    curTime,
		    pauseTime;
		if (prevTime !== self._time) {
			//if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
			time += self._time - prevTime;
		}
		if (time >= totalDur - _tinyNum && time >= 0) {
			//to work around occasional floating point math artifacts.
			if (!self._locked) {
				self._totalTime = totalDur;
				self._cycle = self._repeat;
			}
			if (!self._reversed) if (!self._hasPausedChild()) {
				isComplete = true;
				callback = "onComplete";
				internalForce = !!self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				if (self._duration === 0) if (time <= 0 && time >= -_tinyNum || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time && self._first) {
					internalForce = true;
					if (prevRawPrevTime > _tinyNum) {
						callback = "onReverseComplete";
					}
				}
			}
			self._rawPrevTime = self._duration || !suppressEvents || time || self._rawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
			if (self._yoyo && self._cycle & 1) {
				self._time = time = 0;
			} else {
				self._time = dur;
				time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
			}
		} else if (time < _tinyNum) {
			//to work around occasional floating point math artifacts, round super small values to 0.
			if (!self._locked) {
				self._totalTime = self._cycle = 0;
			}
			self._time = 0;
			if (time > -_tinyNum) {
				time = 0;
			}
			if (prevTime !== 0 || dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || time < 0 && prevRawPrevTime >= 0) && !self._locked) {
				//edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
				callback = "onReverseComplete";
				isComplete = self._reversed;
			}
			if (time < 0) {
				self._active = false;
				if (self._timeline.autoRemoveChildren && self._reversed) {
					internalForce = isComplete = true;
					callback = "onReverseComplete";
				} else if (prevRawPrevTime >= 0 && self._first) {
					//when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
					internalForce = true;
				}
				self._rawPrevTime = time;
			} else {
				self._rawPrevTime = dur || !suppressEvents || time || self._rawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				if (time === 0 && isComplete) {
					//if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
					tween = self._first;
					while (tween && tween._startTime === 0) {
						if (!tween._duration) {
							isComplete = false;
						}
						tween = tween._next;
					}
				}
				time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
				if (!self._initted) {
					internalForce = true;
				}
			}
		} else {
			if (dur === 0 && prevRawPrevTime < 0) {
				//without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
				internalForce = true;
			}
			self._time = self._rawPrevTime = time;
			if (!self._locked) {
				self._totalTime = time;
				if (self._repeat !== 0) {
					cycleDuration = dur + self._repeatDelay;
					self._cycle = self._totalTime / cycleDuration >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
					if (self._cycle) if (self._cycle === self._totalTime / cycleDuration && prevTotalTime <= time) {
						self._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
					}
					self._time = self._totalTime - self._cycle * cycleDuration;
					if (self._yoyo) if (self._cycle & 1) {
						self._time = dur - self._time;
					}
					if (self._time > dur) {
						self._time = dur;
						time = dur + 0.0001; //to avoid occasional floating point rounding error
					} else if (self._time < 0) {
						self._time = time = 0;
					} else {
						time = self._time;
					}
				}
			}
		}

		if (self._hasPause && !self._forcingPlayhead && !suppressEvents) {
			time = self._time;
			if (time > prevTime || self._repeat && prevCycle !== self._cycle) {
				tween = self._first;
				while (tween && tween._startTime <= time && !pauseTween) {
					if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && self._rawPrevTime === 0)) {
						pauseTween = tween;
					}
					tween = tween._next;
				}
			} else {
				tween = self._last;
				while (tween && tween._startTime >= time && !pauseTween) {
					if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
						pauseTween = tween;
					}
					tween = tween._prev;
				}
			}
			if (pauseTween) {
				pauseTime = self._startTime + (self._reversed ? self._duration - pauseTween._startTime : pauseTween._startTime) / self._timeScale;
				if (pauseTween._startTime < dur) {
					self._time = self._rawPrevTime = time = pauseTween._startTime;
					self._totalTime = time + self._cycle * (self._totalDuration + self._repeatDelay);
				}
			}
		}

		if (self._cycle !== prevCycle) if (!self._locked) {
			/*
   make sure children at the end/beginning of the timeline are rendered properly. If, for example,
   a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
   would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
   could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
   we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
   ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
   */
			var backwards = self._yoyo && (prevCycle & 1) !== 0,
			    wrap = backwards === (self._yoyo && (self._cycle & 1) !== 0),
			    recTotalTime = self._totalTime,
			    recCycle = self._cycle,
			    recRawPrevTime = self._rawPrevTime,
			    recTime = self._time;

			self._totalTime = prevCycle * dur;
			if (self._cycle < prevCycle) {
				backwards = !backwards;
			} else {
				self._totalTime += dur;
			}
			self._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

			self._rawPrevTime = dur === 0 ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
			self._cycle = prevCycle;
			self._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
			prevTime = backwards ? 0 : dur;
			self.render(prevTime, suppressEvents, dur === 0);
			if (!suppressEvents) if (!self._gc) {
				if (self.vars.onRepeat) {
					self._cycle = recCycle; //in case the onRepeat alters the playhead or invalidates(), we shouldn't stay locked or use the previous cycle.
					self._locked = false;
					self._callback("onRepeat");
				}
			}
			if (prevTime !== self._time) {
				//in case there's a callback like onComplete in a nested tween/timeline that changes the playhead position, like via seek(), we should just abort.
				return;
			}
			if (wrap) {
				self._cycle = prevCycle; //if there's an onRepeat, we reverted this above, so make sure it's set properly again. We also unlocked in that scenario, so reset that too.
				self._locked = true;
				prevTime = backwards ? dur + 0.0001 : -0.0001;
				self.render(prevTime, true, false);
			}
			self._locked = false;
			if (self._paused && !prevPaused) {
				//if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
				return;
			}
			self._time = recTime;
			self._totalTime = recTotalTime;
			self._cycle = recCycle;
			self._rawPrevTime = recRawPrevTime;
		}

		if ((self._time === prevTime || !self._first) && !force && !internalForce && !pauseTween) {
			if (prevTotalTime !== self._totalTime) if (self._onUpdate) if (!suppressEvents) {
				//so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
				self._callback("onUpdate");
			}
			return;
		} else if (!self._initted) {
			self._initted = true;
		}

		if (!self._active) if (!self._paused && self._totalTime !== prevTotalTime && time > 0) {
			self._active = true; //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
		}

		if (prevTotalTime === 0) if (self.vars.onStart) if (self._totalTime !== 0 || !self._totalDuration) if (!suppressEvents) {
			self._callback("onStart");
		}

		curTime = self._time;
		if (curTime >= prevTime) {
			tween = self._first;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (curTime !== self._time || self._paused && !prevPaused) {
					//in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
					break;
				} else if (tween._active || tween._startTime <= self._time && !tween._paused && !tween._gc) {
					if (pauseTween === tween) {
						self.pause();
						self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
					}
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
					}
				}
				tween = next;
			}
		} else {
			tween = self._last;
			while (tween) {
				next = tween._prev; //record it here because the value could change after rendering...
				if (curTime !== self._time || self._paused && !prevPaused) {
					//in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
					break;
				} else if (tween._active || tween._startTime <= prevTime && !tween._paused && !tween._gc) {
					if (pauseTween === tween) {
						pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
						while (pauseTween && pauseTween.endTime() > self._time) {
							pauseTween.render(pauseTween._reversed ? pauseTween.totalDuration() - (time - pauseTween._startTime) * pauseTween._timeScale : (time - pauseTween._startTime) * pauseTween._timeScale, suppressEvents, force);
							pauseTween = pauseTween._prev;
						}
						pauseTween = null;
						self.pause();
						self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
					}
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
					}
				}
				tween = next;
			}
		}

		if (self._onUpdate) if (!suppressEvents) {
			if (_lazyTweens.length) {
				//in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
				_lazyRender();
			}
			self._callback("onUpdate");
		}
		if (callback) if (!self._locked) if (!self._gc) if (prevStart === self._startTime || prevTimeScale !== self._timeScale) if (self._time === 0 || totalDur >= self.totalDuration()) {
			//if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
			if (isComplete) {
				if (_lazyTweens.length) {
					//in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				if (self._timeline.autoRemoveChildren) {
					self._enabled(false, false);
				}
				self._active = false;
			}
			if (!suppressEvents && self.vars[callback]) {
				self._callback(callback);
			}
		}
	};

	p.getActive = function (nested, tweens, timelines) {
		var a = [],
		    all = this.getChildren(nested || nested == null, tweens || nested == null, !!timelines),
		    cnt = 0,
		    l = all.length,
		    i,
		    tween;
		for (i = 0; i < l; i++) {
			tween = all[i];
			if (tween.isActive()) {
				a[cnt++] = tween;
			}
		}
		return a;
	};

	p.getLabelAfter = function (time) {
		if (!time) if (time !== 0) {
			//faster than isNan()
			time = this._time;
		}
		var labels = this.getLabelsArray(),
		    l = labels.length,
		    i;
		for (i = 0; i < l; i++) {
			if (labels[i].time > time) {
				return labels[i].name;
			}
		}
		return null;
	};

	p.getLabelBefore = function (time) {
		if (time == null) {
			time = this._time;
		}
		var labels = this.getLabelsArray(),
		    i = labels.length;
		while (--i > -1) {
			if (labels[i].time < time) {
				return labels[i].name;
			}
		}
		return null;
	};

	p.getLabelsArray = function () {
		var a = [],
		    cnt = 0,
		    p;
		for (p in this._labels) {
			a[cnt++] = { time: this._labels[p], name: p };
		}
		a.sort(function (a, b) {
			return a.time - b.time;
		});
		return a;
	};

	p.invalidate = function () {
		this._locked = false; //unlock and set cycle in case invalidate() is called from inside an onRepeat
		return TimelineLite.prototype.invalidate.call(this);
	};

	//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

	p.progress = function (value, suppressEvents) {
		return !arguments.length ? this._time / this.duration() || 0 : this.totalTime(this.duration() * (this._yoyo && (this._cycle & 1) !== 0 ? 1 - value : value) + this._cycle * (this._duration + this._repeatDelay), suppressEvents);
	};

	p.totalProgress = function (value, suppressEvents) {
		return !arguments.length ? this._totalTime / this.totalDuration() || 0 : this.totalTime(this.totalDuration() * value, suppressEvents);
	};

	p.totalDuration = function (value) {
		if (!arguments.length) {
			if (this._dirty) {
				TimelineLite.prototype.totalDuration.call(this); //just forces refresh
				//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
				this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat;
			}
			return this._totalDuration;
		}
		return this._repeat === -1 || !value ? this : this.timeScale(this.totalDuration() / value);
	};

	p.time = function (value, suppressEvents) {
		if (!arguments.length) {
			return this._time;
		}
		if (this._dirty) {
			this.totalDuration();
		}
		var duration = this._duration,
		    cycle = this._cycle,
		    cycleDur = cycle * (duration + this._repeatDelay);
		if (value > duration) {
			value = duration;
		}
		return this.totalTime(this._yoyo && cycle & 1 ? duration - value + cycleDur : this._repeat ? value + cycleDur : value, suppressEvents);
	};

	p.repeat = function (value) {
		if (!arguments.length) {
			return this._repeat;
		}
		this._repeat = value;
		return this._uncache(true);
	};

	p.repeatDelay = function (value) {
		if (!arguments.length) {
			return this._repeatDelay;
		}
		this._repeatDelay = value;
		return this._uncache(true);
	};

	p.yoyo = function (value) {
		if (!arguments.length) {
			return this._yoyo;
		}
		this._yoyo = value;
		return this;
	};

	p.currentLabel = function (value) {
		if (!arguments.length) {
			return this.getLabelBefore(this._time + _tinyNum);
		}
		return this.seek(value, true);
	};

	return TimelineMax;
}, true);

var TimelineMax = globals.TimelineMax;

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */

_gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function () {

	var _slice = function _slice(a) {
		//don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
		var b = [],
		    l = a.length,
		    i;
		for (i = 0; i !== l; b.push(a[i++])) {}
		return b;
	},
	    _applyCycle = function _applyCycle(vars, targets, i) {
		var alt = vars.cycle,
		    p,
		    val;
		for (p in alt) {
			val = alt[p];
			vars[p] = typeof val === "function" ? val(i, targets[i], targets) : val[i % val.length];
		}
		delete vars.cycle;
	},

	//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
	_distribute = function _distribute(v) {
		if (typeof v === "function") {
			return v;
		}
		var vars = (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" ? v : { each: v },
		    //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
		ease = vars.ease,
		    from = vars.from || 0,
		    base = vars.base || 0,
		    cache = {},
		    isFromKeyword = isNaN(from),
		    axis = vars.axis,
		    ratio = { center: 0.5, end: 1 }[from] || 0;
		return function (i, target, a) {
			var l = (a || vars).length,
			    distances = cache[l],
			    originX,
			    originY,
			    x,
			    y,
			    d,
			    j,
			    max,
			    min,
			    wrap;
			if (!distances) {
				wrap = vars.grid === "auto" ? 0 : (vars.grid || [Infinity])[0];
				if (!wrap) {
					max = -Infinity;
					while (max < (max = a[wrap++].getBoundingClientRect().left) && wrap < l) {}
					wrap--;
				}
				distances = cache[l] = [];
				originX = isFromKeyword ? Math.min(wrap, l) * ratio - 0.5 : from % wrap;
				originY = isFromKeyword ? l * ratio / wrap - 0.5 : from / wrap | 0;
				max = 0;
				min = Infinity;
				for (j = 0; j < l; j++) {
					x = j % wrap - originX;
					y = originY - (j / wrap | 0);
					distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
					if (d > max) {
						max = d;
					}
					if (d < min) {
						min = d;
					}
				}
				distances.max = max - min;
				distances.min = min;
				distances.v = l = vars.amount || vars.each * (wrap > l ? l - 1 : !axis ? Math.max(wrap, l / wrap) : axis === "y" ? l / wrap : wrap) || 0;
				distances.b = l < 0 ? base - l : base;
			}
			l = (distances[i] - distances.min) / distances.max;
			return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
		};
	},
	    TweenMax = function TweenMax(target, duration, vars) {
		TweenLite.call(this, target, duration, vars);
		this._cycle = 0;
		this._yoyo = this.vars.yoyo === true || !!this.vars.yoyoEase;
		this._repeat = this.vars.repeat || 0;
		this._repeatDelay = this.vars.repeatDelay || 0;
		if (this._repeat) {
			this._uncache(true); //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
		}
		this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
	},
	    _tinyNum = 0.00000001,
	    TweenLiteInternals = TweenLite._internals,
	    _isSelector = TweenLiteInternals.isSelector,
	    _isArray = TweenLiteInternals.isArray,
	    p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
	    _blankArray = [];

	TweenMax.version = "2.1.3";
	p.constructor = TweenMax;
	p.kill()._gc = false;
	TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
	TweenMax.getTweensOf = TweenLite.getTweensOf;
	TweenMax.lagSmoothing = TweenLite.lagSmoothing;
	TweenMax.ticker = TweenLite.ticker;
	TweenMax.render = TweenLite.render;
	TweenMax.distribute = _distribute;

	p.invalidate = function () {
		this._yoyo = this.vars.yoyo === true || !!this.vars.yoyoEase;
		this._repeat = this.vars.repeat || 0;
		this._repeatDelay = this.vars.repeatDelay || 0;
		this._yoyoEase = null;
		this._uncache(true);
		return TweenLite.prototype.invalidate.call(this);
	};

	p.updateTo = function (vars, resetDuration) {
		var self = this,
		    curRatio = self.ratio,
		    immediate = self.vars.immediateRender || vars.immediateRender,
		    p;
		if (resetDuration && self._startTime < self._timeline._time) {
			self._startTime = self._timeline._time;
			self._uncache(false);
			if (self._gc) {
				self._enabled(true, false);
			} else {
				self._timeline.insert(self, self._startTime - self._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
			}
		}
		for (p in vars) {
			self.vars[p] = vars[p];
		}
		if (self._initted || immediate) {
			if (resetDuration) {
				self._initted = false;
				if (immediate) {
					self.render(0, true, true);
				}
			} else {
				if (self._gc) {
					self._enabled(true, false);
				}
				if (self._notifyPluginsOfEnabled && self._firstPT) {
					TweenLite._onPluginEvent("_onDisable", self); //in case a plugin like MotionBlur must perform some cleanup tasks
				}
				if (self._time / self._duration > 0.998) {
					//if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards.
					var prevTime = self._totalTime;
					self.render(0, true, false);
					self._initted = false;
					self.render(prevTime, true, false);
				} else {
					self._initted = false;
					self._init();
					if (self._time > 0 || immediate) {
						var inv = 1 / (1 - curRatio),
						    pt = self._firstPT,
						    endValue;
						while (pt) {
							endValue = pt.s + pt.c;
							pt.c *= inv;
							pt.s = endValue - pt.c;
							pt = pt._next;
						}
					}
				}
			}
		}
		return self;
	};

	p.render = function (time, suppressEvents, force) {
		if (!this._initted) if (this._duration === 0 && this.vars.repeat) {
			//zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
			this.invalidate();
		}
		var self = this,
		    totalDur = !self._dirty ? self._totalDuration : self.totalDuration(),
		    prevTime = self._time,
		    prevTotalTime = self._totalTime,
		    prevCycle = self._cycle,
		    duration = self._duration,
		    prevRawPrevTime = self._rawPrevTime,
		    isComplete,
		    callback,
		    pt,
		    cycleDuration,
		    r,
		    type,
		    pow,
		    rawPrevTime,
		    yoyoEase;
		if (time >= totalDur - _tinyNum && time >= 0) {
			//to work around occasional floating point math artifacts.
			self._totalTime = totalDur;
			self._cycle = self._repeat;
			if (self._yoyo && (self._cycle & 1) !== 0) {
				self._time = 0;
				self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
			} else {
				self._time = duration;
				self.ratio = self._ease._calcEnd ? self._ease.getRatio(1) : 1;
			}
			if (!self._reversed) {
				isComplete = true;
				callback = "onComplete";
				force = force || self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
			}
			if (duration === 0) if (self._initted || !self.vars.lazy || force) {
				//zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
				if (self._startTime === self._timeline._duration) {
					//if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
					time = 0;
				}
				if (prevRawPrevTime < 0 || time <= 0 && time >= -_tinyNum || prevRawPrevTime === _tinyNum && self.data !== "isPause") if (prevRawPrevTime !== time) {
					//note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
					force = true;
					if (prevRawPrevTime > _tinyNum) {
						callback = "onReverseComplete";
					}
				}
				self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
			}
		} else if (time < _tinyNum) {
			//to work around occasional floating point math artifacts, round super small values to 0.
			self._totalTime = self._time = self._cycle = 0;
			self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
			if (prevTotalTime !== 0 || duration === 0 && prevRawPrevTime > 0) {
				callback = "onReverseComplete";
				isComplete = self._reversed;
			}
			if (time > -_tinyNum) {
				time = 0;
			} else if (time < 0) {
				self._active = false;
				if (duration === 0) if (self._initted || !self.vars.lazy || force) {
					//zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (prevRawPrevTime >= 0) {
						force = true;
					}
					self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}
			}
			if (!self._initted) {
				//if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
				force = true;
			}
		} else {
			self._totalTime = self._time = time;
			if (self._repeat !== 0) {
				cycleDuration = duration + self._repeatDelay;
				self._cycle = self._totalTime / cycleDuration >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
				if (self._cycle !== 0) if (self._cycle === self._totalTime / cycleDuration && prevTotalTime <= time) {
					self._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
				}
				self._time = self._totalTime - self._cycle * cycleDuration;
				if (self._yoyo) if ((self._cycle & 1) !== 0) {
					self._time = duration - self._time;
					yoyoEase = self._yoyoEase || self.vars.yoyoEase; //note: we don't set this._yoyoEase in _init() like we do other properties because it's TweenMax-specific and doing it here allows us to optimize performance (most tweens don't have a yoyoEase). Note that we also must skip the this.ratio calculation further down right after we _init() in this function, because we're doing it here.
					if (yoyoEase) {
						if (!self._yoyoEase) {
							if (yoyoEase === true && !self._initted) {
								//if it's not initted and yoyoEase is true, this._ease won't have been populated yet so we must discern it here.
								yoyoEase = self.vars.ease;
								self._yoyoEase = yoyoEase = !yoyoEase ? TweenLite.defaultEase : yoyoEase instanceof Ease ? yoyoEase : typeof yoyoEase === "function" ? new Ease(yoyoEase, self.vars.easeParams) : Ease.map[yoyoEase] || TweenLite.defaultEase;
							} else {
								self._yoyoEase = yoyoEase = yoyoEase === true ? self._ease : yoyoEase instanceof Ease ? yoyoEase : Ease.map[yoyoEase];
							}
						}
						self.ratio = yoyoEase ? 1 - yoyoEase.getRatio((duration - self._time) / duration) : 0;
					}
				}
				if (self._time > duration) {
					self._time = duration;
				} else if (self._time < 0) {
					self._time = 0;
				}
			}
			if (self._easeType && !yoyoEase) {
				r = self._time / duration;
				type = self._easeType;
				pow = self._easePower;
				if (type === 1 || type === 3 && r >= 0.5) {
					r = 1 - r;
				}
				if (type === 3) {
					r *= 2;
				}
				if (pow === 1) {
					r *= r;
				} else if (pow === 2) {
					r *= r * r;
				} else if (pow === 3) {
					r *= r * r * r;
				} else if (pow === 4) {
					r *= r * r * r * r;
				}
				self.ratio = type === 1 ? 1 - r : type === 2 ? r : self._time / duration < 0.5 ? r / 2 : 1 - r / 2;
			} else if (!yoyoEase) {
				self.ratio = self._ease.getRatio(self._time / duration);
			}
		}

		if (prevTime === self._time && !force && prevCycle === self._cycle) {
			if (prevTotalTime !== self._totalTime) if (self._onUpdate) if (!suppressEvents) {
				//so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
				self._callback("onUpdate");
			}
			return;
		} else if (!self._initted) {
			self._init();
			if (!self._initted || self._gc) {
				//immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
				return;
			} else if (!force && self._firstPT && (self.vars.lazy !== false && self._duration || self.vars.lazy && !self._duration)) {
				//we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
				self._time = prevTime;
				self._totalTime = prevTotalTime;
				self._rawPrevTime = prevRawPrevTime;
				self._cycle = prevCycle;
				TweenLiteInternals.lazyTweens.push(self);
				self._lazy = [time, suppressEvents];
				return;
			}
			//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
			if (self._time && !isComplete && !yoyoEase) {
				self.ratio = self._ease.getRatio(self._time / duration);
			} else if (isComplete && this._ease._calcEnd && !yoyoEase) {
				self.ratio = self._ease.getRatio(self._time === 0 ? 0 : 1);
			}
		}
		if (self._lazy !== false) {
			self._lazy = false;
		}

		if (!self._active) if (!self._paused && self._time !== prevTime && time >= 0) {
			self._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
		}
		if (prevTotalTime === 0) {
			if (self._initted === 2 && time > 0) {
				self._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
			}
			if (self._startAt) {
				if (time >= 0) {
					self._startAt.render(time, true, force);
				} else if (!callback) {
					callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
				}
			}
			if (self.vars.onStart) if (self._totalTime !== 0 || duration === 0) if (!suppressEvents) {
				self._callback("onStart");
			}
		}

		pt = self._firstPT;
		while (pt) {
			if (pt.f) {
				pt.t[pt.p](pt.c * self.ratio + pt.s);
			} else {
				pt.t[pt.p] = pt.c * self.ratio + pt.s;
			}
			pt = pt._next;
		}

		if (self._onUpdate) {
			if (time < 0) if (self._startAt && self._startTime) {
				//if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
				self._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
			}
			if (!suppressEvents) if (self._totalTime !== prevTotalTime || callback) {
				self._callback("onUpdate");
			}
		}
		if (self._cycle !== prevCycle) if (!suppressEvents) if (!self._gc) if (self.vars.onRepeat) {
			self._callback("onRepeat");
		}
		if (callback) if (!self._gc || force) {
			//check gc because there's a chance that kill() could be called in an onUpdate
			if (time < 0 && self._startAt && !self._onUpdate && self._startTime) {
				//if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
				self._startAt.render(time, true, force);
			}
			if (isComplete) {
				if (self._timeline.autoRemoveChildren) {
					self._enabled(false, false);
				}
				self._active = false;
			}
			if (!suppressEvents && self.vars[callback]) {
				self._callback(callback);
			}
			if (duration === 0 && self._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
				//the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
				self._rawPrevTime = 0;
			}
		}
	};

	//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------

	TweenMax.to = function (target, duration, vars) {
		return new TweenMax(target, duration, vars);
	};

	TweenMax.from = function (target, duration, vars) {
		vars.runBackwards = true;
		vars.immediateRender = vars.immediateRender != false;
		return new TweenMax(target, duration, vars);
	};

	TweenMax.fromTo = function (target, duration, fromVars, toVars) {
		toVars.startAt = fromVars;
		toVars.immediateRender = toVars.immediateRender != false && fromVars.immediateRender != false;
		return new TweenMax(target, duration, toVars);
	};

	TweenMax.staggerTo = TweenMax.allTo = function (targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		var a = [],
		    staggerFunc = _distribute(vars.stagger || stagger),
		    cycle = vars.cycle,
		    fromCycle = (vars.startAt || _blankArray).cycle,
		    l,
		    copy,
		    i,
		    p;
		if (!_isArray(targets)) {
			if (typeof targets === "string") {
				targets = TweenLite.selector(targets) || targets;
			}
			if (_isSelector(targets)) {
				targets = _slice(targets);
			}
		}
		targets = targets || [];
		l = targets.length - 1;
		for (i = 0; i <= l; i++) {
			copy = {};
			for (p in vars) {
				copy[p] = vars[p];
			}
			if (cycle) {
				_applyCycle(copy, targets, i);
				if (copy.duration != null) {
					duration = copy.duration;
					delete copy.duration;
				}
			}
			if (fromCycle) {
				fromCycle = copy.startAt = {};
				for (p in vars.startAt) {
					fromCycle[p] = vars.startAt[p];
				}
				_applyCycle(copy.startAt, targets, i);
			}
			copy.delay = staggerFunc(i, targets[i], targets) + (copy.delay || 0);
			if (i === l && onCompleteAll) {
				copy.onComplete = function () {
					if (vars.onComplete) {
						vars.onComplete.apply(vars.onCompleteScope || this, arguments);
					}
					onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
				};
			}
			a[i] = new TweenMax(targets[i], duration, copy);
		}
		return a;
	};

	TweenMax.staggerFrom = TweenMax.allFrom = function (targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		vars.runBackwards = true;
		vars.immediateRender = vars.immediateRender != false;
		return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
	};

	TweenMax.staggerFromTo = TweenMax.allFromTo = function (targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
		toVars.startAt = fromVars;
		toVars.immediateRender = toVars.immediateRender != false && fromVars.immediateRender != false;
		return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
	};

	TweenMax.delayedCall = function (delay, callback, params, scope, useFrames) {
		return new TweenMax(callback, 0, { delay: delay, onComplete: callback, onCompleteParams: params, callbackScope: scope, onReverseComplete: callback, onReverseCompleteParams: params, immediateRender: false, useFrames: useFrames, overwrite: 0 });
	};

	TweenMax.set = function (target, vars) {
		return new TweenMax(target, 0, vars);
	};

	TweenMax.isTweening = function (target) {
		return TweenLite.getTweensOf(target, true).length > 0;
	};

	var _getChildrenOf = function _getChildrenOf(timeline, includeTimelines) {
		var a = [],
		    cnt = 0,
		    tween = timeline._first;
		while (tween) {
			if (tween instanceof TweenLite) {
				a[cnt++] = tween;
			} else {
				if (includeTimelines) {
					a[cnt++] = tween;
				}
				a = a.concat(_getChildrenOf(tween, includeTimelines));
				cnt = a.length;
			}
			tween = tween._next;
		}
		return a;
	},
	    getAllTweens = TweenMax.getAllTweens = function (includeTimelines) {
		return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat(_getChildrenOf(Animation._rootFramesTimeline, includeTimelines));
	};

	TweenMax.killAll = function (complete, tweens, delayedCalls, timelines) {
		if (tweens == null) {
			tweens = true;
		}
		if (delayedCalls == null) {
			delayedCalls = true;
		}
		var a = getAllTweens(timelines != false),
		    l = a.length,
		    allTrue = tweens && delayedCalls && timelines,
		    isDC,
		    tween,
		    i;
		for (i = 0; i < l; i++) {
			tween = a[i];
			if (allTrue || tween instanceof SimpleTimeline || (isDC = tween.target === tween.vars.onComplete) && delayedCalls || tweens && !isDC) {
				if (complete) {
					tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
				} else {
					tween._enabled(false, false);
				}
			}
		}
	};

	TweenMax.killChildTweensOf = function (parent, complete) {
		if (parent == null) {
			return;
		}
		var tl = TweenLiteInternals.tweenLookup,
		    a,
		    curParent,
		    p,
		    i,
		    l;
		if (typeof parent === "string") {
			parent = TweenLite.selector(parent) || parent;
		}
		if (_isSelector(parent)) {
			parent = _slice(parent);
		}
		if (_isArray(parent)) {
			i = parent.length;
			while (--i > -1) {
				TweenMax.killChildTweensOf(parent[i], complete);
			}
			return;
		}
		a = [];
		for (p in tl) {
			curParent = tl[p].target.parentNode;
			while (curParent) {
				if (curParent === parent) {
					a = a.concat(tl[p].tweens);
				}
				curParent = curParent.parentNode;
			}
		}
		l = a.length;
		for (i = 0; i < l; i++) {
			if (complete) {
				a[i].totalTime(a[i].totalDuration());
			}
			a[i]._enabled(false, false);
		}
	};

	var _changePause = function _changePause(pause, tweens, delayedCalls, timelines) {
		tweens = tweens !== false;
		delayedCalls = delayedCalls !== false;
		timelines = timelines !== false;
		var a = getAllTweens(timelines),
		    allTrue = tweens && delayedCalls && timelines,
		    i = a.length,
		    isDC,
		    tween;
		while (--i > -1) {
			tween = a[i];
			if (allTrue || tween instanceof SimpleTimeline || (isDC = tween.target === tween.vars.onComplete) && delayedCalls || tweens && !isDC) {
				tween.paused(pause);
			}
		}
	};

	TweenMax.pauseAll = function (tweens, delayedCalls, timelines) {
		_changePause(true, tweens, delayedCalls, timelines);
	};

	TweenMax.resumeAll = function (tweens, delayedCalls, timelines) {
		_changePause(false, tweens, delayedCalls, timelines);
	};

	TweenMax.globalTimeScale = function (value) {
		var tl = Animation._rootTimeline,
		    t = TweenLite.ticker.time;
		if (!arguments.length) {
			return tl._timeScale;
		}
		value = value || _tinyNum; //can't allow zero because it'll throw the math off
		tl._startTime = t - (t - tl._startTime) * tl._timeScale / value;
		tl = Animation._rootFramesTimeline;
		t = TweenLite.ticker.frame;
		tl._startTime = t - (t - tl._startTime) * tl._timeScale / value;
		tl._timeScale = Animation._rootTimeline._timeScale = value;
		return value;
	};

	//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------

	p.progress = function (value, suppressEvents) {
		return !arguments.length ? this.duration() ? this._time / this._duration : this.ratio : this.totalTime(this.duration() * (this._yoyo && (this._cycle & 1) !== 0 ? 1 - value : value) + this._cycle * (this._duration + this._repeatDelay), suppressEvents);
	};

	p.totalProgress = function (value, suppressEvents) {
		return !arguments.length ? this._totalTime / this.totalDuration() : this.totalTime(this.totalDuration() * value, suppressEvents);
	};

	p.time = function (value, suppressEvents) {
		if (!arguments.length) {
			return this._time;
		}
		if (this._dirty) {
			this.totalDuration();
		}
		var duration = this._duration,
		    cycle = this._cycle,
		    cycleDur = cycle * (duration + this._repeatDelay);
		if (value > duration) {
			value = duration;
		}
		return this.totalTime(this._yoyo && cycle & 1 ? duration - value + cycleDur : this._repeat ? value + cycleDur : value, suppressEvents);
	};

	p.duration = function (value) {
		if (!arguments.length) {
			return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
		}
		return Animation.prototype.duration.call(this, value);
	};

	p.totalDuration = function (value) {
		if (!arguments.length) {
			if (this._dirty) {
				//instead of Infinity, we use 999999999999 so that we can accommodate reverses
				this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat;
				this._dirty = false;
			}
			return this._totalDuration;
		}
		return this._repeat === -1 ? this : this.duration((value - this._repeat * this._repeatDelay) / (this._repeat + 1));
	};

	p.repeat = function (value) {
		if (!arguments.length) {
			return this._repeat;
		}
		this._repeat = value;
		return this._uncache(true);
	};

	p.repeatDelay = function (value) {
		if (!arguments.length) {
			return this._repeatDelay;
		}
		this._repeatDelay = value;
		return this._uncache(true);
	};

	p.yoyo = function (value) {
		if (!arguments.length) {
			return this._yoyo;
		}
		this._yoyo = value;
		return this;
	};

	return TweenMax;
}, true);

var TweenMax$1 = globals.TweenMax;

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function () {

	/** @constructor **/
	var CSSPlugin = function CSSPlugin() {
		TweenPlugin.call(this, "css");
		this._overwriteProps.length = 0;
		this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
	},
	    _globals = _gsScope._gsDefine.globals,
	    _hasPriority,
	    //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
	_suffixMap,
	    //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
	_cs,
	    //computed style (we store this in a shared variable to conserve memory and make minification tighter
	_overwriteProps,
	    //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
	_specialProps = {},
	    p = CSSPlugin.prototype = new TweenPlugin("css");

	p.constructor = CSSPlugin;
	CSSPlugin.version = "2.1.3";
	CSSPlugin.API = 2;
	CSSPlugin.defaultTransformPerspective = 0;
	CSSPlugin.defaultSkewType = "compensated";
	CSSPlugin.defaultSmoothOrigin = true;
	p = "px"; //we'll reuse the "p" variable to keep file size down
	CSSPlugin.suffixMap = { top: p, right: p, bottom: p, left: p, width: p, height: p, fontSize: p, padding: p, margin: p, perspective: p, lineHeight: "" };

	var _numExp = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
	    _relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
	    _valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
	    //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
	_valuesExpWithCommas = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b),?/gi,
	    //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
	_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
	    //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
	_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
	    _opacityExp = /opacity *= *([^)]*)/i,
	    _opacityValExp = /opacity:([^;]*)/i,
	    _alphaFilterExp = /alpha\(opacity *=.+?\)/i,
	    _rgbhslExp = /^(rgb|hsl)/,
	    _capsExp = /([A-Z])/g,
	    _camelExp = /-([a-z])/gi,
	    _urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
	    //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
	_camelFunc = function _camelFunc(s, g) {
		return g.toUpperCase();
	},
	    _horizExp = /(?:Left|Right|Width)/i,
	    _ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
	    _ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
	    _commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi,
	    //finds any commas that are not within parenthesis
	_complexExp = /[\s,\(]/i,
	    //for testing a string to find if it has a space, comma, or open parenthesis (clues that it's a complex value)
	_DEG2RAD = Math.PI / 180,
	    _RAD2DEG = 180 / Math.PI,
	    _forcePT = {},
	    _dummyElement = { style: {} },
	    _doc = _gsScope.document || { createElement: function createElement() {
			return _dummyElement;
		} },
	    _createElement = function _createElement(type, ns) {
		var e = _doc.createElementNS ? _doc.createElementNS(ns || "http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
		return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
	},
	    _tempDiv = _createElement("div"),
	    _tempImg = _createElement("img"),
	    _internals = CSSPlugin._internals = { _specialProps: _specialProps },
	    //provides a hook to a few internal methods that we need to access from inside other plugins
	_agent = (_gsScope.navigator || {}).userAgent || "",
	    _autoRound,
	    _reqSafariFix,
	    //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

	_isSafari,
	    _isFirefox,
	    //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
	_isSafariLT6,
	    //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
	_ieVers,
	    _supportsOpacity = function () {
		//we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
		var i = _agent.indexOf("Android"),
		    a = _createElement("a");
		_isSafari = _agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || parseFloat(_agent.substr(i + 8, 2)) > 3);
		_isSafariLT6 = _isSafari && parseFloat(_agent.substr(_agent.indexOf("Version/") + 8, 2)) < 6;
		_isFirefox = _agent.indexOf("Firefox") !== -1;
		if (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(_agent) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(_agent)) {
			_ieVers = parseFloat(RegExp.$1);
		}
		if (!a) {
			return false;
		}
		a.style.cssText = "top:1px;opacity:.55;";
		return (/^0.55/.test(a.style.opacity)
		);
	}(),
	    _getIEOpacity = function _getIEOpacity(v) {
		return _opacityExp.test(typeof v === "string" ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1;
	},
	    _log = function _log(s) {
		//for logging messages, but in a way that won't throw errors in old versions of IE.
		if (_gsScope.console) {
			console.log(s);
		}
	},
	    _target,
	    //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params
	_index,
	    //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params

	_prefixCSS = "",
	    //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
	_prefix = "",
	    //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

	// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
	_checkPropPrefix = function _checkPropPrefix(p, e) {
		e = e || _tempDiv;
		var s = e.style,
		    a,
		    i;
		if (s[p] !== undefined) {
			return p;
		}
		p = p.charAt(0).toUpperCase() + p.substr(1);
		a = ["O", "Moz", "ms", "Ms", "Webkit"];
		i = 5;
		while (--i > -1 && s[a[i] + p] === undefined) {}
		if (i >= 0) {
			_prefix = i === 3 ? "ms" : a[i];
			_prefixCSS = "-" + _prefix.toLowerCase() + "-";
			return _prefix + p;
		}
		return null;
	},
	    _computedStyleScope = typeof window !== "undefined" ? window : _doc.defaultView || { getComputedStyle: function getComputedStyle() {} },
	    _getComputedStyle = function _getComputedStyle(e) {
		return _computedStyleScope.getComputedStyle(e); //to avoid errors in Microsoft Edge, we need to call getComputedStyle() from a specific scope, typically window.
	},


	/**
  * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
  * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
  *
  * @param {!Object} t Target element whose style property you want to query
  * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
  * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
  * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
  * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
  * @return {?string} The current property value
  */
	_getStyle = CSSPlugin.getStyle = function (t, p, cs, calc, dflt) {
		var rv;
		if (!_supportsOpacity) if (p === "opacity") {
			//several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
			return _getIEOpacity(t);
		}
		if (!calc && t.style[p]) {
			rv = t.style[p];
		} else if (cs = cs || _getComputedStyle(t)) {
			rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
		} else if (t.currentStyle) {
			rv = t.currentStyle[p];
		}
		return dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto") ? dflt : rv;
	},


	/**
  * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
  * @param {!Object} t Target element
  * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
  * @param {!number} v Value
  * @param {string=} sfx Suffix (like "px" or "%" or "em")
  * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
  * @return {number} value in pixels
  */
	_convertToPixels = _internals.convertToPixels = function (t, p, v, sfx, recurse) {
		if (sfx === "px" || !sfx && p !== "lineHeight") {
			return v;
		}
		if (sfx === "auto" || !v) {
			return 0;
		}
		var horiz = _horizExp.test(p),
		    node = t,
		    style = _tempDiv.style,
		    neg = v < 0,
		    precise = v === 1,
		    pix,
		    cache,
		    time;
		if (neg) {
			v = -v;
		}
		if (precise) {
			v *= 100;
		}
		if (p === "lineHeight" && !sfx) {
			//special case of when a simple lineHeight (without a unit) is used. Set it to the value, read back the computed value, and then revert.
			cache = _getComputedStyle(t).lineHeight;
			t.style.lineHeight = v;
			pix = parseFloat(_getComputedStyle(t).lineHeight);
			t.style.lineHeight = cache;
		} else if (sfx === "%" && p.indexOf("border") !== -1) {
			pix = v / 100 * (horiz ? t.clientWidth : t.clientHeight);
		} else {
			style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
			if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
				node = t.parentNode || _doc.body;
				if (_getStyle(node, "display").indexOf("flex") !== -1) {
					//Edge and IE11 have a bug that causes offsetWidth to report as 0 if the container has display:flex and the child is position:relative. Switching to position: absolute solves it.
					style.position = "absolute";
				}
				cache = node._gsCache;
				time = TweenLite.ticker.frame;
				if (cache && horiz && cache.time === time) {
					//performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
					return cache.width * v / 100;
				}
				style[horiz ? "width" : "height"] = v + sfx;
			} else {
				style[horiz ? "borderLeftWidth" : "borderTopWidth"] = v + sfx;
			}
			node.appendChild(_tempDiv);
			pix = parseFloat(_tempDiv[horiz ? "offsetWidth" : "offsetHeight"]);
			node.removeChild(_tempDiv);
			if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
				cache = node._gsCache = node._gsCache || {};
				cache.time = time;
				cache.width = pix / v * 100;
			}
			if (pix === 0 && !recurse) {
				pix = _convertToPixels(t, p, v, sfx, true);
			}
		}
		if (precise) {
			pix /= 100;
		}
		return neg ? -pix : pix;
	},
	    _calculateOffset = _internals.calculateOffset = function (t, p, cs) {
		//for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
		if (_getStyle(t, "position", cs) !== "absolute") {
			return 0;
		}
		var dim = p === "left" ? "Left" : "Top",
		    v = _getStyle(t, "margin" + dim, cs);
		return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
	},


	// @private returns at object containing ALL of the style properties in camelCase and their associated values.
	_getAllStyles = function _getAllStyles(t, cs) {
		var s = {},
		    i,
		    tr,
		    p;
		if (cs = cs || _getComputedStyle(t, null)) {
			if (i = cs.length) {
				while (--i > -1) {
					p = cs[i];
					if (p.indexOf("-transform") === -1 || _transformPropCSS === p) {
						//Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
						s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
					}
				}
			} else {
				//some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
				for (i in cs) {
					if (i.indexOf("Transform") === -1 || _transformProp === i) {
						//Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
						s[i] = cs[i];
					}
				}
			}
		} else if (cs = t.currentStyle || t.style) {
			for (i in cs) {
				if (typeof i === "string" && s[i] === undefined) {
					s[i.replace(_camelExp, _camelFunc)] = cs[i];
				}
			}
		}
		if (!_supportsOpacity) {
			s.opacity = _getIEOpacity(t);
		}
		tr = _getTransform(t, cs, false);
		s.rotation = tr.rotation;
		s.skewX = tr.skewX;
		s.scaleX = tr.scaleX;
		s.scaleY = tr.scaleY;
		s.x = tr.x;
		s.y = tr.y;
		if (_supports3D) {
			s.z = tr.z;
			s.rotationX = tr.rotationX;
			s.rotationY = tr.rotationY;
			s.scaleZ = tr.scaleZ;
		}
		if (s.filters) {
			delete s.filters;
		}
		return s;
	},


	// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
	_cssDif = function _cssDif(t, s1, s2, vars, forceLookup) {
		var difs = {},
		    style = t.style,
		    val,
		    p,
		    mpt;
		for (p in s2) {
			if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || forceLookup && forceLookup[p]) if (p.indexOf("Origin") === -1) if (typeof val === "number" || typeof val === "string") {
				difs[p] = val === "auto" && (p === "left" || p === "top") ? _calculateOffset(t, p) : (val === "" || val === "auto" || val === "none") && typeof s1[p] === "string" && s1[p].replace(_NaNExp, "") !== "" ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
				if (style[p] !== undefined) {
					//for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
					mpt = new MiniPropTween(style, p, style[p], mpt);
				}
			}
		}
		if (vars) {
			for (p in vars) {
				//copy properties (except className)
				if (p !== "className") {
					difs[p] = vars[p];
				}
			}
		}
		return { difs: difs, firstMPT: mpt };
	},
	    _dimensions = { width: ["Left", "Right"], height: ["Top", "Bottom"] },
	    _margins = ["marginLeft", "marginRight", "marginTop", "marginBottom"],


	/**
  * @private Gets the width or height of an element
  * @param {!Object} t Target element
  * @param {!string} p Property name ("width" or "height")
  * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
  * @return {number} Dimension (in pixels)
  */
	_getDimension = function _getDimension(t, p, cs) {
		if ((t.nodeName + "").toLowerCase() === "svg") {
			//Chrome no longer supports offsetWidth/offsetHeight on SVG elements.
			return (cs || _getComputedStyle(t))[p] || 0;
		} else if (t.getCTM && _isSVG(t)) {
			return t.getBBox()[p] || 0;
		}
		var v = parseFloat(p === "width" ? t.offsetWidth : t.offsetHeight),
		    a = _dimensions[p],
		    i = a.length;
		cs = cs || _getComputedStyle(t, null);
		while (--i > -1) {
			v -= parseFloat(_getStyle(t, "padding" + a[i], cs, true)) || 0;
			v -= parseFloat(_getStyle(t, "border" + a[i] + "Width", cs, true)) || 0;
		}
		return v;
	},


	// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
	_parsePosition = function _parsePosition(v, recObj) {
		if (v === "contain" || v === "auto" || v === "auto auto") {
			//note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
			return v + " ";
		}
		if (v == null || v === "") {
			v = "0 0";
		}
		var a = v.split(" "),
		    x = v.indexOf("left") !== -1 ? "0%" : v.indexOf("right") !== -1 ? "100%" : a[0],
		    y = v.indexOf("top") !== -1 ? "0%" : v.indexOf("bottom") !== -1 ? "100%" : a[1],
		    i;
		if (a.length > 3 && !recObj) {
			//multiple positions
			a = v.split(", ").join(",").split(",");
			v = [];
			for (i = 0; i < a.length; i++) {
				v.push(_parsePosition(a[i]));
			}
			return v.join(",");
		}
		if (y == null) {
			y = x === "center" ? "50%" : "0";
		} else if (y === "center") {
			y = "50%";
		}
		if (x === "center" || isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1) {
			//remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
			x = "50%";
		}
		v = x + " " + y + (a.length > 2 ? " " + a[2] : "");
		if (recObj) {
			recObj.oxp = x.indexOf("%") !== -1;
			recObj.oyp = y.indexOf("%") !== -1;
			recObj.oxr = x.charAt(1) === "=";
			recObj.oyr = y.charAt(1) === "=";
			recObj.ox = parseFloat(x.replace(_NaNExp, ""));
			recObj.oy = parseFloat(y.replace(_NaNExp, ""));
			recObj.v = v;
		}
		return recObj || v;
	},


	/**
  * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
  * @param {(number|string)} e End value which is typically a string, but could be a number
  * @param {(number|string)} b Beginning value which is typically a string but could be a number
  * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
  */
	_parseChange = function _parseChange(e, b) {
		if (typeof e === "function") {
			e = e(_index, _target);
		}
		return typeof e === "string" && e.charAt(1) === "=" ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(b) || 0;
	},


	/**
  * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
  * @param {Object} v Value to be parsed
  * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
  * @return {number} Parsed value
  */
	_parseVal = function _parseVal(v, d) {
		if (typeof v === "function") {
			v = v(_index, _target);
		}
		var isRelative = typeof v === "string" && v.charAt(1) === "=";
		if (typeof v === "string" && v.charAt(v.length - 2) === "v") {
			//convert vw and vh into px-equivalents.
			v = (isRelative ? v.substr(0, 2) : 0) + window["inner" + (v.substr(-2) === "vh" ? "Height" : "Width")] * (parseFloat(isRelative ? v.substr(2) : v) / 100);
		}
		return v == null ? d : isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v) || 0;
	},


	/**
  * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
  * @param {Object} v Value to be parsed
  * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
  * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
  * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
  * @return {number} parsed angle in radians
  */
	_parseAngle = function _parseAngle(v, d, p, directionalEnd) {
		var min = 0.000001,
		    cap,
		    split,
		    dif,
		    result,
		    isRelative;
		if (typeof v === "function") {
			v = v(_index, _target);
		}
		if (v == null) {
			result = d;
		} else if (typeof v === "number") {
			result = v;
		} else {
			cap = 360;
			split = v.split("_");
			isRelative = v.charAt(1) === "=";
			dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * (v.indexOf("rad") === -1 ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
			if (split.length) {
				if (directionalEnd) {
					directionalEnd[p] = d + dif;
				}
				if (v.indexOf("short") !== -1) {
					dif = dif % cap;
					if (dif !== dif % (cap / 2)) {
						dif = dif < 0 ? dif + cap : dif - cap;
					}
				}
				if (v.indexOf("_cw") !== -1 && dif < 0) {
					dif = (dif + cap * 9999999999) % cap - (dif / cap | 0) * cap;
				} else if (v.indexOf("ccw") !== -1 && dif > 0) {
					dif = (dif - cap * 9999999999) % cap - (dif / cap | 0) * cap;
				}
			}
			result = d + dif;
		}
		if (result < min && result > -min) {
			result = 0;
		}
		return result;
	},
	    _colorLookup = { aqua: [0, 255, 255],
		lime: [0, 255, 0],
		silver: [192, 192, 192],
		black: [0, 0, 0],
		maroon: [128, 0, 0],
		teal: [0, 128, 128],
		blue: [0, 0, 255],
		navy: [0, 0, 128],
		white: [255, 255, 255],
		fuchsia: [255, 0, 255],
		olive: [128, 128, 0],
		yellow: [255, 255, 0],
		orange: [255, 165, 0],
		gray: [128, 128, 128],
		purple: [128, 0, 128],
		green: [0, 128, 0],
		red: [255, 0, 0],
		pink: [255, 192, 203],
		cyan: [0, 255, 255],
		transparent: [255, 255, 255, 0] },
	    _hue = function _hue(h, m1, m2) {
		h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
		return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255 + 0.5 | 0;
	},


	/**
  * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
  * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
  * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
  * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
  */
	_parseColor = CSSPlugin.parseColor = function (v, toHSL) {
		var a, r, g, b, h, s, l, max, min, d, wasHSL;
		if (!v) {
			a = _colorLookup.black;
		} else if (typeof v === "number") {
			a = [v >> 16, v >> 8 & 255, v & 255];
		} else {
			if (v.charAt(v.length - 1) === ",") {
				//sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
				v = v.substr(0, v.length - 1);
			}
			if (_colorLookup[v]) {
				a = _colorLookup[v];
			} else if (v.charAt(0) === "#") {
				if (v.length === 4) {
					//for shorthand like #9F0
					r = v.charAt(1);
					g = v.charAt(2);
					b = v.charAt(3);
					v = "#" + r + r + g + g + b + b;
				}
				v = parseInt(v.substr(1), 16);
				a = [v >> 16, v >> 8 & 255, v & 255];
			} else if (v.substr(0, 3) === "hsl") {
				a = wasHSL = v.match(_numExp);
				if (!toHSL) {
					h = Number(a[0]) % 360 / 360;
					s = Number(a[1]) / 100;
					l = Number(a[2]) / 100;
					g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
					r = l * 2 - g;
					if (a.length > 3) {
						a[3] = Number(a[3]);
					}
					a[0] = _hue(h + 1 / 3, r, g);
					a[1] = _hue(h, r, g);
					a[2] = _hue(h - 1 / 3, r, g);
				} else if (v.indexOf("=") !== -1) {
					//if relative values are found, just return the raw strings with the relative prefixes in place.
					return v.match(_relNumExp);
				}
			} else {
				a = v.match(_numExp) || _colorLookup.transparent;
			}
			a[0] = Number(a[0]);
			a[1] = Number(a[1]);
			a[2] = Number(a[2]);
			if (a.length > 3) {
				a[3] = Number(a[3]);
			}
		}
		if (toHSL && !wasHSL) {
			r = a[0] / 255;
			g = a[1] / 255;
			b = a[2] / 255;
			max = Math.max(r, g, b);
			min = Math.min(r, g, b);
			l = (max + min) / 2;
			if (max === min) {
				h = s = 0;
			} else {
				d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
				h *= 60;
			}
			a[0] = h + 0.5 | 0;
			a[1] = s * 100 + 0.5 | 0;
			a[2] = l * 100 + 0.5 | 0;
		}
		return a;
	},
	    _formatColors = function _formatColors(s, toHSL) {
		var colors = s.match(_colorExp) || [],
		    charIndex = 0,
		    parsed = "",
		    i,
		    color,
		    temp;
		if (!colors.length) {
			return s;
		}
		for (i = 0; i < colors.length; i++) {
			color = colors[i];
			temp = s.substr(charIndex, s.indexOf(color, charIndex) - charIndex);
			charIndex += temp.length + color.length;
			color = _parseColor(color, toHSL);
			if (color.length === 3) {
				color.push(1);
			}
			parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
		}
		return parsed + s.substr(charIndex);
	},
	    _colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

	for (p in _colorLookup) {
		_colorExp += "|" + p + "\\b";
	}
	_colorExp = new RegExp(_colorExp + ")", "gi");

	CSSPlugin.colorStringFilter = function (a) {
		var combined = a[0] + " " + a[1],
		    toHSL;
		if (_colorExp.test(combined)) {
			toHSL = combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1;
			a[0] = _formatColors(a[0], toHSL);
			a[1] = _formatColors(a[1], toHSL);
		}
		_colorExp.lastIndex = 0;
	};

	if (!TweenLite.defaultStringFilter) {
		TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
	}

	/**
  * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
  * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
  * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
  * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
  * @return {Function} formatter function
  */
	var _getFormatter = function _getFormatter(dflt, clr, collapsible, multi) {
		if (dflt == null) {
			return function (v) {
				return v;
			};
		}
		var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
		    dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
		    pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
		    sfx = dflt.charAt(dflt.length - 1) === ")" ? ")" : "",
		    delim = dflt.indexOf(" ") !== -1 ? " " : ",",
		    numVals = dVals.length,
		    dSfx = numVals > 0 ? dVals[0].replace(_numExp, "") : "",
		    _formatter2;
		if (!numVals) {
			return function (v) {
				return v;
			};
		}
		if (clr) {
			_formatter2 = function formatter(v) {
				var color, vals, i, a;
				if (typeof v === "number") {
					v += dSfx;
				} else if (multi && _commasOutsideParenExp.test(v)) {
					a = v.replace(_commasOutsideParenExp, "|").split("|");
					for (i = 0; i < a.length; i++) {
						a[i] = _formatter2(a[i]);
					}
					return a.join(",");
				}
				color = (v.match(_colorExp) || [dColor])[0];
				vals = v.split(color).join("").match(_valuesExp) || [];
				i = vals.length;
				if (numVals > i--) {
					while (++i < numVals) {
						vals[i] = collapsible ? vals[(i - 1) / 2 | 0] : dVals[i];
					}
				}
				return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
			};
			return _formatter2;
		}
		_formatter2 = function _formatter(v) {
			var vals, a, i;
			if (typeof v === "number") {
				v += dSfx;
			} else if (multi && _commasOutsideParenExp.test(v)) {
				a = v.replace(_commasOutsideParenExp, "|").split("|");
				for (i = 0; i < a.length; i++) {
					a[i] = _formatter2(a[i]);
				}
				return a.join(",");
			}
			vals = v.match(delim === "," ? _valuesExp : _valuesExpWithCommas) || [];
			i = vals.length;
			if (numVals > i--) {
				while (++i < numVals) {
					vals[i] = collapsible ? vals[(i - 1) / 2 | 0] : dVals[i];
				}
			}
			return (pfx && v !== "none" ? v.substr(0, v.indexOf(vals[0])) || pfx : pfx) + vals.join(delim) + sfx; //note: prefix might be different, like for clipPath it could start with inset( or polygon(
		};
		return _formatter2;
	},


	/**
  * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
  * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
  * @return {Function} a formatter function
  */
	_getEdgeParser = function _getEdgeParser(props) {
		props = props.split(",");
		return function (t, e, p, cssp, pt, plugin, vars) {
			var a = (e + "").split(" "),
			    i;
			vars = {};
			for (i = 0; i < 4; i++) {
				vars[props[i]] = a[i] = a[i] || a[(i - 1) / 2 >> 0];
			}
			return cssp.parse(t, vars, pt, plugin);
		};
	},


	// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
	_setPluginRatio = _internals._setPluginRatio = function (v) {
		this.plugin.setRatio(v);
		var d = this.data,
		    proxy = d.proxy,
		    mpt = d.firstMPT,
		    min = 0.000001,
		    val,
		    pt,
		    i,
		    str,
		    p;
		while (mpt) {
			val = proxy[mpt.v];
			if (mpt.r) {
				val = mpt.r(val);
			} else if (val < min && val > -min) {
				val = 0;
			}
			mpt.t[mpt.p] = val;
			mpt = mpt._next;
		}
		if (d.autoRotate) {
			d.autoRotate.rotation = d.mod ? d.mod.call(this._tween, proxy.rotation, this.t, this._tween) : proxy.rotation; //special case for ModifyPlugin to hook into an auto-rotating bezier
		}
		//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
		if (v === 1 || v === 0) {
			mpt = d.firstMPT;
			p = v === 1 ? "e" : "b";
			while (mpt) {
				pt = mpt.t;
				if (!pt.type) {
					pt[p] = pt.s + pt.xs0;
				} else if (pt.type === 1) {
					str = pt.xs0 + pt.s + pt.xs1;
					for (i = 1; i < pt.l; i++) {
						str += pt["xn" + i] + pt["xs" + (i + 1)];
					}
					pt[p] = str;
				}
				mpt = mpt._next;
			}
		}
	},


	/**
  * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
  * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
  * @param {!string} p property name
  * @param {(number|string|object)} v value
  * @param {MiniPropTween=} next next MiniPropTween in the linked list
  * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
  */
	MiniPropTween = function MiniPropTween(t, p, v, next, r) {
		this.t = t;
		this.p = p;
		this.v = v;
		this.r = r;
		if (next) {
			next._prev = this;
			this._next = next;
		}
	},


	/**
  * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
  * This method returns an object that has the following properties:
  *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
  *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
  *  - firstMPT: the first MiniPropTween in the linked list
  *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
  * @param {!Object} t target object to be tweened
  * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
  * @param {!CSSPlugin} cssp The CSSPlugin instance
  * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
  * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
  * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
  * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
  */
	_parseToProxy = _internals._parseToProxy = function (t, vars, cssp, pt, plugin, shallow) {
		var bpt = pt,
		    start = {},
		    end = {},
		    transform = cssp._transform,
		    oldForce = _forcePT,
		    i,
		    p,
		    xp,
		    mpt,
		    firstPT;
		cssp._transform = null;
		_forcePT = vars;
		pt = firstPT = cssp.parse(t, vars, pt, plugin);
		_forcePT = oldForce;
		//break off from the linked list so the new ones are isolated.
		if (shallow) {
			cssp._transform = transform;
			if (bpt) {
				bpt._prev = null;
				if (bpt._prev) {
					bpt._prev._next = null;
				}
			}
		}
		while (pt && pt !== bpt) {
			if (pt.type <= 1) {
				p = pt.p;
				end[p] = pt.s + pt.c;
				start[p] = pt.s;
				if (!shallow) {
					mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
					pt.c = 0;
				}
				if (pt.type === 1) {
					i = pt.l;
					while (--i > 0) {
						xp = "xn" + i;
						p = pt.p + "_" + xp;
						end[p] = pt.data[xp];
						start[p] = pt[xp];
						if (!shallow) {
							mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
						}
					}
				}
			}
			pt = pt._next;
		}
		return { proxy: start, end: end, firstMPT: mpt, pt: firstPT };
	},


	/**
  * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
  * CSSPropTweens have the following optional properties as well (not defined through the constructor):
  *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
  *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
  *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
  *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
  *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
  * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
  * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
  * @param {number} s Starting numeric value
  * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
  * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
  * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
  * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
  * @param {boolean=} r If true, the value(s) should be rounded
  * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
  * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
  * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
  */
	CSSPropTween = _internals.CSSPropTween = function (t, p, s, c, next, type, n, r, pr, b, e) {
		this.t = t; //target
		this.p = p; //property
		this.s = s; //starting value
		this.c = c; //change value
		this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
		if (!(t instanceof CSSPropTween)) {
			_overwriteProps.push(this.n);
		}
		this.r = !r ? r : typeof r === "function" ? r : Math.round; //round (boolean)
		this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
		if (pr) {
			this.pr = pr;
			_hasPriority = true;
		}
		this.b = b === undefined ? s : b;
		this.e = e === undefined ? s + c : e;
		if (next) {
			this._next = next;
			next._prev = this;
		}
	},
	    _addNonTweeningNumericPT = function _addNonTweeningNumericPT(target, prop, start, end, next, overwriteProp) {
		//cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
		var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
		pt.b = start;
		pt.e = pt.xs0 = end;
		return pt;
	},


	/**
  * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
  * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
  * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
  * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
  *
  * @param {!Object} t Target whose property will be tweened
  * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
  * @param {string} b Beginning value
  * @param {string} e Ending value
  * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
  * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
  * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
  * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
  * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
  * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
  * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
  */
	_parseComplex = CSSPlugin.parseComplex = function (t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
		//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
		b = b || dflt || "";
		if (typeof e === "function") {
			e = e(_index, _target);
		}
		pt = new CSSPropTween(t, p, 0, 0, pt, setRatio ? 2 : 1, null, false, pr, b, e);
		e += ""; //ensures it's a string
		if (clrs && _colorExp.test(e + b)) {
			//if colors are found, normalize the formatting to rgba() or hsla().
			e = [b, e];
			CSSPlugin.colorStringFilter(e);
			b = e[0];
			e = e[1];
		}
		var ba = b.split(", ").join(",").split(" "),
		    //beginning array
		ea = e.split(", ").join(",").split(" "),
		    //ending array
		l = ba.length,
		    autoRound = _autoRound !== false,
		    i,
		    xi,
		    ni,
		    bv,
		    ev,
		    bnums,
		    enums,
		    bn,
		    hasAlpha,
		    temp,
		    cv,
		    str,
		    useHSL;
		if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
			if ((e + b).indexOf("rgb") !== -1 || (e + b).indexOf("hsl") !== -1) {
				//keep rgb(), rgba(), hsl(), and hsla() values together! (remember, we're splitting on spaces)
				ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
				ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
			} else {
				ba = ba.join(" ").split(",").join(", ").split(" ");
				ea = ea.join(" ").split(",").join(", ").split(" ");
			}
			l = ba.length;
		}
		if (l !== ea.length) {
			//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
			ba = (dflt || "").split(" ");
			l = ba.length;
		}
		pt.plugin = plugin;
		pt.setRatio = setRatio;
		_colorExp.lastIndex = 0;
		for (i = 0; i < l; i++) {
			bv = ba[i];
			ev = ea[i] + "";
			bn = parseFloat(bv);
			//if the value begins with a number (most common). It's fine if it has a suffix like px
			if (bn || bn === 0) {
				pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), autoRound && ev.indexOf("px") !== -1 ? Math.round : false, true);

				//if the value is a color
			} else if (clrs && _colorExp.test(bv)) {
				str = ev.indexOf(")") + 1;
				str = ")" + (str ? ev.substr(str) : ""); //if there's a comma or ) at the end, retain it.
				useHSL = ev.indexOf("hsl") !== -1 && _supportsOpacity;
				temp = ev; //original string value so we can look for any prefix later.
				bv = _parseColor(bv, useHSL);
				ev = _parseColor(ev, useHSL);
				hasAlpha = bv.length + ev.length > 6;
				if (hasAlpha && !_supportsOpacity && ev[3] === 0) {
					//older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
					pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
					pt.e = pt.e.split(ea[i]).join("transparent");
				} else {
					if (!_supportsOpacity) {
						//old versions of IE don't support rgba().
						hasAlpha = false;
					}
					if (useHSL) {
						pt.appendXtra(temp.substr(0, temp.indexOf("hsl")) + (hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true).appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false).appendXtra("", bv[2], _parseChange(ev[2], bv[2]), hasAlpha ? "%," : "%" + str, false);
					} else {
						pt.appendXtra(temp.substr(0, temp.indexOf("rgb")) + (hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", Math.round, true).appendXtra("", bv[1], ev[1] - bv[1], ",", Math.round).appendXtra("", bv[2], ev[2] - bv[2], hasAlpha ? "," : str, Math.round);
					}

					if (hasAlpha) {
						bv = bv.length < 4 ? 1 : bv[3];
						pt.appendXtra("", bv, (ev.length < 4 ? 1 : ev[3]) - bv, str, false);
					}
				}
				_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.
			} else {
				bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

				//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
				if (!bnums) {
					pt["xs" + pt.l] += pt.l || pt["xs" + pt.l] ? " " + ev : ev;

					//loop through all the numbers that are found and construct the extra values on the pt.
				} else {
					enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
					if (!enums || enums.length !== bnums.length) {
						//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
						return pt;
					}
					ni = 0;
					for (xi = 0; xi < bnums.length; xi++) {
						cv = bnums[xi];
						temp = bv.indexOf(cv, ni);
						pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", autoRound && bv.substr(temp + cv.length, 2) === "px" ? Math.round : false, xi === 0);
						ni = temp + cv.length;
					}
					pt["xs" + pt.l] += bv.substr(ni);
				}
			}
		}
		//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
		if (e.indexOf("=") !== -1) if (pt.data) {
			str = pt.xs0 + pt.data.s;
			for (i = 1; i < pt.l; i++) {
				str += pt["xs" + i] + pt.data["xn" + i];
			}
			pt.e = str + pt["xs" + i];
		}
		if (!pt.l) {
			pt.type = -1;
			pt.xs0 = pt.e;
		}
		return pt.xfirst || pt;
	},
	    i = 9;

	p = CSSPropTween.prototype;
	p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
	while (--i > 0) {
		p["xn" + i] = 0;
		p["xs" + i] = "";
	}
	p.xs0 = "";
	p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;

	/**
  * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
  * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
  * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
  * @param {string=} pfx Prefix (if any)
  * @param {!number} s Starting value
  * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
  * @param {string=} sfx Suffix (if any)
  * @param {boolean=} r Round (if true).
  * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
  * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
  */
	p.appendXtra = function (pfx, s, c, sfx, r, pad) {
		var pt = this,
		    l = pt.l;
		pt["xs" + l] += pad && (l || pt["xs" + l]) ? " " + pfx : pfx || "";
		if (!c) if (l !== 0 && !pt.plugin) {
			//typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
			pt["xs" + l] += s + (sfx || "");
			return pt;
		}
		pt.l++;
		pt.type = pt.setRatio ? 2 : 1;
		pt["xs" + pt.l] = sfx || "";
		if (l > 0) {
			pt.data["xn" + l] = s + c;
			pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
			pt["xn" + l] = s;
			if (!pt.plugin) {
				pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
				pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
			}
			return pt;
		}
		pt.data = { s: s + c };
		pt.rxp = {};
		pt.s = s;
		pt.c = c;
		pt.r = r;
		return pt;
	};

	/**
  * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
  * @param {!string} p Property name (like "boxShadow" or "throwProps")
  * @param {Object=} options An object containing any of the following configuration options:
  *                      - defaultValue: the default value
  *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
  *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
  *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
  *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
  *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
  *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
  *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
  *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
  */
	var SpecialProp = function SpecialProp(p, options) {
		options = options || {};
		this.p = options.prefix ? _checkPropPrefix(p) || p : p;
		_specialProps[p] = _specialProps[this.p] = this;
		this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
		if (options.parser) {
			this.parse = options.parser;
		}
		this.clrs = options.color;
		this.multi = options.multi;
		this.keyword = options.keyword;
		this.dflt = options.defaultValue;
		this.allowFunc = options.allowFunc;
		this.pr = options.priority || 0;
	},


	//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
	_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function (p, options, defaults$$1) {
		if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object") {
			options = { parser: defaults$$1 }; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
		}
		var a = p.split(","),
		    d = options.defaultValue,
		    i,
		    temp;
		defaults$$1 = defaults$$1 || [d];
		for (i = 0; i < a.length; i++) {
			options.prefix = i === 0 && options.prefix;
			options.defaultValue = defaults$$1[i] || d;
			temp = new SpecialProp(a[i], options);
		}
	},


	//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
	_registerPluginProp = _internals._registerPluginProp = function (p) {
		if (!_specialProps[p]) {
			var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
			_registerComplexSpecialProp(p, { parser: function parser(t, e, p, cssp, pt, plugin, vars) {
					var pluginClass = _globals.com.greensock.plugins[pluginName];
					if (!pluginClass) {
						_log("Error: " + pluginName + " js file not loaded.");
						return pt;
					}
					pluginClass._cssRegister();
					return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
				} });
		}
	};

	p = SpecialProp.prototype;

	/**
  * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
  * @param {!Object} t target element
  * @param {(string|number|object)} b beginning value
  * @param {(string|number|object)} e ending (destination) value
  * @param {CSSPropTween=} pt next CSSPropTween in the linked list
  * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
  * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
  * @return {CSSPropTween=} First CSSPropTween in the linked list
  */
	p.parseComplex = function (t, b, e, pt, plugin, setRatio) {
		var kwd = this.keyword,
		    i,
		    ba,
		    ea,
		    l,
		    bi,
		    ei;
		//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
		if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
			ba = b.replace(_commasOutsideParenExp, "|").split("|");
			ea = e.replace(_commasOutsideParenExp, "|").split("|");
		} else if (kwd) {
			ba = [b];
			ea = [e];
		}
		if (ea) {
			l = ea.length > ba.length ? ea.length : ba.length;
			for (i = 0; i < l; i++) {
				b = ba[i] = ba[i] || this.dflt;
				e = ea[i] = ea[i] || this.dflt;
				if (kwd) {
					bi = b.indexOf(kwd);
					ei = e.indexOf(kwd);
					if (bi !== ei) {
						if (ei === -1) {
							//if the keyword isn't in the end value, remove it from the beginning one.
							ba[i] = ba[i].split(kwd).join("");
						} else if (bi === -1) {
							//if the keyword isn't in the beginning, add it.
							ba[i] += " " + kwd;
						}
					}
				}
			}
			b = ba.join(", ");
			e = ea.join(", ");
		}
		return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
	};

	/**
  * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
  * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
  * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
  * @param {!Object} t Target object whose property is being tweened
  * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
  * @param {!string} p Property name
  * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
  * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
  * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
  * @param {Object=} vars Original vars object that contains the data for parsing.
  * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
  */
	p.parse = function (t, e, p, cssp, pt, plugin, vars) {
		return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
	};

	/**
  * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
  *  1) Target object whose property should be tweened (typically a DOM element)
  *  2) The end/destination value (could be a string, number, object, or whatever you want)
  *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
  *
  * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
  *
  * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
  *      var start = target.style.width;
  *      return function(ratio) {
  *              target.style.width = (start + value * ratio) + "px";
  *              console.log("set width to " + target.style.width);
  *          }
  * }, 0);
  *
  * Then, when I do this tween, it will trigger my special property:
  *
  * TweenLite.to(element, 1, {css:{myCustomProp:100}});
  *
  * In the example, of course, we're just changing the width, but you can do anything you want.
  *
  * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
  * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
  * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
  */
	CSSPlugin.registerSpecialProp = function (name, onInitTween, priority) {
		_registerComplexSpecialProp(name, { parser: function parser(t, e, p, cssp, pt, plugin, vars) {
				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
				rv.plugin = plugin;
				rv.setRatio = onInitTween(t, e, cssp._tween, p);
				return rv;
			}, priority: priority });
	};

	//transform-related methods and properties
	CSSPlugin.useSVGTransformAttr = true; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
	var _transformProps = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
	    _transformProp = _checkPropPrefix("transform"),
	    //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
	_transformPropCSS = _prefixCSS + "transform",
	    _transformOriginProp = _checkPropPrefix("transformOrigin"),
	    _supports3D = _checkPropPrefix("perspective") !== null,
	    Transform = _internals.Transform = function () {
		this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
		this.force3D = CSSPlugin.defaultForce3D === false || !_supports3D ? false : CSSPlugin.defaultForce3D || "auto";
	},
	    _SVGElement = _gsScope.SVGElement,
	    _useSVGTransformAttr,

	//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

	_createSVG = function _createSVG(type, container, attributes) {
		var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
		    reg = /([a-z])([A-Z])/g,
		    p;
		for (p in attributes) {
			element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
		}
		container.appendChild(element);
		return element;
	},
	    _docElement = _doc.documentElement || {},
	    _forceSVGTransformAttr = function () {
		//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
		var force = _ieVers || /Android/i.test(_agent) && !_gsScope.chrome,
		    svg,
		    rect,
		    width;
		if (_doc.createElementNS && _docElement.appendChild && !force) {
			//IE8 and earlier doesn't support SVG anyway
			svg = _createSVG("svg", _docElement);
			rect = _createSVG("rect", svg, { width: 100, height: 50, x: 100 });
			width = rect.getBoundingClientRect().width;
			rect.style[_transformOriginProp] = "50% 50%";
			rect.style[_transformProp] = "scaleX(0.5)";
			force = width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
			_docElement.removeChild(svg);
		}
		return force;
	}(),
	    _parseSVGOrigin = function _parseSVGOrigin(e, local, decoratee, absolute, smoothOrigin, skipRecord) {
		var tm = e._gsTransform,
		    m = _getMatrix(e, true),
		    v,
		    x,
		    y,
		    xOrigin,
		    yOrigin,
		    a,
		    b,
		    c,
		    d,
		    tx,
		    ty,
		    determinant,
		    xOriginOld,
		    yOriginOld;
		if (tm) {
			xOriginOld = tm.xOrigin; //record the original values before we alter them.
			yOriginOld = tm.yOrigin;
		}
		if (!absolute || (v = absolute.split(" ")).length < 2) {
			b = e.getBBox();
			if (b.x === 0 && b.y === 0 && b.width + b.height === 0) {
				//some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.
				b = { x: parseFloat(e.hasAttribute("x") ? e.getAttribute("x") : e.hasAttribute("cx") ? e.getAttribute("cx") : 0) || 0, y: parseFloat(e.hasAttribute("y") ? e.getAttribute("y") : e.hasAttribute("cy") ? e.getAttribute("cy") : 0) || 0, width: 0, height: 0 };
			}
			local = _parsePosition(local).split(" ");
			v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x, (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
		}
		decoratee.xOrigin = xOrigin = parseFloat(v[0]);
		decoratee.yOrigin = yOrigin = parseFloat(v[1]);
		if (absolute && m !== _identity2DMatrix) {
			//if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
			a = m[0];
			b = m[1];
			c = m[2];
			d = m[3];
			tx = m[4];
			ty = m[5];
			determinant = a * d - b * c;
			if (determinant) {
				//if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
				x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
				y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
				xOrigin = decoratee.xOrigin = v[0] = x;
				yOrigin = decoratee.yOrigin = v[1] = y;
			}
		}
		if (tm) {
			//avoid jump when transformOrigin is changed - adjust the x/y values accordingly
			if (skipRecord) {
				decoratee.xOffset = tm.xOffset;
				decoratee.yOffset = tm.yOffset;
				tm = decoratee;
			}
			if (smoothOrigin || smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false) {
				x = xOrigin - xOriginOld;
				y = yOrigin - yOriginOld;
				//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
				//tm.x -= x - (x * m[0] + y * m[2]);
				//tm.y -= y - (x * m[1] + y * m[3]);
				tm.xOffset += x * m[0] + y * m[2] - x;
				tm.yOffset += x * m[1] + y * m[3] - y;
			} else {
				tm.xOffset = tm.yOffset = 0;
			}
		}
		if (!skipRecord) {
			e.setAttribute("data-svg-origin", v.join(" "));
		}
	},
	    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
		//works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
		var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
		    oldParent = this.parentNode,
		    oldSibling = this.nextSibling,
		    oldCSS = this.style.cssText,
		    bbox;
		_docElement.appendChild(svg);
		svg.appendChild(this);
		this.style.display = "block";
		if (swapIfPossible) {
			try {
				bbox = this.getBBox();
				this._originalGetBBox = this.getBBox;
				this.getBBox = _getBBoxHack;
			} catch (e) {}
		} else if (this._originalGetBBox) {
			bbox = this._originalGetBBox();
		}
		if (oldSibling) {
			oldParent.insertBefore(this, oldSibling);
		} else {
			oldParent.appendChild(this);
		}
		_docElement.removeChild(svg);
		this.style.cssText = oldCSS;
		return bbox;
	},
	    _getBBox = function _getBBox(e) {
		try {
			return e.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
		} catch (error) {
			return _getBBoxHack.call(e, true);
		}
	},
	    _isSVG = function _isSVG(e) {
		//reports if the element is an SVG on which getBBox() actually works
		return !!(_SVGElement && e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
	},
	    _identity2DMatrix = [1, 0, 0, 1, 0, 0],
	    _getMatrix = function _getMatrix(e, force2D) {
		var tm = e._gsTransform || new Transform(),
		    rnd = 100000,
		    style = e.style,
		    isDefault,
		    s,
		    m,
		    n,
		    dec,
		    nextSibling,
		    parent;
		if (_transformProp) {
			s = _getStyle(e, _transformPropCSS, null, true);
		} else if (e.currentStyle) {
			//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
			s = e.currentStyle.filter.match(_ieGetMatrixExp);
			s = s && s.length === 4 ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), tm.x || 0, tm.y || 0].join(",") : "";
		}
		isDefault = !s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)";
		if (_transformProp && isDefault && !e.offsetParent && e !== _docElement) {
			//note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
			//browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
			n = style.display;
			style.display = "block";
			parent = e.parentNode;
			if (!parent || !e.offsetParent) {
				dec = 1; //flag
				nextSibling = e.nextSibling;
				_docElement.appendChild(e); //we must add it to the DOM in order to get values properly
			}
			s = _getStyle(e, _transformPropCSS, null, true);
			isDefault = !s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)";
			if (n) {
				style.display = n;
			} else {
				_removeProp(style, "display");
			}
			if (dec) {
				if (nextSibling) {
					parent.insertBefore(e, nextSibling);
				} else if (parent) {
					parent.appendChild(e);
				} else {
					_docElement.removeChild(e);
				}
			}
		}
		if (tm.svg || e.getCTM && _isSVG(e)) {
			if (isDefault && (style[_transformProp] + "").indexOf("matrix") !== -1) {
				//some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
				s = style[_transformProp];
				isDefault = 0;
			}
			m = e.getAttribute("transform");
			if (isDefault && m) {
				m = e.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.
				s = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";
				isDefault = 0;
			}
		}
		if (isDefault) {
			return _identity2DMatrix;
		}
		//split the matrix values out into an array (m for matrix)
		m = (s || "").match(_numExp) || [];
		i = m.length;
		while (--i > -1) {
			n = Number(m[i]);
			m[i] = (dec = n - (n |= 0)) ? (dec * rnd + (dec < 0 ? -0.5 : 0.5) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
		}
		return force2D && m.length > 6 ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
	},


	/**
  * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
  * @param {!Object} t target element
  * @param {Object=} cs computed style object (optional)
  * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
  * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
  * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
  */
	_getTransform = _internals.getTransform = function (t, cs, rec, parse) {
		if (t._gsTransform && rec && !parse) {
			return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
		}
		var tm = rec ? t._gsTransform || new Transform() : new Transform(),
		    invX = tm.scaleX < 0,
		    //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
		min = 0.00002,
		    rnd = 100000,
		    zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin || 0 : 0,
		    defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
		    m,
		    i,
		    scaleX,
		    scaleY,
		    rotation,
		    skewX;

		tm.svg = !!(t.getCTM && _isSVG(t));
		if (tm.svg) {
			_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
			_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
		}
		m = _getMatrix(t);
		if (m !== _identity2DMatrix) {

			if (m.length === 16) {
				//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
				var a11 = m[0],
				    a21 = m[1],
				    a31 = m[2],
				    a41 = m[3],
				    a12 = m[4],
				    a22 = m[5],
				    a32 = m[6],
				    a42 = m[7],
				    a13 = m[8],
				    a23 = m[9],
				    a33 = m[10],
				    a14 = m[12],
				    a24 = m[13],
				    a34 = m[14],
				    a43 = m[11],
				    angle = Math.atan2(a32, a33),
				    t1,
				    t2,
				    t3,
				    t4,
				    cos,
				    sin;
				//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
				if (tm.zOrigin) {
					a34 = -tm.zOrigin;
					a14 = a13 * a34 - m[12];
					a24 = a23 * a34 - m[13];
					a34 = a33 * a34 + tm.zOrigin - m[14];
				}
				//note for possible future consolidation: rotationX: Math.atan2(a32, a33), rotationY: Math.atan2(-a31, Math.sqrt(a33 * a33 + a32 * a32)), rotation: Math.atan2(a21, a11), skew: Math.atan2(a12, a22). However, it doesn't seem to be quite as reliable as the full-on backwards rotation procedure.
				tm.rotationX = angle * _RAD2DEG;
				//rotationX
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a12 * cos + a13 * sin;
					t2 = a22 * cos + a23 * sin;
					t3 = a32 * cos + a33 * sin;
					a13 = a12 * -sin + a13 * cos;
					a23 = a22 * -sin + a23 * cos;
					a33 = a32 * -sin + a33 * cos;
					a43 = a42 * -sin + a43 * cos;
					a12 = t1;
					a22 = t2;
					a32 = t3;
				}
				//rotationY
				angle = Math.atan2(-a31, a33);
				tm.rotationY = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a11 * cos - a13 * sin;
					t2 = a21 * cos - a23 * sin;
					t3 = a31 * cos - a33 * sin;
					a23 = a21 * sin + a23 * cos;
					a33 = a31 * sin + a33 * cos;
					a43 = a41 * sin + a43 * cos;
					a11 = t1;
					a21 = t2;
					a31 = t3;
				}
				//rotationZ
				angle = Math.atan2(a21, a11);
				tm.rotation = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a11 * cos + a21 * sin;
					t2 = a12 * cos + a22 * sin;
					t3 = a13 * cos + a23 * sin;
					a21 = a21 * cos - a11 * sin;
					a22 = a22 * cos - a12 * sin;
					a23 = a23 * cos - a13 * sin;
					a11 = t1;
					a12 = t2;
					a13 = t3;
				}

				if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) {
					//when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
					tm.rotationX = tm.rotation = 0;
					tm.rotationY = 180 - tm.rotationY;
				}

				//skewX
				angle = Math.atan2(a12, a22);

				//scales
				tm.scaleX = (Math.sqrt(a11 * a11 + a21 * a21 + a31 * a31) * rnd + 0.5 | 0) / rnd;
				tm.scaleY = (Math.sqrt(a22 * a22 + a32 * a32) * rnd + 0.5 | 0) / rnd;
				tm.scaleZ = (Math.sqrt(a13 * a13 + a23 * a23 + a33 * a33) * rnd + 0.5 | 0) / rnd;
				a11 /= tm.scaleX;
				a12 /= tm.scaleY;
				a21 /= tm.scaleX;
				a22 /= tm.scaleY;
				if (Math.abs(angle) > min) {
					tm.skewX = angle * _RAD2DEG;
					a12 = 0; //unskews
					if (tm.skewType !== "simple") {
						tm.scaleY *= 1 / Math.cos(angle); //by default, we compensate the scale based on the skew so that the element maintains a similar proportion when skewed, so we have to alter the scaleY here accordingly to match the default (non-adjusted) skewing that CSS does (stretching more and more as it skews).
					}
				} else {
					tm.skewX = 0;
				}

				/* //for testing purposes
    var transform = "matrix3d(",
    	comma = ",",
    	zero = "0";
    a13 /= tm.scaleZ;
    a23 /= tm.scaleZ;
    a31 /= tm.scaleX;
    a32 /= tm.scaleY;
    a33 /= tm.scaleZ;
    transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
    transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
    transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
    transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
    transform += a14 + comma + a24 + comma + a34 + comma + (tm.perspective ? (1 + (-a34 / tm.perspective)) : 1) + ")";
    console.log(transform);
    document.querySelector(".test").style[_transformProp] = transform;
    */

				tm.perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
				tm.x = a14;
				tm.y = a24;
				tm.z = a34;
				if (tm.svg) {
					tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
					tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
				}
			} else if (!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || !tm.rotationX && !tm.rotationY) {
				//sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
				var k = m.length >= 6,
				    a = k ? m[0] : 1,
				    b = m[1] || 0,
				    c = m[2] || 0,
				    d = k ? m[3] : 1;
				tm.x = m[4] || 0;
				tm.y = m[5] || 0;
				scaleX = Math.sqrt(a * a + b * b);
				scaleY = Math.sqrt(d * d + c * c);
				rotation = a || b ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
				skewX = c || d ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
				tm.scaleX = scaleX;
				tm.scaleY = scaleY;
				tm.rotation = rotation;
				tm.skewX = skewX;
				if (_supports3D) {
					tm.rotationX = tm.rotationY = tm.z = 0;
					tm.perspective = defaultTransformPerspective;
					tm.scaleZ = 1;
				}
				if (tm.svg) {
					tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
					tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
				}
			}
			if (Math.abs(tm.skewX) > 90 && Math.abs(tm.skewX) < 270) {
				if (invX) {
					tm.scaleX *= -1;
					tm.skewX += tm.rotation <= 0 ? 180 : -180;
					tm.rotation += tm.rotation <= 0 ? 180 : -180;
				} else {
					tm.scaleY *= -1;
					tm.skewX += tm.skewX <= 0 ? 180 : -180;
				}
			}
			tm.zOrigin = zOrigin;
			//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
			for (i in tm) {
				if (tm[i] < min) if (tm[i] > -min) {
					tm[i] = 0;
				}
			}
		}
		//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
		if (rec) {
			t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
			if (tm.svg) {
				//if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
				if (_useSVGTransformAttr && t.style[_transformProp]) {
					TweenLite.delayedCall(0.001, function () {
						//if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
						_removeProp(t.style, _transformProp);
					});
				} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
					TweenLite.delayedCall(0.001, function () {
						t.removeAttribute("transform");
					});
				}
			}
		}
		return tm;
	},


	//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
	_setIETransformRatio = function _setIETransformRatio(v) {
		var t = this.data,
		    //refers to the element's _gsTransform object
		ang = -t.rotation * _DEG2RAD,
		    skew = ang + t.skewX * _DEG2RAD,
		    rnd = 100000,
		    a = (Math.cos(ang) * t.scaleX * rnd | 0) / rnd,
		    b = (Math.sin(ang) * t.scaleX * rnd | 0) / rnd,
		    c = (Math.sin(skew) * -t.scaleY * rnd | 0) / rnd,
		    d = (Math.cos(skew) * t.scaleY * rnd | 0) / rnd,
		    style = this.t.style,
		    cs = this.t.currentStyle,
		    filters,
		    val;
		if (!cs) {
			return;
		}
		val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
		b = -c;
		c = -val;
		filters = cs.filter;
		style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
		var w = this.t.offsetWidth,
		    h = this.t.offsetHeight,
		    clip = cs.position !== "absolute",
		    m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
		    ox = t.x + w * t.xPercent / 100,
		    oy = t.y + h * t.yPercent / 100,
		    dx,
		    dy;

		//if transformOrigin is being used, adjust the offset x and y
		if (t.ox != null) {
			dx = (t.oxp ? w * t.ox * 0.01 : t.ox) - w / 2;
			dy = (t.oyp ? h * t.oy * 0.01 : t.oy) - h / 2;
			ox += dx - (dx * a + dy * b);
			oy += dy - (dx * c + dy * d);
		}

		if (!clip) {
			m += ", sizingMethod='auto expand')";
		} else {
			dx = w / 2;
			dy = h / 2;
			//translate to ensure that transformations occur around the correct origin (default is center).
			m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
		}
		if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
			style.filter = filters.replace(_ieSetMatrixExp, m);
		} else {
			style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
		}

		//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
		if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
			style.removeAttribute("filter");
		}

		//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
		if (!clip) {
			var mult = _ieVers < 8 ? 1 : -1,
			    //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
			marg,
			    prop,
			    dif;
			dx = t.ieOffsetX || 0;
			dy = t.ieOffsetY || 0;
			t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
			t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
			for (i = 0; i < 4; i++) {
				prop = _margins[i];
				marg = cs[prop];
				//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
				val = marg.indexOf("px") !== -1 ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
				if (val !== t[prop]) {
					dif = i < 2 ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
				} else {
					dif = i < 2 ? dx - t.ieOffsetX : dy - t.ieOffsetY;
				}
				style[prop] = (t[prop] = Math.round(val - dif * (i === 0 || i === 2 ? 1 : mult))) + "px";
			}
		}
	},


	/* translates a super small decimal to a string WITHOUT scientific notation
 _safeDecimal = function(n) {
 	var s = (n < 0 ? -n : n) + "",
 		a = s.split("e-");
 	return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
 },
 */

	_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function (v) {
		var t = this.data,
		    //refers to the element's _gsTransform object
		style = this.t.style,
		    angle = t.rotation,
		    rotationX = t.rotationX,
		    rotationY = t.rotationY,
		    sx = t.scaleX,
		    sy = t.scaleY,
		    sz = t.scaleZ,
		    x = t.x,
		    y = t.y,
		    z = t.z,
		    isSVG = t.svg,
		    perspective = t.perspective,
		    force3D = t.force3D,
		    skewY = t.skewY,
		    skewX = t.skewX,
		    t1,
		    a11,
		    a12,
		    a13,
		    a21,
		    a22,
		    a23,
		    a31,
		    a32,
		    a33,
		    a41,
		    a42,
		    a43,
		    zOrigin,
		    min,
		    cos,
		    sin,
		    t2,
		    transform,
		    comma,
		    zero,
		    skew,
		    rnd;
		if (skewY) {
			//for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
			skewX += skewY;
			angle += skewY;
		}

		//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
		if (((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1 || _useSVGTransformAttr && isSVG || !_supports3D) {
			//on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

			//2D
			if (angle || skewX || isSVG) {
				angle *= _DEG2RAD;
				skew = skewX * _DEG2RAD;
				rnd = 100000;
				a11 = Math.cos(angle) * sx;
				a21 = Math.sin(angle) * sx;
				a12 = Math.sin(angle - skew) * -sy;
				a22 = Math.cos(angle - skew) * sy;
				if (skew && t.skewType === "simple") {
					//by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
					t1 = Math.tan(skew - skewY * _DEG2RAD);
					t1 = Math.sqrt(1 + t1 * t1);
					a12 *= t1;
					a22 *= t1;
					if (skewY) {
						t1 = Math.tan(skewY * _DEG2RAD);
						t1 = Math.sqrt(1 + t1 * t1);
						a11 *= t1;
						a21 *= t1;
					}
				}
				if (isSVG) {
					x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
					y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
					if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) {
						//The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
						min = this.t.getBBox();
						x += t.xPercent * 0.01 * min.width;
						y += t.yPercent * 0.01 * min.height;
					}
					min = 0.000001;
					if (x < min) if (x > -min) {
						x = 0;
					}
					if (y < min) if (y > -min) {
						y = 0;
					}
				}
				transform = (a11 * rnd | 0) / rnd + "," + (a21 * rnd | 0) / rnd + "," + (a12 * rnd | 0) / rnd + "," + (a22 * rnd | 0) / rnd + "," + x + "," + y + ")";
				if (isSVG && _useSVGTransformAttr) {
					this.t.setAttribute("transform", "matrix(" + transform);
				} else {
					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
					style[_transformProp] = (t.xPercent || t.yPercent ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
				}
			} else {
				style[_transformProp] = (t.xPercent || t.yPercent ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
			}
			return;
		}
		if (_isFirefox) {
			//Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
			min = 0.0001;
			if (sx < min && sx > -min) {
				sx = sz = 0.00002;
			}
			if (sy < min && sy > -min) {
				sy = sz = 0.00002;
			}
			if (perspective && !t.z && !t.rotationX && !t.rotationY) {
				//Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
				perspective = 0;
			}
		}
		if (angle || skewX) {
			angle *= _DEG2RAD;
			cos = a11 = Math.cos(angle);
			sin = a21 = Math.sin(angle);
			if (skewX) {
				angle -= skewX * _DEG2RAD;
				cos = Math.cos(angle);
				sin = Math.sin(angle);
				if (t.skewType === "simple") {
					//by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
					t1 = Math.tan((skewX - skewY) * _DEG2RAD);
					t1 = Math.sqrt(1 + t1 * t1);
					cos *= t1;
					sin *= t1;
					if (t.skewY) {
						t1 = Math.tan(skewY * _DEG2RAD);
						t1 = Math.sqrt(1 + t1 * t1);
						a11 *= t1;
						a21 *= t1;
					}
				}
			}
			a12 = -sin;
			a22 = cos;
		} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) {
			//if we're only translating and/or 2D scaling, this is faster...
			style[_transformProp] = (t.xPercent || t.yPercent ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z + "px)" + (sx !== 1 || sy !== 1 ? " scale(" + sx + "," + sy + ")" : "");
			return;
		} else {
			a11 = a22 = 1;
			a12 = a21 = 0;
		}
		// KEY  INDEX   AFFECTS a[row][column]
		// a11  0       rotation, rotationY, scaleX
		// a21  1       rotation, rotationY, scaleX
		// a31  2       rotationY, scaleX
		// a41  3       rotationY, scaleX
		// a12  4       rotation, skewX, rotationX, scaleY
		// a22  5       rotation, skewX, rotationX, scaleY
		// a32  6       rotationX, scaleY
		// a42  7       rotationX, scaleY
		// a13  8       rotationY, rotationX, scaleZ
		// a23  9       rotationY, rotationX, scaleZ
		// a33  10      rotationY, rotationX, scaleZ
		// a43  11      rotationY, rotationX, perspective, scaleZ
		// a14  12      x, zOrigin, svgOrigin
		// a24  13      y, zOrigin, svgOrigin
		// a34  14      z, zOrigin
		// a44  15
		// rotation: Math.atan2(a21, a11)
		// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
		// rotationX: Math.atan2(a32, a33)
		a33 = 1;
		a13 = a23 = a31 = a32 = a41 = a42 = 0;
		a43 = perspective ? -1 / perspective : 0;
		zOrigin = t.zOrigin;
		min = 0.000001; //threshold below which browsers use scientific notation which won't work.
		comma = ",";
		zero = "0";
		angle = rotationY * _DEG2RAD;
		if (angle) {
			cos = Math.cos(angle);
			sin = Math.sin(angle);
			a31 = -sin;
			a41 = a43 * -sin;
			a13 = a11 * sin;
			a23 = a21 * sin;
			a33 = cos;
			a43 *= cos;
			a11 *= cos;
			a21 *= cos;
		}
		angle = rotationX * _DEG2RAD;
		if (angle) {
			cos = Math.cos(angle);
			sin = Math.sin(angle);
			t1 = a12 * cos + a13 * sin;
			t2 = a22 * cos + a23 * sin;
			a32 = a33 * sin;
			a42 = a43 * sin;
			a13 = a12 * -sin + a13 * cos;
			a23 = a22 * -sin + a23 * cos;
			a33 = a33 * cos;
			a43 = a43 * cos;
			a12 = t1;
			a22 = t2;
		}
		if (sz !== 1) {
			a13 *= sz;
			a23 *= sz;
			a33 *= sz;
			a43 *= sz;
		}
		if (sy !== 1) {
			a12 *= sy;
			a22 *= sy;
			a32 *= sy;
			a42 *= sy;
		}
		if (sx !== 1) {
			a11 *= sx;
			a21 *= sx;
			a31 *= sx;
			a41 *= sx;
		}

		if (zOrigin || isSVG) {
			if (zOrigin) {
				x += a13 * -zOrigin;
				y += a23 * -zOrigin;
				z += a33 * -zOrigin + zOrigin;
			}
			if (isSVG) {
				//due to bugs in some browsers, we need to manage the transform-origin of SVG manually
				x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
				y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
			}
			if (x < min && x > -min) {
				x = zero;
			}
			if (y < min && y > -min) {
				y = zero;
			}
			if (z < min && z > -min) {
				z = 0; //don't use string because we calculate perspective later and need the number.
			}
		}

		//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
		transform = t.xPercent || t.yPercent ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(";
		transform += (a11 < min && a11 > -min ? zero : a11) + comma + (a21 < min && a21 > -min ? zero : a21) + comma + (a31 < min && a31 > -min ? zero : a31);
		transform += comma + (a41 < min && a41 > -min ? zero : a41) + comma + (a12 < min && a12 > -min ? zero : a12) + comma + (a22 < min && a22 > -min ? zero : a22);
		if (rotationX || rotationY || sz !== 1) {
			//performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
			transform += comma + (a32 < min && a32 > -min ? zero : a32) + comma + (a42 < min && a42 > -min ? zero : a42) + comma + (a13 < min && a13 > -min ? zero : a13);
			transform += comma + (a23 < min && a23 > -min ? zero : a23) + comma + (a33 < min && a33 > -min ? zero : a33) + comma + (a43 < min && a43 > -min ? zero : a43) + comma;
		} else {
			transform += ",0,0,0,0,1,0,";
		}
		transform += x + comma + y + comma + z + comma + (perspective ? 1 + -z / perspective : 1) + ")";

		style[_transformProp] = transform;
	};

	p = Transform.prototype;
	p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
	p.scaleX = p.scaleY = p.scaleZ = 1;

	_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", { parser: function parser(t, e, parsingProp, cssp, pt, plugin, vars) {
			if (cssp._lastParsedTransform === vars) {
				return pt;
			} //only need to parse the transform once, and only if the browser supports it.
			cssp._lastParsedTransform = vars;
			var scaleFunc = vars.scale && typeof vars.scale === "function" ? vars.scale : 0; //if there's a function-based "scale" value, swap in the resulting numeric value temporarily. Otherwise, if it's called for both scaleX and scaleY independently, they may not match (like if the function uses Math.random()).
			if (scaleFunc) {
				vars.scale = scaleFunc(_index, t);
			}
			var originalGSTransform = t._gsTransform,
			    style = t.style,
			    min = 0.000001,
			    i = _transformProps.length,
			    v = vars,
			    endRotations = {},
			    transformOriginString = "transformOrigin",
			    m1 = _getTransform(t, _cs, true, v.parseTransform),
			    orig = v.transform && (typeof v.transform === "function" ? v.transform(_index, _target) : v.transform),
			    m2,
			    copy,
			    has3D,
			    hasChange,
			    dr,
			    x,
			    y,
			    matrix,
			    p;
			m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;
			cssp._transform = m1;
			if ("rotationZ" in v) {
				v.rotation = v.rotationZ;
			}
			if (orig && typeof orig === "string" && _transformProp) {
				//for values like transform:"rotate(60deg) scale(0.5, 0.8)"
				copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
				copy[_transformProp] = orig;
				copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
				copy.position = "absolute";
				if (orig.indexOf("%") !== -1) {
					//%-based translations will fail unless we set the width/height to match the original target...
					copy.width = _getStyle(t, "width");
					copy.height = _getStyle(t, "height");
				}
				_doc.body.appendChild(_tempDiv);
				m2 = _getTransform(_tempDiv, null, false);
				if (m1.skewType === "simple") {
					//the default _getTransform() reports the skewX/scaleY as if skewType is "compensated", thus we need to adjust that here if skewType is "simple".
					m2.scaleY *= Math.cos(m2.skewX * _DEG2RAD);
				}
				if (m1.svg) {
					//if it's an SVG element, x/y part of the matrix will be affected by whatever we use as the origin and the offsets, so compensate here...
					x = m1.xOrigin;
					y = m1.yOrigin;
					m2.x -= m1.xOffset;
					m2.y -= m1.yOffset;
					if (v.transformOrigin || v.svgOrigin) {
						//if this tween is altering the origin, we must factor that in here. The actual work of recording the transformOrigin values and setting up the PropTween is done later (still inside this function) so we cannot leave the changes intact here - we only want to update the x/y accordingly.
						orig = {};
						_parseSVGOrigin(t, _parsePosition(v.transformOrigin), orig, v.svgOrigin, v.smoothOrigin, true);
						x = orig.xOrigin;
						y = orig.yOrigin;
						m2.x -= orig.xOffset - m1.xOffset;
						m2.y -= orig.yOffset - m1.yOffset;
					}
					if (x || y) {
						matrix = _getMatrix(_tempDiv, true);
						m2.x -= x - (x * matrix[0] + y * matrix[2]);
						m2.y -= y - (x * matrix[1] + y * matrix[3]);
					}
				}
				_doc.body.removeChild(_tempDiv);
				if (!m2.perspective) {
					m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
				}
				if (v.xPercent != null) {
					m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
				}
				if (v.yPercent != null) {
					m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
				}
			} else if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
				//for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
				m2 = { scaleX: _parseVal(v.scaleX != null ? v.scaleX : v.scale, m1.scaleX),
					scaleY: _parseVal(v.scaleY != null ? v.scaleY : v.scale, m1.scaleY),
					scaleZ: _parseVal(v.scaleZ, m1.scaleZ),
					x: _parseVal(v.x, m1.x),
					y: _parseVal(v.y, m1.y),
					z: _parseVal(v.z, m1.z),
					xPercent: _parseVal(v.xPercent, m1.xPercent),
					yPercent: _parseVal(v.yPercent, m1.yPercent),
					perspective: _parseVal(v.transformPerspective, m1.perspective) };
				dr = v.directionalRotation;
				if (dr != null) {
					if ((typeof dr === "undefined" ? "undefined" : _typeof(dr)) === "object") {
						for (copy in dr) {
							v[copy] = dr[copy];
						}
					} else {
						v.rotation = dr;
					}
				}
				if (typeof v.x === "string" && v.x.indexOf("%") !== -1) {
					m2.x = 0;
					m2.xPercent = _parseVal(v.x, m1.xPercent);
				}
				if (typeof v.y === "string" && v.y.indexOf("%") !== -1) {
					m2.y = 0;
					m2.yPercent = _parseVal(v.y, m1.yPercent);
				}

				m2.rotation = _parseAngle("rotation" in v ? v.rotation : "shortRotation" in v ? v.shortRotation + "_short" : m1.rotation, m1.rotation, "rotation", endRotations);
				if (_supports3D) {
					m2.rotationX = _parseAngle("rotationX" in v ? v.rotationX : "shortRotationX" in v ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
					m2.rotationY = _parseAngle("rotationY" in v ? v.rotationY : "shortRotationY" in v ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
				}
				m2.skewX = _parseAngle(v.skewX, m1.skewX);
				m2.skewY = _parseAngle(v.skewY, m1.skewY);
			}
			if (_supports3D && v.force3D != null) {
				m1.force3D = v.force3D;
				hasChange = true;
			}

			has3D = m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective;
			if (!has3D && v.scale != null) {
				m2.scaleZ = 1; //no need to tween scaleZ.
			}

			while (--i > -1) {
				p = _transformProps[i];
				orig = m2[p] - m1[p];
				if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
					hasChange = true;
					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
					if (p in endRotations) {
						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
					}
					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
					pt.plugin = plugin;
					cssp._overwriteProps.push(pt.n);
				}
			}

			orig = typeof v.transformOrigin === "function" ? v.transformOrigin(_index, _target) : v.transformOrigin;
			if (m1.svg && (orig || v.svgOrigin)) {
				x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
				y = m1.yOffset;
				_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
				pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
				pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
				if (x !== m1.xOffset || y !== m1.yOffset) {
					pt = _addNonTweeningNumericPT(m1, "xOffset", originalGSTransform ? x : m1.xOffset, m1.xOffset, pt, transformOriginString);
					pt = _addNonTweeningNumericPT(m1, "yOffset", originalGSTransform ? y : m1.yOffset, m1.yOffset, pt, transformOriginString);
				}
				orig = "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
			}
			if (orig || _supports3D && has3D && m1.zOrigin) {
				//if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
				if (_transformProp) {
					hasChange = true;
					p = _transformOriginProp;
					if (!orig) {
						orig = (_getStyle(t, p, _cs, false, "50% 50%") + "").split(" ");
						orig = orig[0] + " " + orig[1] + " " + m1.zOrigin + "px";
					}
					orig += "";
					pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
					pt.b = style[p];
					pt.plugin = plugin;
					if (_supports3D) {
						copy = m1.zOrigin;
						orig = orig.split(" ");
						m1.zOrigin = (orig.length > 2 ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
						pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
						pt.b = copy;
						pt.xs0 = pt.e = m1.zOrigin;
					} else {
						pt.xs0 = pt.e = orig;
					}

					//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
				} else {
					_parsePosition(orig + "", m1);
				}
			}
			if (hasChange) {
				cssp._transformType = !(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3) ? 3 : 2; //quicker than calling cssp._enableTransforms();
			}
			if (scaleFunc) {
				vars.scale = scaleFunc;
			}
			return pt;
		}, allowFunc: true, prefix: true });

	_registerComplexSpecialProp("boxShadow", { defaultValue: "0px 0px 0px 0px #999", prefix: true, color: true, multi: true, keyword: "inset" });
	_registerComplexSpecialProp("clipPath", { defaultValue: "inset(0%)", prefix: true, multi: true, formatter: _getFormatter("inset(0% 0% 0% 0%)", false, true) });

	_registerComplexSpecialProp("borderRadius", { defaultValue: "0px", parser: function parser(t, e, p, cssp, pt, plugin) {
			e = this.format(e);
			var props = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
			    style = t.style,
			    ea1,
			    i,
			    es2,
			    bs2,
			    bs,
			    es,
			    bn,
			    en,
			    w,
			    h,
			    esfx,
			    bsfx,
			    rel,
			    hn,
			    vn,
			    em;
			w = parseFloat(t.offsetWidth);
			h = parseFloat(t.offsetHeight);
			ea1 = e.split(" ");
			for (i = 0; i < props.length; i++) {
				//if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
				if (this.p.indexOf("border")) {
					//older browsers used a prefix
					props[i] = _checkPropPrefix(props[i]);
				}
				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
				if (bs.indexOf(" ") !== -1) {
					bs2 = bs.split(" ");
					bs = bs2[0];
					bs2 = bs2[1];
				}
				es = es2 = ea1[i];
				bn = parseFloat(bs);
				bsfx = bs.substr((bn + "").length);
				rel = es.charAt(1) === "=";
				if (rel) {
					en = parseInt(es.charAt(0) + "1", 10);
					es = es.substr(2);
					en *= parseFloat(es);
					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
				} else {
					en = parseFloat(es);
					esfx = es.substr((en + "").length);
				}
				if (esfx === "") {
					esfx = _suffixMap[p] || bsfx;
				}
				if (esfx !== bsfx) {
					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
					if (esfx === "%") {
						bs = hn / w * 100 + "%";
						bs2 = vn / h * 100 + "%";
					} else if (esfx === "em") {
						em = _convertToPixels(t, "borderLeft", 1, "em");
						bs = hn / em + "em";
						bs2 = vn / em + "em";
					} else {
						bs = hn + "px";
						bs2 = vn + "px";
					}
					if (rel) {
						es = parseFloat(bs) + en + esfx;
						es2 = parseFloat(bs2) + en + esfx;
					}
				}
				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
			}
			return pt;
		}, prefix: true, formatter: _getFormatter("0px 0px 0px 0px", false, true) });
	_registerComplexSpecialProp("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", { defaultValue: "0px", parser: function parser(t, e, p, cssp, pt, plugin) {
			return _parseComplex(t.style, p, this.format(_getStyle(t, p, _cs, false, "0px 0px")), this.format(e), false, "0px", pt);
		}, prefix: true, formatter: _getFormatter("0px 0px", false, true) });
	_registerComplexSpecialProp("backgroundPosition", { defaultValue: "0 0", parser: function parser(t, e, p, cssp, pt, plugin) {
			var bp = "background-position",
			    cs = _cs || _getComputedStyle(t, null),
			    bs = this.format((cs ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
			    //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
			es = this.format(e),
			    ba,
			    ea,
			    i,
			    pct,
			    overlap,
			    src;
			if (bs.indexOf("%") !== -1 !== (es.indexOf("%") !== -1) && es.split(",").length < 2) {
				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
				if (src && src !== "none") {
					ba = bs.split(" ");
					ea = es.split(" ");
					_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
					i = 2;
					while (--i > -1) {
						bs = ba[i];
						pct = bs.indexOf("%") !== -1;
						if (pct !== (ea[i].indexOf("%") !== -1)) {
							overlap = i === 0 ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
							ba[i] = pct ? parseFloat(bs) / 100 * overlap + "px" : parseFloat(bs) / overlap * 100 + "%";
						}
					}
					bs = ba.join(" ");
				}
			}
			return this.parseComplex(t.style, bs, es, pt, plugin);
		}, formatter: _parsePosition });
	_registerComplexSpecialProp("backgroundSize", { defaultValue: "0 0", formatter: function formatter(v) {
			v += ""; //ensure it's a string
			return v.substr(0, 2) === "co" ? v : _parsePosition(v.indexOf(" ") === -1 ? v + " " + v : v); //if set to something like "100% 100%", Safari typically reports the computed style as just "100%" (no 2nd value), but we should ensure that there are two values, so copy the first one. Otherwise, it'd be interpreted as "100% 0" (wrong). Also remember that it could be "cover" or "contain" which we can't tween but should be able to set.
		} });
	_registerComplexSpecialProp("perspective", { defaultValue: "0px", prefix: true });
	_registerComplexSpecialProp("perspectiveOrigin", { defaultValue: "50% 50%", prefix: true });
	_registerComplexSpecialProp("transformStyle", { prefix: true });
	_registerComplexSpecialProp("backfaceVisibility", { prefix: true });
	_registerComplexSpecialProp("userSelect", { prefix: true });
	_registerComplexSpecialProp("margin", { parser: _getEdgeParser("marginTop,marginRight,marginBottom,marginLeft") });
	_registerComplexSpecialProp("padding", { parser: _getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft") });
	_registerComplexSpecialProp("clip", { defaultValue: "rect(0px,0px,0px,0px)", parser: function parser(t, e, p, cssp, pt, plugin) {
			var b, cs, delim;
			if (_ieVers < 9) {
				//IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
				cs = t.currentStyle;
				delim = _ieVers < 8 ? " " : ",";
				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
				e = this.format(e).split(",").join(delim);
			} else {
				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
				e = this.format(e);
			}
			return this.parseComplex(t.style, b, e, pt, plugin);
		} });
	_registerComplexSpecialProp("textShadow", { defaultValue: "0px 0px 0px #999", color: true, multi: true });
	_registerComplexSpecialProp("autoRound,strictUnits", { parser: function parser(t, e, p, cssp, pt) {
			return pt;
		} }); //just so that we can ignore these properties (not tween them)
	_registerComplexSpecialProp("border", { defaultValue: "0px solid #000", parser: function parser(t, e, p, cssp, pt, plugin) {
			var bw = _getStyle(t, "borderTopWidth", _cs, false, "0px"),
			    end = this.format(e).split(" "),
			    esfx = end[0].replace(_suffixExp, "");
			if (esfx !== "px") {
				//if we're animating to a non-px value, we need to convert the beginning width to that unit.
				bw = parseFloat(bw) / _convertToPixels(t, "borderTopWidth", 1, esfx) + esfx;
			}
			return this.parseComplex(t.style, this.format(bw + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), end.join(" "), pt, plugin);
		}, color: true, formatter: function formatter(v) {
			var a = v.split(" ");
			return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
		} });
	_registerComplexSpecialProp("borderWidth", { parser: _getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth") }); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
	_registerComplexSpecialProp("float,cssFloat,styleFloat", { parser: function parser(t, e, p, cssp, pt, plugin) {
			var s = t.style,
			    prop = "cssFloat" in s ? "cssFloat" : "styleFloat";
			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
		} });

	//opacity-related
	var _setIEOpacityRatio = function _setIEOpacityRatio(v) {
		var t = this.t,
		    //refers to the element's style property
		filters = t.filter || _getStyle(this.data, "filter") || "",
		    val = this.s + this.c * v | 0,
		    skip;
		if (val === 100) {
			//for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
			if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
				t.removeAttribute("filter");
				skip = !_getStyle(this.data, "filter"); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
			} else {
				t.filter = filters.replace(_alphaFilterExp, "");
				skip = true;
			}
		}
		if (!skip) {
			if (this.xn1) {
				t.filter = filters = filters || "alpha(opacity=" + val + ")"; //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
			}
			if (filters.indexOf("pacity") === -1) {
				//only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
				if (val !== 0 || !this.xn1) {
					//bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
					t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
				}
			} else {
				t.filter = filters.replace(_opacityExp, "opacity=" + val);
			}
		}
	};
	_registerComplexSpecialProp("opacity,alpha,autoAlpha", { defaultValue: "1", parser: function parser(t, e, p, cssp, pt, plugin) {
			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
			    style = t.style,
			    isAutoAlpha = p === "autoAlpha";
			if (typeof e === "string" && e.charAt(1) === "=") {
				e = (e.charAt(0) === "-" ? -1 : 1) * parseFloat(e.substr(2)) + b;
			}
			if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) {
				//if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
				b = 0;
			}
			if (_supportsOpacity) {
				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
			} else {
				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
				pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
				style.zoom = 1; //helps correct an IE issue.
				pt.type = 2;
				pt.b = "alpha(opacity=" + pt.s + ")";
				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
				pt.data = t;
				pt.plugin = plugin;
				pt.setRatio = _setIEOpacityRatio;
			}
			if (isAutoAlpha) {
				//we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, b !== 0 ? "inherit" : "hidden", e === 0 ? "hidden" : "inherit");
				pt.xs0 = "inherit";
				cssp._overwriteProps.push(pt.n);
				cssp._overwriteProps.push(p);
			}
			return pt;
		} });

	var _removeProp = function _removeProp(s, p) {
		if (p) {
			if (s.removeProperty) {
				if (p.substr(0, 2) === "ms" || p.substr(0, 6) === "webkit") {
					//Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
					p = "-" + p;
				}
				s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
			} else {
				//note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
				s.removeAttribute(p);
			}
		}
	},
	    _setClassNameRatio = function _setClassNameRatio(v) {
		this.t._gsClassPT = this;
		if (v === 1 || v === 0) {
			this.t.setAttribute("class", v === 0 ? this.b : this.e);
			var mpt = this.data,
			    //first MiniPropTween
			s = this.t.style;
			while (mpt) {
				if (!mpt.v) {
					_removeProp(s, mpt.p);
				} else {
					s[mpt.p] = mpt.v;
				}
				mpt = mpt._next;
			}
			if (v === 1 && this.t._gsClassPT === this) {
				this.t._gsClassPT = null;
			}
		} else if (this.t.getAttribute("class") !== this.e) {
			this.t.setAttribute("class", this.e);
		}
	};
	_registerComplexSpecialProp("className", { parser: function parser(t, e, p, cssp, pt, plugin, vars) {
			var b = t.getAttribute("class") || "",
			    //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
			cssText = t.style.cssText,
			    difData,
			    bs,
			    cnpt,
			    cnptLookup,
			    mpt;
			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClassNameRatio;
			pt.pr = -11;
			_hasPriority = true;
			pt.b = b;
			bs = _getAllStyles(t, _cs);
			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
			cnpt = t._gsClassPT;
			if (cnpt) {
				cnptLookup = {};
				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
				while (mpt) {
					cnptLookup[mpt.p] = 1;
					mpt = mpt._next;
				}
				cnpt.setRatio(1);
			}
			t._gsClassPT = pt;
			pt.e = e.charAt(1) !== "=" ? e : b.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + (e.charAt(0) === "+" ? " " + e.substr(2) : "");
			t.setAttribute("class", pt.e);
			difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
			t.setAttribute("class", b);
			pt.data = difData.firstMPT;
			if (t.style.cssText !== cssText) {
				//only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
				t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
			}
			pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
			return pt;
		} });

	var _setClearPropsRatio = function _setClearPropsRatio(v) {
		if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") {
			//this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
			var s = this.t.style,
			    transformParse = _specialProps.transform.parse,
			    a,
			    p,
			    i,
			    clearTransform,
			    transform;
			if (this.e === "all") {
				s.cssText = "";
				clearTransform = true;
			} else {
				a = this.e.split(" ").join("").split(",");
				i = a.length;
				while (--i > -1) {
					p = a[i];
					if (_specialProps[p]) {
						if (_specialProps[p].parse === transformParse) {
							clearTransform = true;
						} else {
							p = p === "transformOrigin" ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
						}
					}
					_removeProp(s, p);
				}
			}
			if (clearTransform) {
				_removeProp(s, _transformProp);
				transform = this.t._gsTransform;
				if (transform) {
					if (transform.svg) {
						this.t.removeAttribute("data-svg-origin");
						this.t.removeAttribute("transform");
					}
					delete this.t._gsTransform;
				}
			}
		}
	};
	_registerComplexSpecialProp("clearProps", { parser: function parser(t, e, p, cssp, pt) {
			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClearPropsRatio;
			pt.e = e;
			pt.pr = -10;
			pt.data = cssp._tween;
			_hasPriority = true;
			return pt;
		} });

	p = "bezier,throwProps,physicsProps,physics2D".split(",");
	i = p.length;
	while (i--) {
		_registerPluginProp(p[i]);
	}

	p = CSSPlugin.prototype;
	p._firstPT = p._lastParsedTransform = p._transform = null;

	//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
	p._onInitTween = function (target, vars, tween, index) {
		if (!target.nodeType) {
			//css is only for dom elements
			return false;
		}
		this._target = _target = target;
		this._tween = tween;
		this._vars = vars;
		_index = index;
		_autoRound = vars.autoRound;
		_hasPriority = false;
		_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
		_cs = _getComputedStyle(target, "");
		_overwriteProps = this._overwriteProps;
		var style = target.style,
		    v,
		    pt,
		    pt2,
		    first,
		    last,
		    next,
		    zIndex,
		    tpt,
		    threeD;
		if (_reqSafariFix) if (style.zIndex === "") {
			v = _getStyle(target, "zIndex", _cs);
			if (v === "auto" || v === "") {
				//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
				this._addLazySet(style, "zIndex", 0);
			}
		}

		if (typeof vars === "string") {
			first = style.cssText;
			v = _getAllStyles(target, _cs);
			style.cssText = first + ";" + vars;
			v = _cssDif(target, v, _getAllStyles(target)).difs;
			if (!_supportsOpacity && _opacityValExp.test(vars)) {
				v.opacity = parseFloat(RegExp.$1);
			}
			vars = v;
			style.cssText = first;
		}

		if (vars.className) {
			//className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
			this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
		} else {
			this._firstPT = pt = this.parse(target, vars, null);
		}

		if (this._transformType) {
			threeD = this._transformType === 3;
			if (!_transformProp) {
				style.zoom = 1; //helps correct an IE issue.
			} else if (_isSafari) {
				_reqSafariFix = true;
				//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
				if (style.zIndex === "") {
					zIndex = _getStyle(target, "zIndex", _cs);
					if (zIndex === "auto" || zIndex === "") {
						this._addLazySet(style, "zIndex", 0);
					}
				}
				//Setting WebkitBackfaceVisibility corrects 3 bugs:
				// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
				// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
				// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
				//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
				if (_isSafariLT6) {
					this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
				}
			}
			pt2 = pt;
			while (pt2 && pt2._next) {
				pt2 = pt2._next;
			}
			tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
			this._linkCSSP(tpt, null, pt2);
			tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
			tpt.data = this._transform || _getTransform(target, _cs, true);
			tpt.tween = tween;
			tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
			_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
		}

		if (_hasPriority) {
			//reorders the linked list in order of pr (priority)
			while (pt) {
				next = pt._next;
				pt2 = first;
				while (pt2 && pt2.pr > pt.pr) {
					pt2 = pt2._next;
				}
				if (pt._prev = pt2 ? pt2._prev : last) {
					pt._prev._next = pt;
				} else {
					first = pt;
				}
				if (pt._next = pt2) {
					pt2._prev = pt;
				} else {
					last = pt;
				}
				pt = next;
			}
			this._firstPT = first;
		}
		return true;
	};

	p.parse = function (target, vars, pt, plugin) {
		var style = target.style,
		    p,
		    sp,
		    bn,
		    en,
		    bs,
		    es,
		    bsfx,
		    esfx,
		    isStr,
		    rel;
		for (p in vars) {
			es = vars[p]; //ending value string
			sp = _specialProps[p]; //SpecialProp lookup.
			if (typeof es === "function" && !(sp && sp.allowFunc)) {
				es = es(_index, _target);
			}
			if (sp) {
				pt = sp.parse(target, es, p, this, pt, plugin, vars);
			} else if (p.substr(0, 2) === "--") {
				//for tweening CSS variables (which always start with "--"). To maximize performance and simplicity, we bypass CSSPlugin altogether and just add a normal property tween to the tween instance itself.
				this._tween._propLookup[p] = this._addTween.call(this._tween, target.style, "setProperty", _getComputedStyle(target).getPropertyValue(p) + "", es + "", p, false, p);
				continue;
			} else {
				bs = _getStyle(target, p, _cs) + "";
				isStr = typeof es === "string";
				if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || isStr && _rgbhslExp.test(es)) {
					//Opera uses background: to define color sometimes in addition to backgroundColor:
					if (!isStr) {
						es = _parseColor(es);
						es = (es.length > 3 ? "rgba(" : "rgb(") + es.join(",") + ")";
					}
					pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);
				} else if (isStr && _complexExp.test(es)) {
					pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);
				} else {
					bn = parseFloat(bs);
					bsfx = bn || bn === 0 ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

					if (bs === "" || bs === "auto") {
						if (p === "width" || p === "height") {
							bn = _getDimension(target, p, _cs);
							bsfx = "px";
						} else if (p === "left" || p === "top") {
							bn = _calculateOffset(target, p, _cs);
							bsfx = "px";
						} else {
							bn = p !== "opacity" ? 0 : 1;
							bsfx = "";
						}
					}

					rel = isStr && es.charAt(1) === "=";
					if (rel) {
						en = parseInt(es.charAt(0) + "1", 10);
						es = es.substr(2);
						en *= parseFloat(es);
						esfx = es.replace(_suffixExp, "");
					} else {
						en = parseFloat(es);
						esfx = isStr ? es.replace(_suffixExp, "") : "";
					}

					if (esfx === "") {
						esfx = p in _suffixMap ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
					}

					es = en || en === 0 ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.
					//if the beginning/ending suffixes don't match, normalize them...
					if (bsfx !== esfx) if (esfx !== "" || p === "lineHeight") if (en || en === 0) if (bn) {
						//note: if the beginning value (bn) is 0, we don't need to convert units!
						bn = _convertToPixels(target, p, bn, bsfx);
						if (esfx === "%") {
							bn /= _convertToPixels(target, p, 100, "%") / 100;
							if (vars.strictUnits !== true) {
								//some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
								bs = bn + "%";
							}
						} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
							bn /= _convertToPixels(target, p, 1, esfx);

							//otherwise convert to pixels.
						} else if (esfx !== "px") {
							en = _convertToPixels(target, p, en, esfx);
							esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
						}
						if (rel) if (en || en === 0) {
							es = en + bn + esfx; //the changes we made affect relative calculations, so adjust the end value here.
						}
					}

					if (rel) {
						en += bn;
					}

					if ((bn || bn === 0) && (en || en === 0)) {
						//faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
						pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, _autoRound !== false && (esfx === "px" || p === "zIndex"), 0, bs, es);
						pt.xs0 = esfx;
						//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
					} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
						_log("invalid " + p + " tween value: " + vars[p]);
					} else {
						pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
						pt.xs0 = es === "none" && (p === "display" || p.indexOf("Style") !== -1) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
						//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
					}
				}
			}
			if (plugin) if (pt && !pt.plugin) {
				pt.plugin = plugin;
			}
		}
		return pt;
	};

	//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
	p.setRatio = function (v) {
		var pt = this._firstPT,
		    min = 0.000001,
		    val,
		    str,
		    i;
		//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
		if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
			while (pt) {
				if (pt.type !== 2) {
					if (pt.r && pt.type !== -1) {
						val = pt.r(pt.s + pt.c);
						if (!pt.type) {
							pt.t[pt.p] = val + pt.xs0;
						} else if (pt.type === 1) {
							//complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
							i = pt.l;
							str = pt.xs0 + val + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn" + i] + pt["xs" + (i + 1)];
							}
							pt.t[pt.p] = str;
						}
					} else {
						pt.t[pt.p] = pt.e;
					}
				} else {
					pt.setRatio(v);
				}
				pt = pt._next;
			}
		} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = pt.r(val);
				} else if (val < min) if (val > -min) {
					val = 0;
				}
				if (!pt.type) {
					pt.t[pt.p] = val + pt.xs0;
				} else if (pt.type === 1) {
					//complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
					i = pt.l;
					if (i === 2) {
						pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
					} else if (i === 3) {
						pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
					} else if (i === 4) {
						pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
					} else if (i === 5) {
						pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
					} else {
						str = pt.xs0 + val + pt.xs1;
						for (i = 1; i < pt.l; i++) {
							str += pt["xn" + i] + pt["xs" + (i + 1)];
						}
						pt.t[pt.p] = str;
					}
				} else if (pt.type === -1) {
					//non-tweening value
					pt.t[pt.p] = pt.xs0;
				} else if (pt.setRatio) {
					//custom setRatio() for things like SpecialProps, external plugins, etc.
					pt.setRatio(v);
				}
				pt = pt._next;
			}

			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
		} else {
			while (pt) {
				if (pt.type !== 2) {
					pt.t[pt.p] = pt.b;
				} else {
					pt.setRatio(v);
				}
				pt = pt._next;
			}
		}
	};

	/**
  * @private
  * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
  * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
  * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
  * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
  * doesn't have any transform-related properties of its own. You can call this method as many times as you
  * want and it won't create duplicate CSSPropTweens.
  *
  * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
  */
	p._enableTransforms = function (threeD) {
		this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
		this._transformType = !(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3) ? 3 : 2;
	};

	var lazySet = function lazySet(v) {
		this.t[this.p] = this.e;
		this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
	};
	/** @private Gives us a way to set a value on the first render (and only the first render). **/
	p._addLazySet = function (t, p, v) {
		var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
		pt.e = v;
		pt.setRatio = lazySet;
		pt.data = this;
	};

	/** @private **/
	p._linkCSSP = function (pt, next, prev, remove) {
		if (pt) {
			if (next) {
				next._prev = pt;
			}
			if (pt._next) {
				pt._next._prev = pt._prev;
			}
			if (pt._prev) {
				pt._prev._next = pt._next;
			} else if (this._firstPT === pt) {
				this._firstPT = pt._next;
				remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
			}
			if (prev) {
				prev._next = pt;
			} else if (!remove && this._firstPT === null) {
				this._firstPT = pt;
			}
			pt._next = next;
			pt._prev = prev;
		}
		return pt;
	};

	p._mod = function (lookup) {
		var pt = this._firstPT;
		while (pt) {
			if (typeof lookup[pt.p] === "function") {
				//only gets called by RoundPropsPlugin (ModifyPlugin manages all the rendering internally for CSSPlugin properties that need modification). Remember, we handle rounding a bit differently in this plugin for performance reasons, leveraging "r" as an indicator that the value should be rounded internally.
				pt.r = lookup[pt.p];
			}
			pt = pt._next;
		}
	};

	//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
	p._kill = function (lookup) {
		var copy = lookup,
		    pt,
		    p,
		    xfirst;
		if (lookup.autoAlpha || lookup.alpha) {
			copy = {};
			for (p in lookup) {
				//copy the lookup so that we're not changing the original which may be passed elsewhere.
				copy[p] = lookup[p];
			}
			copy.opacity = 1;
			if (copy.autoAlpha) {
				copy.visibility = 1;
			}
		}
		if (lookup.className && (pt = this._classNamePT)) {
			//for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
			xfirst = pt.xfirst;
			if (xfirst && xfirst._prev) {
				this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
			} else if (xfirst === this._firstPT) {
				this._firstPT = pt._next;
			}
			if (pt._next) {
				this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
			}
			this._classNamePT = null;
		}
		pt = this._firstPT;
		while (pt) {
			if (pt.plugin && pt.plugin !== p && pt.plugin._kill) {
				//for plugins that are registered with CSSPlugin, we should notify them of the kill.
				pt.plugin._kill(lookup);
				p = pt.plugin;
			}
			pt = pt._next;
		}
		return TweenPlugin.prototype._kill.call(this, copy);
	};

	//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
	var _getChildStyles = function _getChildStyles(e, props, targets) {
		var children, i, child, type;
		if (e.slice) {
			i = e.length;
			while (--i > -1) {
				_getChildStyles(e[i], props, targets);
			}
			return;
		}
		children = e.childNodes;
		i = children.length;
		while (--i > -1) {
			child = children[i];
			type = child.type;
			if (child.style) {
				props.push(_getAllStyles(child));
				if (targets) {
					targets.push(child);
				}
			}
			if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
				_getChildStyles(child, props, targets);
			}
		}
	};

	/**
  * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
  * and then compares the style properties of all the target's child elements at the tween's start and end, and
  * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
  * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
  * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
  * is because it creates entirely new tweens that may have completely different targets than the original tween,
  * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
  * and it would create other problems. For example:
  *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
  *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
  *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
  *
  * @param {Object} target object to be tweened
  * @param {number} Duration in seconds (or frames for frames-based tweens)
  * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
  * @return {Array} An array of TweenLite instances
  */
	CSSPlugin.cascadeTo = function (target, duration, vars) {
		var tween = TweenLite.to(target, duration, vars),
		    results = [tween],
		    b = [],
		    e = [],
		    targets = [],
		    _reservedProps = TweenLite._internals.reservedProps,
		    i,
		    difs,
		    p,
		    from;
		target = tween._targets || tween.target;
		_getChildStyles(target, b, targets);
		tween.render(duration, true, true);
		_getChildStyles(target, e);
		tween.render(0, true, true);
		tween._enabled(true);
		i = targets.length;
		while (--i > -1) {
			difs = _cssDif(targets[i], b[i], e[i]);
			if (difs.firstMPT) {
				difs = difs.difs;
				for (p in vars) {
					if (_reservedProps[p]) {
						difs[p] = vars[p];
					}
				}
				from = {};
				for (p in difs) {
					from[p] = b[i][p];
				}
				results.push(TweenLite.fromTo(targets[i], duration, from, difs));
			}
		}
		return results;
	};

	TweenPlugin.activate([CSSPlugin]);
	return CSSPlugin;
}, true);

var CSSPlugin = globals.CSSPlugin;

/*!
 * VERSION: 0.6.1
 * DATE: 2018-08-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

var AttrPlugin = _gsScope._gsDefine.plugin({
	propName: "attr",
	API: 2,
	version: "0.6.1",

	//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
	init: function init(target, value, tween, index) {
		var p, end;
		if (typeof target.setAttribute !== "function") {
			return false;
		}
		for (p in value) {
			end = value[p];
			if (typeof end === "function") {
				end = end(index, target);
			}
			this._addTween(target, "setAttribute", target.getAttribute(p) + "", end + "", p, false, p);
			this._overwriteProps.push(p);
		}
		return true;
	}

});

/*!
 * VERSION: 1.6.0
 * DATE: 2018-08-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */

var RoundPropsPlugin = _gsScope._gsDefine.plugin({
	propName: "roundProps",
	version: "1.7.0",
	priority: -1,
	API: 2,

	//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
	init: function init(target, value, tween) {
		this._tween = tween;
		return true;
	}

});
var _getRoundFunc = function _getRoundFunc(v) {
	//pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
	var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()
	return function (n) {
		return (Math.round(n / v) * v * p | 0) / p;
	};
};
var _roundLinkedList = function _roundLinkedList(node, mod) {
	while (node) {
		if (!node.f && !node.blob) {
			node.m = mod || Math.round;
		}
		node = node._next;
	}
};
var p = RoundPropsPlugin.prototype;

p._onInitAllProps = function () {
	var tween = this._tween,
	    rp = tween.vars.roundProps,
	    lookup = {},
	    rpt = tween._propLookup.roundProps,
	    pt,
	    next,
	    i,
	    p;
	if ((typeof rp === "undefined" ? "undefined" : _typeof(rp)) === "object" && !rp.push) {
		for (p in rp) {
			lookup[p] = _getRoundFunc(rp[p]);
		}
	} else {
		if (typeof rp === "string") {
			rp = rp.split(",");
		}
		i = rp.length;
		while (--i > -1) {
			lookup[rp[i]] = Math.round;
		}
	}

	for (p in lookup) {
		pt = tween._firstPT;
		while (pt) {
			next = pt._next; //record here, because it may get removed
			if (pt.pg) {
				pt.t._mod(lookup);
			} else if (pt.n === p) {
				if (pt.f === 2 && pt.t) {
					//a blob (text containing multiple numeric values)
					_roundLinkedList(pt.t._firstPT, lookup[p]);
				} else {
					this._add(pt.t, p, pt.s, pt.c, lookup[p]);
					//remove from linked list
					if (next) {
						next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = next;
					} else if (tween._firstPT === pt) {
						tween._firstPT = next;
					}
					pt._next = pt._prev = null;
					tween._propLookup[p] = rpt;
				}
			}
			pt = next;
		}
	}
	return false;
};

p._add = function (target, p, s, c, mod) {
	this._addTween(target, p, s, s + c, p, mod || Math.round);
	this._overwriteProps.push(p);
};

/*!
 * VERSION: 0.3.1
 * DATE: 2018-08-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */

var DirectionalRotationPlugin = _gsScope._gsDefine.plugin({
	propName: "directionalRotation",
	version: "0.3.1",
	API: 2,

	//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
	init: function init(target, value, tween, index) {
		if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") {
			value = { rotation: value };
		}
		this.finals = {};
		var cap = value.useRadians === true ? Math.PI * 2 : 360,
		    min = 0.000001,
		    p,
		    v,
		    start,
		    end,
		    dif,
		    split;
		for (p in value) {
			if (p !== "useRadians") {
				end = value[p];
				if (typeof end === "function") {
					end = end(index, target);
				}
				split = (end + "").split("_");
				v = split[0];
				start = parseFloat(typeof target[p] !== "function" ? target[p] : target[p.indexOf("set") || typeof target["get" + p.substr(3)] !== "function" ? p : "get" + p.substr(3)]());
				end = this.finals[p] = typeof v === "string" && v.charAt(1) === "=" ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
				dif = end - start;
				if (split.length) {
					v = split.join("_");
					if (v.indexOf("short") !== -1) {
						dif = dif % cap;
						if (dif !== dif % (cap / 2)) {
							dif = dif < 0 ? dif + cap : dif - cap;
						}
					}
					if (v.indexOf("_cw") !== -1 && dif < 0) {
						dif = (dif + cap * 9999999999) % cap - (dif / cap | 0) * cap;
					} else if (v.indexOf("ccw") !== -1 && dif > 0) {
						dif = (dif - cap * 9999999999) % cap - (dif / cap | 0) * cap;
					}
				}
				if (dif > min || dif < -min) {
					this._addTween(target, p, start, start + dif, p);
					this._overwriteProps.push(p);
				}
			}
		}
		return true;
	},

	//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
	set: function set$$1(ratio) {
		var pt;
		if (ratio !== 1) {
			this._super.setRatio.call(this, ratio);
		} else {
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](this.finals[pt.p]);
				} else {
					pt.t[pt.p] = this.finals[pt.p];
				}
				pt = pt._next;
			}
		}
	}

});

DirectionalRotationPlugin._autoCSS = true;

/*!
 * VERSION: 1.3.9
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */
var _RAD2DEG = 180 / Math.PI;
var _r1 = [];
var _r2 = [];
var _r3 = [];
var _corProps = {};
var _globals = _gsScope._gsDefine.globals;
var Segment = function Segment(a, b, c, d) {
	if (c === d) {
		//if c and d match, the final autoRotate value could lock at -90 degrees, so differentiate them slightly.
		c = d - (d - b) / 1000000;
	}
	if (a === b) {
		//if a and b match, the starting autoRotate value could lock at -90 degrees, so differentiate them slightly.
		b = a + (c - a) / 1000000;
	}
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.da = d - a;
	this.ca = c - a;
	this.ba = b - a;
};
var _correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,";
var cubicToQuadratic = function cubicToQuadratic(a, b, c, d) {
	var q1 = { a: a },
	    q2 = {},
	    q3 = {},
	    q4 = { c: d },
	    mab = (a + b) / 2,
	    mbc = (b + c) / 2,
	    mcd = (c + d) / 2,
	    mabc = (mab + mbc) / 2,
	    mbcd = (mbc + mcd) / 2,
	    m8 = (mbcd - mabc) / 8;
	q1.b = mab + (a - mab) / 4;
	q2.b = mabc + m8;
	q1.c = q2.a = (q1.b + q2.b) / 2;
	q2.c = q3.a = (mabc + mbcd) / 2;
	q3.b = mbcd - m8;
	q4.b = mcd + (d - mcd) / 4;
	q3.c = q4.a = (q3.b + q4.b) / 2;
	return [q1, q2, q3, q4];
};
var _calculateControlPoints = function _calculateControlPoints(a, curviness, quad, basic, correlate) {
	var l = a.length - 1,
	    ii = 0,
	    cp1 = a[0].a,
	    i,
	    p1,
	    p2,
	    p3,
	    seg,
	    m1,
	    m2,
	    mm,
	    cp2,
	    qb,
	    r1,
	    r2,
	    tl;
	for (i = 0; i < l; i++) {
		seg = a[ii];
		p1 = seg.a;
		p2 = seg.d;
		p3 = a[ii + 1].d;

		if (correlate) {
			r1 = _r1[i];
			r2 = _r2[i];
			tl = (r2 + r1) * curviness * 0.25 / (basic ? 0.5 : _r3[i] || 0.5);
			m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : r1 !== 0 ? tl / r1 : 0);
			m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : r2 !== 0 ? tl / r2 : 0);
			mm = p2 - (m1 + ((m2 - m1) * (r1 * 3 / (r1 + r2) + 0.5) / 4 || 0));
		} else {
			m1 = p2 - (p2 - p1) * curviness * 0.5;
			m2 = p2 + (p3 - p2) * curviness * 0.5;
			mm = p2 - (m1 + m2) / 2;
		}
		m1 += mm;
		m2 += mm;

		seg.c = cp2 = m1;
		if (i !== 0) {
			seg.b = cp1;
		} else {
			seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
		}

		seg.da = p2 - p1;
		seg.ca = cp2 - p1;
		seg.ba = cp1 - p1;

		if (quad) {
			qb = cubicToQuadratic(p1, cp1, cp2, p2);
			a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
			ii += 4;
		} else {
			ii++;
		}

		cp1 = m2;
	}
	seg = a[ii];
	seg.b = cp1;
	seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
	seg.da = seg.d - seg.a;
	seg.ca = seg.c - seg.a;
	seg.ba = cp1 - seg.a;
	if (quad) {
		qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
		a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
	}
};
var _parseAnchors = function _parseAnchors(values, p, correlate, prepend) {
	var a = [],
	    l,
	    i,
	    p1,
	    p2,
	    p3,
	    tmp;
	if (prepend) {
		values = [prepend].concat(values);
		i = values.length;
		while (--i > -1) {
			if (typeof (tmp = values[i][p]) === "string") if (tmp.charAt(1) === "=") {
				values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
			}
		}
	}
	l = values.length - 2;
	if (l < 0) {
		a[0] = new Segment(values[0][p], 0, 0, values[0][p]);
		return a;
	}
	for (i = 0; i < l; i++) {
		p1 = values[i][p];
		p2 = values[i + 1][p];
		a[i] = new Segment(p1, 0, 0, p2);
		if (correlate) {
			p3 = values[i + 2][p];
			_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
			_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
		}
	}
	a[i] = new Segment(values[i][p], 0, 0, values[i + 1][p]);
	return a;
};
var bezierThrough = function bezierThrough(values, curviness, quadratic, basic, correlate, prepend) {
	var obj = {},
	    props = [],
	    first = prepend || values[0],
	    i,
	    p,
	    a,
	    j,
	    r,
	    l,
	    seamless,
	    last;
	correlate = typeof correlate === "string" ? "," + correlate + "," : _correlate;
	if (curviness == null) {
		curviness = 1;
	}
	for (p in values[0]) {
		props.push(p);
	}
	//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
	if (values.length > 1) {
		last = values[values.length - 1];
		seamless = true;
		i = props.length;
		while (--i > -1) {
			p = props[i];
			if (Math.abs(first[p] - last[p]) > 0.05) {
				//build in a tolerance of +/-0.05 to accommodate rounding errors.
				seamless = false;
				break;
			}
		}
		if (seamless) {
			values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
			if (prepend) {
				values.unshift(prepend);
			}
			values.push(values[1]);
			prepend = values[values.length - 3];
		}
	}
	_r1.length = _r2.length = _r3.length = 0;
	i = props.length;
	while (--i > -1) {
		p = props[i];
		_corProps[p] = correlate.indexOf("," + p + ",") !== -1;
		obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
	}
	i = _r1.length;
	while (--i > -1) {
		_r1[i] = Math.sqrt(_r1[i]);
		_r2[i] = Math.sqrt(_r2[i]);
	}
	if (!basic) {
		i = props.length;
		while (--i > -1) {
			if (_corProps[p]) {
				a = obj[props[i]];
				l = a.length - 1;
				for (j = 0; j < l; j++) {
					r = a[j + 1].da / _r2[j] + a[j].da / _r1[j] || 0;
					_r3[j] = (_r3[j] || 0) + r * r;
				}
			}
		}
		i = _r3.length;
		while (--i > -1) {
			_r3[i] = Math.sqrt(_r3[i]);
		}
	}
	i = props.length;
	j = quadratic ? 4 : 1;
	while (--i > -1) {
		p = props[i];
		a = obj[p];
		_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
		if (seamless) {
			a.splice(0, j);
			a.splice(a.length - j, j);
		}
	}
	return obj;
};
var _parseBezierData = function _parseBezierData(values, type, prepend) {
	type = type || "soft";
	var obj = {},
	    inc = type === "cubic" ? 3 : 2,
	    soft = type === "soft",
	    props = [],
	    a,
	    b,
	    c,
	    d,
	    cur,
	    i,
	    j,
	    l,
	    p,
	    cnt,
	    tmp;
	if (soft && prepend) {
		values = [prepend].concat(values);
	}
	if (values == null || values.length < inc + 1) {
		throw "invalid Bezier data";
	}
	for (p in values[0]) {
		props.push(p);
	}
	i = props.length;
	while (--i > -1) {
		p = props[i];
		obj[p] = cur = [];
		cnt = 0;
		l = values.length;
		for (j = 0; j < l; j++) {
			a = prepend == null ? values[j][p] : typeof (tmp = values[j][p]) === "string" && tmp.charAt(1) === "=" ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
			if (soft) if (j > 1) if (j < l - 1) {
				cur[cnt++] = (a + cur[cnt - 2]) / 2;
			}
			cur[cnt++] = a;
		}
		l = cnt - inc + 1;
		cnt = 0;
		for (j = 0; j < l; j += inc) {
			a = cur[j];
			b = cur[j + 1];
			c = cur[j + 2];
			d = inc === 2 ? 0 : cur[j + 3];
			cur[cnt++] = tmp = inc === 3 ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
		}
		cur.length = cnt;
	}
	return obj;
};
var _addCubicLengths = function _addCubicLengths(a, steps, resolution) {
	var inc = 1 / resolution,
	    j = a.length,
	    d,
	    d1,
	    s,
	    da,
	    ca,
	    ba,
	    p,
	    i,
	    inv,
	    bez,
	    index;
	while (--j > -1) {
		bez = a[j];
		s = bez.a;
		da = bez.d - s;
		ca = bez.c - s;
		ba = bez.b - s;
		d = d1 = 0;
		for (i = 1; i <= resolution; i++) {
			p = inc * i;
			inv = 1 - p;
			d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
			index = j * resolution + i - 1;
			steps[index] = (steps[index] || 0) + d * d;
		}
	}
};
var _parseLengthData = function _parseLengthData(obj, resolution) {
	resolution = resolution >> 0 || 6;
	var a = [],
	    lengths = [],
	    d = 0,
	    total = 0,
	    threshold = resolution - 1,
	    segments = [],
	    curLS = [],
	    //current length segments array
	p,
	    i,
	    l,
	    index;
	for (p in obj) {
		_addCubicLengths(obj[p], a, resolution);
	}
	l = a.length;
	for (i = 0; i < l; i++) {
		d += Math.sqrt(a[i]);
		index = i % resolution;
		curLS[index] = d;
		if (index === threshold) {
			total += d;
			index = i / resolution >> 0;
			segments[index] = curLS;
			lengths[index] = total;
			d = 0;
			curLS = [];
		}
	}
	return { length: total, lengths: lengths, segments: segments };
};
var BezierPlugin = _gsScope._gsDefine.plugin({
	propName: "bezier",
	priority: -1,
	version: "1.3.9",
	API: 2,
	global: true,

	//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
	init: function init(target, vars, tween) {
		this._target = target;
		if (vars instanceof Array) {
			vars = { values: vars };
		}
		this._func = {};
		this._mod = {};
		this._props = [];
		this._timeRes = vars.timeResolution == null ? 6 : parseInt(vars.timeResolution, 10);
		var values = vars.values || [],
		    first = {},
		    second = values[0],
		    autoRotate = vars.autoRotate || tween.vars.orientToBezier,
		    p,
		    isFunc,
		    i,
		    j,
		    prepend;

		this._autoRotate = autoRotate ? autoRotate instanceof Array ? autoRotate : [["x", "y", "rotation", autoRotate === true ? 0 : Number(autoRotate) || 0]] : null;
		for (p in second) {
			this._props.push(p);
		}

		i = this._props.length;
		while (--i > -1) {
			p = this._props[i];

			this._overwriteProps.push(p);
			isFunc = this._func[p] = typeof target[p] === "function";
			first[p] = !isFunc ? parseFloat(target[p]) : target[p.indexOf("set") || typeof target["get" + p.substr(3)] !== "function" ? p : "get" + p.substr(3)]();
			if (!prepend) if (first[p] !== values[0][p]) {
				prepend = first;
			}
		}
		this._beziers = vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft" ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, vars.type === "thruBasic", vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
		this._segCount = this._beziers[p].length;

		if (this._timeRes) {
			var ld = _parseLengthData(this._beziers, this._timeRes);
			this._length = ld.length;
			this._lengths = ld.lengths;
			this._segments = ld.segments;
			this._l1 = this._li = this._s1 = this._si = 0;
			this._l2 = this._lengths[0];
			this._curSeg = this._segments[0];
			this._s2 = this._curSeg[0];
			this._prec = 1 / this._curSeg.length;
		}

		if (autoRotate = this._autoRotate) {
			this._initialRotations = [];
			if (!(autoRotate[0] instanceof Array)) {
				this._autoRotate = autoRotate = [autoRotate];
			}
			i = autoRotate.length;
			while (--i > -1) {
				for (j = 0; j < 3; j++) {
					p = autoRotate[i][j];
					this._func[p] = typeof target[p] === "function" ? target[p.indexOf("set") || typeof target["get" + p.substr(3)] !== "function" ? p : "get" + p.substr(3)] : false;
				}
				p = autoRotate[i][2];
				this._initialRotations[i] = (this._func[p] ? this._func[p].call(this._target) : this._target[p]) || 0;
				this._overwriteProps.push(p);
			}
		}
		this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
		return true;
	},

	//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
	set: function set(v) {
		var segments = this._segCount,
		    func = this._func,
		    target = this._target,
		    notStart = v !== this._startRatio,
		    curIndex,
		    inv,
		    i,
		    p,
		    b,
		    t,
		    val,
		    l,
		    lengths,
		    curSeg,
		    v1;
		if (!this._timeRes) {
			curIndex = v < 0 ? 0 : v >= 1 ? segments - 1 : segments * v >> 0;
			t = (v - curIndex * (1 / segments)) * segments;
		} else {
			lengths = this._lengths;
			curSeg = this._curSeg;
			v1 = v * this._length;
			i = this._li;
			//find the appropriate segment (if the currently cached one isn't correct)
			if (v1 > this._l2 && i < segments - 1) {
				l = segments - 1;
				while (i < l && (this._l2 = lengths[++i]) <= v1) {}
				this._l1 = lengths[i - 1];
				this._li = i;
				this._curSeg = curSeg = this._segments[i];
				this._s2 = curSeg[this._s1 = this._si = 0];
			} else if (v1 < this._l1 && i > 0) {
				while (i > 0 && (this._l1 = lengths[--i]) >= v1) {}
				if (i === 0 && v1 < this._l1) {
					this._l1 = 0;
				} else {
					i++;
				}
				this._l2 = lengths[i];
				this._li = i;
				this._curSeg = curSeg = this._segments[i];
				this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
				this._s2 = curSeg[this._si];
			}
			curIndex = i;
			//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
			v1 -= this._l1;
			i = this._si;
			if (v1 > this._s2 && i < curSeg.length - 1) {
				l = curSeg.length - 1;
				while (i < l && (this._s2 = curSeg[++i]) <= v1) {}
				this._s1 = curSeg[i - 1];
				this._si = i;
			} else if (v1 < this._s1 && i > 0) {
				while (i > 0 && (this._s1 = curSeg[--i]) >= v1) {}
				if (i === 0 && v1 < this._s1) {
					this._s1 = 0;
				} else {
					i++;
				}
				this._s2 = curSeg[i];
				this._si = i;
			}
			t = v === 1 ? 1 : (i + (v1 - this._s1) / (this._s2 - this._s1)) * this._prec || 0;
		}
		inv = 1 - t;

		i = this._props.length;
		while (--i > -1) {
			p = this._props[i];
			b = this._beziers[p][curIndex];
			val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
			if (this._mod[p]) {
				val = this._mod[p](val, target);
			}
			if (func[p]) {
				target[p](val);
			} else {
				target[p] = val;
			}
		}

		if (this._autoRotate) {
			var ar = this._autoRotate,
			    b2,
			    x1,
			    y1,
			    x2,
			    y2,
			    add,
			    conv;
			i = ar.length;
			while (--i > -1) {
				p = ar[i][2];
				add = ar[i][3] || 0;
				conv = ar[i][4] === true ? 1 : _RAD2DEG;
				b = this._beziers[ar[i][0]];
				b2 = this._beziers[ar[i][1]];

				if (b && b2) {
					//in case one of the properties got overwritten.
					b = b[curIndex];
					b2 = b2[curIndex];

					x1 = b.a + (b.b - b.a) * t;
					x2 = b.b + (b.c - b.b) * t;
					x1 += (x2 - x1) * t;
					x2 += (b.c + (b.d - b.c) * t - x2) * t;

					y1 = b2.a + (b2.b - b2.a) * t;
					y2 = b2.b + (b2.c - b2.b) * t;
					y1 += (y2 - y1) * t;
					y2 += (b2.c + (b2.d - b2.c) * t - y2) * t;

					val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

					if (this._mod[p]) {
						val = this._mod[p](val, target); //for modProps
					}

					if (func[p]) {
						target[p](val);
					} else {
						target[p] = val;
					}
				}
			}
		}
	}
});
var p$1 = BezierPlugin.prototype;

BezierPlugin.bezierThrough = bezierThrough;
BezierPlugin.cubicToQuadratic = cubicToQuadratic;
BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
BezierPlugin.quadraticToCubic = function (a, b, c) {
	return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
};

BezierPlugin._cssRegister = function () {
	var CSSPlugin = _globals.CSSPlugin;
	if (!CSSPlugin) {
		return;
	}
	var _internals = CSSPlugin._internals,
	    _parseToProxy = _internals._parseToProxy,
	    _setPluginRatio = _internals._setPluginRatio,
	    CSSPropTween = _internals.CSSPropTween;
	_internals._registerComplexSpecialProp("bezier", { parser: function parser(t, e, prop, cssp, pt, plugin) {
			if (e instanceof Array) {
				e = { values: e };
			}
			plugin = new BezierPlugin();
			var values = e.values,
			    l = values.length - 1,
			    pluginValues = [],
			    v = {},
			    i,
			    p,
			    data;
			if (l < 0) {
				return pt;
			}
			for (i = 0; i <= l; i++) {
				data = _parseToProxy(t, values[i], cssp, pt, plugin, l !== i);
				pluginValues[i] = data.end;
			}
			for (p in e) {
				v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
			}
			v.values = pluginValues;
			pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
			pt.data = data;
			pt.plugin = plugin;
			pt.setRatio = _setPluginRatio;
			if (v.autoRotate === 0) {
				v.autoRotate = true;
			}
			if (v.autoRotate && !(v.autoRotate instanceof Array)) {
				i = v.autoRotate === true ? 0 : Number(v.autoRotate);
				v.autoRotate = data.end.left != null ? [["left", "top", "rotation", i, false]] : data.end.x != null ? [["x", "y", "rotation", i, false]] : false;
			}
			if (v.autoRotate) {
				if (!cssp._transform) {
					cssp._enableTransforms(false);
				}
				data.autoRotate = cssp._target._gsTransform;
				data.proxy.rotation = data.autoRotate.rotation || 0;
				cssp._overwriteProps.push("rotation");
			}
			plugin._onInitTween(data.proxy, v, cssp._tween);
			return pt;
		} });
};

p$1._mod = function (lookup) {
	var op = this._overwriteProps,
	    i = op.length,
	    val;
	while (--i > -1) {
		val = lookup[op[i]];
		if (val && typeof val === "function") {
			this._mod[op[i]] = val;
		}
	}
};

p$1._kill = function (lookup) {
	var a = this._props,
	    p,
	    i;
	for (p in this._beziers) {
		if (p in lookup) {
			delete this._beziers[p];
			delete this._func[p];
			i = a.length;
			while (--i > -1) {
				if (a[i] === p) {
					a.splice(i, 1);
				}
			}
		}
	}
	a = this._autoRotate;
	if (a) {
		i = a.length;
		while (--i > -1) {
			if (lookup[a[i][2]]) {
				a.splice(i, 1);
			}
		}
	}
	return this._super._kill.call(this, lookup);
};

/*!
 * VERSION: 1.16.1
 * DATE: 2018-08-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */

_gsScope._gsDefine("easing.Back", ["easing.Ease"], function () {

	var w = _gsScope.GreenSockGlobals || _gsScope,
	    gs = w.com.greensock,
	    _2PI = Math.PI * 2,
	    _HALF_PI = Math.PI / 2,
	    _class = gs._class,
	    _create = function _create(n, f) {
		var C = _class("easing." + n, function () {}, true),
		    p = C.prototype = new Ease();
		p.constructor = C;
		p.getRatio = f;
		return C;
	},
	    _easeReg = Ease.register || function () {},
	    //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
	_wrap = function _wrap(name, EaseOut, EaseIn, EaseInOut, aliases) {
		var C = _class("easing." + name, {
			easeOut: new EaseOut(),
			easeIn: new EaseIn(),
			easeInOut: new EaseInOut()
		}, true);
		_easeReg(C, name);
		return C;
	},
	    EasePoint = function EasePoint(time, value, next) {
		this.t = time;
		this.v = value;
		if (next) {
			this.next = next;
			next.prev = this;
			this.c = next.v - value;
			this.gap = next.t - time;
		}
	},


	//Back
	_createBack = function _createBack(n, f) {
		var C = _class("easing." + n, function (overshoot) {
			this._p1 = overshoot || overshoot === 0 ? overshoot : 1.70158;
			this._p2 = this._p1 * 1.525;
		}, true),
		    p = C.prototype = new Ease();
		p.constructor = C;
		p.getRatio = f;
		p.config = function (overshoot) {
			return new C(overshoot);
		};
		return C;
	},
	    Back = _wrap("Back", _createBack("BackOut", function (p) {
		return (p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1;
	}), _createBack("BackIn", function (p) {
		return p * p * ((this._p1 + 1) * p - this._p1);
	}), _createBack("BackInOut", function (p) {
		return (p *= 2) < 1 ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
	})),


	//SlowMo
	SlowMo = _class("easing.SlowMo", function (linearRatio, power, yoyoMode) {
		power = power || power === 0 ? power : 0.7;
		if (linearRatio == null) {
			linearRatio = 0.7;
		} else if (linearRatio > 1) {
			linearRatio = 1;
		}
		this._p = linearRatio !== 1 ? power : 0;
		this._p1 = (1 - linearRatio) / 2;
		this._p2 = linearRatio;
		this._p3 = this._p1 + this._p2;
		this._calcEnd = yoyoMode === true;
	}, true),
	    p = SlowMo.prototype = new Ease(),
	    SteppedEase,
	    ExpoScaleEase,
	    RoughEase,
	    _createElastic;

	p.constructor = SlowMo;
	p.getRatio = function (p) {
		var r = p + (0.5 - p) * this._p;
		if (p < this._p1) {
			return this._calcEnd ? 1 - (p = 1 - p / this._p1) * p : r - (p = 1 - p / this._p1) * p * p * p * r;
		} else if (p > this._p3) {
			return this._calcEnd ? p === 1 ? 0 : 1 - (p = (p - this._p3) / this._p1) * p : r + (p - r) * (p = (p - this._p3) / this._p1) * p * p * p; //added p === 1 ? 0 to avoid floating point rounding errors from affecting the final value, like 1 - 0.7 = 0.30000000000000004 instead of 0.3
		}
		return this._calcEnd ? 1 : r;
	};
	SlowMo.ease = new SlowMo(0.7, 0.7);

	p.config = SlowMo.config = function (linearRatio, power, yoyoMode) {
		return new SlowMo(linearRatio, power, yoyoMode);
	};

	//SteppedEase
	SteppedEase = _class("easing.SteppedEase", function (steps, immediateStart) {
		steps = steps || 1;
		this._p1 = 1 / steps;
		this._p2 = steps + (immediateStart ? 0 : 1);
		this._p3 = immediateStart ? 1 : 0;
	}, true);
	p = SteppedEase.prototype = new Ease();
	p.constructor = SteppedEase;
	p.getRatio = function (p) {
		if (p < 0) {
			p = 0;
		} else if (p >= 1) {
			p = 0.999999999;
		}
		return ((this._p2 * p | 0) + this._p3) * this._p1;
	};
	p.config = SteppedEase.config = function (steps, immediateStart) {
		return new SteppedEase(steps, immediateStart);
	};

	//ExpoScaleEase
	ExpoScaleEase = _class("easing.ExpoScaleEase", function (start, end, ease) {
		this._p1 = Math.log(end / start);
		this._p2 = end - start;
		this._p3 = start;
		this._ease = ease;
	}, true);
	p = ExpoScaleEase.prototype = new Ease();
	p.constructor = ExpoScaleEase;
	p.getRatio = function (p) {
		if (this._ease) {
			p = this._ease.getRatio(p);
		}
		return (this._p3 * Math.exp(this._p1 * p) - this._p3) / this._p2;
	};
	p.config = ExpoScaleEase.config = function (start, end, ease) {
		return new ExpoScaleEase(start, end, ease);
	};

	//RoughEase
	RoughEase = _class("easing.RoughEase", function (vars) {
		vars = vars || {};
		var taper = vars.taper || "none",
		    a = [],
		    cnt = 0,
		    points = (vars.points || 20) | 0,
		    i = points,
		    randomize = vars.randomize !== false,
		    clamp = vars.clamp === true,
		    template = vars.template instanceof Ease ? vars.template : null,
		    strength = typeof vars.strength === "number" ? vars.strength * 0.4 : 0.4,
		    x,
		    y,
		    bump,
		    invX,
		    obj,
		    pnt;
		while (--i > -1) {
			x = randomize ? Math.random() : 1 / points * i;
			y = template ? template.getRatio(x) : x;
			if (taper === "none") {
				bump = strength;
			} else if (taper === "out") {
				invX = 1 - x;
				bump = invX * invX * strength;
			} else if (taper === "in") {
				bump = x * x * strength;
			} else if (x < 0.5) {
				//"both" (start)
				invX = x * 2;
				bump = invX * invX * 0.5 * strength;
			} else {
				//"both" (end)
				invX = (1 - x) * 2;
				bump = invX * invX * 0.5 * strength;
			}
			if (randomize) {
				y += Math.random() * bump - bump * 0.5;
			} else if (i % 2) {
				y += bump * 0.5;
			} else {
				y -= bump * 0.5;
			}
			if (clamp) {
				if (y > 1) {
					y = 1;
				} else if (y < 0) {
					y = 0;
				}
			}
			a[cnt++] = { x: x, y: y };
		}
		a.sort(function (a, b) {
			return a.x - b.x;
		});

		pnt = new EasePoint(1, 1, null);
		i = points;
		while (--i > -1) {
			obj = a[i];
			pnt = new EasePoint(obj.x, obj.y, pnt);
		}

		this._prev = new EasePoint(0, 0, pnt.t !== 0 ? pnt : pnt.next);
	}, true);
	p = RoughEase.prototype = new Ease();
	p.constructor = RoughEase;
	p.getRatio = function (p) {
		var pnt = this._prev;
		if (p > pnt.t) {
			while (pnt.next && p >= pnt.t) {
				pnt = pnt.next;
			}
			pnt = pnt.prev;
		} else {
			while (pnt.prev && p <= pnt.t) {
				pnt = pnt.prev;
			}
		}
		this._prev = pnt;
		return pnt.v + (p - pnt.t) / pnt.gap * pnt.c;
	};
	p.config = function (vars) {
		return new RoughEase(vars);
	};
	RoughEase.ease = new RoughEase();

	//Bounce
	_wrap("Bounce", _create("BounceOut", function (p) {
		if (p < 1 / 2.75) {
			return 7.5625 * p * p;
		} else if (p < 2 / 2.75) {
			return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
		} else if (p < 2.5 / 2.75) {
			return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
		}
		return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
	}), _create("BounceIn", function (p) {
		if ((p = 1 - p) < 1 / 2.75) {
			return 1 - 7.5625 * p * p;
		} else if (p < 2 / 2.75) {
			return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
		} else if (p < 2.5 / 2.75) {
			return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
		}
		return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
	}), _create("BounceInOut", function (p) {
		var invert = p < 0.5;
		if (invert) {
			p = 1 - p * 2;
		} else {
			p = p * 2 - 1;
		}
		if (p < 1 / 2.75) {
			p = 7.5625 * p * p;
		} else if (p < 2 / 2.75) {
			p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
		} else if (p < 2.5 / 2.75) {
			p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
		} else {
			p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
		}
		return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
	}));

	//CIRC
	_wrap("Circ", _create("CircOut", function (p) {
		return Math.sqrt(1 - (p = p - 1) * p);
	}), _create("CircIn", function (p) {
		return -(Math.sqrt(1 - p * p) - 1);
	}), _create("CircInOut", function (p) {
		return (p *= 2) < 1 ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
	}));

	//Elastic
	_createElastic = function _createElastic(n, f, def) {
		var C = _class("easing." + n, function (amplitude, period) {
			this._p1 = amplitude >= 1 ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
			this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
			this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
			this._p2 = _2PI / this._p2; //precalculate to optimize
		}, true),
		    p = C.prototype = new Ease();
		p.constructor = C;
		p.getRatio = f;
		p.config = function (amplitude, period) {
			return new C(amplitude, period);
		};
		return C;
	};
	_wrap("Elastic", _createElastic("ElasticOut", function (p) {
		return this._p1 * Math.pow(2, -10 * p) * Math.sin((p - this._p3) * this._p2) + 1;
	}, 0.3), _createElastic("ElasticIn", function (p) {
		return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * this._p2));
	}, 0.3), _createElastic("ElasticInOut", function (p) {
		return (p *= 2) < 1 ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (p -= 1)) * Math.sin((p - this._p3) * this._p2) * 0.5 + 1;
	}, 0.45));

	//Expo
	_wrap("Expo", _create("ExpoOut", function (p) {
		return 1 - Math.pow(2, -10 * p);
	}), _create("ExpoIn", function (p) {
		return Math.pow(2, 10 * (p - 1)) - 0.001;
	}), _create("ExpoInOut", function (p) {
		return (p *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
	}));

	//Sine
	_wrap("Sine", _create("SineOut", function (p) {
		return Math.sin(p * _HALF_PI);
	}), _create("SineIn", function (p) {
		return -Math.cos(p * _HALF_PI) + 1;
	}), _create("SineInOut", function (p) {
		return -0.5 * (Math.cos(Math.PI * p) - 1);
	}));

	_class("easing.EaseLookup", {
		find: function find(s) {
			return Ease.map[s];
		}
	}, true);

	//register the non-standard eases
	_easeReg(w.SlowMo, "SlowMo", "ease,");
	_easeReg(RoughEase, "RoughEase", "ease,");
	_easeReg(SteppedEase, "SteppedEase", "ease,");

	return Back;
}, true);

var Back = globals.Back;
var Elastic = globals.Elastic;
var Bounce = globals.Bounce;
var RoughEase = globals.RoughEase;
var SlowMo = globals.SlowMo;
var SteppedEase = globals.SteppedEase;
var Circ = globals.Circ;
var Expo = globals.Expo;
var Sine = globals.Sine;
var ExpoScaleEase = globals.ExpoScaleEase;

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
/* eslint-disable */

//the following two lines are designed to prevent tree shaking of the classes that were historically included with TweenMax (otherwise, folks would have to reference CSSPlugin, for example, to ensure their CSS-related animations worked)
var TweenMax = TweenMax$1;
TweenMax._autoActivated = [TimelineLite, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, RoundPropsPlugin, DirectionalRotationPlugin, Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, ExpoScaleEase];

/*!
 * VERSION: 2.1.3
 * DATE: 2019-05-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/

function addClass() {
  // adds mobile class, and mobile os to html tag
  var deviceAgent = navigator.userAgent.toLowerCase();

  if (deviceAgent.match(/(iphone|ipod|ipad)/)) {
    $('html').addClass('ios');
    $('html').addClass('mobile');
  }

  if (deviceAgent.match(/android/)) {
    $('html').addClass('android');
    $('html').addClass('mobile');
  }

  if (deviceAgent.match(/blackberry/)) {
    $('html').addClass('blackberry');
    $('html').addClass('mobile');
  }

  if (deviceAgent.match(/(symbianos|^sonyericsson|^nokia|^samsung|^lg)/)) {
    $('html').addClass('mobile');
  }
}

function isMobile() {
  return $('html').hasClass('mobile');
}

var Mobile = { addClass: addClass, isMobile: isMobile };

/* eslint-enable no-unused-vars */

var UI = function () {
  function UI() {
    var _this = this;

    classCallCheck(this, UI);

    this.initDom();

    this.backToTop.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 500);
      return false;
    });

    $(document).ready(function () {
      _this.showPage();
    });
  }

  createClass(UI, [{
    key: 'showPage',
    value: function showPage() {
      TweenLite.to(this.page, 1, { opacity: 1 });
    }
  }, {
    key: 'hidePage',
    value: function hidePage() {
      TweenLite.to(this.page, 0.7, { opacity: 0 });
    }
  }, {
    key: 'initDom',
    value: function initDom() {
      this.backToTop = $('#back-to-top');

      this.page = $('.page');

      this.html = $('html');

      this.buttons = $('.button');
    }
  }, {
    key: 'affectButtonUI',
    value: function affectButtonUI(callback, e) {
      var scale;
      var button = $(e.currentTarget).children('button');

      var inSpeed = 200;
      var outSpeed = 700;

      if (this.html.hasClass('mobile')) {
        scale = 1.1;
      } else {
        scale = 1.3;
      }

      TweenLite.to(button, inSpeed / 1000, { scaleX: scale });

      setTimeout(function () {
        TweenLite.to(button, outSpeed / 1000, { scaleX: 1 });
        setTimeout(function () {
          callback(e);
        }, outSpeed);
      }, inSpeed);
    }
  }, {
    key: 'affectCloseButtonUI',
    value: function affectCloseButtonUI(callback, e) {
      var button = $(e.currentTarget);

      TweenLite.to(button, 0.6, { rotation: 0, ease: Elastic.easeOut });

      setTimeout(function () {
        callback(e);
      }, 900);
    }
  }, {
    key: 'desktopView',
    value: function desktopView() {
      return window.matchMedia('(min-width: 992px)').matches;
    }
  }, {
    key: 'largerDesktopView',
    value: function largerDesktopView() {
      return window.matchMedia('(min-width: 1025px)').matches;
    }
  }]);
  return UI;
}();

var Modal = function () {
  function Modal() {
    classCallCheck(this, Modal);

    this.initDom();

    var self = this;

    $(document).ready(function () {
      return self.close.on('click', self.hide.bind(self));
    });
  }

  createClass(Modal, [{
    key: 'show',
    value: function show() {
      var _this = this;

      TweenLite.set(this.modalWrap, { display: 'block' });

      TweenLite.to(this.modalWrap, 0.7, { opacity: 1 });

      if (window.matchMedia('(min-width: 992px)').matches) {
        setTimeout(function () {
          TweenLite.to(_this.modal, 1, { y: 0, ease: Elastic.easeOut });
          TweenLite.set(_this.close, { rotation: 180 });
        }, 500);
      } else {
        setTimeout(function () {
          TweenLite.to(_this.modal, 1, { x: 0, ease: Bounce.easeOut });
          TweenLite.to(_this.close, 1, { rotation: 180, ease: Elastic.easeOut });
        }, 500);
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this2 = this;

      TweenLite.to(this.close, 0.7, { rotation: 0, ease: Elastic.easeOut });

      setTimeout(function () {
        if (_this2.isMobile) {
          TweenLite.to(_this2.modal, 0.6, { x: _this2.WIDTH });

          setTimeout(function () {
            TweenLite.to(_this2.modalWrap, 0.7, { opacity: 0 });
            setTimeout(function () {
              TweenLite.set(_this2.modalWrap, { display: 'none' });
            }, 700);
          }, 600);
        } else {
          TweenLite.to(_this2.modal, 0.6, { y: -_this2.HEIGHT });

          setTimeout(function () {
            TweenLite.to(_this2.modalWrap, 0.7, { opacity: 0 });
            setTimeout(function () {
              TweenLite.set(_this2.modalWrap, { display: 'none' });
            }, 700);
          }, 600);
        }
      }, 500);
    }
  }, {
    key: 'initDom',
    value: function initDom() {
      this.html = $('html');

      this.isMobile = this.html.hasClass('mobile');

      this.modalWrap = $('#modal-wrapper');
      this.modal = $('#modal');
      this.close = $('#close-button');

      this.WIDTH = this.html.width();
      this.HEIGHT = this.html.height();
    }
  }]);
  return Modal;
}();

var Subscribe = function () {
  function Subscribe() {
    classCallCheck(this, Subscribe);

    this.initDom();
    var self = this;

    // Throttlers
    self.ctaThrottle = false;
    self.subscribeThrottle = false;

    $(document).ready(function () {
      self.subscribeCta.on('click', function (e) {
        if (self.ctaThrottle) {
          return;
        }
        self.ctaThrottle = true;
        if ($(e.currentTarget).hasClass('no-ui')) {
          return self.showForm(e);
        } else {
          window.UI.affectButtonUI(self.showForm.bind(self), e);
        }
      });

      self.closeButton.on('click', function (e) {
        var boundHideForm = self.hideForm.bind(self);

        // Mobile
        if (self.isMobile) {
          return window.UI.affectCloseButtonUI(self.hideForm.bind(window.Modal), e);
        }

        // Desktop
        boundHideForm();
      });

      self.downloadGraphic.on('click', self.hideForm);

      // Hover states
      if (!self.isMobile) {
        self.closeButton.hover(function () {
          TweenLite.to(self.closeButton, 0.4, { rotation: 180, ease: Back.easeOut.config(1.7) });
        }, function () {
          TweenLite.to(self.closeButton, 0.4, { rotation: 0 });
        });
        self.downloadGraphic.hover(function () {
          TweenLite.to(self.downloadGraphic, 0.4, { scale: 1.1 });
        }, function () {
          TweenLite.to(self.downloadGraphic, 0.4, { scale: 1 });
        });
      }
      self.blackout.on('click', self.hideForm);

      self.inputs.on('focus', self.removeError);

      self.subscribeBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (self.subscribeThrottle) {
          return;
        }
        self.subscribeThrottle = true;
        window.UI.affectButtonUI(self.doSubscribe.bind(self), e);
      });
    });
    // -- DOC READY
  }

  createClass(Subscribe, [{
    key: 'showForm',
    value: function showForm(e) {
      if (!e) {
        this.newsCheck.prop('checked', true);
        this.portCheck.prop('checked', false);
      } else if ($(e.currentTarget).hasClass('prefill-subscribe')) {
        this.newsCheck.prop('checked', true);
        this.portCheck.prop('checked', false);
      } else {
        this.newsCheck.prop('checked', false);
        this.portCheck.prop('checked', true);
      }

      TweenLite.set(this.modalWrapper, { display: 'block' });
      TweenLite.to(this.blackout, 0.7, { opacity: 1 });

      if (window.UI.desktopView()) {
        TweenLite.to(this.modal, 1, { y: '0%', ease: Elastic.easeOut });
        if (this.isMobile) {
          TweenLite.set(this.closeButton, { rotation: 180 });
        }
      } else {
        TweenLite.set(this.closeButton, { rotation: 180 });
        TweenLite.to(this.modal, 0.8, { x: '0%', ease: Bounce.easeOut });
      }
    }
  }, {
    key: 'hideForm',
    value: function hideForm() {
      if (window.UI.desktopView()) {
        TweenLite.to(this.modal, 0.5, { y: '-140%' });
      } else {
        TweenLite.to(this.modal, 0.6, { x: '100%' });
      }

      TweenLite.to(this.blackout, 0.7, { opacity: 0 });

      var self = this;
      setTimeout(function () {
        TweenLite.set(self.modalWrapper, { display: 'none' });
        //  TweenLite.set this.brochureContent,  {display: 'none'}
        self.ctaThrottle = false;
      }, 750);
    }
  }, {
    key: 'initDom',
    value: function initDom() {
      // Global
      this.html = $('html');
      this.isMobile = this.html.hasClass('mobile');

      // The Modal
      this.modalWrapper = $('.modal-wrapper');
      this.modal = $('.modal');
      this.blackout = $('.blackout');
      this.closeButton = $('.close-modal-button');

      this.subscribeContent = $('#subscribe-wrap');
      this.thanksContent = $('#thanks-wrap');
      this.thanksGraphic = $('#thanks-graphic');

      // The form
      this.inputs = $('input[type="text"], input[type="email"]');
      this.nameField = $('#name-field');
      this.emailField = $('#email-field');
      this.subscribeBtn = $('#subscribe-button');
      this.newsCheck = $('#newsletter-check');
      this.portCheck = $('#portfolio-check');

      this.downloadGraphic = $('#download-link');

      //  The toggler
      this.subscribeCta = $('.subscribe-cta');
    }
  }, {
    key: 'removeError',
    value: function removeError(e) {
      $(e.currentTarget).removeClass('error');
    }
  }, {
    key: 'doSubscribe',
    value: function doSubscribe() {
      if (!this.validation.bind(this)) {
        this.subscribeThrottle = false;
        return;
      }

      this.disableForm();

      var contact = {
        'name': this.nameField.val(),
        'email': this.emailField.val(),
        'newsletter': this.newsCheck[0].checked,
        'portfolio': this.portCheck[0].checked

        // this.enableForm()
        // this.subscribeThrottle = false
        // return console.log contact

      };$.ajax({
        'url': '/subscribe',
        'type': 'post',
        'data': { contact: contact }
      }).success(function (res) {
        this.handleSuccess(res);
      }).error(function (e) {
        this.handleError(e);
      });
    }
  }, {
    key: 'handleSuccess',
    value: function handleSuccess(res) {
      TweenLite.to(this.subscribeContent, 0.7, { opacity: 0 });

      setTimeout(function () {
        TweenLite.set(this.subscribeContent, { display: 'none' });
        TweenLite.set(this.thanksContent, { display: 'block' });

        setTimeout(function () {
          TweenLite.to(this.thanksContent, 0.7, { opacity: 1 });

          if (res.brochure) {
            TweenLite.to(this.downloadGraphic, 0.7, { opacity: 1, scale: 1, ease: Bounce.easeOut }).delay(0.6);
          } else {
            TweenLite.to(this.thanksGraphic, 0.7, { opacity: 1, scale: 1, ease: Bounce.easeOut }).delay(0.6);
          }
        }, 10);

        this.subscribeCta.remove();

        if (!res.brochure) {
          setTimeout(function () {
            this.hideForm();
          }, 3000);
        }
      }, 700);
    }
  }, {
    key: 'handleError',
    value: function handleError(e) {
      this.enableForm();
      window.alert('Our apologies! It looks like something went wrong. Please try again later.');
    }
  }, {
    key: 'disableForm',
    value: function disableForm() {
      this.subscribeBtn.addClass('disabled');
      this.nameField.attr('disabled', 'disabled');
      this.emailField.attr('disabled', 'disabled');
      this.newsCheck.attr('disabled', 'disabled');
      this.portCheck.attr('disabled', 'disabled');
    }
  }, {
    key: 'enableForm',
    value: function enableForm() {
      this.subscribeBtn.removeClass('disabled');
      this.nameField.attr('disabled', false);
      this.emailField.attr('disabled', false);
      this.newsCheck.attr('disabled', false);
      this.portCheck.attr('disabled', false);
    }
  }, {
    key: 'validation',
    value: function validation() {
      var Valid = true;
      var Errors = '';

      if (this.nameField.val() === '' || this.nameField.val().length < 2 || !/\s/g.test(this.nameField.val())) {
        Valid = false;
        this.invalidate(this.nameField);
        Errors = Errors + 'Please enter your name\n';
      }

      if (!this.validEmail(this.emailField.val())) {
        Valid = false;
        this.invalidate(this.emailField);
        Errors = Errors + 'Please enter your email';
      }

      if (Errors.length > 0 && this.isMobile) {
        window.alert(Errors);
      }

      return Valid;
    }
  }, {
    key: 'validEmail',
    value: function validEmail(email) {
      var emailRegex = /^([a-zA-Z0-9_.\-+])+\this.(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return emailRegex.test(email);
    }
  }, {
    key: 'invalidate',
    value: function invalidate(el) {
      el.val('');
      el.addClass('error');
    }
  }]);
  return Subscribe;
}();

/**
 * SSR Window 1.0.1
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2018, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: July 18, 2018
 */
var doc = typeof document === 'undefined' ? {
  body: {},
  addEventListener: function addEventListener() {},
  removeEventListener: function removeEventListener() {},
  activeElement: {
    blur: function blur() {},
    nodeName: ''
  },
  querySelector: function querySelector() {
    return null;
  },
  querySelectorAll: function querySelectorAll() {
    return [];
  },
  getElementById: function getElementById() {
    return null;
  },
  createEvent: function createEvent() {
    return {
      initEvent: function initEvent() {}
    };
  },
  createElement: function createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute: function setAttribute() {},
      getElementsByTagName: function getElementsByTagName() {
        return [];
      }
    };
  },
  location: { hash: '' }
} : document; // eslint-disable-line

var win = typeof window === 'undefined' ? {
  document: doc,
  navigator: {
    userAgent: ''
  },
  location: {},
  history: {},
  CustomEvent: function CustomEvent() {
    return this;
  },
  addEventListener: function addEventListener() {},
  removeEventListener: function removeEventListener() {},
  getComputedStyle: function getComputedStyle() {
    return {
      getPropertyValue: function getPropertyValue() {
        return '';
      }
    };
  },
  Image: function Image() {},
  Date: function Date() {},
  screen: {},
  setTimeout: function setTimeout() {},
  clearTimeout: function clearTimeout() {}
} : window; // eslint-disable-line

/**
 * Dom7 2.1.3
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * http://framework7.io/docs/dom.html
 *
 * Copyright 2019, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: February 11, 2019
 */
var Dom7 = function Dom7(arr) {
  classCallCheck(this, Dom7);

  var self = this;
  // Create array-like object
  for (var i = 0; i < arr.length; i += 1) {
    self[i] = arr[i];
  }
  self.length = arr.length;
  // Return collection with methods
  return this;
};

function $$1(selector, context) {
  var arr = [];
  var i = 0;
  if (selector && !context) {
    if (selector instanceof Dom7) {
      return selector;
    }
  }
  if (selector) {
    // String
    if (typeof selector === 'string') {
      var els = void 0;
      var tempParent = void 0;
      var _html = selector.trim();
      if (_html.indexOf('<') >= 0 && _html.indexOf('>') >= 0) {
        var toCreate = 'div';
        if (_html.indexOf('<li') === 0) toCreate = 'ul';
        if (_html.indexOf('<tr') === 0) toCreate = 'tbody';
        if (_html.indexOf('<td') === 0 || _html.indexOf('<th') === 0) toCreate = 'tr';
        if (_html.indexOf('<tbody') === 0) toCreate = 'table';
        if (_html.indexOf('<option') === 0) toCreate = 'select';
        tempParent = doc.createElement(toCreate);
        tempParent.innerHTML = _html;
        for (i = 0; i < tempParent.childNodes.length; i += 1) {
          arr.push(tempParent.childNodes[i]);
        }
      } else {
        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
          // Pure ID selector
          els = [doc.getElementById(selector.trim().split('#')[1])];
        } else {
          // Other selectors
          els = (context || doc).querySelectorAll(selector.trim());
        }
        for (i = 0; i < els.length; i += 1) {
          if (els[i]) arr.push(els[i]);
        }
      }
    } else if (selector.nodeType || selector === win || selector === doc) {
      // Node/element
      arr.push(selector);
    } else if (selector.length > 0 && selector[0].nodeType) {
      // Array of elements or instance of Dom
      for (i = 0; i < selector.length; i += 1) {
        arr.push(selector[i]);
      }
    }
  }
  return new Dom7(arr);
}

$$1.fn = Dom7.prototype;
$$1.Class = Dom7;
$$1.Dom7 = Dom7;

function unique(arr) {
  var uniqueArray = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }
  return uniqueArray;
}
// Classes and attributes
function addClass$1(className) {
  if (typeof className === 'undefined') {
    return this;
  }
  var classes = className.split(' ');
  for (var i = 0; i < classes.length; i += 1) {
    for (var j = 0; j < this.length; j += 1) {
      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
    }
  }
  return this;
}
function removeClass(className) {
  var classes = className.split(' ');
  for (var i = 0; i < classes.length; i += 1) {
    for (var j = 0; j < this.length; j += 1) {
      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
    }
  }
  return this;
}
function hasClass(className) {
  if (!this[0]) return false;
  return this[0].classList.contains(className);
}
function toggleClass(className) {
  var classes = className.split(' ');
  for (var i = 0; i < classes.length; i += 1) {
    for (var j = 0; j < this.length; j += 1) {
      if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
    }
  }
  return this;
}
function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  }

  // Set attrs
  for (var i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      // eslint-disable-next-line
      for (var attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }
  return this;
}
// eslint-disable-next-line
function removeAttr(attr) {
  for (var i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }
  return this;
}
function data(key, value) {
  var el = void 0;
  if (typeof value === 'undefined') {
    el = this[0];
    // Get value
    if (el) {
      if (el.dom7ElementDataStorage && key in el.dom7ElementDataStorage) {
        return el.dom7ElementDataStorage[key];
      }

      var dataKey = el.getAttribute('data-' + key);
      if (dataKey) {
        return dataKey;
      }
      return undefined;
    }
    return undefined;
  }

  // Set value
  for (var i = 0; i < this.length; i += 1) {
    el = this[i];
    if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
    el.dom7ElementDataStorage[key] = value;
  }
  return this;
}
// Transforms
// eslint-disable-next-line
function transform(transform) {
  for (var i = 0; i < this.length; i += 1) {
    var elStyle = this[i].style;
    elStyle.webkitTransform = transform;
    elStyle.transform = transform;
  }
  return this;
}
function transition$1(duration) {
  if (typeof duration !== 'string') {
    duration = duration + 'ms'; // eslint-disable-line
  }
  for (var i = 0; i < this.length; i += 1) {
    var elStyle = this[i].style;
    elStyle.webkitTransitionDuration = duration;
    elStyle.transitionDuration = duration;
  }
  return this;
}
// Events
function on() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var eventType = args[0],
      targetSelector = args[1],
      listener = args[2],
      capture = args[3];

  if (typeof args[1] === 'function') {
    eventType = args[0];
    listener = args[1];
    capture = args[2];

    targetSelector = undefined;
  }
  if (!capture) capture = false;

  function handleLiveEvent(e) {
    var target = e.target;
    if (!target) return;
    var eventData = e.target.dom7EventData || [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    if ($$1(target).is(targetSelector)) listener.apply(target, eventData);else {
      var _parents = $$1(target).parents(); // eslint-disable-line
      for (var k = 0; k < _parents.length; k += 1) {
        if ($$1(_parents[k]).is(targetSelector)) listener.apply(_parents[k], eventData);
      }
    }
  }
  function handleEvent(e) {
    var eventData = e && e.target ? e.target.dom7EventData || [] : [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    listener.apply(this, eventData);
  }
  var events = eventType.split(' ');
  var j = void 0;
  for (var i = 0; i < this.length; i += 1) {
    var el = this[i];
    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        var event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener: listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        var _event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[_event]) el.dom7LiveListeners[_event] = [];
        el.dom7LiveListeners[_event].push({
          listener: listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(_event, handleLiveEvent, capture);
      }
    }
  }
  return this;
}
function off() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var eventType = args[0],
      targetSelector = args[1],
      listener = args[2],
      capture = args[3];

  if (typeof args[1] === 'function') {
    eventType = args[0];
    listener = args[1];
    capture = args[2];

    targetSelector = undefined;
  }
  if (!capture) capture = false;

  var events = eventType.split(' ');
  for (var i = 0; i < events.length; i += 1) {
    var event = events[i];
    for (var j = 0; j < this.length; j += 1) {
      var el = this[j];
      var handlers = void 0;
      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }
      if (handlers && handlers.length) {
        for (var k = handlers.length - 1; k >= 0; k -= 1) {
          var handler = handlers[k];
          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }
  return this;
}
function trigger() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  var events = args[0].split(' ');
  var eventData = args[1];
  for (var i = 0; i < events.length; i += 1) {
    var event = events[i];
    for (var j = 0; j < this.length; j += 1) {
      var el = this[j];
      var evt = void 0;
      try {
        evt = new win.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
      } catch (e) {
        evt = doc.createEvent('Event');
        evt.initEvent(event, true, true);
        evt.detail = eventData;
      }
      // eslint-disable-next-line
      el.dom7EventData = args.filter(function (data, dataIndex) {
        return dataIndex > 0;
      });
      el.dispatchEvent(evt);
      el.dom7EventData = [];
      delete el.dom7EventData;
    }
  }
  return this;
}
function transitionEnd$1(callback) {
  var events = ['webkitTransitionEnd', 'transitionend'];
  var dom = this;
  var i = void 0;
  function fireCallBack(e) {
    /* jshint validthis:true */
    if (e.target !== this) return;
    callback.call(this, e);
    for (i = 0; i < events.length; i += 1) {
      dom.off(events[i], fireCallBack);
    }
  }
  if (callback) {
    for (i = 0; i < events.length; i += 1) {
      dom.on(events[i], fireCallBack);
    }
  }
  return this;
}
function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      // eslint-disable-next-line
      var _styles = this.styles();
      return this[0].offsetWidth + parseFloat(_styles.getPropertyValue('margin-right')) + parseFloat(_styles.getPropertyValue('margin-left'));
    }
    return this[0].offsetWidth;
  }
  return null;
}
function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      // eslint-disable-next-line
      var _styles2 = this.styles();
      return this[0].offsetHeight + parseFloat(_styles2.getPropertyValue('margin-top')) + parseFloat(_styles2.getPropertyValue('margin-bottom'));
    }
    return this[0].offsetHeight;
  }
  return null;
}
function offset() {
  if (this.length > 0) {
    var el = this[0];
    var box = el.getBoundingClientRect();
    var body = doc.body;
    var clientTop = el.clientTop || body.clientTop || 0;
    var clientLeft = el.clientLeft || body.clientLeft || 0;
    var _scrollTop = el === win ? win.scrollY : el.scrollTop;
    var _scrollLeft = el === win ? win.scrollX : el.scrollLeft;
    return {
      top: box.top + _scrollTop - clientTop,
      left: box.left + _scrollLeft - clientLeft
    };
  }

  return null;
}
function styles() {
  if (this[0]) return win.getComputedStyle(this[0], null);
  return {};
}
function css(props, value) {
  var i = void 0;
  if (arguments.length === 1) {
    if (typeof props === 'string') {
      if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      for (i = 0; i < this.length; i += 1) {
        // eslint-disable-next-line
        for (var _prop in props) {
          this[i].style[_prop] = props[_prop];
        }
      }
      return this;
    }
  }
  if (arguments.length === 2 && typeof props === 'string') {
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }
    return this;
  }
  return this;
}

// Iterate over the collection passing elements to `callback`
function each(callback) {
  // Don't bother continuing without a callback
  if (!callback) return this;
  // Iterate over the current collection
  for (var i = 0; i < this.length; i += 1) {
    // If the callback returns false
    if (callback.call(this[i], i, this[i]) === false) {
      // End the loop early
      return this;
    }
  }
  // Return `this` to allow chained DOM operations
  return this;
}
// eslint-disable-next-line
function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : undefined;
  }

  for (var i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }
  return this;
}
// eslint-disable-next-line
function text(text) {
  if (typeof text === 'undefined') {
    if (this[0]) {
      return this[0].textContent.trim();
    }
    return null;
  }

  for (var i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }
  return this;
}
function is(selector) {
  var el = this[0];
  var compareWith = void 0;
  var i = void 0;
  if (!el || typeof selector === 'undefined') return false;
  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);else if (el.msMatchesSelector) return el.msMatchesSelector(selector);

    compareWith = $$1(selector);
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }
    return false;
  } else if (selector === doc) return el === doc;else if (selector === win) return el === win;

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }
    return false;
  }
  return false;
}
function index() {
  var child = this[0];
  var i = void 0;
  if (child) {
    i = 0;
    // eslint-disable-next-line
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }
    return i;
  }
  return undefined;
}
// eslint-disable-next-line
function eq(index) {
  if (typeof index === 'undefined') return this;
  var length = this.length;
  var returnIndex = void 0;
  if (index > length - 1) {
    return new Dom7([]);
  }
  if (index < 0) {
    returnIndex = length + index;
    if (returnIndex < 0) return new Dom7([]);
    return new Dom7([this[returnIndex]]);
  }
  return new Dom7([this[index]]);
}
function append() {
  var newChild = void 0;

  for (var k = 0; k < arguments.length; k += 1) {
    newChild = arguments.length <= k ? undefined : arguments[k];
    for (var i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        var tempDiv = doc.createElement('div');
        tempDiv.innerHTML = newChild;
        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (var j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}
function prepend(newChild) {
  var i = void 0;
  var j = void 0;
  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      var tempDiv = doc.createElement('div');
      tempDiv.innerHTML = newChild;
      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }
  return this;
}
function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $$1(this[0].nextElementSibling).is(selector)) {
        return new Dom7([this[0].nextElementSibling]);
      }
      return new Dom7([]);
    }

    if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
    return new Dom7([]);
  }
  return new Dom7([]);
}
function nextAll(selector) {
  var nextEls = [];
  var el = this[0];
  if (!el) return new Dom7([]);
  while (el.nextElementSibling) {
    var _next = el.nextElementSibling; // eslint-disable-line
    if (selector) {
      if ($$1(_next).is(selector)) nextEls.push(_next);
    } else nextEls.push(_next);
    el = _next;
  }
  return new Dom7(nextEls);
}
function prev(selector) {
  if (this.length > 0) {
    var el = this[0];
    if (selector) {
      if (el.previousElementSibling && $$1(el.previousElementSibling).is(selector)) {
        return new Dom7([el.previousElementSibling]);
      }
      return new Dom7([]);
    }

    if (el.previousElementSibling) return new Dom7([el.previousElementSibling]);
    return new Dom7([]);
  }
  return new Dom7([]);
}
function prevAll(selector) {
  var prevEls = [];
  var el = this[0];
  if (!el) return new Dom7([]);
  while (el.previousElementSibling) {
    var _prev = el.previousElementSibling; // eslint-disable-line
    if (selector) {
      if ($$1(_prev).is(selector)) prevEls.push(_prev);
    } else prevEls.push(_prev);
    el = _prev;
  }
  return new Dom7(prevEls);
}
function parent(selector) {
  var parents = []; // eslint-disable-line
  for (var i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($$1(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }
  return $$1(unique(parents));
}
function parents(selector) {
  var parents = []; // eslint-disable-line
  for (var i = 0; i < this.length; i += 1) {
    var _parent = this[i].parentNode; // eslint-disable-line
    while (_parent) {
      if (selector) {
        if ($$1(_parent).is(selector)) parents.push(_parent);
      } else {
        parents.push(_parent);
      }
      _parent = _parent.parentNode;
    }
  }
  return $$1(unique(parents));
}
function closest(selector) {
  var closest = this; // eslint-disable-line
  if (typeof selector === 'undefined') {
    return new Dom7([]);
  }
  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }
  return closest;
}
function find(selector) {
  var foundElements = [];
  for (var i = 0; i < this.length; i += 1) {
    var found = this[i].querySelectorAll(selector);
    for (var j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }
  return new Dom7(foundElements);
}
function children(selector) {
  var children = []; // eslint-disable-line
  for (var i = 0; i < this.length; i += 1) {
    var childNodes = this[i].childNodes;

    for (var j = 0; j < childNodes.length; j += 1) {
      if (!selector) {
        if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
      } else if (childNodes[j].nodeType === 1 && $$1(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }
  return new Dom7(unique(children));
}
function remove() {
  for (var i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }
  return this;
}
function add() {
  var dom = this;
  var i = void 0;
  var j = void 0;

  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  for (i = 0; i < args.length; i += 1) {
    var toAdd = $$1(args[i]);
    for (j = 0; j < toAdd.length; j += 1) {
      dom[dom.length] = toAdd[j];
      dom.length += 1;
    }
  }
  return dom;
}
var noTrigger = 'resize scroll'.split(' ');

/**
 * Swiper 4.5.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://www.idangero.us/swiper/
 *
 * Copyright 2014-2019 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: February 22, 2019
 */

var Methods = {
  addClass: addClass$1,
  removeClass: removeClass,
  hasClass: hasClass,
  toggleClass: toggleClass,
  attr: attr,
  removeAttr: removeAttr,
  data: data,
  transform: transform,
  transition: transition$1,
  on: on,
  off: off,
  trigger: trigger,
  transitionEnd: transitionEnd$1,
  outerWidth: outerWidth,
  outerHeight: outerHeight,
  offset: offset,
  css: css,
  each: each,
  html: html,
  text: text,
  is: is,
  index: index,
  eq: eq,
  append: append,
  prepend: prepend,
  next: next,
  nextAll: nextAll,
  prev: prev,
  prevAll: prevAll,
  parent: parent,
  parents: parents,
  closest: closest,
  find: find,
  children: children,
  remove: remove,
  add: add,
  styles: styles
};

Object.keys(Methods).forEach(function (methodName) {
  $$1.fn[methodName] = Methods[methodName];
});

var Utils = {
  deleteProps: function deleteProps(obj) {
    var object = obj;
    Object.keys(object).forEach(function (key) {
      try {
        object[key] = null;
      } catch (e) {
        // no getter for object
      }
      try {
        delete object[key];
      } catch (e) {
        // something got wrong
      }
    });
  },
  nextTick: function nextTick(callback) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return setTimeout(callback, delay);
  },
  now: function now() {
    return Date.now();
  },
  getTranslate: function getTranslate(el) {
    var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';

    var matrix = void 0;
    var curTransform = void 0;
    var transformMatrix = void 0;

    var curStyle = win.getComputedStyle(el, null);

    if (win.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(function (a) {
          return a.replace(',', '.');
        }).join(', ');
      }
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
      transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (win.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (win.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  },
  parseUrlQuery: function parseUrlQuery(url) {
    var query = {};
    var urlToParse = url || win.location.href;
    var i = void 0;
    var params = void 0;
    var param = void 0;
    var length = void 0;
    if (typeof urlToParse === 'string' && urlToParse.length) {
      urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
      params = urlToParse.split('&').filter(function (paramsPart) {
        return paramsPart !== '';
      });
      length = params.length;

      for (i = 0; i < length; i += 1) {
        param = params[i].replace(/#\S+/g, '').split('=');
        query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
      }
    }
    return query;
  },
  isObject: function isObject(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && o.constructor && o.constructor === Object;
  },
  extend: function extend() {
    var to = Object(arguments.length <= 0 ? undefined : arguments[0]);
    for (var i = 1; i < arguments.length; i += 1) {
      var nextSource = arguments.length <= i ? undefined : arguments[i];
      if (nextSource !== undefined && nextSource !== null) {
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
              Utils.extend(to[nextKey], nextSource[nextKey]);
            } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
              to[nextKey] = {};
              Utils.extend(to[nextKey], nextSource[nextKey]);
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
};

var Support = function Support() {
  var testDiv = doc.createElement('div');
  return {
    touch: win.Modernizr && win.Modernizr.touch === true || function checkTouch() {
      return !!(win.navigator.maxTouchPoints > 0 || 'ontouchstart' in win || win.DocumentTouch && doc instanceof win.DocumentTouch);
    }(),

    pointerEvents: !!(win.navigator.pointerEnabled || win.PointerEvent || 'maxTouchPoints' in win.navigator && win.navigator.maxTouchPoints > 0),
    prefixedPointerEvents: !!win.navigator.msPointerEnabled,

    transition: function checkTransition() {
      var style = testDiv.style;
      return 'transition' in style || 'webkitTransition' in style || 'MozTransition' in style;
    }(),
    transforms3d: win.Modernizr && win.Modernizr.csstransforms3d === true || function checkTransforms3d() {
      var style = testDiv.style;
      return 'webkitPerspective' in style || 'MozPerspective' in style || 'OPerspective' in style || 'MsPerspective' in style || 'perspective' in style;
    }(),

    flexbox: function checkFlexbox() {
      var style = testDiv.style;
      var styles$$1 = 'alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient'.split(' ');
      for (var i = 0; i < styles$$1.length; i += 1) {
        if (styles$$1[i] in style) return true;
      }
      return false;
    }(),

    observer: function checkObserver() {
      return 'MutationObserver' in win || 'WebkitMutationObserver' in win;
    }(),

    passiveListener: function checkPassiveListener() {
      var supportsPassive = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get: function get$$1() {
            supportsPassive = true;
          }
        });
        win.addEventListener('testPassiveListener', null, opts);
      } catch (e) {
        // No support
      }
      return supportsPassive;
    }(),

    gestures: function checkGestures() {
      return 'ongesturestart' in win;
    }()
  };
}();

var Browser = function Browser() {
  function isSafari() {
    var ua = win.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }
  return {
    isIE: !!win.navigator.userAgent.match(/Trident/g) || !!win.navigator.userAgent.match(/MSIE/g),
    isEdge: !!win.navigator.userAgent.match(/Edge/g),
    isSafari: isSafari(),
    isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(win.navigator.userAgent)
  };
}();

var SwiperClass = function () {
  function SwiperClass() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, SwiperClass);

    var self = this;
    self.params = params;

    // Events
    self.eventsListeners = {};

    if (self.params && self.params.on) {
      Object.keys(self.params.on).forEach(function (eventName) {
        self.on(eventName, self.params.on[eventName]);
      });
    }
  }

  createClass(SwiperClass, [{
    key: 'on',
    value: function on$$1(events, handler, priority) {
      var self = this;
      if (typeof handler !== 'function') return self;
      var method = priority ? 'unshift' : 'push';
      events.split(' ').forEach(function (event) {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    }
  }, {
    key: 'once',
    value: function once$$1(events, handler, priority) {
      var self = this;
      if (typeof handler !== 'function') return self;
      function onceHandler() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(self, args);
        self.off(events, onceHandler);
        if (onceHandler.f7proxy) {
          delete onceHandler.f7proxy;
        }
      }
      onceHandler.f7proxy = handler;
      return self.on(events, onceHandler, priority);
    }
  }, {
    key: 'off',
    value: function off$$1(events, handler) {
      var self = this;
      if (!self.eventsListeners) return self;
      events.split(' ').forEach(function (event) {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event] && self.eventsListeners[event].length) {
          self.eventsListeners[event].forEach(function (eventHandler, index$$1) {
            if (eventHandler === handler || eventHandler.f7proxy && eventHandler.f7proxy === handler) {
              self.eventsListeners[event].splice(index$$1, 1);
            }
          });
        }
      });
      return self;
    }
  }, {
    key: 'emit',
    value: function emit() {
      var self = this;
      if (!self.eventsListeners) return self;
      var events = void 0;
      var data$$1 = void 0;
      var context = void 0;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data$$1 = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data$$1 = args[0].data;
        context = args[0].context || self;
      }
      var eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach(function (event) {
        if (self.eventsListeners && self.eventsListeners[event]) {
          var handlers = [];
          self.eventsListeners[event].forEach(function (eventHandler) {
            handlers.push(eventHandler);
          });
          handlers.forEach(function (eventHandler) {
            eventHandler.apply(context, data$$1);
          });
        }
      });
      return self;
    }
  }, {
    key: 'useModulesParams',
    value: function useModulesParams(instanceParams) {
      var instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach(function (moduleName) {
        var module = instance.modules[moduleName];
        // Extend params
        if (module.params) {
          Utils.extend(instanceParams, module.params);
        }
      });
    }
  }, {
    key: 'useModules',
    value: function useModules() {
      var modulesParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach(function (moduleName) {
        var module = instance.modules[moduleName];
        var moduleParams = modulesParams[moduleName] || {};
        // Extend instance methods and props
        if (module.instance) {
          Object.keys(module.instance).forEach(function (modulePropName) {
            var moduleProp = module.instance[modulePropName];
            if (typeof moduleProp === 'function') {
              instance[modulePropName] = moduleProp.bind(instance);
            } else {
              instance[modulePropName] = moduleProp;
            }
          });
        }
        // Add event listeners
        if (module.on && instance.on) {
          Object.keys(module.on).forEach(function (moduleEventName) {
            instance.on(moduleEventName, module.on[moduleEventName]);
          });
        }

        // Module create callback
        if (module.create) {
          module.create.bind(instance)(moduleParams);
        }
      });
    }
  }], [{
    key: 'installModule',
    value: function installModule(module) {
      var Class = this;
      if (!Class.prototype.modules) Class.prototype.modules = {};
      var name = module.name || Object.keys(Class.prototype.modules).length + '_' + Utils.now();
      Class.prototype.modules[name] = module;
      // Prototype
      if (module.proto) {
        Object.keys(module.proto).forEach(function (key) {
          Class.prototype[key] = module.proto[key];
        });
      }
      // Class
      if (module.static) {
        Object.keys(module.static).forEach(function (key) {
          Class[key] = module.static[key];
        });
      }
      // Callback
      if (module.install) {
        for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          params[_key3 - 1] = arguments[_key3];
        }

        module.install.apply(Class, params);
      }
      return Class;
    }
  }, {
    key: 'use',
    value: function use(module) {
      var Class = this;
      if (Array.isArray(module)) {
        module.forEach(function (m) {
          return Class.installModule(m);
        });
        return Class;
      }

      for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        params[_key4 - 1] = arguments[_key4];
      }

      return Class.installModule.apply(Class, [module].concat(params));
    }
  }, {
    key: 'components',
    set: function set$$1(components) {
      var Class = this;
      if (!Class.use) return;
      Class.use(components);
    }
  }]);
  return SwiperClass;
}();

function updateSize() {
  var swiper = this;
  var width$$1 = void 0;
  var height$$1 = void 0;
  var $el = swiper.$el;
  if (typeof swiper.params.width !== 'undefined') {
    width$$1 = swiper.params.width;
  } else {
    width$$1 = $el[0].clientWidth;
  }
  if (typeof swiper.params.height !== 'undefined') {
    height$$1 = swiper.params.height;
  } else {
    height$$1 = $el[0].clientHeight;
  }
  if (width$$1 === 0 && swiper.isHorizontal() || height$$1 === 0 && swiper.isVertical()) {
    return;
  }

  // Subtract paddings
  width$$1 = width$$1 - parseInt($el.css('padding-left'), 10) - parseInt($el.css('padding-right'), 10);
  height$$1 = height$$1 - parseInt($el.css('padding-top'), 10) - parseInt($el.css('padding-bottom'), 10);

  Utils.extend(swiper, {
    width: width$$1,
    height: height$$1,
    size: swiper.isHorizontal() ? width$$1 : height$$1
  });
}

function updateSlides() {
  var swiper = this;
  var params = swiper.params;

  var $wrapperEl = swiper.$wrapperEl,
      swiperSize = swiper.size,
      rtl = swiper.rtlTranslate,
      wrongRTL = swiper.wrongRTL;

  var isVirtual = swiper.virtual && params.virtual.enabled;
  var previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  var slides = $wrapperEl.children('.' + swiper.params.slideClass);
  var slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  var snapGrid = [];
  var slidesGrid = [];
  var slidesSizesGrid = [];

  var offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }

  var offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }

  var previousSnapGridLength = swiper.snapGrid.length;
  var previousSlidesGridLength = swiper.snapGrid.length;

  var spaceBetween = params.spaceBetween;
  var slidePosition = -offsetBefore;
  var prevSlideSize = 0;
  var index$$1 = 0;
  if (typeof swiperSize === 'undefined') {
    return;
  }
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  }

  swiper.virtualSize = -spaceBetween;

  // reset margins
  if (rtl) slides.css({ marginLeft: '', marginTop: '' });else slides.css({ marginRight: '', marginBottom: '' });

  var slidesNumberEvenToRows = void 0;
  if (params.slidesPerColumn > 1) {
    if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
    }
    if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
    }
  }

  // Calc slides
  var slideSize = void 0;
  var slidesPerColumn = params.slidesPerColumn;
  var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
  var numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);
  for (var i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    var _slide = slides.eq(i);
    if (params.slidesPerColumn > 1) {
      // Set slides order
      var newSlideOrderIndex = void 0;
      var column = void 0;
      var row = void 0;
      if (params.slidesPerColumnFill === 'column') {
        column = Math.floor(i / slidesPerColumn);
        row = i - column * slidesPerColumn;
        if (column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1) {
          row += 1;
          if (row >= slidesPerColumn) {
            row = 0;
            column += 1;
          }
        }
        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
        _slide.css({
          '-webkit-box-ordinal-group': newSlideOrderIndex,
          '-moz-box-ordinal-group': newSlideOrderIndex,
          '-ms-flex-order': newSlideOrderIndex,
          '-webkit-order': newSlideOrderIndex,
          order: newSlideOrderIndex
        });
      } else {
        row = Math.floor(i / slidesPerRow);
        column = i - row * slidesPerRow;
      }
      _slide.css('margin-' + (swiper.isHorizontal() ? 'top' : 'left'), row !== 0 && params.spaceBetween && params.spaceBetween + 'px').attr('data-swiper-column', column).attr('data-swiper-row', row);
    }
    if (_slide.css('display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      var slideStyles = win.getComputedStyle(_slide[0], null);
      var currentTransform = _slide[0].style.transform;
      var currentWebKitTransform = _slide[0].style.webkitTransform;
      if (currentTransform) {
        _slide[0].style.transform = 'none';
      }
      if (currentWebKitTransform) {
        _slide[0].style.webkitTransform = 'none';
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? _slide.outerWidth(true) : _slide.outerHeight(true);
      } else {
        // eslint-disable-next-line
        if (swiper.isHorizontal()) {
          var width$$1 = parseFloat(slideStyles.getPropertyValue('width'));
          var paddingLeft = parseFloat(slideStyles.getPropertyValue('padding-left'));
          var paddingRight = parseFloat(slideStyles.getPropertyValue('padding-right'));
          var marginLeft = parseFloat(slideStyles.getPropertyValue('margin-left'));
          var marginRight = parseFloat(slideStyles.getPropertyValue('margin-right'));
          var boxSizing = slideStyles.getPropertyValue('box-sizing');
          if (boxSizing && boxSizing === 'border-box') {
            slideSize = width$$1 + marginLeft + marginRight;
          } else {
            slideSize = width$$1 + paddingLeft + paddingRight + marginLeft + marginRight;
          }
        } else {
          var height$$1 = parseFloat(slideStyles.getPropertyValue('height'));
          var paddingTop = parseFloat(slideStyles.getPropertyValue('padding-top'));
          var paddingBottom = parseFloat(slideStyles.getPropertyValue('padding-bottom'));
          var marginTop = parseFloat(slideStyles.getPropertyValue('margin-top'));
          var marginBottom = parseFloat(slideStyles.getPropertyValue('margin-bottom'));
          var _boxSizing = slideStyles.getPropertyValue('box-sizing');
          if (_boxSizing && _boxSizing === 'border-box') {
            slideSize = height$$1 + marginTop + marginBottom;
          } else {
            slideSize = height$$1 + paddingTop + paddingBottom + marginTop + marginBottom;
          }
        }
      }
      if (currentTransform) {
        _slide[0].style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        _slide[0].style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);

      if (slides[i]) {
        if (swiper.isHorizontal()) {
          slides[i].style.width = slideSize + 'px';
        } else {
          slides[i].style.height = slideSize + 'px';
        }
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);

    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index$$1 % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index$$1 % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    swiper.virtualSize += slideSize + spaceBetween;

    prevSlideSize = slideSize;

    index$$1 += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  var newSlidesGrid = void 0;

  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    $wrapperEl.css({ width: swiper.virtualSize + params.spaceBetween + 'px' });
  }
  if (!Support.flexbox || params.setWrapperSize) {
    if (swiper.isHorizontal()) $wrapperEl.css({ width: swiper.virtualSize + params.spaceBetween + 'px' });else $wrapperEl.css({ height: swiper.virtualSize + params.spaceBetween + 'px' });
  }

  if (params.slidesPerColumn > 1) {
    swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
    if (swiper.isHorizontal()) $wrapperEl.css({ width: swiper.virtualSize + params.spaceBetween + 'px' });else $wrapperEl.css({ height: swiper.virtualSize + params.spaceBetween + 'px' });
    if (params.centeredSlides) {
      newSlidesGrid = [];
      for (var _i = 0; _i < snapGrid.length; _i += 1) {
        var slidesGridItem = snapGrid[_i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[_i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }
      snapGrid = newSlidesGrid;
    }
  }

  // Remove last grid elements depending on width
  if (!params.centeredSlides) {
    newSlidesGrid = [];
    for (var _i2 = 0; _i2 < snapGrid.length; _i2 += 1) {
      var _slidesGridItem = snapGrid[_i2];
      if (params.roundLengths) _slidesGridItem = Math.floor(_slidesGridItem);
      if (snapGrid[_i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(_slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];

  if (params.spaceBetween !== 0) {
    if (swiper.isHorizontal()) {
      if (rtl) slides.css({ marginLeft: spaceBetween + 'px' });else slides.css({ marginRight: spaceBetween + 'px' });
    } else slides.css({ marginBottom: spaceBetween + 'px' });
  }

  if (params.centerInsufficientSlides) {
    var allSlidesSize = 0;
    slidesSizesGrid.forEach(function (slideSizeValue) {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    if (allSlidesSize < swiperSize) {
      var allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach(function (snap, snapIndex) {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach(function (snap, snapIndex) {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }

  Utils.extend(swiper, {
    slides: slides,
    snapGrid: snapGrid,
    slidesGrid: slidesGrid,
    slidesSizesGrid: slidesSizesGrid
  });

  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }

  if (params.watchSlidesProgress || params.watchSlidesVisibility) {
    swiper.updateSlidesOffset();
  }
}

function updateAutoHeight(speed) {
  var swiper = this;
  var activeSlides = [];
  var newHeight = 0;
  var i = void 0;
  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  // Find slides currently in view
  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
      var _index = swiper.activeIndex + i;
      if (_index > swiper.slides.length) break;
      activeSlides.push(swiper.slides.eq(_index)[0]);
    }
  } else {
    activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
  }

  // Find new height from highest slide in view
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      var height$$1 = activeSlides[i].offsetHeight;
      newHeight = height$$1 > newHeight ? height$$1 : newHeight;
    }
  }

  // Update Height
  if (newHeight) swiper.$wrapperEl.css('height', newHeight + 'px');
}

function updateSlidesOffset() {
  var swiper = this;
  var slides = swiper.slides;
  for (var i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}

function updateSlidesProgress() {
  var translate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this && this.translate || 0;

  var swiper = this;
  var params = swiper.params;

  var slides = swiper.slides,
      rtl = swiper.rtlTranslate;


  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();

  var offsetCenter = -translate;
  if (rtl) offsetCenter = translate;

  // Visible Slides
  slides.removeClass(params.slideVisibleClass);

  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];

  for (var i = 0; i < slides.length; i += 1) {
    var _slide2 = slides[i];
    var slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - _slide2.swiperSlideOffset) / (_slide2.swiperSlideSize + params.spaceBetween);
    if (params.watchSlidesVisibility) {
      var slideBefore = -(offsetCenter - _slide2.swiperSlideOffset);
      var slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      var isVisible = slideBefore >= 0 && slideBefore < swiper.size || slideAfter > 0 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(_slide2);
        swiper.visibleSlidesIndexes.push(i);
        slides.eq(i).addClass(params.slideVisibleClass);
      }
    }
    _slide2.progress = rtl ? -slideProgress : slideProgress;
  }
  swiper.visibleSlides = $$1(swiper.visibleSlides);
}

function updateProgress() {
  var translate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this && this.translate || 0;

  var swiper = this;
  var params = swiper.params;

  var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  var progress = swiper.progress,
      isBeginning = swiper.isBeginning,
      isEnd = swiper.isEnd;

  var wasBeginning = isBeginning;
  var wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }
  Utils.extend(swiper, {
    progress: progress,
    isBeginning: isBeginning,
    isEnd: isEnd
  });

  if (params.watchSlidesProgress || params.watchSlidesVisibility) swiper.updateSlidesProgress(translate);

  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }
  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }

  swiper.emit('progress', progress);
}

function updateSlidesClasses() {
  var swiper = this;

  var slides = swiper.slides,
      params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex,
      realIndex = swiper.realIndex;

  var isVirtual = swiper.virtual && params.virtual.enabled;

  slides.removeClass(params.slideActiveClass + ' ' + params.slideNextClass + ' ' + params.slidePrevClass + ' ' + params.slideDuplicateActiveClass + ' ' + params.slideDuplicateNextClass + ' ' + params.slideDuplicatePrevClass);

  var activeSlide = void 0;
  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find('.' + params.slideClass + '[data-swiper-slide-index="' + activeIndex + '"]');
  } else {
    activeSlide = slides.eq(activeIndex);
  }

  // Active classes
  activeSlide.addClass(params.slideActiveClass);

  if (params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children('.' + params.slideClass + ':not(.' + params.slideDuplicateClass + ')[data-swiper-slide-index="' + realIndex + '"]').addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children('.' + params.slideClass + '.' + params.slideDuplicateClass + '[data-swiper-slide-index="' + realIndex + '"]').addClass(params.slideDuplicateActiveClass);
    }
  }
  // Next Slide
  var nextSlide = activeSlide.nextAll('.' + params.slideClass).eq(0).addClass(params.slideNextClass);
  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  }
  // Prev Slide
  var prevSlide = activeSlide.prevAll('.' + params.slideClass).eq(0).addClass(params.slidePrevClass);
  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }
  if (params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children('.' + params.slideClass + ':not(.' + params.slideDuplicateClass + ')[data-swiper-slide-index="' + nextSlide.attr('data-swiper-slide-index') + '"]').addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children('.' + params.slideClass + '.' + params.slideDuplicateClass + '[data-swiper-slide-index="' + nextSlide.attr('data-swiper-slide-index') + '"]').addClass(params.slideDuplicateNextClass);
    }
    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children('.' + params.slideClass + ':not(.' + params.slideDuplicateClass + ')[data-swiper-slide-index="' + prevSlide.attr('data-swiper-slide-index') + '"]').addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children('.' + params.slideClass + '.' + params.slideDuplicateClass + '[data-swiper-slide-index="' + prevSlide.attr('data-swiper-slide-index') + '"]').addClass(params.slideDuplicatePrevClass);
    }
  }
}

function updateActiveIndex(newActiveIndex) {
  var swiper = this;
  var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  var slidesGrid = swiper.slidesGrid,
      snapGrid = swiper.snapGrid,
      params = swiper.params,
      previousIndex = swiper.activeIndex,
      previousRealIndex = swiper.realIndex,
      previousSnapIndex = swiper.snapIndex;

  var activeIndex = newActiveIndex;
  var snapIndex = void 0;
  if (typeof activeIndex === 'undefined') {
    for (var i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    // Normalize slideIndex
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
  }
  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    snapIndex = Math.floor(activeIndex / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }
    return;
  }

  // Get real index
  var realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);

  Utils.extend(swiper, {
    snapIndex: snapIndex,
    realIndex: realIndex,
    previousIndex: previousIndex,
    activeIndex: activeIndex
  });
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');
  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }
  swiper.emit('slideChange');
}

function updateClickedSlide(e) {
  var swiper = this;
  var params = swiper.params;
  var slide = $$1(e.target).closest('.' + params.slideClass)[0];
  var slideFound = false;
  if (slide) {
    for (var i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) slideFound = true;
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($$1(slide).attr('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = $$1(slide).index();
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}

var update = {
  updateSize: updateSize,
  updateSlides: updateSlides,
  updateAutoHeight: updateAutoHeight,
  updateSlidesOffset: updateSlidesOffset,
  updateSlidesProgress: updateSlidesProgress,
  updateProgress: updateProgress,
  updateSlidesClasses: updateSlidesClasses,
  updateActiveIndex: updateActiveIndex,
  updateClickedSlide: updateClickedSlide
};

function getTranslate() {
  var axis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isHorizontal() ? 'x' : 'y';

  var swiper = this;

  var params = swiper.params,
      rtl = swiper.rtlTranslate,
      translate = swiper.translate,
      $wrapperEl = swiper.$wrapperEl;


  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }

  var currentTranslate = Utils.getTranslate($wrapperEl[0], axis);
  if (rtl) currentTranslate = -currentTranslate;

  return currentTranslate || 0;
}

function setTranslate(translate, byController) {
  var swiper = this;
  var rtl = swiper.rtlTranslate,
      params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      progress = swiper.progress;

  var x = 0;
  var y = 0;
  var z = 0;

  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }

  if (!params.virtualTranslate) {
    if (Support.transforms3d) $wrapperEl.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');else $wrapperEl.transform('translate(' + x + 'px, ' + y + 'px)');
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;

  // Check if we need to update progress
  var newProgress = void 0;
  var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }

  swiper.emit('setTranslate', swiper.translate, byController);
}

function minTranslate() {
  return -this.snapGrid[0];
}

function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}

var translate = {
  getTranslate: getTranslate,
  setTranslate: setTranslate,
  minTranslate: minTranslate,
  maxTranslate: maxTranslate
};

function setTransition(duration, byController) {
  var swiper = this;

  swiper.$wrapperEl.transition(duration);

  swiper.emit('setTransition', duration, byController);
}

function transitionStart() {
  var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var direction = arguments[1];

  var swiper = this;
  var activeIndex = swiper.activeIndex,
      params = swiper.params,
      previousIndex = swiper.previousIndex;

  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }

  var dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit('transitionStart');

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit('slideResetTransitionStart');
      return;
    }
    swiper.emit('slideChangeTransitionStart');
    if (dir === 'next') {
      swiper.emit('slideNextTransitionStart');
    } else {
      swiper.emit('slidePrevTransitionStart');
    }
  }
}

function transitionEnd$$1() {
  var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var direction = arguments[1];

  var swiper = this;
  var activeIndex = swiper.activeIndex,
      previousIndex = swiper.previousIndex;

  swiper.animating = false;
  swiper.setTransition(0);

  var dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit('transitionEnd');

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit('slideResetTransitionEnd');
      return;
    }
    swiper.emit('slideChangeTransitionEnd');
    if (dir === 'next') {
      swiper.emit('slideNextTransitionEnd');
    } else {
      swiper.emit('slidePrevTransitionEnd');
    }
  }
}

var transition$$1 = {
  setTransition: setTransition,
  transitionStart: transitionStart,
  transitionEnd: transitionEnd$$1
};

function slideTo() {
  var index$$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.params.speed;
  var runCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var internal = arguments[3];

  var swiper = this;
  var slideIndex = index$$1;
  if (slideIndex < 0) slideIndex = 0;

  var params = swiper.params,
      snapGrid = swiper.snapGrid,
      slidesGrid = swiper.slidesGrid,
      previousIndex = swiper.previousIndex,
      activeIndex = swiper.activeIndex,
      rtl = swiper.rtlTranslate;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  var snapIndex = Math.floor(slideIndex / params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  var translate = -snapGrid[snapIndex];

  // Update progress
  swiper.updateProgress(translate);

  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    for (var i = 0; i < slidesGrid.length; i += 1) {
      if (-Math.floor(translate * 100) >= Math.floor(slidesGrid[i] * 100)) {
        slideIndex = i;
      }
    }
  }
  // Directions locks
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) return false;
    }
  }

  var direction = void 0;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset';

  // Update Index
  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    // Update Height
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }
    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }

  if (speed === 0 || !Support.transition) {
    swiper.setTransition(0);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    swiper.transitionEnd(runCallbacks, direction);
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd$$1(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
    }
  }

  return true;
}

function slideToLoop() {
  var index$$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.params.speed;
  var runCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var internal = arguments[3];

  var swiper = this;
  var newIndex = index$$1;
  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }

  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideNext() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.speed;
  var runCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var internal = arguments[2];

  var swiper = this;
  var params = swiper.params,
      animating = swiper.animating;

  if (params.loop) {
    if (animating) return false;
    swiper.loopFix();
    // eslint-disable-next-line
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slidePrev() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.speed;
  var runCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var internal = arguments[2];

  var swiper = this;
  var params = swiper.params,
      animating = swiper.animating,
      snapGrid = swiper.snapGrid,
      slidesGrid = swiper.slidesGrid,
      rtlTranslate = swiper.rtlTranslate;


  if (params.loop) {
    if (animating) return false;
    swiper.loopFix();
    // eslint-disable-next-line
    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }
  var translate = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val$$1) {
    if (val$$1 < 0) return -Math.floor(Math.abs(val$$1));
    return Math.floor(val$$1);
  }
  var normalizedTranslate = normalize(translate);
  var normalizedSnapGrid = snapGrid.map(function (val$$1) {
    return normalize(val$$1);
  });
  var normalizedSlidesGrid = slidesGrid.map(function (val$$1) {
    return normalize(val$$1);
  });

  var currentSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
  var prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  var prevIndex = void 0;
  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideReset() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.speed;
  var runCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var internal = arguments[2];

  var swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideToClosest() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.speed;
  var runCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var internal = arguments[2];

  var swiper = this;
  var index$$1 = swiper.activeIndex;
  var snapIndex = Math.floor(index$$1 / swiper.params.slidesPerGroup);

  if (snapIndex < swiper.snapGrid.length - 1) {
    var _translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

    var currentSnap = swiper.snapGrid[snapIndex];
    var nextSnap = swiper.snapGrid[snapIndex + 1];

    if (_translate - currentSnap > (nextSnap - currentSnap) / 2) {
      index$$1 = swiper.params.slidesPerGroup;
    }
  }

  return swiper.slideTo(index$$1, speed, runCallbacks, internal);
}

function slideToClickedSlide() {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl;


  var slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  var slideToIndex = swiper.clickedIndex;
  var realIndex = void 0;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt($$1(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children('.' + params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + params.slideDuplicateClass + ')').eq(0).index();

        Utils.nextTick(function () {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children('.' + params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + params.slideDuplicateClass + ')').eq(0).index();

      Utils.nextTick(function () {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}

var slide = {
  slideTo: slideTo,
  slideToLoop: slideToLoop,
  slideNext: slideNext,
  slidePrev: slidePrev,
  slideReset: slideReset,
  slideToClosest: slideToClosest,
  slideToClickedSlide: slideToClickedSlide
};

function loopCreate() {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl;
  // Remove duplicated slides

  $wrapperEl.children('.' + params.slideClass + '.' + params.slideDuplicateClass).remove();

  var slides = $wrapperEl.children('.' + params.slideClass);

  if (params.loopFillGroupWithBlank) {
    var blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
    if (blankSlidesNum !== params.slidesPerGroup) {
      for (var i = 0; i < blankSlidesNum; i += 1) {
        var blankNode = $$1(doc.createElement('div')).addClass(params.slideClass + ' ' + params.slideBlankClass);
        $wrapperEl.append(blankNode);
      }
      slides = $wrapperEl.children('.' + params.slideClass);
    }
  }

  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;

  swiper.loopedSlides = parseInt(params.loopedSlides || params.slidesPerView, 10);
  swiper.loopedSlides += params.loopAdditionalSlides;
  if (swiper.loopedSlides > slides.length) {
    swiper.loopedSlides = slides.length;
  }

  var prependSlides = [];
  var appendSlides = [];
  slides.each(function (index$$1, el) {
    var slide = $$1(el);
    if (index$$1 < swiper.loopedSlides) appendSlides.push(el);
    if (index$$1 < slides.length && index$$1 >= slides.length - swiper.loopedSlides) prependSlides.push(el);
    slide.attr('data-swiper-slide-index', index$$1);
  });
  for (var _i3 = 0; _i3 < appendSlides.length; _i3 += 1) {
    $wrapperEl.append($$1(appendSlides[_i3].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
  for (var _i4 = prependSlides.length - 1; _i4 >= 0; _i4 -= 1) {
    $wrapperEl.prepend($$1(prependSlides[_i4].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}

function loopFix() {
  var swiper = this;
  var params = swiper.params,
      activeIndex = swiper.activeIndex,
      slides = swiper.slides,
      loopedSlides = swiper.loopedSlides,
      allowSlidePrev = swiper.allowSlidePrev,
      allowSlideNext = swiper.allowSlideNext,
      snapGrid = swiper.snapGrid,
      rtl = swiper.rtlTranslate;

  var newIndex = void 0;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;

  var snapTranslate = -snapGrid[activeIndex];
  var diff = snapTranslate - swiper.getTranslate();

  // Fix For Negative Oversliding
  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    var slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (params.slidesPerView === 'auto' && activeIndex >= loopedSlides * 2 || activeIndex >= slides.length - loopedSlides) {
    // Fix For Positive Oversliding
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    var _slideChanged = swiper.slideTo(newIndex, 0, false, true);
    if (_slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
}

function loopDestroy() {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params,
      slides = swiper.slides;

  $wrapperEl.children('.' + params.slideClass + '.' + params.slideDuplicateClass + ',.' + params.slideClass + '.' + params.slideBlankClass).remove();
  slides.removeAttr('data-swiper-slide-index');
}

var loop = {
  loopCreate: loopCreate,
  loopFix: loopFix,
  loopDestroy: loopDestroy
};

function setGrabCursor(moving) {
  var swiper = this;
  if (Support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked) return;
  var el = swiper.el;
  el.style.cursor = 'move';
  el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
  el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
  el.style.cursor = moving ? 'grabbing' : 'grab';
}

function unsetGrabCursor() {
  var swiper = this;
  if (Support.touch || swiper.params.watchOverflow && swiper.isLocked) return;
  swiper.el.style.cursor = '';
}

var grabCursor = {
  setGrabCursor: setGrabCursor,
  unsetGrabCursor: unsetGrabCursor
};

function appendSlide(slides) {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params;

  if (params.loop) {
    swiper.loopDestroy();
  }
  if ((typeof slides === 'undefined' ? 'undefined' : _typeof(slides)) === 'object' && 'length' in slides) {
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }
  } else {
    $wrapperEl.append(slides);
  }
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!(params.observer && Support.observer)) {
    swiper.update();
  }
}

function prependSlide(slides) {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex;


  if (params.loop) {
    swiper.loopDestroy();
  }
  var newActiveIndex = activeIndex + 1;
  if ((typeof slides === 'undefined' ? 'undefined' : _typeof(slides)) === 'object' && 'length' in slides) {
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.prepend(slides[i]);
    }
    newActiveIndex = activeIndex + slides.length;
  } else {
    $wrapperEl.prepend(slides);
  }
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!(params.observer && Support.observer)) {
    swiper.update();
  }
  swiper.slideTo(newActiveIndex, 0, false);
}

function addSlide(index$$1, slides) {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params,
      activeIndex = swiper.activeIndex;

  var activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children('.' + params.slideClass);
  }
  var baseLength = swiper.slides.length;
  if (index$$1 <= 0) {
    swiper.prependSlide(slides);
    return;
  }
  if (index$$1 >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }
  var newActiveIndex = activeIndexBuffer > index$$1 ? activeIndexBuffer + 1 : activeIndexBuffer;

  var slidesBuffer = [];
  for (var i = baseLength - 1; i >= index$$1; i -= 1) {
    var currentSlide = swiper.slides.eq(i);
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }

  if ((typeof slides === 'undefined' ? 'undefined' : _typeof(slides)) === 'object' && 'length' in slides) {
    for (var _i5 = 0; _i5 < slides.length; _i5 += 1) {
      if (slides[_i5]) $wrapperEl.append(slides[_i5]);
    }
    newActiveIndex = activeIndexBuffer > index$$1 ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    $wrapperEl.append(slides);
  }

  for (var _i6 = 0; _i6 < slidesBuffer.length; _i6 += 1) {
    $wrapperEl.append(slidesBuffer[_i6]);
  }

  if (params.loop) {
    swiper.loopCreate();
  }
  if (!(params.observer && Support.observer)) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

function removeSlide(slidesIndexes) {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex;


  var activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children('.' + params.slideClass);
  }
  var newActiveIndex = activeIndexBuffer;
  var indexToRemove = void 0;

  if ((typeof slidesIndexes === 'undefined' ? 'undefined' : _typeof(slidesIndexes)) === 'object' && 'length' in slidesIndexes) {
    for (var i = 0; i < slidesIndexes.length; i += 1) {
      indexToRemove = slidesIndexes[i];
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }
    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!(params.observer && Support.observer)) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

function removeAllSlides() {
  var swiper = this;

  var slidesIndexes = [];
  for (var i = 0; i < swiper.slides.length; i += 1) {
    slidesIndexes.push(i);
  }
  swiper.removeSlide(slidesIndexes);
}

var manipulation = {
  appendSlide: appendSlide,
  prependSlide: prependSlide,
  addSlide: addSlide,
  removeSlide: removeSlide,
  removeAllSlides: removeAllSlides
};

var Device = function Device() {
  var ua = win.navigator.userAgent;

  var device = {
    ios: false,
    android: false,
    androidChrome: false,
    desktop: false,
    windows: false,
    iphone: false,
    ipod: false,
    ipad: false,
    cordova: win.cordova || win.phonegap,
    phonegap: win.cordova || win.phonegap
  };

  var windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);

  // Windows
  if (windows) {
    device.os = 'windows';
    device.osVersion = windows[2];
    device.windows = true;
  }
  // Android
  if (android && !windows) {
    device.os = 'android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
  }
  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  }
  // iOS
  if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
  }
  if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
  }
  if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.iphone = true;
  }
  // iOS 8+ changed UA
  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
      device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
  }

  // Desktop
  device.desktop = !(device.os || device.android || device.webView);

  // Webview
  device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

  // Minimal UI
  if (device.os && device.os === 'ios') {
    var osVersionArr = device.osVersion.split('.');
    var metaViewport = doc.querySelector('meta[name="viewport"]');
    device.minimalUi = !device.webView && (ipod || iphone) && (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) && metaViewport && metaViewport.getAttribute('content').indexOf('minimal-ui') >= 0;
  }

  // Pixel Ratio
  device.pixelRatio = win.devicePixelRatio || 1;

  // Export object
  return device;
}();

function onTouchStart(event) {
  var swiper = this;
  var data$$1 = swiper.touchEventsData;
  var params = swiper.params,
      touches = swiper.touches;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  var e = event;
  if (e.originalEvent) e = e.originalEvent;
  data$$1.isTouchEvent = e.type === 'touchstart';
  if (!data$$1.isTouchEvent && 'which' in e && e.which === 3) return;
  if (!data$$1.isTouchEvent && 'button' in e && e.button > 0) return;
  if (data$$1.isTouched && data$$1.isMoved) return;
  if (params.noSwiping && $$1(e.target).closest(params.noSwipingSelector ? params.noSwipingSelector : '.' + params.noSwipingClass)[0]) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!$$1(e).closest(params.swipeHandler)[0]) return;
  }

  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  var startX = touches.currentX;
  var startY = touches.currentY;

  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore

  var edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  var edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= win.screen.width - edgeSwipeThreshold)) {
    return;
  }

  Utils.extend(data$$1, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });

  touches.startX = startX;
  touches.startY = startY;
  data$$1.touchStartTime = Utils.now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data$$1.allowThresholdMove = false;
  if (e.type !== 'touchstart') {
    var preventDefault = true;
    if ($$1(e.target).is(data$$1.formElements)) preventDefault = false;
    if (doc.activeElement && $$1(doc.activeElement).is(data$$1.formElements) && doc.activeElement !== e.target) {
      doc.activeElement.blur();
    }

    var shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if (params.touchStartForcePreventDefault || shouldPreventDefault) {
      e.preventDefault();
    }
  }
  swiper.emit('touchStart', e);
}

function onTouchMove(event) {
  var swiper = this;
  var data$$1 = swiper.touchEventsData;
  var params = swiper.params,
      touches = swiper.touches,
      rtl = swiper.rtlTranslate;

  var e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (!data$$1.isTouched) {
    if (data$$1.startMoving && data$$1.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    return;
  }
  if (data$$1.isTouchEvent && e.type === 'mousemove') return;
  var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
  var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    // isMoved = true;
    swiper.allowClick = false;
    if (data$$1.isTouched) {
      Utils.extend(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data$$1.touchStartTime = Utils.now();
    }
    return;
  }
  if (data$$1.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data$$1.isTouched = false;
        data$$1.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (data$$1.isTouchEvent && doc.activeElement) {
    if (e.target === doc.activeElement && $$1(e.target).is(data$$1.formElements)) {
      data$$1.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data$$1.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }
  if (e.targetTouches && e.targetTouches.length > 1) return;

  touches.currentX = pageX;
  touches.currentY = pageY;

  var diffX = touches.currentX - touches.startX;
  var diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) < swiper.params.threshold) return;

  if (typeof data$$1.isScrolling === 'undefined') {
    var touchAngle = void 0;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data$$1.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data$$1.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data$$1.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }
  if (typeof data$$1.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data$$1.startMoving = true;
    }
  }
  if (data$$1.isScrolling) {
    data$$1.isTouched = false;
    return;
  }
  if (!data$$1.startMoving) {
    return;
  }
  swiper.allowClick = false;
  e.preventDefault();
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }

  if (!data$$1.isMoved) {
    if (params.loop) {
      swiper.loopFix();
    }
    data$$1.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
    }
    data$$1.allowMomentumBounce = false;
    // Grab Cursor
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit('sliderFirstMove', e);
  }
  swiper.emit('sliderMove', e);
  data$$1.isMoved = true;

  var diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;

  diff *= params.touchRatio;
  if (rtl) diff = -diff;

  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  data$$1.currentTranslate = diff + data$$1.startTranslate;

  var disableParentSwiper = true;
  var resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0 && data$$1.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data$$1.currentTranslate = swiper.minTranslate() - 1 + Math.pow(-swiper.minTranslate() + data$$1.startTranslate + diff, resistanceRatio);
  } else if (diff < 0 && data$$1.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data$$1.currentTranslate = swiper.maxTranslate() + 1 - Math.pow(swiper.maxTranslate() - data$$1.startTranslate - diff, resistanceRatio);
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }

  // Directions locks
  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data$$1.currentTranslate < data$$1.startTranslate) {
    data$$1.currentTranslate = data$$1.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data$$1.currentTranslate > data$$1.startTranslate) {
    data$$1.currentTranslate = data$$1.startTranslate;
  }

  // Threshold
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data$$1.allowThresholdMove) {
      if (!data$$1.allowThresholdMove) {
        data$$1.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data$$1.currentTranslate = data$$1.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data$$1.currentTranslate = data$$1.startTranslate;
      return;
    }
  }

  if (!params.followFinger) return;

  // Update active index in free mode
  if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode) {
    // Velocity
    if (data$$1.velocities.length === 0) {
      data$$1.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data$$1.touchStartTime
      });
    }
    data$$1.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: Utils.now()
    });
  }
  // Update progress
  swiper.updateProgress(data$$1.currentTranslate);
  // Update translate
  swiper.setTranslate(data$$1.currentTranslate);
}

function onTouchEnd(event) {
  var swiper = this;
  var data$$1 = swiper.touchEventsData;

  var params = swiper.params,
      touches = swiper.touches,
      rtl = swiper.rtlTranslate,
      $wrapperEl = swiper.$wrapperEl,
      slidesGrid = swiper.slidesGrid,
      snapGrid = swiper.snapGrid;

  var e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (data$$1.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }
  data$$1.allowTouchCallbacks = false;
  if (!data$$1.isTouched) {
    if (data$$1.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data$$1.isMoved = false;
    data$$1.startMoving = false;
    return;
  }
  // Return Grab Cursor
  if (params.grabCursor && data$$1.isMoved && data$$1.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }

  // Time diff
  var touchEndTime = Utils.now();
  var timeDiff = touchEndTime - data$$1.touchStartTime;

  // Tap, doubleTap, Click
  if (swiper.allowClick) {
    swiper.updateClickedSlide(e);
    swiper.emit('tap', e);
    if (timeDiff < 300 && touchEndTime - data$$1.lastClickTime > 300) {
      if (data$$1.clickTimeout) clearTimeout(data$$1.clickTimeout);
      data$$1.clickTimeout = Utils.nextTick(function () {
        if (!swiper || swiper.destroyed) return;
        swiper.emit('click', e);
      }, 300);
    }
    if (timeDiff < 300 && touchEndTime - data$$1.lastClickTime < 300) {
      if (data$$1.clickTimeout) clearTimeout(data$$1.clickTimeout);
      swiper.emit('doubleTap', e);
    }
  }

  data$$1.lastClickTime = Utils.now();
  Utils.nextTick(function () {
    if (!swiper.destroyed) swiper.allowClick = true;
  });

  if (!data$$1.isTouched || !data$$1.isMoved || !swiper.swipeDirection || touches.diff === 0 || data$$1.currentTranslate === data$$1.startTranslate) {
    data$$1.isTouched = false;
    data$$1.isMoved = false;
    data$$1.startMoving = false;
    return;
  }
  data$$1.isTouched = false;
  data$$1.isMoved = false;
  data$$1.startMoving = false;

  var currentPos = void 0;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data$$1.currentTranslate;
  }

  if (params.freeMode) {
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }

    if (params.freeModeMomentum) {
      if (data$$1.velocities.length > 1) {
        var lastMoveEvent = data$$1.velocities.pop();
        var velocityEvent = data$$1.velocities.pop();

        var distance = lastMoveEvent.position - velocityEvent.position;
        var time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
          swiper.velocity = 0;
        }
        // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.
        if (time > 150 || Utils.now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeModeMomentumVelocityRatio;

      data$$1.velocities.length = 0;
      var momentumDuration = 1000 * params.freeModeMomentumRatio;
      var momentumDistance = swiper.velocity * momentumDuration;

      var newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;

      var doBounce = false;
      var afterBouncePosition = void 0;
      var bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
      var needsLoopFix = void 0;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeModeMomentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data$$1.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeModeMomentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data$$1.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeModeSticky) {
        var nextSlide = void 0;
        for (var j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }

        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        swiper.once('transitionEnd', function () {
          swiper.loopFix();
        });
      }
      // Fix duration
      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
      } else if (params.freeModeSticky) {
        swiper.slideToClosest();
        return;
      }

      if (params.freeModeMomentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        $wrapperEl.transitionEnd(function () {
          if (!swiper || swiper.destroyed || !data$$1.allowMomentumBounce) return;
          swiper.emit('momentumBounce');

          swiper.setTransition(params.speed);
          swiper.setTranslate(afterBouncePosition);
          $wrapperEl.transitionEnd(function () {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        });
      } else if (swiper.velocity) {
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          $wrapperEl.transitionEnd(function () {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }

      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeModeSticky) {
      swiper.slideToClosest();
      return;
    }

    if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    return;
  }

  // Find current slide
  var stopIndex = 0;
  var groupSize = swiper.slidesSizesGrid[0];
  for (var i = 0; i < slidesGrid.length; i += params.slidesPerGroup) {
    if (typeof slidesGrid[i + params.slidesPerGroup] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + params.slidesPerGroup]) {
        stopIndex = i;
        groupSize = slidesGrid[i + params.slidesPerGroup] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }

  // Find current slide size
  var ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;

  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + params.slidesPerGroup);else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + params.slidesPerGroup);else swiper.slideTo(stopIndex);
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === 'next') {
      swiper.slideTo(stopIndex + params.slidesPerGroup);
    }
    if (swiper.swipeDirection === 'prev') {
      swiper.slideTo(stopIndex);
    }
  }
}

function onResize() {
  var swiper = this;

  var params = swiper.params,
      el = swiper.el;


  if (el && el.offsetWidth === 0) return;

  // Breakpoints
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }

  // Save locks
  var allowSlideNext = swiper.allowSlideNext,
      allowSlidePrev = swiper.allowSlidePrev,
      snapGrid = swiper.snapGrid;

  // Disable locks on resize

  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;

  swiper.updateSize();
  swiper.updateSlides();

  if (params.freeMode) {
    var newTranslate = Math.min(Math.max(swiper.translate, swiper.maxTranslate()), swiper.minTranslate());
    swiper.setTranslate(newTranslate);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
  } else {
    swiper.updateSlidesClasses();
    if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  // Return locks after resize
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;

  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}

function onClick(e) {
  var swiper = this;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}

function attachEvents() {
  var swiper = this;
  var params = swiper.params,
      touchEvents = swiper.touchEvents,
      el = swiper.el,
      wrapperEl = swiper.wrapperEl;


  {
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
  }

  swiper.onClick = onClick.bind(swiper);

  var target = params.touchEventsTarget === 'container' ? el : wrapperEl;
  var capture = !!params.nested;

  // Touch Events
  {
    if (!Support.touch && (Support.pointerEvents || Support.prefixedPointerEvents)) {
      target.addEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        var passiveListener = touchEvents.start === 'touchstart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        target.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        target.addEventListener(touchEvents.move, swiper.onTouchMove, Support.passiveListener ? { passive: false, capture: capture } : capture);
        target.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
      }
      if (params.simulateTouch && !Device.ios && !Device.android || params.simulateTouch && !Support.touch && Device.ios) {
        target.addEventListener('mousedown', swiper.onTouchStart, false);
        doc.addEventListener('mousemove', swiper.onTouchMove, capture);
        doc.addEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      target.addEventListener('click', swiper.onClick, true);
    }
  }

  // Resize handler
  swiper.on(Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
}

function detachEvents() {
  var swiper = this;

  var params = swiper.params,
      touchEvents = swiper.touchEvents,
      el = swiper.el,
      wrapperEl = swiper.wrapperEl;


  var target = params.touchEventsTarget === 'container' ? el : wrapperEl;
  var capture = !!params.nested;

  // Touch Events
  {
    if (!Support.touch && (Support.pointerEvents || Support.prefixedPointerEvents)) {
      target.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        var passiveListener = touchEvents.start === 'onTouchStart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        target.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        target.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
        target.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
      }
      if (params.simulateTouch && !Device.ios && !Device.android || params.simulateTouch && !Support.touch && Device.ios) {
        target.removeEventListener('mousedown', swiper.onTouchStart, false);
        doc.removeEventListener('mousemove', swiper.onTouchMove, capture);
        doc.removeEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      target.removeEventListener('click', swiper.onClick, true);
    }
  }

  // Resize handler
  swiper.off(Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize);
}

var events = {
  attachEvents: attachEvents,
  detachEvents: detachEvents
};

function setBreakpoint() {
  var swiper = this;
  var activeIndex = swiper.activeIndex,
      initialized = swiper.initialized,
      _swiper$loopedSlides = swiper.loopedSlides,
      loopedSlides = _swiper$loopedSlides === undefined ? 0 : _swiper$loopedSlides,
      params = swiper.params;

  var breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;

  // Set breakpoint for window width and update parameters
  var breakpoint = swiper.getBreakpoint(breakpoints);

  if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
    var breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
    if (breakpointOnlyParams) {
      ['slidesPerView', 'spaceBetween', 'slidesPerGroup'].forEach(function (param) {
        var paramValue = breakpointOnlyParams[param];
        if (typeof paramValue === 'undefined') return;
        if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
          breakpointOnlyParams[param] = 'auto';
        } else if (param === 'slidesPerView') {
          breakpointOnlyParams[param] = parseFloat(paramValue);
        } else {
          breakpointOnlyParams[param] = parseInt(paramValue, 10);
        }
      });
    }

    var breakpointParams = breakpointOnlyParams || swiper.originalParams;
    var directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    var needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

    if (directionChanged && initialized) {
      swiper.changeDirection();
    }

    Utils.extend(swiper.params, breakpointParams);

    Utils.extend(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });

    swiper.currentBreakpoint = breakpoint;

    if (needsReLoop && initialized) {
      swiper.loopDestroy();
      swiper.loopCreate();
      swiper.updateSlides();
      swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
    }

    swiper.emit('breakpoint', breakpointParams);
  }
}

function getBreakpoint(breakpoints) {
  var swiper = this;
  // Get breakpoint for window width
  if (!breakpoints) return undefined;
  var breakpoint = false;
  var points = [];
  Object.keys(breakpoints).forEach(function (point) {
    points.push(point);
  });
  points.sort(function (a, b) {
    return parseInt(a, 10) - parseInt(b, 10);
  });
  for (var i = 0; i < points.length; i += 1) {
    var point = points[i];
    if (swiper.params.breakpointsInverse) {
      if (point <= win.innerWidth) {
        breakpoint = point;
      }
    } else if (point >= win.innerWidth && !breakpoint) {
      breakpoint = point;
    }
  }
  return breakpoint || 'max';
}

var breakpoints = { setBreakpoint: setBreakpoint, getBreakpoint: getBreakpoint };

function addClasses() {
  var swiper = this;
  var classNames = swiper.classNames,
      params = swiper.params,
      rtl = swiper.rtl,
      $el = swiper.$el;

  var suffixes = [];

  suffixes.push('initialized');
  suffixes.push(params.direction);

  if (params.freeMode) {
    suffixes.push('free-mode');
  }
  if (!Support.flexbox) {
    suffixes.push('no-flexbox');
  }
  if (params.autoHeight) {
    suffixes.push('autoheight');
  }
  if (rtl) {
    suffixes.push('rtl');
  }
  if (params.slidesPerColumn > 1) {
    suffixes.push('multirow');
  }
  if (Device.android) {
    suffixes.push('android');
  }
  if (Device.ios) {
    suffixes.push('ios');
  }
  // WP8 Touch Events Fix
  if ((Browser.isIE || Browser.isEdge) && (Support.pointerEvents || Support.prefixedPointerEvents)) {
    suffixes.push('wp8-' + params.direction);
  }

  suffixes.forEach(function (suffix) {
    classNames.push(params.containerModifierClass + suffix);
  });

  $el.addClass(classNames.join(' '));
}

function removeClasses() {
  var swiper = this;
  var $el = swiper.$el,
      classNames = swiper.classNames;


  $el.removeClass(classNames.join(' '));
}

var classes = { addClasses: addClasses, removeClasses: removeClasses };

function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  var image = void 0;
  function onReady() {
    if (callback) callback();
  }
  if (!imageEl.complete || !checkForComplete) {
    if (src) {
      image = new win.Image();
      image.onload = onReady;
      image.onerror = onReady;
      if (sizes) {
        image.sizes = sizes;
      }
      if (srcset) {
        image.srcset = srcset;
      }
      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    // image already loaded...
    onReady();
  }
}

function preloadImages() {
  var swiper = this;
  swiper.imagesToLoad = swiper.$el.find('img');
  function onReady() {
    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;
    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady) swiper.update();
      swiper.emit('imagesReady');
    }
  }
  for (var i = 0; i < swiper.imagesToLoad.length; i += 1) {
    var imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
  }
}

var images = {
  loadImage: loadImage,
  preloadImages: preloadImages
};

function checkOverflow() {
  var swiper = this;
  var wasLocked = swiper.isLocked;

  swiper.isLocked = swiper.snapGrid.length === 1;
  swiper.allowSlideNext = !swiper.isLocked;
  swiper.allowSlidePrev = !swiper.isLocked;

  // events
  if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
    swiper.navigation.update();
  }
}

var checkOverflow$1 = { checkOverflow: checkOverflow };

var defaults$1 = {
  init: true,
  direction: 'horizontal',
  touchEventsTarget: 'container',
  initialSlide: 0,
  speed: 300,
  //
  preventInteractionOnTransition: false,

  // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,

  // Free mode
  freeMode: false,
  freeModeMomentum: true,
  freeModeMomentumRatio: 1,
  freeModeMomentumBounce: true,
  freeModeMomentumBounceRatio: 1,
  freeModeMomentumVelocityRatio: 1,
  freeModeSticky: false,
  freeModeMinimumVelocity: 0.02,

  // Autoheight
  autoHeight: false,

  // Set wrapper width
  setWrapperSize: false,

  // Virtual Translate
  virtualTranslate: false,

  // Effects
  effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

  // Breakpoints
  breakpoints: undefined,
  breakpointsInverse: false,

  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: 'column',
  slidesPerGroup: 1,
  centeredSlides: false,
  slidesOffsetBefore: 0, // in px
  slidesOffsetAfter: 0, // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,

  // Disable swiper and hide navigation when container not overflow
  watchOverflow: false,

  // Round length
  roundLengths: false,

  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: true,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,

  // Unique Navigation Elements
  uniqueNavElements: true,

  // Resistance
  resistance: true,
  resistanceRatio: 0.85,

  // Progress
  watchSlidesProgress: false,
  watchSlidesVisibility: false,

  // Cursor
  grabCursor: false,

  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,

  // Images
  preloadImages: true,
  updateOnImagesReady: true,

  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: false,

  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null, // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,

  // Passive Listeners
  passiveListeners: true,

  // NS
  containerModifierClass: 'swiper-container-', // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',

  // Callbacks
  runCallbacksOnInit: true
};

/* eslint no-param-reassign: "off" */

var prototypes = {
  update: update,
  translate: translate,
  transition: transition$$1,
  slide: slide,
  loop: loop,
  grabCursor: grabCursor,
  manipulation: manipulation,
  events: events,
  breakpoints: breakpoints,
  checkOverflow: checkOverflow$1,
  classes: classes,
  images: images
};

var extendedDefaults = {};

var Swiper = function (_SwiperClass) {
  inherits(Swiper, _SwiperClass);

  function Swiper() {
    var _ret3;

    classCallCheck(this, Swiper);

    var el = void 0;
    var params = void 0;

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
      params = args[0];
    } else {
      el = args[0];
      params = args[1];
    }
    if (!params) params = {};

    params = Utils.extend({}, params);
    if (el && !params.el) params.el = el;

    var _this = possibleConstructorReturn(this, (Swiper.__proto__ || Object.getPrototypeOf(Swiper)).call(this, params));

    Object.keys(prototypes).forEach(function (prototypeGroup) {
      Object.keys(prototypes[prototypeGroup]).forEach(function (protoMethod) {
        if (!Swiper.prototype[protoMethod]) {
          Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }
      });
    });

    // Swiper Instance
    var swiper = _this;
    if (typeof swiper.modules === 'undefined') {
      swiper.modules = {};
    }
    Object.keys(swiper.modules).forEach(function (moduleName) {
      var module = swiper.modules[moduleName];
      if (module.params) {
        var moduleParamName = Object.keys(module.params)[0];
        var moduleParams = module.params[moduleParamName];
        if ((typeof moduleParams === 'undefined' ? 'undefined' : _typeof(moduleParams)) !== 'object' || moduleParams === null) return;
        if (!(moduleParamName in params && 'enabled' in moduleParams)) return;
        if (params[moduleParamName] === true) {
          params[moduleParamName] = { enabled: true };
        }
        if (_typeof(params[moduleParamName]) === 'object' && !('enabled' in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }
        if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
      }
    });

    // Extend defaults with modules params
    var swiperParams = Utils.extend({}, defaults$1);
    swiper.useModulesParams(swiperParams);

    // Extend defaults with passed params
    swiper.params = Utils.extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = Utils.extend({}, swiper.params);
    swiper.passedParams = Utils.extend({}, params);

    // Save Dom lib
    swiper.$ = $$1;

    // Find el
    var $el = $$1(swiper.params.el);
    el = $el[0];

    if (!el) {
      var _ret;

      return _ret = undefined, possibleConstructorReturn(_this, _ret);
    }

    if ($el.length > 1) {
      var _ret2;

      var swipers = [];
      $el.each(function (index$$1, containerEl) {
        var newParams = Utils.extend({}, params, { el: containerEl });
        swipers.push(new Swiper(newParams));
      });
      return _ret2 = swipers, possibleConstructorReturn(_this, _ret2);
    }

    el.swiper = swiper;
    $el.data('swiper', swiper);

    // Find Wrapper
    var $wrapperEl = $el.children('.' + swiper.params.wrapperClass);

    // Extend Swiper
    Utils.extend(swiper, {
      $el: $el,
      el: el,
      $wrapperEl: $wrapperEl,
      wrapperEl: $wrapperEl[0],

      // Classes
      classNames: [],

      // Slides
      slides: $$1(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],

      // isDirection
      isHorizontal: function isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },
      isVertical: function isVertical() {
        return swiper.params.direction === 'vertical';
      },

      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box',

      // Indexes
      activeIndex: 0,
      realIndex: 0,

      //
      isBeginning: true,
      isEnd: false,

      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,

      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,

      // Touch Events
      touchEvents: function touchEvents() {
        var touch = ['touchstart', 'touchmove', 'touchend'];
        var desktop = ['mousedown', 'mousemove', 'mouseup'];
        if (Support.pointerEvents) {
          desktop = ['pointerdown', 'pointermove', 'pointerup'];
        } else if (Support.prefixedPointerEvents) {
          desktop = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        }
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return Support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        formElements: 'input, select, option, textarea, button, video',
        // Last click time
        lastClickTime: Utils.now(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined
      },

      // Clicks
      allowClick: true,

      // Touches
      allowTouchMove: swiper.params.allowTouchMove,

      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },

      // Images
      imagesToLoad: [],
      imagesLoaded: 0

    });

    // Install Modules
    swiper.useModules();

    // Init
    if (swiper.params.init) {
      swiper.init();
    }

    // Return app instance
    return _ret3 = swiper, possibleConstructorReturn(_this, _ret3);
  }

  createClass(Swiper, [{
    key: 'slidesPerViewDynamic',
    value: function slidesPerViewDynamic() {
      var swiper = this;
      var params = swiper.params,
          slides = swiper.slides,
          slidesGrid = swiper.slidesGrid,
          swiperSize = swiper.size,
          activeIndex = swiper.activeIndex;

      var spv = 1;
      if (params.centeredSlides) {
        var slideSize = slides[activeIndex].swiperSlideSize;
        var breakLoop = void 0;
        for (var i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (var _i7 = activeIndex - 1; _i7 >= 0; _i7 -= 1) {
          if (slides[_i7] && !breakLoop) {
            slideSize += slides[_i7].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        for (var _i8 = activeIndex + 1; _i8 < slides.length; _i8 += 1) {
          if (slidesGrid[_i8] - slidesGrid[activeIndex] < swiperSize) {
            spv += 1;
          }
        }
      }
      return spv;
    }
  }, {
    key: 'update',
    value: function update() {
      var swiper = this;
      if (!swiper || swiper.destroyed) return;
      var snapGrid = swiper.snapGrid,
          params = swiper.params;
      // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      function setTranslate() {
        var translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        var newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      var translated = void 0;
      if (swiper.params.freeMode) {
        setTranslate();
        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit('update');
    }
  }, {
    key: 'changeDirection',
    value: function changeDirection(newDirection) {
      var needUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var swiper = this;
      var currentDirection = swiper.params.direction;
      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }
      if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
        return swiper;
      }

      if (currentDirection === 'vertical') {
        swiper.$el.removeClass(swiper.params.containerModifierClass + 'vertical wp8-vertical').addClass('' + swiper.params.containerModifierClass + newDirection);

        if ((Browser.isIE || Browser.isEdge) && (Support.pointerEvents || Support.prefixedPointerEvents)) {
          swiper.$el.addClass(swiper.params.containerModifierClass + 'wp8-' + newDirection);
        }
      }
      if (currentDirection === 'horizontal') {
        swiper.$el.removeClass(swiper.params.containerModifierClass + 'horizontal wp8-horizontal').addClass('' + swiper.params.containerModifierClass + newDirection);

        if ((Browser.isIE || Browser.isEdge) && (Support.pointerEvents || Support.prefixedPointerEvents)) {
          swiper.$el.addClass(swiper.params.containerModifierClass + 'wp8-' + newDirection);
        }
      }

      swiper.params.direction = newDirection;

      swiper.slides.each(function (slideIndex, slideEl) {
        if (newDirection === 'vertical') {
          slideEl.style.width = '';
        } else {
          slideEl.style.height = '';
        }
      });

      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();

      return swiper;
    }
  }, {
    key: 'init',
    value: function init() {
      var swiper = this;
      if (swiper.initialized) return;

      swiper.emit('beforeInit');

      // Set breakpoint
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }

      // Add Classes
      swiper.addClasses();

      // Create loop
      if (swiper.params.loop) {
        swiper.loopCreate();
      }

      // Update size
      swiper.updateSize();

      // Update slides
      swiper.updateSlides();

      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }

      // Set Grab Cursor
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }

      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      }

      // Slide To Initial Slide
      if (swiper.params.loop) {
        swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
      }

      // Attach events
      swiper.attachEvents();

      // Init Flag
      swiper.initialized = true;

      // Emit
      swiper.emit('init');
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var deleteInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var cleanStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var swiper = this;
      var params = swiper.params,
          $el = swiper.$el,
          $wrapperEl = swiper.$wrapperEl,
          slides = swiper.slides;


      if (typeof swiper.params === 'undefined' || swiper.destroyed) {
        return null;
      }

      swiper.emit('beforeDestroy');

      // Init Flag
      swiper.initialized = false;

      // Detach events
      swiper.detachEvents();

      // Destroy loop
      if (params.loop) {
        swiper.loopDestroy();
      }

      // Cleanup styles
      if (cleanStyles) {
        swiper.removeClasses();
        $el.removeAttr('style');
        $wrapperEl.removeAttr('style');
        if (slides && slides.length) {
          slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index').removeAttr('data-swiper-column').removeAttr('data-swiper-row');
        }
      }

      swiper.emit('destroy');

      // Detach emitter events
      Object.keys(swiper.eventsListeners).forEach(function (eventName) {
        swiper.off(eventName);
      });

      if (deleteInstance !== false) {
        swiper.$el[0].swiper = null;
        swiper.$el.data('swiper', null);
        Utils.deleteProps(swiper);
      }
      swiper.destroyed = true;

      return null;
    }
  }], [{
    key: 'extendDefaults',
    value: function extendDefaults(newDefaults) {
      Utils.extend(extendedDefaults, newDefaults);
    }
  }, {
    key: 'extendedDefaults',
    get: function get$$1() {
      return extendedDefaults;
    }
  }, {
    key: 'defaults',
    get: function get$$1() {
      return defaults$1;
    }
  }, {
    key: 'Class',
    get: function get$$1() {
      return SwiperClass;
    }
  }, {
    key: '$',
    get: function get$$1() {
      return $$1;
    }
  }]);
  return Swiper;
}(SwiperClass);

var Device$1 = {
  name: 'device',
  proto: {
    device: Device
  },
  static: {
    device: Device
  }
};

var Support$1 = {
  name: 'support',
  proto: {
    support: Support
  },
  static: {
    support: Support
  }
};

var Browser$1 = {
  name: 'browser',
  proto: {
    browser: Browser
  },
  static: {
    browser: Browser
  }
};

var Resize = {
  name: 'resize',
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      resize: {
        resizeHandler: function resizeHandler() {
          if (!swiper || swiper.destroyed || !swiper.initialized) return;
          swiper.emit('beforeResize');
          swiper.emit('resize');
        },
        orientationChangeHandler: function orientationChangeHandler() {
          if (!swiper || swiper.destroyed || !swiper.initialized) return;
          swiper.emit('orientationchange');
        }
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      // Emit resize
      win.addEventListener('resize', swiper.resize.resizeHandler);

      // Emit orientationchange
      win.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
    },
    destroy: function destroy() {
      var swiper = this;
      win.removeEventListener('resize', swiper.resize.resizeHandler);
      win.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
    }
  }
};

var Observer = {
  func: win.MutationObserver || win.WebkitMutationObserver,
  attach: function attach(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var swiper = this;

    var ObserverFunc = Observer.func;
    var observer = new ObserverFunc(function (mutations) {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (mutations.length === 1) {
        swiper.emit('observerUpdate', mutations[0]);
        return;
      }
      var observerUpdate = function observerUpdate() {
        swiper.emit('observerUpdate', mutations[0]);
      };

      if (win.requestAnimationFrame) {
        win.requestAnimationFrame(observerUpdate);
      } else {
        win.setTimeout(observerUpdate, 0);
      }
    });

    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });

    swiper.observer.observers.push(observer);
  },
  init: function init() {
    var swiper = this;
    if (!Support.observer || !swiper.params.observer) return;
    if (swiper.params.observeParents) {
      var containerParents = swiper.$el.parents();
      for (var i = 0; i < containerParents.length; i += 1) {
        swiper.observer.attach(containerParents[i]);
      }
    }
    // Observe container
    swiper.observer.attach(swiper.$el[0], { childList: swiper.params.observeSlideChildren });

    // Observe wrapper
    swiper.observer.attach(swiper.$wrapperEl[0], { attributes: false });
  },
  destroy: function destroy() {
    var swiper = this;
    swiper.observer.observers.forEach(function (observer) {
      observer.disconnect();
    });
    swiper.observer.observers = [];
  }
};

var Observer$1 = {
  name: 'observer',
  params: {
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      observer: {
        init: Observer.init.bind(swiper),
        attach: Observer.attach.bind(swiper),
        destroy: Observer.destroy.bind(swiper),
        observers: []
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      swiper.observer.init();
    },
    destroy: function destroy() {
      var swiper = this;
      swiper.observer.destroy();
    }
  }
};

var Virtual = {
  update: function update(force) {
    var swiper = this;
    var _swiper$params = swiper.params,
        slidesPerView = _swiper$params.slidesPerView,
        slidesPerGroup = _swiper$params.slidesPerGroup,
        centeredSlides = _swiper$params.centeredSlides;
    var _swiper$params$virtua = swiper.params.virtual,
        addSlidesBefore = _swiper$params$virtua.addSlidesBefore,
        addSlidesAfter = _swiper$params$virtua.addSlidesAfter;
    var _swiper$virtual = swiper.virtual,
        previousFrom = _swiper$virtual.from,
        previousTo = _swiper$virtual.to,
        slides = _swiper$virtual.slides,
        previousSlidesGrid = _swiper$virtual.slidesGrid,
        renderSlide = _swiper$virtual.renderSlide,
        previousOffset = _swiper$virtual.offset;

    swiper.updateActiveIndex();
    var activeIndex = swiper.activeIndex || 0;

    var offsetProp = void 0;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';

    var slidesAfter = void 0;
    var slidesBefore = void 0;
    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesBefore;
      slidesBefore = slidesPerGroup + addSlidesAfter;
    }
    var from = Math.max((activeIndex || 0) - slidesBefore, 0);
    var to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
    var offset$$1 = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);

    Utils.extend(swiper.virtual, {
      from: from,
      to: to,
      offset: offset$$1,
      slidesGrid: swiper.slidesGrid
    });

    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      if (swiper.lazy && swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }
    }

    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset$$1 !== previousOffset) {
        swiper.slides.css(offsetProp, offset$$1 + 'px');
      }
      swiper.updateProgress();
      return;
    }
    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset: offset$$1,
        from: from,
        to: to,
        slides: function getSlides() {
          var slidesToRender = [];
          for (var i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }
          return slidesToRender;
        }()
      });
      onRendered();
      return;
    }
    var prependIndexes = [];
    var appendIndexes = [];
    if (force) {
      swiper.$wrapperEl.find('.' + swiper.params.slideClass).remove();
    } else {
      for (var i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          swiper.$wrapperEl.find('.' + swiper.params.slideClass + '[data-swiper-slide-index="' + i + '"]').remove();
        }
      }
    }
    for (var _i9 = 0; _i9 < slides.length; _i9 += 1) {
      if (_i9 >= from && _i9 <= to) {
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(_i9);
        } else {
          if (_i9 > previousTo) appendIndexes.push(_i9);
          if (_i9 < previousFrom) prependIndexes.push(_i9);
        }
      }
    }
    appendIndexes.forEach(function (index$$1) {
      swiper.$wrapperEl.append(renderSlide(slides[index$$1], index$$1));
    });
    prependIndexes.sort(function (a, b) {
      return b - a;
    }).forEach(function (index$$1) {
      swiper.$wrapperEl.prepend(renderSlide(slides[index$$1], index$$1));
    });
    swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, offset$$1 + 'px');
    onRendered();
  },
  renderSlide: function renderSlide(slide, index$$1) {
    var swiper = this;
    var params = swiper.params.virtual;
    if (params.cache && swiper.virtual.cache[index$$1]) {
      return swiper.virtual.cache[index$$1];
    }
    var $slideEl = params.renderSlide ? $$1(params.renderSlide.call(swiper, slide, index$$1)) : $$1('<div class="' + swiper.params.slideClass + '" data-swiper-slide-index="' + index$$1 + '">' + slide + '</div>');
    if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index$$1);
    if (params.cache) swiper.virtual.cache[index$$1] = $slideEl;
    return $slideEl;
  },
  appendSlide: function appendSlide(slides) {
    var swiper = this;
    if ((typeof slides === 'undefined' ? 'undefined' : _typeof(slides)) === 'object' && 'length' in slides) {
      for (var i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }
    swiper.virtual.update(true);
  },
  prependSlide: function prependSlide(slides) {
    var swiper = this;
    var activeIndex = swiper.activeIndex;
    var newActiveIndex = activeIndex + 1;
    var numberOfNewSlides = 1;

    if (Array.isArray(slides)) {
      for (var i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }
    if (swiper.params.virtual.cache) {
      var cache = swiper.virtual.cache;
      var newCache = {};
      Object.keys(cache).forEach(function (cachedIndex) {
        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cache[cachedIndex];
      });
      swiper.virtual.cache = newCache;
    }
    swiper.virtual.update(true);
    swiper.slideTo(newActiveIndex, 0);
  },
  removeSlide: function removeSlide(slidesIndexes) {
    var swiper = this;
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    var activeIndex = swiper.activeIndex;
    if (Array.isArray(slidesIndexes)) {
      for (var i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        swiper.virtual.slides.splice(slidesIndexes[i], 1);
        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
        }
        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      swiper.virtual.slides.splice(slidesIndexes, 1);
      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
      }
      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }
    swiper.virtual.update(true);
    swiper.slideTo(activeIndex, 0);
  },
  removeAllSlides: function removeAllSlides() {
    var swiper = this;
    swiper.virtual.slides = [];
    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }
    swiper.virtual.update(true);
    swiper.slideTo(0, 0);
  }
};

var Virtual$1 = {
  name: 'virtual',
  params: {
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      virtual: {
        update: Virtual.update.bind(swiper),
        appendSlide: Virtual.appendSlide.bind(swiper),
        prependSlide: Virtual.prependSlide.bind(swiper),
        removeSlide: Virtual.removeSlide.bind(swiper),
        removeAllSlides: Virtual.removeAllSlides.bind(swiper),
        renderSlide: Virtual.renderSlide.bind(swiper),
        slides: swiper.params.virtual.slides,
        cache: {}
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (!swiper.params.virtual.enabled) return;
      swiper.classNames.push(swiper.params.containerModifierClass + 'virtual');
      var overwriteParams = {
        watchSlidesProgress: true
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);

      if (!swiper.params.initialSlide) {
        swiper.virtual.update();
      }
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (!swiper.params.virtual.enabled) return;
      swiper.virtual.update();
    }
  }
};

var Keyboard = {
  handle: function handle(event) {
    var swiper = this;
    var rtl = swiper.rtlTranslate;

    var e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    var kc = e.keyCode || e.charCode;
    // Directions locks
    if (!swiper.allowSlideNext && (swiper.isHorizontal() && kc === 39 || swiper.isVertical() && kc === 40)) {
      return false;
    }
    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && kc === 37 || swiper.isVertical() && kc === 38)) {
      return false;
    }
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }
    if (doc.activeElement && doc.activeElement.nodeName && (doc.activeElement.nodeName.toLowerCase() === 'input' || doc.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }
    if (swiper.params.keyboard.onlyInViewport && (kc === 37 || kc === 39 || kc === 38 || kc === 40)) {
      var inView = false;
      // Check that swiper should be inside of visible area of window
      if (swiper.$el.parents('.' + swiper.params.slideClass).length > 0 && swiper.$el.parents('.' + swiper.params.slideActiveClass).length === 0) {
        return undefined;
      }
      var windowWidth = win.innerWidth;
      var windowHeight = win.innerHeight;
      var swiperOffset = swiper.$el.offset();
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      var swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];
      for (var i = 0; i < swiperCoord.length; i += 1) {
        var point = swiperCoord[i];
        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          inView = true;
        }
      }
      if (!inView) return undefined;
    }
    if (swiper.isHorizontal()) {
      if (kc === 37 || kc === 39) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if (kc === 39 && !rtl || kc === 37 && rtl) swiper.slideNext();
      if (kc === 37 && !rtl || kc === 39 && rtl) swiper.slidePrev();
    } else {
      if (kc === 38 || kc === 40) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }
      if (kc === 40) swiper.slideNext();
      if (kc === 38) swiper.slidePrev();
    }
    swiper.emit('keyPress', kc);
    return undefined;
  },
  enable: function enable() {
    var swiper = this;
    if (swiper.keyboard.enabled) return;
    $$1(doc).on('keydown', swiper.keyboard.handle);
    swiper.keyboard.enabled = true;
  },
  disable: function disable() {
    var swiper = this;
    if (!swiper.keyboard.enabled) return;
    $$1(doc).off('keydown', swiper.keyboard.handle);
    swiper.keyboard.enabled = false;
  }
};

var Keyboard$1 = {
  name: 'keyboard',
  params: {
    keyboard: {
      enabled: false,
      onlyInViewport: true
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      keyboard: {
        enabled: false,
        enable: Keyboard.enable.bind(swiper),
        disable: Keyboard.disable.bind(swiper),
        handle: Keyboard.handle.bind(swiper)
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.keyboard.enabled) {
        swiper.keyboard.enable();
      }
    },
    destroy: function destroy() {
      var swiper = this;
      if (swiper.keyboard.enabled) {
        swiper.keyboard.disable();
      }
    }
  }
};

function isEventSupported() {
  var eventName = 'onwheel';
  var isSupported = eventName in doc;

  if (!isSupported) {
    var element = doc.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && doc.implementation && doc.implementation.hasFeature
  // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  && doc.implementation.hasFeature('', '') !== true) {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = doc.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}
var Mousewheel = {
  lastScrollTime: Utils.now(),
  event: function getEvent() {
    if (win.navigator.userAgent.indexOf('firefox') > -1) return 'DOMMouseScroll';
    return isEventSupported() ? 'wheel' : 'mousewheel';
  }(),
  normalize: function normalize(e) {
    // Reasonable defaults
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;

    var sX = 0;
    var sY = 0; // spinX, spinY
    var pX = 0;
    var pY = 0; // pixelX, pixelY

    // Legacy
    if ('detail' in e) {
      sY = e.detail;
    }
    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in e) {
      pY = e.deltaY;
    }
    if ('deltaX' in e) {
      pX = e.deltaX;
    }

    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  },
  handleMouseEnter: function handleMouseEnter() {
    var swiper = this;
    swiper.mouseEntered = true;
  },
  handleMouseLeave: function handleMouseLeave() {
    var swiper = this;
    swiper.mouseEntered = false;
  },
  handle: function handle(event) {
    var e = event;
    var swiper = this;
    var params = swiper.params.mousewheel;

    if (!swiper.mouseEntered && !params.releaseOnEdges) return true;

    if (e.originalEvent) e = e.originalEvent; // jquery fix
    var delta = 0;
    var rtlFactor = swiper.rtlTranslate ? -1 : 1;

    var data$$1 = Mousewheel.normalize(e);

    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data$$1.pixelX) > Math.abs(data$$1.pixelY)) delta = data$$1.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data$$1.pixelY) > Math.abs(data$$1.pixelX)) delta = data$$1.pixelY;else return true;
    } else {
      delta = Math.abs(data$$1.pixelX) > Math.abs(data$$1.pixelY) ? -data$$1.pixelX * rtlFactor : -data$$1.pixelY;
    }

    if (delta === 0) return true;

    if (params.invert) delta = -delta;

    if (!swiper.params.freeMode) {
      if (Utils.now() - swiper.mousewheel.lastScrollTime > 60) {
        if (delta < 0) {
          if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
            swiper.slideNext();
            swiper.emit('scroll', e);
          } else if (params.releaseOnEdges) return true;
        } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
          swiper.slidePrev();
          swiper.emit('scroll', e);
        } else if (params.releaseOnEdges) return true;
      }
      swiper.mousewheel.lastScrollTime = new win.Date().getTime();
    } else {
      // Freemode or scrollContainer:
      if (swiper.params.loop) {
        swiper.loopFix();
      }
      var position = swiper.getTranslate() + delta * params.sensitivity;
      var wasBeginning = swiper.isBeginning;
      var wasEnd = swiper.isEnd;

      if (position >= swiper.minTranslate()) position = swiper.minTranslate();
      if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();

      swiper.setTransition(0);
      swiper.setTranslate(position);
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();

      if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
        swiper.updateSlidesClasses();
      }

      if (swiper.params.freeModeSticky) {
        clearTimeout(swiper.mousewheel.timeout);
        swiper.mousewheel.timeout = Utils.nextTick(function () {
          swiper.slideToClosest();
        }, 300);
      }
      // Emit event
      swiper.emit('scroll', e);

      // Stop autoplay
      if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop();
      // Return page scroll on edge positions
      if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
    }

    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  },
  enable: function enable() {
    var swiper = this;
    if (!Mousewheel.event) return false;
    if (swiper.mousewheel.enabled) return false;
    var target = swiper.$el;
    if (swiper.params.mousewheel.eventsTarged !== 'container') {
      target = $$1(swiper.params.mousewheel.eventsTarged);
    }
    target.on('mouseenter', swiper.mousewheel.handleMouseEnter);
    target.on('mouseleave', swiper.mousewheel.handleMouseLeave);
    target.on(Mousewheel.event, swiper.mousewheel.handle);
    swiper.mousewheel.enabled = true;
    return true;
  },
  disable: function disable() {
    var swiper = this;
    if (!Mousewheel.event) return false;
    if (!swiper.mousewheel.enabled) return false;
    var target = swiper.$el;
    if (swiper.params.mousewheel.eventsTarged !== 'container') {
      target = $$1(swiper.params.mousewheel.eventsTarged);
    }
    target.off(Mousewheel.event, swiper.mousewheel.handle);
    swiper.mousewheel.enabled = false;
    return true;
  }
};

var Mousewheel$1 = {
  name: 'mousewheel',
  params: {
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarged: 'container'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      mousewheel: {
        enabled: false,
        enable: Mousewheel.enable.bind(swiper),
        disable: Mousewheel.disable.bind(swiper),
        handle: Mousewheel.handle.bind(swiper),
        handleMouseEnter: Mousewheel.handleMouseEnter.bind(swiper),
        handleMouseLeave: Mousewheel.handleMouseLeave.bind(swiper),
        lastScrollTime: Utils.now()
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.mousewheel.enabled) swiper.mousewheel.enable();
    },
    destroy: function destroy() {
      var swiper = this;
      if (swiper.mousewheel.enabled) swiper.mousewheel.disable();
    }
  }
};

var Navigation = {
  update: function update() {
    // Update Navigation Buttons
    var swiper = this;
    var params = swiper.params.navigation;

    if (swiper.params.loop) return;
    var _swiper$navigation = swiper.navigation,
        $nextEl = _swiper$navigation.$nextEl,
        $prevEl = _swiper$navigation.$prevEl;


    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        $prevEl.addClass(params.disabledClass);
      } else {
        $prevEl.removeClass(params.disabledClass);
      }
      $prevEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        $nextEl.addClass(params.disabledClass);
      } else {
        $nextEl.removeClass(params.disabledClass);
      }
      $nextEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
  },
  onPrevClick: function onPrevClick(e) {
    var swiper = this;
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop) return;
    swiper.slidePrev();
  },
  onNextClick: function onNextClick(e) {
    var swiper = this;
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop) return;
    swiper.slideNext();
  },
  init: function init() {
    var swiper = this;
    var params = swiper.params.navigation;
    if (!(params.nextEl || params.prevEl)) return;

    var $nextEl = void 0;
    var $prevEl = void 0;
    if (params.nextEl) {
      $nextEl = $$1(params.nextEl);
      if (swiper.params.uniqueNavElements && typeof params.nextEl === 'string' && $nextEl.length > 1 && swiper.$el.find(params.nextEl).length === 1) {
        $nextEl = swiper.$el.find(params.nextEl);
      }
    }
    if (params.prevEl) {
      $prevEl = $$1(params.prevEl);
      if (swiper.params.uniqueNavElements && typeof params.prevEl === 'string' && $prevEl.length > 1 && swiper.$el.find(params.prevEl).length === 1) {
        $prevEl = swiper.$el.find(params.prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', swiper.navigation.onNextClick);
    }
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', swiper.navigation.onPrevClick);
    }

    Utils.extend(swiper.navigation, {
      $nextEl: $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl: $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
  },
  destroy: function destroy() {
    var swiper = this;
    var _swiper$navigation2 = swiper.navigation,
        $nextEl = _swiper$navigation2.$nextEl,
        $prevEl = _swiper$navigation2.$prevEl;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', swiper.navigation.onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', swiper.navigation.onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }
};

var Navigation$1 = {
  name: 'navigation',
  params: {
    navigation: {
      nextEl: null,
      prevEl: null,

      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      navigation: {
        init: Navigation.init.bind(swiper),
        update: Navigation.update.bind(swiper),
        destroy: Navigation.destroy.bind(swiper),
        onNextClick: Navigation.onNextClick.bind(swiper),
        onPrevClick: Navigation.onPrevClick.bind(swiper)
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      swiper.navigation.init();
      swiper.navigation.update();
    },
    toEdge: function toEdge() {
      var swiper = this;
      swiper.navigation.update();
    },
    fromEdge: function fromEdge() {
      var swiper = this;
      swiper.navigation.update();
    },
    destroy: function destroy() {
      var swiper = this;
      swiper.navigation.destroy();
    },
    click: function click$$1(e) {
      var swiper = this;
      var _swiper$navigation3 = swiper.navigation,
          $nextEl = _swiper$navigation3.$nextEl,
          $prevEl = _swiper$navigation3.$prevEl;

      if (swiper.params.navigation.hideOnClick && !$$1(e.target).is($prevEl) && !$$1(e.target).is($nextEl)) {
        var isHidden = void 0;
        if ($nextEl) {
          isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
        } else if ($prevEl) {
          isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
        }
        if (isHidden === true) {
          swiper.emit('navigationShow', swiper);
        } else {
          swiper.emit('navigationHide', swiper);
        }
        if ($nextEl) {
          $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
        }
        if ($prevEl) {
          $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
        }
      }
    }
  }
};

var Pagination = {
  update: function update() {
    // Render || Update Pagination bullets/items
    var swiper = this;
    var rtl = swiper.rtl;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    var $el = swiper.pagination.$el;
    // Current/Total
    var current = void 0;
    var total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }
      if (current > total - 1) current -= total;
      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    }
    // Types
    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      var bullets = swiper.pagination.bullets;
      var firstIndex = void 0;
      var lastIndex = void 0;
      var midIndex = void 0;
      if (params.dynamicBullets) {
        swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
        $el.css(swiper.isHorizontal() ? 'width' : 'height', swiper.pagination.bulletSize * (params.dynamicMainBullets + 4) + 'px');
        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
          swiper.pagination.dynamicBulletIndex += current - swiper.previousIndex;
          if (swiper.pagination.dynamicBulletIndex > params.dynamicMainBullets - 1) {
            swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (swiper.pagination.dynamicBulletIndex < 0) {
            swiper.pagination.dynamicBulletIndex = 0;
          }
        }
        firstIndex = current - swiper.pagination.dynamicBulletIndex;
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.removeClass(params.bulletActiveClass + ' ' + params.bulletActiveClass + '-next ' + params.bulletActiveClass + '-next-next ' + params.bulletActiveClass + '-prev ' + params.bulletActiveClass + '-prev-prev ' + params.bulletActiveClass + '-main');
      if ($el.length > 1) {
        bullets.each(function (index$$1, bullet) {
          var $bullet = $$1(bullet);
          var bulletIndex = $bullet.index();
          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(params.bulletActiveClass + '-main');
            }
            if (bulletIndex === firstIndex) {
              $bullet.prev().addClass(params.bulletActiveClass + '-prev').prev().addClass(params.bulletActiveClass + '-prev-prev');
            }
            if (bulletIndex === lastIndex) {
              $bullet.next().addClass(params.bulletActiveClass + '-next').next().addClass(params.bulletActiveClass + '-next-next');
            }
          }
        });
      } else {
        var $bullet = bullets.eq(current);
        $bullet.addClass(params.bulletActiveClass);
        if (params.dynamicBullets) {
          var $firstDisplayedBullet = bullets.eq(firstIndex);
          var $lastDisplayedBullet = bullets.eq(lastIndex);
          for (var i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(params.bulletActiveClass + '-main');
          }
          $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + '-prev').prev().addClass(params.bulletActiveClass + '-prev-prev');
          $lastDisplayedBullet.next().addClass(params.bulletActiveClass + '-next').next().addClass(params.bulletActiveClass + '-next-next');
        }
      }
      if (params.dynamicBullets) {
        var dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        var bulletsOffset = (swiper.pagination.bulletSize * dynamicBulletsLength - swiper.pagination.bulletSize) / 2 - midIndex * swiper.pagination.bulletSize;
        var offsetProp = rtl ? 'right' : 'left';
        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', bulletsOffset + 'px');
      }
    }
    if (params.type === 'fraction') {
      $el.find('.' + params.currentClass).text(params.formatFractionCurrent(current + 1));
      $el.find('.' + params.totalClass).text(params.formatFractionTotal(total));
    }
    if (params.type === 'progressbar') {
      var progressbarDirection = void 0;
      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
      } else {
        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
      }
      var scale = (current + 1) / total;
      var scaleX = 1;
      var scaleY = 1;
      if (progressbarDirection === 'horizontal') {
        scaleX = scale;
      } else {
        scaleY = scale;
      }
      $el.find('.' + params.progressbarFillClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(swiper.params.speed);
    }
    if (params.type === 'custom' && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      swiper.emit('paginationRender', swiper, $el[0]);
    } else {
      swiper.emit('paginationUpdate', swiper, $el[0]);
    }
    $el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
  },
  render: function render() {
    // Render Container
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;

    var $el = swiper.pagination.$el;
    var paginationHTML = '';
    if (params.type === 'bullets') {
      var numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      for (var i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += '<' + params.bulletElement + ' class="' + params.bulletClass + '"></' + params.bulletElement + '>';
        }
      }
      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find('.' + params.bulletClass);
    }
    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = '<span class="' + params.currentClass + '"></span>' + ' / ' + ('<span class="' + params.totalClass + '"></span>');
      }
      $el.html(paginationHTML);
    }
    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = '<span class="' + params.progressbarFillClass + '"></span>';
      }
      $el.html(paginationHTML);
    }
    if (params.type !== 'custom') {
      swiper.emit('paginationRender', swiper.pagination.$el[0]);
    }
  },
  init: function init() {
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el) return;

    var $el = $$1(params.el);
    if ($el.length === 0) return;

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && swiper.$el.find(params.el).length === 1) {
      $el = swiper.$el.find(params.el);
    }

    if (params.type === 'bullets' && params.clickable) {
      $el.addClass(params.clickableClass);
    }

    $el.addClass(params.modifierClass + params.type);

    if (params.type === 'bullets' && params.dynamicBullets) {
      $el.addClass('' + params.modifierClass + params.type + '-dynamic');
      swiper.pagination.dynamicBulletIndex = 0;
      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }
    if (params.type === 'progressbar' && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }

    if (params.clickable) {
      $el.on('click', '.' + params.bulletClass, function onClick(e) {
        e.preventDefault();
        var index$$1 = $$1(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop) index$$1 += swiper.loopedSlides;
        swiper.slideTo(index$$1);
      });
    }

    Utils.extend(swiper.pagination, {
      $el: $el,
      el: $el[0]
    });
  },
  destroy: function destroy() {
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var $el = swiper.pagination.$el;

    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
    if (params.clickable) {
      $el.off('click', '.' + params.bulletClass);
    }
  }
};

var Pagination$1 = {
  name: 'pagination',
  params: {
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets', // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: function formatFractionCurrent(number) {
        return number;
      },
      formatFractionTotal: function formatFractionTotal(number) {
        return number;
      },
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
      modifierClass: 'swiper-pagination-', // NEW
      currentClass: 'swiper-pagination-current',
      totalClass: 'swiper-pagination-total',
      hiddenClass: 'swiper-pagination-hidden',
      progressbarFillClass: 'swiper-pagination-progressbar-fill',
      progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
      clickableClass: 'swiper-pagination-clickable', // NEW
      lockClass: 'swiper-pagination-lock'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      pagination: {
        init: Pagination.init.bind(swiper),
        render: Pagination.render.bind(swiper),
        update: Pagination.update.bind(swiper),
        destroy: Pagination.destroy.bind(swiper),
        dynamicBulletIndex: 0
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    },
    activeIndexChange: function activeIndexChange() {
      var swiper = this;
      if (swiper.params.loop) {
        swiper.pagination.update();
      } else if (typeof swiper.snapIndex === 'undefined') {
        swiper.pagination.update();
      }
    },
    snapIndexChange: function snapIndexChange() {
      var swiper = this;
      if (!swiper.params.loop) {
        swiper.pagination.update();
      }
    },
    slidesLengthChange: function slidesLengthChange() {
      var swiper = this;
      if (swiper.params.loop) {
        swiper.pagination.render();
        swiper.pagination.update();
      }
    },
    snapGridLengthChange: function snapGridLengthChange() {
      var swiper = this;
      if (!swiper.params.loop) {
        swiper.pagination.render();
        swiper.pagination.update();
      }
    },
    destroy: function destroy() {
      var swiper = this;
      swiper.pagination.destroy();
    },
    click: function click$$1(e) {
      var swiper = this;
      if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && swiper.pagination.$el.length > 0 && !$$1(e.target).hasClass(swiper.params.pagination.bulletClass)) {
        var isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);
        if (isHidden === true) {
          swiper.emit('paginationShow', swiper);
        } else {
          swiper.emit('paginationHide', swiper);
        }
        swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
      }
    }
  }
};

var Scrollbar = {
  setTranslate: function setTranslate() {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        rtl = swiper.rtlTranslate,
        progress = swiper.progress;
    var dragSize = scrollbar.dragSize,
        trackSize = scrollbar.trackSize,
        $dragEl = scrollbar.$dragEl,
        $el = scrollbar.$el;

    var params = swiper.params.scrollbar;

    var newSize = dragSize;
    var newPos = (trackSize - dragSize) * progress;
    if (rtl) {
      newPos = -newPos;
      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }
    if (swiper.isHorizontal()) {
      if (Support.transforms3d) {
        $dragEl.transform('translate3d(' + newPos + 'px, 0, 0)');
      } else {
        $dragEl.transform('translateX(' + newPos + 'px)');
      }
      $dragEl[0].style.width = newSize + 'px';
    } else {
      if (Support.transforms3d) {
        $dragEl.transform('translate3d(0px, ' + newPos + 'px, 0)');
      } else {
        $dragEl.transform('translateY(' + newPos + 'px)');
      }
      $dragEl[0].style.height = newSize + 'px';
    }
    if (params.hide) {
      clearTimeout(swiper.scrollbar.timeout);
      $el[0].style.opacity = 1;
      swiper.scrollbar.timeout = setTimeout(function () {
        $el[0].style.opacity = 0;
        $el.transition(400);
      }, 1000);
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.$dragEl.transition(duration);
  },
  updateSize: function updateSize() {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;

    var scrollbar = swiper.scrollbar;
    var $dragEl = scrollbar.$dragEl,
        $el = scrollbar.$el;


    $dragEl[0].style.width = '';
    $dragEl[0].style.height = '';
    var trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;

    var divider = swiper.size / swiper.virtualSize;
    var moveDivider = divider * (trackSize / swiper.size);
    var dragSize = void 0;
    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }

    if (swiper.isHorizontal()) {
      $dragEl[0].style.width = dragSize + 'px';
    } else {
      $dragEl[0].style.height = dragSize + 'px';
    }

    if (divider >= 1) {
      $el[0].style.display = 'none';
    } else {
      $el[0].style.display = '';
    }
    if (swiper.params.scrollbar.hide) {
      $el[0].style.opacity = 0;
    }
    Utils.extend(scrollbar, {
      trackSize: trackSize,
      divider: divider,
      moveDivider: moveDivider,
      dragSize: dragSize
    });
    scrollbar.$el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
  },
  setDragPosition: function setDragPosition(e) {
    var swiper = this;
    var scrollbar = swiper.scrollbar,
        rtl = swiper.rtlTranslate;
    var $el = scrollbar.$el,
        dragSize = scrollbar.dragSize,
        trackSize = scrollbar.trackSize;


    var pointerPosition = void 0;
    if (swiper.isHorizontal()) {
      pointerPosition = e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX || e.clientX;
    } else {
      pointerPosition = e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY || e.clientY;
    }
    var positionRatio = void 0;
    positionRatio = (pointerPosition - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - dragSize / 2) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);
    if (rtl) {
      positionRatio = 1 - positionRatio;
    }

    var position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;

    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  },
  onDragStart: function onDragStart(e) {
    var swiper = this;
    var params = swiper.params.scrollbar;
    var scrollbar = swiper.scrollbar,
        $wrapperEl = swiper.$wrapperEl;
    var $el = scrollbar.$el,
        $dragEl = scrollbar.$dragEl;

    swiper.scrollbar.isTouched = true;
    e.preventDefault();
    e.stopPropagation();

    $wrapperEl.transition(100);
    $dragEl.transition(100);
    scrollbar.setDragPosition(e);

    clearTimeout(swiper.scrollbar.dragTimeout);

    $el.transition(0);
    if (params.hide) {
      $el.css('opacity', 1);
    }
    swiper.emit('scrollbarDragStart', e);
  },
  onDragMove: function onDragMove(e) {
    var swiper = this;
    var scrollbar = swiper.scrollbar,
        $wrapperEl = swiper.$wrapperEl;
    var $el = scrollbar.$el,
        $dragEl = scrollbar.$dragEl;


    if (!swiper.scrollbar.isTouched) return;
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    scrollbar.setDragPosition(e);
    $wrapperEl.transition(0);
    $el.transition(0);
    $dragEl.transition(0);
    swiper.emit('scrollbarDragMove', e);
  },
  onDragEnd: function onDragEnd(e) {
    var swiper = this;

    var params = swiper.params.scrollbar;
    var scrollbar = swiper.scrollbar;
    var $el = scrollbar.$el;


    if (!swiper.scrollbar.isTouched) return;
    swiper.scrollbar.isTouched = false;
    if (params.hide) {
      clearTimeout(swiper.scrollbar.dragTimeout);
      swiper.scrollbar.dragTimeout = Utils.nextTick(function () {
        $el.css('opacity', 0);
        $el.transition(400);
      }, 1000);
    }
    swiper.emit('scrollbarDragEnd', e);
    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  },
  enableDraggable: function enableDraggable() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        touchEventsTouch = swiper.touchEventsTouch,
        touchEventsDesktop = swiper.touchEventsDesktop,
        params = swiper.params;

    var $el = scrollbar.$el;
    var target = $el[0];
    var activeListener = Support.passiveListener && params.passiveListeners ? { passive: false, capture: false } : false;
    var passiveListener = Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
    if (!Support.touch) {
      target.addEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
      doc.addEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
      doc.addEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
    } else {
      target.addEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
      target.addEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
      target.addEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
    }
  },
  disableDraggable: function disableDraggable() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        touchEventsTouch = swiper.touchEventsTouch,
        touchEventsDesktop = swiper.touchEventsDesktop,
        params = swiper.params;

    var $el = scrollbar.$el;
    var target = $el[0];
    var activeListener = Support.passiveListener && params.passiveListeners ? { passive: false, capture: false } : false;
    var passiveListener = Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
    if (!Support.touch) {
      target.removeEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
      doc.removeEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
      doc.removeEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
    } else {
      target.removeEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
      target.removeEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
      target.removeEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
    }
  },
  init: function init() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        $swiperEl = swiper.$el;

    var params = swiper.params.scrollbar;

    var $el = $$1(params.el);
    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
      $el = $swiperEl.find(params.el);
    }

    var $dragEl = $el.find('.' + swiper.params.scrollbar.dragClass);
    if ($dragEl.length === 0) {
      $dragEl = $$1('<div class="' + swiper.params.scrollbar.dragClass + '"></div>');
      $el.append($dragEl);
    }

    Utils.extend(scrollbar, {
      $el: $el,
      el: $el[0],
      $dragEl: $dragEl,
      dragEl: $dragEl[0]
    });

    if (params.draggable) {
      scrollbar.enableDraggable();
    }
  },
  destroy: function destroy() {
    var swiper = this;
    swiper.scrollbar.disableDraggable();
  }
};

var Scrollbar$1 = {
  name: 'scrollbar',
  params: {
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      scrollbar: {
        init: Scrollbar.init.bind(swiper),
        destroy: Scrollbar.destroy.bind(swiper),
        updateSize: Scrollbar.updateSize.bind(swiper),
        setTranslate: Scrollbar.setTranslate.bind(swiper),
        setTransition: Scrollbar.setTransition.bind(swiper),
        enableDraggable: Scrollbar.enableDraggable.bind(swiper),
        disableDraggable: Scrollbar.disableDraggable.bind(swiper),
        setDragPosition: Scrollbar.setDragPosition.bind(swiper),
        onDragStart: Scrollbar.onDragStart.bind(swiper),
        onDragMove: Scrollbar.onDragMove.bind(swiper),
        onDragEnd: Scrollbar.onDragEnd.bind(swiper),
        isTouched: false,
        timeout: null,
        dragTimeout: null
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      swiper.scrollbar.init();
      swiper.scrollbar.updateSize();
      swiper.scrollbar.setTranslate();
    },
    update: function update() {
      var swiper = this;
      swiper.scrollbar.updateSize();
    },
    resize: function resize$$1() {
      var swiper = this;
      swiper.scrollbar.updateSize();
    },
    observerUpdate: function observerUpdate() {
      var swiper = this;
      swiper.scrollbar.updateSize();
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      swiper.scrollbar.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      swiper.scrollbar.setTransition(duration);
    },
    destroy: function destroy() {
      var swiper = this;
      swiper.scrollbar.destroy();
    }
  }
};

var Parallax = {
  setTransform: function setTransform(el, progress) {
    var swiper = this;
    var rtl = swiper.rtl;


    var $el = $$1(el);
    var rtlFactor = rtl ? -1 : 1;

    var p = $el.attr('data-swiper-parallax') || '0';
    var x = $el.attr('data-swiper-parallax-x');
    var y = $el.attr('data-swiper-parallax-y');
    var scale = $el.attr('data-swiper-parallax-scale');
    var opacity = $el.attr('data-swiper-parallax-opacity');

    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }

    if (x.indexOf('%') >= 0) {
      x = parseInt(x, 10) * progress * rtlFactor + '%';
    } else {
      x = x * progress * rtlFactor + 'px';
    }
    if (y.indexOf('%') >= 0) {
      y = parseInt(y, 10) * progress + '%';
    } else {
      y = y * progress + 'px';
    }

    if (typeof opacity !== 'undefined' && opacity !== null) {
      var currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      $el[0].style.opacity = currentOpacity;
    }
    if (typeof scale === 'undefined' || scale === null) {
      $el.transform('translate3d(' + x + ', ' + y + ', 0px)');
    } else {
      var currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      $el.transform('translate3d(' + x + ', ' + y + ', 0px) scale(' + currentScale + ')');
    }
  },
  setTranslate: function setTranslate() {
    var swiper = this;
    var $el = swiper.$el,
        slides = swiper.slides,
        progress = swiper.progress,
        snapGrid = swiper.snapGrid;

    $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function (index$$1, el) {
      swiper.parallax.setTransform(el, progress);
    });
    slides.each(function (slideIndex, slideEl) {
      var slideProgress = slideEl.progress;
      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }
      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      $$1(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function (index$$1, el) {
        swiper.parallax.setTransform(el, slideProgress);
      });
    });
  },
  setTransition: function setTransition() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.speed;

    var swiper = this;
    var $el = swiper.$el;

    $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function (index$$1, parallaxEl) {
      var $parallaxEl = $$1(parallaxEl);
      var parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      $parallaxEl.transition(parallaxDuration);
    });
  }
};

var Parallax$1 = {
  name: 'parallax',
  params: {
    parallax: {
      enabled: false
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      parallax: {
        setTransform: Parallax.setTransform.bind(swiper),
        setTranslate: Parallax.setTranslate.bind(swiper),
        setTransition: Parallax.setTransition.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (!swiper.params.parallax.enabled) return;
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    init: function init() {
      var swiper = this;
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTranslate();
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTransition(duration);
    }
  }
};

var Zoom = {
  // Calc Scale From Multi-touches
  getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2) return 1;
    var x1 = e.targetTouches[0].pageX;
    var y1 = e.targetTouches[0].pageY;
    var x2 = e.targetTouches[1].pageX;
    var y2 = e.targetTouches[1].pageY;
    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  },

  // Events
  onGestureStart: function onGestureStart(e) {
    var swiper = this;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    zoom.fakeGestureTouched = false;
    zoom.fakeGestureMoved = false;
    if (!Support.gestures) {
      if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
        return;
      }
      zoom.fakeGestureTouched = true;
      gesture.scaleStart = Zoom.getDistanceBetweenTouches(e);
    }
    if (!gesture.$slideEl || !gesture.$slideEl.length) {
      gesture.$slideEl = $$1(e.target).closest('.swiper-slide');
      if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas');
      gesture.$imageWrapEl = gesture.$imageEl.parent('.' + params.containerClass);
      gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
      if (gesture.$imageWrapEl.length === 0) {
        gesture.$imageEl = undefined;
        return;
      }
    }
    gesture.$imageEl.transition(0);
    swiper.zoom.isScaling = true;
  },
  onGestureChange: function onGestureChange(e) {
    var swiper = this;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (!Support.gestures) {
      if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
        return;
      }
      zoom.fakeGestureMoved = true;
      gesture.scaleMove = Zoom.getDistanceBetweenTouches(e);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (Support.gestures) {
      zoom.scale = e.scale * zoom.currentScale;
    } else {
      zoom.scale = gesture.scaleMove / gesture.scaleStart * zoom.currentScale;
    }
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + Math.pow(zoom.scale - gesture.maxRatio + 1, 0.5);
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - Math.pow(params.minRatio - zoom.scale + 1, 0.5);
    }
    gesture.$imageEl.transform('translate3d(0,0,0) scale(' + zoom.scale + ')');
  },
  onGestureEnd: function onGestureEnd(e) {
    var swiper = this;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (!Support.gestures) {
      if (!zoom.fakeGestureTouched || !zoom.fakeGestureMoved) {
        return;
      }
      if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !Device.android) {
        return;
      }
      zoom.fakeGestureTouched = false;
      zoom.fakeGestureMoved = false;
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.$imageEl.transition(swiper.params.speed).transform('translate3d(0,0,0) scale(' + zoom.scale + ')');
    zoom.currentScale = zoom.scale;
    zoom.isScaling = false;
    if (zoom.scale === 1) gesture.$slideEl = undefined;
  },
  onTouchStart: function onTouchStart(e) {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image;

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (image.isTouched) return;
    if (Device.android) e.preventDefault();
    image.isTouched = true;
    image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  },
  onTouchMove: function onTouchMove(e) {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image,
        velocity = zoom.velocity;

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    swiper.allowClick = false;
    if (!image.isTouched || !gesture.$slideEl) return;

    if (!image.isMoved) {
      image.width = gesture.$imageEl[0].offsetWidth;
      image.height = gesture.$imageEl[0].offsetHeight;
      image.startX = Utils.getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
      image.startY = Utils.getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
      gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
      gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
      gesture.$imageWrapEl.transition(0);
      if (swiper.rtl) {
        image.startX = -image.startX;
        image.startY = -image.startY;
      }
    }
    // Define if we need image drag
    var scaledWidth = image.width * zoom.scale;
    var scaledHeight = image.height * zoom.scale;

    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;

    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;

    image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    if (!image.isMoved && !zoom.isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }
    e.preventDefault();
    e.stopPropagation();

    image.isMoved = true;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - Math.pow(image.minX - image.currentX + 1, 0.8);
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + Math.pow(image.currentX - image.maxX + 1, 0.8);
    }

    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - Math.pow(image.minY - image.currentY + 1, 0.8);
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + Math.pow(image.currentY - image.maxY + 1, 0.8);
    }

    // Velocity
    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();

    gesture.$imageWrapEl.transform('translate3d(' + image.currentX + 'px, ' + image.currentY + 'px,0)');
  },
  onTouchEnd: function onTouchEnd() {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image,
        velocity = zoom.velocity;

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    var momentumDurationX = 300;
    var momentumDurationY = 300;
    var momentumDistanceX = velocity.x * momentumDurationX;
    var newPositionX = image.currentX + momentumDistanceX;
    var momentumDistanceY = velocity.y * momentumDurationY;
    var newPositionY = image.currentY + momentumDistanceY;

    // Fix duration
    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

    image.currentX = newPositionX;
    image.currentY = newPositionY;

    // Define if we need image drag
    var scaledWidth = image.width * zoom.scale;
    var scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);

    gesture.$imageWrapEl.transition(momentumDuration).transform('translate3d(' + image.currentX + 'px, ' + image.currentY + 'px,0)');
  },
  onTransitionEnd: function onTransitionEnd() {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
      gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
      gesture.$imageWrapEl.transform('translate3d(0,0,0)');

      zoom.scale = 1;
      zoom.currentScale = 1;

      gesture.$slideEl = undefined;
      gesture.$imageEl = undefined;
      gesture.$imageWrapEl = undefined;
    }
  },

  // Toggle Zoom
  toggle: function toggle(e) {
    var swiper = this;
    var zoom = swiper.zoom;

    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoom.out();
    } else {
      // Zoom In
      zoom.in(e);
    }
  },
  in: function _in(e) {
    var swiper = this;

    var zoom = swiper.zoom;
    var params = swiper.params.zoom;
    var gesture = zoom.gesture,
        image = zoom.image;


    if (!gesture.$slideEl) {
      gesture.$slideEl = swiper.clickedSlide ? $$1(swiper.clickedSlide) : swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas');
      gesture.$imageWrapEl = gesture.$imageEl.parent('.' + params.containerClass);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

    gesture.$slideEl.addClass('' + params.zoomedSlideClass);

    var touchX = void 0;
    var touchY = void 0;
    var offsetX = void 0;
    var offsetY = void 0;
    var diffX = void 0;
    var diffY = void 0;
    var translateX = void 0;
    var translateY = void 0;
    var imageWidth = void 0;
    var imageHeight = void 0;
    var scaledWidth = void 0;
    var scaledHeight = void 0;
    var translateMinX = void 0;
    var translateMinY = void 0;
    var translateMaxX = void 0;
    var translateMaxY = void 0;
    var slideWidth = void 0;
    var slideHeight = void 0;

    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
      touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }

    zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
    zoom.currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
    if (e) {
      slideWidth = gesture.$slideEl[0].offsetWidth;
      slideHeight = gesture.$slideEl[0].offsetHeight;
      offsetX = gesture.$slideEl.offset().left;
      offsetY = gesture.$slideEl.offset().top;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;

      imageWidth = gesture.$imageEl[0].offsetWidth;
      imageHeight = gesture.$imageEl[0].offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;

      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;

      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;

      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }

      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    gesture.$imageWrapEl.transition(300).transform('translate3d(' + translateX + 'px, ' + translateY + 'px,0)');
    gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(' + zoom.scale + ')');
  },
  out: function out() {
    var swiper = this;

    var zoom = swiper.zoom;
    var params = swiper.params.zoom;
    var gesture = zoom.gesture;


    if (!gesture.$slideEl) {
      gesture.$slideEl = swiper.clickedSlide ? $$1(swiper.clickedSlide) : swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas');
      gesture.$imageWrapEl = gesture.$imageEl.parent('.' + params.containerClass);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

    zoom.scale = 1;
    zoom.currentScale = 1;
    gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
    gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
    gesture.$slideEl.removeClass('' + params.zoomedSlideClass);
    gesture.$slideEl = undefined;
  },

  // Attach/Detach Events
  enable: function enable() {
    var swiper = this;
    var zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;

    var passiveListener = swiper.touchEvents.start === 'touchstart' && Support.passiveListener && swiper.params.passiveListeners ? { passive: true, capture: false } : false;

    // Scale image
    if (Support.gestures) {
      swiper.$wrapperEl.on('gesturestart', '.swiper-slide', zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.on('gesturechange', '.swiper-slide', zoom.onGestureChange, passiveListener);
      swiper.$wrapperEl.on('gestureend', '.swiper-slide', zoom.onGestureEnd, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.on(swiper.touchEvents.start, '.swiper-slide', zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.move, '.swiper-slide', zoom.onGestureChange, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.end, '.swiper-slide', zoom.onGestureEnd, passiveListener);
    }

    // Move image
    swiper.$wrapperEl.on(swiper.touchEvents.move, '.' + swiper.params.zoom.containerClass, zoom.onTouchMove);
  },
  disable: function disable() {
    var swiper = this;
    var zoom = swiper.zoom;
    if (!zoom.enabled) return;

    swiper.zoom.enabled = false;

    var passiveListener = swiper.touchEvents.start === 'touchstart' && Support.passiveListener && swiper.params.passiveListeners ? { passive: true, capture: false } : false;

    // Scale image
    if (Support.gestures) {
      swiper.$wrapperEl.off('gesturestart', '.swiper-slide', zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.off('gesturechange', '.swiper-slide', zoom.onGestureChange, passiveListener);
      swiper.$wrapperEl.off('gestureend', '.swiper-slide', zoom.onGestureEnd, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.off(swiper.touchEvents.start, '.swiper-slide', zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.move, '.swiper-slide', zoom.onGestureChange, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.end, '.swiper-slide', zoom.onGestureEnd, passiveListener);
    }

    // Move image
    swiper.$wrapperEl.off(swiper.touchEvents.move, '.' + swiper.params.zoom.containerClass, zoom.onTouchMove);
  }
};

var Zoom$1 = {
  name: 'zoom',
  params: {
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  },
  create: function create() {
    var swiper = this;
    var zoom = {
      enabled: false,
      scale: 1,
      currentScale: 1,
      isScaling: false,
      gesture: {
        $slideEl: undefined,
        slideWidth: undefined,
        slideHeight: undefined,
        $imageEl: undefined,
        $imageWrapEl: undefined,
        maxRatio: 3
      },
      image: {
        isTouched: undefined,
        isMoved: undefined,
        currentX: undefined,
        currentY: undefined,
        minX: undefined,
        minY: undefined,
        maxX: undefined,
        maxY: undefined,
        width: undefined,
        height: undefined,
        startX: undefined,
        startY: undefined,
        touchesStart: {},
        touchesCurrent: {}
      },
      velocity: {
        x: undefined,
        y: undefined,
        prevPositionX: undefined,
        prevPositionY: undefined,
        prevTime: undefined
      }
    };

    'onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out'.split(' ').forEach(function (methodName) {
      zoom[methodName] = Zoom[methodName].bind(swiper);
    });
    Utils.extend(swiper, {
      zoom: zoom
    });

    var scale = 1;
    Object.defineProperty(swiper.zoom, 'scale', {
      get: function get$$1() {
        return scale;
      },
      set: function set$$1(value) {
        if (scale !== value) {
          var imageEl = swiper.zoom.gesture.$imageEl ? swiper.zoom.gesture.$imageEl[0] : undefined;
          var slideEl = swiper.zoom.gesture.$slideEl ? swiper.zoom.gesture.$slideEl[0] : undefined;
          swiper.emit('zoomChange', value, imageEl, slideEl);
        }
        scale = value;
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.zoom.enabled) {
        swiper.zoom.enable();
      }
    },
    destroy: function destroy() {
      var swiper = this;
      swiper.zoom.disable();
    },
    touchStart: function touchStart(e) {
      var swiper = this;
      if (!swiper.zoom.enabled) return;
      swiper.zoom.onTouchStart(e);
    },
    touchEnd: function touchEnd(e) {
      var swiper = this;
      if (!swiper.zoom.enabled) return;
      swiper.zoom.onTouchEnd(e);
    },
    doubleTap: function doubleTap(e) {
      var swiper = this;
      if (swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
        swiper.zoom.toggle(e);
      }
    },
    transitionEnd: function transitionEnd$$1() {
      var swiper = this;
      if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
        swiper.zoom.onTransitionEnd();
      }
    }
  }
};

var Lazy = {
  loadInSlide: function loadInSlide(index$$1) {
    var loadInDuplicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var swiper = this;
    var params = swiper.params.lazy;
    if (typeof index$$1 === 'undefined') return;
    if (swiper.slides.length === 0) return;
    var isVirtual = swiper.virtual && swiper.params.virtual.enabled;

    var $slideEl = isVirtual ? swiper.$wrapperEl.children('.' + swiper.params.slideClass + '[data-swiper-slide-index="' + index$$1 + '"]') : swiper.slides.eq(index$$1);

    var $images = $slideEl.find('.' + params.elementClass + ':not(.' + params.loadedClass + '):not(.' + params.loadingClass + ')');
    if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
      $images = $images.add($slideEl[0]);
    }
    if ($images.length === 0) return;

    $images.each(function (imageIndex, imageEl) {
      var $imageEl = $$1(imageEl);
      $imageEl.addClass(params.loadingClass);

      var background = $imageEl.attr('data-background');
      var src = $imageEl.attr('data-src');
      var srcset = $imageEl.attr('data-srcset');
      var sizes = $imageEl.attr('data-sizes');

      swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, function () {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;
        if (background) {
          $imageEl.css('background-image', 'url("' + background + '")');
          $imageEl.removeAttr('data-background');
        } else {
          if (srcset) {
            $imageEl.attr('srcset', srcset);
            $imageEl.removeAttr('data-srcset');
          }
          if (sizes) {
            $imageEl.attr('sizes', sizes);
            $imageEl.removeAttr('data-sizes');
          }
          if (src) {
            $imageEl.attr('src', src);
            $imageEl.removeAttr('data-src');
          }
        }

        $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
        $slideEl.find('.' + params.preloaderClass).remove();
        if (swiper.params.loop && loadInDuplicate) {
          var slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');
          if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
            var originalSlide = swiper.$wrapperEl.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + swiper.params.slideDuplicateClass + ')');
            swiper.lazy.loadInSlide(originalSlide.index(), false);
          } else {
            var duplicatedSlide = swiper.$wrapperEl.children('.' + swiper.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
            swiper.lazy.loadInSlide(duplicatedSlide.index(), false);
          }
        }
        swiper.emit('lazyImageReady', $slideEl[0], $imageEl[0]);
      });

      swiper.emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
    });
  },
  load: function load() {
    var swiper = this;
    var $wrapperEl = swiper.$wrapperEl,
        swiperParams = swiper.params,
        slides = swiper.slides,
        activeIndex = swiper.activeIndex;

    var isVirtual = swiper.virtual && swiperParams.virtual.enabled;
    var params = swiperParams.lazy;

    var slidesPerView = swiperParams.slidesPerView;
    if (slidesPerView === 'auto') {
      slidesPerView = 0;
    }

    function slideExist(index$$1) {
      if (isVirtual) {
        if ($wrapperEl.children('.' + swiperParams.slideClass + '[data-swiper-slide-index="' + index$$1 + '"]').length) {
          return true;
        }
      } else if (slides[index$$1]) return true;
      return false;
    }
    function slideIndex(slideEl) {
      if (isVirtual) {
        return $$1(slideEl).attr('data-swiper-slide-index');
      }
      return $$1(slideEl).index();
    }

    if (!swiper.lazy.initialImageLoaded) swiper.lazy.initialImageLoaded = true;
    if (swiper.params.watchSlidesVisibility) {
      $wrapperEl.children('.' + swiperParams.slideVisibleClass).each(function (elIndex, slideEl) {
        var index$$1 = isVirtual ? $$1(slideEl).attr('data-swiper-slide-index') : $$1(slideEl).index();
        swiper.lazy.loadInSlide(index$$1);
      });
    } else if (slidesPerView > 1) {
      for (var i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
        if (slideExist(i)) swiper.lazy.loadInSlide(i);
      }
    } else {
      swiper.lazy.loadInSlide(activeIndex);
    }
    if (params.loadPrevNext) {
      if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
        var amount = params.loadPrevNextAmount;
        var spv = slidesPerView;
        var maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
        var minIndex = Math.max(activeIndex - Math.max(spv, amount), 0);
        // Next Slides
        for (var _i10 = activeIndex + slidesPerView; _i10 < maxIndex; _i10 += 1) {
          if (slideExist(_i10)) swiper.lazy.loadInSlide(_i10);
        }
        // Prev Slides
        for (var _i11 = minIndex; _i11 < activeIndex; _i11 += 1) {
          if (slideExist(_i11)) swiper.lazy.loadInSlide(_i11);
        }
      } else {
        var nextSlide = $wrapperEl.children('.' + swiperParams.slideNextClass);
        if (nextSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(nextSlide));

        var prevSlide = $wrapperEl.children('.' + swiperParams.slidePrevClass);
        if (prevSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(prevSlide));
      }
    }
  }
};

var Lazy$1 = {
  name: 'lazy',
  params: {
    lazy: {
      enabled: false,
      loadPrevNext: false,
      loadPrevNextAmount: 1,
      loadOnTransitionStart: false,

      elementClass: 'swiper-lazy',
      loadingClass: 'swiper-lazy-loading',
      loadedClass: 'swiper-lazy-loaded',
      preloaderClass: 'swiper-lazy-preloader'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      lazy: {
        initialImageLoaded: false,
        load: Lazy.load.bind(swiper),
        loadInSlide: Lazy.loadInSlide.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
        swiper.params.preloadImages = false;
      }
    },
    init: function init() {
      var swiper = this;
      if (swiper.params.lazy.enabled && !swiper.params.loop && swiper.params.initialSlide === 0) {
        swiper.lazy.load();
      }
    },
    scroll: function scroll$$1() {
      var swiper = this;
      if (swiper.params.freeMode && !swiper.params.freeModeSticky) {
        swiper.lazy.load();
      }
    },
    resize: function resize$$1() {
      var swiper = this;
      if (swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }
    },
    scrollbarDragMove: function scrollbarDragMove() {
      var swiper = this;
      if (swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }
    },
    transitionStart: function transitionStart() {
      var swiper = this;
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !swiper.lazy.initialImageLoaded) {
          swiper.lazy.load();
        }
      }
    },
    transitionEnd: function transitionEnd$$1() {
      var swiper = this;
      if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
        swiper.lazy.load();
      }
    }
  }
};

/* eslint no-bitwise: ["error", { "allow": [">>"] }] */

var Controller = {
  LinearSpline: function LinearSpline(x, y) {
    var binarySearch = function search() {
      var maxIndex = void 0;
      var minIndex = void 0;
      var guess = void 0;
      return function (array, val$$1) {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;
          if (array[guess] <= val$$1) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }
        return maxIndex;
      };
    }();
    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1;
    // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.
    var i1 = void 0;
    var i3 = void 0;

    this.interpolate = function interpolate(x2) {
      if (!x2) return 0;

      // Get the indexes of x1 and x3 (the array indexes before and after given x2):
      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1;

      // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };
    return this;
  },
  // xxx: for now i will just save one spline function to to
  getInterpolateFunction: function getInterpolateFunction(c) {
    var swiper = this;
    if (!swiper.controller.spline) {
      swiper.controller.spline = swiper.params.loop ? new Controller.LinearSpline(swiper.slidesGrid, c.slidesGrid) : new Controller.LinearSpline(swiper.snapGrid, c.snapGrid);
    }
  },
  setTranslate: function setTranslate(_setTranslate, byController) {
    var swiper = this;
    var controlled = swiper.controller.control;
    var multiplier = void 0;
    var controlledTranslate = void 0;
    function setControlledTranslate(c) {
      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      var translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
      if (swiper.params.controller.by === 'slide') {
        swiper.controller.getInterpolateFunction(c);
        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out
        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }

      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }

      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }
      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }
    if (Array.isArray(controlled)) {
      for (var i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  },
  setTransition: function setTransition(duration, byController) {
    var swiper = this;
    var controlled = swiper.controller.control;
    var i = void 0;
    function setControlledTransition(c) {
      c.setTransition(duration, swiper);
      if (duration !== 0) {
        c.transitionStart();
        if (c.params.autoHeight) {
          Utils.nextTick(function () {
            c.updateAutoHeight();
          });
        }
        c.$wrapperEl.transitionEnd(function () {
          if (!controlled) return;
          if (c.params.loop && swiper.params.controller.by === 'slide') {
            c.loopFix();
          }
          c.transitionEnd();
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
};
var Controller$1 = {
  name: 'controller',
  params: {
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      controller: {
        control: swiper.params.controller.control,
        getInterpolateFunction: Controller.getInterpolateFunction.bind(swiper),
        setTranslate: Controller.setTranslate.bind(swiper),
        setTransition: Controller.setTransition.bind(swiper)
      }
    });
  },

  on: {
    update: function update() {
      var swiper = this;
      if (!swiper.controller.control) return;
      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    resize: function resize$$1() {
      var swiper = this;
      if (!swiper.controller.control) return;
      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    observerUpdate: function observerUpdate() {
      var swiper = this;
      if (!swiper.controller.control) return;
      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    setTranslate: function setTranslate(translate, byController) {
      var swiper = this;
      if (!swiper.controller.control) return;
      swiper.controller.setTranslate(translate, byController);
    },
    setTransition: function setTransition(duration, byController) {
      var swiper = this;
      if (!swiper.controller.control) return;
      swiper.controller.setTransition(duration, byController);
    }
  }
};

var a11y = {
  makeElFocusable: function makeElFocusable($el) {
    $el.attr('tabIndex', '0');
    return $el;
  },
  addElRole: function addElRole($el, role) {
    $el.attr('role', role);
    return $el;
  },
  addElLabel: function addElLabel($el, label) {
    $el.attr('aria-label', label);
    return $el;
  },
  disableEl: function disableEl($el) {
    $el.attr('aria-disabled', true);
    return $el;
  },
  enableEl: function enableEl($el) {
    $el.attr('aria-disabled', false);
    return $el;
  },
  onEnterKey: function onEnterKey(e) {
    var swiper = this;
    var params = swiper.params.a11y;
    if (e.keyCode !== 13) return;
    var $targetEl = $$1(e.target);
    if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }
      if (swiper.isEnd) {
        swiper.a11y.notify(params.lastSlideMessage);
      } else {
        swiper.a11y.notify(params.nextSlideMessage);
      }
    }
    if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }
      if (swiper.isBeginning) {
        swiper.a11y.notify(params.firstSlideMessage);
      } else {
        swiper.a11y.notify(params.prevSlideMessage);
      }
    }
    if (swiper.pagination && $targetEl.is('.' + swiper.params.pagination.bulletClass)) {
      $targetEl[0].click();
    }
  },
  notify: function notify(message) {
    var swiper = this;
    var notification = swiper.a11y.liveRegion;
    if (notification.length === 0) return;
    notification.html('');
    notification.html(message);
  },
  updateNavigation: function updateNavigation() {
    var swiper = this;

    if (swiper.params.loop) return;
    var _swiper$navigation4 = swiper.navigation,
        $nextEl = _swiper$navigation4.$nextEl,
        $prevEl = _swiper$navigation4.$prevEl;


    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        swiper.a11y.disableEl($prevEl);
      } else {
        swiper.a11y.enableEl($prevEl);
      }
    }
    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        swiper.a11y.disableEl($nextEl);
      } else {
        swiper.a11y.enableEl($nextEl);
      }
    }
  },
  updatePagination: function updatePagination() {
    var swiper = this;
    var params = swiper.params.a11y;
    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.bullets.each(function (bulletIndex, bulletEl) {
        var $bulletEl = $$1(bulletEl);
        swiper.a11y.makeElFocusable($bulletEl);
        swiper.a11y.addElRole($bulletEl, 'button');
        swiper.a11y.addElLabel($bulletEl, params.paginationBulletMessage.replace(/{{index}}/, $bulletEl.index() + 1));
      });
    }
  },
  init: function init() {
    var swiper = this;

    swiper.$el.append(swiper.a11y.liveRegion);

    // Navigation
    var params = swiper.params.a11y;
    var $nextEl = void 0;
    var $prevEl = void 0;
    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }
    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }
    if ($nextEl) {
      swiper.a11y.makeElFocusable($nextEl);
      swiper.a11y.addElRole($nextEl, 'button');
      swiper.a11y.addElLabel($nextEl, params.nextSlideMessage);
      $nextEl.on('keydown', swiper.a11y.onEnterKey);
    }
    if ($prevEl) {
      swiper.a11y.makeElFocusable($prevEl);
      swiper.a11y.addElRole($prevEl, 'button');
      swiper.a11y.addElLabel($prevEl, params.prevSlideMessage);
      $prevEl.on('keydown', swiper.a11y.onEnterKey);
    }

    // Pagination
    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.$el.on('keydown', '.' + swiper.params.pagination.bulletClass, swiper.a11y.onEnterKey);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    if (swiper.a11y.liveRegion && swiper.a11y.liveRegion.length > 0) swiper.a11y.liveRegion.remove();

    var $nextEl = void 0;
    var $prevEl = void 0;
    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }
    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }
    if ($nextEl) {
      $nextEl.off('keydown', swiper.a11y.onEnterKey);
    }
    if ($prevEl) {
      $prevEl.off('keydown', swiper.a11y.onEnterKey);
    }

    // Pagination
    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.$el.off('keydown', '.' + swiper.params.pagination.bulletClass, swiper.a11y.onEnterKey);
    }
  }
};
var A11y = {
  name: 'a11y',
  params: {
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      a11y: {
        liveRegion: $$1('<span class="' + swiper.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>')
      }
    });
    Object.keys(a11y).forEach(function (methodName) {
      swiper.a11y[methodName] = a11y[methodName].bind(swiper);
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.init();
      swiper.a11y.updateNavigation();
    },
    toEdge: function toEdge() {
      var swiper = this;
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updateNavigation();
    },
    fromEdge: function fromEdge() {
      var swiper = this;
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updateNavigation();
    },
    paginationUpdate: function paginationUpdate() {
      var swiper = this;
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updatePagination();
    },
    destroy: function destroy() {
      var swiper = this;
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.destroy();
    }
  }
};

var History = {
  init: function init() {
    var swiper = this;
    if (!swiper.params.history) return;
    if (!win.history || !win.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }
    var history = swiper.history;
    history.initialized = true;
    history.paths = History.getPathValues();
    if (!history.paths.key && !history.paths.value) return;
    history.scrollToSlide(0, history.paths.value, swiper.params.runCallbacksOnInit);
    if (!swiper.params.history.replaceState) {
      win.addEventListener('popstate', swiper.history.setHistoryPopState);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    if (!swiper.params.history.replaceState) {
      win.removeEventListener('popstate', swiper.history.setHistoryPopState);
    }
  },
  setHistoryPopState: function setHistoryPopState() {
    var swiper = this;
    swiper.history.paths = History.getPathValues();
    swiper.history.scrollToSlide(swiper.params.speed, swiper.history.paths.value, false);
  },
  getPathValues: function getPathValues() {
    var pathArray = win.location.pathname.slice(1).split('/').filter(function (part) {
      return part !== '';
    });
    var total = pathArray.length;
    var key = pathArray[total - 2];
    var value = pathArray[total - 1];
    return { key: key, value: value };
  },
  setHistory: function setHistory(key, index$$1) {
    var swiper = this;
    if (!swiper.history.initialized || !swiper.params.history.enabled) return;
    var slide = swiper.slides.eq(index$$1);
    var value = History.slugify(slide.attr('data-history'));
    if (!win.location.pathname.includes(key)) {
      value = key + '/' + value;
    }
    var currentState = win.history.state;
    if (currentState && currentState.value === value) {
      return;
    }
    if (swiper.params.history.replaceState) {
      win.history.replaceState({ value: value }, null, value);
    } else {
      win.history.pushState({ value: value }, null, value);
    }
  },
  slugify: function slugify(text$$1) {
    return text$$1.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  },
  scrollToSlide: function scrollToSlide(speed, value, runCallbacks) {
    var swiper = this;
    if (value) {
      for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
        var _slide3 = swiper.slides.eq(i);
        var slideHistory = History.slugify(_slide3.attr('data-history'));
        if (slideHistory === value && !_slide3.hasClass(swiper.params.slideDuplicateClass)) {
          var _index2 = _slide3.index();
          swiper.slideTo(_index2, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  }
};

var History$1 = {
  name: 'history',
  params: {
    history: {
      enabled: false,
      replaceState: false,
      key: 'slides'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      history: {
        init: History.init.bind(swiper),
        setHistory: History.setHistory.bind(swiper),
        setHistoryPopState: History.setHistoryPopState.bind(swiper),
        scrollToSlide: History.scrollToSlide.bind(swiper),
        destroy: History.destroy.bind(swiper)
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.history.enabled) {
        swiper.history.init();
      }
    },
    destroy: function destroy() {
      var swiper = this;
      if (swiper.params.history.enabled) {
        swiper.history.destroy();
      }
    },
    transitionEnd: function transitionEnd$$1() {
      var swiper = this;
      if (swiper.history.initialized) {
        swiper.history.setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    }
  }
};

var HashNavigation = {
  onHashCange: function onHashCange() {
    var swiper = this;
    var newHash = doc.location.hash.replace('#', '');
    var activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');
    if (newHash !== activeSlideHash) {
      var newIndex = swiper.$wrapperEl.children('.' + swiper.params.slideClass + '[data-hash="' + newHash + '"]').index();
      if (typeof newIndex === 'undefined') return;
      swiper.slideTo(newIndex);
    }
  },
  setHash: function setHash() {
    var swiper = this;
    if (!swiper.hashNavigation.initialized || !swiper.params.hashNavigation.enabled) return;
    if (swiper.params.hashNavigation.replaceState && win.history && win.history.replaceState) {
      win.history.replaceState(null, null, '#' + swiper.slides.eq(swiper.activeIndex).attr('data-hash') || '');
    } else {
      var _slide4 = swiper.slides.eq(swiper.activeIndex);
      var hash = _slide4.attr('data-hash') || _slide4.attr('data-history');
      doc.location.hash = hash || '';
    }
  },
  init: function init() {
    var swiper = this;
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    swiper.hashNavigation.initialized = true;
    var hash = doc.location.hash.replace('#', '');
    if (hash) {
      var speed = 0;
      for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
        var _slide5 = swiper.slides.eq(i);
        var slideHash = _slide5.attr('data-hash') || _slide5.attr('data-history');
        if (slideHash === hash && !_slide5.hasClass(swiper.params.slideDuplicateClass)) {
          var _index3 = _slide5.index();
          swiper.slideTo(_index3, speed, swiper.params.runCallbacksOnInit, true);
        }
      }
    }
    if (swiper.params.hashNavigation.watchState) {
      $$1(win).on('hashchange', swiper.hashNavigation.onHashCange);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    if (swiper.params.hashNavigation.watchState) {
      $$1(win).off('hashchange', swiper.hashNavigation.onHashCange);
    }
  }
};
var HashNavigation$1 = {
  name: 'hash-navigation',
  params: {
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      hashNavigation: {
        initialized: false,
        init: HashNavigation.init.bind(swiper),
        destroy: HashNavigation.destroy.bind(swiper),
        setHash: HashNavigation.setHash.bind(swiper),
        onHashCange: HashNavigation.onHashCange.bind(swiper)
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.hashNavigation.enabled) {
        swiper.hashNavigation.init();
      }
    },
    destroy: function destroy() {
      var swiper = this;
      if (swiper.params.hashNavigation.enabled) {
        swiper.hashNavigation.destroy();
      }
    },
    transitionEnd: function transitionEnd$$1() {
      var swiper = this;
      if (swiper.hashNavigation.initialized) {
        swiper.hashNavigation.setHash();
      }
    }
  }
};

/* eslint no-underscore-dangle: "off" */

var Autoplay = {
  run: function run() {
    var swiper = this;
    var $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
    var delay = swiper.params.autoplay.delay;
    if ($activeSlideEl.attr('data-swiper-autoplay')) {
      delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
    }
    swiper.autoplay.timeout = Utils.nextTick(function () {
      if (swiper.params.autoplay.reverseDirection) {
        if (swiper.params.loop) {
          swiper.loopFix();
          swiper.slidePrev(swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else if (!swiper.isBeginning) {
          swiper.slidePrev(swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else {
          swiper.autoplay.stop();
        }
      } else if (swiper.params.loop) {
        swiper.loopFix();
        swiper.slideNext(swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else if (!swiper.isEnd) {
        swiper.slideNext(swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else if (!swiper.params.autoplay.stopOnLastSlide) {
        swiper.slideTo(0, swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else {
        swiper.autoplay.stop();
      }
    }, delay);
  },
  start: function start() {
    var swiper = this;
    if (typeof swiper.autoplay.timeout !== 'undefined') return false;
    if (swiper.autoplay.running) return false;
    swiper.autoplay.running = true;
    swiper.emit('autoplayStart');
    swiper.autoplay.run();
    return true;
  },
  stop: function stop$$1() {
    var swiper = this;
    if (!swiper.autoplay.running) return false;
    if (typeof swiper.autoplay.timeout === 'undefined') return false;

    if (swiper.autoplay.timeout) {
      clearTimeout(swiper.autoplay.timeout);
      swiper.autoplay.timeout = undefined;
    }
    swiper.autoplay.running = false;
    swiper.emit('autoplayStop');
    return true;
  },
  pause: function pause(speed) {
    var swiper = this;
    if (!swiper.autoplay.running) return;
    if (swiper.autoplay.paused) return;
    if (swiper.autoplay.timeout) clearTimeout(swiper.autoplay.timeout);
    swiper.autoplay.paused = true;
    if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
      swiper.autoplay.paused = false;
      swiper.autoplay.run();
    } else {
      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.autoplay.onTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
    }
  }
};

var Autoplay$1 = {
  name: 'autoplay',
  params: {
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      autoplay: {
        running: false,
        paused: false,
        run: Autoplay.run.bind(swiper),
        start: Autoplay.start.bind(swiper),
        stop: Autoplay.stop.bind(swiper),
        pause: Autoplay.pause.bind(swiper),
        onTransitionEnd: function onTransitionEnd(e) {
          if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.autoplay.onTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
          swiper.autoplay.paused = false;
          if (!swiper.autoplay.running) {
            swiper.autoplay.stop();
          } else {
            swiper.autoplay.run();
          }
        }
      }
    });
  },

  on: {
    init: function init() {
      var swiper = this;
      if (swiper.params.autoplay.enabled) {
        swiper.autoplay.start();
      }
    },
    beforeTransitionStart: function beforeTransitionStart(speed, internal) {
      var swiper = this;
      if (swiper.autoplay.running) {
        if (internal || !swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.pause(speed);
        } else {
          swiper.autoplay.stop();
        }
      }
    },
    sliderFirstMove: function sliderFirstMove() {
      var swiper = this;
      if (swiper.autoplay.running) {
        if (swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.stop();
        } else {
          swiper.autoplay.pause();
        }
      }
    },
    destroy: function destroy() {
      var swiper = this;
      if (swiper.autoplay.running) {
        swiper.autoplay.stop();
      }
    }
  }
};

var Fade = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var slides = swiper.slides;

    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = swiper.slides.eq(i);
      var _offset = $slideEl[0].swiperSlideOffset;
      var tx = -_offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      var ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      var slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
      $slideEl.css({
        opacity: slideOpacity
      }).transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var slides = swiper.slides,
        $wrapperEl = swiper.$wrapperEl;

    slides.transition(duration);
    if (swiper.params.virtualTranslate && duration !== 0) {
      var eventTriggered = false;
      slides.transitionEnd(function () {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        var triggerEvents = ['webkitTransitionEnd', 'transitionend'];
        for (var i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
};

var EffectFade = {
  name: 'effect-fade',
  params: {
    fadeEffect: {
      crossFade: false
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      fadeEffect: {
        setTranslate: Fade.setTranslate.bind(swiper),
        setTransition: Fade.setTransition.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (swiper.params.effect !== 'fade') return;
      swiper.classNames.push(swiper.params.containerModifierClass + 'fade');
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (swiper.params.effect !== 'fade') return;
      swiper.fadeEffect.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      if (swiper.params.effect !== 'fade') return;
      swiper.fadeEffect.setTransition(duration);
    }
  }
};

var Cube = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var $el = swiper.$el,
        $wrapperEl = swiper.$wrapperEl,
        slides = swiper.slides,
        swiperWidth = swiper.width,
        swiperHeight = swiper.height,
        rtl = swiper.rtlTranslate,
        swiperSize = swiper.size;

    var params = swiper.params.cubeEffect;
    var isHorizontal = swiper.isHorizontal();
    var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    var wrapperRotate = 0;
    var $cubeShadowEl = void 0;
    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = $$1('<div class="swiper-cube-shadow"></div>');
          $wrapperEl.append($cubeShadowEl);
        }
        $cubeShadowEl.css({ height: swiperWidth + 'px' });
      } else {
        $cubeShadowEl = $el.find('.swiper-cube-shadow');
        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = $$1('<div class="swiper-cube-shadow"></div>');
          $el.append($cubeShadowEl);
        }
      }
    }
    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = slides.eq(i);
      var slideIndex = i;
      if (isVirtual) {
        slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
      }
      var slideAngle = slideIndex * 90;
      var round = Math.floor(slideAngle / 360);
      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }
      var progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      var tx = 0;
      var ty = 0;
      var tz = 0;
      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }
      if (rtl) {
        tx = -tx;
      }

      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }

      var _transform = 'rotateX(' + (isHorizontal ? 0 : -slideAngle) + 'deg) rotateY(' + (isHorizontal ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }
      $slideEl.transform(_transform);
      if (params.slideShadows) {
        // Set shadows
        var shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
        if (shadowBefore.length === 0) {
          shadowBefore = $$1('<div class="swiper-slide-shadow-' + (isHorizontal ? 'left' : 'top') + '"></div>');
          $slideEl.append(shadowBefore);
        }
        if (shadowAfter.length === 0) {
          shadowAfter = $$1('<div class="swiper-slide-shadow-' + (isHorizontal ? 'right' : 'bottom') + '"></div>');
          $slideEl.append(shadowAfter);
        }
        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      }
    }
    $wrapperEl.css({
      '-webkit-transform-origin': '50% 50% -' + swiperSize / 2 + 'px',
      '-moz-transform-origin': '50% 50% -' + swiperSize / 2 + 'px',
      '-ms-transform-origin': '50% 50% -' + swiperSize / 2 + 'px',
      'transform-origin': '50% 50% -' + swiperSize / 2 + 'px'
    });

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl.transform('translate3d(0px, ' + (swiperWidth / 2 + params.shadowOffset) + 'px, ' + -swiperWidth / 2 + 'px) rotateX(90deg) rotateZ(0deg) scale(' + params.shadowScale + ')');
      } else {
        var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        var scale1 = params.shadowScale;
        var scale2 = params.shadowScale / multiplier;
        var _offset2 = params.shadowOffset;
        $cubeShadowEl.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (swiperHeight / 2 + _offset2) + 'px, ' + -swiperHeight / 2 / scale2 + 'px) rotateX(-90deg)');
      }
    }
    var zFactor = Browser.isSafari || Browser.isUiWebView ? -swiperSize / 2 : 0;
    $wrapperEl.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (swiper.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (swiper.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var $el = swiper.$el,
        slides = swiper.slides;

    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      $el.find('.swiper-cube-shadow').transition(duration);
    }
  }
};

var EffectCube = {
  name: 'effect-cube',
  params: {
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      cubeEffect: {
        setTranslate: Cube.setTranslate.bind(swiper),
        setTransition: Cube.setTransition.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (swiper.params.effect !== 'cube') return;
      swiper.classNames.push(swiper.params.containerModifierClass + 'cube');
      swiper.classNames.push(swiper.params.containerModifierClass + '3d');
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (swiper.params.effect !== 'cube') return;
      swiper.cubeEffect.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      if (swiper.params.effect !== 'cube') return;
      swiper.cubeEffect.setTransition(duration);
    }
  }
};

var Flip = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var slides = swiper.slides,
        rtl = swiper.rtlTranslate;

    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = slides.eq(i);
      var progress = $slideEl[0].progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      }
      var _offset3 = $slideEl[0].swiperSlideOffset;
      var rotate = -180 * progress;
      var rotateY = rotate;
      var rotateX = 0;
      var tx = -_offset3;
      var ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

      if (swiper.params.flipEffect.slideShadows) {
        // Set shadows
        var shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
        if (shadowBefore.length === 0) {
          shadowBefore = $$1('<div class="swiper-slide-shadow-' + (swiper.isHorizontal() ? 'left' : 'top') + '"></div>');
          $slideEl.append(shadowBefore);
        }
        if (shadowAfter.length === 0) {
          shadowAfter = $$1('<div class="swiper-slide-shadow-' + (swiper.isHorizontal() ? 'right' : 'bottom') + '"></div>');
          $slideEl.append(shadowAfter);
        }
        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      }
      $slideEl.transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var slides = swiper.slides,
        activeIndex = swiper.activeIndex,
        $wrapperEl = swiper.$wrapperEl;

    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
    if (swiper.params.virtualTranslate && duration !== 0) {
      var eventTriggered = false;
      // eslint-disable-next-line
      slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        // if (!$(this).hasClass(swiper.params.slideActiveClass)) return;
        eventTriggered = true;
        swiper.animating = false;
        var triggerEvents = ['webkitTransitionEnd', 'transitionend'];
        for (var i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
};

var EffectFlip = {
  name: 'effect-flip',
  params: {
    flipEffect: {
      slideShadows: true,
      limitRotation: true
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      flipEffect: {
        setTranslate: Flip.setTranslate.bind(swiper),
        setTransition: Flip.setTransition.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (swiper.params.effect !== 'flip') return;
      swiper.classNames.push(swiper.params.containerModifierClass + 'flip');
      swiper.classNames.push(swiper.params.containerModifierClass + '3d');
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (swiper.params.effect !== 'flip') return;
      swiper.flipEffect.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      if (swiper.params.effect !== 'flip') return;
      swiper.flipEffect.setTransition(duration);
    }
  }
};

var Coverflow = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var swiperWidth = swiper.width,
        swiperHeight = swiper.height,
        slides = swiper.slides,
        $wrapperEl = swiper.$wrapperEl,
        slidesSizesGrid = swiper.slidesSizesGrid;

    var params = swiper.params.coverflowEffect;
    var isHorizontal = swiper.isHorizontal();
    var transform$$1 = swiper.translate;
    var center = isHorizontal ? -transform$$1 + swiperWidth / 2 : -transform$$1 + swiperHeight / 2;
    var rotate = isHorizontal ? params.rotate : -params.rotate;
    var translate = params.depth;
    // Each slide offset from center
    for (var i = 0, length = slides.length; i < length; i += 1) {
      var $slideEl = slides.eq(i);
      var slideSize = slidesSizesGrid[i];
      var slideOffset = $slideEl[0].swiperSlideOffset;
      var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * params.modifier;

      var rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      var rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
      // var rotateZ = 0
      var translateZ = -translate * Math.abs(offsetMultiplier);

      var translateY = isHorizontal ? 0 : params.stretch * offsetMultiplier;
      var translateX = isHorizontal ? params.stretch * offsetMultiplier : 0;

      // Fix for ultra small values
      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;

      var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

      $slideEl.transform(slideTransform);
      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
      if (params.slideShadows) {
        // Set shadows
        var $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
        if ($shadowBeforeEl.length === 0) {
          $shadowBeforeEl = $$1('<div class="swiper-slide-shadow-' + (isHorizontal ? 'left' : 'top') + '"></div>');
          $slideEl.append($shadowBeforeEl);
        }
        if ($shadowAfterEl.length === 0) {
          $shadowAfterEl = $$1('<div class="swiper-slide-shadow-' + (isHorizontal ? 'right' : 'bottom') + '"></div>');
          $slideEl.append($shadowAfterEl);
        }
        if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }

    // Set correct perspective for IE10
    if (Support.pointerEvents || Support.prefixedPointerEvents) {
      var ws = $wrapperEl[0].style;
      ws.perspectiveOrigin = center + 'px 50%';
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    swiper.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
  }
};

var EffectCoverflow = {
  name: 'effect-coverflow',
  params: {
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      coverflowEffect: {
        setTranslate: Coverflow.setTranslate.bind(swiper),
        setTransition: Coverflow.setTransition.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      if (swiper.params.effect !== 'coverflow') return;

      swiper.classNames.push(swiper.params.containerModifierClass + 'coverflow');
      swiper.classNames.push(swiper.params.containerModifierClass + '3d');

      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    setTranslate: function setTranslate() {
      var swiper = this;
      if (swiper.params.effect !== 'coverflow') return;
      swiper.coverflowEffect.setTranslate();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      if (swiper.params.effect !== 'coverflow') return;
      swiper.coverflowEffect.setTransition(duration);
    }
  }
};

var Thumbs = {
  init: function init() {
    var swiper = this;
    var thumbsParams = swiper.params.thumbs;

    var SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Utils.extend(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Utils.extend(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
    } else if (Utils.isObject(thumbsParams.swiper)) {
      swiper.thumbs.swiper = new SwiperClass(Utils.extend({}, thumbsParams.swiper, {
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slideToClickedSlide: false
      }));
      swiper.thumbs.swiperCreated = true;
    }
    swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', swiper.thumbs.onThumbClick);
  },
  onThumbClick: function onThumbClick() {
    var swiper = this;
    var thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper) return;
    var clickedIndex = thumbsSwiper.clickedIndex;
    var clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && $$1(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    var slideToIndex = void 0;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt($$1(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      var currentIndex = swiper.activeIndex;
      if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
        swiper.loopFix();
        // eslint-disable-next-line
        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        currentIndex = swiper.activeIndex;
      }
      var prevIndex = swiper.slides.eq(currentIndex).prevAll('[data-swiper-slide-index="' + slideToIndex + '"]').eq(0).index();
      var nextIndex = swiper.slides.eq(currentIndex).nextAll('[data-swiper-slide-index="' + slideToIndex + '"]').eq(0).index();
      if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
    }
    swiper.slideTo(slideToIndex);
  },
  update: function update(initial) {
    var swiper = this;
    var thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper) return;

    var slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;

    if (swiper.realIndex !== thumbsSwiper.realIndex) {
      var currentThumbsIndex = thumbsSwiper.activeIndex;
      var newThumbsIndex = void 0;
      if (thumbsSwiper.params.loop) {
        if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
          thumbsSwiper.loopFix();
          // eslint-disable-next-line
          thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
          currentThumbsIndex = thumbsSwiper.activeIndex;
        }
        // Find actual thumbs index to slide to
        var prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll('[data-swiper-slide-index="' + swiper.realIndex + '"]').eq(0).index();
        var nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll('[data-swiper-slide-index="' + swiper.realIndex + '"]').eq(0).index();
        if (typeof prevThumbsIndex === 'undefined') newThumbsIndex = nextThumbsIndex;else if (typeof nextThumbsIndex === 'undefined') newThumbsIndex = prevThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = currentThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex;else newThumbsIndex = prevThumbsIndex;
      } else {
        newThumbsIndex = swiper.realIndex;
      }
      if (thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex) {
          newThumbsIndex = newThumbsIndex - slidesPerView + 1;
        }
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    }

    // Activate thumbs
    var thumbsToActivate = 1;
    var thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }

    thumbsSwiper.slides.removeClass(thumbActiveClass);
    if (thumbsSwiper.params.loop) {
      for (var i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.$wrapperEl.children('[data-swiper-slide-index="' + (swiper.realIndex + i) + '"]').addClass(thumbActiveClass);
      }
    } else {
      for (var _i12 = 0; _i12 < thumbsToActivate; _i12 += 1) {
        thumbsSwiper.slides.eq(swiper.realIndex + _i12).addClass(thumbActiveClass);
      }
    }
  }
};
var Thumbs$1 = {
  name: 'thumbs',
  params: {
    thumbs: {
      swiper: null,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-container-thumbs'
    }
  },
  create: function create() {
    var swiper = this;
    Utils.extend(swiper, {
      thumbs: {
        swiper: null,
        init: Thumbs.init.bind(swiper),
        update: Thumbs.update.bind(swiper),
        onThumbClick: Thumbs.onThumbClick.bind(swiper)
      }
    });
  },

  on: {
    beforeInit: function beforeInit() {
      var swiper = this;
      var thumbs = swiper.params.thumbs;

      if (!thumbs || !thumbs.swiper) return;
      swiper.thumbs.init();
      swiper.thumbs.update(true);
    },
    slideChange: function slideChange() {
      var swiper = this;
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    update: function update() {
      var swiper = this;
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    resize: function resize$$1() {
      var swiper = this;
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    observerUpdate: function observerUpdate() {
      var swiper = this;
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      var thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      thumbsSwiper.setTransition(duration);
    },
    beforeDestroy: function beforeDestroy() {
      var swiper = this;
      var thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      if (swiper.thumbs.swiperCreated && thumbsSwiper) {
        thumbsSwiper.destroy();
      }
    }
  }
};

// Swiper Class

var components = [Device$1, Support$1, Browser$1, Resize, Observer$1, Virtual$1, Keyboard$1, Mousewheel$1, Navigation$1, Pagination$1, Scrollbar$1, Parallax$1, Zoom$1, Lazy$1, Controller$1, A11y, History$1, HashNavigation$1, Autoplay$1, EffectFade, EffectCube, EffectFlip, EffectCoverflow, Thumbs$1];

if (typeof Swiper.use === 'undefined') {
  Swiper.use = Swiper.Class.use;
  Swiper.installModule = Swiper.Class.installModule;
}

Swiper.use(components);

var Approach = function () {
  function Approach() {
    var _this = this;

    classCallCheck(this, Approach);

    this.initDom();

    this.subListThrottle = false;

    this.currentSector = 0;

    this.swiperPlay = null;

    $(document).ready(function () {
      _this.sector.on('click', { self: _this }, _this.showSublist);

      _this.close.on('click', { self: _this }, _this.hideSublist);

      _this.doSlideshow();
    });
  }

  createClass(Approach, [{
    key: 'initDom',
    value: function initDom() {
      this.html = $('html');

      this.isMobile = this.html.hasClass('mobile');

      this.whatItems = $('#sectors');

      this.sector = $('li.sector');

      this.subList = $('#subsectors-list');

      this.subsections = $('#subsections');

      this.propertyCopy = $('#subsection-copy');

      this.sectorHeading = $('#sector-heading');

      this.sectorImg = $('#section-img');

      this.close = $('#sector-close-button');

      this.backLink = $('#back-link');

      // SLIDESHOWS
    }
  }, {
    key: 'noop',
    value: function noop() {
      // do nothing
    }
  }, {
    key: 'doSlideshow',
    value: function doSlideshow() {
      this.SWIPERZ = new Swiper($('#slideshow'), {
        loop: true,
        effect: 'fade',
        speed: 900,
        //  autoplay: 5000,
        swipe: false,
        noSwiping: true,
        noSwipingClass: 'sector'
      });
    }
  }, {
    key: 'showSublist',
    value: function showSublist(e) {
      if (!e.data.self.subListThrottle && !e.data.self.subList.hasClass('show')) {
        // DESKTOP
        if (window.UI.desktopView()) {
          e.data.self.sector.removeClass('active');
          $(e.currentTarget).addClass('active');

          var sector = $(e.currentTarget).attr('data-sector');

          e.data.self.SWIPERZ.slideTo(parseInt(sector) + 1);
        }

        // MOBILE & TABLET
        if (!window.UI.desktopView()) {
          e.data.self.subListThrottle = true;
          e.data.self.subList.addClass('show');
          sector = $(e.currentTarget).attr('data-sector');
          var icon = $(e.currentTarget).attr('data-icon');
          e.data.self.populateList(sector, icon);

          e.data.self.innerWidth = e.data.self.html.width();
          TweenMax.to(e.data.self.subList, 0.7, { x: '0%', ease: Bounce.easeOut }).delay(0.2);
          TweenLite.set(e.data.self.close, { rotation: 180 });
        }
      }
    }
  }, {
    key: 'smallFunk',
    value: function smallFunk(e) {
      TweenMax.to(e.data.self.subList, 0.6, { x: '100%' });
      setTimeout(function () {
        e.data.self.subList.removeClass('show');
        e.data.self.subListThrottle = false;
        e.data.self.emptyList();
      }, 900);
    }
  }, {
    key: 'hideSublist',
    value: function hideSublist(e) {
      // MOBILE
      if (!window.UI.desktopView()) {
        window.UI.affectCloseButtonUI(e.data.self.smallFunk, e);
      }
    }
  }, {
    key: 'emptyList',
    value: function emptyList() {
      this.sectorImg.empty();
      this.sectorHeading.empty();
      this.propertyCopy.empty();
      this.subsections.empty();
    }
  }, {
    key: 'populateList',
    value: function populateList(sector, icon) {
      var heading = window._Sectors[sector].title.replace('\n', '<br />');

      if (icon !== null) {
        var image = '<img src=\'' + icon + '\' alt=\'' + window._Sectors[sector].title + ' | Laughland Jones\' />';
        this.sectorImg.append(image);
      }
      this.sectorHeading.html(heading);

      var html = '';

      if (sector === 4 || sector === '4') {
        window._Sectors[sector].copy.forEach(function (copy) {
          html = html + ('\n        <p>' + copy + '</p>\n        ');
        });
        this.propertyCopy.append(html);
      } else {
        window._Sectors[sector].subsections.forEach(function (section) {
          html = html + ('<li class="subsection">' + section + '</li>');
        });

        this.subsections.append(html);
      }
    }
  }]);
  return Approach;
}();

var Contact = function () {
  function Contact() {
    classCallCheck(this, Contact);

    this.initDom();
    var self = this;

    $(document).ready(function () {
      self.locationTabs.on('click', function (e) {
        var mode = $(e.currentTarget).attr('data-location');
        self.toggleTab(mode);
      });

      self.subscribeBtn.on('click', function (e) {
        return window.UI.affectButtonUI(window.Modal.show.bind(window.Modal), e);
      });
    });
  }

  createClass(Contact, [{
    key: 'toggleTab',
    value: function toggleTab(mode) {
      this.locationWrap.removeClass('studio warehouse');
      this.locationWrap.addClass(mode);
    }
  }, {
    key: 'initDom',
    value: function initDom() {
      this.locationWrap = $('#contact-data-wrap');
      this.locationTabs = $('#location-tabs .tab');
      this.subscribeBtn = $('.subscribe-cta');
      this.close = $('#close-button');
    }
  }]);
  return Contact;
}();

var Home = function () {
  function Home() {
    classCallCheck(this, Home);

    this.setupSlider();
  }

  createClass(Home, [{
    key: 'setupSlider',
    value: function setupSlider() {
      var homeElement = $('body.home');
      var swiperContainer = $('.swiper-container');
      var leftArrow = $('#left-arrow');
      var rightArrow = $('#right-arrow');
      /* eslint-disable no-unused-vars */
      var swiper;
      /* eslint-enable no-unused-vars */

      if (homeElement) {
        if (Mobile.isMobile()) {
          console.log('mobile');
          swiper = new Swiper(swiperContainer, {
            speed: 600,
            loop: true,
            autoplay: {
              delay: 5000
            },
            autoplayDisableOnInteraction: false
          });
        } else {
          swiper = new Swiper(swiperContainer, {
            speed: 1000,
            loop: true,
            autoplay: {
              delay: 5000
            },
            navigation: {
              nextEl: rightArrow,
              prevEl: leftArrow
            },
            effect: 'fade',
            autoplayDisableOnInteraction: false
          });
        }
      }
    }
  }]);
  return Home;
}();

var InProgress = function () {
  function InProgress() {
    classCallCheck(this, InProgress);

    this.initDom();
    this.startSlideshows();
  }

  createClass(InProgress, [{
    key: 'initDom',
    value: function initDom() {
      this.html = $('html');
      this.isMobile = this.html.hasClass('mobile');
      this.imageBrowsers = $('.project-images-browser');
    }
  }, {
    key: 'startSlideshows',
    value: function startSlideshows() {
      [].concat(toConsumableArray(this.imageBrowsers)).forEach(function (browser) {
        var mainSliderContainer = $(browser).find('.images__main');
        var smallSliderContainer = $(browser).find('.images__small');

        var mainSlider = new Swiper(mainSliderContainer, {
          speed: 800,
          spaceBetween: 0,
          noSwipingClass: 'images__main__slide',
          slidesPerView: 1,
          breakpoints: {
            992: {
              noSwipingClass: 'something-else'
            }
          }
        });

        var smallSlider = new Swiper(smallSliderContainer, {
          speed: 800,
          autoplay: false,
          autoplayDisableOnInteraction: false,
          spaceBetween: 5,
          centeredSlides: true,
          noSwiping: 'images__small__slide',
          slidesPerView: 3,
          slideToClickedSlide: true
        });

        mainSlider.params.control = smallSlider;
        smallSlider.params.control = mainSlider;
      });
    }
  }]);
  return InProgress;
}();

/* eslint-enable no-unused-vars */

var Portfolio = function () {
  function Portfolio() {
    var _this = this;

    classCallCheck(this, Portfolio);

    this.initDom();

    $(document).ready(function () {
      _this.project.on('click', _this.goToProject);

      _this.scrollBtns.on('click', _this.scrollPortfolio);

      _this.projectsListWrap.scroll(function () {
        if (parseInt(this.projectsListWrap.scrollLeft()) < 50) {
          TweenLite.set(this.leftBtn, { opacity: 0 });
        } else {
          TweenLite.set(this.leftBtn, { opacity: 1 });
        }

        this.innerWidth = $(window).width();
        var threshold = this.projectsListWrap[0].scrollWidth - 50;

        var rightPos = this.innerWidth + parseInt(this.projectsListWrap.scrollLeft()) + 50;

        if (rightPos > threshold) {
          TweenLite.set(this.rightBtn, { opacity: 0 });
        } else {
          TweenLite.set(this.rightBtn, { opacity: 1 });
        }
      });
    });
  }

  createClass(Portfolio, [{
    key: 'initDom',
    value: function initDom() {
      this.projectsListWrap = $('.projects-list-wrap');
      this.projectsList = $('ul#projects');
      this.project = $('#projects .project');

      this.scrollBtns = $('.scroll-buttons');
      this.leftBtn = $('#left');
      this.rightBtn = $('#right');
    }
  }, {
    key: 'scrollPortfolio',
    value: function scrollPortfolio(e) {
      var dir = $(e.currentTarget).attr('id');
      var dirSign = dir === 'left' ? '-' : '+';
      this.projectsListWrap.animate({ scrollLeft: dirSign + '=800px' }, 400);
    }
  }, {
    key: 'goToProject',
    value: function goToProject(e) {
      var project = $(e.currentTarget).attr('data-project');

      window.UI.hidePage();

      setTimeout(function () {
        window.location.href = '/portfolio/' + project;
      }, 700);
    }
  }]);
  return Portfolio;
}();

var Project = function () {
  function Project() {
    classCallCheck(this, Project);

    this.initDom();

    this.slideShowInitThrottle = false;
    this.slideshowBtnThrottle = false;

    var self = this;

    $(document).ready(function () {
      self.slideshowButton.hover(function () {
        TweenLite.to(self.slideshowButtonButton, 0.4, { scaleX: 1.1, ease: Back.easeOut.config(1.7) });
      }, function () {
        TweenLite.to(self.slideshowButtonButton, 0.4, { scaleX: 1 });
      });

      self.close.hover(function () {
        TweenLite.to(self.close, 0.4, { rotation: 180, ease: Back.easeOut.config(1.7) });
      }, function () {
        TweenLite.to(self.close, 0.4, { rotation: 0 });
      });

      self.imageGrid.append(self.createRows());

      self.slideshowButton.on('click', self.showSlideshow.bind(self));

      self.close.on('click', function (e) {
        var boundHideSlideshow = self.hideSlideshow.bind(self);
        if (self.isMobile) {
          window.UI.affectCloseButtonUI(boundHideSlideshow, e);
        } else {
          boundHideSlideshow();
        }
      });
    });
  }

  createClass(Project, [{
    key: 'showSlideshow',
    value: function showSlideshow() {
      if (this.slideshowBtnThrottle) return;

      this.slideshowBtnThrottle = true;

      this.slideshow.addClass('show');

      TweenLite.to(this.slideshow, 1, { opacity: 1 }).delay(0.1);

      if (this.slideShowInitThrottle) return;

      this.slideShowInitThrottle = true;

      if (this.isMobile) {
        TweenLite.set(this.close, { rotation: 180 });
        this.swiper = new Swiper(this.slideshow, {
          spaceBetween: 0,
          loop: true,
          autoplay: 5000,
          speed: 600,
          autoplayDisableOnInteraction: false,
          observer: true
        });
      } else {
        this.swiper = new Swiper(this.slideshow, {
          spaceBetween: 30,
          effect: 'fade',
          loop: true,
          autoplay: 5000,
          nextButton: this.right,
          prevButton: this.left,
          speed: 600,
          autoplayDisableOnInteraction: false,
          observer: true
        });
      }
    }
  }, {
    key: 'hideSlideshow',
    value: function hideSlideshow() {
      var self = this;
      this.slideshowBtnThrottle = false;

      TweenLite.to(this.slideshow, 0.7, { opacity: 0 });

      setTimeout(function () {
        self.slideshow.removeClass('show');
      }, 800);
    }
  }, {
    key: 'initDom',
    value: function initDom() {
      this.html = $('html');

      this.isMobile = this.html.hasClass('mobile');

      this.imageGrid = $('#project-image-grid');

      this.slideshow = $('.swiper-container');

      this.left = $('#left-arrow');
      this.right = $('#right-arrow');

      this.close = $('#slideshow-close-button');

      this.slideshowButton = $('#view-slideshow');
      this.slideshowButtonButton = this.slideshowButton.children('button');
    }
  }, {
    key: 'whichImage',
    value: function whichImage() {
      var img = 'normal';

      var dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI || 1;

      if (dpr > 1) img = 'retina';

      if (window._Agent === 'mobile') img = 'mobile';

      return img;
    }
  }, {
    key: 'createRows',
    value: function createRows() {
      var _Photos = window._Photos;

      var i = 0;

      var rows = '';

      while (i < _Photos.length) {
        var gandalf = Math.random() * 10;

        if (_Photos[i].orientation === 'landscape' && _Photos[i + 1] !== undefined && _Photos[i + 1].orientation === 'landscape') {
          if (_Photos[i + 3] === undefined && _Photos[i + 2] !== undefined && _Photos[i + 2].orientation === 'portrait') {
            // 2- 70/30 lscp/port - i+=2
            rows = rows + ('\n            <div class="project-image-row lfw"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i++;
            continue;
          }

          if (gandalf > 6) {
            // 1- Full width lscp - i++
            rows = rows + ('\n            <div class="project-image-row lfw"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i++;
            continue;
          } else {
            // 2- 50/50 lscp - i+=2
            rows = rows + ('\n            <div class="project-image-row ll"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i += 2;
            continue;
          }
        } else if (_Photos[i].orientation === 'landscape' && _Photos[i + 1] !== undefined && _Photos[i + 1].orientation === 'portrait') {
          if (_Photos[i + 2] === undefined) {
            // 2- 70/30 lscp/port - i+=2
            rows = rows + ('\n            <div class="project-image-row lp"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i += 2;

            continue;
          }

          if (gandalf > 6) {
            // 1- Full width lscp - i++
            rows = rows + ('\n            <div class="project-image-row lfw"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i++;
            continue;
          } else {
            // 2- 70/30 lscp/port - i+=2
            rows = rows + ('\n            <div class="project-image-row lp"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i += 2;

            continue;
          }
        } else if (_Photos[i].orientation === 'portrait' && _Photos[i + 1] !== undefined && _Photos[i + 1].orientation === 'landscape') {
          // 1- 70/30 lscp/port - i+=2

          rows = rows + ('\n          <div class="project-image-row pl"><!--\n\n            --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n            --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n\n          --></div>\n        ');

          i += 2;

          continue;
        } else if (_Photos[i].orientation === 'portrait' && _Photos[i + 1] !== undefined && _Photos[i + 1].orientation === 'portrait') {
          if (_Photos[i + 2] !== undefined && _Photos[i + 2].orientation === 'portrait' && gandalf > 8) {
            // 1- 33/33/33 port - i+=3

            rows = rows + ('\n            <div class="project-image-row ppp"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 2][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');
            i += 3;
            continue;
          } else {
            // 2- 50/50 port - i+=2
            rows = rows + ('\n            <div class="project-image-row pp"><!--\n\n              --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n              --><img data-src="' + _Photos[i + 1][this.whichImage()] + '" class="lazyload"><!--\n\n            --></div>\n          ');

            i += 2;

            continue;
          }
        } else if (_Photos[i].orientation === 'landscape' && _Photos[i + 1] === undefined) {
          // 1- Full width lscp - return
          rows = rows + ('\n          <div class="project-image-row lfw"><!--\n\n            --><img data-src="' + _Photos[i][this.whichImage()] + '" class="lazyload"><!--\n\n          --></div>\n        ');
          i++;
          continue;
        } else if (_Photos[i].orientation === 'portrait' && _Photos[i + 1] === undefined) {
          // 1- Widow :/ - return

          rows = rows + '\n          <div class="project-image-row p"><!--\n\n            --><img data-src="#{_Photos[i][this.whichImage()]}" class="lazyload"><!--\n\n          --></div>\n        ';
          i++;
          continue;
        } else if (_Photos[i] === undefined) {
          continue;
        } else {
          break;
        }
      }
      return rows;
    }
  }]);
  return Project;
}();

/* eslint-enable no-unused-vars */

var Who$1 = function () {
  function Who() {
    var _this = this;

    classCallCheck(this, Who);

    this.initDom();

    this.numbersTimeout = null;

    if (this.isMobile) {
      this.employees.on('click', this.showEmployee);
      this.close.on('click', this.hideEmployee);
    }

    this.sendCV.on('click', function (e) {
      window.UI.affectButtonUI(_this.doSendCV, e);
    });

    if (this.NumbersSection && this.Numbers) {
      this.NumbersTimeout = setInterval(this.checkScrollTop(), 100);
    }
  }

  createClass(Who, [{
    key: 'initDom',
    value: function initDom() {
      this.html = $('html');
      this.isMobile = this.html.hasClass('mobile');
      this.teamElement = $('body.page-template-template-team');

      this.sendCV = $('#send-cv');

      this.employees = $('#employees-list .employee');

      // Mobile modal stuff
      this.mobilePanel = $('#mobile-more');
      this.close = $('#emp-close-button');
      this.image = this.mobilePanel.find('.image');
      this.name = this.mobilePanel.find('h1.name');
      this.copy = this.mobilePanel.find('p.copy');
      this.linkedin = this.mobilePanel.find('a.employee-linkedin');
      this.email = this.mobilePanel.find('a.employee-email');

      // Counting Numbers!!
      this.NumbersSection = $('#company-numbers');
      this.Numbers = this.NumbersSection.find('.company-numbers__number');
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      if (this.teamElement) {
        if (Mobile.isMobile()) {
          this.employees.on('click', this.showEmployee);
        }
      }
    }
  }, {
    key: 'showEmployee',
    value: function showEmployee(e) {
      var p = this.getPersonData($(e.currentTarget).attr, 'data-id');

      var img = $(e.currentTarget).attr('data-image');

      this.image.css('background-image', 'url(\'' + img + '\')');

      var nameHtml = '\n      ' + p.first_name + ' ' + p.last_name + '\n      <br/>\n      <em class=\'position\'>' + p.position + '</em>\n    ';
      this.name.html(nameHtml);

      this.copy.html(p.copy);

      var emailz = encodeURI(p.email);

      var subject = encodeURI('Enquiry for #{p.first_name}');

      this.email.attr('href', 'mailto:' + emailz + '?subject=' + subject);

      if (p.linkedin.length > 0) {
        this.linkedin.removeClass('hide');
        this.linkedin.attr('href', p.linkedin);
      } else {
        this.linkedin.addClass('hide');
      }

      TweenLite.set(this.mobilePanel, { display: 'block' });
      TweenLite.to(this.mobilePanel, 1, { x: '0%', ease: Bounce.easeOut }).delay(0.1);
      TweenLite.set(this.close, { rotation: 180 });
    }
  }, {
    key: 'hideEmployee',
    value: function hideEmployee(e) {
      var _this2 = this;

      TweenLite.to(this.close, 0.6, { rotation: 0, ease: Elastic.easeOut });

      setTimeout(function () {
        TweenLite.to(_this2.mobilePanel, 0.6, { x: '100%' }).delay(0.1);
        setTimeout(function () {
          TweenLite.set(_this2.mobilePanel, { display: 'none' });
        }, 700);
      }, 600);
    }
  }, {
    key: 'getPersonData',
    value: function getPersonData(id) {
      window._Employees.forEach(function (e) {
        if (e.id === parseInt(id)) {
          return e;
        }
      });
    }
  }, {
    key: 'doSendCV',
    value: function doSendCV() {
      window.location.href = 'mailto:enquiries@laughlandjones.co.uk?subject=Enquiry: CV Attached';
    }
  }, {
    key: 'checkScrollTop',
    value: function checkScrollTop() {
      var top = window.scrollY;
      var pageHeight = window.innerHeight;
      var bottom = top + pageHeight;
      var horizon = this.Numbers.first().offset().top + 200;
      if (bottom > horizon) {
        clearInterval(this.NumbersTimeout);
        this.animateNumbers();
      }
    }
  }, {
    key: 'animateNumbers',
    value: function animateNumbers() {
      var _this3 = this;

      var suffix;
      [].concat(toConsumableArray(this.Numbers)).forEach(function (number) {
        var numDom = $(number);
        var total = numDom.attr('data-total');
        if (numDom.attr('data-suffix')) {
          suffix = ' ' + numDom.attr('data-suffix');
        } else {
          suffix = '';
        }

        _this3.doNumberCount(numDom, total, suffix);
      });
    }
  }, {
    key: 'doNumberCount',
    value: function doNumberCount(numDom, total, suffix) {
      var numObj = { num: 0 };

      TweenLite.to(numObj, 4, { num: total,
        ease: Expo.easeInOut,
        onUpdate: function onUpdate() {
          numDom.html(Math.floor(numObj.num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix);
        }
      });
    }
  }]);
  return Who;
}();

/* eslint-enable no-unused-vars */

var App = function () {
  function App() {
    classCallCheck(this, App);

    window.UI = new UI();
    window.Modal = new Modal();

    // Instantiate correct page JS
    if ($('body.home').length) {
      this.Home = new Home();
    }
    if ($('#approach').length) {
      this.Approach = new Approach();
    }
    if ($('#contact').length) {
      this.Contact = new Contact();
    }
    if ($('#in-progress').length) {
      this.inProgress = new InProgress();
    }
    if ($('#portfolio').length) {
      this.portfolio = new Portfolio();
    }
    if ($('#project').length) {
      this.project = new Project();
    }
    if ($('#who').length) {
      this.team = new Who$1();
    }

    this.Subscribe = new Subscribe();

    Mobile.addClass();
    this.addListeners();
  }

  createClass(App, [{
    key: 'addListeners',
    value: function addListeners() {
      $('#menu-button').on('click', this.toggleMenu);
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      var $menu = $('#menu-container');
      var $menuButton = $('#menu-button');
      var menuSpeed = 0.6;
      if ($menu.hasClass('open')) {
        $menu.removeClass('open');
        $menuButton.removeClass('active');
        TweenLite.to($menu, menuSpeed, { y: 0 });
      } else {
        var dist = $menu.height();

        $menu.addClass('open');
        TweenLite.to($menu, menuSpeed, { y: -dist });
        $menuButton.addClass('active');
      }
    }
  }]);
  return App;
}();

$(document).ready(function () {
  (function () {
    return new App();
  })();
});

}(jQuery));