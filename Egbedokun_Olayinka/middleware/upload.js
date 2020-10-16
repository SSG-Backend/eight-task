const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const util = require("util");
const config = require("config");

const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });

var storage = new GridFsStorage({
  url: config.get("mongoURI"),
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["application/pdf"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-file-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "files",
      filename: `${Date.now()}-file-${file.originalname}`,
    };
  },
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
// module.exports = uploadFilesMiddleware;

const uploadFileFunc = async (req, res, next) => {
  await uploadFilesMiddleware(req, res);

  console.log(req.file);

  next();
};

module.exports = uploadFileFunc;
