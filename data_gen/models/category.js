const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//schema for category
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    // it's optional to enter attribute details
    // if name and value are null then required is set to false
    attribute_name:{
        type:String
    },
    attribute_value:{
        type: mongoose.Schema.Types.Mixed,
        // required: true
    },
    attribute_required:{
        type:Boolean,
        required: true
    },
    // store ObjectId of parent
    parent_category:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
    },
});

module.exports = mongoose.model('Category', categorySchema);