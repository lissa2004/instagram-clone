
  const searchInput = document.querySelector("#search-input");
  const postsDiv = document.querySelector(".posts");
  const userContent = document.querySelector(".home-page-contents");
  const nameText = document.querySelector(".user-details-bottom");
  const profileBtn = document.querySelector("#profile-view");
  const profile = document.querySelector(".profile");
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
  const moreBtn = document.querySelector(".more");
  profilePage.style.display = "none";
  const userText  = document.querySelectorAll(".user-details-top");

  feed = [];
  let photo;
  let isEditMode = false;
  let postToEditId = null;
  

  photoInput.addEventListener('change', (event) => {
    photo = event.target.files[0];
  });

  document.addEventListener("click", (event) => {
    console.log("more btn clicked");
    const moreButton = event.target.closest(".more");
    if (moreButton) {
        modal2.style.display = "block";
        moreButton.querySelector("#edit-btn").style.color = "red";
        moreButton.querySelector("#delete-btn").style.color = "red";
    }
});

  createPostBtn.addEventListener("click", () => {
    console.log("create post btn clicked");
    modal.show();
  });

  uploadBtn.addEventListener("click", () => {
    const caption = captionInput.value.trim();
    createPost(photo, caption);
    modal.hide();
  });

  showCreateModal.addEventListener("click", () => {
    isEditMode = false;
    uploadBtn.style.display = "block";
    editPostBtn.style.display = "none";
    console.log("edit profile button clicked on");
    modal.show();
  });

  profileBtn.addEventListener("click", () => {
    profilePage.style.display = "block";
    userContent.style.display = "none";
    console.log("profile btn clicked");
  });

  homePageBtn.addEventListener("click", () => {
    profilePage.style.display = "none";
    userContent.style.display = "block";
    console.log("home-page btn clicked");
  });

  closebtn.addEventListener("click", () => {
    modal2.style.display = "none";
    console.log("close btn clicked");
  });

  editPostBtn.addEventListener("click", () => {
    updatePost(postToEditId, photo, captionInput.value.trim());
    modal.hide();
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal2) {
      modal2.style.display = "none";
    }
  });

  document.querySelector("#edit-btn")?.addEventListener("click", () => {
    showEditPostModal(postToEditId);
    console.log("edit modal btn clicked");
    modal2.style.display = "none";
    modal.show();
    
    
  });

  document.querySelector("#delete-btn")?.addEventListener("click", () => {
    deletePost(postToEditId);
    console.log("delete btn clicked");
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
        console.log("Post id:", postId);
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
    console.log("Editing post:", postToEdit);
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
            console.log("Post updated successfully");
            getPostsFromFirebase();
          }).catch(error => console.error("Error updating post:", error));
        }).catch(error => console.error("Error uploading new image:", error));
    } else {
      db.collection("posts").doc(id).update({
        caption: newCaption
      }).then(() => {
        console.log("Post updated successfully");
        getPostsFromFirebase();
      }).catch(error => console.error("Error updating post:", error));
    }
  };

  const createPost = (photo, caption, userText) => {
    if (!photo || !caption) {
      console.error("Please select an image and provide a caption.");
      return;
    }
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child("images/" + photo.name);

    imageRef.put(photo)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(downloadURL => {
        console.log(downloadURL);
        const newPost = {
          imagelink: downloadURL,
          userText : userText,
          caption: caption,
          createdAt: firebase.firestore.Timestamp.now(),
        };

        db.collection("posts").add(newPost)
          .then((docRef) => {
            console.log("Post uploaded to Firestore with ID:", docRef.id);
            newPost.id = docRef.id;
            feed.push(newPost);
            outputFeed();
          })
          .catch(error => console.error("Error uploading post:", error));
      })
      .catch(error => console.error("Error uploading image: ", error));
  };

  const deletePost = (id) => {
    console.log("delete btn clicked");
    const db = firebase.firestore();
    db.collection("posts").doc(id).delete()
      .then(() => {
        console.log("Post deleted from Firebase");
        feed = feed.filter(post => post.id !== id);
        outputFeed();
      })
      .catch(error => console.error("Error deleting post:", error));
  };

 
  const outputFeed = () => {
    postsDiv.innerHTML = '';
    feed.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.dataset.postId = post.id;
      postElement.innerHTML = `
      <div class="post"  data-post-id="${post.id}">
      <div class="header">
        <div class="profile-area">
          <div class="post-pic">
            <img
              alt="jayshetty's profile picture"
              class="_6q-tv"
              data-testid="user-avatar"
              draggable="false"
              src="assets/akhil.png"
            />
          </div>
          <span class="profile-name">"${post.userText}"</span>
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
            <div>
              <span class=""
                ><svg
                  aria-label="Like"
                  class="_8-yf5"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path
                    d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                  ></path></svg
              ></span>
            </div>
            <div class="margin-left-small">
              <svg
                aria-label="Comment"
                class="_8-yf5"
                fill="#262626"
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path
                  clip-rule="evenodd"
                  d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                  fill-rule="evenodd"
                ></path>
              ></svg>
            </div>
            <div class="margin-left-small">
              <svg
                aria-label="Share Post"
                class="_8-yf5"
                fill="#262626"
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path
                  d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"
                ></path>
              ></svg>
            </div>
          </div>
        </div>
        <span class="likes"
          >Liked by <b>ishitaaaa.b</b> and <b>others</b></span
        >
        <span class="caption">
          <span class="caption-username"><b>${post.userText}</b></span>
          <span class="caption-text">${post.caption}</span
          >
        </span>
        <span class="posted-time">${post.createdAt}</span>
      </div>
      <div class="add-comment">
        <input type="text" placeholder="Add a comment..." />
        <a class="post-btn">Post</a>
      </div>
    </div>
</div>
      `;
      postsDiv.appendChild(postElement);
    });
  };

  const getPostsFromFirebase = () => {
    const db = firebase.firestore();
    db.collection("posts")
      .get()
      .then(querySnapshot => {
        feed = [];
        querySnapshot.forEach(doc => {
          const postData = doc.data();
          feed.push({
            id: doc.id,
            ...postData,
            createdAt: postData.createdAt.toDate(),
          });
        });
        outputFeed();
      })
      .catch(error => console.error("Error getting posts:", error));
  };
  outputFeed();
  getPostsFromFirebase();
  
