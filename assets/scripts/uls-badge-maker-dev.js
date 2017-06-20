// ON DOM READY
$( function() {
    
/*
    var badgeCount = 0;
    var badgeBGCount = 0;
*/
    
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
        footer: $( '#uls-badge-maker footer' )
        
    };
    
    var icons = {};
    
    var badgeStatus = {
        loaded: false
    };
    
    var badgeBGStatus = {
        loaded: false
    };
    
    var canvas = new fabric.Canvas( 'badge-preview', {
        preserveObjectStacking: true
    } );
    var badgeToDraw = null;
    var badgeBGToDraw = null;
    var ribbonToDraw = null;
    
    calcLayout();
    $( window ).on( 'resize', calcLayout );
    
    // load data from JSON
    loadJSON( getBadges );
    
    //$( document ).dequeue("initialLoad");
    
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
            
            getRibbon();
            
        } ).fail( function( obj, error ) {
            
            displayAJAXError( error, this.url );
            
        } );
        
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
                    
                    canvas.add(ribbonToDraw).renderAll();
                    
                    ribbonToDraw.scaleToWidth( canvas.width * .95 ).set( {
                        
                        left: ( canvas.width - ribbonToDraw.getWidth() ) / 2,
                        top: canvas.height - ribbonToDraw.getHeight() - 30
                        
                    } ).setCoords();
                    
                    canvas.renderAll().bringToFront(ribbonToDraw);
                    
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
            
            canvas.add(badgeToDraw).renderAll();
            
            badgeToDraw.scaleToHeight( canvas.height * .62 ).set( {
                
                left: ( canvas.width - badgeToDraw.getWidth() ) / 2,
                top: 50
                
            } ).setCoords();
            
            canvas.renderAll().bringToFront(badgeToDraw).bringToFront(ribbonToDraw);
            
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
            
            canvas.add(badgeBGToDraw).renderAll()
            
            badgeBGToDraw.scaleToHeight( canvas.height * .85 ).set( {
                
                left: ( canvas.width - badgeBGToDraw.getWidth() ) / 2,
                top: canvas.height - badgeBGToDraw.getHeight() - 10
                
            } ).setCoords();
            
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
    
} ); // DOM READY END