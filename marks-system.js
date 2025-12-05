// ==================== Marks Management System ====================
let marksRecords = JSON.parse(localStorage.getItem('marksRecords')) || [];

// Subjects configuration
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer'];

// Grade calculation
function calculateGrade(percentage) {
    if (percentage >= 90) return { grade: 'A+', class: 'grade-A-plus' };
    if (percentage >= 80) return { grade: 'A', class: 'grade-A' };
    if (percentage >= 70) return { grade: 'B+', class: 'grade-B-plus' };
    if (percentage >= 60) return { grade: 'B', class: 'grade-B' };
    if (percentage >= 50) return { grade: 'C', class: 'grade-C' };
    if (percentage >= 40) return { grade: 'D', class: 'grade-D' };
    return { grade: 'F', class: 'grade-F' };
}

// Populate student dropdown in marks form
function populateMarksStudentDropdown() {
    const select = document.getElementById('marksStudentSelect');
    if (!select) return;

    // Refresh students data from localStorage in case it changed
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];

    select.innerHTML = '<option value="">Select Student</option>';

    // Sort students by name for the dropdown
    const sortedStudents = [...storedStudents].sort((a, b) => a.name.localeCompare(b.name));

    sortedStudents.forEach((student) => {
        const option = document.createElement('option');
        option.value = student.id; // Use unique ID instead of index
        option.textContent = `${student.name} - ${student.rollNo} (${student.class})`;
        select.appendChild(option);
    });
}

function setupMarksForm() {
    const marksForm = document.getElementById('marksForm');
    if (marksForm) {
        // Remove existing listener to avoid duplicates if called multiple times?
        // Actually, with named function we can't easily remove anonymous listener.
        // It's better to ensure this is called once.
        // initializeMarksManagement is called once on DOMContentLoaded.

        marksForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('marksStudentSelect').value;
            const examType = document.getElementById('marksExamType').value;

            if (!studentId || !examType) {
                alert('Please select student and exam type');
                return;
            }

            // Get fresh data
            const currentStudents = JSON.parse(localStorage.getItem('students')) || [];
            const student = currentStudents.find(s => s.id === studentId);

            if (!student) {
                alert('Selected student not found!');
                return;
            }

            const marks = {
                studentId: student.rollNo, // Keeping rollNo for compatibility with views
                internalId: student.id,    // Store internal ID for reference
                studentName: student.name,
                class: student.class,
                examType: examType,
                marks: {
                    Mathematics: parseInt(document.getElementById('marksMathematics').value) || 0,
                    Science: parseInt(document.getElementById('marksScience').value) || 0,
                    English: parseInt(document.getElementById('marksEnglish').value) || 0,
                    'Social Studies': parseInt(document.getElementById('marksSocialStudies').value) || 0,
                    Hindi: parseInt(document.getElementById('marksHindi').value) || 0,
                    'Computer': parseInt(document.getElementById('marksComputer').value) || 0
                },
                date: new Date().toLocaleDateString()
            };

            // Calculate total and percentage
            marks.total = Object.values(marks.marks).reduce((a, b) => a + b, 0);
            marks.percentage = ((marks.total / 600) * 100).toFixed(2);
            marks.grade = calculateGrade(marks.percentage);

            // Check if record exists for this student and exam
            const existingIndex = marksRecords.findIndex(
                r => r.studentId === marks.studentId && r.examType === marks.examType
            );

            if (existingIndex !== -1) {
                marksRecords[existingIndex] = marks;
                alert('Marks updated successfully!');
            } else {
                marksRecords.push(marks);
                alert('Marks added successfully!');
            }

            localStorage.setItem('marksRecords', JSON.stringify(marksRecords));
            marksForm.reset();
            updateMarksDisplay();
            updateStatistics();
        });
    } else {
        // console.error('DEBUG: marksForm element NOT found during setup');
    }
}

