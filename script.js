
//user
let user = document.querySelector('.user');

document.querySelector('#user-icon').onclick = () =>{
   user.classList.toggle('active');
   navbar.classList.remove('active');
  }


  let navbar = document.querySelector('.navbar');

  document.querySelector('#menu-icon').onclick = () =>{
    navbar.classList.toggle('active');
    user.classList.remove('active');
   }


//Navbar Scroll
let nav = document.querySelector ('nav');

window.addEventListener('scroll', () =>{
  nav.classList.toggle('shadow', window.scrollY>0);
});







const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;

// Function to show a specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
            dots[i].classList.add('active');
        }
    });
}

// Add event listeners to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index; // Update the current index to the clicked dot
        showSlide(currentIndex);
    });
});

// Show the first slide initially
showSlide(currentIndex);
