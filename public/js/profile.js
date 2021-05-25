let followBtn = document.getElementById("followBtn")
followBtn.addEventListener("click", followThisProfile);

let followersAmount = document.getElementById("followersAmount");
let followingAmount = document.getElementById("followingAmount");

let followingTxt = document.getElementById("followingTxt");
let followingNr = document.getElementById("followingNr");

let followersTxt = document.getElementById("followersTxt");
let followersNr = document.getElementById("followersNr");


let newPost = document.getElementById("add-post-box");

console.log('hello');

var url = window.location.href.split('/');
var userURL = url.pop() || url.pop();

console.log(userURL);


(async () => {
  const rawResponse = await fetch(`/profile/u/${userURL}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({accessToken: localStorage.getItem("accessToken")})

  });




  const content = await rawResponse.json();


  console.log(content);

  if (content.owner) {
    followBtn.style.display = "none";
  } else {
    newPost.style.display = "none";
  }

  let followers
  if (content.followData.followers.length == 1) {
    followersTxt.innerHTML = " Follower"
  } else {
    followersTxt.innerHTML = " Followers"
  }

  if (content.followData.isFollowing) {
    followBtn.innerHTML = " Unfollow"
  }

  console.log(content.followData.isFollowing);

  console.log(content.followData.followers);
  console.log(content.followData.following);


  followersNr.innerHTML = content.followData.followers.length;
  followingNr.innerHTML = content.followData.following[0].length;


})();




async function followThisProfile()  {

  console.log(followBtn.innerHTML);

  if (followBtn.innerHTML == "Follow") {
    followersNr.innerHTML = Number(followersNr.innerHTML) + 1;
    followBtn.innerHTML = "Unfollow"
  } else {
    followersNr.innerHTML = followersNr.innerHTML -1
    followBtn.innerHTML = "Follow"
  }

  const rawResponse = await fetch(`/profile/u/${userURL}/follow`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({accessToken: localStorage.getItem("accessToken")})



  });

  const content1 = await rawResponse.json();



  console.log(content1);

}


// Display Yaddas
/*
function displayYaddas(response) {
  var response = JSON.parse(this.responseText);

  var html = "";
  for (var a = 0; a < response.data.length; a++) {
    var data = response.data[a];

    html += '<div class="central-meta item">';
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
            date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear();

            html += '<span>Published: ' + date + '</span>';
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
        html += '</div>';


  }
  document.getElementById("newsfeed").innerHTML = html;
}
*/
