const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const LOGIN_API_URL = "https://69df293ed6de26e11928a3ce.mockapi.io/login_page";
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordButton = document.getElementById("togglePassword");
    const formMessage = document.getElementById("formMessage");
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const submitButton = loginForm.querySelector(".login-button");

    function setMessage(text, type = "") {
        formMessage.textContent = text;
        formMessage.className = type ? `form-message ${type}` : "form-message";
    }

    function setFieldState(input, errorNode, message) {
        const hasError = Boolean(message);

        input.classList.toggle("is-invalid", hasError);
        input.setAttribute("aria-invalid", hasError ? "true" : "false");
        errorNode.textContent = message;
    }

    function validateField(input, errorNode) {
        const value = input.value.trim();
        const label = input.name === "username" ? "username" : "password";
        const message = value ? "" : `Please enter your ${label}.`;

        setFieldState(input, errorNode, message);
        return !message;
    }

    async function authenticateUser(username, password) {
        const response = await fetch(LOGIN_API_URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Login service is unavailable.");
        }

        const users = await response.json();

        return users.find((user) => {
            return user.username === username && user.password === password;
        });
    }

    function showAlert(icon, title, text) {
        if (window.Swal) {
            return window.Swal.fire({
                icon,
                title,
                text,
                confirmButtonColor: "#433726",
            });
        }

        window.alert(text);
        return Promise.resolve();
    }

    togglePasswordButton.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        togglePasswordButton.textContent = isPassword ? "Hide" : "View";
        togglePasswordButton.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });

    usernameInput.addEventListener("input", () => {
        validateField(usernameInput, usernameError);
    });

    passwordInput.addEventListener("input", () => {
        validateField(passwordInput, passwordError);
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const isUsernameValid = validateField(usernameInput, usernameError);
        const isPasswordValid = validateField(passwordInput, passwordError);

        if (!isUsernameValid || !isPasswordValid) {
            setMessage("Please correct the highlighted fields.", "error");
            showAlert("warning", "Missing details", "Please fill in username and password.");
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        submitButton.disabled = true;
        submitButton.textContent = "Checking...";
        setMessage("");

        try {
            const matchedUser = await authenticateUser(username, password);

            if (!matchedUser) {
                setMessage("Invalid username or password.", "error");
                await showAlert("error", "Login failed", "Invalid username or password.");
                return;
            }

            setMessage(`Welcome back, ${matchedUser.username}.`, "success");
            window.localStorage.setItem("dashboardUser", JSON.stringify({
                id: matchedUser.id,
                username: matchedUser.username,
            }));
            await showAlert("success", "Login successful", `Welcome back, ${matchedUser.username}.`);
            window.location.href = "dashboard.html";
        } catch (error) {
            setMessage(error.message || "Unable to verify login right now.", "error");
            await showAlert("error", "Service error", error.message || "Unable to verify login right now.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Log in";
        }
    });
}
