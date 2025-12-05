// ==================== Hero Carousel ==================== 
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let autoPlayInterval;

// Move carousel
function moveCarousel(direction) {
    currentSlide += direction;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    updateCarousel();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Update carousel display
function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentSlide) {
            indicator.classList.add('active');
        }
    });

    // Reset auto-play timer
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Auto-play carousel
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
}

// Initialize carousel
if (slides.length > 0) {
    startAutoPlay();
}

// ==================== Location Access ==================== 
function accessMyLocation() {
    if ("geolocation" in navigator) {
        showNotification('Getting your location...', 'success');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                showNotification(`Your location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`, 'success');

                // Open Google Maps with user's location
                window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
            },
            (error) => {
                let errorMsg = 'Unable to get your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Location request timed out.';
                        break;
                }
                showNotification(errorMsg, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser.', 'error');
    }
}

// ==================== Navigation ==================== 
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== Anti-Gravity Floating Animation ==================== 
const floatingObjects = document.querySelectorAll('.float-item');

// Randomize initial positions
floatingObjects.forEach((item, index) => {
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 15;
    const randomDuration = 12 + Math.random() * 8;

    item.style.left = `${randomX}%`;
    item.style.animationDelay = `-${randomDelay}s`;
    item.style.animationDuration = `${randomDuration}s`;

    // Add subtle horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    item.style.setProperty('--drift', `${drift}px`);
});

// Enhanced floating animation with mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    floatingObjects.forEach((item, index) => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 1;
        const moveX = (mouseX - 0.5) * 30 * speed;
        const moveY = (mouseY - 0.5) * 30 * speed;

        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ==================== Form Handling ==================== 
const admissionForm = document.getElementById('admissionForm');
const contactForm = document.getElementById('contactForm');

// Admission form submission
if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your interest! We will contact you soon.');
        admissionForm.reset();
    });
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
        contactForm.reset();
    });
}

// ==================== Student Portal (Read-Only) ==================== 
const loginScreen = document.getElementById('loginScreen');
const portalDashboard = document.getElementById('portalDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const studentsList = document.getElementById('studentsList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const studentCount = document.getElementById('studentCount');

// Student data storage (shared with admin)
let students = JSON.parse(localStorage.getItem('students')) || [];

// Login functionality (dummy)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Simple dummy validation (accepts any credentials)
        if (username && password) {
            loginScreen.style.display = 'none';
            portalDashboard.style.display = 'block';
            displayStudentsReadOnly();

            // Check for student marks login (if available)
            if (typeof handleStudentLogin === 'function') {
                handleStudentLogin(username);
            }
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        loginScreen.style.display = 'flex';
        portalDashboard.style.display = 'none';
    });
}

