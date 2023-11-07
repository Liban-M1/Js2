
import config from "./config.js";
const API_BASE = config.API_BASE;


document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("Register");

  const registrationUrl = `${API_BASE}/api/v1/social/auth/register`;

  registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const avatar = document.getElementById("avatar").value;
      const banner = document.getElementById("banner").value;

      try {
          const response = await fetch(registrationUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  name,
                  email,
                  password,
                  avatar,
                  banner,
              }),
          });

          if (!response.ok) {
              throw new Error("Registration failed");
          }

          console.log("Registration successful!");
          window.location.href = "index.html";
      } catch (error) {
          console.error(error);
          alert("An error occurred during registration. Please try again later.");
      }
  });
});






  