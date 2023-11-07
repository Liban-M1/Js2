document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
  
    if (!postId) {
      console.error("Post ID not found in URL");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
      }
  
      const response = await fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
  
      const postData = await response.json();
  
      const postTitleElement = document.getElementById("postTitle");
      const postContentElement = document.getElementById("postContent");
      const mediaElement = document.getElementById("media");
      const postIdElement = document.getElementById("postid");
  
      if (postTitleElement) {
        postTitleElement.textContent = postData.title;
      }
  
      if (postContentElement) {
        postContentElement.textContent = postData.body;
      }
  
      if (mediaElement && postData.media) {
        mediaElement.src = postData.media;
      }
  
      if (postIdElement) {
        postIdElement.textContent = `Post ID: ${postData.id}`;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the post.");
    }
  });
  
  
  

