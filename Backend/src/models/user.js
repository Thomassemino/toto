const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['admin', 'jefe_obra', 'deposito', 'lectura'], 
    default: 'lectura' 
  },
  nombre: { type: String, required: true },
  obrasAsignadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Obra' }],
  activo: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
 if (!this.isModified('password')) return next();
 this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);