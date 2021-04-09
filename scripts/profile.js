var editNameDiv = document.getElementById("edit-name");
var nameDiv = document.getElementById("name");
var editNameInput = document.getElementById("name-input");

function sayHello(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            console.log(somebody.uid)
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                console.log(doc.data().name);
                var n = doc.data().name;
                $("#Name-goes-here").text(n);
                editNameInput.value = n;

            })
        }
    })
}
sayHello();

function sayEmail(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            console.log(somebody.uid)
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                console.log(doc.data().email);
                var n = doc.data().email;
                $("#Email-goes-here").text(n);
            })
        }
    })
}
sayEmail();

function isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

        } else {
            window.location.href = 'login.html';
        }
      });
}
isLoggedIn();

function editName() {
    editNameDiv.style.display = "block";
    nameDiv.style.display = "none";
}

function saveName() {
    editNameDiv.style.display = "none";
    nameDiv.style.display = "block";
    if (!editNameInput.value == "") {
        newName = editNameInput.value;
        var user = firebase.auth().currentUser;
        db.collection("users").doc(user.uid).update({
            name: newName,
        })

        sayHello();
        
    }


}