// Display students (Read-Only)
function displayStudentsReadOnly(filteredStudents = null) {
    const studentsToDisplay = filteredStudents || students;

    if (studentsToDisplay.length === 0) {
        studentsList.innerHTML = '<p class="empty-message">No students found.</p>';
        if (studentCount) studentCount.textContent = '0';
        return;
    }

    if (studentCount) studentCount.textContent = studentsToDisplay.length;

    studentsList.innerHTML = studentsToDisplay.map(student => `
        <div class="student-card student-card-readonly">
            <div class="student-info">
                <div class="student-header">
                    <span class="student-avatar">👤</span>
                    <h4>${student.name}</h4>
                </div>
                <div class="student-details">
                    <div><strong>Roll No:</strong> ${student.rollNo}</div>
                    <div><strong>Class:</strong> ${student.class}</div>
                    <div><strong>Section:</strong> ${student.section}</div>
                    <div><strong>Father:</strong> ${student.fatherName}</div>
                    <div><strong>Phone:</strong> ${student.phone}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search students (Read-Only)
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = students.filter(student => {
            return student.name.toLowerCase().includes(searchTerm) ||
                student.rollNo.toLowerCase().includes(searchTerm);
        });

        displayStudentsReadOnly(filtered);
    });
}

// Sort students (Read-Only)
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        let sorted = [...students];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rollNo':
                sorted.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
                break;
            case 'class':
                sorted.sort((a, b) => {
                    // Extract numeric part for proper sorting
                    const getClassNumber = (className) => {
                        const match = className.match(/\d+/);
                        return match ? parseInt(match[0]) : 0;
                    };
                    return getClassNumber(a.class) - getClassNumber(b.class);
                });
                break;
        }

        displayStudentsReadOnly(sorted);
    });
}

// Show notification (toast)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Smooth Scroll ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Scroll Animations ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.feature-card, .academic-card, .faculty-card, .gallery-item, .stat-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== Gallery Modal (Optional Enhancement) ==================== 
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('p').textContent;
        alert(`Gallery: ${title}\n\nThis is a placeholder. You can add actual images here.`);
    });
});

// ==================== Admin Panel (Students + Faculty) ==================== 
const adminLoginScreen = document.getElementById('adminLoginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

// Admin Student Management Elements
const adminStudentForm = document.getElementById('adminStudentForm');
const adminStudentsList = document.getElementById('adminStudentsList');
const adminStudentSubmitBtn = document.getElementById('adminStudentSubmitBtn');
const adminStudentCancelBtn = document.getElementById('adminStudentCancelBtn');
const adminStudentCount = document.getElementById('adminStudentCount');
const adminSearchInput = document.getElementById('adminSearchInput');
const adminSortSelect = document.getElementById('adminSortSelect');

// Admin Faculty Management Elements
const facultyForm = document.getElementById('facultyForm');
const facultyList = document.getElementById('facultyList');
const facultySubmitBtn = document.getElementById('facultySubmitBtn');
const facultyCancelBtn = document.getElementById('facultyCancelBtn');
const facultyCount = document.getElementById('facultyCount');

// Data storage
let facultyMembers = JSON.parse(localStorage.getItem('faculty')) || [];
let editingFacultyId = null;
let editingStudentId = null;

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Admin Login
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        // Simple admin authentication
        if (username === 'admin' && password === 'admin123') {
            adminLoginScreen.style.display = 'none';
            adminDashboard.style.display = 'block';
            displayAdminStudents();
            displayFaculty();

            // Initialize Marks System (if available)
            if (typeof initializeMarksManagement === 'function') {
                initializeMarksManagement();
            }

            showNotification('Welcome, Admin!', 'success');
        } else {
            showNotification('Invalid admin credentials!', 'error');
        }
    });
}

// Admin Logout
if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
        adminLoginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
        editingFacultyId = null;
        editingStudentId = null;
        if (facultyForm) facultyForm.reset();
        if (adminStudentForm) adminStudentForm.reset();
        if (facultySubmitBtn) facultySubmitBtn.textContent = 'Add Faculty';
        if (facultyCancelBtn) facultyCancelBtn.style.display = 'none';
        if (adminStudentSubmitBtn) adminStudentSubmitBtn.textContent = 'Add Student';
        if (adminStudentCancelBtn) adminStudentCancelBtn.style.display = 'none';
    });
}

// ========== ADMIN STUDENT MANAGEMENT ==========

// Add/Edit Student (Admin only)
if (adminStudentForm) {
    adminStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const studentData = {
            id: editingStudentId || generateId(),
            name: document.getElementById('adminStudentName').value,
            rollNo: document.getElementById('adminRollNo').value,
            class: document.getElementById('adminStudentClass').value,
            section: document.getElementById('adminSection').value,
            fatherName: document.getElementById('adminFatherName').value,
            phone: document.getElementById('adminPhone').value
        };

        if (editingStudentId) {
            // Update existing student
            const index = students.findIndex(s => s.id === editingStudentId);
            students[index] = studentData;
            editingStudentId = null;
            adminStudentSubmitBtn.textContent = 'Add Student';
            adminStudentCancelBtn.style.display = 'none';
            showNotification('Student updated successfully!', 'success');
        } else {
            // Add new student
            students.push(studentData);
            showNotification('Student added successfully!', 'success');
        }

        // Save to localStorage
        localStorage.setItem('students', JSON.stringify(students));

        // Reset form and display students
        adminStudentForm.reset();
        displayAdminStudents();

        // Update student portal display if it's open
        if (portalDashboard && portalDashboard.style.display !== 'none') {
            displayStudentsReadOnly();
        }
    });
}

// Cancel Edit Student
if (adminStudentCancelBtn) {
    adminStudentCancelBtn.addEventListener('click', () => {
        editingStudentId = null;
        adminStudentForm.reset();
        adminStudentSubmitBtn.textContent = 'Add Student';
        adminStudentCancelBtn.style.display = 'none';
        showNotification('Edit cancelled', 'info');
    });
}




// Display students in admin panel
function displayAdminStudents(filteredStudents = null) {
    const studentsToDisplay = filteredStudents || students;

    if (studentsToDisplay.length === 0) {
        adminStudentsList.innerHTML = '<p class="empty-message">No students added yet.</p>';
        if (adminStudentCount) adminStudentCount.textContent = '0';
        return;
    }

    if (adminStudentCount) adminStudentCount.textContent = studentsToDisplay.length;

    adminStudentsList.innerHTML = studentsToDisplay.map(student => `
        <div class="student-card" data-id="${student.id}">
            <div class="student-info">
                <h4>👨‍🎓 ${student.name}</h4>
                <div class="student-details">
                    <div><strong>Roll No:</strong> ${student.rollNo}</div>
                    <div><strong>Class:</strong> ${student.class}</div>
                    <div><strong>Section:</strong> ${student.section}</div>
                    <div><strong>Father:</strong> ${student.fatherName}</div>
                    <div><strong>Phone:</strong> ${student.phone}</div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn-edit" data-action="edit" data-id="${student.id}">Edit</button>
                <button class="btn-delete" data-action="delete" data-id="${student.id}">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit student (Admin only)
function editAdminStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingStudentId = id;

    document.getElementById('adminStudentName').value = student.name;
    document.getElementById('adminRollNo').value = student.rollNo;
    document.getElementById('adminStudentClass').value = student.class;
    document.getElementById('adminSection').value = student.section;
    document.getElementById('adminFatherName').value = student.fatherName;
    document.getElementById('adminPhone').value = student.phone;

    adminStudentSubmitBtn.textContent = 'Update Student';
    adminStudentCancelBtn.style.display = 'inline-block';

    // Scroll to form
    adminStudentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Delete student (Admin only)
function deleteAdminStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        // Use loose inequality (!=) to handle string/number mismatches
        students = students.filter(s => s.id != id);
        localStorage.setItem('students', JSON.stringify(students));

        displayAdminStudents(); // Refresh admin list

        // Update student portal display if it's open
        if (typeof displayStudentsReadOnly === 'function') {
            displayStudentsReadOnly();
        }

        showNotification('Student deleted successfully!', 'success');
    }
}

