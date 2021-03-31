
function sayHello(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                var n = doc.data().name;
                $("#Name-goes-here").text(n + ", you are a private shopper.");
            })
        }
    })
}
sayHello();
//firebase.auth().signOut()         USE THIS TO LOG OUT USER.