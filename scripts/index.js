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
    }
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

    var shoppingList = db.collection("shoppingList");
    item = {
        item: itemVal,
        category: categoryVal,
        quantity: quantityVal,
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
    var shoppingListItem = db.collection('shoppingList').where('item','==',itemVal).where('category','==',categoryVal);
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
    db.collection("search")
        .get()
        .then(function (snap) {
            searchSuggestion.innerHTML = "";
            snap.forEach(function (doc) {
                // console.log(doc.data());
                //do something with the data
                if (doc.data().query.toUpperCase().indexOf(item.toUpperCase()) > -1) {
                    populateSearch(doc.data());
                    
                  }
                
            })
        })
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
    shoppingListContainer.innerHTML = "";
    db.collection("shoppingList").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populateShoppingList(doc.data());
            })

        })
}
displayShoppingList();

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