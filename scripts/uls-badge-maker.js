$(function(){var e=3;$.get("fonts/badge_bg.svg",function(e){var t=$(e).find("g"),i=0,n=0,r=198,a=230,d=10;$.each(t,function(e){var r=$(t[e]).find("path"),a=document.createElementNS("http://www.w3.org/2000/svg","svg"),d=document.createElement("div"),s=document.createElement("div");d.classList.add("badge-wrapper"),s.classList.add("badge"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),e>0?e%3==0?(i=0,n=n+230+10):i=i+198+10:i=0,$.each(r,function(e){var t=$(r[e]).attr("d");a.innerHTML+='<path d="'+t+'" />',a.setAttribute("viewBox",i+" "+n+" 198 230"),a.setAttribute("preserveAspectRatio","xMidYMin")}),s.innerHTML=(new XMLSerializer).serializeToString(a),d.innerHTML=(new XMLSerializer).serializeToString(s),$(".badge_bg_container").append(d)})})});