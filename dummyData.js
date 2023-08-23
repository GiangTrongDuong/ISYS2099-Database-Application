const electronicsCat = {
    "id": 1,
    "name": "Electronics",
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
    "name": "Clothing",
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

const dummyCatList = [electronicsCat, clothingCat];
const dummyProduct = {
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
}

module.exports = { dummyCatList, dummyProduct };