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

var matchStatus = document.getElementById("match-status");
var matchName = document.getElementById("match-name");
var matchInfo = document.getElementById("match-info");
var matchButton = document.getElementById("match-btn");
var matchView = document.getElementById("view-match");

var orderButton = document.getElementById("order-btn");

var orderInfo = document.getElementById("order-info");
var shopperInfo = document.getElementById("shopper-info");

var search = JSON.parse(searchJSON);
search = search["search"];

function showAddToModal() {
    modalOverlay.style.display = "block";
    itemNameInput.focus();
    setTimeout(function(){ 
        modalOverlay.style.opacity = 1; 
    }, 0);

}

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


function hideMatchModal() {
    matchModalOverlay.style.opacity = 0;
    setTimeout(function(){ 
        matchModalOverlay.style.display = "none";
    }, 250);
}
function showMatchModal() {
    matchModalOverlay.style.display = "block";
    setTimeout(function(){ 
        matchModalOverlay.style.opacity = 1; 
    }, 0);

}

function searchTyping() {
    if (itemNameInput.value == ""){
        searchSuggestion.innerHTML = "";
        addItemButton.setAttribute("class", "btn btn-primary disabled");
    } else {
        searchdb(itemNameInput.value);
        addItemButton.setAttribute("class", "btn btn-primary");
    }

}

function suggestionClick(suggestion, category) {
    itemNameInput.value = suggestion;
    categoryInput.value = category;
    quantityInput.value = 1;
    searchSuggestion.innerHTML = "";
 
    itemNameInput.focus();

}

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
    shoppingList.add(item);
    populateShoppingList(item, true);

    itemNameInput.value = "";
    categoryInput.value = "";
    quantityInput.value = "";
    addItemButton.setAttribute("class", "btn btn-primary disabled");
    itemNameInput.focus();
    modalOverlay.style.backgroundColor = "rgba(0,0,0,0.0)";
    setTimeout(function(){ 
        modalOverlay.style.backgroundColor = "rgba(0,0,0,0.2)";
    }, 500);
 
}


function deleteItem (itemVal, categoryVal, listItem) {
    var user = firebase.auth().currentUser;

    var shoppingListItem = db.collection("users/" + user.uid + "/shoppingList").where('item','==',itemVal).where('category','==',categoryVal);

    shoppingListItem.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
      });

    hideItem(listItem);

}

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

function searchdb(item) {
    searchSuggestion.innerHTML = "";
    for (var s in search) {
        
        var query = search[s].query;
        if (query.toUpperCase().indexOf(item.toUpperCase()) > -1) {
            populateSearch(search[s]);
        }
    }
}

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

function populateShoppingList(itemDat, animate) {
    a = document.createElement("div");
    a.setAttribute("class", "card-body");
    a.setAttribute("id", "shopping-list-item");

    a.setAttribute("onclick", "deleteItem('" + itemDat.item + "', '" + itemDat.category + "', this)");


    itemName = document.createElement("span");
    itemName.setAttribute("id", "item-name");

    c = document.createElement("div");
    c.setAttribute("id", "item-category");

    itemName.innerHTML = itemDat.quantity + " x " + itemDat.item;
    c.innerHTML = itemDat.category;

    a.appendChild(itemName);
    a.appendChild(c);

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
    }, 0);

}


function displayShoppingList() {
    var user = firebase.auth().currentUser;
    var shoppingList = db.collection("users/" + user.uid + "/shoppingList").orderBy('timestamp', "asc");

    shoppingListContainer.innerHTML = "";
    shoppingList.get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populateShoppingList(doc.data());
            })

        })
}


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

function isOrder() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        showOrder(doc.data().isOrder, doc.data().shopperid);
        
    });
}

function showOrder(isOrder, shopperid) {
    if (isOrder) {
        console.log(shopperid);
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

    }
}

function showOrderTitles(shopper) {
    orderInfo.style.display = "block";
    shopperInfo.innerHTML = shopper.data().name + " is currently shopping for you.<br> Current Total: $0";
}

function isPrivateShopper() {
    var user = firebase.auth().currentUser;
    var userInfo = db.collection("users").doc(user.uid);

    userInfo.get().then((doc) => {
        redirect(doc.data().isShopper);
    });
}

function redirect(isShopper) {
    if (isShopper) {
        window.location.href = 'index-private-shopper.html';
    } else {
    }
}

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

function orderButtonClick() {
    showMatchModal();
    // matchStatus.innerHTML = "Click 'Match' to get your order started"
    // matchName.innerHTML = "";
    // matchInfo.innerHTML = "";
    // matchButton.innerHTML = "Match";
    // // matchButton.setAttribute("onclick", "matchButtonClick()");
    // // matchButton.setAttribute("href", "");
    // matchButton.setAttribute("class", "btn btn-primary");
}

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

      matchButton.setAttribute("class", "btn btn-primary disabled");
}
function populateMatch(shopper) {
    var name = shopper.data().name;
    var id = shopper.id;

    matchView.style.height =  "245px";

    matchStatus.innerHTML = "You have been matched"
    matchName.innerHTML = name;
    matchInfo.innerHTML = "You will recieve an update with the amount owed.";
    matchButton.setAttribute("class", "btn btn-primary");
    matchButton.innerHTML = "Close";
    matchButton.setAttribute("onclick", "hideMatchModal()");

    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.uid).update({
        isOrder: true,
        shopperid: id
    })

    showOrder(true, id);

    db.collection("users/" + (id) + "/pendingOrders").add({
        cost: 0,
        userid: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });


}
//firebase.auth().signOut()         USE THIS TO LOG OUT USER.