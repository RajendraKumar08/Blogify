// const mongoose = require("mongoose");
const {Schema, model} = require("mongoose")
const {createHmac, randomBytes} = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    salt : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true,
    },
    profileImageURL : {
        type : String,
        default : "/image/default.png"
    },
    role : {
        type : String,
        enum : ["USER", "ADMIN"],
        default : "USER"
    }
}, 
    {timestamps : true}
);

userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

});


// basecally hame ek use ne password diya while signing in
// Hamne email se ek user ko find kiya aur uska salt and hashedpassword le liye
// ab ham user ne jo password diya hai while signing in uska hash banayenge using that founded salt


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

const User = model('user', userSchema)

module.exports = User;