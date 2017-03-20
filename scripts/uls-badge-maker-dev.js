$( function() {
    
    // HTML view variables
    var numColumn = 3;
    
    $.get("fonts/badge_bg.svg", function(data) {
        
        var glyphs = $( data ).find( 'g' );
        
        // svg sprite variables
        var x = 0;
        var y = 0;
        var width = 198;
        var height = 230;
        var gutter = 10;
        
        $.each( glyphs, function( col ) {
            
            var path = $( glyphs[col] ).find( 'path' );
            var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg');
            var badgeWrapperDiv = document.createElement( 'div' );
            var badgeDiv = document.createElement( 'div' );
            
            badgeWrapperDiv.classList.add( 'badge-wrapper' );
            badgeDiv.classList.add('badge');
            
            svg.setAttribute( 'width', "100%" );
            svg.setAttribute( 'height', "100%" );
            
            if ( col > 0 ) {
                
                if ( ( col % numColumn ) === 0 ) {
                    
                    x = 0;
                    y = y + height + gutter;
                    
                } else {
                    
                    x = x + width + gutter;
                    
                }
                
            } else {
                
                x = 0;
                
            }

            $.each( path, function(i) {
                
                var d = $( path[i] ).attr( 'd' );
                
                svg.innerHTML += '<path d="' + d + '" />';
                svg.setAttribute( 'viewBox', x + ' ' + y + ' ' + width + ' ' + height );
                svg.setAttribute('preserveAspectRatio', 'xMidYMin');   
                
            } );
            
            badgeDiv.innerHTML = new XMLSerializer().serializeToString(svg);
            badgeWrapperDiv.innerHTML = new XMLSerializer().serializeToString( badgeDiv );
            
            $( '.badge_bg_container' ).append( badgeWrapperDiv );
            
        } );
        
    } );
    
} );