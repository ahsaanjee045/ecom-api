import Cart from "../models/cartModel.js";

export const createCart = async (req, res) => {
  const { _id } = req.user;
  // const data = req.body;
  try {
    // const cart = await Cart.find({user : _id});
    // if (cart.length > 0) {
    //     return res.status(400).json({ message: "Cart already exists" });
    // }
    const newCart = await new Cart({
      user: _id,
      items: [],
    }).save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ user: _id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const user = req.user;
  const { items } = req.body;
  try {
    const existItem = await Cart.updateOne(
      { user: user._id, items: { $elemMatch: { productId: items.productId } } },
      { $set: { "items.$.quantity": items.quantity } }
    );
    if (existItem.matchedCount != 1) {
      const result = await Cart.updateOne(
        { user: user._id },
        { $push: { items: items } }
      );
      if (result.modifiedCount === 0) throw new Error("item not added to cart");
    }
    let data = await Cart.findOne({ user });
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFromCart = async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.params;
  try {
    const cart = await Cart.updateOne(
      { user: _id, "items.productId": productId },
      {
        $pull: { items: { productId: productId } },
      },
      { "items.$": 1 }
    );
    let data = await Cart.findOne({ user : _id });
    return res.status(200).send(data);
    // res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
