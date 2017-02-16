# taggy

```javascript

// Basic example

$img = Taggy('img');

var _saveCoords = function(coords){
  $img.setCoords(coords);
};

$img.getCoords(_saveCoords);
```
```javascript

// Advanced example



$img = Taggy('img');

var _coords = [
  {
    x: 36.267100977198698,
    y: 12.074626865671641,
    options: {
      id   : 'test', // default none
      class: 'foo there', // default none
      type : 'set', // get || set - get: Show the value (default) / set: Input to write the value
      text : 'the input title', // default none, show something as a input label
      modal: {
        acceptBtn: 'Aceptar', // default Accept
        cancelBtn: 'Cancelar', // default Cancel
        hideCancelBtn: false // default false
      } // default true
    }
  },
  {
    x: 49.75,
    y: 35.44857768052516,
    options: {
      id   : 'test',
      class: 'foo',
      type : 'set-drop',
      text : 'the dropdown title',
      modal: {
        acceptBtn: 'Aceptar', // default Accept
        cancelBtn: 'Cancelar', // default Cancel
        hideCancelBtn: false, // default false
        optionSelect: ['muscle', 'head', 'heart']
      } // default true
    }
  },
  {
    x: 41.20521172638436,
    y: 30.597014925373134,
    options: {
      id   : 'test',
      class: 'foo'
    }
  },
  {x: 58.469055374592834, y: 30.597014925373134,
    options: {
      title: 'Hey title!',
      text: '<h3>Hey there!</h3><p>The deltoid muscle is a rounded, triangular muscle located on the uppermost part of the arm and the top of the shoulder. It is named after the Greek letter delta, which is shaped like an equilateral triangle. The deltoid is attached by tendons to the skeleton at the clavicle (collarbone), scapula (shoulder blade), and humerus (upper arm bone).</p>',
      modal: true
    }
  },
  {x: 72.63843648208469, y: 50.74626865671642},
  {x: 82.41042345276873, y: 52.61194029850746},
  {x: 94.29967426710098, y: 52.23880597014925},
  {x: 9.609120521172638, y: 26.119402985074625},
  {x: 7.817589576547231, y: 13.059701492537313}
];

var _saveCoords = function(coords){
  $img.setCoords(coords);
};

$img.getCoords(_saveCoords);

// set type data can accept a callback to store the answer, @params: value, coord
$img.setCoords(_coords, console.log);

```
