// NAVBAR

const hamburger = document.getElementById("hamburgerBtn");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
navList.classList.toggle("show");
});

navLinks.forEach(link => {
link.addEventListener("click", () => {
navList.classList.remove("show");
});
});

// navbar end  

// contact section---------->>>>>>.     

const form = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");

const successMessage = document.getElementById("formSuccess");

form.addEventListener("submit", function(e){

e.preventDefault();

clearErrors();

let valid = true;

/* NAME */

if(nameInput.value.trim().length < 3){

showError(nameInput,"Name must be at least 3 characters");
valid = false;

}

/* EMAIL */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailPattern.test(emailInput.value.trim())){

showError(emailInput,"Enter a valid email");
valid = false;

}

/* PHONE */

const phonePattern = /^[0-9]{10}$/;

if(phoneInput.value && !phonePattern.test(phoneInput.value.trim())){

showError(phoneInput,"Enter valid 10 digit phone number");
valid = false;

}

/* MESSAGE */

if(messageInput.value.trim().length < 10){

showError(messageInput,"Message must be at least 10 characters");
valid = false;

}

/* SUCCESS */

// if(valid){

// successMessage.textContent =
// "✅ Message sent successfully! Our team will contact you soon.";

// form.reset();

// }
const popup = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");

if(valid){

form.reset();

/* SHOW POPUP */

popup.style.display = "flex";

}

/* CLOSE POPUP */

popupClose.addEventListener("click",()=>{

popup.style.display = "none";

});

});

/* SHOW ERROR */

function showError(input,message){

const formGroup = input.parentElement;
const error = formGroup.querySelector(".error-msg");

error.textContent = message;

input.classList.add("input-error");

}

/* CLEAR ERRORS */

function clearErrors(){

document.querySelectorAll(".error-msg").forEach(msg => msg.textContent="");

document.querySelectorAll("input,textarea").forEach(el =>
el.classList.remove("input-error")
);

}

