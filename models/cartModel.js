import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      name : {
        type : String,
      
      },
      image : {
        type : String,
        
      },
      price : {
        type : String,
        
      },
      quantity : {
        type : Number,
        
      },
    },
  ],
});

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
