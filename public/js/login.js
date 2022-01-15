$(function () {
    console.log("v 1.5");
    getData();

    $(document).on('click', '.open-map', function (e) {
        e.preventDefault();
        var dom = $(this),
            mapUrl = dom.data('map-url');
        if (location) {
            window.open(
                mapUrl,
                'popUpWindow',
                'height=500,width=900,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
            );
        }
    })
});


function login() {
    var email = document.getElementById("exampleInputEmail").value;
    var password = document.getElementById("exampleInputPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location = 'index.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            loginError(errorCode, errorMessage);
        });
};

function loginError(x, y) {
    alert("Failed to login:  " + x + " : " + y);
}

document.addEventListener("keyup", function (event) {
    if (event.code === 'Enter') {
        login();
    }
});