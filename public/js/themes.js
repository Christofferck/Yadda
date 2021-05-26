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
    posts = Array.from(document.querySelectorAll('.central-meta'));

    theme = localStorage.getItem('theme');
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



document.addEventListener("DOMContentLoaded", changeTheme, false);
//window.addEventListener('load', init)
