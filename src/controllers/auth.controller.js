const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma.service");

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists)
            return res.status(400).json({ error: "Email already in use" });

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, password: hashed }
        });

        res.status(201).json({ message: "User registered!", user: { id: user.id, email: user.email } });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful!", token });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };