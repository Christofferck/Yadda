let followBtn = document.getElementById("followBtn")
followBtn.addEventListener("click", followThisProfile);

let followersAmount = document.getElementById("followersAmount");
let followingAmount = document.getElementById("followingAmount");

let followingTxt = document.getElementById("followingTxt");
let followingNr = document.getElementById("followingNr");

let followersTxt = document.getElementById("followersTxt");
let followersNr = document.getElementById("followersNr");

let newPost = document.getElementById("add-post-box");


var url = window.location.href.split('/');
var userURL = url.pop() || url.pop();


(async () => {
  const rawResponse = await fetch(`/profile/u/${userURL}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accessToken: localStorage.getItem("accessToken")
    })

  });


  const content = await rawResponse.json();

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


  followersNr.innerHTML = content.followData.followers.length;
  followingNr.innerHTML = content.followData.following[0].length;


})();




async function followThisProfile() {

  if (followBtn.innerHTML == "Follow") {
    followersNr.innerHTML = Number(followersNr.innerHTML) + 1;
    followBtn.innerHTML = "Unfollow"
  } else {
    followersNr.innerHTML = followersNr.innerHTML - 1
    followBtn.innerHTML = "Follow"
  }

  const rawResponse = await fetch(`/profile/u/${userURL}/follow`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accessToken: localStorage.getItem("accessToken")
    })



  });

  const content1 = await rawResponse.json();


}
