function changeData() {
    if (document.getElementById("changeName").value != "") {
      document
        .getElementById("name")
        .setAttribute("value", document.getElementById("changeName").value);
    }
    if (document.getElementById("changeEmail").value != "") {
      document
        .getElementById("email")
        .setAttribute(
          "value",
          document.getElementById("changeEmail").value
        );
    }
    if (document.getElementById("changePassword").value != "") {
      document
        .getElementById("password")
        .setAttribute(
          "value",
          document.getElementById("changePassword").value
        );
    }
  }