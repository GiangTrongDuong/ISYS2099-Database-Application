const PRODUCT_ROUTE = '/product';
const CART_ROUTE = '/cart';
const CATEGORY_ROUTE = '/category';

const ORDER_ROUTE = '/order';
const ORDER_HISTORY_ROUTE = '/history'; //full route: /order/history

const WAREHOUSE_ROUTE = '/warehouse';
const WAREHOUSE_ID_ROUTE = '/view'; //full route: /warehouse/view?id=123
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

module.exports = {
    PRODUCT_ROUTE,
    CART_ROUTE,
    ORDER_ROUTE,
    ORDER_HISTORY_ROUTE,
    WAREHOUSE_ROUTE,
    WAREHOUSE_ID_ROUTE,
    WAREHOUSE_MOVE_PRODUCT,
    ABOUT_ROUTE,
    PRIVACY_ROUTE,
    CONTACT_ROUTE,
    CATEGORY_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    SIGNUP_ROUTE,
    MY_ACCOUNT_ROUTE,
    CONNECTED_URI,
    PORT
}