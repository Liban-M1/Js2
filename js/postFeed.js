import config from "./config.js";
const API_BASE = config.API_BASE;
const POST_POSTS = config.POST_POSTS;
const GET_POSTS = config.GET_POSTS;

// POST POSTS

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
});

// GET POSTS

document.addEventListener("DOMContentLoaded", async function () {
    const postFeedElement = document.getElementById("postFeed");
    const accessToken = localStorage.getItem("accessToken");
    const loggedInUserEmail = localStorage.getItem("email");

    if (!accessToken) {
        alert("Please log in to view posts.");
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
        const postsWithMedia = posts.filter(post => post.media);

        if (postFeedElement) {
            if (postsWithMedia.length === 0) {
                postFeedElement.innerHTML = "<p>No posts with media available.</p>";
            } else {
                postFeedElement.innerHTML = postsWithMedia
                    .map(
                        (post) => `
                        <div class="card">
                            <img src="${post.media}">
                            <div class="card-content">
                                <div class="author-info">
                                    <div class="profile-picture">
                                        <img src="${post.author.avatar || "/assets/user_avt.png"}" alt="">
                                    </div>
                                    <p class="card-user">${post.author.name}</p>
                                </div>
                                <h3 class="card-title">${post.title}</h3>
                                <p class="card-description">${post.body || ""}</p>
                                <a class="card-link" href="#">Read More</a>
                                <a class="card-link" href="#">Share</a>
                                ${post.author.email === loggedInUserEmail ? `<a class="card-link deleteBtn" href="#">Delete</a>` : ''}
                            </div>
                        </div>
                    `
                    )
                    .join("");
            }
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching posts.");
    }
});




