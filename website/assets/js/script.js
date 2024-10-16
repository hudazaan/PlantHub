
//navbar slider
document.addEventListener('DOMContentLoaded', function() {
    const bar= document.getElementById('bar'); 
    const close=document.getElementById('close');
    const nav=document.getElementById('nav_bar');  
    
    if(bar) {
        bar.addEventListener('click', () => {
         nav.classList.add('active');    
        })
    } 
    
    if(close) {
        close.addEventListener('click', () =>{
         nav.classList.remove('active');    
        })
    }
    });
    
    
    
    //Sliding Login 
    let loginBtn = document.querySelector('#login-btn');
    let loginForm = document.querySelector('.login-form');
    let closeForm = document.querySelector('#close-fm');
    
    loginBtn.addEventListener('click', function() {
        loginForm.classList.add('active');
    });
    closeForm .addEventListener('click', function() {
    
        loginForm.classList.remove('active');
    });
    
    
    
    
    
    
    //Login to Logout
    function updateLoginButton() {
        const token = localStorage.getItem('token');
        const loginButton = document.getElementById('login-btn');
    
        if (token) {
            loginButton.innerHTML = 'Logout';
            loginButton.href = ''; // Update href attribute for logout
            loginButton.removeEventListener('click', handleLogin);
            loginButton.addEventListener('click', handleLogout);
        } else {
            loginButton.innerHTML = '<i class="ri-user-fill">';
            loginButton.href = 'login.html'; 
            loginButton.removeEventListener('click', handleLogout);
            loginButton.addEventListener('click', handleLogin);
        }
    }
    
    
    
    // Function to handle registration success
    function handleRegisterSuccess() {
        updateLoginButton();
    }
    
    function handleLogin() {
    }
    
    function handleLogout() {
        localStorage.removeItem('token');
        updateLoginButton();
    }
    updateLoginButton();
    
    
    
    
    