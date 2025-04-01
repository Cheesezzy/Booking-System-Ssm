import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
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
const db = getFirestore(app);

async function trackStatus(date, starttime, endtime, statusElement, docId) {
  const startDateTime = new Date(`${date}T${starttime}`);
  const endDateTime = new Date(`${date}T${endtime}`);
  const currentTime = new Date();

  let status = "Not started";
  if (currentTime >= startDateTime && currentTime < endDateTime) {
    status = "In progress";
    statusElement.style.backgroundColor = "green";
  } else if (currentTime >= endDateTime) {
    status = "Done";
    statusElement.style.backgroundColor = "red";
    // Delete the document when the status is "Done"
    await deleteDoc(doc(db, "bookings", docId));
  } else {
    statusElement.style.backgroundColor = "yellow";
  }

  statusElement.textContent = status;

  // Update status periodically
  const intervalId = setInterval(async () => {
    const currentTime = new Date();
    if (currentTime >= startDateTime && currentTime < endDateTime) {
      status = "In progress";
      statusElement.style.backgroundColor = "green";
    } else if (currentTime >= endDateTime) {
      status = "Done";
      statusElement.style.backgroundColor = "red";
      // Delete the document when the status is "Done"
      await deleteDoc(doc(db, "bookings", docId));
      clearInterval(intervalId); // Stop the interval after deletion
    } else {
      status = "Not started";
      statusElement.style.backgroundColor = "yellow";
    }
    statusElement.textContent = status;
  }, 1000); // Update every second
}

function displayBookingData(doc) {
  const data = doc.data();
  const table = document.querySelector(".table-data");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.email}</td>
    <td>${data.room}</td>
    <td>${data.date}</td>
    <td>${data.starttime}</td>
    <td>${data.endtime}</td>
    <td><span class="status">Not started</span></td>
  `;

  table.appendChild(row);

  const statusElement = row.querySelector(".status");
  trackStatus(data.date, data.starttime, data.endtime, statusElement, doc.id);
}

const q = query(collection(db, "bookings"));
onSnapshot(q, (querySnapshot) => {
  const table = document.querySelector(".table-data");
  // Clear existing rows except the header
  table.querySelectorAll("tr:not(:first-child)").forEach((row) => row.remove());
  querySnapshot.forEach((doc) => {
    displayBookingData(doc);
  });
});
