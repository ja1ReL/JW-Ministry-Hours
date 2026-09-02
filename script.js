const supabaseUrl = "https://aqbtnrrjmlfcawgopxjb.supabase.co"; // Store your Supabase project URL.
const supabaseKey = "sb_publishable_8ZtZTh_YlKnF1qwoOJTWMg_xiePdk44"; // Store your Supabase publishable key.
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey); // Create a connection between our website and Supabase.

const checkUser = async () => { // Create a function that checks whether someone is logged in.

    const { data: { user } } = await supabaseClient.auth.getUser(); // Ask Supabase for the currently logged-in user.

    if (!user) { // Check whether there is no logged-in user.
        window.location.href = "login.html"; // Send the user to the login page.
        return; // Stop the function.
    }

    const userEmail = document.getElementById("userEmail"); // Find the element where we will display the user's email.
    userEmail.textContent = user.email; // Put the logged-in user's email into that element.
    console.log("Logged-in user:", user); // Show the logged-in user's information in the console.
    loadEntries();
};

checkUser(); // Run the login check when the app loads.

const logoutButton = document.getElementById("logoutButton"); // Find the Log Out button.
logoutButton.addEventListener("click", async () => { // Run this when the user clicks Log Out.

    const { error } = await supabaseClient.auth.signOut(); // Ask Supabase to log the current user out.

    console.log("Logout error:", error); // Show any logout error in the console.

    if (error) { // Check whether the logout failed.
        alert("Could not log out."); // Tell the user something went wrong.
        return; // Stop the function.
    }

    window.location.href = "login.html"; // Send the user back to the login page.
});

const entries = []; // Create an empty array that will hold entries loaded from Supabase.

const loadEntries = async () => { // Create a function that loads entries from Supabase.

    const { data: { user } } = await supabaseClient.auth.getUser(); // Get the currently logged-in user.

    if (!user) { // Check if there is no logged-in user.
        console.log("No user is logged in."); // Tell us in the console that there is no logged-in user.
        return; // Stop the function.
    }

    console.log("Logged-in user ID:", user.id); // Show the user's unique ID in the console.

    const { data, error } = await supabaseClient // Ask Supabase for entries.
        .from("entries") // Tell Supabase which table we want.
        .select("*") // Ask for all columns.
        .eq("user_id", user.id); // Only request rows belonging to this user.

    console.log("Database entries:", data); // Show the entries Supabase returned.
    console.log("Database error:", error); // Show any error Supabase returned.

    if (error) { // Check whether the database request failed.
        return; // Stop if there was an error.
    }

    entries.push(...data); // Put the database entries into our local entries array.

    displayMonth(); // Refresh the table using the entries we just loaded.
};

const today = new Date(); // Get today's date.
let currentMonth = today.toISOString().slice(0, 7); // Get the current month in YYYY-MM format.

const totalHoursElement = document.getElementById("totalHours"); // Find the total hours element.
const entriesList = document.getElementById("entriesList"); // Find the table body.
const monthTitle = document.getElementById("monthTitle"); // Find the month title.
const previousMonthButton = document.getElementById("previousMonthButton"); // Find the previous month button.
const nextMonthButton = document.getElementById("nextMonthButton"); // Find the next month button.

const updateTotalHours = (entriesArray) => { // Create a function to calculate and display total hours.

    const totalHours = entriesArray.reduce( // Calculate the total hours.
        (total, entry) => total + entry.hours, // Add each entry's hours to the running total.
        0 // Start the total at 0.
    );

    console.log("Total hours:", totalHours); // Show the total in the console.

    totalHoursElement.textContent = totalHours; // Put the total into the HTML.
};

const displayMonth = () => { // Display all entries belonging to the current month.

    entriesList.innerHTML = ""; // Clear the entry cards before displaying the current month.

    const monthlyEntries = entries.filter((entry) => { // Find entries belonging to the current month.
        return entry.date.startsWith(currentMonth); // Check whether the entry starts with the current month.
    });

    if (monthlyEntries.length === 0) { // Check if there are no entries for the current month.

        const emptyMessage = document.createElement("div"); // Create a div for the empty-state message.

        emptyMessage.textContent = "No ministry hours recorded for this month."; // Display the message.

        emptyMessage.classList.add("empty-message"); // Give the message its own CSS class.

        entriesList.appendChild(emptyMessage); // Put the message inside the entries container.

    } else {

        monthlyEntries.forEach((entry) => { // Go through every entry belonging to the current month.

            displayEntry(entry); // Create a card for that entry.

        });
    }
    updateTotalHours(monthlyEntries); // Calculate the total only for the current month.
};

const changeMonth = (amount) => { // Change the month being viewed.

    const date = new Date(currentMonth); // Create a Date object from the current month.

    date.setMonth(date.getMonth() + amount); // Move forward or backward by one month.

    currentMonth = date.toISOString().slice(0, 7); // Convert the new date back into YYYY-MM format.

    monthTitle.textContent = date.toLocaleString("en-US", { // Update the month title.
        month: "long",
        year: "numeric"
    });

    displayMonth(); // Refresh the table and total for the new month.
};

