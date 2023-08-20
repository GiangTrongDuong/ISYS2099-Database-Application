import { navigatePage, createElement } from "./helperFuncs.js";
const electronicsCat = {
    "id": 1,
    "category_name": "Electronics",
    "products": [
        {
            id: 1,
            image: "https://source.unsplash.com/random/razor",
            title: "Walker's Razor Slim",
            price: 79.99,
        },
        {
            id: 2,
            image: "https://source.unsplash.com/random/earmuff",
            title: "Walker's Rechargeable Lightweight Shooting Hunting Range Electronic Slim Low Profile Hearing Protection FireMax Earmuffs",
            price: 100,
        },
        {
            id: 3,
            image: "https://source.unsplash.com/random/microphone",
            title: "SE Electronics V7-BLK Studio Grade Handheld Microphone Supercardioid, Black",
            price: 99,
        },
        {
            id: 4,
            image: "https://source.unsplash.com/random/smart-tv",
            title: "TCL 43-inch 4K UHD Smart LED TV - 43S435, 2021 Model",
            price: 258,
        }
    ]

}
const clothingCat = {
    "id": 2,
    "category_name": "Clothing",
    "products": [
        {
            id: 5,
            image: "https://source.unsplash.com/random/tshirt",
            title: "Uniqlo T-Shirt",
            price: 15,
        },
        {
            id: 6,
            image: "https://source.unsplash.com/random/sweater",
            title: "Uniqlo Sweater",
            price: 17,
        },
        {
            id: 7,
            image: "https://source.unsplash.com/random/short",
            title: "Uniqlo Short",
            price: 10,
        },
        {
            id: 8,
            image: "https://source.unsplash.com/random/skirt",
            title: "Uniqlo Skirt",
            price: 20,
        }
    ]

}

const catList = [electronicsCat, clothingCat];

const renderProduct = (product) => {
    return `<article class="col
    ">
        <div class="d-flex flex-column
        border border-2 h-100 rounded-2 overflow-hidden">
            <!-- Product image-->
            <img class="h-sz-80 w-100 obj-center-cover" src="${product.image}" alt="${product.title}" />
            <!-- Product details-->
            <div class="card-body p-4 text-start">
                <!-- Product name-->
                <h5 class="h5 fw-bolder line-clamp-3">${product.title}</h5>
                <!-- Product price-->
                ${product.price}
            </div>
            <!-- Product actions-->
            <div class="flex-grow-1 justify-content-end d-flex flex-column
            p-4 pt-0 border-top-0 bg-transparent text-end ">
                <a class="btn btn-outline-dark mt-auto" href="${navigatePage("product", product.id)}">View
                        options</a>
            </div>
        </div>
    </article>`
}

const renderContent = () => {
    return catList.map(category => {
        return category.products.map(product => {
            return renderProduct(product);
        }
        ).join('\n')
    }).join('\n');
}

// 
document.getElementById("home-content-product").appendChild(createElement('row row-cols-1 row-cols-sm-2 row-cols-md-3 gy-5 gx-4 gx-lg-10 ', renderContent()));
