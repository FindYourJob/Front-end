function allCollapsed(){
	var collapsibleItems = $('.panel-collapse');
	var allCollapsed = true;
	$('#left-menu1 .panel-collapse').each(function(){
		if($(this).hasClass("in")){
			allCollapsed = false;
			return false;
		}
	});
	return allCollapsed;
}

$( document ).ready(function(){
	var menuLeft = $('#left-menu1');
	var menuButton = $("#left-button1");
	menuButton.css("display","block");

	var menuRight = $("#nodeMenu");
	//menuRight.offset().top = topPos;


	menuButton.click(function(){
		menuLeft.addClass("cbp-spmenu-open");
		$(this).css("display","none");
	});
	menuLeft.hover(function(){
		$(this).addClass("cbp-spmenu-open");
	});
	menuLeft.mouseleave(function(){
		if(allCollapsed()){
			$(this).removeClass("cbp-spmenu-open");
			$("#left-button1").css("display","block");
		}
	});

	d3.select("#save").on("click", function(){
    var content = $('svg').wrap('<p/>').parent().html();
	$('svg').unwrap();
        // Canvg requires trimmed content
        //content = $container.html().trim(),
        canvas = document.getElementById('svg-canvas');

    // Draw svg on canvas
    canvg(canvas, content);

    // Change img be SVG representation
    var theImage = canvas.toDataURL('image/png');
    $('#svg-img').attr('src', theImage);

	  var a = document.createElement("a");
	  a.download = "sample.png";
	  a.href = theImage;
	  a.click();
});
	
});