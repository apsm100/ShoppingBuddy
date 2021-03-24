// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyC_WjIs45L1QWmgdopuQG5PybC5mO0ZP1g",
    authDomain: "shoppingbuddy-3225a.firebaseapp.com",
    projectId: "shoppingbuddy-3225a",
    storageBucket: "shoppingbuddy-3225a.appspot.com",
    messagingSenderId: "1016709744849",
    appId: "1:1016709744849:web:1b9089062fc42f76531df0",
    measurementId: "G-6ZLSLYTT8S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();  //add this to read/write