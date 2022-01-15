firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('Logged in as: ' + user.email);
    } else {
        window.location = 'login.html';
    }
});


function logout() {
    firebase.auth().signOut().then(() => {
        window.location = 'login.html';
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Unable to logout. ** ' + errorCode + ' ** ' + errorMessage);
    });
};
