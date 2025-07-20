const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. Tell Express where to find your template files
app.set('views', path.join(__dirname, 'views'));
// 2. Set the view engine to render .html files with EJS
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// 3. Serve static assets (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// 4. Now, this route will be reached for '/' requests
app.get('/', (req, res) => {
    const pageType = req.query.type || 'coming_soon';

    // A default object for common properties to avoid repetition
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

    let pageData = {};

    switch (pageType) {
        case 'coming_soon':
            pageData = {
                ...commonData,
                title: req.query.title || process.env.CS_TITLE,
                body: req.query.body || process.env.CS_BODY,
                showCountdown: true,
                countdownDate: req.query.date || process.env.CS_COUNTDOWN_DATE,
                showEmailSignup: true,
                showInstructions: false,
                showSocial: true,
            };
            break;
        case 'maintenance':
            // Using Object.assign to merge defaults with specific overrides
            pageData = Object.assign({}, commonData, {
                title: req.query.title || process.env.M_TITLE,
                body: req.query.body || process.env.M_BODY,
                showCountdown: (process.env.M_SHOW_COUNTDOWN === 'true'),
                countdownDate: process.env.M_COUNTDOWN_DATE || '',
                showEmailSignup: false,
                showInstructions: false,
                showSocial: false,
            });
            break;
        case 'new_account':
            pageData = {
                ...commonData,
                title: req.query.title || process.env.NA_TITLE,
                body: req.query.body || process.env.NA_BODY,
                showCountdown: false,
                showEmailSignup: true,
                showInstructions: true,
                instructionText: req.query.instructions || process.env.NA_INSTRUCTIONS,
                showSocial: true,
            };
            break;
        default:
            pageData = {
                ...commonData,
                title: req.query.title || process.env.GENERIC_TITLE,
                body: req.query.body || process.env.GENERIC_BODY,
                showCountdown: false,
                showEmailSignup: false,
                showInstructions: false,
                showSocial: false,
            };
            break;
    }

    // 5. Render 'index.html' from the 'views' directory
    res.render('index.html', pageData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Access dynamic pages using the following URLs:\n'
        + `http://localhost:${port}/?type=coming_soon\n`
        + `http://localhost:${port}/?type=maintenance\n`
        + `http://localhost:${port}/?type=new_account`
    );
});