// src/controllers/protectedController.js

export const getProtected = (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email
      }
    }
  });
};

export const healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};
