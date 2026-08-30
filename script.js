const entries = [
    {
        date: "2026-08-01", // Store the date of the volunteer work.
        hours: 3, // Store the number of hours volunteered.
        description: "Los Baños ministry" // Store a description of the volunteer work.
    },
    {
        date: "2026-08-02", // Store the date of the volunteer work.
        hours: 2, // Store the number of hours volunteered.
        description: "Los Baños ministry" // Store a description of the volunteer work.
    },
    {
        date: "2026-08-05", // Store the date of the volunteer work.
        hours: 2, // Store the number of hours volunteered.
        description: "Bay ministry" // Store a description of the volunteer work.
    },
    {
        date: "2026-08-21", // Store the date of the volunteer work.
        hours: 7, // Store the number of hours volunteered.
        description: "Calamba ministry" // Store a description of the volunteer work.
    }
];

console.log(entries, entries[0], entries.length); // Print the entire array, the first entry, and the number of entries.

const totalHoursElement = document.getElementById("totalHours"); // Find the HTML element with the ID "totalHours".

const updateTotalHours = (entriesArray) => { // Create a function to update the total hours displayed in the HTML.

    const totalHours = entriesArray.reduce( // Calculate the total number of volunteer hours.
        (total, entry) => total + entry.hours, // Add the current entry's hours to the running total.
        0 // Start the total at 0.
    );

    console.log("Total hours:", totalHours); // Print the calculated total to the console.

    totalHoursElement.textContent = totalHours; // Update the HTML element with the new total hours.
};

updateTotalHours(entries); // Call the function to calculate and display the initial total hours.

const tableBody = document.getElementById("entriesTableBody"); // Find the <tbody> where our table rows will be placed.

const displayEntry = (entry) => { // Create a function that displays one entry in the table.

    const row = document.createElement("tr"); // Create a new table row.

    const dateCell = document.createElement("td"); // Create a new table cell for the date.
    const hoursCell = document.createElement("td"); // Create a new table cell for the hours.
    const descriptionCell = document.createElement("td"); // Create a new table cell for the description.

    dateCell.textContent = entry.date; // Put the entry's date inside the date cell.
    hoursCell.textContent = entry.hours; // Put the entry's hours inside the hours cell.
    descriptionCell.textContent = entry.description; // Put the entry's description inside the description cell.

    row.appendChild(dateCell); // Put the date cell inside the row.
    row.appendChild(hoursCell); // Put the hours cell inside the row.
    row.appendChild(descriptionCell); // Put the description cell inside the row.

    tableBody.appendChild(row); // Put the completed row inside the table body.
};

entries.forEach((entry) => { // Go through every object in the entries array.
    displayEntry(entry); // Display the current entry in the table.
});

const dateInput = document.getElementById("dateInput"); // Find the date input.
const hoursInput = document.getElementById("hoursInput"); // Find the hours input.
const descriptionInput = document.getElementById("descriptionInput"); // Find the description input.

const addHoursButton = document.getElementById("addHoursButton"); // Find the Add Hours button.

const validateInputs = () => { // Create a function that checks whether all inputs have values.

    if (dateInput.value === "" || 
        hoursInput.value === "" || 
        hoursInput.value < 0 ||
        descriptionInput.value === "" ) { // Check if any of the inputs are invalid
        return false; // Return false if at least one input is empty.
    }

    return true; // Return true if all inputs have values.
};

// Listen for a click on the Add Hours button.
addHoursButton.addEventListener("click", () => {

    if (!validateInputs()) { // Check if the inputs are valid.
        alert("Please fill in all fields."); // Show an alert if any input is empty.
        return; // Stop the function from continuing.
    }

    const newEntry = {
        date: dateInput.value, // Get the date entered by the user.
        hours: Number(hoursInput.value), // Get the hours entered and convert them from a string to a number.
        description: descriptionInput.value // Get the description entered by the user.
    };

    entries.push(newEntry); // Add the new entry to the entries array.
    displayEntry(newEntry); // Display the new entry in the table.
    updateTotalHours(entries); // Recalculate and display the new total hours.

    dateInput.value = ""; // Clear the date input field.
    hoursInput.value = ""; // Clear the hours input field.
    descriptionInput.value = ""; // Clear the description input field.
});