// Display all marks records
function displayMarksRecords() {
    const container = document.getElementById('marksRecordsList');
    const countSpan = document.getElementById('marksRecordCount');

    if (!container) return;

    if (marksRecords.length === 0) {
        container.innerHTML = '<p class="empty-message">No marks records yet.</p>';
        if (countSpan) countSpan.textContent = '0';
        return;
    }

    if (countSpan) countSpan.textContent = marksRecords.length;

    container.innerHTML = marksRecords.map(record => `
        <div class="marks-record-card">
            <div class="marks-header">
                <div>
                    <h4>${record.studentName}</h4>
                    <p style="color: var(--medium-gray); font-size: 0.9rem;">${record.studentId} | ${record.class}</p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="exam-type">${record.examType}</span>
                    <button class="btn-delete" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="deleteMarksRecord('${record.studentId}', '${record.examType}')">🗑️</button>
                </div>
            </div>
            
            <div class="marks-grid">
                ${Object.entries(record.marks).map(([subject, score]) => `
                    <div class="mark-item">
                        <div class="subject">${subject}</div>
                        <div class="score">${score}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="marks-summary">
                <div class="summary-item">
                    <div class="label">Total</div>
                    <div class="value">${record.total}/600</div>
                </div>
                <div class="summary-item">
                    <div class="label">Percentage</div>
                    <div class="value">${record.percentage}%</div>
                </div>
                <div class="summary-item">
                    <div class="label">Grade</div>
                    <div class="value"><span class="grade-badge ${record.grade.class}">${record.grade.grade}</span></div>
                </div>
            </div>
        </div>
    `).join('');

}

// Delete marks record
function deleteMarksRecord(studentId, examType) {
    if (confirm(`Are you sure you want to delete marks for ${studentId}(${examType}) ? `)) {
        marksRecords = marksRecords.filter(r => !(r.studentId === studentId && r.examType === examType));
        localStorage.setItem('marksRecords', JSON.stringify(marksRecords));
        updateMarksDisplay();
        updateStatistics();
        alert('Marks record deleted successfully.');
    }
}

// Update statistics
function updateStatistics() {
    if (marksRecords.length === 0) {
        document.getElementById('totalStudentsWithMarks').textContent = '0';
        document.getElementById('classAverage').textContent = '0%';
        document.getElementById('topScore').textContent = '0';
        document.getElementById('passPercentage').textContent = '0%';
        return;
    }

    // Total students
    const uniqueStudents = new Set(marksRecords.map(r => r.studentId)).size;
    document.getElementById('totalStudentsWithMarks').textContent = uniqueStudents;

    // Class average
    const avgPercentage = (marksRecords.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / marksRecords.length).toFixed(2);
    document.getElementById('classAverage').textContent = avgPercentage + '%';

    // Top score
    const topScore = Math.max(...marksRecords.map(r => r.total));
    document.getElementById('topScore').textContent = topScore + '/600';

    // Pass percentage
    const passCount = marksRecords.filter(r => parseFloat(r.percentage) >= 40).length;
    const passPercentage = ((passCount / marksRecords.length) * 100).toFixed(2);
    document.getElementById('passPercentage').textContent = passPercentage + '%';
}

// Display subject-wise performance
function displaySubjectPerformance() {
    const container = document.getElementById('subjectPerformance');
    if (!container || marksRecords.length === 0) return;

    const subjectStats = {};

    SUBJECTS.forEach(subject => {
        const scores = marksRecords.map(r => r.marks[subject]);
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);

        subjectStats[subject] = { avg, highest, lowest };
    });

    container.innerHTML = Object.entries(subjectStats).map(([subject, stats]) => `
        <div class="subject-card">

            <h4>${subject}</h4>
            <div class="average">${stats.avg}%</div>
            <div class="details">
                Highest: ${stats.highest} | Lowest: ${stats.lowest}
            </div>
        </div>

        `).join('');
}

// Display top performers
function displayTopPerformers() {
    const container = document.getElementById('topPerformers');
    if (!container || marksRecords.length === 0) return;

    // Get unique students with their best performance
    const studentBest = {};
    marksRecords.forEach(record => {
        if (!studentBest[record.studentId] || record.total > studentBest[record.studentId].total) {
            studentBest[record.studentId] = record;
        }
    });

    // Sort by total marks
    const topStudents = Object.values(studentBest)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    container.innerHTML = topStudents.map((student, index) => `
        <div class="performer-card">

            <div class="performer-rank">#${index + 1}</div>
            <div class="performer-info">
                <h4>${student.studentName}</h4>
                <p>${student.studentId} | ${student.class} | ${student.examType}</p>
            </div>
            <div class="performer-score">${student.total}/600</div>
        </div>

        `).join('');
}

// Update all marks displays
function updateMarksDisplay() {
    displayMarksRecords();
    displaySubjectPerformance();
    displayTopPerformers();
}

// Generate mark sheet in new window
function generateMarkSheet() {
    const studentId = document.getElementById('marksStudentSelect').value;
    const examType = document.getElementById('marksExamType').value;

    if (!studentId || !examType) {
        alert('Please select student and exam type to generate mark sheet');
        return;
    }

    console.log(`Generating Mark Sheet for ID: ${studentId}, Exam: ${examType}`);

    const currentStudents = JSON.parse(localStorage.getItem('students')) || [];
    // Loose equality for ID match
    const student = currentStudents.find(s => s.id == studentId);

    if (!student) {
        console.error('Student not found for ID:', studentId);
        alert('Student not found');
        return;
    }

    console.log('Found Student:', student.name, 'Roll:', student.rollNo);

    // Find record using loose equality for studentId (which stores rollNo)
    const record = marksRecords.find(r => r.studentId == student.rollNo && r.examType === examType);

    if (!record) {
        console.warn('Record not found. Available records:', marksRecords.map(r => `${r.studentId}-${r.examType}`));
    }


    if (!record) {
        alert('No marks found for this student and exam type. Please save marks first.');
        return;
    }

    const markSheetWindow = window.open('', '_blank', 'width=900,height=700');

    const markSheetHTML = `
        <!DOCTYPE html>

            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Mark Sheet - ${record.studentName}</title>
                            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                                <style>
                                    * {margin: 0; padding: 0; box-sizing: border-box; }
                                    body {
                                        font-family: 'Poppins', sans-serif;

                                    background: linear-gradient(135deg, #b5f5ff 0%, #e5d4ff 100%);
                                    min-height: 100vh;
                                    padding: 2rem;
        }
                                    .marksheet-container {
                                        max-width: 800px;

                                    margin: 0 auto;
                                    background: white;
                                    border-radius: 24px;
                                    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
                                    overflow: hidden;
        }
                                    .header {
                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    padding: 2rem;
                                    text-align: center;
        }
                                    .header h1 {font-size: 2rem; margin-bottom: 0.5rem; }

                                    .header p {opacity: 0.9; }
                                    .student-info {
                                        padding: 2rem;
                                    background: linear-gradient(135deg, #f8f9ff 0%, #e8ebf7 100%);
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 1rem;
        }
                                    .info-item {padding: 0.5rem 0; }
                                    .info-label {color: #667eea; font-weight: 600; font-size: 0.9rem; }
                                    .info-value {color: #2d3748; font-size: 1.1rem; }
                                    .marks-table {padding: 2rem; }
                                    table {
                                        width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 1rem;
        }
                                    th, td {
                                        padding: 1rem;
                                    text-align: left;
                                    border-bottom: 1px solid #e8ebf7;
        }
                                    th {
                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    font-weight: 600;
        }
                                    td {color: #2d3748; }
                                    .total-row {
                                        background: linear-gradient(135deg, #fff4b5 0%, #ffd4b5 100%);
                                    font-weight: bold;
                                    font-size: 1.1rem;
        }
                                    .result-section {
                                        padding: 2rem;
                                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                                    text-align: center;
        }
                                    .result-section h2 {color: white; margin-bottom: 1rem; }
                                    .result-grid {
                                        display: grid;
                                    grid-template-columns: repeat(3, 1fr);
                                    gap: 1rem;
                                    margin-top: 1rem;
        }
                                    .result-item {
                                        background: rgba(255, 255, 255, 0.9);
                                    padding: 1rem;
                                    border-radius: 12px;
        }
                                    .result-label {color: #667eea; font-size: 0.9rem; margin-bottom: 0.25rem; }
                                    .result-value {font-size: 1.5rem; font-weight: bold; color: #2d3748; }

                                    .grade-badge {
                                        display: inline-block;
                                    padding: 0.5rem 2rem;
                                    border-radius: 20px;
                                    font-weight: bold;
                                    font-size: 1.5rem;
                                    background: white;
                                    color: #667eea;
        }
                                    .footer {
                                        padding: 2rem;
                                    text-align: center;
                                    color: #4a5568;
        }
                                    @media print {
                                        body {background: white; padding: 0; }
                                    .marksheet-container {box-shadow: none; }

        }
                                </style>
                            </head>
                            <body>
                                <div class="marksheet-container">
                                    <div class="header">
                                        <h1>🎓 APNA SCHOOL</h1>
                                        <p>Excellence in Education</p>
                                        <p style="margin-top: 1rem; font-size: 1.2rem;">MARK SHEET</p>
                                    </div>

                                    <div class="student-info">
                                        <div class="info-item">
                                            <div class="info-label">Student Name</div>
                                            <div class="info-value">${record.studentName}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Roll Number</div>
                                            <div class="info-value">${record.studentId}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Class</div>
                                            <div class="info-value">${record.class || 'N/A'}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Exam Type</div>
                                            <div class="info-value">${record.examType}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Date</div>
                                            <div class="info-value">${record.date}</div>
                                        </div>
                                    </div>

                                    <div class="marks-table">
                                        <h3 style="color: #667eea; margin-bottom: 1rem;">Subject-wise Marks</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Maximum Marks</th>
                                                    <th>Marks Obtained</th>
                                                    <th>Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${Object.entries(record.marks).map(([subject, score]) => `
                        <tr>
                            <td>${subject}</td>
                            <td>100</td>
                            <td>${score}</td>
                            <td>${score}%</td>
                        </tr>
                    `).join('')}
                                                <tr class="total-row">
                                                    <td>TOTAL</td>
                                                    <td>600</td>
                                                    <td>${record.total}</td>
                                                    <td>${record.percentage}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="result-section">
                                        <h2>📊 Result Summary</h2>
                                        <div class="result-grid">
                                            <div class="result-item">
                                                <div class="result-label">Total Marks</div>
                                                <div class="result-value">${record.total}/600</div>
                                            </div>
                                            <div class="result-item">
                                                <div class="result-label">Percentage</div>
                                                <div class="result-value">${record.percentage}%</div>
                                            </div>
                                            <div class="result-item">
                                                <div class="result-label">Grade</div>
                                                <div class="result-value"><span class="grade-badge ${record.grade.class}">${record.grade.grade}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="footer">
                                        <p>This is a computer-generated mark sheet</p>
                                        <p style="margin-top: 0.5rem;">APNA SCHOOL | Excellence in Education</p>
                                        <button onclick="window.print()" style="margin-top: 1rem; padding: 0.75rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; font-family: 'Poppins', sans-serif;">🖨️ Print Mark Sheet</button>
                                        <button onclick="window.close()" style="margin-top: 1rem; margin-left: 1rem; padding: 0.75rem 2rem; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-size: 1rem; cursor: pointer; font-family: 'Poppins', sans-serif;">← Close</button>
                                    </div>
                                </div>
                            </body>
                        </html>
                        `;

    markSheetWindow.document.write(markSheetHTML);
    markSheetWindow.document.close();
}

// Initialize Marks Management System
function initializeMarksManagement() {
    console.log('Initializing Marks Management System...');
    setupMarksForm();
    populateMarksStudentDropdown();
    updateMarksDisplay();
    updateStatistics();
}

// Make sure it runs if script is loaded after DOM content
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initializeMarksManagement === 'function') {
        initializeMarksManagement();
    }
});
