// navigate category: href="category.html?category=1"
/* using
    const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
*/
const navigatePage = (type, id) => {
    type = type.trim();
    // maybe change current location to new location
    if (type === "category") {
        return `/category?id=${id}`; // Use a route in your Node.js server to handle this URL
    }
    else if (type === "product") {
        return `/product?id=${id}`; // Adjust the URL to include the product ID
    }
    else if (type === "cart") {
        return `/cart`; // Use a route in your Node.js server to handle this URL
    }
    return `/`; // Use the root URL for the home page
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