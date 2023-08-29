// navigate category: href="category.html?category=1"

const { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, ABOUT_ROUTE, MY_ACCOUNT_ROUTE, PRIVACY_ROUTE, CONTACT_ROUTE, CATEGORY_ROUTE, PRODUCT_ROUTE, CART_ROUTE, ORDER_ROUTE, ORDER_HISTORY_ROUTE } = require("./constants");

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
        case "cart":
            return `${CART_ROUTE}`;
        case "order":
            return `${ORDER_ROUTE}`;
        case "order-history":
            return `${ORDER_HISTORY_ROUTE}`;
        case "order-detail":
            return `${ORDER_ROUTE}/${id}`;
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

module.exports = {
    // createElement,
    navigatePage,
    getParameterByPath,
    formatCurrencyVND
}