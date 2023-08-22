const mongoose = require('mongoose');
//schema for category
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },

    required_attribute:{
        attribute_name:{
            type:String,
            required: true
        },
        attribute_value:{
            type: Schema.Types.Mixed,
            required: true
        }
    },

    attribute:[
        {attribute_name:{
            type:String,
        },
        attribute_value:{
            type:Schema.Types.Mixed
        }}
    ],
    
    parent_category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },

    child_category: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
      }]
    
});

module.exports = mongoose.model('Category', categorySchema);