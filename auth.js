const mainContainer = document.querySelector("#main-container");
const firebaseAuthContainer = document.querySelector("#firebase-auth-container");
const logoutBtn = document.querySelector("#logout-btn"); 
const ui = new firebaseui.auth.AuthUI(auth);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      const userId = user.uid;
      const displayName = user.displayName;

      console.log("User authenticated:", user);

      // Update user information elements
      const authUserElements = document.querySelectorAll(".userInfo");
      authUserElements.forEach(element => {
          element.innerHTML = displayName;
      });

      // Redirect to the application
      redirectToApp(); 

      // Retrieve and display posts
      getPostsFromFirebase(userId, displayName);
  } else {
      console.log("No user is logged in");
      redirectToAuth();
  }
});

const getPostsFromFirebase = (userId, displayName) => {
  console.log("Fetching posts for user:", userId, displayName);

  const db = firebase.firestore();
  db.collection("posts")
      .get()
      .then(querySnapshot => {
          const feed = [];
          querySnapshot.forEach(doc => {
              const postData = doc.data();
              feed.push({
                  id: doc.id,
                  ...postData,
                  createdAt: postData.createdAt.toDate().toLocaleString(),
                  displayName: postData.displayName || "", // Use display name from post data
                  userAvatar: postData.userAvatar || "",
                  userId: postData.userId // Ensure userId is included
              });
          });
          console.log("Fetched posts:", feed);
          outputFeed(feed, userId, displayName);
      })
      .catch(error => console.error("Error getting posts:", error));
};


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