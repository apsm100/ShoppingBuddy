var mainContainer = document.getElementById("main-container");

var itemNameInput = document.getElementById("item-name-input");
var categoryInput = document.getElementById("category-name-input");
var quantityInput = document.getElementById("quantity-input");

var searchSuggestion = document.getElementById("suggestions");

var shoppingListContainer = document.getElementById("shopping-list");
var shoppingListHeader = document.getElementById("shopping-list-header");

var addToShoppingListContainer = document.getElementById("addto-shopping-list");
var addItemButton = document.getElementById("add-item-button");
var addButton = document.getElementById("add-button");

var modalOverlay = document.getElementById("modal-overlay");
var matchModalOverlay = document.getElementById("match-overlay");
var cancelModalOverlay = document.getElementById("cancel-overlay");

var matchStatus = document.getElementById("match-status");
var matchName = document.getElementById("match-name");
var matchInfo = document.getElementById("match-info");
var matchButton = document.getElementById("match-btn");
var matchView = document.getElementById("view-match");

var orderButton = document.getElementById("order-btn");

var orderInfo = document.getElementById("order-info");
var shopperInfo = document.getElementById("shopper-info");

//Parses searchJSON from search.js
var search = JSON.parse(searchJSON);
search = search["search"];

//Shows shopping item overlay with animation.
function showAddToModal() {
    modalOverlay.style.display = "block";
    itemNameInput.focus();
    setTimeout(function(){ 
        modalOverlay.style.opacity = 1; 
    }, 0);
}

//Listener for window click to close a modal overlay.
window.onclick = function(event) {
    if (event.target == modalOverlay) {
      modalOverlay.style.opacity = 0;
      setTimeout(function(){ 
        modalOverlay.style.display = "none";
    }, 250);
    } else if (event.target == matchModalOverlay) {
        hideMatchModal()
    }
  }

//Hides the match modal overlay with animation.
function hideMatchModal() {
    matchModalOverlay.style.opacity = 0;
    setTimeout(function(){ 
        matchModalOverlay.style.display = "none";
    }, 250);
}

//Shows the match modal overlay with animation.
function showMatchModal() {
    matchModalOverlay.style.display = "block";
    setTimeout(function(){ 
        matchModalOverlay.style.opacity = 1; 
    }, 0);
}

//Hides the cancel modal overlay with animation.
function hideCancelModal() {
    cancelModalOverlay.style.opacity = 0;
    setTimeout(function(){ 
        cancelModalOverlay.style.display = "none";
    }, 250);
}

//Shows the cancel modal overlay with animation.
function showCancelModal() {
    cancelModalOverlay.style.display = "block";
    setTimeout(function(){ 
        cancelModalOverlay.style.opacity = 1; 
    }, 0);
}

//When a user is typing in the add item modal overlay, this function is called to initiate search.
function searchTyping() {
    if (itemNameInput.value == ""){
        searchSuggestion.innerHTML = "";
        addItemButton.setAttribute("class", "btn btn-primary disabled btn-lg");
    } else {
        searchdb(itemNameInput.value);
        addItemButton.setAttribute("class", "btn btn-primary btn-lg");
    }
}

//When a user selects a suggestion from the add item modal overlay after searchTyping.
//@param suggestion The name of a suggestion item.
//@param category The category of a suggestion item.
function suggestionClick(suggestion, category) {
    itemNameInput.value = suggestion;
    categoryInput.value = category;
    if (quantityInput.value == "") {
        quantityInput.value = 1;
    }
    
    searchSuggestion.innerHTML = "";
 
    itemNameInput.focus();
}

//When a user clicks add from add item modal overlay.
function addItem() {
    
    itemVal = itemNameInput.value;
    categoryVal = categoryInput.value;
    quantityVal = quantityInput.value;
    var user = firebase.auth().currentUser;
    var shoppingList = db.collection("users/" + user.uid + "/shoppingList");

    item = {
        item: itemVal,
        category: categoryVal,
        quantity: quantityVal,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }
    shoppingList.add(item).then(doc => {
        populateShoppingList(item.quantity, item.item, item.category, doc.id, true);
    })
    
    searchSuggestion.innerHTML = "";
    itemNameInput.value = "";
    categoryInput.value = "";
    quantityInput.value = "";
    addItemButton.setAttribute("class", "btn btn-primary disabled btn-lg");
    itemNameInput.focus();
    setTimeout(function(){ 
        modalOverlay.style.backgroundColor = "rgba(0,0,0,0.0)";
       
    }, 250);
    
    setTimeout(function(){ 
        modalOverlay.style.backgroundColor = "rgba(0,0,0,0.2)";
        
    }, 600);
}


