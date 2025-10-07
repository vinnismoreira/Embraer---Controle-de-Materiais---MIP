import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =======================
// Flight info fixa: SJC e temperatura
// =======================
function setupFlightInfoFixed() {
    const cityElement = document.getElementById('city');
    const tempElement = document.getElementById('temperature');

    if (!cityElement || !tempElement) return;

    cityElement.textContent = 'São José dos Campos';

    const lat = -23.1896;
    const lon = -45.8841;
    const API_KEY = "SEU_API_KEY"; // substitua pela sua chave OpenWeatherMap

    async function updateTemperature() {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const data = await res.json();
            if (data && data.main) {
                tempElement.textContent = `${Math.round(data.main.temp)}°C`;
            }
        } catch (err) {
            console.error('Erro ao obter clima:', err);
            tempElement.textContent = '--°C';
        }
    }

    updateTemperature();
    setInterval(updateTemperature, 600000); // Atualiza a cada 10 min
}

// =======================
// Mostrar / esconder senha
// =======================
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');

    if (!passwordInput || !passwordToggle) return;

    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.classList.toggle('hidden');
        eyeOffIcon.classList.toggle('hidden');
    });
}

// =======================
// Efeitos de foco nos inputs
// =======================
function setupInputEffects() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
    });
}

// =======================
// Autenticação com Supabase + restrição de domínio
// =======================
function setupFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const buttonContent = document.getElementById('buttonContent');
    const loadingContent = document.getElementById('loadingContent');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        loginButton.disabled = true;
        buttonContent.classList.add('hidden');
        loadingContent.classList.remove('hidden');

        try {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const allowedDomains = ["embraer.com.br", "globmail.com.br"];
            const domain = email.split("@")[1];

            if (!allowedDomains.includes(domain)) {
                throw new Error("Apenas emails corporativos são permitidos.");
            }

            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            createNotification("Login realizado com sucesso!", "success");
            window.location.href = "/index.html";
        } catch (error) {
            console.error(error);
            createNotification(error.message || "Erro ao autenticar.", "error");
        } finally {
            loginButton.disabled = false;
            buttonContent.classList.remove('hidden');
            loadingContent.classList.add('hidden');
        }
    });
}

// =======================
// Notificações visuais
// =======================
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
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
            : 'background: linear-gradient(135deg, rgb(239, 68, 68), rgb(220, 38, 38));'}
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// =======================
// Inicialização
// =======================
document.addEventListener('DOMContentLoaded', function() {
    setupFlightInfoFixed();
    setupPasswordToggle();
    setupInputEffects();
    setupFormSubmission();
});
