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

function sayAddress(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            console.log(somebody.uid)
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                console.log(doc.data().address);
                var n = doc.data().address;
                $("#Address-goes-here").text(n);
            })
        }
    })
}
sayAddress();

function sayDeliveryInstructions(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            console.log(somebody.uid)
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                console.log(doc.data().deliveryInstructions);
                var n = doc.data().deliveryInstructions;
                $("#DeliveryInstructions-goes-here").text(n);
            })
        }
    })
}
sayDeliveryInstructions();