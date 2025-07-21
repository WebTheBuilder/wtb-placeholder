// E:/wtb-placeholder/server.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs').promises; // 1. CRITICAL: Import the Node.js file system module

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Server Configuration ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // 2. CRITICAL: Add middleware to parse JSON request bodies

// --- Routes ---

// Handles the POST request from the email signup form
app.post('/signup', async (req, res) => {
    const { email } = req.body; // This will now work correctly

    // Basic validation
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const subscriberFile = path.join(__dirname, 'subscribers.txt');
    const entry = `${new Date().toISOString()} - ${email}\n`;

    try {
        // Append the email to the file
        await fs.appendFile(subscriberFile, entry);
        // Send a success response back to the client
        res.status(200).json({ message: 'Thank you for signing up! We\'ll keep you updated.' });
    } catch (error) {
        console.error('Failed to save email:', error);
        res.status(500).json({ message: 'Could not subscribe at this time. Please try again later.' });
    }
});

// Handles GET requests to render the main page
app.get('/', (req, res) => {
    const pageType = req.query.type || 'coming_soon';

    const commonData = {
        companyName: process.env.COMPANY_NAME || 'WEB, the Builder',
        contactEmail: process.env.CONTACT_EMAIL || 'admin@webthebuilder.com',
        contactPhone: process.env.CONTACT_PHONE || '704-902-2424',
        socialLinks: {
            facebook: process.env.SOCIAL_FACEBOOK,
            twitter: process.env.SOCIAL_TWITTER,
            linkedin: process.env.SOCIAL_LINKEDIN,
            instagram: process.env.SOCIAL_INSTAGRAM,
        }
    };

    // Configuration map for different page types
    const pageConfigs = {
        coming_soon: {
            title: process.env.CS_TITLE,
            body: process.env.CS_BODY,
            showCountdown: true,
            countdownDate: process.env.CS_COUNTDOWN_DATE,
            showEmailSignup: true,
            showSocial: true,
        },
        maintenance: {
            title: process.env.M_TITLE,
            body: process.env.M_BODY,
            showCountdown: (process.env.M_SHOW_COUNTDOWN === 'true'),
            countdownDate: process.env.M_COUNTDOWN_DATE || '',
        },
        new_account: {
            title: process.env.NA_TITLE,
            body: process.env.NA_BODY,
            showEmailSignup: true,
            showInstructions: true,
            instructionText: process.env.NA_INSTRUCTIONS,
            showSocial: true,
        },
        default: {
            title: process.env.GENERIC_TITLE,
            body: process.env.GENERIC_BODY,
            showEmailSignup: true,
        }
    };

    // Select the config for the current pageType, or fall back to default
    const specificConfig = pageConfigs[pageType] || pageConfigs.default;

    // Combine common data, specific config, and any query overrides
    const pageData = {
        ...commonData,
        showCountdown: false,   // Default values
        showEmailSignup: false,
        showInstructions: false,
        showSocial: false,
        ...specificConfig,      // Overwrite with specific page settings
        title: req.query.title || specificConfig.title, // Allow query overrides
        body: req.query.body || specificConfig.body,
        countdownDate: req.query.date || specificConfig.countdownDate,
        instructionText: req.query.instructions || specificConfig.instructionText,
    };

    res.render('index.html', pageData);
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Access dynamic pages using the following URLs:\n'
        + `http://localhost:${port}/?type=coming_soon\n`
        + `http://localhost:${port}/?type=maintenance\n`
        + `http://localhost:${port}/?type=new_account`
    );
});