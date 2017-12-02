function getTime(){
  var currentTime = new Date();
  var dayList = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
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

function checkUsername(){
  var username = localStorage.getItem("username");
  console.log(username);
  if (username != null){
    $(".checkUser").text("Login as "+username);
  }
  else{
      $(".checkUser").text("Login");
  }
}

$(function(){
  checkUsername();
  $("#postMessage").on("submit", function(e){
    e.preventDefault();
    var username = localStorage.getItem("username");
    postMessage(username);
});

})

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
        getMessage(10);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }
}

function loadMore(){
  var counter = 1
  $("#loadMore").click(function(){
    counter++;
    getMessage(counter*10);
  })
}
$(function(){
  loadMore();
})
function getMessage(messageNum){
  var img_src = $("#imageProfile").attr("src");
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/post-app/collections/message?s={ "_id": -1 }&l='+messageNum+'&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',

    // url: 'https://api.mlab.com/api/1/databases/post-app/collections/message?s={ "_id": -1 }&l=10&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
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
  });
}

function validateKey(){
  var key = $("#key").val();
  var username = localStorage.getItem("username");

  if (key != "postapptesting2017"){
    $("#keyErr").removeClass('hidden');
  }
  else{
    $.ajax({
      url: 'https://api.mlab.com/api/1/databases/post-app/collections/user?q={ "username": "' + username + '" }&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
      type: "PUT",
      data: JSON.stringify( { "$set" : { "confirmation" : 1 } } ),
      contentType: "application/json",
      success: function(data){
        console.log("updated");
        $("#keyForm").unbind("submit").submit();
      }
    });
  }
}
$(function(){
  $("#keyForm").on("submit", function(e){
    e.preventDefault();
    validateKey();
  })
})

function validateRegistrationForm() {
  var name = $("#name").val();
  var email = $("#email").val();
  var username = $("#username").val();
  var password = $("#password").val();
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/post-app/collections/user?q={ "username": "' + username + '" }&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
    success: function(data) {
      if (data.length == 0) {
        $.ajax({
          url: "https://api.mlab.com/api/1/databases/post-app/collections/user?apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ",
          data: JSON.stringify({
            "name": name,
            "email": email,
            "username": username,
            "password": password,
            "confirmation": 0
          }),
          type: "POST",
          contentType: "application/json",
          success: function(data) {
            localStorage.setItem("username", username);
            $("#registrationForm").unbind("submit").submit();
          },
          error: function(xhr, status, err) {
            console.log(err);
          }
        });
      }
      else if (data.length != 0) {
        $("#usernameErr").removeClass('hidden');
      }
    }
  })

}

$(function(){
  $("#registrationForm").on("submit", function(e){
    e.preventDefault();
    validateRegistrationForm();
  })
})
function loadImages(dir){

  $.ajax({
    type: 'post',
    url: "/get_file/"+dir,
    success: function(data){
      $("#gallery").children().remove();
      $.each(data['result'], function(index, value){
        var div = $("<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'></div>").html("");
        var image = $('<img class="thumbnail" src="' + value + '" alt="inspiration">')
        $(div).append(image);
        $("#gallery").append(div);
      })
    galleryActive();
    }
  })
}

function galleryActive(){
  $("#gallery img").click(function(){
    var img_src = $(this).attr('src');
    var div = $("<div id='new' class='background'></div>").css({
        "width": $(window).width(),
        "height": $(window).height()
    }).html("");

    var clone = $("<img src= '" + img_src + "'>").css({
        "width": "80vw",
        "height": "60vh",
        "top": "10vh",
        "left": "10vw",
        "position": 'fixed',
        "animation-name": "flip",
        "animation-duration": "2s"
    });
    var close = $("<button class='rem2'>X</button>").addClass("close")
    $(div).append(clone);
    $(div).append(close);
    $("#galleryControl").append(div);
    $(".rem2").on("click", function(){
      $("#galleryControl").children().remove();
    })
  })
}


