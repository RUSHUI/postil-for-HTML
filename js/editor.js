$.ajax({
  url: "./assets/common.txt",
  success: function(response) {
    $(".reader-box .content").html(response);
    //$.alert("sucess");
  },
  failure: function() {
    //$.alert("error");
  }
});
