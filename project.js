// ==================== STUDENT DATA ====================

let students = [];


// ==================== GET HTML ELEMENTS ====================

let nameInput = document.getElementById("studentName");
let emailInput = document.getElementById("studentEmail");
let courseInput = document.getElementById("studentCourse");

let addButton = document.getElementById("addStudentBtn");

let table = document.getElementById("studentTable");

let searchInput = document.getElementById("searchStudent");

let totalStudents = document.getElementById("totalStudents");

let totalCount = document.getElementById("totalCount");
let presentCount = document.getElementById("presentCount");
let absentCount = document.getElementById("absentCount");

let themeButton = document.getElementById("themeButton");


// ==================== LOAD STUDENTS FROM LOCAL STORAGE ====================

let savedStudents = localStorage.getItem("students");

if (savedStudents) {
    students = JSON.parse(savedStudents);
}


// ==================== UPDATE DASHBOARD ====================

function updateDashboard() {

    totalCount.textContent = students.length;

    presentCount.textContent =
        students.filter(function(student) {
            return student.attendance === "Present";
        }).length;

    absentCount.textContent =
        students.filter(function(student) {
            return student.attendance === "Absent";
        }).length;

    totalStudents.textContent = students.length;
}


// ==================== SAVE STUDENTS ====================

function saveStudents() {

    localStorage.setItem("students", JSON.stringify(students));
}


// ==================== DISPLAY STUDENTS ====================

function displayStudents() {

    // Remove old table rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }


    // Display every student
    students.forEach(function(student, index) {

        let row = table.insertRow();


        // ---------- Name ----------
        let nameCell = row.insertCell();
        nameCell.textContent = student.name;


        // ---------- Email ----------
        let emailCell = row.insertCell();
        emailCell.textContent = student.email;


        // ---------- Course ----------
        let courseCell = row.insertCell();
        courseCell.textContent = student.course;


        // ---------- Attendance ----------
        let attendanceCell = row.insertCell();


        // Present Button
        let presentButton = document.createElement("button");

        presentButton.textContent = "Present";

        attendanceCell.appendChild(presentButton);


        // Absent Button
        let absentButton = document.createElement("button");

        absentButton.textContent = "Absent";

        attendanceCell.appendChild(absentButton);


        // Show current attendance
        if (student.attendance === "Present") {
            presentButton.disabled = true;
        }

        if (student.attendance === "Absent") {
            absentButton.disabled = true;
        }


        // ---------- Present Button ----------
        presentButton.addEventListener("click", function() {

            student.attendance = "Present";

            presentButton.disabled = true;
            absentButton.disabled = false;

            saveStudents();
            updateDashboard();
        });


        // ---------- Absent Button ----------
        absentButton.addEventListener("click", function() {

            student.attendance = "Absent";

            absentButton.disabled = true;
            presentButton.disabled = false;

            saveStudents();
            updateDashboard();
        });


        // ---------- Marks ----------
        let marksCell = row.insertCell();

        let marksInput = document.createElement("input");

        marksInput.type = "number";

        marksInput.placeholder = "Marks";

        marksInput.value = student.marks || "";

        marksCell.appendChild(marksInput);


        // Calculate Button
        let calculateButton = document.createElement("button");

        calculateButton.textContent = "Calculate";

        marksCell.appendChild(calculateButton);


        // ---------- Percentage ----------
        let percentageCell = row.insertCell();

        percentageCell.textContent =
            student.percentage
                ? student.percentage + "%"
                : "";


        // ---------- Grade ----------
        let gradeCell = row.insertCell();

        gradeCell.textContent = student.grade || "";


        // ---------- Calculate Marks ----------
        calculateButton.addEventListener("click", function() {

            if (marksInput.value === "") {

                alert("Please enter marks");

                return;
            }


            let marks = Number(marksInput.value);


            if (marks < 0 || marks > 100) {

                alert("Marks must be between 0 and 100");

                return;
            }


            // Calculate Percentage
            let percentage = marks;


            percentageCell.textContent =
                percentage + "%";


            // Calculate Grade
            if (percentage >= 80) {

                gradeCell.textContent = "A";

            } else if (percentage >= 60) {

                gradeCell.textContent = "B";

            } else if (percentage >= 50) {

                gradeCell.textContent = "C";

            } else if (percentage >= 33) {

                gradeCell.textContent = "D";

            } else {

                gradeCell.textContent = "Fail";
            }


            // Save marks data
            student.marks = marks;

            student.percentage = percentage;

            student.grade = gradeCell.textContent;


            saveStudents();
        });


        // ---------- Actions ----------
        let actionCell = row.insertCell();


        // Edit Button
        let editButton = document.createElement("button");

        editButton.textContent = "Edit";

        actionCell.appendChild(editButton);


        // Delete Button
        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        actionCell.appendChild(deleteButton);


        // ---------- Edit Student ----------
        editButton.addEventListener("click", function() {

            let newName =
                prompt("Enter new name", student.name);

            let newEmail =
                prompt("Enter new email", student.email);

            let newCourse =
                prompt("Enter new course", student.course);


            if (newName !== null && newName !== "") {
                student.name = newName;
            }

            if (newEmail !== null && newEmail !== "") {
                student.email = newEmail;
            }

            if (newCourse !== null && newCourse !== "") {
                student.course = newCourse;
            }


            saveStudents();

            displayStudents();

            updateDashboard();
        });


        // ---------- Delete Student ----------
        deleteButton.addEventListener("click", function() {

            let confirmDelete =
                confirm("Are you sure you want to delete this student?");


            if (confirmDelete) {

                students.splice(index, 1);

                saveStudents();

                displayStudents();

                updateDashboard();
            }
        });

    });
}


// ==================== ADD STUDENT ====================

addButton.addEventListener("click", function() {


    // Check empty fields
    if (
        nameInput.value.trim() === "" ||
        emailInput.value.trim() === "" ||
        courseInput.value.trim() === ""
    ) {

        alert("Please fill all fields");

        return;
    }


    // Get student information
    let name = nameInput.value.trim();

    let email = emailInput.value.trim();

    let course = courseInput.value.trim();


    // Create student object
    let student = {

        name: name,

        email: email,

        course: course,

        attendance: "Not Marked",

        marks: "",

        percentage: "",

        grade: ""
    };


    // Add student to array
    students.push(student);


    // Save student
    saveStudents();


    // Show students
    displayStudents();


    // Update dashboard
    updateDashboard();


    // Clear form
    nameInput.value = "";

    emailInput.value = "";

    courseInput.value = "";
});


// ==================== SEARCH STUDENT ====================

searchInput.addEventListener("input", function() {

    let searchText =
        searchInput.value.toLowerCase();


    let rows =
        table.getElementsByTagName("tr");


    for (let i = 1; i < rows.length; i++) {

        let studentName =
            rows[i].cells[0].textContent.toLowerCase();


        if (studentName.includes(searchText)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";
        }
    }
});


// ==================== DARK MODE ====================

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");
});


// ==================== INITIAL DISPLAY ====================

displayStudents();

updateDashboard();