// ON DOM READY
$( function() {
    
    
    var layout = {
        
        wrapper: $( '#uls-badge-maker' ),
        header: $( '#uls-badge-maker header' ),
        canvas: $( '#uls-badge-maker .badge-body .canvas-wrapper' ),
        tabContainer: $( '#uls-badge-maker .badge-body .badge-container' ),
        tabControl: $( '#uls-badge-maker .badge-body .badge-container .tab-control' ),
        tabItem: $( '#uls-badge-maker .badge-body .badge-container .tab-control .tab-item' ),
        tabContent: $( '#uls-badge-maker .badge-body .badge-container .tab-content' ),
        ctaWrapper: $( '#uls-badge-maker .badge-body .cta' ),
        footer: $( '#uls-badge-maker footer' )
        
    };
    
    calcLayout();
    $( window ).on( 'resize', calcLayout );
    
    // number of columns in the badge background SVG file
    var numBGColumns = 2;
    
    // number of columns in the badge SVG file
    var numBadgeColumns = 4;
    
    // spacing between each column
    var gutter = 10;
    
    // get badge background icons at first
    getBadgeFromSVG( 'fonts/badge_bg.svg', numBGColumns, gutter);
    
    // tab selection event
    layout.tabItem.on( 'click', function( e ) {
        
        var currentTarget = $( e.currentTarget );
        
        if ( !currentTarget.hasClass( 'active' ) ) {
            
            // set next tab
            var next = currentTarget.data( 'target' );
            
            // reset tabs
            layout.tabItem.removeClass( 'active' );
            currentTarget.addClass( 'active' );
            layout.tabContent.empty();
            
            // get content
            switch (next) {
                case 'badges':
                    getBadgeFromSVG( 'fonts/badges.svg', numBadgeColumns, gutter );
                    getBadgeFromSVG( 'fonts/badges.svg', numBadgeColumns, gutter );
                break;
                case 'badge_bgs':
                    getBadgeFromSVG( 'fonts/badge_bg.svg', numBGColumns, gutter );
                break;
                case 'colors':
                break;
            }
            
        }
        
    } );
    
    // read and badges from the SVG file
    function getBadgeFromSVG( file, columns, spacing ) {
        
        $.get( file, function( data ) {
        
            var svgViewBox = $( data ).find( 'svg' ).attr( 'viewBox' ).split( ' ' );
            var glyphs = $( data ).find( 'g[id]' );
            var numRows = 0;
            
            // get number of rows
            for ( var j = 0; j < glyphs.length; j++ ) {
                
                if ( ( j % numBadgeColumns ) === 0 ) {
                    numRows++;
                }
                
            }
            
            // calculate width and height per sprite
            var w = ( Number( svgViewBox[2] ) - ( spacing * ( columns - 1 ) ) ) / columns;
            var h = Number( svgViewBox[3] );
            
            if ( numRows >= 2 ) {
                h = ( Number( svgViewBox[3] ) - ( spacing * ( numRows - 1 ) ) ) / numRows;
            }
            
            // set viewbox for each sprite
            var viewBox = {
                
                x: Number( svgViewBox[0] ),
                y: Number ( svgViewBox[1] ),
                width: w,
                height: h
                
            };
            
            // get each sprite
            $.each( glyphs, function( i ) {
                
                var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
                var badgeWrapperDiv = document.createElement( 'div' );
                var badgeDiv = document.createElement( 'div' );
                
                var context = $( glyphs[i] ).html();
                
                badgeWrapperDiv.classList.add( 'badges' );
                badgeDiv.classList.add( 'badge' );
                
                svg.setAttribute( 'width', "100%" );
                svg.setAttribute( 'height', "100%" );
                
                if ( i > 0 ) {
                    
                    if ( ( i % columns ) === 0 ) {
                        
                        viewBox.x = 0;
                        viewBox.y = viewBox.y + viewBox.height + spacing;
                        
                    } else {
                        
                        viewBox.x = viewBox.x + viewBox.width + spacing;
                        
                    }
                    
                } else {
                    
                    viewBox.x = 0;
                    
                }
                
                svg.innerHTML = context;
                svg.setAttribute( 'viewBox', viewBox.x + ' ' + viewBox.y + ' ' + viewBox.width + ' ' + viewBox.height );
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                
                badgeDiv.innerHTML = new XMLSerializer().serializeToString(svg);
                badgeWrapperDiv.innerHTML = new XMLSerializer().serializeToString( badgeDiv );
                
                layout.tabContent.append( badgeWrapperDiv );
                
            } );
            
        } );
        
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