var mainContainer = document.getElementById("main-container");

var itemNameInput = document.getElementById("item-name-input");
var categoryInput = document.getElementById("category-name-input");
var quantityInput = document.getElementById("quantity-input");

var searchSuggestion = document.getElementById("suggestions");

var shoppingListContainer = document.getElementById("shopping-list");
var shoppingListHeader = document.getElementById("shopping-list-header");


function searchTyping() {
    if (itemNameInput.value == ""){
        searchSuggestion.innerHTML = "";
    } else {
        searchdb(itemNameInput.value);
    }
    
}
function suggestionClick(suggestion, category) {
    itemNameInput.value = suggestion;
    categoryInput.value = category;
    quantityInput.value = 1;
    searchSuggestion.innerHTML = "";
    // addShoppingList(suggestion, category);
    
}

function addShoppingList() {
    itemVal = itemNameInput.value;
    categoryVal = categoryInput.value;
    quantityVal = quantityInput.value;
    
    itemNameInput.value = "";
    categoryInput.value = "";
    quantityInput.value = 1;

    var shoppingList = db.collection("shoppingList");

    shoppingList.add({
        item: itemVal,
        category: categoryVal,
        quantity: quantityVal,
    });
    displayShoppingList();
}

function deleteItem (itemVal, categoryVal) {
    var shoppingListItem = db.collection('shoppingList').where('item','==',itemVal).where('category','==',categoryVal);
    shoppingListItem.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
          displayShoppingList();
        });
      });
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

function populateShoppingList(itemDat) {
    a = document.createElement("div");
    a.setAttribute("class", "card-body");
    a.setAttribute("id", "shopping-list-item");
    a.setAttribute("onclick", "deleteItem('" + itemDat.item + "', '" + itemDat.category + "')");


    itemName = document.createElement("span");
    itemName.setAttribute("id", "item-name");

    c = document.createElement("div");
    c.setAttribute("id", "item-category");

    itemName.innerHTML = itemDat.quantity + " x " + itemDat.item;
    c.innerHTML = itemDat.category;

    a.appendChild(itemName);
    a.appendChild(c);


    shoppingListContainer.appendChild(a);
    
}

function displayShoppingList() {
    shoppingListContainer.innerHTML = "";
    db.collection("shoppingList").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                populateShoppingList(doc.data());
            })

        })
    // shoppingListHeader.innerHTML = "Shopping List(" + count + ")";
}
displayShoppingList();