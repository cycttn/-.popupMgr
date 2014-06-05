-.popupMgr
==========

jQuery plugin to manage 'popups'.

See http://js.lovelotte.net/jQ/popup for details and demos. 


Changelog
=========

v.0.2.0
-------
Allow popup elements to have attached events. We can do this by: 

```javascript
var $c = ... ; //jQuery element
$('invoker').popupMgr( $c , options ); 
$c.on( 'someEvent', function(){ ... }); 
```

v.0.1.2
-------
Initial Release
