console.log('✅ Admin Panel JS loaded');

// Check if Firebase config is available
if (typeof firebaseConfig === 'undefined') {
    console.error('❌ firebaseConfig is not defined. Check the file path.');
} else {
    console.log('✅ Firebase config found');
}

// Initialize Firebase
console.log('🔄 Initializing Firebase...');
try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized successfully');
    } else {
        console.log('✅ Firebase already initialized');
    }
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM fully loaded');
    
    // DOM elements
    const departmentBtns = document.querySelectorAll('.department-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    const alertMessage = document.getElementById('alertMessage');
    const loginBtn = document.getElementById('loginBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    console.log('📊 DOM Elements found:', {
        departmentBtns: departmentBtns.length,
        emailInput: !!emailInput,
        passwordInput: !!passwordInput,
        loginForm: !!loginForm,
        alertMessage: !!alertMessage
    });

    // Department information
    const departmentInfo = {
        health: {
            name: "Health Department",
            hint: "Use your Health Department credentials"
        },
        outreach: {
            name: "Outreach Department", 
            hint: "Use your Outreach Department credentials"
        }
    };

    // Set up department button listeners
    console.log('🔄 Setting up department button listeners...');
    departmentBtns.forEach((btn, index) => {
        console.log(`📝 Setting up listener for button ${index + 1}:`, btn.textContent);
        
        btn.addEventListener('click', function() {
            console.log('🎯 Department button clicked:', this.textContent);
            
            // Remove active class from all buttons
            departmentBtns.forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const department = this.getAttribute('data-department');
            console.log('🎯 Selected department:', department);
            
            // Update placeholder based on selection
            emailInput.placeholder = `${departmentInfo[department].hint}`;
            
            console.log('📝 Updated email placeholder to:', emailInput.placeholder);
            
            // Visual feedback - change border color
            emailInput.style.borderColor = '#2a5298';
            passwordInput.style.borderColor = '#2a5298';
            
            // Reset after 1 second
            setTimeout(() => {
                emailInput.style.borderColor = '';
                passwordInput.style.borderColor = '';
            }, 1000);
        });
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const activeDepartment = document.querySelector('.department-btn.active').getAttribute('data-department');
        
        console.log('🔐 Login attempt:', { email, password, activeDepartment });
        
        // Validation
        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            console.log('🔄 Attempting Firebase authentication...');
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('✅ Authentication successful:', user.uid);
            
            const hasAccess = await checkDepartmentAccess(user.uid, activeDepartment);
            console.log('🔐 Department access check:', hasAccess);
            
            if (hasAccess) {
                showAlert(`Login successful! Redirecting to ${departmentInfo[activeDepartment].name}...`, 'success');
                
                sessionStorage.setItem('currentDepartment', activeDepartment);
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userUID', user.uid);
                
                setTimeout(() => {
                    console.log('🔄 Redirecting to dashboard...');
                    // Redirect to dashboard - adjust path as needed
                    window.location.href = `./frontend/pages/Dashboard${activeDepartment}.html`;
                }, 2000);
                
            } else {
                await auth.signOut();
                showAlert('Access denied. You do not have permission to access this department.', 'error');
            }
            
        } catch (error) {
            console.error('❌ Login error:', error);
            handleLoginError(error);
        } finally {
            setLoadingState(false);
        }
    });

    // Initialize form with default department`s
    emailInput.placeholder = `${departmentInfo.health.hint}`;
    console.log('📝 Initial placeholder set to:', emailInput.placeholder);

    // Helper functions
    async function checkDepartmentAccess(userId, department) {
        try {
            console.log('🔍 Checking department access for user:', userId);
            const userDoc = await db.collection('adminUsers').doc(userId).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                console.log('📋 User data found:', userData);
                return userData.departments && userData.departments.includes(department);
            }
            
            console.log('❌ User document not found');
            return false;
        } catch (error) {
            console.error('❌ Error checking department access:', error);
            return false;
        }
    }

    function handleLoginError(error) {
        console.log('❌ Handling login error:', error.code);
        switch (error.code) {
            case 'auth/invalid-email':
                showAlert('Invalid email address format.', 'error');
                break;
            case 'auth/user-disabled':
                showAlert('This account has been disabled.', 'error');
                break;
            case 'auth/user-not-found':
                showAlert('No account found with this email.', 'error');
                break;
            case 'auth/wrong-password':
                showAlert('Incorrect password. Please try again.', 'error');
                break;
            case 'auth/too-many-requests':
                showAlert('Too many failed attempts. Please try again later.', 'error');
                break;
            default:
                showAlert('Login failed. Please check your credentials and try again.', 'error');
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.textContent = 'Logging in...';
            spinner.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            btnText.textContent = 'Login';
            spinner.classList.add('hidden');
        }
    }

    function showAlert(message, type) {
        console.log('📢 Alert:', message, type);
        alertMessage.textContent = message;
        alertMessage.className = 'alert';
        alertMessage.classList.add(`alert-${type}`);
        alertMessage.style.display = 'block';
        
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, 5000);
    }

    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ User already logged in:', user.uid);
            const savedDepartment = sessionStorage.getItem('currentDepartment');
            if (savedDepartment) {
                console.log('🔄 Redirecting to saved department:', savedDepartment);
                window.location.href = `./frontend/pages/Dashboard-${savedDepartment}.html`;
            }
        } else {
            console.log('❌ No user logged in');
        }
    });
});