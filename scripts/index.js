var mainContainer = document.getElementById("main-container");
var mainSearch = document.getElementById('main-search');
var topNavBar = document.getElementById("top-nav-bar");
var topSearchBar = document.getElementById("top-search-bar");
var topSearchBarInput = document.getElementById("search-input");
var searchContainer = document.getElementById("search-container");
var searchSuggestion = document.getElementById("suggestions");

function searchStart() {
    mainSearch.style.display = 'none';
    topNavBar.style.display = 'none';
    topSearchBar.style.display = 'block';
    mainContainer.style.display = 'block';
    topSearchBarInput.focus();
}
function searchTyping() {
    mainContainer.style.display = 'none';
    searchContainer.style.display = "block";
    searchdb(topSearchBarInput.value);
}
function suggestionClick(suggestion) {
    topSearchBarInput.value = suggestion;
    searchdb(suggestion);
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
    a.setAttribute("onclick", "suggestionClick('" + item.query + "')");
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