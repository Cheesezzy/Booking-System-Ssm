import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
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
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value.trim();
    const starttime = document.getElementById("starttime").value.trim();
    const endtime = document.getElementById("endtime").value.trim();
    const room = document.getElementById("service").value.trim().toUpperCase();

    // Validate form inputs
    if (!name || !email || !date || !starttime || !endtime || !room) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    const formData = { name, email, room, date, starttime, endtime };

    try {
      // Check if the room is already booked
      const q = query(
        collection(db, "bookings"),
        where("room", "==", room),
        where("date", "==", date)
      );

      const querySnapshot = await getDocs(q);

      let isOverlapping = false;

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const existingStartTime = booking.starttime;
        const existingEndTime = booking.endtime;

        // Check for time overlap
        if (
          starttime < existingEndTime &&
          endtime > existingStartTime // Overlapping condition
        ) {
          isOverlapping = true;
        }
      });

      if (isOverlapping) {
        // Room is already booked
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "The selected room is already booked for the specified time.",
        });
        return;
      }

      // Add the booking if no conflicts
      const docRef = await addDoc(collection(db, "bookings"), formData);
      console.log("Document written with ID: ", docRef.id);

      // Display success alert
      Swal.fire({
        icon: "success",
        title: "Booking Confirmed",
        html: `
          <p>Thank you, <strong>${name}</strong>!</p>
          <p>Your appointment for <strong>${room}</strong> is scheduled on <strong>${date}</strong> at <strong>${starttime} - ${endtime}</strong>.</p>
        `,
      });

      // Reset the form and navigate to the booking data page
      document.getElementById("bookingForm").reset();
      window.location.href = "./bookingdata.html";
    } catch (error) {
      console.error("Error adding document: ", error);

      // Display error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while processing your booking. Please try again later.",
      });
    }
  });
