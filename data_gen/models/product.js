const mongoose = require('mongoose');

//schema for category
const productSchema = new mongoose.Schema({
    mysql_id:{
        type: Number,
        required: [true, "MySQL ID is required"]
    },
    category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
    attribute:[attributeSchema],

    
});


const product = mongoose.model('Product', productSchema);
module.exports = {product};