const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const getS3 = () => {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = process.env;
  console.log(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY);
  const myConfig = new AWS.Config({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    signatureVersion: "v4",
  });

  return new AWS.S3(myConfig);
};
exports.getS3 = getS3;

exports.multerUploadS3 = multer({
  storage: multerS3({
    s3: getS3(),
    bucket: "pitchbucket3",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        Date.now().toString() + "-" + file.originalname.split(" ").join("-")
      );
    },
  }),
});
