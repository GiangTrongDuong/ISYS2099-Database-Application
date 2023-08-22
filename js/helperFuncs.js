export const createElement = (containerName, htmlElement) => {
    const container = document.createElement('div');
    container.className = `${containerName}`;
    container.innerHTML = htmlElement;
    return container;
}
// navigate category: href="category.html?category=1"
/* using
    const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
*/
export const navigatePage = (type, id) => {
    // maybe change current location to new location
    if (type == "category") {
        return `category.html?id=${id}`
    }
    else if (type == "product") {
        return `./product.html?id=${id}`
    }
    else if (type == "cart") {
        return `./cart.html`
    }
    return `index.html`
}

export const getParameterByPath = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export const formatCurrencyVND = (number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formatter.format(number);
}
