const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema(
    {
        aName:{
            type:mongoose.Schema.Types.String,
        },
        aValue:{
            type:mongoose.Schema.Types.String,
            enum: ['text', 'number']
        },
        aRequired:{
            type: mongoose.Schema.Types.Boolean
        },
        value:{
            type: mongoose.Schema.Types.Mixed,
            required: [function() {
                return this.aRequired;
            }, "This attribute value is required"],
            validate: function(v) {
                let type = typeof v;
                if (type == "string") type = "text";
                if (v != null) return (type === this.aValue);
                return true
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
        required: [true, "MySQL ID is required"],
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