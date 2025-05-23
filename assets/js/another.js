 document.addEventListener("DOMContentLoaded", function () {
    const monthlyBtn = document.querySelector('button[data-type="monthly"]');
    const yearlyBtn = document.querySelector('button[data-type="yearly"]');
    const monthlyPlan = document.querySelector('.monthly');
    const yearlyPlan = document.querySelector('.yearly');

    function togglePlan(showBtn, hideBtn, showSection, hideSection) {
      // Update buttons
      showBtn.setAttribute('aria-selected', 'true');
      hideBtn.setAttribute('aria-selected', 'false');

      // Show selected plan, hide the other
      showSection.style.display = 'block';
      hideSection.style.display = 'none';
    }

    // Initial state: show Monthly
    togglePlan(monthlyBtn, yearlyBtn, monthlyPlan, yearlyPlan);

    // Handle button clicks
    monthlyBtn.addEventListener('click', () => {
      togglePlan(monthlyBtn, yearlyBtn, monthlyPlan, yearlyPlan);
    });

    yearlyBtn.addEventListener('click', () => {
      togglePlan(yearlyBtn, monthlyBtn, yearlyPlan, monthlyPlan);
    });
  });

 const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');


// Open the modal when the button is clicked
const openModalBtns = document.querySelectorAll('#openModalBtn'); 


// Open the modal when the button is clicked
openModalBtns.forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';

    });
});

closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';
});


// Close the modal if the user clicks outside of it
modalOverlay.addEventListener('click', function(event) {
  if (event.target === modalOverlay) { 
      modal.style.display = 'none';
      modalOverlay.style.display = 'none';
  }
});

 const modal2 = document.getElementById('modal2');
const modalOverlay2 = document.getElementById('modalOverlay2');
const closeModalBtn2= document.getElementById('closeModalBtn2');


// Open the modal when the button is clicked
const openModalBtns2 = document.querySelectorAll('#openModalBtn2'); 


// Open the modal when the button is clicked
openModalBtns2.forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        modal2.style.display = 'block';
        modalOverlay2.style.display = 'block';

    });
});

closeModalBtn2.addEventListener('click', function() {
  modal2.style.display = 'none';
  modalOverlay2.style.display = 'none';
});


// Close the modal if the user clicks outside of it
modalOverlay2.addEventListener('click', function(event) {
  if (event.target === modalOverlay2) { 
      modal2.style.display = 'none';
      modalOverlay2.style.display = 'none';
  }
});