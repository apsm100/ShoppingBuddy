var mainContainer = document.getElementById("main-container");
var mainSearch = document.getElementById('main-search');
var topNavBar = document.getElementById("top-nav-bar");
var topSearchBar = document.getElementById("top-search-bar");
var topSearchBarInput = document.getElementById("search-input");

var searchContainer = document.getElementById("search-container");

var searchSuggestion = document.getElementById("suggestions");
var searchResult = document.getElementById("results");
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
    searchResult.style.display = 'none';
}
function suggestionClick(suggestion) {
    topSearchBarInput.value = suggestion;
}