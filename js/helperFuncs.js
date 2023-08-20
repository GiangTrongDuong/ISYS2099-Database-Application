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
export const navigatePage = (id, type) => {
    if (type == "category") {
        // return `category.html?id=${id}`
        return `index.html`
    }
    else if (type == "product") {
        return `product.html?id=${id}`
    }
    return `index.html`
}