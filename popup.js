/* The MIT License */


(function($){
    
    var defaults = {
        name: 'main',
        class: '',
        on: 'mouse',
        off: 'mouse',
        delay: 0,
        animate: false,
        offy: 3,
        static: false,
        currClicked: false
    };
    
    var data_key = "popup-id",
        opts = {}, c=1, currClass='', invoked=null,
        $div = $('<div />').addClass('popup hidden'), $ctxt = {};
    
    function create(){ return $div.clone().appendTo('body'); }
    function getOpts(){ return opts[parseInt( $(this).attr(data_key) )]; }
    
    $.popup = {
        create: function(name){
            if( $ctxt[name] ) throw "Popup: popup by name \"" + name +  "\" already exists!";
            $ctxt[name] = create(); 
        },
        update: function(name, inner){
            if( !$ctxt[name] ) throw "Popup: popup by name \"" + name + "\" doesn't exist!";
            $ctxt[name].html(inner);
        },
        _changeClass: function(cls, name){
            if( currClass != '' ) $ctxt[name].removeClass(currClass);
            currClass = (cls || '').trim(); 
            if( currClass != '' ) $ctxt[name].addClass(currClass);
        },
        _showNoAnim: function(name){ $ctxt[name].removeClass('hidden'); },
        _hideNoAnim: function(name){ $ctxt[name].addClass('hidden'); },
        _dim: function($el){ //element dimensions returns [x,y,w,h] based on document
            var off = $el.offset(); 
            return {
                x: off.left,
                y: off.top,
                w: $el.outerWidth(),
                h: $el.outerHeight()
            };
        },
        _wnd: function(){
            return {
                h: $(window).height(),
                w: $(window).width(),
                sy: $(window).scrollTop()
            };
        },
        pos: function(s, $ctxt, $el, w, h, offy){
            var wnd = this._wnd();
            
            if( !s ){
                var dim = this._dim( $el ), top = ( wnd.h+wnd.sy > dim.y+dim.h+offy+h )? dim.y+dim.h+offy : dim.y - h - offy;
                $ctxt.css({ position: 'absolute', top: top, left: dim.x, width: dim.w });
            }else if( !$.isArray(s) ){
                throw "Popup: Property 'static' in options must be an array or equivalent to boolean false";
            }else if( s.length < 2 ){
                throw "Popup: Property 'static' in options must have at least length 2";
            }else{
                if( s[2] ) w = s[2];                   
                if( s[3] ) h = s[3]; //if there is a fourth param, it is height                
                if( s[0] == -1 ) s[0] = (wnd.w-w)/2; 
                if( s[1] == -1 ) s[1] = (wnd.h-h)/2; 
                
                $ctxt.css({position:'fixed', left: s[0], top:s[1], width: w, height: h });
            }
        },
        
        //Actual Functions!
        show: function(el, o){
            var $el = $(el);
            
            if( !o ) o = getOpts.call($el);
            var $c = $ctxt[o.name].html( o.data );
            
            if( el === invoked ){ //if is previous element, just show; 
                o.animate? $c.show(o.delay) : this._showNoAnim(o.name);
                return; 
            }
            invoked = el; //set invoked
            
            this._changeClass(o.cls, o.name); //change the class

            this._showNoAnim(o.name);
            var w = $c.outerWidth(), h = $c.outerHeight();
            this._hideNoAnim(o.name); //get the height
            
            $.popup.pos( o.static, $c, $el, w, h, o.offy ); //position the popup!

            o.animate? $c.show(o.delay) : this._showNoAnim(o.name);
        },
        hide: function(name, a, delay){
            a? $ctxt[name].hide(delay) : this._hideNoAnim(name); 
        }
    };
    
    $.fn.popup = function(inner, opt){ //options, and data to put into the popup box
        var cid = this.attr(data_key); 
        if( !cid ){
            return this.each( function(){ init.call(this, inner, opt); } );
        } 
        
        cid = parseInt(cid);
        
        if( opt ){ opts[cid] = $.extend({}, opts[cid], opt); }
        if( inner !== null ){
            opts[cid].data = inner;
            $ctxt[opts[cid].name].html(inner);
        }  
        if( invoked == this.get(0) ) invoked = null; 
        
        return this; 
    };
    
    function init(inner, opt){        
        var o = $.extend({}, defaults, opt),
            on = o.on.toLowerCase(), off = o.off.toLowerCase(); 
        
        o.data = inner;         
        opts[c] = o; 
        opts[c].tm = null; 
        $(this).attr(data_key, c++); //data key to get the id; added to the data-element as attribute
        
        if( !o.name ) o.name = 'main';
        try{ $.popup.create(o.name); }catch(e){}; 
        
        var isClickOn = false, isClickOff; 
        
        switch(on){
            case 'mouse': case 'mouseover': case 'onmouse': case 'onmouseover': case 'm':
                $(this).mouseover(function(){
                    var o = getOpts.call( this );
                    $.popup.show( this );
                });
                break;
            default:
                isClickOn = true; 
        }
        
        switch(off){
            case 'mouse': case 'mouseover': case 'onmouse': case 'onmouseover': case 'm': case 'mouseenter': 
                $(this).mouseenter(function(){
                    var o = getOpts.call( this ); clearTimeout(o.tm);
                }).on('mouseleave', function(){
                    if( invoked !== this ) return; 
                    var o = getOpts.call( this ); 
                    $.popup.hide(o.name, o.animate, o.delay );
                });
                break;
            default:
                isClickOff = true; 
        }
        
        if( isClickOn && isClickOff ){
            $(this).click(function(){
                 var o = getOpts.call( this ); 
                 if( !o.currClicked || invoked !== this ){
                     $.popup.show( this );
                     o.currClicked = true;
                 }else{
                     $.popup.hide( o.name, o.animate, o.delay );
                     o.currClicked = false;
                 }
             });               
        }else if( isClickOn ){
            $(this).click(function(){ $.popup.show(this); });
        }else if( isClickOff ){
            $(this).click(function(){ var o = getOpts.call( this ); $.popup.hide( o.name, o.animate, o.delay ); });
        }
    };   
})(jQuery);