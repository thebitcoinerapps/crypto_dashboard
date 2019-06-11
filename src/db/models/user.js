const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

    const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
            /*TODO add validation */
        },
        password: {
            type: String,
            required: true,
        },
        holdings: {
            type: Array
        }
    });
    UserSchema.pre('save', async function(next){
        const user  = this;
        user.password =  await bcrypt.hash(user.password, 8);
        next();
    });
  const User = mongoose.model('User', UserSchema);

module.exports = User;