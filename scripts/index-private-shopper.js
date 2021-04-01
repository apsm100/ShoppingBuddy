var shoppingListContainer = document.getElementById("shopping-list");

var statusView = document.getElementById("status");
var customerName = document.getElementById("customer-name");
var timeStamp = document.getElementById("timestamp");

function isPendingOrder() {
    var user = firebase.auth().currentUser;
    var pendingOrders = db.collection("users/" + user.uid + "/pendingOrders");

    shoppingListContainer.innerHTML = "";
    pendingOrders.get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populatePending(doc);
                
            })

        })
}

function populatePending(pending) {
    var customerid = pending.data().userid;
    var timestamp = pending.data().timestamp;
    timeStamp.innerHTML = timestamp.toDate().toDateString();
    
    displayShoppingList(customerid);
    displayCustomer(customerid);

}

function displayCustomer(customerid) {
    var userInfo = db.collection("users").doc(customerid);

    userInfo.get().then((doc) => {
        updateCustomer(doc);
        
    });
}

function updateCustomer(customer) {
    customerName.innerHTML = "You are shopping for<br>" + customer.data().name;

}

function displayShoppingList(customerid) {
    var shoppingList = db.collection("users/" + customerid + "/shoppingList").orderBy('timestamp', "asc");

    shoppingListContainer.innerHTML = "";
    shoppingList.get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populateShoppingList(doc);
            })

        })
}

function populateShoppingList(item) {
    a = document.createElement("div");
    a.setAttribute("class", "card-body");
    a.setAttribute("id", "shopping-list-item");

    

    checkMark = document.createElement("div");
    checkMark.innerHTML = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 6L9 17L4 12' stroke='grey' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>";
    checkMark.setAttribute("class", "check-mark");
    checkMark.setAttribute("onclick", "completeItem('"+ item.id + "')");
    
    itemName = document.createElement("span");
    itemName.setAttribute("id", "item-name");

    c = document.createElement("div");
    c.setAttribute("id", "item-category");

    itemInput = document.createElement("input");
    itemInput.setAttribute("id", "input" + item.id);
    itemInput.setAttribute("type", "number");
    itemInput.setAttribute("value", "0.00");
    itemName.innerHTML = item.data().quantity + " x " + item.data().item;
    c.innerHTML = item.data().category;
    a.appendChild(checkMark);
    a.appendChild(itemInput);
    a.appendChild(itemName);
    a.appendChild(c);

    a.setAttribute("id", item.id);

    shoppingListContainer.appendChild(a);
    



}

function completeItem(id) {
    var item = document.getElementById(id);
    item.style.textDecoration = "line-through";
    item.style.backgroundColor = 'grey';
    item.style.color = 'white';
    item.style.pointerEvents = "none";

    var input = document.getElementById("input" + id);
    var price = input.value;
    
    input.style.backgroundColor = 'grey';
    input.style.borderColor = 'grey';
    input.style.color = 'white';
}

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
                isPendingOrder();
            })
        }
    })
}
sayHello();

function isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            isPrivateShopper()
        } else {
            window.location.href = 'login.html';
        }
      });
}
isLoggedIn();

function isPrivateShopper() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        redirect(doc.data().isShopper);
    });
}

function redirect(isShopper) {
    if (isShopper) {
        
    } else {
        window.location.href = 'index.html';
    }
}

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