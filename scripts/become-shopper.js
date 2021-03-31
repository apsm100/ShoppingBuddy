function getInfo() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var emailAddress = document.getElementById("emailAddress").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    console.log(firstName);
    var shoppers = db.collection("shoppers");
    if (
      firstName != "" &&
      lastName != "" &&
      emailAddress != "" &&
      phoneNumber != ""
    ) {
      shoppers.add({
        name: firstName + " " + lastName,
        email: emailAddress,
        number: phoneNumber,
      });
      document.getElementById("content").innerHTML =
        "<div class='card border-success mb-3 text-center'><div class='card-header'>Sign-Up Success!</div><div class='card-body text-success'><h5 class='card-title padder'>Your Application Is Pending Review.</h5><a class='btn btn-primary' href='index.html' role='button'>Take me to the home page!</a></div>";
    }
  }a