function createList() {
    var content = localStorage.getItem("shopperList");
    document.getElementById("theList").innerHTML = content;
    console.log("test");
  }