//When a user intitates a delete item from their shopping list.
//@param itemID The ID of the item to be deleted.
function deleteItem (itemID) {
    var user = firebase.auth().currentUser;

    var shoppingListItem = db.collection("users/" + user.uid + "/shoppingList").where('__name__','==', itemID);

    shoppingListItem.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
      });

    var itemToHide = document.getElementById("item" + itemID);
    hideItem(itemToHide);
}

//Helper function for deleteItem, animates the deletion of an item without having to reload entire list.
//@param listItem The DOM element which represents the item to be deleted.
function hideItem(listItem) {
    listItem.style.opacity= 0;
    listItem.style.marginTop = 0;
    listItem.style.marginBottom = 0;
    listItem.style.paddingTop = 0;
    listItem.style.paddingBottom = 0;
    listItem.style.height = 0;
    setTimeout(function(){ 
        listItem.style.display = 'none';
    }, 250);
}

//Searches search.js for index matches.
//@param item Query to be index searched.
function searchdb(item) {
    searchSuggestion.innerHTML = "";
    for (var s in search) {
        
        var query = search[s].query;
        if (query.toUpperCase().indexOf(item.toUpperCase()) > -1) {
            populateSearch(search[s]);
        }
    }
}

//Populates the suggestion DOM element with search elements.
//@param item JSON object to be created and added to suggestion DOM.
function populateSearch(item) {
    a = document.createElement("div");
    a.setAttribute("class", "card");
    a.setAttribute("id", "search-item");
    a.setAttribute("onclick", "suggestionClick('" + item.query + "', '" + item.category + "')");
    b = document.createElement("div");
    b.setAttribute("id", "suggestion-item");

    itemName = document.createElement("span");
    itemName.setAttribute("id", "search-item-name");

    b.setAttribute("class", "card-body");
    c = document.createElement("div");
    c.setAttribute("id", "search-item-category");

    itemName.innerHTML = item.query;
    c.innerHTML = item.category;

    b.appendChild(itemName);
    b.appendChild(c);
    a.appendChild(b);

    searchSuggestion.appendChild(a);
}

//Populates shoppingList by created and appending DOM elements.
//@param quantity, item, category, id, animate  Item information.
//@param animate Boolean that is false if animate is disabled (on page load).
function populateShoppingList(quantity, item, category, id, animate) {
    a = document.createElement("div");
    a.setAttribute("class", "card-body shopping-list-item");

    a.setAttribute("id", "item" + id);

    itemName = document.createElement("span");
    itemName.setAttribute("id", "item-name");

    c = document.createElement("div");
    c.setAttribute("id", "item-category");
    if (quantity == "") {
        itemName.innerHTML = item;
    } else {
        itemName.innerHTML = quantity + " x " + item;
    }
   
    c.innerHTML = category;

    d = document.createElement("div");
    d.setAttribute("class", "delete-btn");
    d.setAttribute("id", "delete" + id);
    d.setAttribute("onclick", "deleteItem('" + id + "', this)");
    d.innerHTML = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 6H5H21' stroke='#111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z' stroke='#111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M10 11V17' stroke='#111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M14 11V17' stroke='#111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    d.style.opacity = 0;
    a.appendChild(itemName);
    a.appendChild(c);
    a.appendChild(d);
   
    
    a.addEventListener("mouseenter", function(event) {
        z = document.getElementById("delete" + id);
        z.style.opacity = 100;
      });
    
    a.addEventListener("mouseleave", function(event) {
        z = document.getElementById("delete" + id);
        z.style.opacity = 0;
      });

    marginT = a.style.marginTop;
    marginB = a.style.marginBottom;
    paddingT = a.style.paddingTop;
    paddingB = a.style.paddingBottom;
    height = a.style.height;

    if (animate == true) {
        a.style.opacity= 0;
        a.style.marginTop = 0;
        a.style.marginBottom = 0;
        a.style.paddingTop = 0;
        a.style.paddingBottom = 0;
        a.style.height = 0;
    }

    shoppingListContainer.appendChild(a);
    

    setTimeout(function(){ 
        a.style.opacity= 100;
        a.style.marginTop = marginT;
        a.style.marginBottom = marginB;
        a.style.paddingTop = paddingT;
        a.style.paddingBottom = paddingB;
        a.style.height = height;
    }, 50);
}

