import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await Product.findById(_id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const data = req.body;

  try {
    // const newProduct = await Product.create(data);
    const newProduct = await new Product(data).save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

 
export const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const data = req.body;
    try {
        const product = await Product.findById(_id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updateProduct = await Product.findByIdAndUpdate({_id : product._id}, {...data}, {new : true});
        if(!updateProduct){
            return res.status(403).json({ message: "Error in updating product" });
        }
        res.status(201).json(updateProduct)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const deleteProduct = await Product.findByIdAndDelete({_id : product._id});
        res.status(201).json(deleteProduct)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const createReview = async (req, res, next) => {
  try {
    const user = req.user

    const { _id } = req.params;
    const data = req.body;
    const review = {
      user: user._id,
      name: user.username,
      rating: data.rating,
      message: data.message,
    }

    const { reviews } = await Product.findById(_id);
    const newReviews = [...reviews, review];
    const rating =
      reviews.length !== 0
        ? newReviews.reduce((acc, i) => acc + i.rating, 0) / newReviews.length
        : data.rating;

    const result = await Product.findByIdAndUpdate(
      { _id },
      {
        $set: { rating: rating.toFixed(1), numofReviews: newReviews.length },
        $push: { reviews: review },
      },
      { new: true }
    );

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
