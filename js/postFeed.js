import config from "./config.js";
const API_BASE = config.API_BASE;
const POST_POSTS = config.POST_POSTS;
const GET_POSTS = config.GET_POSTS;
const PUT_POSTS = config.PUT_POSTS;
const DELETE_POSTS = config.DELETE_POSTS;

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("name");
  const profilePicture = localStorage.getItem("avatar");

  const usernameElement = document.getElementById("username");
  const profilePictureElement = document.querySelector(".profile-picture img");
  const postTitleElement = document.getElementById("postTitle");
  const postContentElement = document.getElementById("postContent");
  const mediaElement = document.getElementById("media");
  const postButton = document.getElementById("postButton");

  if (usernameElement) {
    usernameElement.textContent = username;
  }

  if (profilePictureElement) {
    if (profilePicture === "null") {
      profilePictureElement.src = "/assets/user_avt.png";
    } else {
      profilePictureElement.src = profilePicture;
    }
  }

  postButton.addEventListener("click", async () => {
    const title = postTitleElement.value;
    const body = postContentElement.value;
    const media = mediaElement.value;

    if (!title) {
      alert("Please enter a title for your post.");
      return;
    }

    if (media && !isValidUrl(media)) {
      alert("Please enter a valid URL for the media.");
      return;
    }

    try {
      const response = await fetch(`${POST_POSTS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          body,
          media,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      alert("Post created successfully!");
      postTitleElement.value = "";
      postContentElement.value = "";
      mediaElement.value = "";

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the post.");
    }
  });

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function editPost(postId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const editedElement = document.getElementById(`post-${postId}`);
    const titleElement = editedElement.querySelector(".card-title");
    const descriptionElement = editedElement.querySelector(".card-description");

    const newTitle = prompt("Edit Title:", titleElement.textContent);
    const newBody = prompt("Edit Body:", descriptionElement.textContent);

    if (newTitle === null || newBody === null) {
      return;
    }

    try {
      const response = await fetch(`${PUT_POSTS}${postId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit post");
      }

      titleElement.textContent = newTitle;
      descriptionElement.textContent = newBody;
    } catch (error) {
      console.error(error);
      alert("An error occurred while editing the post.");
    }
  }

  async function deletePost(postId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const confirmation = confirm("Are you sure you want to delete this post?");

    if (confirmation) {
      try {
        const response = await fetch(`${DELETE_POSTS}${postId}`, {
          method: "DELETE",
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        const deletedElement = document.getElementById(`post-${postId}`);
        if (deletedElement) {
          deletedElement.remove();
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the post.");
      }
    }
  }

  async function fetchPosts(accessToken) {
    const response = await fetch(`${GET_POSTS}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return response.json();
  }

  function updatePostFeed(posts) {
    const postFeedElement = document.getElementById("postFeed");
    const loggedInUserEmail = localStorage.getItem("email");

    if (postFeedElement) {
      if (posts.length === 0) {
        postFeedElement.innerHTML = "<p>No posts available.</p>";
      } else {
        postFeedElement.innerHTML = posts
          .map(
            (post) => `
              <div class="card" id="post-${post.id}">
              ${post.media ? `<img src="${post.media}" onerror="this.style.display='none'">` : ''}
                <div class="card-content">
                  <div class="author-info">
                    <div class="profile-picture">
                      <img src="${post.author.avatar || "/assets/user_avt.png"}" alt="">
                    </div>
                    <p class="card-user">${post.author.name}</p>
                  </div>
                  <h3 class="card-title">${post.title}</h3>
                  <p class="card-description">${post.body || ""}</p>
                  <a class="card-link readMoreBtn" id="readMoreLink${post.id}" href="#">Read More</a>
                  ${
                    post.author.email === loggedInUserEmail
                      ? `<a class="card-link editBtn" data-postid="${post.id}" href="#">Edit</a>`
                      : ""
                  }
                  ${
                    post.author.email === loggedInUserEmail
                      ? `<a class="card-link deleteBtn" data-postid="${post.id}" href="#">Delete</a>`
                      : ""
                  }
                  <div class="post-id">Post ID: ${post.id}</div>
                </div>
              </div>
            `
          )
          .join("");

        const deleteButtons = document.querySelectorAll(".deleteBtn");

        deleteButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();
            const postId = e.target.dataset.postid;
            deletePost(postId);
          });
        });

        const editButtons = document.querySelectorAll(".editBtn");

        editButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();
            const postId = e.target.dataset.postid;
            editPost(postId);
          });
        });
      }
    }
  }

  async function fetchAndDisplayPosts() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please log in to view posts.");
      return;
    }

    try {
      const posts = await fetchPosts(accessToken);
      updatePostFeed(posts);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching posts.");
    }
  }

  fetchAndDisplayPosts();

  const filterMediaSelect = document.getElementById("filterByMedia");

  filterMediaSelect.addEventListener("change", async function () {
    const selectedValue = filterMediaSelect.value;
    const accessToken = localStorage.getItem("accessToken");
    let posts;

    try {
      const response = await fetch(`${GET_POSTS}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      posts = await response.json();

      if (selectedValue === "withMedia") {
        posts = posts.filter(post => post.media);
      } else if (selectedValue === "withoutMedia") {
        posts = posts.filter(post => !post.media);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching posts.");
      return;
    }

    updatePostFeed(posts);
  });

  document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm.trim() !== '') {
      searchPostsByTitle(searchTerm);
    } else {
      window.location.reload();
    }
  });

  async function searchPostsByTitle(searchTerm) {
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }
  
    try {
      const response = await fetch(`${GET_POSTS}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
  
      const posts = await response.json();
      const filteredPosts = posts.filter(post => post.title.includes(searchTerm));
  
      updatePostFeed(filteredPosts);
    } catch (error) {
      console.error(error);
      alert("An error occurred while searching for posts.");
    }
  }

});


