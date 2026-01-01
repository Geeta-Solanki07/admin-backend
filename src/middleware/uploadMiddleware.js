// import multer from "multer";

// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// export default upload;


import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/PNG allowed"), false);
    }
  },
});

export default upload;
