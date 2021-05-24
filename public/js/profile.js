let followBtn = document.getElementById("followBtn")
followBtn.addEventListener("click", followThisProfile);

let followersAmount = document.getElementById("followersAmount");
let followingAmount = document.getElementById("followingAmount");

console.log('hello');

var url = window.location.href.split('/');
var userURL = url.pop() || url.pop();  // handle potential trailing slash

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
  }

  let followers
  if (content.followData.followers.length == 1) {
    followers = "follower"
  } else {
    followers = "followers"
  }

  let fix = 0;
  if (content.followData.followers[0] == undefined) {
    fix = 1
  }


  console.log(content.followData.following.length);

  followersAmount.innerHTML = content.followData.followers.length + ` ${followers}`


  followingAmount.innerHTML = content.followData.following.length - fix + " following"



})();





async function followThisProfile()  {

  const rawResponse = await fetch(`/profile/u/${userURL}/follow`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({accessToken: localStorage.getItem("accessToken")})
  });
  const content = await rawResponse.json();

  console.log(content);

}







/*

function accessToken() {

  var ajax = new XMLHttpRequest();
  ajax.open("POST", `/profile/u/${userURL}`, true);
  ajax.setRequestHeader("Content-Type", "name=nick");

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var response = JSON.parse(this.responseText);
    }
  };

  var formData = new FormData();
  formData.append("accessToken", localStorage.getItem("accessToken"));
  ajax.send();


  return false;
}

accessToken()
*/
