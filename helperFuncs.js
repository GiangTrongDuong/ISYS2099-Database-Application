// navigate category: href="category.html?category=1"
const moment = require('moment');
const { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, ABOUT_ROUTE, MY_ACCOUNT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE, CATEGORY_ROUTE, PRODUCT_ROUTE, CART_ROUTE, ORDER_ROUTE, ORDER_HISTORY_ROUTE, SELLER_ROUTE, WAREHOUSE_ROUTE, WAREHOUSE_MOVE_PRODUCT } = require("./constants");

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
        case "product-list":
            return `${PRODUCT_ROUTE}`;
        case "product":
            return `${PRODUCT_ROUTE}/${id}`;
        case "product-list-seller":
            return `${SELLER_ROUTE}/${id}`;
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
            return `/order${ORDER_ROUTE}/${id}`;
        case "my-product":
            return `${MY_ACCOUNT_ROUTE}/my-product`;
        case "warehouse":
            return `${WAREHOUSE_ROUTE}/all`;
        case "create-warehouse":
            return `${WAREHOUSE_ROUTE}/create`;
        case "update-warehouse":
            return `${WAREHOUSE_ROUTE}/update`;
        case "delete-warehouse":
            return `${WAREHOUSE_ROUTE}/delete`;
        case "move-warehouse":
            return `${WAREHOUSE_ROUTE}/move-warehouse`;
        case "warehouse-item":
            return `${WAREHOUSE_ROUTE}/view?id=${id}`;
        case "warehouse-admins":
            return `${WAREHOUSE_ROUTE}/admins`;
        case "warehouse-categories":
            return `${WAREHOUSE_ROUTE}/categories`;
        case "move-product":
            return `${WAREHOUSE_ROUTE}/${WAREHOUSE_MOVE_PRODUCT}`;
        case "update-product":
            return `${MY_ACCOUNT_ROUTE}/update-product`;
        case "create-product":
            return `${MY_ACCOUNT_ROUTE}/create-product`;
        case "add-att":
            return `${MY_ACCOUNT_ROUTE}/select-attribute/submit-att-select`;
        case "delete-product":
            return `${MY_ACCOUNT_ROUTE}/delete-product`;
        case "delete-user":
            return `${MY_ACCOUNT_ROUTE}/delete-user/${id}`;
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

const sendResponse = (res, statusCode, msg, data) => {
    res.status(statusCode).json({ status: statusCode, message: msg, data: data ? data : null });
}

function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return { red, green, blue };
}

function isColorDark({ red, green, blue }) {
    // Calculate the luminance of the color
    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
    return luminance < 128;  // 128 is mid-point in 256 color scale
}
module.exports = {
    // createElement,
    navigatePage,
    getParameterByPath,
    formatCurrencyVND,
    formatDate,
    parenthesesString,
    getCurrentTimeString,
    sendResponse,
    getRandomColor,
    isColorDark,
}