function loginValidate(){
  $(".loginBlogErr").addClass('hidden');
  $(".loginUserErr").addClass('hidden');
  $(".loginPasswordErr").addClass('hidden');

  var username = $(".loginUsername").val();
  var password = $(".loginPassword").val();
  console.log(username);
  console.log(password);
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/post-app/collections/user?q={ "username": "' + username + '" }&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
    success:function(data){
      if (data.length == 0){
        $(".loginUserErr").removeClass('hidden');
      }
      else if (data[0]["password"] != password){
        $(".loginPasswordErr").removeClass("hidden");
      }
      else if (data[0]["confirmation"] == 0){
        console.log("MATCH");
        $(".loginForm").attr("action", "/emailConfirmation");
        $(".loginForm").unbind("submit").submit();
      }
      else if (data[0]["confirmation"] == 1){
        $(".loginForm").attr("action", "/blog");
        localStorage.setItem("username", username);
        $(".loginForm").unbind("submit").submit();
      }
    }
  })
}

$(function(){
  $(".login").hide();
  $(".loginPrompt").click(function(){
    $(".login").toggle(2000);
    $(".loginBlogErr").addClass('hidden');
    $(".loginUserErr").addClass('hidden');
    $(".loginPasswordErr").addClass("hidden");
  })
  $(".loginCancel").click(function(){
    $(".login").toggle(2000);
  })
  $(".loginForm").on("submit", function(e){
    e.preventDefault();
    loginValidate();
  })
})

function logout(){
  $(".logout").click(function(){
    localStorage.removeItem("username");
    checkUsername();

  })
}

function blogAccess(){
  $(".accessBlog").on("click", function(e){
    e.preventDefault();
    var username = localStorage.getItem("username");
    if (username != null){
      $(".accessBlog").unbind("click").click();
    }
    else{
        $(".loginPrompt").click();
        $(".loginBlogErr").removeClass('hidden');
      }
    })
  }


$(function(){
    blogAccess();
    logout();
    checkUsername();

  })


  var slideIndex = 1;

  function showDivs(n) {
    var i;
    // var x = $(".mySlides");

    var x = document.getElementsByClassName("mySlides");
    if (x.length != 0){
      if (n > x.length) {slideIndex = 1}
      if (n < 1) {slideIndex = x.length}
      for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
      }
        x[slideIndex-1].style.display = "block";
    }

  }
  function plusDivs(n) {
    showDivs(slideIndex += n);
  }
$(function(){
  showDivs(slideIndex);
})

function usernameLookUp(){
    var name = $("#nameRecover").val();
    var email = $("#emailRecover").val();
    $("#emailNotExist").addClass('hidden');
    $("#userRecoverMessage h3").addClass('hidden');
    $("#multipleUsernameRecover").addClass('hidden');
    $("#usernameDisplay").addClass('hidden');
    var i;
    $.ajax({
      url: 'https://api.mlab.com/api/1/databases/post-app/collections/user?q={ "email": "' + email + '", "name": "' + name + '" }&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
      success: function(data){
        if (data.length == 0){
          $("#userRecoverMessage h3").removeClass('hidden');
          $("#emailNotExist").removeClass('hidden');

        }
        else{
          $("#usernameDisplay").children().remove();
          if (data.length > 1){
            $("#multipleUsernameRecover").removeClass('hidden');
          }
          for (i = 0; i < data.length; i++){
            var username = $("<p>"+data[i].username+ "</p>");
            $("#usernameDisplay").append(username);
          }
          $("#usernameDisplay").removeClass('hidden');
          $("#userRecoverMessage h3").removeClass('hidden');
          $("#usernameRecover").trigger("reset");
        }
      }
    })
}

function recoverPassword(){
  var username = $("#usernamePasswordRecover").val();
  var email = $("#emailPasswordRecover").val();
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/post-app/collections/user?q={ "email": "' + email + '", "username": "' + username + '" }&apiKey=JWHpnnsJXMPxBJnJE0NN-LBMU8PJaaLQ',
    success: function(data){
      if (data.length == 0){
        $("#passwordRecoverMessage").removeClass('hidden');
      }
      else{
        $("#passwordRecover").unbind("submit").submit();
      }
    }
  })

}
$(function(){
  $("#usernameRecover").on("submit", function(e){
    e.preventDefault();
    usernameLookUp();
  })

  $("#passwordRecover").on("submit", function(e){
    e.preventDefault();
    recoverPassword();
  })
})
