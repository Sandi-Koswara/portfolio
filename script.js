// INTERACTIVE NAVBAR
const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");

menuIcon.addEventListener("click", () => {
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("bx-x");
});

window.addEventListener("scroll", () => {
  let top = window.scrollY;

  sections.forEach((sec) => {
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((link) => link.classList.remove("active"));
      document
        .querySelector(`header nav a[href*="${id}"]`)
        .classList.add("active");
    }
  });
});

// ZOOM IMAGE PROJECTS
const radios = document.querySelectorAll('input[type="radio"]');
const imageProjects = document.querySelectorAll(".project-item-image img");

radios.forEach((radio, index) => {
  radio.addEventListener("click", () => {
    imageProjects.forEach((image) => image.classList.remove("transformed"));
    imageProjects[index].classList.add("transformed");
  });
});

// PROJECT AUTO SLIDER WHEN SCREEN SIZE <= 895PX
let currentIndex = 0;
let slideInterval;
const dots = document.querySelectorAll(".dots div");

const autoSlide = () => {
  dots[currentIndex].classList.remove("active");
  radios[currentIndex].checked = false;
  currentIndex = (currentIndex + 1) % radios.length;
  radios[currentIndex].checked = true;
  dots[currentIndex].classList.add("active");
};

const startAutoSlide = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 3000);
};

const stopAutoSlide = () => {
  clearInterval(slideInterval);
};

const handleScreenSizeChange = (e) => {
  if (e.matches) {
    startAutoSlide();
  } else {
    stopAutoSlide();
  }
};

const mediaQuery = window.matchMedia("(max-width: 895px)");

handleScreenSizeChange(mediaQuery);
mediaQuery.addEventListener("change", handleScreenSizeChange);

// INITIALIZE THE FIRST DOT AS ACTIVE
dots[currentIndex].classList.add("active");

// CONTACT HANDLER
const form = document.querySelector("form");
const alertTxt = document.querySelector(".alert");

const showNotification = (response, background) => {
  alertTxt.style.display = "flex";
  alertTxt.innerText = response;
  alertTxt.style.background = background;
  sections.forEach((sec) => sec.classList.add("disabled"));
};

const hideNotification = () => {
  setTimeout(() => {
    alertTxt.style.display = "none";
    sections.forEach((sec) => sec.classList.remove("disabled"));
  }, 500);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "message.php", true);
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = xhr.response;
      if (
        response.indexOf("required") != -1 ||
        response.indexOf("valid") != -1
      ) {
        showNotification(response, "#EE4E4E");
      } else if (response.indexOf("failed") != -1) {
        showNotification("Sending your message...", "#41B06E");
        setTimeout(showNotification(response, "#EE4E4E"), 2000);
      } else {
        showNotification("Sending your message...", "#41B06E");
        setTimeout(showNotification(response, "#41B06E"), 2000);
        form.reset();
      }

      setTimeout(hideNotification, 5000);
    }
  };
  let formData = new FormData(form);
  xhr.send(formData);
});
