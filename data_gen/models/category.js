const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema(
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
        }
    },
    { _id : false }
);

//schema for category
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    attribute:[attributeSchema],
    parent_category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
});


const attribute = mongoose.model('Attribute', attributeSchema);
const category = mongoose.model('Category', categorySchema);
module.exports = {attribute,category};