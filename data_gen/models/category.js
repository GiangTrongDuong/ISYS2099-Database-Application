const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//schema for category
const categorySchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.Boolean
        }}
    ],
    
    parent_category:{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
    
});

module.exports = mongoose.model('Category', categorySchema);