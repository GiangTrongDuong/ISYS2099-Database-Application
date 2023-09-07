// navigate category: href="category.html?category=1"
const moment = require('moment');
const { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, ABOUT_ROUTE, MY_ACCOUNT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE, CATEGORY_ROUTE, PRODUCT_ROUTE, CART_ROUTE, ORDER_ROUTE, ORDER_HISTORY_ROUTE, SELLER_ROUTE } = require("./constants");

/* using
    const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
*/
const navigatePage = (type, id = -1) => {
    // home, login, signup, my-account
    // category, category-list, product, cart, order, order-history, order-detail
    // about, privacy, stores, contact
    type = type.trim();
    switch (type) {
        case "home":
            return `${HOME_ROUTE}`;
        case "login":
            return `${LOGIN_ROUTE}`;
        case "signup":
            return `${SIGNUP_ROUTE}`;
        case "my-account":
            return `${MY_ACCOUNT_ROUTE}`;
        case "about":
            return `${ABOUT_ROUTE}`;
        case "privacy":
            return `${PRIVACY_ROUTE}`;
        case "contact":
            return `${CONTACT_ROUTE}`;
        case "category":
            return `${CATEGORY_ROUTE}/${id}`;
        case "category-list":
            return `${CATEGORY_ROUTE}`;
        case "product":
            return `${PRODUCT_ROUTE}/${id}`;
        case "product-list-seller":
            return `${SELLER_ROUTE}/${id}`;
        case "warehouse-item":
            // return `${WAREHOUSE_ROUTE}/${id}`;
            // return `/`;
        case "cart":
            return `${CART_ROUTE}`;
        case "cart-delete":
            return `${CART_ROUTE}/delete-cart/${id}`;
        case "cart-change":
            return `${CART_ROUTE}/change-cart/${id}`;
        case "cart-increase":
            return `${CART_ROUTE}/increase-cart/${id}`;
        case "cart-decrease":
            return `${CART_ROUTE}/decrease-cart/${id}`;
        case "cart-delete":
            return `${CART_ROUTE}/delete-cart/${id}`;
        case "add-to-cart":
            return `${CART_ROUTE}/add-cart/${id}`;
        case "order":
            return `${ORDER_ROUTE}`;
        case "order-history":
            return `order${ORDER_HISTORY_ROUTE}`;
        case "order-detail":
            return `${ORDER_ROUTE}/${id}`;
        case "my-product":
            return `${MY_ACCOUNT_ROUTE}/my-product`;
        case "warehouse":
            // return `${MY_ACCOUNT_ROUTE}/warehouse`;
        default:
            return `${HOME_ROUTE}`;
    }
}

const getParameterByPath = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const formatCurrencyVND = (number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formatter.format(number);
}

const formatDate = (date) => {
    return moment(date).format('LL');
}

// convert '''a,b,c''' to '''("a", "b", "c")''' to use in SQL query
function parenthesesString(inputString) {
    const items = inputString.split(',');
    const formattedItems = items.map(item => `"${item.trim()}"`).join(', ');
    return `(${formattedItems})`;
  }

function getCurrentTimeString() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}

module.exports = {
    // createElement,
    navigatePage,
    getParameterByPath,
    formatCurrencyVND,
    formatDate,
    parenthesesString,
    getCurrentTimeString
}