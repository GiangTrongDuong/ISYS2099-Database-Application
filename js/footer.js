// create array of categories using Array
const categories = Array.from(Array(10), (_, index) => {
    return {
        id: index,
        name: `Category ${index}`,
        link: `category.html?category=${index}`
    }
})

const footer = `
    <div class="container">

        <div class="row">
            <div class="col-sm-12 col-md-6 about-section">
                <h6>Group name</h6>
                <p class="text-justify">
                <ul class="footer-links">
                    <li>
                        <h2>Authors:</h2>
                    </li>
                    <li><a href="">Giang Trong Duong - s3926135</a></li>
                    <li><a href="">Ngo Viet Anh - 3879954</a></li>
                    <li><a href="https://github.com/Puppychan">Tran Mai Nhung - s3879954</a></li>
                    <li><a href="">Tran Nguyen Ha Khanh - s3877707</a></li>
                </ul>
                </p>
            </div>

            <div class="col-xs-6 col-md-3">
                <h6>Categories</h6>
                <ul class="footer-links">
                    ${categories.slice(0, 5).map(category => {
    return `<li><a href="${category.link}">${category.name}</a></li>`
}).join('\n                    ')}
                </ul>
            </div>


            <div class="col-xs-6 col-md-3">
                <h6>Others</h6>
                <ul class="footer-links">
                    <li><a href="">About Us</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="">Privacy Policy</a></li>
                </ul>
            </div>

        </div>
        <hr>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-7 col-sm-6 col-xs-12">
                <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by
                    <a href="https://github.com/GiangTrongDuong/ISYS2099-Database-Application">Group 2 EEET2099 2023 Semester B</a>.
                </p>
            </div>
        </div>
    </div>

`;
const createFooterElement = () => {
    const footerContainer = document.createElement('div');
    footerContainer.className = 'footer-wrapper';
    footerContainer.innerHTML = footer;
    return footerContainer;
};

document.getElementsByTagName("footer")[0].appendChild(createFooterElement());
