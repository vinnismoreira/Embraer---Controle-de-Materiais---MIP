// =======================
// Flight info fixa: SJC e temperatura
// =======================
function setupFlightInfoFixed() {
    const cityElement = document.getElementById('city');
    const tempElement = document.getElementById('temperature');

    // Cidade fixa
    cityElement.textContent = 'São José dos Campos';

    // Substitua SEU_API_KEY pela sua chave do OpenWeatherMap
    const lat = -23.1896; // Latitude SJC
    const lon = -45.8841; // Longitude SJC

    async function updateTemperature() {
        try {
            const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=SEU_API_KEY`);
            const weatherData = await weatherResp.json();

            if (weatherData && weatherData.main) {
                tempElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
            }
        } catch (err) {
            console.error('Erro ao obter clima:', err);
            tempElement.textContent = '--°C';
        }
    }

    updateTemperature();

    // Atualiza temperatura a cada 10 minutos
    setInterval(updateTemperature, 600000);
}

// Chamar no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupFlightInfoFixed();
});

// Password toggle functionality
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');
    
    if (!passwordInput || !passwordToggle || !eyeIcon || !eyeOffIcon) return;
    
    passwordToggle.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        
        if (isPassword) {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
        }
    });
}

// Form submission with loading state
function setupFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const buttonContent = document.getElementById('buttonContent');
    const loadingContent = document.getElementById('loadingContent');
    
    if (!loginForm || !loginButton || !buttonContent || !loadingContent) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        loginButton.disabled = true;
        buttonContent.classList.add('hidden');
        loadingContent.classList.remove('hidden');
        
        // Simulate authentication process
        try {
            await simulateAuthentication();
            
            // Success - you could redirect or show success message here
            console.log('Authentication successful!');
            
            // For demo purposes, show success briefly then reset
            setTimeout(() => {
                resetButtonState();
                showSuccessMessage();
            }, 500);
            
        } catch (error) {
            // Error handling
            console.error('Authentication failed:', error);
            resetButtonState();
            showErrorMessage();
        }
    });
    
    function resetButtonState() {
        loginButton.disabled = false;
        buttonContent.classList.remove('hidden');
        loadingContent.classList.add('hidden');
    }
    
    function showSuccessMessage() {
        const notification = createNotification('Authentication successful! Welcome to Flight Deck.', 'success');
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    function showErrorMessage() {
        const notification = createNotification('Authentication failed. Please check your credentials.', 'error');
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Simulate authentication API call
function simulateAuthentication() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() > 0.3 ? resolve() : reject(new Error('Invalid credentials'));
        }, 2000);
    });
}

// Create notification element
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        ${type === 'success' 
            ? 'background: linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74));' 
            : 'background: linear-gradient(135deg, rgb(239, 68, 68), rgb(220, 38, 38));'
        }
    `;
    return notification;
}

// Setup input focus effects
function setupInputEffects() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}