// Taggy 0.0.3

(function() {

  var Taggy = function(params) {

      var selector = document.querySelectorAll(params);

      this.length = selector.length;
      this.version = '0.0.3';

      for(var i = 0; i < this.length; i++) {
        this[i] = selector[i];
        var divId = _taggy.generateId('taggy-container');
        div = document.createElement('div');
        this[i].divId = divId;
        div.setAttribute('id', divId);
        var styles = 'position: relative;';
        styles += 'max-width: ' + this[i].naturalWidth + 'px';
        styles += ';max-height:' + this[i].naturalHeight + 'px;';
        div.setAttribute('style', styles);
        this[i].parentNode.insertBefore(div, this[i].nextSibling);
        this[i].setAttribute('style', 'max-width: 100%');
        div.appendChild(this[i]);
      }

      return this;
  };

  var _taggy = function (params) {
    return new Taggy(params);
  };

  _taggy.counter = 0;

  _taggy.generateId = function(prefix){
    return prefix + '-' + this.counter++;
  };

  _taggy.fn = Taggy.prototype = {

    getCoords: function(cb){
      if(typeof cb !== 'function') return;
      var len = this.length;
      while (len--) {
        this[len].addEventListener('click', function(event){
          var coords = __getCoords.call(this, event);
          return cb(coords);
        });
      }
      return this;
    },

    setCoords: function(data){
      if(!data) return;
      var isArray = Object.prototype.toString.call(data) === '[object Array]';
      if(!isArray && typeof data !== 'object') return;
      if(!isArray) data = [data];
      var len = this.length;
      while(len--){
        var div = document.getElementById(this[len].divId);
        data.forEach(function(coords){
          var span = document.createElement('span');
          span.setAttribute('class', 'taggy-coord');
          var styles = 'left: ' + coords.x + '%;top: ' + coords.y + '%;';
          span.setAttribute('style', styles);
          if(typeof coords.options === 'object') span = __parseOptions(span, coords, div);
          div.appendChild(span);
        });
      }
      return this;
    }

  };

  var __getCoords = function(event){
    var absoluteX = event.offsetX - this.offsetLeft;
    var absoluteY = event.offsetY - this.offsetTop;
    var relativeX = (absoluteX * 100) / this.offsetWidth;
    var relativeY = (absoluteY * 100) / this.offsetHeight;
    return {x: relativeX, y: relativeY};
  };

  var __parseOptions = function(span, coords, div){
    var options = coords.options;
    if(options.id) span.setAttribute('id', options.id);
    if(options.class) span.className += ' ' + options.class;
    if(typeof options.text === 'string'){
      var type = options.type === 'get' ? 'get' : 'set';
      span.dataset.id = _taggy.generateId('tag');
      if(type === 'set'){
        // TODO: Return an input and check if the val is correct
      }else{
        // TODO: Show an audio or a image? Maybe this should be a plugin (.fn)
        span.addEventListener('click', function(event){
          span.innerHTML = options.text;
          span.style['margin-top'] = '-30px';
          span.style['margin-left'] = '-20px';
          span.style.background = 'none';
        });
      }
    }
    return span;
  };

  if(!window.Taggy) window.Taggy = _taggy;

})();
