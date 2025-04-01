import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB61Osg7TZch6mlJv5-N9j_MxaJh6EMqCk",
  authDomain: "ssm-db-f948a.firebaseapp.com",
  projectId: "ssm-db-f948a",
  storageBucket: "ssm-db-f948a.firebasestorage.app",
  messagingSenderId: "432905604133",
  appId: "1:432905604133:web:77c789d10b3043079883cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

document
  .getElementById("bookingForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const db = getFirestore(app);

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const starttime = document.getElementById("starttime").value;
    const endtime = document.getElementById("endtime").value;
    const room = document.getElementById("service").value;

    const formData = { name, email, room, date, starttime, endtime };

    try {
      const docRef = await addDoc(collection(db, "bookings"), formData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    // Display confirmation message
    document.getElementById("confirmedName").textContent = name;
    document.getElementById("confirmedService").textContent = room;
    document.getElementById("confirmedDate").textContent = date;
    document.getElementById(
      "confirmedTime"
    ).textContent = `${starttime} - ${endtime}`;

    // Create a hidden iframe if it doesn't exist
    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.id = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    document.getElementById("bookingForm").classList.add("hidden");
    document.getElementById("confirmation").classList.remove("hidden");
  });