// Search students (Admin)
if (adminSearchInput) {
    adminSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = students.filter(student => {
            return student.name.toLowerCase().includes(searchTerm) ||
                student.rollNo.toLowerCase().includes(searchTerm);
        });

        displayAdminStudents(filtered);
    });
}

// Sort students (Admin)
if (adminSortSelect) {
    adminSortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        let sorted = [...students];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rollNo':
                sorted.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
                break;
            case 'class':
                sorted.sort((a, b) => {
                    const getClassNumber = (className) => {
                        const match = className.match(/\d+/);
                        return match ? parseInt(match[0]) : 0;
                    };
                    return getClassNumber(a.class) - getClassNumber(b.class);
                });
                break;
        }

        students = sorted;
        localStorage.setItem('students', JSON.stringify(students));
        displayAdminStudents();
    });
}

// ========== ADMIN FACULTY MANAGEMENT ==========

// Add/Edit Faculty
if (facultyForm) {
    facultyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const facultyData = {
            id: editingFacultyId || generateId(),
            name: document.getElementById('facultyName').value,
            role: document.getElementById('facultyRole').value,
            qualification: document.getElementById('facultyQualification').value,
            experience: document.getElementById('facultyExperience').value,
            avatar: document.getElementById('facultyAvatar').value
        };

        if (editingFacultyId) {
            // Update existing faculty
            const index = facultyMembers.findIndex(f => f.id === editingFacultyId);
            facultyMembers[index] = facultyData;
            editingFacultyId = null;
            facultySubmitBtn.textContent = 'Add Faculty';
            facultyCancelBtn.style.display = 'none';
            showNotification('Faculty updated successfully!', 'success');
        } else {
            // Add new faculty
            facultyMembers.push(facultyData);
            showNotification('Faculty added successfully!', 'success');
        }

        // Save to localStorage
        localStorage.setItem('faculty', JSON.stringify(facultyMembers));

        // Reset form and display faculty
        facultyForm.reset();
        displayFaculty();
        updateFacultySection();
    });
}

