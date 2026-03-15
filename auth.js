document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DYNAMIC NAVBAR LOGIC ---
    function updateNavbar() {
    const authNavItem = document.getElementById('auth-nav-item'); 
    if (!authNavItem) return; 

    const activeUserEmail = localStorage.getItem('activeUser');

    if (activeUserEmail) {
        // 1. User is Logged In: Fetch their details
        const userData = JSON.parse(localStorage.getItem('user_' + activeUserEmail));
        const firstName = userData.name.split(' ')[0]; 

        // 2. DISAPPEAR "Login" & SHOW "Profile" (Flipkart Style)
        authNavItem.innerHTML = `
            <div class="nav-profile-group" style="display: flex; align-items: center; gap: 10px;">
                <a href="profile.html" class="nav-link nav-cta" style="background: #0ea5e9; color: white;">
                   👤 Profile
                </a>
                <span style="font-size: 14px; color: #64748b; font-weight: 500;">Hi, ${firstName}!</span>
            </div>
        `;
    } else {
        // 3. User is Logged Out: Show the standard Login button
        authNavItem.innerHTML = `<a href="login.html" class="nav-link nav-cta">Login</a>`;
    }
}

    updateNavbar();

    // --- 2. SIGN UP LOGIC ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            const address = document.getElementById('regAddress').value.trim();
            const errorMsg = document.getElementById('signupError');

            if (localStorage.getItem('user_' + email)) {
                errorMsg.textContent = "An account with this email already exists!";
                return;
            }

            const newUser = { name, email, phone, password, address };
            localStorage.setItem('user_' + email, JSON.stringify(newUser));
            localStorage.setItem('activeUser', email);
            
            alert("Account created successfully!");
            window.location.href = "order.html"; 
        });
    }

    // --- 3. LOGIN LOGIC ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const errorMsg = document.getElementById('loginError');
            const storedUserData = localStorage.getItem('user_' + email);

            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                if (userData.password === password) {
                    localStorage.setItem('activeUser', email); 
                    window.location.href = "order.html"; 
                } else {
                    errorMsg.textContent = "Incorrect password!";
                }
            } else {
                errorMsg.textContent = "No account found!";
            }
        });
    }
});