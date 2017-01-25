# taggy
Tag images

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
    x: 24.267100977198698,
    y: 10.074626865671641,
    options: {
      id   : 'test', // default none
      class: 'foo there', // default none
      type : 'get', // get || set - get: Show the value (default) / set: Input to write the value
      text : 'head' // default none
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
  {x: 58.469055374592834, y: 30.597014925373134, options: {text: 'foo!'}},
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

$img.setCoords(_coords);

```
