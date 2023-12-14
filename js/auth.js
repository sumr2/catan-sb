import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getDatabase,
  ref,
  set,
  update,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAKYlv_2NU1yEkC0hSeOIqkaF5r1fvjOl4',
  authDomain: 'catan-sb.firebaseapp.com',
  projectId: 'catan-sb',
  storageBucket: 'catan-sb.appspot.com',
  messagingSenderId: '1051762635231',
  appId: '1:1051762635231:web:6d7a1dc1ef10827925146a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

document.getElementById('signUp').addEventListener('click', async (e) => {
  try {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('userName').value;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if user is successfully created
    if (userCredential && userCredential.user) {
      const userId = userCredential.user.uid;
      // Save user data to the database
      await set(ref(database, 'users/' + userId), {
        username: username,
        email: email,
      });

      alert('User created!');
    } else {
      alert('User creation failed.');
    }
  } catch (error) {
    alert(error.message);
  }
});

// Sign In
document.getElementById('signIn').addEventListener('click', (e) => {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      const dt = new Date();
      // Assuming userId and username are defined elsewhere in your code
      const userId = user.uid;
      const username = user.displayName; // You may need to adjust this based on your user object

      update(ref(database, 'users/' + userId), {
        lastLogin: dt.getTime(), // Example: Update lastLogin timestamp
        // Add other properties you want to update
      });

      alert('User logged In!');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
});
