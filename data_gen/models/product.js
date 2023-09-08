const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema(
    {
        aName:{
            type:mongoose.Schema.Types.String,
        },
        aValue:{
            type:mongoose.Schema.Types.String,
            enum: ['text', 'number', 'bool']
        },
        aRequired:{
            type: mongoose.Schema.Types.Boolean
        },
        value:{
            type: mongoose.Schema.Types.Mixed,
            // required: function() {
            //     return this.aRequired ;
            // },
            validate: function(v) {
                console(typeof v)
                return (typeof v === this.aValue)
            },
            default: null
        },

    },
    { _id : false }
);

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
    attribute:[productAttributeSchema],
});


const productAttribute = mongoose.model('Product Attribute', productAttributeSchema);
const product = mongoose.model('Product', productSchema);
module.exports = {product, productAttribute};