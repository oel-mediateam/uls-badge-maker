$(function(){function e(e,t,r){$.get(e,function(e){for(var i=$(e).find("svg").attr("viewBox").split(" "),b=$(e).find("g[id]"),s=0,d=0;d<b.length;d++)d%n==0&&s++;var o=(Number(i[2])-r*(t-1))/t,g=Number(i[3]);s>=2&&(g=(Number(i[3])-r*(s-1))/s);var c={x:Number(i[0]),y:Number(i[1]),width:o,height:g};$.each(b,function(e){var n=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=document.createElement("div"),s=document.createElement("div"),d=$(b[e]).html();i.classList.add("badges"),s.classList.add("badge"),n.setAttribute("width","100%"),n.setAttribute("height","100%"),e>0?e%t==0?(c.x=0,c.y=c.y+c.height+r):c.x=c.x+c.width+r:c.x=0,n.innerHTML=d,n.setAttribute("viewBox",c.x+" "+c.y+" "+c.width+" "+c.height),n.setAttribute("preserveAspectRatio","xMidYMid meet"),s.innerHTML=(new XMLSerializer).serializeToString(n),i.innerHTML=(new XMLSerializer).serializeToString(s),a.tabContent.append(i)})})}function t(){if($(document).width()<1025){var e=a.canvas.outerHeight();a.tabContainer.css("height","calc(100% - "+e+"px)")}else a.tabContainer.css("height","")}var a={wrapper:$("#uls-badge-maker"),header:$("#uls-badge-maker header"),canvas:$("#uls-badge-maker .badge-body .canvas-wrapper"),tabContainer:$("#uls-badge-maker .badge-body .badge-container"),tabControl:$("#uls-badge-maker .badge-body .badge-container .tab-control"),tabItem:$("#uls-badge-maker .badge-body .badge-container .tab-control .tab-item"),tabContent:$("#uls-badge-maker .badge-body .badge-container .tab-content"),ctaWrapper:$("#uls-badge-maker .badge-body .cta"),footer:$("#uls-badge-maker footer")};t(),$(window).on("resize",t);var r=2,n=4,i=10;e("fonts/badge_bg.svg",2,10),a.tabItem.on("click",function(t){var r=$(t.currentTarget);if(!r.hasClass("active")){var i=r.data("target");switch(a.tabItem.removeClass("active"),r.addClass("active"),a.tabContent.empty(),i){case"badges":e("fonts/badges.svg",n,10),e("fonts/badges.svg",n,10);break;case"badge_bgs":e("fonts/badge_bg.svg",2,10);break;case"colors":break}}})});