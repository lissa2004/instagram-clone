const mainContainer = document.querySelector("#main-container");
const firebaseAuthContainer = document.querySelector("#firebase-auth-container");
const logoutBtn = document.querySelector("#logout-btn"); 
const authUserText = document.querySelector(".auth-user");

const ui = new firebaseui.auth.AuthUI(auth);

  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        authUserText.innerHTML = user.displayName;
        redirectToApp(); 
    } else {
        console.log("No user is logged in");
        redirectToAuth();
    }
  });

  const redirectToAuth = () => {
    mainContainer.style.display = "none";
    firebaseAuthContainer.style.display = "block";

  ui.start("#firebase-auth-container", {
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log("authResult", authResult.user.uid);
        redirectToApp();
      },
    },
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
  });
 };
const redirectToApp = () => {
    mainContainer.style.display = "block";
    firebaseAuthContainer.style.display = "none";
 }

const handleLogout = () => {
    auth.signOut()
        .then(() => {
        console.log("User signed out");
        })
        .catch((error) => {
        console.log("Error occurred during logout:", error);
        });
};
logoutBtn.addEventListener("click", handleLogout);