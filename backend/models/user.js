const { Schema, model } = require('mongoose');
const {createHmac, randomBytes} = require("crypto");
const {createTokenForUser} = require("../service/auth");

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  salt: {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    default: '/images/default.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  likedBlogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }]

}, { timestamps: true });

// Generate salt and hash password before validation so `required` checks pass
userSchema.pre('validate', async function (){
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
})

// now make a same functino for validation 
userSchema.statics.matchPasswordAndGenerateToken = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not found");

    const providedHashedPassword = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (user.password !== providedHashedPassword) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;


};

module.exports = model('User', userSchema);