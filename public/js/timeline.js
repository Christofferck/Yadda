var isHomePage = true;

function doPost(form) {

  var ajax = new XMLHttpRequest();
  ajax.open("POST", "/post/add", true);

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

  var response = JSON.parse(this.responseText);


  if (response.status == "success") {
    document.getElementById("form-add-post").querySelector("input[name='image']").value = "";
    document.getElementById("form-add-post").querySelector("input[name='video']").value = "";
    document.getElementById("form-add-post").querySelector("textarea[name='caption']").value = "";
    document.getElementById("post-img-preview").style.display = "none";
    document.getElementById("post-video-preview").style.display = "none";

    console.log(response.status);


    }
    var response = JSON.parse(this.responseText);
                          alert(response.message);
    showNewsfeed();
  }
};

  var formData = new FormData(form);
  formData.append("accessToken", localStorage.getItem("accessToken"));
  ajax.send(formData);



  return false;
}

function showNewsfeed() {

  var url = window.location.href.split('/');
  var hashtagURL = url.pop() || url.pop();


  var postReq = "/post/timeline"
  if(url.slice(-2, -1)[0] == 'post') {
    postReq = `/post/hashtag/${hashtagURL}`
  }


  var ajax = new XMLHttpRequest();
  ajax.open("POST", postReq, true);

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var response = JSON.parse(this.responseText);

      var html = "";
      for (var a = 0; a < response.data.length; a++) {
        var data = response.data[a];

        html += '<div class="central-meta item post">';
          html += '<div class="user-post">';
            html += '<div class="friend-info">';

              html += '<figure>';
                html += '<img src="' + mainURL + "/" + data.user.profileImage + '" style="width: 45px; height: 45px; object-fit: cover;">';
              html += '</figure>';

              html += '<div class="friend-name">';
                html += '<ins>';
                  if (data.type == "post")
                  {
                    html += '<a href="/profile/u/' + data.user.username + '">';
                      html += data.user.name;
                    html += '</a>';
                  }
                  else
                  {
                    html += data.user.name;
                  }
                html += '</ins>';

                var createdAt = new Date(data.createdAt);
                var date = createdAt.getDate() + "";
                date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() + ", " + createdAt.getHours() + ":" + createdAt.getMinutes()

                html += '<span>' + date + '</span>';
              html += '</div>';



            html += '</div>';
            html += '<div class="post-meta">';

              html += '<div class="description">';
                html += '<p>';
                  html += data.caption;
                html += '</p>';
              html += '</div>';

              if (data.image != "") {
                html += '<img src="' + mainURL + "/" + data.image + '">';
              }

              if (data.video != "") {
                html += '<video style="height: 359px; width: 100%;" controls src="' + mainURL + "/" + data.video + '"></video>';
              }
              html += '</div>';
            html += '</div>';

            html += "<div id='post-comments-" + data._id + "'>";
              html += createCommentsSection(data);
            html += "</div>";
            html += '</div>';


      }
      document.getElementById("newsfeed").innerHTML = html;
    }
  };

  var formData = new FormData();
  formData.append("accessToken", localStorage.getItem("accessToken"));
  ajax.send(formData);
}
