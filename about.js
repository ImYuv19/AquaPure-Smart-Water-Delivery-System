// NAVBAR

const hamburger = document.getElementById("hamburgerBtn");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");

// Toggle mobile menu
hamburger.addEventListener("click", () => {
  navList.classList.toggle("show");
});

// Close menu when link clicked (mobile UX)
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navList.classList.remove("show");
  });
});

// <---navbar the end---->