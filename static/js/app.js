// Control Barra de navegación hamburguesa

const burger = document.querySelector("#burger-menu .bars");
const ul = document.querySelector("nav ul");

burger.addEventListener("click", () => {
  ul.classList.toggle("show");
});

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((link) =>
  link.addEventListener("click", () => {
    ul.classList.remove("show");
  })
);

// -----------------------------------------------------------------------------

// Copiar palabras

function copy(that) {
  var inp = document.createElement('input');
  document.body.appendChild(inp)
  inp.value = that.textContent.slice(that.textContent.indexOf(" ") + 1)
  inp.select();
  document.execCommand('copy', false);
  inp.remove();
}

// -----------------------------------------------------------------------------

// Mostrar lenguajes sabidos

var words = ['Python', 'HTML', 'CSS', ' Javascript', 'Git', ' Github', 'Flask', 'SQL', 'Programación en C'],
  part,
  i = 0,
  offset = 0,
  len = words.length,
  forwards = true,
  skip_count = 0,
  skip_delay = 15,
  speed = 70;
var wordflick = function () {
  setInterval(function () {
    if (forwards) {
      if (offset >= words[i].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    }
    else {
      if (offset == 0) {
        forwards = true;
        i++;
        offset = 0;
        if (i >= len) {
          i = 0;
        }
      }
    }
    part = words[i].substr(0, offset);
    if (skip_count == 0) {
      if (forwards) {
        offset++;
      }
      else {
        offset--;
      }
    }
    $('.word').text(part);
  }, speed);
};

$(function () {
  wordflick();
});