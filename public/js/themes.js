
function changeTheme() {
  let theme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('theme-toggle');

  const link = document.getElementById('loadedTheme')

  //Hvis localStorage temaet er darkmode
  if (theme === 'darkMode') {
    darkMode()
  } else {
    lightMode()
  }


  themeToggle.addEventListener('click', toggleTheme)


  //Skifter mellem et lyst og mørkt tema
  function toggleTheme() {

    console.log("click");

    posts = Array.from(document.querySelectorAll('.central-meta'));

    theme = localStorage.getItem('theme');
    console.log(theme);
    if (theme !== 'darkMode') {
      darkMode()
    } else {
      lightMode();
    }
  }

  //Forskellige temaer
  function darkMode() {
    link.href = "/public/css/themes/darkTheme.css";

    themeToggle.style.backgroundImage = "url('/public/img/icons/themeToggleDark.svg')";

    localStorage.setItem('theme', 'darkMode')
  }

  function lightMode() {
    link.href = "/public/css/themes/lightTheme.css";

    themeToggle.style.backgroundImage = "url('/public/img/icons/themeToggleLight.svg')";
    localStorage.setItem('theme', 'lightMode')
  }

}


/*
  let theme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('theme-toggle');


  const body = document.getElementsByTagName('BODY')[0];
  const header = document.getElementsByTagName('HEADER')[0];
  const links = Array.from(document.getElementsByTagName('A'));
  const input = Array.from(document.getElementsByTagName('INPUT'));
  let posts = Array.from(document.querySelectorAll('.central-meta'));

  console.log(posts);

  console.log('js loaded');


  //Hvis localStorage temaet er darkmode
  if (theme === 'darkMode') {
    darkMode();
  }

  themeToggle.addEventListener('click', toggleTheme)



  //Skifter mellem et lyst og mørkt tema
  function toggleTheme() {

    posts = Array.from(document.querySelectorAll('.central-meta'));

    theme = localStorage.getItem('theme');
    console.log(theme);
    if (theme !== 'darkMode') {
      darkMode()
    } else {
      lightMode();
    }
    body.style.transition = 'all .5s'
    themeToggle.style.transition = 'all .5s'
  }


  //Forskellige temaer
  function darkMode() {
    body.classList.add('darkModeBody');
    header.classList.add('darkModeHeader');
    loop(links, 'darkModeLinks', "add")
    loop(input, 'darkModeInput', "add")
    loop(posts, 'darkModePost', "add")

    themeToggle.style.backgroundImage = "url('/public/img/themeToggleDark.svg')";


    localStorage.setItem('theme', 'darkMode')
  }

  function lightMode() {
    body.classList.remove('darkModeBody');
    header.classList.remove('darkModeHeader');
    loop(links, 'darkModeLinks', "remove")
    loop(input, 'darkModeInput', "remove")
    loop(posts, 'darkModePost', "remove")

    themeToggle.style.backgroundImage = "url('/public/img/themeToggleLight.svg')";
    localStorage.setItem('theme', 'lightMode')
  }



  //Functions
  function loop(arr, class_, toggle) {
    for (var i = 0; i < arr.length; i++) {
      if (toggle =='add') {
        arr[i].classList.add(class_)
      } else if (toggle =='remove') {
        arr[i].classList.remove(class_)
      }
    }
  }
}
*/


document.addEventListener("DOMContentLoaded", changeTheme, false);
//window.addEventListener('load', init)
