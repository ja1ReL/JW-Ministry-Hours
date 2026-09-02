const supabaseUrl = "https://aqbtnrrjmlfcawgopxjb.supabase.co"; // Store your Supabase project URL.
const supabaseKey = "sb_publishable_8ZtZTh_YlKnF1qwoOJTWMg_xiePdk44"; // Store your Supabase publishable key.
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey); // Create a connection between our website and Supabase.

const checkUser = async () => { // Create a function that checks whether someone is already logged in.

    const { data: { user } } = await supabaseClient.auth.getUser(); // Ask Supabase for the currently logged-in user.

    if (user) { // Check whether a user was found.
        window.location.href = "index.html"; // Send the logged-in user to the main app.
    }
};

checkUser(); // Run the check when the login page loads.

const loginSection = document.getElementById("loginSection"); // Find the login section.
const signupSection = document.getElementById("signupSection"); // Find the signup section

const emailInput = document.getElementById("emailInput"); // Find the login email input.
const passwordInput = document.getElementById("passwordInput"); // Find the login password input.
const loginButton = document.getElementById("loginButton"); // Find the Log In button.
loginButton.addEventListener("click", async () => { // Run this when the user clicks Log In.

    const email = emailInput.value; // Get the email entered by the user.
    const password = passwordInput.value; // Get the password entered by the user.

    const { data, error } = await supabaseClient.auth.signInWithPassword({ // Ask Supabase to log the user in.
        email: email, // Send the entered email to Supabase.
        password: password // Send the entered password to Supabase.
    });

    console.log("Login data:", data); // Show the login result in the console.
    console.log("Login error:", error); // Show any login error in the console.

    if (error) { // Check whether the login failed.
    alert("Login failed."); // Tell the user that the login was unsuccessful.
    return; // Stop the function so we don't redirect.
}

window.location.href = "index.html"; // Send the successfully logged-in user to the main app.
});

const emailSignUpInput = document.getElementById("emailSignUpInput"); // Find the signup email input.
const passwordSignUpInput = document.getElementById("passwordSignUpInput"); // Find the signup password input.
const confirmPasswordInput = document.getElementById("confirmPasswordInput"); // Find the confirm password input.
const signUpButton = document.getElementById("signUpButton"); // Find the Sign Up button.

signUpButton.addEventListener("click", async() => { // Run this when the user clicks Sign Up.

    const email = emailSignUpInput.value; //Get signup email
    const password = passwordSignUpInput.value; // Get the password entered by the user.
    const confirmPassword = confirmPasswordInput.value; // Get the confirmation password.

    if (password !== confirmPassword) { // Check whether the two passwords are different.
        alert("Passwords do not match."); // Tell the user the passwords are different.
        return; // Stop the signup process.
    }

    const { data, error } = await supabaseClient.auth.signUp({ // Ask Supabase to create the account.
        email: email, // Send the email to Supabase.
        password: password // Send the password to Supabase.
    });

    console.log("Signup data:", data); // Show the signup result.
    console.log("Signup error:", error); // Show any signup error.

    if (error) { // Check whether signup failed.
        alert("Signup failed."); // Tell the user signup failed.
        return; // Stop the function.
    }

    if (data.session) { // Check whether Supabase automatically logged the user in.
    window.location.href = "index.html"; // Send the logged-in user to the main app.
} else { // If there is no session, email confirmation is required.
    alert("Account created! Please check your email to confirm your account."); // Tell the user what to do next.
}
    
});


const showSignupButton = document.getElementById("showSignupButton"); // Find the Sign Up button.
showSignupButton.addEventListener("click", () => { // Run this when Sign Up is clicked.
    loginSection.style.display = "none"; // Hide the login form.
    signupSection.style.display = "block"; // Show the signup form.
});

const showLoginButton = document.getElementById("showLoginButton"); // Find the Log In button inside the signup section.
showLoginButton.addEventListener("click", () => { // Run this when the Log In button is clicked.
    signupSection.style.display = "none"; // Hide the signup form.
    loginSection.style.display = "block"; // Show the login form.
});

console.log(loginSection); // Show the login section in the browser console.
console.log(signupSection); // Show the signup section in the browser console.