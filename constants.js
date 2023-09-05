const PRODUCT_ROUTE = '/product';
const CART_ROUTE = '/cart';
const CATEGORY_ROUTE = '/category';

const ORDER_ROUTE = '/order';
const ORDER_HISTORY_ROUTE = '/history'; //full route: /order/history

const ABOUT_ROUTE = '/about-us';
const PRIVACY_ROUTE = '/privacy';
const CONTACT_ROUTE = '/contact-us';

const LOGIN_ROUTE = '/login';
const SIGNUP_ROUTE = '/signup';
const MY_ACCOUNT_ROUTE = '/my-account';

const HOME_ROUTE = '/';

const CONNECTED_URI = "mongodb+srv://eeet2099group2:eeet2099Pass@databaseapplicationproj.fexqmnq.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

const MEMBERS = [
    {
        name: "Giang Tran Trong Duong",
        studentID: "sxxxxxxx",
        email: "@gmail.com",
        github: "https://github.com/GiangTrongDuong",
    }, {
        name: "Tran Mai Nhung",
        studentID: "s3879954",
        email: "nhungmaitran1412@gmail.com",
        github: "https://github.com/Puppychan",
    }, {
        name: "Nguyen Viet Anh",
        studentID: "s3879954",
        email: "",
        github: "https://github.com/vietanh00",
    }, {
        name: "Tran Nguyen Ha Khanh",
        studentID: "s3877707",
        email: "",
        github: "https://github.com/hakhanhne"
    }
]

module.exports = {
    PRODUCT_ROUTE,
    CART_ROUTE,
    ORDER_ROUTE,
    ORDER_HISTORY_ROUTE,
    ABOUT_ROUTE,
    PRIVACY_ROUTE,
    CONTACT_ROUTE,
    CATEGORY_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    SIGNUP_ROUTE,
    MY_ACCOUNT_ROUTE,
    CONNECTED_URI,
    PORT,
    MEMBERS
}