//Reads firebasedb and sends each data to populate each shoppinglist item.
function displayShoppingList() {
    var user = firebase.auth().currentUser;
    var shoppingList = db.collection("users/" + user.uid + "/shoppingList").orderBy('timestamp', "asc");

    shoppingListContainer.innerHTML = "";
    shoppingList.get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populateShoppingList(doc.data().quantity, doc.data().item, doc.data().category, doc.id);
            })

        })
}

//Checks to see if user is logged in.
function isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            isPrivateShopper()
            displayShoppingList();
            isOrder();
        } else {
            window.location.href = 'login.html';
        }
      });
}
isLoggedIn();

//Checks to see if the user has a current order in firebase DB.
function isOrder() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        showOrder(doc.data().isOrder, doc.data().shopperid);
        
    });
}

//Shows the current order if isOrder is true.
//@param isOrder Boolean If order is true this is true.
//@param shopperid The private shoppers UID.
function showOrder(isOrder, shopperid) {
    if (isOrder) {
        var privateShopper = db.collection("users").where('__name__','==', shopperid);
        privateShopper.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                showOrderTitles(doc);
            });
          });
        shoppingListContainer.style.backgroundColor = 'grey';
        shoppingListContainer.style.color = 'white';
        addButton.style.display = "none";
        orderButton.style.display = "none";
        shoppingListContainer.style.pointerEvents = "none";
    } else {
        shoppingListContainer.style.backgroundColor = 'white';
        shoppingListContainer.style.color = 'black';
        addButton.style.display = "block";
        orderButton.style.display = "inline";
        shoppingListContainer.style.pointerEvents = "auto";
        orderInfo.style.display = "none";
    }
}

//Shows the private shoppers name.
//@param shopper Object that contains the private shoppers user information.
function showOrderTitles(shopper) {
    orderInfo.style.display = "block";
    shopperInfo.innerHTML = shopper.data().name;
}

//Checks to see if user is a private shopper.
function isPrivateShopper() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        redirect(doc.data().isShopper);
    });
}

//Redirects user to the correct private shopper index if they are a private shopper.
//@param isShopper Boolean true if user is a private shopper. 
function redirect(isShopper) {
    if (isShopper) {
        window.location.href = 'index-private-shopper.html';
    } else {
    }
}

//Gets current users name and displays it in the DOM.
function sayHello(){
    firebase.auth().onAuthStateChanged(function(somebody){
        if(somebody){
            db.collection("users")
            .doc(somebody.uid)
            .get()
            .then(function(doc){
                var n = doc.data().name;
                $("#Name-goes-here").text(n + "'s ");
            })
        }
    })
}
sayHello();

//Order button click function.
function orderButtonClick() {
    showMatchModal();
}

//Cancel order button click function.
function cancelOrderButtonClick() {
    showCancelModal();
}

//Match button click function.
function matchButtonClick() {
    var privateShopper = db.collection("users").where('isAvailable','==', true);
    matchStatus.innerHTML = "Finding a private shopper for you..."
    matchView.style.height =  "100px";
    setTimeout(function(){ 
        privateShopper.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                populateMatch(doc);
            });
          });
    }, 1500);

      matchButton.setAttribute("class", "btn btn-primary disabled btn-lg");
}

//Populates the DOM if a match occurs.
//@param shopper Object that contains matched private shopper information. 
function populateMatch(shopper) {
    var name = shopper.data().name;
    var id = shopper.id;

    matchView.style.height =  "265px";

    matchStatus.innerHTML = "You have been matched"
    matchName.innerHTML = name;
    matchInfo.innerHTML = "You will recieve an update with the amount owed.";
    matchButton.setAttribute("class", "btn btn-primary btn-lg");
    matchButton.innerHTML = "Close";
    matchButton.setAttribute("onclick", "hideMatchModal()");

    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.uid).update({
        isOrder: true,
        shopperid: id
    })

    db.collection("users").doc(id).update({
        isAvailable: false
    })

    showOrder(true, id);

    db.collection("users/" + (id) + "/pendingOrders").add({
        cost: 0,
        userid: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

//Cancels current order.
function cancelOrder() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);
    
    userInfo.get().then((doc) => {
        removeOrder(doc.data().shopperid);
        
    });
}

//Helper function for cancelOrder. Removes order information from private shopper and current user.
//@param id Private shopper UID.
function removeOrder(id) {
    var user = firebase.auth().currentUser;
    var order = db.collection("users/" + (id) + "/pendingOrders").where('userid','==', user.uid);

    order.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
      });

    db.collection("users").doc(id).update({
        isAvailable: true
    })

    db.collection("users").doc(user.uid).update({
        isOrder: false,
        shopperid: ""
    })
    hideCancelModal();
    orderButton.style.pointerEvents = "none";
    isOrder();
}
