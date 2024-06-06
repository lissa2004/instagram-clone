const searchInput = document.querySelector("#search-input");
const userContent = document.querySelector(".home-page-contents");
const profileBtn = document.querySelector("#profile-view");
const photoInput = document.querySelector("#photoInput");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post");
const uploadBtn = document.querySelector("#create-post-btn");
const homePageBtn = document.querySelector("#home-page");
const editPostBtn = document.querySelector("#edit-post-btn");
const showCreateModal = document.querySelector("#show-create-modal");
const closebtn = document.querySelector(".close");
const modalElement = document.getElementById('exampleModal');
const modal2 = document.querySelector("#exampleModal2");
const modal = new bootstrap.Modal(modalElement);
const profilePage = document.querySelector(".profile-page");
profilePage.style.display = "none";

let feed = [];
let photo;
let isEditMode = false;
let postToEditId = null;

photoInput.addEventListener('change', (event) => {
    photo = event.target.files[0];
});

document.addEventListener("click", (event) => {
    const moreButton = event.target.closest(".more");
    if (moreButton) {
        modal2.style.display = "block";
    }
});

createPostBtn.addEventListener("click", () => {
    isEditMode = false;
    captionInput.value = '';
    photoInput.value = '';
    uploadBtn.style.display = "block";
    editPostBtn.style.display = "none";
    modal.show();
});

uploadBtn.addEventListener("click", () => {
    const caption = captionInput.value.trim();
    createPost(photo, caption);
    modal.hide();
});

profileBtn.addEventListener("click", () => {
    profilePage.style.display = "block";
    userContent.style.display = "none";
});

homePageBtn.addEventListener("click", () => {
    profilePage.style.display = "none";
    userContent.style.display = "block";
});

closebtn.addEventListener("click", () => {
    modal2.style.display = "none";
});

editPostBtn.addEventListener("click", () => {
    const caption = captionInput.value.trim();
    updatePost(postToEditId, photo, caption);
    modal.hide();
});

window.addEventListener("click", (event) => {
    if (event.target === modal2) {
        modal2.style.display = "none";
    }
});

document.querySelector("#edit-btn")?.addEventListener("click", () => {
    showEditPostModal(postToEditId);
    modal2.style.display = "none";
    modal.show();
});

document.querySelector("#delete-btn")?.addEventListener("click", () => {
    deletePost(postToEditId);
    modal2.style.display = "none";
});

const handleEditButtonClick = (postId) => {
    if (postId) {
        postToEditId = postId;
        showEditPostModal(postToEditId);
    } else {
        console.error("Invalid post id");
    }
};

document.addEventListener("click", (event) => {
    const postElement = event.target.closest(".post");
    if (postElement) {
        const postId = postElement.dataset.postId;
        if (postId) {
            handleEditButtonClick(postId);
        } else {
            console.error("Post id not found in dataset");
        }
    }
});

const showEditPostModal = (id) => {
    if (!id) {
        console.error("Invalid post id");
        return;
    }
    const postToEdit = feed.find(post => post.id === id);
    if (postToEdit) {
        captionInput.value = postToEdit.caption;
        postToEditId = id;
        uploadBtn.style.display = "none";
        editPostBtn.style.display = "block";
        modal.show();
    } else {
        console.error("Post not found");
    }
};

const updatePost = (id, newPhoto, newCaption) => {
    const db = firebase.firestore();
    if (newPhoto) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child("images/" + newPhoto.name);
        imageRef.put(newPhoto)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(downloadURL => {
                db.collection("posts").doc(id).update({
                    imagelink: downloadURL,
                    caption: newCaption
                }).then(() => {
                    getPostsFromFirebase();
                }).catch(error => console.error("Error updating post:", error));
            }).catch(error => console.error("Error uploading new image:", error));
    } else {
        db.collection("posts").doc(id).update({
            caption: newCaption
        }).then(() => {
            getPostsFromFirebase();
        }).catch(error => console.error("Error updating post:", error));
    }
};