previousMonthButton.addEventListener("click", () => { // Listen for a click on the previous month button.
    changeMonth(-1); // Go back one month.
});

nextMonthButton.addEventListener("click", () => { // Listen for a click on the next month button.
    changeMonth(1); // Go forward one month.
});

let editingEntry = null; // Store the entry currently being edited.

const formatDate = (dateString) => { // Convert the stored date into a readable date.
    const date = new Date(`${dateString}T00:00:00`); // Create a date without timezone shifting.

    return date.toLocaleDateString("en-US", { // Format the date for display.
        month: "long", // Show the full month name.
        day: "numeric", // Show the day number.
        year: "numeric" // Show the year.
    });
};

const displayEntry = (entry) => { // Create a card that displays one ministry entry.

    const card = document.createElement("div"); // Create the main card container.
    card.classList.add("entry-card"); // Give the card a CSS class.

    const topRow = document.createElement("div"); // Create the top section of the card.
    topRow.classList.add("entry-top"); // Give the top section a CSS class.

    const dateElement = document.createElement("span"); // Create an element for the date.
    dateElement.classList.add("date-cell"); // Give the date its own CSS class.

    const hoursElement = document.createElement("span"); // Create an element for the hours.
    hoursElement.classList.add("hours-cell"); // Give the hours its own CSS class.

    const descriptionElement = document.createElement("p"); // Create a paragraph for the description.
    descriptionElement.classList.add("description-cell"); // Give the description its own CSS class.

    const actionElement = document.createElement("div"); // Create a container for the buttons.
    actionElement.classList.add("action-cell"); // Give the button container its own CSS class.

    const editButton = document.createElement("button"); // Create the Edit button.
    const deleteButton = document.createElement("button"); // Create the Delete button.

    dateElement.textContent = formatDate(entry.date); // Display the formatted date.
    hoursElement.textContent = `${entry.hours} hrs`; // Display the number of hours.

    descriptionElement.textContent = entry.description; // Display the entry description.

    editButton.textContent = "Edit"; // Give the Edit button its text.
    deleteButton.textContent = "Delete"; // Give the Delete button its text.

    editButton.addEventListener("click", () => { // Listen for a click on Edit.

        console.log("Edit clicked"); // Show that Edit was clicked.

        editingEntry = entry; // Remember which entry we are editing.

        editDateInput.value = entry.date; // Put the entry date into the edit modal.
        editHoursInput.value = entry.hours; // Put the entry hours into the edit modal.
        editDescriptionInput.value = entry.description; // Put the description into the edit modal.

        editModal.style.display = "flex"; // Show the edit modal.
    });

    deleteButton.addEventListener("click", async () => { // Listen for a click on Delete.

        console.log("Delete clicked"); // Show that Delete was clicked.

        const confirmed = confirm("Are you sure you want to delete this entry?"); // Ask the user to confirm the deletion.

        if (!confirmed) return; // Stop here if the user clicks Cancel.

        const { error } = await supabaseClient // Ask Supabase to delete the entry.
            .from("entries") // Tell Supabase which table we want.
            .delete() // Tell Supabase to delete a row.
            .eq("id", entry.id); // Find the specific entry using its ID.

        console.log("Delete error:", error); // Show any error from Supabase.

        if (error) { // Check whether Supabase reported an error.

            alert("Could not delete the entry."); // Tell the user that the delete failed.

            return; // Stop so we don't change the page incorrectly.
        }

        const entryIndex = entries.indexOf(entry); // Find the position of this entry in the array.

        entries.splice(entryIndex, 1); // Remove the entry from the array.

        displayMonth(); // Refresh the cards and total for the current month.
    });

    actionElement.appendChild(editButton); // Put the Edit button inside the action container.
    actionElement.appendChild(deleteButton); // Put the Delete button inside the action container.

    topRow.appendChild(dateElement); // Put the date into the top row.
    topRow.appendChild(hoursElement); // Put the hours into the top row.

    card.appendChild(topRow); // Put the top row inside the card.
    card.appendChild(descriptionElement); // Put the description inside the card.
    card.appendChild(actionElement); // Put the buttons inside the card.

    entriesList.appendChild(card); // Put the completed card inside the entries list.
};
const dateInput = document.getElementById("dateInput"); // Find the date input.
const hoursInput = document.getElementById("hoursInput"); // Find the hours input.
const descriptionInput = document.getElementById("descriptionInput"); // Find the description input.

descriptionInput.addEventListener("input", () => { // Run whenever the user types in the description.
    descriptionInput.style.height = "auto"; // Reset the height so it can shrink if text is deleted.
    descriptionInput.style.height = `${descriptionInput.scrollHeight}px`; // Set the height to fit all the text.
});



