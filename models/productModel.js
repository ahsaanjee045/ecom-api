import mongoose from "mongoose";


const reviewSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    name : {
        type : String,
        required : true,
    },
    message : { 
        type : String,
    },
    rating : {
        type : Number,
        default : 0,
    },
}, {
    timestamps : true
})

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true,
    },
    brand : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    countInStock : {
        type : Number,
        default : 5
    },
    price : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        default : 0,
    },
    reviews : [reviewSchema],
    numofReviews : {
        type : Number,
        default : 0,
    }
})


const Product = mongoose.model("product", productSchema);

export default Product;