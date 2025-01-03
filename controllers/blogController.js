const Blog = require("../models/blogModel.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const upload = require("../middlewares/multer.js");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError.js");

// Route for Getting all Blogs Data
const allBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
};

const createBlog = async (req, res) => {
  const dataWithCloudinaryImgUrl = { ...req.body, image: req.file.path };
  const newBlog = new Blog(dataWithCloudinaryImgUrl);
  await newBlog.save();
  res.send("success");
};

// Route to update views of a Specific blog
const updateViews = async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug: slug });
  // Increment views by 1
  blog.views += 1;
  await blog.save();
  res.status(200).json({ message: "Blog views updated", blog });
};

// Route to get details of Specific Blog
const blogDetails = async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug: slug });
  res.json(blog);
};

const updateLikes = async (req, res) => {
  const slug = req.params.id;
  console.log(slug);
  const blog = await Blog.findOne({ slug:slug});
  console.log(blog.likes);
  const userId = parseInt(req.userId);
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found" });
  }
console.log(blog);
  const isLiked = blog.likes.includes(userId);

  let updatedBlog;

  if (isLiked) {
    // If the user has already liked the blog, unlike it
    console.log('in islike');
    blog.likes = blog.likes.filter(item=> item!= userId);
    console.log(blog.likes);

    console.log("unliked"+blog.likes);
    updatedBlog =blog;
    blog.save();


    // updatedBlog = await Blog.findByIdAndUpdate(
    //   req.params.id,
    //   { $pull: { likes: userId } },
    //   { new: true }
    // );
    res.status(200).json({
      success: true,
      updatedBlog,
      message: "Blog unlike successfully.",
    });
  } else {
    console.log('is not islike');
    // If the user hasn't liked the blog, like it
    // updatedBlog = await Blog.findByIdAndUpdate(
    //   req.params.id,
    //   { $push: { likes: userId } },
    //   { new: true }
    // );
    blog.likes.push(userId);
    console.log("notliked" + blog.likes);
    updatedBlog = blog;
    blog.save();
    res.status(200).json({
      success: true,
      updatedBlog,
      message: "Blog liked successfully.",
    });
  }
};

// Serve static files from the uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// console.log(
//   "Static files are being served from",
//   path.join(__dirname, "uploads")
// );
// app.use(bodyParser.json());

module.exports = {
  allBlogs,
  updateViews,
  updateLikes,
  blogDetails,
  createBlog,
};