// Cancel edit
if (facultyCancelBtn) {
    facultyCancelBtn.addEventListener('click', () => {
        editingFacultyId = null;
        facultyForm.reset();
        facultySubmitBtn.textContent = 'Add Faculty';
        facultyCancelBtn.style.display = 'none';
    });
}

// Display faculty in admin panel
function displayFaculty() {
    if (facultyMembers.length === 0) {
        facultyList.innerHTML = '<p class="empty-message">No faculty members added yet.</p>';
        if (facultyCount) facultyCount.textContent = '0';
        return;
    }

    if (facultyCount) facultyCount.textContent = facultyMembers.length;

    facultyList.innerHTML = facultyMembers.map(faculty => `
        <div class="student-card" data-id="${faculty.id}">
            <div class="student-info">
                <h4>${faculty.avatar} ${faculty.name}</h4>
                <div class="student-details">
                    <div><strong>Role:</strong> ${faculty.role}</div>
                    <div><strong>Qualification:</strong> ${faculty.qualification}</div>
                    <div><strong>Experience:</strong> ${faculty.experience}</div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn-edit" data-action="edit" data-id="${faculty.id}">Edit</button>
                <button class="btn-delete" data-action="delete" data-id="${faculty.id}">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit faculty
function editFaculty(id) {
    const faculty = facultyMembers.find(f => f.id === id);
    if (!faculty) return;

    editingFacultyId = id;

    document.getElementById('facultyName').value = faculty.name;
    document.getElementById('facultyRole').value = faculty.role;
    document.getElementById('facultyQualification').value = faculty.qualification;
    document.getElementById('facultyExperience').value = faculty.experience;
    document.getElementById('facultyAvatar').value = faculty.avatar;

    facultySubmitBtn.textContent = 'Update Faculty';
    facultyCancelBtn.style.display = 'inline-block';

    // Scroll to form
    facultyForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Delete faculty
function deleteFaculty(id) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        // Use loose inequality (!=) to handle string/number mismatches
        facultyMembers = facultyMembers.filter(f => f.id != id);
        localStorage.setItem('faculty', JSON.stringify(facultyMembers));

        displayFaculty(); // Refresh admin list
        updateFacultySection(); // Refresh main page section

        showNotification('Faculty deleted successfully!', 'success');
    }
}

// Update faculty section on main page
function updateFacultySection() {
    const facultyGrid = document.querySelector('.faculty-grid');
    if (!facultyGrid) return;

    if (facultyMembers.length === 0) {
        // Show default faculty if none added
        return;
    }

    facultyGrid.innerHTML = facultyMembers.map(faculty => `
        <div class="faculty-card" onclick="openFacultyProfile('${faculty.name}', '${faculty.role}', '${faculty.qualification}', '${faculty.experience}', '${faculty.avatar}', 'Dynamic faculty member (bio placeholder)')">
            <div class="faculty-avatar">${faculty.avatar}</div>
            <h4>${faculty.name}</h4>
            <p class="faculty-role">${faculty.role}</p>
            <p class="faculty-qual">${faculty.qualification}</p>
            <p class="faculty-exp">${faculty.experience}</p>
            <p style="margin-top: 1rem; color: #667eea; font-size: 0.9rem; cursor: pointer;">👁️ View Profile</p>
        </div>
    `).join('');
}

// ==================== Event Delegation for Admin Actions ==================== 
function attachAdminListeners() {
    console.log("Attaching Admin Event Listeners...");

    // Admin Students List Event Listener
    const adminList = document.getElementById('adminStudentsList');
    if (adminList) {
        console.log("Admin list found, adding click listener.");
        adminList.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = btn.dataset.id;
            console.log(`Button clicked: Action=${action}, ID=${id}`);

            if (action && id) {
                if (action === 'delete') deleteAdminStudent(id);
                if (action === 'edit') editAdminStudent(id);
            }
        });
    } else {
        console.warn("adminStudentsList not found (might be on wrong page)");
    }

    // Faculty List Event Listener
    const facultyList = document.getElementById('facultyList');
    if (facultyList) {
        console.log("Faculty list found, adding click listener.");
        facultyList.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = btn.dataset.id;
            console.log(`Faculty Button clicked: Action=${action}, ID=${id}`);

            if (action && id) {
                if (action === 'delete') deleteFaculty(id);
                if (action === 'edit') editFaculty(id);
            }
        });
    }
}

// Ensure listeners are attached whether the script runs before or after DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachAdminListeners);
} else {
    attachAdminListeners();
}

// ==================== Faculty Profile Modal ====================
function openFacultyProfile(name, role, qual, exp, avatar, bio) {
    const modal = document.getElementById('facultyModal');
    if (!modal) return;

    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalQual').textContent = qual;
    document.getElementById('modalExp').textContent = exp;
    document.getElementById('modalAvatar').textContent = avatar;
    document.getElementById('modalBio').textContent = bio;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeFacultyModal() {
    const modal = document.getElementById('facultyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('facultyModal');
    if (e.target === modal) {
        closeFacultyModal();
    }
});


// ==================== Initialize ==================== 
document.addEventListener('DOMContentLoaded', () => {
    // Attach Event Delegations
    attachAdminListeners();

    // Load students when portal is visible
    if (portalDashboard && portalDashboard.style.display !== 'none') {
        displayStudents();
    }

    // Load and display faculty from localStorage
    if (facultyMembers.length > 0) {
        updateFacultySection();
    }

    // Add entrance animation to hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease';
    }

    // Initialize Marks Management
    if (typeof initializeMarksManagement === 'function') {
        initializeMarksManagement();
    }

    console.log('🎓 APNA SCHOOL Website Loaded Successfully!');
    console.log('💾 Students in database:', students.length);
    console.log('👨‍🏫 Faculty in database:', facultyMembers.length);
});

// ==================== Window Load Event ==================== 
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');

    // Start floating animation
    floatingObjects.forEach(item => {
        item.style.opacity = '0.6';
    });
});

// ==================== Performance Optimization ==================== 
// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
if (searchInput) {
    const debouncedSearch = debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = students.filter(student => {
            return student.name.toLowerCase().includes(searchTerm) ||
                student.rollNo.toLowerCase().includes(searchTerm) ||
                student.class.toLowerCase().includes(searchTerm) ||
                student.section.toLowerCase().includes(searchTerm) ||
                student.fatherName.toLowerCase().includes(searchTerm) ||
                student.phone.includes(searchTerm);
        });
        displayStudents(filtered);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
}

// ==================== Dynamic Faculty Profile Pages ==================== 
function openFacultyProfile(name, role, qualification, experience, avatar, bio) {
    // Create a new window
    const profileWindow = window.open('', '_blank', 'width=900,height=700');

    // Generate the complete HTML for the faculty profile page
    const profileHTML = `
        < !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${name} - Faculty Profile | APNA SCHOOL</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                        <style>
                            * {
                                margin: 0;
                            padding: 0;
                            box-sizing: border-box;
        }

                            body {
                                font - family: 'Poppins', sans-serif;
                            background: linear-gradient(135deg, #b5f5ff 0%, #e5d4ff 100%);
                            min-height: 100vh;
                            padding: 2rem;
        }

                            .profile-container {
                                max - width: 800px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 24px;
                            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
                            overflow: hidden;
                            animation: fadeInUp 0.6s ease;
        }

                            @keyframes fadeInUp {
                                from {
                                opacity: 0;
                            transform: translateY(30px);
            }
                            to {
                                opacity: 1;
                            transform: translateY(0);
            }
        }

                            .profile-header {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 3rem 2rem;
                            text-align: center;
                            position: relative;
        }

                            .back-btn {
                                position: absolute;
                            top: 1rem;
                            left: 1rem;
                            background: rgba(255, 255, 255, 0.2);
                            backdrop-filter: blur(10px);
                            border: none;
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Poppins', sans-serif;
                            font-weight: 500;
                            transition: all 0.3s ease;
        }

                            .back-btn:hover {
                                background: rgba(255, 255, 255, 0.3);
                            transform: translateX(-5px);
        }

                            .avatar {
                                font - size: 6rem;
                            margin-bottom: 1rem;
                            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
                            animation: float 3s ease-in-out infinite;
        }

                            @keyframes float {
                                0 %, 100 % { transform: translateY(0); }
            50% {transform: translateY(-10px); }
        }

                            .profile-header h1 {
                                font - size: 2.5rem;
                            margin-bottom: 0.5rem;
                            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

                            .profile-header .role {
                                font - size: 1.3rem;
                            opacity: 0.95;
                            font-weight: 500;
        }

                            .profile-body {
                                padding: 2rem;
        }

                            .info-section {
                                margin - bottom: 2rem;
        }

                            .info-section h2 {
                                color: #667eea;
                            font-size: 1.5rem;
                            margin-bottom: 1rem;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
        }

                            .info-card {
                                background: linear-gradient(135deg, #f8f9ff 0%, #e8ebf7 100%);
                            padding: 1.5rem;
                            border-radius: 16px;
                            margin-bottom: 1rem;
                            border-left: 4px solid #667eea;
        }

                            .info-card h3 {
                                color: #2d3748;
                            font-size: 1.1rem;
                            margin-bottom: 0.5rem;
        }

                            .info-card p {
                                color: #4a5568;
                            line-height: 1.8;
        }

                            .bio {
                                background: linear-gradient(135deg, #fff4b5 0%, #ffd4b5 100%);
                            padding: 1.5rem;
                            border-radius: 16px;
                            line-height: 1.8;
                            color: #2d3748;
                            font-size: 1.05rem;
        }

                            .contact-info {
                                display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                            gap: 1rem;
                            margin-top: 1rem;
        }

                            .contact-card {
                                background: white;
                            padding: 1rem;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }

                            .contact-card .icon {
                                font - size: 2rem;
                            margin-bottom: 0.5rem;
        }

                            .contact-card h4 {
                                color: #667eea;
                            font-size: 0.9rem;
                            margin-bottom: 0.25rem;
        }

                            .contact-card p {
                                color: #4a5568;
                            font-size: 0.95rem;
        }

                            .achievements {
                                display: flex;
                            flex-wrap: wrap;
                            gap: 0.75rem;
                            margin-top: 1rem;
        }

                            .achievement-tag {
                                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 20px;
                            font-size: 0.9rem;
                            font-weight: 500;
        }
                        </style>
                    </head>
                    <body>
                        <div class="profile-container">
                            <div class="profile-header">
                                <button class="back-btn" onclick="window.close()">← Back</button>
                                <div class="avatar">${avatar}</div>
                                <h1>${name}</h1>
                                <p class="role">${role}</p>
                            </div>

                            <div class="profile-body">
                                <div class="info-section">
                                    <h2>📋 Professional Information</h2>
                                    <div class="info-card">
                                        <h3>Qualification</h3>
                                        <p>${qualification}</p>
                                    </div>
                                    <div class="info-card">
                                        <h3>Experience</h3>
                                        <p>${experience} in education and teaching</p>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <h2>👤 About</h2>
                                    <div class="bio">
                                        ${bio}
                                    </div>
                                </div>

                                <div class="info-section">
                                    <h2>🏆 Achievements & Specializations</h2>
                                    <div class="achievements">
                                        <span class="achievement-tag">Excellence in Teaching</span>
                                        <span class="achievement-tag">Student Mentorship</span>
                                        <span class="achievement-tag">Curriculum Development</span>
                                        <span class="achievement-tag">Educational Innovation</span>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <h2>📞 Contact Information</h2>
                                    <div class="contact-info">
                                        <div class="contact-card">
                                            <div class="icon">📧</div>
                                            <h4>Email</h4>
                                            <p>${name.toLowerCase().replace(/\s+/g, '.')}@apnaschool.edu.in</p>
                                        </div>
                                        <div class="contact-card">
                                            <div class="icon">📍</div>
                                            <h4>Office</h4>
                                            <p>APNA SCHOOL Campus</p>
                                        </div>
                                        <div class="contact-card">
                                            <div class="icon">🕐</div>
                                            <h4>Availability</h4>
                                            <p>Mon-Fri, 9AM-4PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
                `;

    // Write the HTML to the new window
    profileWindow.document.write(profileHTML);
    profileWindow.document.close();
}

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

    select.innerHTML = '<option value="">Select Student</option>';
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} - ${student.rollNo} (${student.class})`;
        select.appendChild(option);
    });
}

// Handle marks form submission
const marksForm = document.getElementById('marksForm');
if (marksForm) {
    marksForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const studentIndex = document.getElementById('marksStudentSelect').value;
        const examType = document.getElementById('marksExamType').value;

        if (!studentIndex || !examType) {
            alert('Please select student and exam type');
            return;
        }

        const student = students[studentIndex];
        const marks = {
            studentId: student.rollNo,
            studentName: student.name,
            class: student.class,
            examType: examType,
            marks: {
                Mathematics: parseInt(document.getElementById('marksMathematics').value),
                Science: parseInt(document.getElementById('marksScience').value),
                English: parseInt(document.getElementById('marksEnglish').value),
                'Social Studies': parseInt(document.getElementById('marksSocialStudies').value),
                Hindi: parseInt(document.getElementById('marksHindi').value),
                'Computer': parseInt(document.getElementById('marksComputer').value)
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
                        <span class="exam-type">${record.examType}</span>
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
    const studentIndex = document.getElementById('marksStudentSelect').value;
    const examType = document.getElementById('marksExamType').value;

    if (!studentIndex || !examType) {
        alert('Please select student and exam type to generate mark sheet');
        return;
    }

    const student = students[studentIndex];
    const record = marksRecords.find(r => r.studentId === student.rollNo && r.examType === examType);

    if (!record) {
        alert('No marks found for this student and exam type');
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
                                            font - family: 'Poppins', sans-serif;
                                        background: linear-gradient(135deg, #b5f5ff 0%, #e5d4ff 100%);
                                        min-height: 100vh;
                                        padding: 2rem;
        }
                                        .marksheet-container {
                                            max - width: 800px;
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
                                        .header h1 {font - size: 2rem; margin-bottom: 0.5rem; }
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
                                        .marks-table {
                                            padding: 2rem;
        }
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
                                        .result-value {font - size: 1.5rem; font-weight: bold; color: #2d3748; }
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
                                        .marksheet-container {box - shadow: none; }
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

// Initialize marks management when admin logs in
function initializeMarksManagement() {
    populateMarksStudentDropdown();
    updateMarksDisplay();
    updateStatistics();

    // Refresh dropdown when the tab is clicked or focused
    const marksTab = document.querySelector('a[href="#admin-panel"]');
    if (marksTab) {
        marksTab.addEventListener('click', populateMarksStudentDropdown);
    }
}
