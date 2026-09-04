import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  customId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isPasswordHashed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isPasswordHashed) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  if (this.password === candidatePassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(candidatePassword, salt);
      this.isPasswordHashed = true;
      await this.save();
    } catch (e) {
      console.warn('[User Model] Auto-hashing legacy password error:', e);
    }
    return true;
  }
  return false;
};

export const User = mongoose.model('User', userSchema);
export default User;