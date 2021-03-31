var mainContainer = document.getElementById("main-container");

var itemNameInput = document.getElementById("item-name-input");
var categoryInput = document.getElementById("category-name-input");
var quantityInput = document.getElementById("quantity-input");

var searchSuggestion = document.getElementById("suggestions");

var shoppingListContainer = document.getElementById("shopping-list");
var shoppingListHeader = document.getElementById("shopping-list-header");

var addToShoppingListContainer = document.getElementById("addto-shopping-list");
var addItemButton = document.getElementById("add-item-button");

var modalOverlay = document.getElementById("modal-overlay");

var search = JSON.parse(searchJSON);
search = search["search"];

function showAddToModal() {
    modalOverlay.style.display = "block";
    itemNameInput.focus();
    setTimeout(function(){ 
        modalOverlay.style.opacity = 1; 
    }, 0);
    // localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
}

window.onclick = function(event) {
    if (event.target == modalOverlay) {
      modalOverlay.style.opacity = 0;
      setTimeout(function(){ 
        modalOverlay.style.display = "none";
    }, 250);
    }
    // localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
  }

function searchTyping() {
    if (itemNameInput.value == ""){
        searchSuggestion.innerHTML = "";
        addItemButton.setAttribute("class", "btn btn-primary disabled");
    } else {
        searchdb(itemNameInput.value);
        addItemButton.setAttribute("class", "btn btn-primary");
    }
    // localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
}

function suggestionClick(suggestion, category) {
    itemNameInput.value = suggestion;
    categoryInput.value = category;
    quantityInput.value = 1;
    searchSuggestion.innerHTML = "";
 
    itemNameInput.focus();
    // localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
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
    localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
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
    localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
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

    // localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
    
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
    localStorage.setItem("shopperList", document.getElementById("shopping-list").innerHTML);
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
console.log(localStorage);
//firebase.auth().signOut()         USE THIS TO LOG OUT USER.