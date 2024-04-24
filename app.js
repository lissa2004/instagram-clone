const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const postsDiv = document.querySelector(".posts");
const usernameInput = document.querySelector("#username");
const imageLinkInput = document.querySelector("#imagelink");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post-btn");
const editPostBtn = document.querySelector("#edit-post-btn");
editPostBtn.style.display = "none";
const editBtn = document.querySelector("#edit-btn");
const deletebtn = document.querySelector("#delete-btn");
const unfollowBtn = document.querySelector("#unfollow-btn");
const showCreateModal = document.querySelector("#show-create-modal");
const moreBtn = document.querySelector("#more")


const modalElement = document.getElementById('exampleModal');
const modal = new bootstrap.Modal(modalElement, {
backdrop: 'static', 
keyboard: false
});


searchBtn.addEventListener("click", () => {
console.log(searchInput.value);
searchInput.style.background = "red";
});


createPostBtn.addEventListener("click", () => {
console.log("create post btn clicked");
createPost(imageLinkInput.value, captionInput.value, usernameInput.value);
});

showCreateModal.addEventListener("click", () => {
isEditMode = false;
createPostBtn.style.display = "block";
editPostBtn.style.display = "none";
modal.show();
});

editPostBtn.addEventListener("click", () => {
updatePost(postToEditId, imageLinkInput.value, captionInput.value);
modal.hide();
});

moreBtn.addEventListener("click", () => {
  isEditMode = true;
  createPostBtn.style.display = "none";
  editPostBtn.style.display = "block";
  usernameInput.value = "";
  imageLinkInput.value = "";
  captionInput.value = "";
  modal.show();
  console.log("btn clicked");
  });

var feed = [];
var isEditMode = false;
var postToEditId = null;


const uploadPostToFirebase = (post) => {
db.collection("posts")
  .doc(post.id + "")
  .set(post)
  .then(() => {
    console.log("POST UPLOADED TO FIREBASE");
  })
  .catch((error) => {
    console.log("ERROR", error);
  });
};

const getPostsFromFirebase = () => {
  db.collection("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    })
    .catch((error) => {
      console.error("Error getting posts:", error);
    });
};



const createPost = (imageLink, caption, username) => {
const newPost = {
  id: feed.length,
  username: username,
  imageLink: imageLink,
  caption: caption,
  likes: 0,
  comments: [],
  shares: 0,
  isPublic: true,
  createdAt: new Date(),
};
console.log("FEED", feed);
uploadPostToFirebase(newPost);
feed.push(newPost);
outputFeed();
modal.hide();

};

const outputFeed = () => {

const updatedFeed = feed.map((post) => {
  return `
  <div class="post">
    <div class="post-header">
        <p>${post.username}</p>
        <button class="btn btn-sm btn-primary" onclick="showEditPostModal(${post.id})">Edit</button>
    </div>
    <img src="${post.imageLink}" alt="">
    <div class="caption">
        <p>${post.caption}</p>
    </div>
  </div>
  `;
});
postsDiv.innerHTML = updatedFeed.join(" ");
};


const updatePost = (id, newImageLink, newCaption) => {


const updatedFeed = feed.map((post) => {
  if (post.id === id) {
    post.imageLink = newImageLink;
    post.caption = newCaption;
  }
  return post;
});
feed = updatedFeed;
uploadPostToFirebase(feed[id]);
outputFeed();
};


const deletePost = (id) => {

const updatedFeed = feed.filter((post) => {
  if (post.id !== id) {
    return post;
  }
});
feed = updatedFeed;
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
createPostBtn.style.display = "none";
editPostBtn.style.display = "block";
const postToEdit = feed[id];
console.log("postToEdit", postToEdit);
usernameInput.value = postToEdit.username;
imageLinkInput.value = postToEdit.imageLink;
captionInput.value = postToEdit.caption;
modal.show();
};

outputFeed();
getPostsFromFirebase();