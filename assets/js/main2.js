document.addEventListener("DOMContentLoaded", function () {
      const draggable = document.querySelector(".dragging");
      const dropTarget = document.querySelector(".target");
      const loading = document.querySelector(".loading");
      const arrow = document.querySelector(".arrow");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");
      const all = document.querySelector(".all");
      const first = document.querySelector(".first");
      const second = document.querySelector(".second");
      const third = document.querySelector(".third");
      let isDragging = false;
      let startX = 0;

      function move() {
        let width = 0;
        const id = setInterval(function () {
          if (width >= 100) {
            clearInterval(id); // Stop progress at 100%
            // Wait for 0.5 seconds after progress reaches 100% before triggering the next animation
            setTimeout(triggerNextPhase, 500);
          } else {
            width++;
            progressBar.style.width = width + "%"; // Change the width of the progress bar
            progressText.innerHTML = width + "%"; // Update the text to show the percentage
          }
        }, 30); // 30ms interval to complete 100% in 3 seconds
      }

      function triggerNextPhase() {
        // Step 1: Change the widths of the loading and all elements
        loading.style.transition = "width 0.5s ease-in-out";
        loading.style.width = "750px";

        // Ensure we update the width of the `.all` element to 676px
        if (all) {
          all.style.transition = "width 0.5s ease-in-out";
          all.style.width = "1150px"; // Update to 676px
          all.style.opacity = "1";
        }

        // Animate the other containers (third, second, and first)
        animateContainer(third, 0);
        setTimeout(() => animateContainer(second, 1000), 1000);
        setTimeout(() => animateContainer(first, 1500), 1500);

        // Step 2: After 2 seconds, hide `.all` and show `.score`
        setTimeout(() => {
          // Fade out `.all` by changing opacity to 0
          all.style.transition = "opacity 1s ease";
          all.style.opacity = "0";

          // Expand `.score` and fade it in
          const score = document.querySelector(".score");
          score.style.transition = "width 1s ease-in-out, opacity 1s ease";
          score.style.width = "1145px";  // Expand to 690px
          score.style.position = "relative";
          score.style.opacity = "1";  // Make it fully visible
        }, 6000); // Wait for 2 seconds before making the changes
      }

      function animateContainer(container, delay) {
        container.style.transition = "transform 1s ease-in-out, opacity 1s ease";
        container.style.opacity = "1";
        container.style.transform = "translateX(0)"; // Slide to original position

        // Applying the delay
        container.style.transitionDelay = `${delay}ms`;
      }

      // Prevent default drag behavior
      draggable.addEventListener("dragstart", function (event) {
        event.preventDefault();
      });

      draggable.addEventListener("mousedown", function (event) {
        isDragging = true;
        startX = event.clientX;
        draggable.style.transition = "none"; // Disable transition while dragging
        draggable.style.zIndex = "1000";

        // To prevent the drag icon from showing, we disable dragging
        draggable.setAttribute("draggable", "false");

        function onMouseMove(event) {
          if (!isDragging) return;

          let deltaX = event.clientX - startX;

          // Allow only right movement
          if (deltaX > 0) {
            draggable.style.transform = `translateX(${deltaX}px)`;
          }
        }

        function onMouseUp(event) {
          isDragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);

          // Calculate the distance dragged based on mouse movement
          let deltaX = event.clientX - startX;

          // Check if dragged at least 200px
          let draggedEnough = Math.abs(deltaX) >= 200;

          if (draggedEnough) {
            const expandedWidth = "700px";
            const loadingWidth = "525px";

            draggable.style.transition = "transform 1.5s ease-in-out, opacity 1.3s ease, width 1s ease";
            draggable.style.opacity = "0";
            draggable.style.width = expandedWidth; // Update width


            loading.style.transition = "transform 1.5s ease-in-out, opacity 1.3s ease, width 0.5s ease";
            loading.style.transform = "translateX(50%)";

            loading.style.opacity = "1";
            loading.style.width = loadingWidth;

            // Hide the target and arrow during the transition
            dropTarget.style.transition = "opacity 1s ease";
            arrow.style.transition = "opacity 1s ease";
            dropTarget.style.opacity = "0";
            arrow.style.opacity = "0";

            // Trigger the progress bar animation after the loading element is visible
            setTimeout(move, 1500); // Start the progress bar after 2.5 seconds (after loading shows up)
          } else {
            // If not dragged enough, return to original position
            draggable.style.transition = "transform 0.3s ease-in-out";
            draggable.style.transform = "translateX(0)";
          }
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
      const movingElement = document.querySelector(".change");
      const container = movingElement.parentElement;

      container.addEventListener("mousemove", function (event) {
        const svg = document.querySelector(".WhyspotterSection-module--radarSvg--0993c");
        const move = svg.parentElement;

        let rect = svg.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        let containerHeight = rect.height;
        let relativeY = event.clientY - rect.top;

        // Clamp values
        x = Math.max(-2, Math.min(560, x));
        y = Math.max(2, Math.min(230, y));

        // Update CSS variables
        movingElement.style.setProperty("--x", `${x}px`);
        movingElement.style.setProperty("--y", `${y}px`);
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
      const chart = document.querySelector(".AccuracyChart-module--spotter--9044b");
      const modal = document.querySelector(".AccuracyChart-module--card--1ff00");
      const spotterValue = document.querySelector(".AccuracyChart-module--finValue--6c97d");
      const competitorValue = document.querySelector(".AccuracyChart-module--comValue--b5ee0");
      const daysLabel = document.querySelector(".AccuracyChart-module--days--4391d");
      const activeLine = document.querySelector(".AccuracyChart-module--lineActiveX--80445");
      const hoverArea = document.querySelector(".AccuracyChart-module--hoverArea--9b490");
      const redBall = document.querySelector(".red-ball");
      const tealBall = document.querySelector(".teal-ball");

      const chartLabels = document.querySelector(".AccuracyChart-module--chartLabels--8ffdd");
      const spans = chartLabels.querySelectorAll("span");

      const totalWidth = chart.clientWidth;
      const totalHeight = chart.clientHeight;
      const centerOffset = totalHeight * 0.2;

      const xAxisStart =
        activeLine.getBoundingClientRect().left - chart.getBoundingClientRect().left;
      const chartWidth = chart.clientWidth;

      const totalDays = 50;

      const spotterCurve = (x) =>
        totalHeight * (0.25 - 0.04 * Math.sin(x * Math.PI)) - centerOffset;
      const competitorCurve = (x) =>
        totalHeight * (0.6 - 0.32 * Math.cos(x * Math.PI)) - centerOffset;

      chart.addEventListener("mouseenter", function () {
        // Ensure the modal and balls are hidden initially
        modal.classList.remove("AccuracyChart-module--active--d51ee");
        hoverArea.classList.remove("AccuracyChart-module--active--d51ee");
        redBall.style.visibility = "hidden";
        tealBall.style.visibility = "hidden";
        spans.forEach(span => span.classList.add("black"));

      });

      chart.addEventListener("mouseleave", function () {
        // Ensure modal, hover area, and balls are hidden when mouse leaves chart
        modal.classList.remove("AccuracyChart-module--active--d51ee");
        hoverArea.classList.remove("AccuracyChart-module--active--d51ee");
        activeLine.style.visibility = "hidden";
        redBall.style.visibility = "hidden";
        tealBall.style.visibility = "hidden";
        spans.forEach(span => span.classList.remove("black"));
      });

      chart.addEventListener("mousemove", function (event) {
        const rect = chart.getBoundingClientRect();
        let x = event.clientX - rect.left;

        // Ignore if the mouse is before the line (the modal, hover area, and balls should not show)
        if (x < xAxisStart) {
          modal.classList.remove("AccuracyChart-module--active--d51ee");
          hoverArea.classList.remove("AccuracyChart-module--active--d51ee");
          redBall.style.visibility = "hidden";
          tealBall.style.visibility = "hidden";
          return;
        }

        // Show the modal and circle balls when the mouse is past the line
        modal.classList.add("AccuracyChart-module--active--d51ee");
        hoverArea.classList.add("AccuracyChart-module--active--d51ee");
        redBall.style.visibility = "visible";
        tealBall.style.visibility = "visible";

        // Calculate the percentage of the chart width after the line
        const percentage = ((x - xAxisStart) / (chartWidth - xAxisStart)) * 100;

        // Calculate the day based on the percentage of the remaining width
        const dayIndex = Math.floor((percentage / 100) * totalDays);
        const day = dayIndex + 1; // Days start from 1

        // Update the modal and values based on this day
        daysLabel.textContent = `${day} Days`;
        spotterValue.textContent = (-35.7 * (dayIndex / totalDays)).toFixed(1) + "%";
        competitorValue.textContent = (-5.1 * (dayIndex / totalDays)).toFixed(1) + "%";

        // Update the hover area and modal position
        modal.style.left = `calc(${x}px - 80px)`;
        modal.style.transform = "translateX(-50%)";
        modal.style.top = `-40px`;

        // Position the spotter and competitor balls along their respective curves
        activeLine.style.left = `${x}px`;
        const normalizedX = dayIndex / totalDays;
        spotterValue.style.left = `${x}px`;
        competitorValue.style.left = `${x}px`;

        spotterValue.style.top = `${spotterCurve(normalizedX)}px`;
        competitorValue.style.top = `${competitorCurve(normalizedX)}px`;

        // Position the circle balls
        redBall.style.left = `${x - 4}px`;
        tealBall.style.left = `${x - 4}px`;

        redBall.style.top = `${spotterCurve(normalizedX)}px`;
        tealBall.style.top = `${competitorCurve(normalizedX)}px`;
      });
    });





    document.addEventListener('DOMContentLoaded', function () {
      const redBall = document.querySelector('.red-ball');
      const tealBall = document.querySelector('.teal-ball');
      const redPath = document.querySelector('#red-line');
      const tealPath = document.querySelector('#teal-line');

      let isHovered = false;


      // Function to update ball position
      const updateBallPosition = (event) => {
        if (!isHovered) return;

        const rect = redPath.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const redPoint = redPath.getPointAtLength((mouseX / rect.width) * redPath.getTotalLength());
        const tealPoint = tealPath.getPointAtLength((mouseX / rect.width) * tealPath.getTotalLength());

        redBall.setAttribute('cx', redPoint.x);
        redBall.setAttribute('cy', redPoint.y);

        tealBall.setAttribute('cx', tealPoint.x);
        tealBall.setAttribute('cy', tealPoint.y);
      };

      // Show balls when hovered
      document.querySelector('.AccuracyChart-module--spotter--9044b').addEventListener('mouseenter', () => {
        isHovered = true;
        redBall.style.visibility = 'visible';
        tealBall.style.visibility = 'visible';
      });

      // Hide balls when mouse leaves the graph
      document.querySelector('.AccuracyChart-module--spotter--9044b').addEventListener('mouseleave', () => {
        isHovered = false;
        redBall.style.visibility = 'hidden';
        tealBall.style.visibility = 'hidden';
      });

      // Update ball position based on mouse movement
      document.querySelector('.AccuracyChart-module--spotter--9044b').addEventListener('mousemove', updateBallPosition);
    });

    document.getElementById('check').addEventListener('click', function () {
      localStorage.setItem('fromSentinel', 'true');
    });
    document.getElementById('booking').addEventListener('click', function () {
      localStorage.setItem('fromSentinel', 'true');
    });
    document.getElementById('learn-more').addEventListener('click', function () {
      localStorage.setItem('fromSentinel', 'true');
    });