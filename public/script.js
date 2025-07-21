// E:/wtb-placeholder/public/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
        const countdownDateStr = countdownContainer.dataset.countdownDate;

        // 1. Ensure the date string exists before trying to use it.
        if (countdownDateStr) {
            const targetDate = new Date(countdownDateStr).getTime();

            // 2. Check if the parsed date is a valid number.
            if (!isNaN(targetDate)) {
                const countdownInterval = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = targetDate - now;

                    // 3. If the countdown is finished, clear the interval and update the UI.
                    if (distance < 0) {
                        clearInterval(countdownInterval);
                        countdownContainer.innerHTML = "<div class='countdown-item'>LAUNCHED!</div>";
                        return; // Stop further execution
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Use textContent for better performance and security when only updating text.
                    document.getElementById("days").textContent = String(days).padStart(2, '0');
                    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
                    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
                    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
                }, 1000);
            } else {
                // 4. If the date is invalid, hide the countdown to prevent showing errors.
                console.error("Invalid countdown date provided:", countdownDateStr);
                countdownContainer.style.display = 'none';
            }
        }
    }

    // --- Email Signup Form ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const signupMessage = document.getElementById('signup-message');
        const emailInput = document.getElementById('email-input');
        const submitButton = signupForm.querySelector('button');

        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = emailInput.value;

            // Disable the form while submitting
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {
                // Send the email to a new /signup endpoint on your server
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                const result = await response.json();

                if (!response.ok) {
                    // Handle errors from the server (e.g., invalid email)
                    throw new Error(result.message || 'Something went wrong.');
                }

                // Show success message from the server
                signupMessage.textContent = result.message;
                signupForm.reset();

            } catch (error) {
                // Show any error messages to the user
                signupMessage.textContent = error.message;
                console.error('Signup failed:', error);
            } finally {
                // Re-enable the form
                signupMessage.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Notify Me';
            }
        });
    }
});