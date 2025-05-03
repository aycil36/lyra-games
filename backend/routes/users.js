const express = require('express');
const router = express.Router();
const User = require('../models/User'); // MongoDB User modeli

// GET /api/users → Tüm kullanıcıları getir
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:username → Belirli kullanıcıyı ada göre getir (case-insensitive)
router.get('/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ name: { $regex: `^${username}$`, $options: "i" } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users → Yeni kullanıcı ekle
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ message: "Kullanıcı eklenemedi", error: err });
  }
});

// DELETE /api/users/:name → Kullanıcıyı adıyla sil
router.delete('/:name', async (req, res) => {
  try {
    const result = await User.deleteOne({ name: req.params.name });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme sırasında hata", error: err });
  }
});

// PUT /api/users/:name/ratingStatus → Rating yetkisini güncelle
router.put('/:name/ratingStatus', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.canRate = req.body.canRate;
    await user.save();

    res.json({ message: `Rating yetkisi güncellendi: ${user.canRate}` });
  } catch (err) {
    res.status(500).json({ message: "Güncelleme hatası", error: err });
  }
});

module.exports = router;
