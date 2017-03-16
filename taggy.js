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
      __cb = cb;
      var len = this.length;
      while (len--) {
        this[len].addEventListener('click', __taggyListener);
      }
      return this;
    },

    removeListener: function(){
      var len = this.length;
      while (len--) {
        this[len].removeEventListener('click', __taggyListener);
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
    },

    stopTagsListeners: function(){
      __tagListeners = false;
      return this;
    },

    restartTagsListeners: function(){
      __tagListeners = true;
      return this;
    },

    removeTag: function(tag){
      var len = this.length;
      while(len--){
        var div = document.getElementById(this[len].divId);
        div.removeChild(tag);
      }
    },

    removeAll: function(){
      var len = this.length;
      while(len--){
        var div = document.getElementById(this[len].divId);
        var spans = div.getElementsByClassName('taggy-coord');
        var length = spans.length;
        while(spans[0]){
          spans[0].parentNode.removeChild(spans[0]);
        }
        var modals = div.getElementsByClassName('taggy-modal');
        length = modals.length;
        while(modals[0]){
          modals[0].parentNode.removeChild(modals[0]);
        }
      }
      return this;
    }

  };

  var __cb = function(){};

  var __tagListeners = true;

  var __taggyListener = function(event){
    var coords = __getCoords.call(this, event);
    return __cb(coords);
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
    var type = options.type;
    if(type !== 'get-drop' && type !== 'set') type = 'get';
    span.dataset.id = _taggy.generateId('tag');
    if(type === 'set'){
      if(typeof cb !== 'function') cb = function(){};
      span.addEventListener('click', function(event){
        if(!__tagListeners) return;
        __tagListeners = false;
        __resetCoordsTexts(div);
        span.className += ' taggy-input iluminate';
        if(typeof options.modal === 'object' || options.modal === true){
          span.className += ' taggy-modal';
          var acceptBtn, cancelBtn, hideCancelBtn;
          var showTextarea = !!options.modal.textarea;
          if(typeof options.modal === 'object'){
            acceptBtn = options.modal.acceptBtn;
            hideCancelBtn = options.modal.hideCancelBtn;
            cancelBtn = options.modal.cancelBtn;
          }
          var acceptBtnHtml = '<a class="button accept"' + (hideCancelBtn ? 'style="width: 100%;"' : '') + '>';
          var modal = [
            '<div class="confirm-box"><div class="confirm-dialog"><div class="confirm-content">',
            '<div class="confirm-title taggy-sm">', options.title || '', '</div>',
            '<input type="text" class="taggy-input"',
            options.text ? ' value="' + options.text + '"' : '', '>',
            showTextarea ? '<textarea class="taggy-textarea">' + (options.description || '') + '</textarea>' : '',
            '<div class="confirm-buttons">',
            acceptBtnHtml, acceptBtn || 'Accept', '</a>',
            hideCancelBtn ? '' : '<a class="button cancel">' + (cancelBtn || 'Cancel') + '</a>',
            '</div>', '</div></div></div>', '<div class="confirm-modal"></div>'
          ].join('');
          span.innerHTML = modal;
          var input = span.querySelectorAll('input[type="text"].taggy-input')[0];
          input.addEventListener('click', function(event){
            event.stopPropagation();
          });
          var textarea = span.querySelectorAll('textarea.taggy-textarea')[0];
          if(textarea){
            textarea.addEventListener('click', function(event){
              event.stopPropagation();
            });
          }
          var acceptBtn = span.querySelectorAll('a.button.accept')[0];
          acceptBtn.addEventListener('click', function(event){
            event.stopPropagation();
            __tagListeners = true;
            var description = null;
            if(textarea){
              description = textarea.value;
              cb(input.value || null, description, coords);
            }else{
              cb(input.value || null, coords);
            }
            __resetCoordsTexts(div);
          });
          if(hideCancelBtn) return;
          var cancelBtn = span.querySelectorAll('a.button.cancel')[0];
          cancelBtn.addEventListener('click', function(event){
            span.classList.remove('iluminate');
            __tagListeners = true;
            event.stopPropagation();
            __resetCoordsTexts(div);
          });
        }
      });
    }else if(type === 'get-drop'){
      if(typeof cb !== 'function') cb = function(){};
      span.addEventListener('click', function(event){
        if(!__tagListeners) return;
        __resetCoordsTexts(div);
        span.className += ' taggy-input iluminate';
        if(typeof options.modal === 'object' || options.modal === true){
          var acceptBtn, cancelBtn, hideCancelBtn, list;
          if(typeof options.modal === 'object'){
            acceptBtn = options.modal.acceptBtn;
            hideCancelBtn = options.modal.hideCancelBtn;
            cancelBtn = options.modal.cancelBtn;
          }
          list = options.list || [];
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
          var radioInput, optionSelected;
          document.getElementById('optionSelector').appendChild(ul);
          list.forEach(renderOptionsList);
          function renderOptionsList(element, index, arr){
            var li = document.createElement('li');
            var opt = document.createElement('input');
            opt.value = element;
            li.setAttribute('class','item');
            opt.setAttribute('type', 'radio');
            opt.setAttribute('name', 'taggy-radio');
            ul.appendChild(li);
            li.append(opt);
            radioInput = document.createTextNode(element);
            li.innerHTML = li.innerHTML + element;
            li.addEventListener('click', function(event){
              event.stopPropagation();
              optionSelected = event.currentTarget.getElementsByTagName('input')[0].value;
            });
          };

          var acceptBtn = span.querySelectorAll('a.button.accept')[0];
          acceptBtn.addEventListener('click', function(event){
            span.classList.remove('iluminate');
            event.stopPropagation();
            cb(optionSelected, coords);
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
    }else if(type === 'get'){
      if(typeof options.text !== 'string') return span;
      span.addEventListener('click', function(event){
        if(!__tagListeners) return;
        __tagListeners = false;
        __resetCoordsTexts(div);
        span.innerHTML = options.text;
        span.className += ' text iluminate';
        if(typeof options.modal === 'object' || options.modal === true){
          span.className += ' modal-taggy';
          var acceptBtn, showTextarea;
          if(typeof options.modal === 'object') acceptBtn = options.modal.acceptBtn;
          showTextarea = !!options.description;
          var modal = [
            '<div class="confirm-box"><div class="confirm-dialog"><div class="confirm-content">',
            '<div class="taggy-get">',
            '<div class="taggy-text">', options.text || '', '</div>',
            '<div class="taggy-description">', options.description || '', '</div>',
            '</div>',
            '<div class="confirm-buttons">',
            '<a class="button accept" style="width: 100%;">', acceptBtn || 'Accept', '</a>',
            '</div>', '</div></div></div>', '<div class="confirm-modal"></div>'
          ].join('');
          span.innerHTML = modal;
          var acceptBtn = span.querySelectorAll('a.button.accept')[0];
          acceptBtn.addEventListener('click', function(event){
            __tagListeners = true;
            span.classList.remove('iluminate');
            event.stopPropagation();
            __resetCoordsTexts(div);
          });
        }
      });
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

