// Taggy 0.1.1

(function() {

  var Taggy = function(params){

      var selector = document.querySelectorAll(params);

      this.length = selector.length;
      this.version = '0.0.5';

      for(var i = 0; i < this.length; i++){
        this[i] = selector[i];
        var divId = _taggy.generateId('taggy-container');
        var div = document.createElement('div');
        this[i].divId = divId;
        div.setAttribute('id', divId);
        div.setAttribute('class', 'taggy-container');
        var styles = 'max-width: ' + this[i].naturalWidth + 'px';
        styles += ';max-height:' + this[i].naturalHeight + 'px;';
        div.setAttribute('style', styles);
        this[i].parentNode.insertBefore(div, this[i].nextSibling);
        this[i].setAttribute('class', 'taggy-img');
        div.appendChild(this[i]);
      }

      return this;
  };

  var _taggy = function(params){
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

    setCoords: function(data, cb){
      if(!data) return this;
      var isArray = Object.prototype.toString.call(data) === '[object Array]';
      if(!isArray && typeof data !== 'object') return this;
      if(!isArray) data = [data];
      var len = this.length;
      while(len--){
        var div = document.getElementById(this[len].divId);
        data.forEach(function(coords){
          var span = document.createElement('span');
          span.setAttribute('class', 'taggy-coord');
          var styles = 'left: ' + coords.x + '%;top: ' + coords.y + '%;';
          span.setAttribute('style', styles);
          if(typeof coords.options === 'object'){
            span = __parseOptions(span, coords, div, cb);
          }
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

  var __parseOptions = function(span, coords, div, cb){
    var options = coords.options;
    if(options.id) span.setAttribute('id', options.id);
    if(options.class) span.className += ' ' + options.class;
    var type = options.type === 'set-drop' ? 'set-drop' : 'set' ? 'set' : 'get';
    span.dataset.id = _taggy.generateId('tag');
    if(type === 'set'){
      if(typeof cb !== 'function') cb = function(){};
      span.addEventListener('click', function(event){
        __resetCoordsTexts(div);
        span.className += ' taggy-input iluminate';
        if(typeof options.modal === 'object' || options.modal === true){
          span.className += ' modal';
          var acceptBtn, cancelBtn, hideCancelBtn;
          if(typeof options.modal === 'object'){
            acceptBtn = options.modal.acceptBtn;
            hideCancelBtn = options.modal.hideCancelBtn;
            cancelBtn = options.modal.cancelBtn;
          }
          var acceptBtnHtml = '<a class="button accept"' + (hideCancelBtn ? 'style="width: 100%;"' : '') + '>';
          if(options.modal != 'object' && options.modal === true){
            var modal = [
              '<div class="confirm-box"><div class="confirm-dialog"><div class="confirm-content">',
              '<div class="confirm-title taggy-sm">', options.title || '', '<div class="close">X</div>' , '</div>',
              '<div class="confirm-text">', options.text || '', '</div>',
              '<div class="confirm-buttons">',
                '</div>', '</div></div></div>', '<div class="confirm-modal"></div>'
            ].join('');
          }else{
            var modal = [
              '<div class="confirm-box"><div class="confirm-dialog"><div class="confirm-content">',
              '<div class="confirm-title taggy-sm">', options.text || '', '</div>',
              '<input type="text" class="taggy-input">',
              '<div class="confirm-buttons">',
              acceptBtnHtml, acceptBtn || 'Accept', '</a>',
              hideCancelBtn ? '' : '<a class="button cancel">' + (cancelBtn || 'Cancel') + '</a>',
              '</div>', '</div></div></div>', '<div class="confirm-modal"></div>'
            ].join('');
          }
          span.innerHTML = modal;
          var input = span.querySelectorAll('input[type="text"].taggy-input')[0];
          input.addEventListener('click', function(event){
            event.stopPropagation();
          });
          var acceptBtn = span.querySelectorAll('a.button.accept')[0];
          acceptBtn.addEventListener('click', function(event){
            event.stopPropagation();
            cb(input.value || null, coords);
            __resetCoordsTexts(div);
          });
          if(hideCancelBtn) return;
          var cancelBtn = span.querySelectorAll('a.button.cancel')[0];
          cancelBtn.addEventListener('click', function(event){
            span.classList.remove('iluminate');
            event.stopPropagation();
            __resetCoordsTexts(div);
          });
        }
      });
    }else{
      if(type === 'set-drop'){
        if(typeof cb !== 'function') cb = function(){};
        span.addEventListener('click', function(event){
          __resetCoordsTexts(div);
          span.className += ' taggy-input iluminate';
          if(typeof options.modal === 'object' || options.modal === true){
            var acceptBtn, cancelBtn, hideCancelBtn, optionSelect;
            if(typeof options.modal === 'object'){
              acceptBtn = options.modal.acceptBtn;
              hideCancelBtn = options.modal.hideCancelBtn;
              cancelBtn = options.modal.cancelBtn;
              optionSelect = options.modal.optionSelect;
            }
            var acceptBtnHtml = '<a class="button accept"' + (hideCancelBtn ? 'style="width: 100%;"' : '') + '>';
            var modal = [
              '<div class="confirm-box"><div class="confirm-dialog"><div class="confirm-content">',
              '<div class="confirm-title taggy-sm">', options.text || '', '</div>',
              '<div id="optionSelector"></div>',
              '<div class="confirm-buttons">',
              acceptBtnHtml, acceptBtn || 'Accept', '</a>',
              hideCancelBtn ? '' : '<a class="button cancel">' + (cancelBtn || 'Cancel') + '</a>',
              '</div>', '</div></div></div>', '<div class="confirm-modal"></div>'
            ].join('');
            span.innerHTML = modal;
            var ul = document.createElement('ul');
            ul.setAttribute('id','optList');
            var t, tt;
            document.getElementById('optionSelector').appendChild(ul);
            optionSelect.forEach(renderOptionsList);
            function renderOptionsList(element, index, arr){
                var li = document.createElement('li');
                var opt = document.createElement('input');
                opt.value = element;
                opt.id = element;
                li.setAttribute('class','item');
                opt.setAttribute('type', 'radio');
                ul.appendChild(li);
                li.append(opt);
                t = document.createTextNode(element);
                li.innerHTML=li.innerHTML + element;
                li.addEventListener('click', function(event){
                  event.stopPropagation();
                  document.querySelector('input[id=' + element + ']').setAttribute('checked', '');
                  var checkbox = document.querySelector('input[id=' + element + ']').hasAttribute('checked');
                  if(checkbox) return optionSelected = document.getElementById(element).value;
                });
            };


            var acceptBtn = span.querySelectorAll('a.button.accept')[0];
            acceptBtn.addEventListener('click', function(event){
              span.classList.remove('iluminate');
              event.stopPropagation();
              cb(optionSelected || null, coords);
              __resetCoordsTexts(div);
            });
            if(hideCancelBtn) return;
            var cancelBtn = span.querySelectorAll('a.button.cancel')[0];
            cancelBtn.addEventListener('click', function(event){
              span.classList.remove('iluminate');
              event.stopPropagation();
              __resetCoordsTexts(div);
            });
          }
        });
  }
}
    return span;
  };

  var __resetCoordsTexts = function(div, removeModal){
    var coordsSpans = div.querySelectorAll('span.taggy-coord');
    for(var i = 0; i < coordsSpans.length; i++){
      coordsSpans[i].innerHTML = '';
      coordsSpans[i].className = coordsSpans[i].className.replace(/\btext\b/, '');
      coordsSpans[i].className = coordsSpans[i].className.replace(/\bmodal\b/, '');
    }
  };

  if(!window.Taggy) window.Taggy = _taggy;

})();
