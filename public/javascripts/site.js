
(function($) {

  $("#frmSubscribe").on("submit", function(e){
		e.preventDefault();
  		$.get("/subscribers/create/"+$("#txtEmail").val(), function(data) {
			if (data.error == false) {
				$("#btnSubmit").attr("value","Subscribed!!");
				$("#btnSubmit").attr("class","btn btn-lg btn-primary");
				$("#txtEmail").fadeOut();
			} else {
				console.log("Already registered")
				$("#btnSubmit").attr("value","Subscribed!!");
				$("#txtEmail").fadeOut();
			}
		});

  });


})(jQuery); // End of use strict
