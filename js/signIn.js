
import config from "./config.js";
const API_BASE = config.API_BASE;

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("Login");

  const loginUrl = `${API_BASE}/api/v1/social/auth/login`;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("avatar", data.avatar);

      console.log("Login successful!");
      window.location.href = "feed.html";
    } catch (error) {
      console.error(error);
      alert("Invalid email or password.");
    }
  });
});





