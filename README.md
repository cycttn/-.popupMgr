-.popupMgr
==========

jQuery plugin to manage 'popups'.

See http://js.lovelotte.net/jQ/popup for details and demos. 


Changelog
=========

v0.2.2 - showOn and clearInvoke
--------------------------------
- (show on) Allows for showing beside or above/below the object.
- Added function clearInvoked, which removes the data concerning which object invoked the popup.
- Fixed options in $.popupMgr.show so that it extends from default.
- Added e.stopPropagation() to show/hide events.

v0.2.1
------
Added function invoked(); 

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
