
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
	var formFieldDate = $(".evtInputDate");
	console.log(formFieldDate.value);
	var getDate = new Date(formFieldDate.val());
	var utcDate = new Date(getDate.getUTCFullYear(), getDate.getUTCMonth(), getDate.getUTCDate());
    console.log(utcDate);	
	

})(jQuery); // End of use strict
