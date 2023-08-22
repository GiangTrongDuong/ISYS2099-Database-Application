const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
// to apply css styles
app.use(express.static('public'));
// set view engine to be ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//Team minh store layout o route nay
// app.set('layout', './layout/main');

app.get('/', (req, res) => {
    res.render('index', {
        title: "Landing Page",
        navElements: [
            {
                title: "Home",
                // icon: '<i class="fa-solid fa-house"></i>',
                icon: 'fa-solid fa-house',
                url: "index.html"
            },
            {
                title: "Stores",
                // icon: '<i class="fa-solid fa-house-circle-check"></i>',
                icon: 'fa-solid fa-house-circle-check',
                url: "stores.html"
            },
            {
                title: "Resources",
                // icon: '<i class="fa-solid fa-bars"></i>',
                icon: 'fa-solid fa-bars',
                url: "#",
                dropdown: true,
                dropdownContent: [
                    {
                        title: "About Us",
                        url: "about-us.html"
                    },
                    {
                        title: "Privacy",
                        url: "privacy.html"
                    }
                ]
            },
            {
                title: "Log in",
                // icon: '<i class="fa-solid fa-arrow-right-to-bracket"></i>',
                icon: 'fa-solid fa-arrow-right-to-bracket',
                url: "login.html"
            },
            {
                title: "Sign up",
                // icon: '<i class="fa-solid fa-arrow-right-to-bracket"></i>',
                icon: 'fa-solid fa-arrow-right-to-bracket',
                url: "signup.html"
            }
        ],
        bodyTemplate: "index",
        // bodyData: {

        // }
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});