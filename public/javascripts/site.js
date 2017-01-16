
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


})(jQuery); // End of use strict
