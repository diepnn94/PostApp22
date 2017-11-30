function loadImages(dir){
  $.ajax({
    url:dir,
    success: function(data){
      // $("#gallery").children().remove();
      $(data).find("a").attr("href", function(i, value){
        if (value.match(/\.(jpe?g|png|gif)$/)){
          console.log(value);
        }
      }
    }
  })
}
