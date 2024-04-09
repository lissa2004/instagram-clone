const mainContainer = document.querySelector("#main-container");
const firebaseAuthContainer = document.querySelector("#firebase-auth-container");
const logoutBtn = document.querySelector("#logout-btn");

const ui = new firebaseui.auth.AuthUI(auth); 
const auth = getAuth(app);

ui.start('#firebase-auth-container');
const redirectToAuth = () => {
    mainContainer.style.display = "none";
    firebaseAuthContainer.style.display = "block";
  
    ui.start("#firebase-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log("authResult", authResult.user.uid);
          redirectToApp();
        },
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    });
};

const redirectToApp = () => {
    mainContainer.style.display = "block";
    firebaseAuthContainer.style.display = "none";
    window.location.href = "http://127.0.0.1:5500/index.html";
};


// Function to handle logout
const handleLogout = () => {
    auth.signOut()
        .then(() => {
            console.log("User signed out");
        })
        .catch((error) => {
            console.log("Error occurred during logout:", error);
        });
};

// Add event listener to logout button
logoutBtn.addEventListener("click", handleLogout);
  
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        redirectToApp(); 
    } else {
        console.log("No user is signed in");
        redirectToAuth();
    }
});
