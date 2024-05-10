const searchInput = document.querySelector("#search-input");
const postsDiv = document.querySelector(".posts");
const usernameInput = document.querySelector("#username");
const userContent = document.querySelector(".home-page-contents");
const userText = document.querySelector(".username");
const nameText = document.querySelector(".name");
const profileBtn = document.querySelector("#profile-view");
const profile = document.querySelector(".profile");
const imageLinkInput = document.querySelector("#imagelink");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post");
const uploadBtn = document.querySelector("#create-post-btn")
const homePageBtn = document.querySelector("#home-page");
const editPostBtn = document.querySelector("#edit-post-btn");
editPostBtn.style.display = "none";
const editBtn = document.querySelector("#edit-btn");
const deleteBtn = document.querySelector("#delete-btn");
const showCreateModal = document.querySelector("#show-create-modal");
const moreBtn = document.getElementById("more");
const closebtn = document.querySelector(".close")
const modalElement = document.getElementById('exampleModal');
const modal2 = document.querySelector("#exampleModal2");
const modal = new bootstrap.Modal(modalElement);
const profilePage = document.querySelector(".profile-page")
profilePage.style.display = "none";





createPostBtn.addEventListener("click", () => {
console.log("create post btn clicked");
modal.show();
});

uploadBtn.addEventListener("click", () => {
  const imageLink = imageLinkInput.value.trim();
  const caption = captionInput.value.trim();
  createPost(imageLink, caption);
  modal.hide();

});

showCreateModal.addEventListener("click", () => {
isEditMode = false;
uploadBtn.style.display = "none";
editPostBtn.style.display = "block";
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

closebtn.addEventListener("click", () =>{
  modal2.style.display = "none";
  console.log("close btn clicked")
});

moreBtn.addEventListener("click", () => {
modal2.style.display = "block";
// editBtn.style.color = "red";
// deleteBtn.style.color = "red";
console.log("btn clicked");
});

editBtn.addEventListener("click", () =>{
showEditPostModal();
console.log("edit modal btn clicked");
});

deleteBtn.addEventListener("click", () =>{
deletePost();
console.log("delete btn clicked")
});

editPostBtn.addEventListener("click", () => {
updatePost(postToEditId, imageLinkInput.value, captionInput.value);
modal.hide();
});

window.addEventListener("click", (event) =>{
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
});

var feed = [];
var isEditMode = false;
var postToEditId = null;


// Fetch posts from Firebase
const getPostsFromFirebase = () => {
  db.collection("posts")
    .get()
    .then((querySnapshot) => {
      feed = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        feed.push({
          id: doc.id,
          ...postData,
          createdAt: postData.createdAt.toDate(),
        });
      });
      outputFeed();
    })
    .catch((error) => {
      console.error("Error getting posts:", error);
    });
};

const updatePost = (id, newImageLink, newCaption) => {
  feed = feed.map((post) => {
    if (post.id === id) {
      return {
        ...post,
        imageLink: newImageLink,
        caption: newCaption
      };
    }
    return post;
  });I
  outputFeed();
};



const createPost = (imagelink, caption) => {
  if (!imagelink || !caption) {
    alert("Please provide both an image link and a caption.");
    return;
  }

  const newPost = {
    imagelink: imagelink,
    caption: caption,
    likes: 0,
    comments: [],
    shares: 0,
    isPublic: true,
    createdAt: firebase.firestore.Timestamp.now(),
  };

  // Add the new post to Firestore
  db.collection("posts")
    .add(newPost)
    .then((docRef) => {
      console.log("Post uploaded to Firestore with ID:", docRef.id);
      newPost.id = docRef.id;
      feed.push(newPost);
      outputFeed();
    })
    .catch((error) => {
      console.error("Error uploading post:", error);
    });
};


// Delete Post Functionality
const deletePost = (id) => {
  db.collection("posts")
    .doc(id)
    .delete()
    .then(() => {
      console.log("POST DELETED FROM FIREBASE");
      feed = feed.filter((post) => post.id !== id);
      outputFeed();
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
};

// Output feed
const outputFeed = () => {
  const feedHTML = feed.map((post) => `
  <div class="post">
  <div class="header">
    <div class="profile-area">
      <div class="post-pic">
        <img
          alt="jayshetty's profile picture"
          class="_6q-tv"
          data-testid="user-avatar"
          draggable="false"
          src="https://th.bing.com/th/id/OIP.FLbq0-zAnqPesyc-Ax2DRAAAAA?rs=1&pid=ImgDetMain"
        />
      </div>
      <span class="profile-name"></span>
    </div>
  <div class="options">
      <div
        class="Igw0E rBNOH YBx95 _4EzTm"
        style="height: 24px; width: 24px"
      >
        <svg
          aria-label="More options"
          onclick="showEditPostModal(${post.id})
          id="more"
          class="_8-yf5"
          fill="#262626"
          height="16"
          viewBox="0 0 48 48"
          width="16"
        >
          <circle
            clip-rule="evenodd"
            cx="8"
            cy="24"
            fill-rule="evenodd"
            r="4.5"
          ></circle>
          <circle
            clip-rule="evenodd"
            cx="24"
            cy="24"
            fill-rule="evenodd"
            r="4.5"
          ></circle>
          <circle
            clip-rule="evenodd"
            cx="40"
            cy="24"
            fill-rule="evenodd"
            r="4.5"
          ></circle>
        </svg>
      </div>
  </div>
  </div>
  <div class="body">
    <img
      alt="Photo by Jay Shetty on September 12, 2020. Image may contain: 2 people."
      class="FFVAD"
      decoding="auto"
      sizes="614px"
      src="${post.imageLink}"
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
          </svg>
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
          </svg>
        </div>
      </div>
      <div class="bookmark">
        <div class="QBdPU rrUvL">
          <svg
            aria-label="Save"
            class="_8-yf5"
            fill="#262626"
            height="24"
            viewBox="0 0 48 48"
            width="24"
          >
            <path
              d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <span class="likes"></span>
    <span class="caption">
      <span class="caption-username">${post.username}</span>
      <span class="caption-text">${post.caption}</span>
    </span>
    <span class="posted-time">5 HOURS AGO</span>
  </div>
  <div class="add-comment">
    <input type="text" placeholder="Add a comment..." />
    <a class="post-btn">Post</a>
  </div>
</div>
  
  `).join("");
  postsDiv.innerHTML = feedHTML;
};

const outputPostStatus = (post) => {
  const output = `
  POST INFO:
  ID: ${post.id}
  Username: ${post.username}
  Image Link: ${post.imageLink}
  Caption: ${post.caption}
  `;
  return output;
  };

const showEditPostModal = (id) => {
  postToEditId = id;
  isEditMode = true;
  uploadBtn.style.display = "none";
  editPostBtn.style.display = "block";
  const postToEdit = feed[id];
  console.log("postToEdit", postToEdit);
  imageLinkInput.value = postToEdit.imageLink;
  captionInput.value = postToEdit.caption;
  modal.show();
};
outputFeed();
getPostsFromFirebase();