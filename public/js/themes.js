let theme = localStorage.getItem('theme');
const themeToggle = document.getElementById('theme-toggle');

const body = document.getElementsByTagName('BODY')[0];
const header = document.getElementsByTagName('HEADER')[0];
const links = Array.from(document.getElementsByTagName('A'));
const input = Array.from(document.getElementsByTagName('INPUT'));


//Hvis localStorage temaet er darkmode
if (theme === 'darkMode') {
  darkMode();
}

themeToggle.addEventListener('click', toggleTheme)



//Skifter mellem et lyst og mørkt tema
function toggleTheme() {
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

  themeToggle.style.backgroundImage = "url('/public/img/themeToggleDark.svg')";


  localStorage.setItem('theme', 'darkMode')
}

function lightMode() {
  body.classList.remove('darkModeBody');
  header.classList.remove('darkModeHeader');
  loop(links, 'darkModeLinks', "remove")
  loop(input, 'darkModeInput', "remove")

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
