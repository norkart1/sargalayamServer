const multer = require("multer");
const path = require('node:path')

// Storing the image with franchise ID as part of the filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     
    const pathx = path.join(__dirname, "public", "teamImages");

    if (!fs.existsSync(pathx)) {
      console.log("Directory does not exist, creating...");
      fs.mkdirSync(pathx, { recursive: true });
    }

    if (file.fieldname.startsWith("image")) {
      console.log("Setting destination to teamImg folder");
      cb(null, pathx);

    } else {
      console.log("Invalid fieldname");
      cb(new Error("Invalid fieldname"), null);
    }
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilterConfig = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, //means maximum file size 2mb;
  fileFilter: fileFilterConfig,
});

module.exports = upload;