const createPost = (photo, caption) => {
  if (!photo || !caption) {
      console.error("Please select an image and provide a caption.");
      return;
  }

  const user = firebase.auth().currentUser;

  if (!user) {
      console.error("No user is signed in.");
      return;
  }

  const { uid, displayName } = user;

  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child("images/" + photo.name);

  imageRef.put(photo)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(downloadURL => {
          const newPost = {
              imagelink: downloadURL,
              caption: caption,
              createdAt: firebase.firestore.Timestamp.now(),
              userId: uid,
              displayName: displayName
          };

          db.collection("posts").add(newPost)
              .then((docRef) => {
                  newPost.id = docRef.id;
                  feed.push(newPost);
                  getPostsFromFirebase();
              })
              .catch(error => console.error("Error uploading post:", error));
      })
      .catch(error => console.error("Error uploading image: ", error));
};


const deletePost = (id) => {
    const db = firebase.firestore();
    db.collection("posts").doc(id).delete()
        .then(() => {
            feed = feed.filter(post => post.id !== id);
            getPostsFromFirebase();
        })
        .catch(error => console.error("Error deleting post:", error));
};

const outputFeed = (feed, currentUserId, currentDisplayName) => {
  const homePostsDiv = document.querySelector('.home-page-contents .posts');
  const profilePostsDiv = document.querySelector('.profile-page .posts');
  homePostsDiv.innerHTML = '';
  profilePostsDiv.innerHTML = '';

  feed.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.dataset.postId = post.id;

      const postUserName = post.userId === currentUserId ? currentDisplayName : post.displayName || "Anonymous";

      postElement.innerHTML = `
          <div class="post" data-post-id="${post.id}">
              <div class="header">
                  <div class="profile-area">
                      <div class="post-pic">
                          <img
                              alt="Profile picture"
                              class="_6q-tv"
                              data-testid="user-avatar"
                              draggable="false"
                              src="${post.userAvatar || 'https://th.bing.com/th/id/OIP.FLbq0-zAnqPesyc-Ax2DRAAAAA?rs=1&pid=ImgDetMain'}"
                          />
                      </div>
                      <span class="profile-name">${postUserName}</span>
                  </div>
                  <div class="more" style="height: 24px; width: 24px">
                      <svg aria-label="More options" id="more" class="_8-yf5" fill="#262626" height="16" viewBox="0 0 48 48" width="16">
                          <circle clip-rule="evenodd" cx="8" cy="24" fill-rule="evenodd" r="4.5"></circle>
                          <circle clip-rule="evenodd" cx="24" cy="24" fill-rule="evenodd" r="4.5"></circle>
                          <circle clip-rule="evenodd" cx="40" cy="24" fill-rule="evenodd" r="4.5"></circle>
                      </svg>
                  </div>
              </div>
              <div class="body">
                  <img
                      alt="Post Image"
                      class="img-fluid"
                      decoding="auto"
                      sizes="614px"
                      src="${post.imagelink}"
                      style="object-fit: cover"
                  />
              </div>
              <div class="footer">
                  <div class="user-actions">
                      <div class="like-comment-share">
                          <!-- Other elements -->
                      </div>
                  </div>
                  <span class="likes">Liked by <b>ishitaaaa.b</b> and <b>others</b></span>
                  <span class="caption">
                      <span class="caption-username"><b>${postUserName}</b></span>
                      <span class="caption-text">${post.caption}</span>
                  </span>
                  <span class="posted-time">${post.createdAt}</span>
              </div>
              <div class="add-comment">
                  <input type="text" placeholder="Add a comment..." />
                  <a class="post-btn">Post</a>
              </div>
          </div>
      `;
      homePostsDiv.appendChild(postElement);
      
      if (post.userId === currentUserId) {
        console.log("Appending post to profile page:", post);
        profilePostsDiv.appendChild(postElement.cloneNode(true));
    }
  });
};


