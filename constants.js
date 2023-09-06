const PRODUCT_ROUTE = '/product';
const SELLER_ROUTE = '/seller';
const CART_ROUTE = '/cart';
const CATEGORY_ROUTE = '/category';

const ORDER_ROUTE = '/order';
const ORDER_HISTORY_ROUTE = '/history'; //full route: /order/history

const WAREHOUSE_ROUTE = '/warehouse';
const WAREHOUSE_ID_ROUTE = '/view'; //full route: /warehouse/view?id=123
const WAREHOUSE_BY_UID_ROUTE = '/by'; //full route: /warehouse/by?uid=123
const WAREHOUSE_MOVE_PRODUCT = '/move' // full route: /warehouse/move?product=123&quantity=456

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
        name: "Giang Trong Duong",
        studentID: "s3926135",
        email: "s3926135@rmit.edu.com",
        github: "https://github.com/GiangTrongDuong",
    }, {
        name: "Tran Mai Nhung",
        studentID: "s3879954",
        email: "nhungmaitran1412@gmail.com",
        github: "https://github.com/Puppychan",
    }, {
        name: "Ngo Viet Anh",
        studentID: "s3928859",
        email: "s3928859@rmit.edu.vn",
        github: "https://github.com/vietanh00",
    }, {
        name: "Tran Nguyen Ha Khanh",
        studentID: "s3877707",
        email: "s3877707@rmit.edu.vn",
        github: "https://github.com/hakhanhne"
    }
]

module.exports = {
    PRODUCT_ROUTE,
    SELLER_ROUTE,
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