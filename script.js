const entries = [
    {
        date: "2026-08-01", 
        hours: 3, 
        description: "Los Baños ministry"
    },
    {
        date: "2026-08-02", 
        hours: 2, 
        description: "Los Baños ministry" 
    },
    {
        date: "2026-08-05", 
        hours: 2, 
        description: "Bay ministry" 
    },
    {
        date: "2026-08-21", 
        hours: 7, 
        description: "Calamba ministry" 
    }
];

const today = new Date(); // Get today's date.
let currentMonth = today.toISOString().slice(0, 7); // Get the current month in YYYY-MM format.

const totalHoursElement = document.getElementById("totalHours"); // Find the total hours element.
const tableBody = document.getElementById("entriesTableBody"); // Find the table body.
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

    tableBody.innerHTML = ""; // Clear the table before displaying the current month.

    const monthlyEntries = entries.filter((entry) => { // Find entries belonging to the current month.
        return entry.date.startsWith(currentMonth); // Check whether the entry starts with the current month.
    });

    if (monthlyEntries.length === 0) { // Check if there are no entries for the current month.
    const row = document.createElement("tr"); // Create a table row.
    const cell = document.createElement("td"); // Create a table cell.
    cell.textContent = "No ministry hours recorded for this month."; // Display a message when the month is empty.
    cell.colSpan = 4; // Make the message span across all four table columns.
    cell.classList.add("empty-message"); // Give the empty-state cell its own CSS class.
    row.appendChild(cell); // Put the cell inside the row.
    tableBody.appendChild(row); // Put the row inside the table.
    } else {
    monthlyEntries.forEach((entry) => { // Go through every entry belonging to the current month.
        displayEntry(entry); // Display that entry in the table.
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
let editingRow = null; // Store the table row currently being edited.

const formatDate = (dateString) => { // Convert the stored date into a readable date.
    const date = new Date(`${dateString}T00:00:00`); // Create a date without timezone shifting.

    return date.toLocaleDateString("en-US", { // Format the date for display.
        month: "long", // Show the full month name.
        day: "numeric", // Show the day number.
        year: "numeric" // Show the year.
    });
};

const displayEntry = (entry) => { // Create a function that displays one entry in the table.

    const row = document.createElement("tr"); // Create a new table row.

    const dateCell = document.createElement("td"); // Create a cell for the date.
    const hoursCell = document.createElement("td"); // Create a cell for the hours.
    const descriptionCell = document.createElement("td"); // Create a cell for the description.
    const actionCell = document.createElement("td"); // Create a cell for the buttons.
    actionCell.classList.add("action-cell"); // Give the action cell its own class.

    const editButton = document.createElement("button"); // Create the Edit button.
    const deleteButton = document.createElement("button"); // Create the Delete button.

    dateCell.textContent = formatDate(entry.date); // Put the entry date into the date cell. and formatDate makes it readable.
    hoursCell.textContent = entry.hours; // Put the entry hours into the hours cell.
    descriptionCell.textContent = entry.description; // Put the entry description into the description cell.

    editButton.textContent = "Edit"; // Give the Edit button its text.
    deleteButton.textContent = "Delete"; // Give the Delete button its text.

    editButton.addEventListener("click", () => { // Listen for a click on Edit.

        console.log("Edit clicked"); // Show that Edit was clicked.

        editingEntry = entry; // Remember which entry we are editing.
        editingRow = row; // Remember which row we are editing.

        editDateInput.value = entry.date; // Put the entry date into the edit modal.
        editHoursInput.value = entry.hours; // Put the entry hours into the edit modal.
        editDescriptionInput.value = entry.description; // Put the description into the edit modal.

        editModal.style.display = "flex"; // Show the edit modal.
    });

    deleteButton.addEventListener("click", () => { // Listen for a click on Delete.

        console.log("Delete clicked"); // Show that Delete was clicked.
        const confirmed = confirm("Are you sure you want to delete this entry?"); // Ask the user to confirm the deletion.
        if (!confirmed) return; // Stop here if the user clicks Cancel.

        const entryIndex = entries.indexOf(entry); // Find the position of this entry in the array.
        console.log("Entry:", entry, entryIndex); // Show the entry and its index.
        console.log("Index:", entryIndex); // Show the index.

        entries.splice(entryIndex, 1); // Remove the entry from the array.

        displayMonth(); // Refresh the table and total for the current month.
    });

    actionCell.appendChild(editButton); // Put the Edit button inside the action cell.
    actionCell.appendChild(deleteButton); // Put the Delete button inside the action cell.

    row.appendChild(dateCell); // Put the date cell inside the row.
    row.appendChild(hoursCell); // Put the hours cell inside the row.
    row.appendChild(descriptionCell); // Put the description cell inside the row.
    row.appendChild(actionCell); // Put the action cell inside the row.

    tableBody.appendChild(row); // Put the completed row inside the table body.
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

    editingRow = null; // Forget the row being edited.
});

saveEditButton.addEventListener("click", () => { // Listen for a click on Save Changes.

    if (editingEntry === null) return; // Stop if there is no entry being edited.

    if (!validateInputs(editDateInput, editHoursInput, editDescriptionInput)) { // Check whether the edited values are valid.

        alert("Please fill in all fields."); // Tell the user what went wrong.

        return; // Stop the save process.
    }

    editingEntry.date = editDateInput.value; // Replace the old date with the edited date.

    editingEntry.hours = Number(editHoursInput.value); // Replace the old hours with the edited hours.

    editingEntry.description = editDescriptionInput.value; // Replace the old description.

    displayMonth(); // Refresh the table and total in case the month changed.

    editModal.style.display = "none"; // Hide the edit modal.

    editingEntry = null; // Exit edit mode.

    editingRow = null; // Forget the row being edited.
});

const addHoursButton = document.getElementById("addHoursButton"); // Find the Add Hours button.

addHoursButton.addEventListener("click", () => { // Listen for a click on Add Hours.

    if (!validateInputs(dateInput, hoursInput, descriptionInput)) { // Check whether the inputs are valid.

        alert("Please fill in all fields."); // Tell the user what went wrong.

        return; // Stop the function.
    }

    const newEntry = { // Create a new ministry entry.

        date: dateInput.value, // Get the date from the input.

        hours: Number(hoursInput.value), // Get the hours and convert them to a number.

        description: descriptionInput.value // Get the description from the input.
    };

    entries.push(newEntry); // Add the new entry to the entries array.

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