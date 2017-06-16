// ON DOM READY
$( function() {
    
/*
    var badgeCount = 0;
    var badgeBGCount = 0;
*/
    
    var layout = {
        
        wrapper: $( '#uls-badge-maker' ),
        header: $( '#uls-badge-maker header' ),
        canvas: $( '#uls-badge-maker .badge-body .canvas-wrapper' ),
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
            
        } ).fail( function( obj, error ) {
            
            displayAJAXError( error, this.url );
            
        } );
        
    }
    
    function getBadges() {
        
        if ( badgeStatus.loaded === false ) {
            
            var badges = icons.badges;
        
            for ( var i = 0; i < badges.length; i++ ) {
                
                var badgeDiv = document.createElement( 'div' );
                
                badgeDiv.classList.add( 'badge' );
                badgeDiv.classList.add( 'c' + i );
                $( '#badges' ).append( badgeDiv );
                
                showBadge( badges[i], 'c' + i );
                
            }
            
            badgeStatus.loaded = true;
            
        }
        
    }
    
    function showBadge( obj, selector ) {
        
        $.get( 'assets/' + obj.path + '.svg', function( data ) {
            
            var container = document.getElementsByClassName( selector )[0];
            var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
            
            svg.setAttribute( 'width', "100%" );
            svg.setAttribute( 'height', "100%" );
            svg.setAttribute( 'viewBox', '0 0 500 500' );
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.innerHTML = $( data ).find( 'svg' ).html();
            
            container.innerHTML = new XMLSerializer().serializeToString(svg);
            container.innerHTML += '<div class="name">' + obj.name + '</div>';
            
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
            
            var tContainerInverseHeight = layout.canvas.outerHeight();
        
            layout.tabContainer.css(
                'height',
                'calc(100% - ' + tContainerInverseHeight + 'px)'
            );
            
        } else {
            layout.tabContainer.css( 'height', '' );
        }
        
    }
    
} ); // DOM READY END