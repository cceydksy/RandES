const User = require("../models/User");

// POST /api/v1/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Bu e-posta zaten kayıtlı" });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı",
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Kayıt başarısız", error: error.message });
  }
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı" });
    }

    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Giriş başarısız", error: error.message });
  }
};

module.exports = { register, login };
