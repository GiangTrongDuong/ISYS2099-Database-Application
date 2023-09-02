const mongoose = require('mongoose');
const { Schema } = mongoose;
//schema for category
const categorySchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },

    attribute:[
        {aName:{
            type:mongoose.Schema.Types.String,
        },
        aValue:{
            type:mongoose.Schema.Types.Mixed
        },
        aRequired:{
            type:mongoose.Schema.Types.boolean
        }}
    ],

    parent_category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
});

module.exports = mongoose.model('Category', categorySchema);