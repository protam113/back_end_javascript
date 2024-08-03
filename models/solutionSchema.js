import mongoose from 'mongoose';


const solutionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    mainImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    intro: {
        type: String,
        required: true,
        minLength: [10, "Solution intro must contain at least 10 characters!"],
    },
    paraOneImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraOneDescription: {
        type: String,
    },
    paraOneTitle: {
        type: String,
    },
    paraTwoImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraTwoDescription: {
        type: String,
    },
    paraTwoTitle: {
        type: String,
    },
    paraThreeImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraThreeDescription: {
        type: String,
    },
    paraThreeTitle: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
});

export const Solution = mongoose.model('Solution', solutionSchema);
