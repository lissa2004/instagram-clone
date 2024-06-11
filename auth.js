const mainContainer = document.querySelector("#main-container");
const firebaseAuthContainer = document.querySelector("#firebase-auth-container");
const logoutBtn = document.querySelector("#logout-btn");
const ui = new firebaseui.auth.AuthUI(firebase.auth());

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      const userId = user.uid;
      const displayName = user.displayName || "Anonymous";

      const authUserElements = document.querySelectorAll(".userInfo");
      authUserElements.forEach(element => {
          element.innerHTML = displayName;
      });

      console.log(`User authenticated: ${userId} ${displayName}`);
      console.log("Calling getPostsFromFirebase with userId:", userId, "and displayName:", displayName);
      getPostsFromFirebase(userId, displayName); // Pass userId and displayName to getPostsFromFirebase
      
      redirectToApp(); // Show the main container and hide the auth container
  } else {
      console.log("User is not authenticated");
      redirectToAuth(); // Show the auth container and hide the main container
  }
});

const getPostsFromFirebase = (userId, displayName) => {
  const db = firebase.firestore();
  console.log("Fetching posts for user:", userId, displayName);

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
                  displayName: postData.displayName || "Anonymous",
                  userAvatar: postData.userAvatar || "",
                  userId: postData.userId
              });
          });
          console.log("Fetched posts:", feed);
          outputFeed(feed, userId, displayName);
      })
      .catch(error => {
          console.error("Error getting posts:", error);
      });
};

const redirectToAuth = () => {
  mainContainer.style.display = "none";
  firebaseAuthContainer.style.display = "block";

  ui.start("#firebase-auth-container", {
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        console.log("authResult", authResult.user.uid);
        return false; // Prevents automatic redirection
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
};

const handleLogout = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log("User signed out");
      redirectToAuth(); // Redirect to auth after logout
    })
    .catch((error) => {
      console.log("Error occurred during logout:", error);
    });
};

logoutBtn.addEventListener("click", handleLogout);

