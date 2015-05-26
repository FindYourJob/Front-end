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
	var topPos = $('.graphContainer').offset().top;
	//menuButton.offset().top = topPos;
	//menuLeft.offset().top = topPos;
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

	$("#nodeMenu .panel-title a").click(function(){
		console.log("CLICKED");
		setTimeout(function() {
			$("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 5 + "px");
		});
	})
	
});