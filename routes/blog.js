const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog'); 
const Comment = require('../models/comment');
const router = Router();

// Ensure uploads folder exists
const uploadDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to public/uploads/
  },
  filename: function (req, file, cb) {
    const fileName = `Date-${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

router.get('/add-new', (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id' , async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
  );
  return res.render("blog" , {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single('coverimage'), async(req, res) => {
  console.log("Form Data:", req.body);
  console.log("Uploaded File:", req.file); 
  const { title , body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    coverImageUrl : `uploads/${req.file.filename}`, // Save the relative path
    createdBy: req.user._id,
  })
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
