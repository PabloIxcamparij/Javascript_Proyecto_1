import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb7lVRfkmZQtLBzP46OYUsCyjqev3YTA0",
  authDomain: "fotosfamiliaresixc.firebaseapp.com",
  projectId: "fotosfamiliaresixc",
  storageBucket: "fotosfamiliaresixc.firebasestorage.app",
  messagingSenderId: "791880344035",
  appId: "1:791880344035:web:2bc7d11406baeb17fb00d6",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

  async function onEnd() {
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

      const calificacionesCollection = collection(db, "Calificaciones");

      // Fetch all documents from the collection
      const querySnapshot = await getDocs(calificacionesCollection);

      // Find the matching document
      let matchingDoc = null;
      querySnapshot.forEach((doc) => {
        if (doc.id === actualCard.id) {
          matchingDoc = doc;
        }
      });

      if (!matchingDoc) {
        console.error(`No document found with ID: ${actualCard.id}`);
        return;
      }

      if (actualCard.classList.contains("go-right")) {
        const updateData = { like: matchingDoc.data().like + 1 };

        const docRef = doc(db, "Calificaciones", actualCard.id);
        await updateDoc(docRef, updateData);
      } else {
        const updateData = { noLike: matchingDoc.data().noLike + 1 };

        const docRef = doc(db, "Calificaciones", actualCard.id);
        await updateDoc(docRef, updateData);
      }

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
      pullDeltaX = 0;
      isAnimation = false;
    });

    if (!actualCard.style.transition) {
      pullDeltaX = 0;
      isAnimation = false;
    }
  }

}

document.addEventListener("mousedown", startDrag);
// Add passive to the event
document.addEventListener("touchstart", startDrag, { passive: true });

document.addEventListener("DOMContentLoaded", function() {
  const removeButton = document.querySelector('.home'); // Seleccionamos el botón con la clase .is-remove

  removeButton.addEventListener('click', function() {
      window.location.href = 'index.html'; // Redirige a like.html
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const removeButton = document.querySelector('.is-fav'); // Seleccionamos el botón con la clase .is-remove

  removeButton.addEventListener('click', function() {
      window.location.href = 'like.html'; // Redirige a like.html
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const removeButton = document.querySelector('.is-remove'); // Seleccionamos el botón con la clase .is-remove

  removeButton.addEventListener('click', function() {
      window.location.href = 'noLike.html'; // Redirige a like.html
  });
});