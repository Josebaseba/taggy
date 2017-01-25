// Taggy 0.0.1

(function() {

  var Taggy = function(params) {

      var selector = document.querySelectorAll(params);

      this.length = selector.length;
      this.version = '0.0.1';

      for(var i = 0; i < this.length; i++) {
        this[i] = selector[i];
        var divId = _taggy.generateId();
        div = document.createElement('div');
        this[i].divId = divId;
        div.setAttribute('id', divId);
        var styles = 'position: relative;';
        styles += 'max-width: ' + this[i].naturalWidth + 'px';
        styles += ';max-height:' + this[i].naturalHeight + 'px;';
        div.setAttribute('style', styles);
        this[i].parentNode.insertBefore(div, this[i].nextSibling);
        div.appendChild(this[i]);
      }

      return this;
  };

  var _taggy = function (params) {
    return new Taggy(params);
  };

  _taggy.counter = 0;

  _taggy.generateId = function(){
    return 'taggy-id-' + this.counter++;
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
          if(coords.id) span.setAttribute('id', coords.id);
          var styles = 'left: ' + coords.x + '%;top: ' + coords.y + '%;';
          span.setAttribute('style', styles);
          div.appendChild(span);
        });
      }
      return this;
    }

  };

  var __getCoords = function(event){
    console.log(this, event);
    console.log(this.naturalWidth, this.naturalHeight);
    var absoluteX = event.offsetX - this.offsetLeft;
    var absoluteY = event.offsetY - this.offsetTop;
    var relativeX = (absoluteX * 100) / this.offsetWidth;
    var relativeY = (absoluteY * 100) / this.offsetHeight;
    return {x: relativeX, y: relativeY};
  };

  if(!window.Taggy) window.Taggy = _taggy;

})();
