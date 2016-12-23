
(function($) {

  $("#frmSubscribe").on("submit", function(e){
		e.preventDefault();
  		$.get("/subscribers/create/"+$("#txtEmail").val(), function(data) {
			console.log(data);
			if (data.error == false) {
				$("#btnSubmit").attr("value","Subscribed!!");
				$("#btnSubmit").attr("class","btn btn-primary");
			}
		});

  });


})(jQuery); // End of use strict
