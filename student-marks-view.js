// ==================== Student Marks View ====================

// Ensure SUBJECTS is available
const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer'];

// Handle student login from main script
function handleStudentLogin(username) {
    const students = JSON.parse(localStorage.getItem('students')) || [];

    // Try to find student by Roll No or Name (case insensitive)
    const student = students.find(s =>
        s.rollNo.toLowerCase() === username.toLowerCase() ||
        s.name.toLowerCase() === username.toLowerCase()
    );

    if (student) {
        // Found student, show their marks
        updateStudentPortalWithMarks(student.rollNo);

        // Show welcome message
        const dashboard = document.getElementById('portalDashboard');
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'notification success';
        welcomeMsg.style.marginBottom = '1rem';
        welcomeMsg.innerHTML = `Welcome back, <strong>${student.name}</strong>! Viewing your academic records.`;

        const header = dashboard.querySelector('.portal-header');
        if (header && !dashboard.querySelector('.notification')) {
            header.after(welcomeMsg);
        }
    } else {
        // Fallback for guest/demo
        console.log('Student not found for username:', username);
        const container = document.getElementById('studentMarksView');
        if (container) {
            container.innerHTML = `
                <div class="portal-card" style="text-align: center; color: #667eea;">
                    <h3>👋 Welcome Guest!</h3>
                    <p>You are logged in with username: <strong>${username}</strong></p>
                    <p>To see specific marks, please log in with a valid Student Name or Roll Number.</p>
                </div>
            `;
        }
    }
}

// Display student's own marks in student portal
function displayStudentMarks(studentRollNo) {
    const container = document.getElementById('studentMarksView');
    if (!container) return;

    // Find all marks for this student
    const studentMarks = marksRecords.filter(record => record.studentId === studentRollNo);

    if (studentMarks.length === 0) {
        container.innerHTML = '<p class="empty-message">No marks available yet. Check back after exams!</p>';
        return;
    }

    container.innerHTML = studentMarks.map(record => `
        <div class="marks-record-card">
            <div class="marks-header">
                <h4>${record.examType}</h4>
                <span class="exam-type">${record.date}</span>
            </div>
            
            <div class="marks-grid">
                ${Object.entries(record.marks).map(([subject, score]) => `
                    <div class="mark-item">
                        <div class="subject">${subject}</div>
                        <div class="score">${score}/100</div>
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
            
            <button onclick="printStudentMarkSheet('${record.studentId}', '${record.examType}')" 
                    class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
                🖨️ Print Mark Sheet
            </button>
        </div>
    `).join('');
}

// Display student performance analytics
function displayStudentPerformanceAnalytics(studentRollNo) {
    const container = document.getElementById('studentPerformanceAnalytics');
    if (!container) return;

    const studentMarks = marksRecords.filter(record => record.studentId === studentRollNo);

    if (studentMarks.length === 0) {
        container.innerHTML = '<p class="empty-message">No performance data available yet.</p>';
        return;
    }

    // Calculate analytics
    const totalExams = studentMarks.length;
    const avgPercentage = (studentMarks.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / totalExams).toFixed(2);
    const bestPerformance = studentMarks.reduce((best, current) =>
        parseFloat(current.percentage) > parseFloat(best.percentage) ? current : best
    );
    const latestExam = studentMarks[studentMarks.length - 1];

    // Subject-wise average
    const subjectAvg = {};
    const subjectsList = (typeof SUBJECTS !== 'undefined') ? SUBJECTS : DEFAULT_SUBJECTS;

    subjectsList.forEach(subject => {
        const scores = studentMarks
            .map(r => r.marks[subject]) // Get score
            .filter(s => s !== undefined && !isNaN(s)); // Filter invalid

        if (scores.length > 0) {
            subjectAvg[subject] = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        } else {
            subjectAvg[subject] = 'N/A';
        }
    });

    container.innerHTML = `
        <div class="stats-dashboard">
            <div class="stat-box">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${totalExams}</div>
                <div class="stat-label">Exams Taken</div>
            </div>
            <div class="stat-box">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${avgPercentage}%</div>
                <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-box">
                <div class="stat-icon">🏆</div>
                <div class="stat-value">${bestPerformance.percentage}%</div>
                <div class="stat-label">Best Performance</div>
            </div>
            <div class="stat-box">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">${latestExam.grade.grade}</div>
                <div class="stat-label">Latest Grade</div>
            </div>
        </div>
        
        <h4 style="margin: 2rem 0 1rem 0; color: #667eea;">📚 Subject-wise Average</h4>
        <div class="subject-performance">
            ${Object.entries(subjectAvg).map(([subject, avg]) => `
                <div class="subject-card">
                    <h4>${subject}</h4>
                    <div class="average">${avg}%</div>
                </div>
            `).join('')}
        </div>
        
        <h4 style="margin: 2rem 0 1rem 0; color: #667eea;">📈 Progress Trend</h4>
        <div class="progress-trend">
            ${studentMarks.map((record, index) => `
                <div class="trend-item">
                    <div class="trend-exam">${record.examType}</div>
                    <div class="trend-bar-container">
                        <div class="trend-bar" style="width: ${record.percentage}%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                    </div>
                    <div class="trend-percentage">${record.percentage}%</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Print mark sheet for student
function printStudentMarkSheet(studentId, examType) {
    const record = marksRecords.find(r => r.studentId === studentId && r.examType === examType);
    if (!record) {
        alert('Mark sheet not found');
        return;
    }

    // Use the same generateMarkSheet function but with specific record
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
        .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .student-info {
            padding: 2rem;
            background: linear-gradient(135deg, #f8f9ff 0%, #e8ebf7 100%);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .info-item { padding: 0.5rem 0; }
        .info-label { color: #667eea; font-weight: 600; font-size: 0.9rem; }
        .info-value { color: #2d3748; font-size: 1.1rem; }
        .marks-table { padding: 2rem; }
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
        td { color: #2d3748; }
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
        .result-section h2 { color: white; margin-bottom: 1rem; }
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
        .result-label { color: #667eea; font-size: 0.9rem; margin-bottom: 0.25rem; }
        .result-value { font-size: 1.5rem; font-weight: bold; color: #2d3748; }
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
            body { background: white; padding: 0; }
            .marksheet-container { box-shadow: none; }
            button { display: none; }
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
                <div class="info-value">${record.class}</div>
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
                    <div class="result-value"><span class="grade-badge">${record.grade.grade}</span></div>
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

// Update student portal to show marks when logged in
function updateStudentPortalWithMarks(studentRollNo) {
    displayStudentMarks(studentRollNo);
    displayStudentPerformanceAnalytics(studentRollNo);
}
