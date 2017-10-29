function getTime(){
  var currentTime = new Date();
  var dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  var date = currentTime.getDate();
  var month = monthList[currentTime.getMonth()];
  var year = currentTime.getFullYear();
  var day = dayList[currentTime.getDay()];
  var hour = currentTime.getHours().toString();
  var min = currentTime.getMinutes().toString();
  var sec = currentTime.getSeconds().toString();
  if (hour.length ==1){
    hour = "0" + hour;
  }
  if (min.length ==1){
    min = "0" + min;
  }
  if (sec.length ==1){
    sec = "0" + sec;
  }
  var time = day+" " +month+ ", " + date + ", "+year +" "+ hour +":" + min + ":"+sec;
  return time;

}
function updateClock(){
  var time = getTime();
  $("#time").text(time);
}

$(function(){
  setInterval("updateClock()",1000);
})
$(function(){
  $("#gallery img").click(function(){
    var img_src = $(this).attr('src');

    var div = $("<div id='new' class='background'></div>").css({
        "width": $(window).width(),
        "height": $(window).height()
    }).html("");

    var clone = $("<img src= '" + img_src + "'>").css({

        "width": ($(window).width()/10)*8,
        "height": ($(window).height()/10)*8,
        "margin-left": ($(window).width()/10),
        "margin-top": ($(window).height()/10),
        "position": 'fixed',

        "animation-name": "flip",
        "animation-duration": "2s"
    });
    var close = $("<button class='rem2'>X</button>").css({
      "top": ($(window).height()/10)-50,
      "left":($(window).width()/10)*9

    });
    $(div).append(clone);
    $(div).append(close);
    $("#galleryControl").append(div);
    $(".rem2").on("click", function(){
      $("#galleryControl").children().remove();
    })
  })
})

function Testing(name){
  console.log(name);
}

function postControl(name){
  $("#postMessage").on("submit", function(e){
    e.preventDefault();
    console.log(name.name);
    postMessage(name.name);
});
}


function postMessage(name){

  var time = getTime();
  var content = $("#content").val()
  if (content.length > 0){
  $.ajax({
      url: "https://api.mlab.com/api/1/databases/post-app/collections/message?apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ",
      data: JSON.stringify({
         "posted-by" : name,
         "timestamp": time,
         "content": content
        }),
      type: "POST",
      contentType: "application/json",
      success: function(data){
        $("#content").val("");
        getMessage();
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }
}

function getMessage(){
  var img_src = $("#imageProfile").attr("src");
  console.log(img_src);
  $.ajax({
    url: "https://api.mlab.com/api/1/databases/post-app/collections/message?apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ",
    // cache: false
  }).done(function(data){
    var output="";
    $.each(data, function(key, data){
      output+= '<div class="media">';
      output+= '<div class="media-left">';
      output+= '<img src="' + img_src + '" class="media-object profile" style="width:50px; height:50px"></img>';
      output+= "</div>";
      output+='<div class="media-body">'
      output+=  '<h4 class="media-heading">' + data["posted-by"] +'<small><i>Posted on '+ data.timestamp +'</i></small></h4>';
      output+=  '<pre style="width:80%;">';
      output+=    data.content;
      output+= '</pre>';
      output+= '</div>';
      output+= '</div>';
    });
    $("#message").html(output);
    $(".blogMessage").scrollTop(40000);
  });
}
