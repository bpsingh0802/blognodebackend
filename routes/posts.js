// // const express = require('express');
// // const router = express.Router();
// // const Post = require('../models/Post');
// // const jwt = require('jsonwebtoken');

// // const authMiddleware = (req, res, next) => {
// //   const token = req.header('Authorization').replace('Bearer ', '');
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ error: 'Please authenticate' });
// //   }
// // };

// // router.post('/', authMiddleware, async (req, res) => {
// //   try {
// //     const { title, content } = req.body;
// //     const post = new Post({
// //       title,
// //       content,
// //       author: req.user.userId
// //     });
// //     await post.save();
// //     res.status(201).json(post);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // });

// // router.get('/', async (req, res) => {
// //   try {
// //     const posts = await Post.find().populate('author', 'username');
// //     res.json(posts);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // });

// // module.exports = router;


// // routes/postRoutes.js
// const express = require('express');
// const router = express.Router();
// const Post = require('../models/Post');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // ✅ Multer Config for Image Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, '../uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   }
// });
// const upload = multer({ storage });

// // ✅ Auth Middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ error: 'Please authenticate' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // ✅ Create Post (with optional image)
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     const { title, content, tags, visibility } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ error: 'Title and content are required' });
//     }

//     const post = new Post({
//       title,
//       content,
//       tags,
//       visibility,
//       author: req.user.userId,
//       image: req.file ? `/uploads/${req.file.filename}` : null
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // ✅ Get All Posts
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.find().populate('author', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // ✅ Get Authenticated User's Posts
// router.get('/my-posts', authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ author: req.user.userId });
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // ✅ Get Single Post by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate('author', 'username');
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Post = require('../models/Post');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const cloudinary = require('../utils/cloudinary');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ error: 'Please authenticate' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // Create Post with Cloudinary image upload
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     const { title, content, tags, visibility } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ error: 'Title and content are required' });
//     }

//     let imageUrl = null;
//     if (req.file) {
//       imageUrl = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'mern-blog' },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result.secure_url);
//           }
//         );
//         stream.end(req.file.buffer);
//       });
//     }

//     const post = new Post({
//       title,
//       content,
//       tags,
//       visibility,
//       author: req.user.userId,
//       image: imageUrl,
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get all posts (same as before)
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.find().populate('author', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get logged-in user's posts
// router.get('/my-posts', authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ author: req.user.userId });
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get post by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate('author', 'username');
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Please authenticate' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create Post with Cloudinary image upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags, visibility } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'mern-blog' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const post = new Post({
      title,
      content,
      tags,
      visibility,
      author: req.user.userId,
      image: imageUrl,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get logged-in user's posts
router.get('/my-posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.userId });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update post
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags, visibility } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    let imageUrl = post.image;
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'mern-blog' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.visibility = visibility || post.visibility;
    post.image = imageUrl;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update post visibility
router.patch('/:id/visibility', authMiddleware, async (req, res) => {
  try {
    const { visibility } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to change visibility' });
    }

    if (!['public', 'private'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility value' });
    }

    post.visibility = visibility;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;