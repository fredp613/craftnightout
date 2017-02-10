
(function($) {
  $("#carousel").carousel();	
  $("#carousel_x").carousel();	
  $("#frmSubscribe").on("submit", function(e){
		e.preventDefault();
  		$.get("/osubscribers/create/"+$("#txtEmail").val(), function(data) {
			if (data.error == false) {
				$("#btnSubmit").attr("value","Subscribed!!");
				$("#btnSubmit").attr("class","btn btn-lg btn-info");
				$("#txtEmail").fadeOut();
			} else {
				$("#btnSubmit").attr("value","Subscribed!!");
				$("#txtEmail").fadeOut();
			}
		});

  });
	
	var paypalBtns = $(".paypalBtnItem");;	
	if (paypalBtns) {
		$.each(paypalBtns, function(btn){
			console.log($(this).text());
			var btnForm = $.parseHTML($(this).text());
			$(this).replaceWith(btnForm);
			$(".paypalBtnContainer").show();
		});
	}
	var dates = $(".evtDate");
	$.each(dates, function(d){
		var getDate = new Date($(this).text());
		var utcDate = new Date(getDate.getUTCFullYear(), getDate.getUTCMonth(), getDate.getUTCDate());
		var humanDate = moment(utcDate).format('dddd MMMM Do YYYY')
		$(this).replaceWith(humanDate);

	});
	
	var eventTypeOptions = $(".eventTypeOpt");

	$.each(eventTypeOptions, function(o){
		var option = $(this);
		if (option.attr("data-selected") === option.val()) {
			option.attr("selected", "selected");
		} else {
			option.removeAttr("selected")
		}
	});
	$(".email").on("click", function(e) {
		var subId = e.target.id;
		console.log(subId)
		return false;
	});
	

})(jQuery); // End of use strict
