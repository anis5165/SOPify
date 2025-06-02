const { Schema, model } = require('../connection');

const stepSchema = new Schema({
    title: { type: String },
    description: { type: String },
    imgData: { type: String }, // Base64 image data from extension
    url: { type: String },
    timestamp: { type: Number },
    details: { type: Schema.Types.Mixed } // For additional metadata
});

const mySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    steps: [stepSchema], // Array of steps with screenshots
    image: { 
        filename: String,
        path: String,
        contentType: String,
        size: Number
    },
    fromExtension: { type: Boolean, default: false },
    url: { type: String },
    timestamp: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
})

module.exports = model('sops', mySchema);