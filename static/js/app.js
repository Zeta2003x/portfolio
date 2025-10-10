// Control Barra de navegación hamburguesa
const burgerButton = document.getElementById("burger-menu");
const navList = document.querySelector(".site-nav__list");

if (burgerButton && navList) {
  burgerButton.addEventListener("click", () => {
    const isExpanded = burgerButton.getAttribute("aria-expanded") === "true";
    burgerButton.setAttribute("aria-expanded", (!isExpanded).toString());
    navList.classList.toggle("show");
  });
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((link) =>
  link.addEventListener("click", () => {
    navList?.classList.remove("show");
    burgerButton?.setAttribute("aria-expanded", "false");
  })
);

// ----------------------------------------------------------------------------

// Control cambiar tema
const darkModeBtn = document.getElementById("dark-mode-icon");
const navIcons = document.querySelectorAll(".nav-icon");
const footerIcons = document.querySelectorAll("footer div a img");

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const filterValue = document.body.classList.contains("dark-theme") ? "invert(80%)" : "invert(0%)";
  navIcons.forEach((icon) => { icon.style.filter = filterValue; });
  footerIcons.forEach((icon) => { icon.style.filter = filterValue; });
});

// Ensure dark/light mode preference persists when switching languages
const languageIcon = document.getElementById("language-icon");

languageIcon.addEventListener("click", (event) => {
  event.preventDefault();
  const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  const targetUrl = languageIcon.parentElement.getAttribute("href");
  window.location.href = `${targetUrl}?theme=${currentTheme}`;
});

// Apply theme based on URL parameter
const urlParams = new URLSearchParams(window.location.search);
const theme = urlParams.get("theme");
if (theme === "dark") {
  document.body.classList.add("dark-theme");
} else if (theme === "light") {
  document.body.classList.remove("dark-theme");
}

// -----------------------------------------------------------------------------

// Mostrar lenguajes sabidos
const words = ['Python', 'Power Query', 'Power Bi', 'Visual Basic', 'CSS', 'Javascript', 'SQL', 'C++', 'Apex', 'Salesforce', 'VBA', 'TypeScript', 'Go'];
let i = 0;
let offset = 0;
let forwards = true;
let skipCount = 0;
const skipDelay = 15;
const speed = 70;

function wordFlick() {
  const wordElement = document.querySelector('.word');
  setInterval(() => {
    if (forwards) {
      if (offset >= words[i].length) {
        skipCount++;
        if (skipCount === skipDelay) {
          forwards = false;
          skipCount = 0;
        }
      }
    } else {
      if (offset === 0) {
        forwards = true;
        i = (i + 1) % words.length;
      }
    }
    const part = words[i].substring(0, offset);
    if (skipCount === 0) {
      offset += forwards ? 1 : -1;
    }
    wordElement.textContent = part;
  }, speed);
}

wordFlick();

// -----------------------------------------------------------------------------

// Copiar palabras
function copy(that) {
  const inp = document.createElement('input');
  document.body.appendChild(inp);
  inp.value = that.textContent.slice(that.textContent.indexOf(" ") + 1);
  inp.select();
  document.execCommand('copy');
  inp.remove();
}
