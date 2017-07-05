// ON DOM READY
$( function() {
    
    var layout = {
        
        wrapper: $( '#uls-badge-maker' ),
        header: $( '#uls-badge-maker header' ),
        canvasWrapper: $( '#uls-badge-maker .badge-body .canvas-wrapper' ),
        hiddenShaper: $( '#uls-badge-maker .badge-body .canvas-wrapper .hidden-shaper' ),
        tabContainer: $( '#uls-badge-maker .badge-body .badge-container' ),
        tabControl: $( '#uls-badge-maker .badge-body .badge-container .tab-control' ),
        tabItem: $( '#uls-badge-maker .badge-body .badge-container .tab-control .tab-item' ),
        activeTabItem: $( '#uls-badge-maker .badge-body .badge-container .tab-control .tab-item.active' ),
        tabContent: $( '#uls-badge-maker .badge-body .badge-container .tab-content' ),
        ctaWrapper: $( '#uls-badge-maker .badge-body .cta' ),
        colorBoxes: $( '#uls-badge-maker .badge-body .badge-container .box' ),
        exportBtn: $( '#uls-badge-maker .badge-body .cta #exportBtn' ),
        previewBtn: $( '#uls-badge-maker .badge-body .cta #previewBtn' ),
        titleTxtBox: $( '#uls-badge-maker .badge-body .canvas-wrapper .title_text_field input' ),
        ribbonTxtBox: $( '#uls-badge-maker .badge-body .canvas-wrapper .ribbon_text_field textarea' ),
        footer: $( '#uls-badge-maker footer' )
        
    };
    
    var icons = {};
    
    var badgeStatus = {
        loaded: false
    };
    
    var badgeBGStatus = {
        loaded: false
    };
    
    var colors = {
        loaded: false,
        current: '#000'
    };
    
    var canvas = new fabric.Canvas( 'badge-preview', {
        preserveObjectStacking: true,
        backgroundColor: "#fff"
    } );
    var badgeToDraw = null;
    var badgeBGToDraw = null;
    var ribbonToDraw = null;
    var titleTextToDraw = null;
    var ribbonTextToDraw = null;
    
    calcLayout();
    $( window ).on( 'resize', calcLayout );
    
    // load data from JSON
    loadJSON( getBadges );
    
    // preview btn event listener
    layout.previewBtn.on( 'click', function() {
        
        canvas.isDrawingMode = false;
        window.open( canvas.toDataURL( {
            format: 'png'
        } ) );
        
    } );
    
    layout.exportBtn.on( 'click', function() {
        
        canvas.isDrawingMode = false;
        
        var timestamp = new Date();
        var link = document.createElement("a");
        var imgData = canvas.toDataURL( {
            format: 'png'
        } );
        var blob = dataURItoBlob(imgData);
        var objurl = URL.createObjectURL(blob);
        
        link.download = "uls_badge_" + timestamp.getTime() + ".png";
        
        link.href = objurl;
        
        var exportClickEvent = new MouseEvent( 'click', {
            "view": window,
            "bubble": true,
            "cancelable": false
        } );
        
        link.dispatchEvent( exportClickEvent );
        
    } );
    
    // tab selection event
    layout.tabItem.on( 'click', function( e ) {
        
        var currentTarget = $( e.currentTarget );
        
        if ( !currentTarget.hasClass( 'active' ) ) {
            
            // set next tab
            var next = currentTarget.data( 'target' );
            
            // reset tabs
            layout.tabItem.removeClass( 'active' );
            currentTarget.addClass( 'active' );
            layout.tabContent.removeClass( 'active' );
            
            // make tab active
            $( '#' + next ).addClass( 'active' );
            
            // get content
            switch ( next ) {
                
                case 'badges':
                    getBadges();
                break;
                
                case 'badge_bgs':
                    getBadgeBGs();
                break;
                
                case 'colors':
                    
                    if ( !colors.loaded ) {
                        
                        layout.colorBoxes.each( function() {
                        
                            var hexCode = $( this ).find('span').data('hex');
                            $( this ).css( 'background', hexCode );
                            
                        } );
                        
                        layout.colorBoxes.on( 'click', function() {
                            
                            var hexCode = $( this ).find('span').data('hex');
                            
                            layout.colorBoxes.removeClass( 'selected' );
                            $( this ).addClass( 'selected' );
                            
                            if ( badgeToDraw ) {
                                
                                for (var i = 0; i < badgeToDraw.paths.length; i++) {
                                
                                    if ( badgeToDraw.paths[i].fill !== "#FFFFFF" ) {
                                        badgeToDraw.paths[i].setFill(hexCode);
                                    } 
                                
                                }
                                
                            }
                            
                            if ( badgeBGToDraw ) {
                                badgeBGToDraw.setFill( hexCode );
                            }
                            
                            if ( titleTextToDraw ) {
                                titleTextToDraw.setFill( hexCode );
                            }
                            
                            canvas.renderAll();
                            colors.current = hexCode;
                            
                        } );
            
                        colors.loaded = true;
                    }
                    
                break;
                
            }
            
        }
        
    } );
    
    function loadJSON( callback ) {
        
        $.getJSON( 'assets/badges.json', function( data ) {
            
            icons = data;
            
            if ( callback !== undefined ) {
                callback();
            }
            
            getTitleTextbox();
            getRibbon();
            
        } ).fail( function( obj, error ) {
            
            displayAJAXError( error, this.url );
            
        } );
        
    }
    
    function getTitleTextbox() {
        
        titleTextToDraw = new fabric.Textbox( 'double click to edit text', {
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            showplaceholder: true,
            opacity: 0.3
        } );
        
        canvas.add( titleTextToDraw );
        
        titleTextToDraw.set( {
            
            fontFamily: 'Montserrat',
            top: 20,
            width: canvas.width,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true
            
        } ).setCoords().setFill( colors.current );
        
        canvas.renderAll().bringToFront( titleTextToDraw );
        
    }
    
    function getRibbon() {
        
        var ribbons = icons.ribbons;
        
        for ( var i = 0; i < ribbons.length; i++ ) {
                
            $.get( 'assets/' + ribbons[i].path + '.svg', function( data ) {
                
                var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
                
                svg.setAttribute( 'width', "100%" );
                svg.setAttribute( 'height', "100%" );
                svg.setAttribute( 'viewBox', '0 0 500 130' );
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.innerHTML = $( data ).find( 'svg' ).html();
                
                var svgToString = new XMLSerializer().serializeToString(svg);
                
                fabric.loadSVGFromString( svgToString, function(objects, options) {
            
                    ribbonToDraw = fabric.util.groupSVGElements(objects, options);
                    
                    canvas.add(ribbonToDraw);
                    
                    ribbonToDraw.scaleToWidth( canvas.width * .95 ).set( {
                        
                        left: ( canvas.width - ribbonToDraw.getWidth() ) / 2,
                        top: canvas.height - ribbonToDraw.getHeight() - 30,
                        selectable: false
                        
                    } ).setCoords();
                    
                    // ribbon textbox
                    ribbonTextToDraw = new fabric.Textbox( 'double click to edit text', {
                        fontSize: 38,
                        lineHeight: 1,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fill: '#fff',
                        showplaceholder: true,
                        opacity: 0.3
                    } );
                    
                    canvas.add( ribbonTextToDraw );
                    
                    ribbonTextToDraw.set( {
                                    
                        hasControls: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        fontFamily: 'Open Sans Condensed',
                        width: 400,
                        height: 80,
                        left: ( canvas.width - 400 ) / 2,
                        top: canvas.height - ribbonToDraw.getHeight() - 26.5
                        
                    } ).setCoords();
                    
                    canvas.renderAll()
                          .bringToFront(ribbonToDraw)
                          .bringToFront(ribbonTextToDraw);
                    
                } );
                
            } );
            
        }
        
    }
    
    function getBadges() {
        
        if ( badgeStatus.loaded === false ) {
            
            var badges = icons.badges;
        
            for ( var i = 0; i < badges.length; i++ ) {
                
                var badgeDiv = document.createElement( 'div' );
                
                badgeDiv.classList.add( 'badge' );
                badgeDiv.classList.add( 'badge_icon' );
                badgeDiv.classList.add( 'bd' + i );
                $( '#badges' ).append( badgeDiv );
                
                showBadge( badges[i], 'bd' + i );
                
            }
            
            $( '.badge_icon' ).on( 'click', function() {
                
                $( '.badge_icon' ).removeClass( 'selected' );
                $( this ).addClass( 'selected' );
                
                selectBadge( this );
                
            } );
            
            badgeStatus.loaded = true;
            
        }
        
    }
    
    function getBadgeBGs() {
        
        if ( badgeBGStatus.loaded === false ) {
            
            var badgeBGs = icons.backgrounds;
        
            for ( var i = 0; i < badgeBGs.length; i++ ) {
                
                var badgeBGDiv = document.createElement( 'div' );
                
                badgeBGDiv.classList.add( 'badge' );
                badgeBGDiv.classList.add( 'badge_bg' );
                badgeBGDiv.classList.add( 'bg' + i );
                $( '#badge_bgs' ).append( badgeBGDiv );
                
                showBadge( badgeBGs[i], 'bg' + i );
                
            }
            
            $( '.badge_bg' ).on( 'click', function() {
                
                $( '.badge_bg' ).removeClass( 'selected' );
                $( this ).addClass( 'selected' );
                
                selectBadgeBG( this );
                
            } );
            
            badgeBGStatus.loaded = true;
            
        }
        
    }
    
    function showBadge( obj, selector ) {
        
        $.get( 'assets/' + obj.path + '.svg', function( data ) {
            
            var container = document.getElementsByClassName( selector )[0];
            var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
            var svgToString = '';
            
            svg.setAttribute( 'width', "100%" );
            svg.setAttribute( 'height', "100%" );
            svg.setAttribute( 'viewBox', '0 0 500 500' );
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.innerHTML = $( data ).find( 'svg' ).html();
            
            svgToString = new XMLSerializer().serializeToString(svg);
            
            container.innerHTML = svgToString;
            container.innerHTML += '<div class="name">' + obj.name + '</div>';
            
        } );
        
    }
    
    function selectBadge( obj ) {
        
        var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
        
        svg.setAttribute( 'width', "100%" );
        svg.setAttribute( 'height', "100%" );
        svg.setAttribute( 'viewBox', '0 0 500 500' );
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.innerHTML = $( obj ).children("svg").html();
        
        var svgString = new XMLSerializer().serializeToString( svg );
        
        if ( badgeToDraw !== null ) {
            canvas.remove( badgeToDraw );
        }
        
        fabric.loadSVGFromString( svgString, function(objects, options) {
            
            badgeToDraw = fabric.util.groupSVGElements(objects, options);
            
            canvas.add(badgeToDraw);
            
            badgeToDraw.scaleToHeight( canvas.height * .62 ).set( {
                
                left: ( canvas.width - badgeToDraw.getWidth() ) / 2,
                top: 38
                
            } ).setCoords();
            
            badgeToDraw.lockUniScaling = true;
            badgeToDraw.lockRotation = true;
            badgeToDraw.lockMovementX = true;
            
            for (var i = 0; i < badgeToDraw.paths.length; i++) {
                                
                if ( badgeToDraw.paths[i].fill !== "#FFFFFF" ) {
                    badgeToDraw.paths[i].setFill( colors.current );
                } 
            
            }
            
            canvas.renderAll()
                  .bringToFront(badgeToDraw)
                  .bringToFront( titleTextToDraw )
                  .bringToFront(ribbonToDraw)
                  .bringToFront(ribbonTextToDraw);
            
        } );
        
    }
    
    function selectBadgeBG( obj ) {
        
        var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
        
        svg.setAttribute( 'width', "100%" );
        svg.setAttribute( 'height', "100%" );
        svg.setAttribute( 'viewBox', '0 0 500 500' );
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.innerHTML = $( obj ).children("svg").html();
        
        var svgString = new XMLSerializer().serializeToString( svg );
        
        if ( badgeBGToDraw !== null ) {
            canvas.remove( badgeBGToDraw );
        }
        
        fabric.loadSVGFromString( svgString, function(objects, options) {
            
            badgeBGToDraw = fabric.util.groupSVGElements(objects, options);
            
            canvas.add( badgeBGToDraw );
            
            badgeBGToDraw.scaleToHeight( canvas.height * .85 ).set( {
                
                left: ( canvas.width - badgeBGToDraw.getWidth() ) / 2,
                top: canvas.height - badgeBGToDraw.getHeight() - 10,
                selectable: false
                
            } ).setCoords().setFill( colors.current );
            
            canvas.renderAll().sendToBack(badgeBGToDraw);
            
        } );
        
    }
    
    function displayAJAXError( str, src ) {
        
        src = src !== undefined ? src : '';
        
        var msg = '';
        
        switch ( str ) {
            
            case 'parsererror':
                msg = 'Invalid JSON in ' + src;
            break;
            
            default:
                msg = 'Error loading ' + src + '. Make sure the file exists.';
            break;
            
        }
        
        console.error( msg );
        
    }
    
    function calcLayout() {
        
        if ( $( document ).width() < 1025 ) {
            
            var tContainerInverseHeight = layout.canvasWrapper.outerHeight();
        
            layout.tabContainer.css(
                'height',
                'calc(100% - ' + tContainerInverseHeight + 'px)'
            );
            
        } else {
            layout.tabContainer.css( 'height', '' );
        }
        
        canvas.setWidth( layout.hiddenShaper.width() );
        canvas.setHeight( layout.hiddenShaper.height() );
        
    }
    
    // A key got pressed in an IText which is in editing mode:
    canvas.on('text:changed', function( e ) {
        
        var obj = e.target;
        
        if( obj.getText() === '' ) {
            
            obj.setText('double click to edit text');
            obj.set('opacity', 0.3);
            obj.set('showplaceholder', true);
            obj.setCoords();
            canvas.renderAll();
            
        } else if( obj.get('showplaceholder') === true ) {
        
            if( e.target.text !== 'double click to edit text' ) {
                
                obj.setText(obj.getText().substr(0,1));
                obj._updateTextarea();
                obj.set('opacity', 1);
                obj.set('showplaceholder', false);
                obj.setCoords();
                canvas.renderAll();
                
            }
        }
        
    } );
    
    function dataURItoBlob( dataURI ) {
        
        var arr = dataURI.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        
        while( n-- ){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], {type:mime});
    }
    
    // Editing mode is entered on the IText
    canvas.on('text:editing:entered', function( e ) {
        
        var obj = e.target;
        
        if( obj.get('showplaceholder') === true) {
        	
        	obj.setSelectionStart(0);
        	obj.setSelectionEnd(0);
        	canvas.renderAll();
        }
        
        if ( obj.getFontFamily() !== 'Montserrat' ) {
            
            obj.set( {
                top: canvas.height - ribbonToDraw.getHeight() - 26.5
            } ).setCoords();
            canvas.renderAll();
            
        }
        
    } );
    
    canvas.on('text:editing:exited', function( e ) {
        
        var obj = e.target;
        
        if ( obj.get('showplaceholder') !== true) {
        	
        	var oTxt = obj.getText();
            obj.setText( oTxt.toUpperCase() );
            
            if ( obj.getFontFamily() !== 'Montserrat' ) {
                
                if ( obj.height <= 42.94 ) {
                
                    obj.set( {
                        top: canvas.height - ribbonToDraw.getHeight() - 5
                    } ).setCoords();
                    canvas.renderAll();
                    
                } else {
                    
                    obj.set( {
                        top: canvas.height - ribbonToDraw.getHeight() - 26.5
                    } ).setCoords();
                    canvas.renderAll();
                    
                }
                
            }
        	
        }
        
    } );
    
} ); // DOM READY END