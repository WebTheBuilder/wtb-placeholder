document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
        const countdownDate = countdownContainer.dataset.countdownDate;
        const targetDate = new Date(countdownDate).getTime();

        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerHTML = String(days).padStart(2, '0');
            document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
            document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(x);
                countdownContainer.innerHTML = "LAUNCHED!"; // Or hide, or change message
            }
        }, 1000);
    }

    // --- Email Signup Form (Client-Side Only) ---
    const signupForm = document.getElementById('signup-form');
    const signupMessage = document.getElementById('signup-message');
    const emailInput = document.getElementById('email-input');

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = emailInput.value;

            // In a real application, you would send this email to your backend server
            // using fetch() or XMLHttpRequest. For this template, we'll just simulate success.
            console.log(`Email submitted: ${email}`);

            signupMessage.textContent = 'Thank you for signing up! We\'ll keep you updated.';
            signupMessage.classList.remove('hidden');
            emailInput.value = ''; // Clear the input field
            signupForm.reset(); // Also resets the form state if needed

            // Optionally hide the form after successful submission
            // signupForm.style.display = 'none';
        });
    }
});