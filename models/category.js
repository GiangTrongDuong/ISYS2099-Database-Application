const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoryAttributeSchema = new Schema({
    aName: {
        type: String,
    },
    aValue: {
        type: mongoose.Schema.Types.Mixed,
    },
    aRequired: {
        type: Boolean,
    }
});

//schema for category
const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },

    attribute: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryAttribute',
    }],

    parent_category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
});
const CategoryAttribute = mongoose.model('CategoryAttribute', categoryAttributeSchema);
module.exports = mongoose.model('Category', categorySchema), { CategoryAttribute };