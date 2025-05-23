window.addEventListener("scroll", function () {
  const stickyDiv = document.getElementById("sticky-div");

  if (window.scrollY > 50) {
    stickyDiv.classList.remove("fixed");
  } else {
    stickyDiv.classList.add("fixed");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".absolute.grid.h-full");
  let currentIndex = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        "z-20",
        "opacity-100",
        "translate-x-0",
        "scale-100",
      );
      slide.classList.remove(
        "z-10",
        "opacity-60",
        "translate-x-[100%]",
        "-translate-x-[100%]",
      );
      slide.classList.remove("z-0", "opacity-0");

      if (index === currentIndex) {
        slide.classList.add(
          "z-20",
          "opacity-100",
          "translate-x-0",
          "scale-100",
        );
      } else if (index === (currentIndex + 1) % slides.length) {
        slide.classList.add("z-10", "opacity-60", "translate-x-[100%]");
      } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
        slide.classList.add("z-10", "opacity-60", "-translate-x-[100%]");
      } else {
        slide.classList.add("z-0", "opacity-0");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  }

  updateSlides();
  setInterval(nextSlide, 5000);
});

// Select the button, the 'ham' div, the 'visible' element, and the hamburger icon div
const hamburgerButton = document.querySelector(".harmburger");
const ham = document.querySelector(".ham");
const visible = document.querySelector(".visible");
const hamburgerIconDiv = document.querySelector(".harmburger div");

// Add an event listener to the button
hamburgerButton.addEventListener("click", () => {
  // Toggle the 'ham' div visibility
  if (ham.style.display === "block") {
    ham.style.display = "none";
    ham.style.opacity = "0";
    ham.style.height = "0px";
  } else {
    ham.style.display = "block";
    ham.style.opacity = "1";
    ham.style.height = "100vh"; // Or any height you prefer
  }

  // Change the opacity of the 'visible' element
  if (visible.style.opacity === "1") {
    visible.style.opacity = "0"; // Hide it if it's already visible
    visible.style.height = "100%"; // Reset the height if needed
  } else {
    visible.style.opacity = "1"; // Set it to visible
    visible.style.height = "100%"; // Adjust the height to whatever you need
  }

  // Toggle the hamburger icon between the two states (hamburger or "X")
  if (hamburgerIconDiv.innerHTML.includes("rotate-45")) {
    // Change to the original hamburger state
    hamburgerIconDiv.innerHTML = `
      <span class="absolute left-0 top-0 h-[1.5px] w-4 transform transition-all duration-300 bg-black rotate-0"></span>
      <span class="absolute left-0 top-[7px] h-[1.5px] w-4 transition-all duration-300 bg-black opacity-100"></span>
      <span class="absolute left-0 top-[14px] h-[1.5px] w-4 transform transition-all duration-300 bg-black rotate-0"></span>
    `;
    ham.classList.add("pointer-events-none");
  } else {
    // Change to the "X" state (when clicked)
    hamburgerIconDiv.innerHTML = `
      <span class="absolute left-0 top-0 h-[1.5px] w-4 transform transition-all duration-300 bg-black top-[7px] rotate-45"></span>
      <span class="absolute left-0 top-[7px] h-[1.5px] w-4 transition-all duration-300 bg-black opacity-0"></span>
      <span class="absolute left-0 top-[14px] h-[1.5px] w-4 transform transition-all duration-300 bg-black top-[7px] -rotate-45"></span>
    `;
    ham.classList.remove("pointer-events-none");
  }
});

(function (c, l, a, r, i, t, y) {
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "ro434x2idf");
