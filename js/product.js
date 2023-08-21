// TODO: Add `Add to cart` onclick action later
import { createElement, formatCurrencyVND, getParameterByPath, navigatePage } from './helperFuncs.js'

const productList = [
    {
        id: 1,
        title: 'Rare Desk MK620',
        seller_id: 4,
        price: 994783,
        category: 6,
        length: 79,
        width: 18,
        height: 69,
        image: 'https://source.unsplash.com/random/shop&1',
        created_at: '1994-06-17 11:12:46',
        updated_at: '1993-03-19 03:54:27'
    },
    {
        id: 2,
        title: 'Busy Advertising MK366',
        seller_id: 83,
        price: 67351,
        category: 6,
        length: 127,
        width: 89,
        height: 26,
        image: 'https://source.unsplash.com/random/shop&2',
        created_at: '1980-11-14 10:06:54',
        updated_at: '1998-06-02 09:09:13'
    },
    {
        id: 3,
        title: 'Pleasant Mess MK359',
        seller_id: 95,
        price: 184513,
        category: 1,
        length: 70,
        width: 65,
        height: 18,
        image: 'https://source.unsplash.com/random/shop&3',
        created_at: '1993-04-24 20:53:07',
        updated_at: '2018-06-08 00:46:00'
    },
    {
        id: 4,
        title: 'Guilty Chapter MK783',
        seller_id: 53,
        price: 201552,
        category: 4,
        length: 139,
        width: 57,
        height: 121,
        image: 'https://source.unsplash.com/random/shop&4',
        created_at: '1970-09-02 15:03:15',
        updated_at: '1982-12-20 02:12:32'
    },
    {
        id: 5,
        title: 'Substantial Eye MK933',
        seller_id: 90,
        price: 283720,
        category: 1,
        length: 118,
        width: 74,
        height: 34,
        image: 'https://source.unsplash.com/random/shop&5',
        created_at: '1983-07-29 22:55:25',
        updated_at: '2017-08-01 17:48:17'
    },

]


const getProductById = (id) => {
    return productList.find(product => product.id == id)
}
const renderProductHtml = (product) => {
    return `<article class="row gx-4 gx-lg-5 align-items-center">
        <div class="col-md-6 h-sz-96">
            <img class="h-100 w-100 obj-center-cover mb-5 mb-md-0 rounded-1"
                src="${product.image}" alt="${product.title}" />
        </div>
        <div class="col-md-6">
            <caption class="small mb-1 line-clamp-2">SKU: ${product.id} - Seller Id: ${product.seller_id}</caption>
            <h1 class="display-5 fw-bolder line-clamp-2">${product.title}</h1>
            <!-- Product price (Can add discount later) -->
            <div class="fs-5 mb-3 mb-lg-4">
                <span>${formatCurrencyVND(product.price)}</span>
            </div>
            
            <p class="lead">
                Product Category: <a class="line-clamp-1 link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="${navigatePage('category', product.category)}">Category ${product.category}</a> <br>
                Product Description: <br>
                &emsp; - &ensp; Width: ${product.width ?? "Not Available"}<br>
                &emsp; - &ensp; Length: ${product.length ?? "Not Available"}<br>
                &emsp; - &ensp; Height: ${product.height ?? "Not Available"}<br>
            </p>
            <div class="d-flex">
                <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1"
                    style="max-width: 3rem" />
                <button class="btn btn-outline-dark flex-shrink-0" type="button">
                    <i class="bi-cart-fill me-1"></i>
                    Add to cart
                </button>
            </div>
        </div>
    </article>`
}

const currentProductId = getParameterByPath('id');
const renderedProduct = getProductById(currentProductId);
console.log(renderedProduct);
document.querySelector('#product-content-product').appendChild(createElement('product container px-4 px-lg-5 my-5', renderProductHtml(getProductById(currentProductId))));
