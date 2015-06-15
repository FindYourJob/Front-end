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
	
});