const editModal = document.getElementById("editModal"); // Find the edit modal.
const editDateInput = document.getElementById("editDateInput"); // Find the edit date input.
const editHoursInput = document.getElementById("editHoursInput"); // Find the edit hours input.
const editDescriptionInput = document.getElementById("editDescriptionInput"); // Find the edit description input.
const saveEditButton = document.getElementById("saveEditButton"); // Find the Save Changes button.
const closeEditModal = document.getElementById("closeEditModal"); // Find the X button.

const todayString = today.toISOString().slice(0, 10); // Convert today's date into YYYY-MM-DD format.
dateInput.max = todayString; // Prevent the user from selecting a future date.
editDateInput.max = todayString; // Prevent the user from selecting a future date when editing.

const validateInputs = (date, hours, description) => { // Create a function that checks whether inputs are valid.

    if (
        date.value === "" || // Check if the date is empty.
        hours.value === "" || // Check if the hours are empty.
        hours.value < 0 || // Check if the hours are negative.
        description.value === "" // Check if the description is empty.
    ) {
        return false; // Return false if any input is invalid.
    } 

    return true; // Return true if all inputs are valid.
};

closeEditModal.addEventListener("click", () => { // Listen for a click on the X button.

    editModal.style.display = "none"; // Hide the edit modal.

    editingEntry = null; // Exit edit mode.

});

saveEditButton.addEventListener("click", async () => { // Listen for a click on Save Changes and allow us to use await.

    if (editingEntry === null) return; // Stop if there is no entry being edited.

    if (!validateInputs(editDateInput, editHoursInput, editDescriptionInput)) { // Check whether the edited values are valid.

        alert("Please fill in all fields."); // Tell the user what went wrong.

        return; // Stop the save process.
    }

    const { data, error } = await supabaseClient // Ask Supabase to update the entry.

        .from("entries") // Tell Supabase which table we want to update.
        .update({ // Tell Supabase which values should be changed.
            date: editDateInput.value, // Send the new date.
            hours: Number(editHoursInput.value), // Send the new hours as a number.
            description: editDescriptionInput.value // Send the new description.
        })
        .eq("id", editingEntry.id) // Find the specific database entry using its ID.
        .select() // Ask Supabase to return the updated entry.
        .single(); // Return the updated entry as one object.

    console.log("Updated entry:", data); // Show the updated entry in the console.
    console.log("Update error:", error); // Show any error from Supabase.

    if (error) { // Check whether Supabase reported an error.
        alert("Could not update the entry."); // Tell the user that the update failed.
        return; // Stop so we don't change the page incorrectly.
    }

    editingEntry.date = data.date; // Update the local entry with the new date.
    editingEntry.hours = data.hours; // Update the local entry with the new hours.
    editingEntry.description = data.description; // Update the local entry with the new description.

    displayMonth(); // Refresh the table and total in case the month changed.

    editModal.style.display = "none"; // Hide the edit modal.
    editingEntry = null; // Exit edit mode.
});

const addHoursButton = document.getElementById("addHoursButton"); // Find the Add Hours button.

addHoursButton.addEventListener("click", async () => { // Listen for a click on Add Hours.
    if (!validateInputs(dateInput, hoursInput, descriptionInput)) { // Check whether the inputs are valid.
        alert("Please fill in all fields."); // Tell the user what went wrong.
        return; // Stop the function.
    }

    const { data: { user } } = await supabaseClient.auth.getUser(); // Get the currently logged-in user.
    if (!user) { // Make sure a user is actually logged in.
        console.log("No user is logged in."); // Tell us why the entry cannot be saved.
        return; // Stop the function.
    }

    const newEntry = { // Create a new ministry entry.
        user_id: user.id, // Store the logged-in user's ID as the owner of this entry.
        date: dateInput.value, // Get the date from the input.
        hours: Number(hoursInput.value), // Get the hours and convert them to a number.
        description: descriptionInput.value // Get the description from the input.
    };

      const { data, error } = await supabaseClient // Send the new entry to Supabase.
        .from("entries") // Tell Supabase which table we want to use.
        .insert(newEntry) // Insert the new entry into the table.
        .select() // Ask Supabase to return the entry it just created.
        .single(); // Return the new entry as one object.

        console.log("Inserted entry:", data); // Show the newly inserted entry in the console.
        console.log("Insert error:", error); // Show any error from Supabase.

         if (error) { // Check whether Supabase reported an error.
        alert("Could not save the entry."); // Tell the user that saving failed.
        return; // Stop the function so we don't update the page incorrectly.
    }

    entries.push(data); // Add the new entry to the entries array.

    displayMonth(); // Refresh the table and total for the current month.

    dateInput.value = ""; // Clear the date input.

    hoursInput.value = ""; // Clear the hours input.

    descriptionInput.value = ""; // Clear the description input.
});

monthTitle.textContent = new Date(currentMonth).toLocaleString("en-US", { // Set the month title when the page first loads.
    month: "long",
    year: "numeric"
});     
displayMonth(); // Display the current month's entries when the page loads.
