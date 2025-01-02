const Desiscion = 90;
let isAnimation = false;
let pullDeltaX = 0;

//The position of cards. Delta is distance between position.
//We need to know the initial, current and final position of card

function startDrag(event) {
  if (isAnimation) return;

  const actualCard = event.target.closest("article");
  if (!actualCard) return;


  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;

  //listen the mouse and touches movement
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(event) {
    // Current position of mouse or finger

    const currentX = event.pageX ?? event.touches[0].pageX;

    //The distancia between the inicial and curre
    // nt position

    pullDeltaX = currentX - startX;

    // No action in p 0
    if (pullDeltaX === 0) return;

    // Change the flag, indicate animation
    isAnimation = true;

    // Determine rotation
    const deg = pullDeltaX / 10;

    //Apply transformation
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    // Change the cursor
    actualCard.style.cursor = "grabbing";

    //Change opacity of titles

    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope");

    choiceEl.style.opacity = opacity;
  }

  function onEnd(event) {
    // Remove event listeners
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    // Know the decision
    const decisionMade = Math.abs(pullDeltaX) >= Desiscion;

    // Right positive, left negative
    if (decisionMade) {
      const goRight = pullDeltaX >= 0;
      const goLeft = !goRight;

      // Add class according to he decision
      actualCard.classList.add(goRight ? "go-right" : "go-left");

      // End Card
      actualCard.addEventListener("transitionend", () => {
        actualCard.remove();
      });
    } else {
      actualCard.classList.add("reset");
      actualCard.classList.remove("go-right", "go-left");
      actualCard.querySelectorAll(".choice").forEach((el) => {
        el.style.opacity = 0;
      });
    }

    // Reset the variables
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style");
      actualCard.classList.remove("reset");

      pullDeltaX = 0;
      isAnimation = false;
    });
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
// Add passive to the event
