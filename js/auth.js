import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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
const db = getFirestore(app);

// Sign Up
document.getElementById('signUp')?.addEventListener('click', async (e) => {
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
document.getElementById('signIn')?.addEventListener('click', (e) => {
  var email = document.getElementById('emailsignin').value;
  var password = document.getElementById('passwordsignin').value;

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

// Get Collection Reference
const gamesCollection = collection(db, 'games');

// Adding Documents
const addGameForm = document.getElementById('popup');
addGameForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    // Get input values
    const gameNumber = addGameForm.gameNumber.value;
    const gameType = addGameForm.gameType.value;
    const player1 = addGameForm.player1.value;
    const player2 = addGameForm.player2.value;
    const player3 = addGameForm.player3.value;
    const player4 = addGameForm.player4.value;
    const player5 = addGameForm.player5.value;
    const player6 = addGameForm.player6.value;
    const winner = addGameForm.winner.value;
    const runnerUp = addGameForm.runnerUp.value;

    // Get the currently logged-in user
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      // Create an object with the game data
      const gameData = {
        User: userId,
        GameNumber: gameNumber,
        GameType: gameType,
        Player1: player1,
        Player2: player2,
        Player3: player3,
        Player4: player4,
        Player5: player5,
        Player6: player6,
        Winner: winner,
        RunnerUp: runnerUp,
      };

      // Store game data in Firestore using addDoc
      await addDoc(gamesCollection, gameData);

      alert('Game data submitted successfully!');
    } else {
      alert('User not logged in.');
    }
    addGameForm.reset();
  } catch (error) {
    alert('Error submitting game data: ' + error.message);
  }
});

// Define your function for getting collection data
const getCollectionData = async () => {
  try {
    const snapshot = await getDocs(gamesCollection);
    console.log(snapshot.docs);
    let games = [];
    snapshot.docs.forEach((doc) => {
      games.push({ ...doc.data(), id: doc.id });
      console.log(games);
    });
    AddAllItemsToTable(games);
  } catch (err) {
    console.log(err.message);
  }
};
// DataRealTime
const getCollectionDataRealTime = async () => {
  try {
    const snapshot = await getDocs(gamesCollection);
    console.log(snapshot.docs);
    let games = [];
    snapshot.docs.forEach((doc) => {
      games.push({ ...doc.data(), id: doc.id });
      console.log(games);
    });
    AddAllItemsToTable(games);
  } catch (err) {
    console.log(err.message);
  }
};

// Fill the table
var tbody = document.getElementById('tbody1');

function AddItemToTable(
  GameNumber,
  GameType,
  Player1,
  Player2,
  Player3,
  Player4,
  Player5,
  Player6,
  Winner,
  RunnerUp
) {
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  var td6 = document.createElement('td');
  var td7 = document.createElement('td');
  var td8 = document.createElement('td');
  var td9 = document.createElement('td');
  var td10 = document.createElement('td');

  td1.innerHTML = GameNumber;
  td2.innerHTML = GameType;
  td3.innerHTML = Player1;
  td4.innerHTML = Player2;
  td5.innerHTML = Player3;
  td6.innerHTML = Player4;
  td7.innerHTML = Player5;
  td8.innerHTML = Player6;
  td9.innerHTML = Winner;
  td10.innerHTML = RunnerUp;

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  trow.appendChild(td6);
  trow.appendChild(td7);
  trow.appendChild(td8);
  trow.appendChild(td9);
  trow.appendChild(td10);

  tbody.appendChild(trow);
}

function AddAllItemsToTable(GamesDocsList) {
  tbody.innerHTML = '';
  GamesDocsList.forEach((element) => {
    AddItemToTable(
      element.GameNumber,
      element.GameType,
      element.Player1,
      element.Player2,
      element.Player3,
      element.Player4,
      element.Player5,
      element.Player6,
      element.Winner,
      element.RunnerUp
    );
  });
}

// Attach the function to the window.onload event
window.onload = getCollectionDataRealTime;
