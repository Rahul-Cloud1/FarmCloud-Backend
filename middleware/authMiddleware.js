const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require a valid JWT in Authorization header
exports.protect = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		}

		if (!token) {
			return res.status(401).json({ message: 'Not authorized, token missing' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded || !decoded.id) {
			return res.status(401).json({ message: 'Not authorized, token invalid' });
		}

		// Attach user object (without password) to request for controllers
		const user = await User.findById(decoded.id).select('-password');
		if (!user) return res.status(401).json({ message: 'User not found' });

		req.user = { id: user._id.toString(), role: user.role, name: user.name };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
	}
};
