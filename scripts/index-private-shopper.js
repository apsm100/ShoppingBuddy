var shoppingListContainer = document.getElementById("shopping-list");

var statusView = document.getElementById("status");
var customerName = document.getElementById("customer-name");
var timeStamp = document.getElementById("timestamp");

//Checks if the private shopper has a pending order.
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

//Helper function for isPendingOrder and sends the customer id to display their information.
//@param pending Pending data from the private shopper user data.
function populatePending(pending) {
    var customerid = pending.data().userid;
    var timestamp = pending.data().timestamp;
    timeStamp.innerHTML = timestamp.toDate().toLocaleString();
    
    displayShoppingList(customerid);
    displayCustomer(customerid);

}

//Displays Customer information with customer ID.
//@param customerid Customers id.
function displayCustomer(customerid) {
    var userInfo = db.collection("users").doc(customerid);

    userInfo.get().then((doc) => {
        updateCustomer(doc);
        
    });
}

//Updates DOM to show customer information.
//@param customer Holds customer data from DB.
function updateCustomer(customer) {
    customerName.innerHTML = customer.data().name;

}

//Sends cusomter infromation to be populated and displayed.
//@param customerid Customers id.
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

//Populates the shopping list to DOM elements.
//@param item Shopping list item.
function populateShoppingList(item) {
    a = document.createElement("div");
    a.setAttribute("class", "card-body");
    a.setAttribute("id", "shopping-list-item");

    checkMark = document.createElement("div");
    checkMark.innerHTML = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 6L9 17L4 12' stroke='grey' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>";
    checkMark.setAttribute("id", "check-mark" + item.id);
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
    itemInput.setAttribute("onclick", "this.select();");
    itemName.innerHTML = item.data().quantity + " x " + item.data().item;
    c.innerHTML = item.data().category;
    a.appendChild(checkMark);
    a.appendChild(itemInput);
    a.appendChild(itemName);
    a.appendChild(c);

    a.setAttribute("id", item.id);

    shoppingListContainer.appendChild(a);
}

//Changes a shopping list item to completed.
//param id Shopping list dom ID.
function completeItem(id) {
    var item = document.getElementById(id);
    item.style.textDecoration = "line-through";
    item.style.backgroundColor = 'grey';
    item.style.color = 'white';
    item.style.pointerEvents = "none";
    var input = document.getElementById("input" + id);
    var checkMark = document.getElementById("check-mark" + id);
    

    checkMark.style.display = "none";
    input.style.backgroundColor = 'grey';
    input.style.borderColor = 'grey';
    input.style.color = 'white';
    
    // savePriceItem(id);

}

//Incomplete function, save to DB the changes made.
//@param id Shopping list item ID.
function savePriceItem(id) {
    var user = firebase.auth().currentUser;
    var pendingOrders = db.collection("users/" + user.uid + "/pendingOrders");

    shoppingListContainer.innerHTML = "";
    pendingOrders.get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                parseSave(id, doc);
                
            })

        })
}

//Incomplete helper function, saves price item to shopping list item.
//@param id, doc The ID for saving to shopping list item.
function parseSave(id, doc) {
    customerID = doc.data().userid;
    console.log(id)
    var input = document.getElementById("input" + id);
    console.log(input);
    var price = input.value;
    var shoppingListItem = db.collection("users/" + customerID + "/shoppingList").doc(id).add({price: price});
}

//Gets the shoppers name and displays it in the DOM.
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

//Checks if the shopper is logged in.
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

//Checks if the shopper is a private shopper, redirect if not.
function isPrivateShopper() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        redirect(doc.data().isShopper);
    });
}

//Redirect given the shopper status.
//@param isShopper Boolean true if the user is a shopper.
function redirect(isShopper) {
    if (isShopper) {
        
    } else {
        window.location.href = 'index.html';
    }
}

//Displays shoppers status, updates DOM.
//@param isAvailable Boolean true if the shopper is available.
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


//Changes the shoppers status.
//@param isAvailable true if the shopper is available.
function changeStatus(isAvailable) {
    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.uid).update({
        isAvailable: !isAvailable
    })

    displayStatus(!isAvailable);
}