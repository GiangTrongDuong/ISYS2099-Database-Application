const mongoose = require('mongoose');

const categoryAttributeSchema = new mongoose.Schema(
    {
        aName:{
            type:mongoose.Schema.Types.String,
            required: [true, "aName is required"]
        },
        aValue:{
            type:mongoose.Schema.Types.String,
            enum: {
                values: ['text', 'number', 'bool'],
                message: '{VALUE} is not supported'
            },
            required: [true, "aValue is required"],
            default: 'text'
        },
        aRequired:{
            type: mongoose.Schema.Types.Boolean,
            required: [true, "aRequired is required"]
        }
    },
    { _id : false }
);

//schema for category
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Category name is required"]
    },
    attribute:[categoryAttributeSchema],
    parent_category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
});


const categoryAttribute = mongoose.model('Category Attribute', categoryAttributeSchema);
const category = mongoose.model('Category', categorySchema);
module.exports = {categoryAttribute, category};