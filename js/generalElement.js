import { createElement } from "./helperFuncs.js";
// create array of categories using Array
const categories = Array.from(Array(10), (_, index) => {
    return {
        id: index,
        name: `Category ${index}`,
        link: `category.html?category=${index}`
    }
})

const footer = `
    <div class="container">

        <div class="row">
            <div class="col-sm-12 col-md-6 about-section">
                <h6>Group name</h6>
                <p class="text-justify">
                <ul class="footer-links">
                    <li>
                        <h2>Authors:</h2>
                    </li>
                    <li><a href="">Giang Trong Duong - s3926135</a></li>
                    <li><a href="">Ngo Viet Anh - 3879954</a></li>
                    <li><a href="https://github.com/Puppychan">Tran Mai Nhung - s3879954</a></li>
                    <li><a href="">Tran Nguyen Ha Khanh - s3877707</a></li>
                </ul>
                </p>
            </div>

            <div class="col-xs-6 col-md-3">
                <h6>Categories</h6>
                <ul class="footer-links">
                    ${categories.slice(0, 5).map(category => {
    return `<li><a href="${category.link}">${category.name}</a></li>`
}).join('\n                    ')}
                </ul>
            </div>


            <div class="col-xs-6 col-md-3">
                <h6>Others</h6>
                <ul class="footer-links">
                    <li><a href="">About Us</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="">Privacy Policy</a></li>
                </ul>
            </div>

        </div>
        <hr>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-7 col-sm-6 col-xs-12">
                <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by
                    <a href="https://github.com/GiangTrongDuong/ISYS2099-Database-Application">Group 2 EEET2099 2023 Semester B.</a>
                </p>
            </div>
        </div>
    </div>

`;

const navContent = [
    {
        title: "Home",
        icon: '<i class="fa-solid fa-house"></i>',
        url: "index.html"
    },
    {
        title: "Stores",
        icon: '<i class="fa-solid fa-house-circle-check"></i>',
        url: "stores.html"
    },
    {
        title: "Resources",
        icon: '<i class="fa-solid fa-bars"></i>',
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
        icon: '<i class="fa-solid fa-arrow-right-to-bracket"></i>',
        url: "login.html"
    },
    {
        title: "Sign up",
        icon: '<i class="fa-solid fa-arrow-right-to-bracket"></i>',
        url: "signup.html"
    }
]
const nav = `
    <a class="navbar-brand me-auto" href="#">
    <img class="web-logo" src="./resources/image/Group 2 EEET 2099.png"
        alt="brand logo (our team decide later)" onclick="index.html" ;>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
    aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <ul class="navbar-nav ms-auto nav-icons">
            ${navContent.map(item => {
    if (item.dropdown) {
        return `<li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    ${item.icon} ${item.title}
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                    ${item.dropdownContent.map(subItem => {
            return `<li><a class="dropdown-item" href="${subItem.url}">${subItem.title}</a></li>`
        }).join('\n                        ')}
                </ul>
            </li>`;
    } else {
        return `<li class="nav-item">
                <a class="nav-link" href="${item.url}">${item.icon} ${item.title}</a>
            </li>`;
    }}).join('\n            ')}
        </ul >
    </div >`;



document.getElementsByTagName("footer")[0].appendChild(createElement('footer-wrapper', footer));
document.getElementsByTagName("nav")[0].appendChild(createElement('container', nav));
