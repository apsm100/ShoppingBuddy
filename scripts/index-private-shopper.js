var statusView = document.getElementById("status");

function sayHello(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            db.collection("users")
            .doc(user.uid)
            .get()
            .then(function(doc){
                var n = doc.data().name;
                $("#Name-goes-here").text(n + ", you are a private shopper.");
                displayStatus(doc.data().isAvailable);
            })
        }
    })
}
sayHello();

function isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

        } else {
            window.location.href = 'login.html';
        }
      });
}
isLoggedIn();

function displayStatus(isAvailable) {
    if (isAvailable) {
        statusView.innerHTML = "Available for matching";
        statusView.style.color = "green";


    } else {
        statusView.innerHTML = "Not available for matching";
        statusView.style.color = "red";
    }
    statusView.setAttribute("onclick", "changeStatus(" + isAvailable + ")");
}

function changeStatus(isAvailable) {
    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.uid).update({
        isAvailable: !isAvailable
    })

    displayStatus(!isAvailable);
}
//firebase.auth().signOut()         USE THIS TO LOG OUT USER.