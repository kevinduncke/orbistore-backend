import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

// CHECK PASSWORD IF IS MODIFIED AND HASH PASSWORD BEFORE SAVING
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return;
    }
    
    this.password = await bcrypt.hash(this.password, 10);
});

// CHECK PASSWORD MATCH WITH BCRYPT HASH
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);