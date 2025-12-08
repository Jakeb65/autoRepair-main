import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { prisma } from './prismaClient.js'
import { generateToken, authMiddleware } from './auth.js'

dotenv.config()

const app = express()
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Seed test user (development only)
app.post('/seed', async (_req, res) => {
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { mail: 'test@example.com' } }).catch(() => null);
    if (existing) {
      return res.json({ success: true, message: 'Test user already exists', data: { email: 'test@example.com', password: 'password123' } });
    }

    const hashed = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        imie: 'Test',
        nazwisko: 'User',
        mail: 'test@example.com',
        telefon: '123456789',
        rola: 'user',
        haslo: hashed,
      },
    });
    res.json({ success: true, message: 'Test user created', data: { email: user.mail, password: 'password123' } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Seed failed' });
  }
});

// Auth: register
app.post('/auth/register', async (req, res) => {
  const { imie, nazwisko, mail, telefon, haslo, rola } = req.body;
  if (!imie || !mail || !haslo) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const hashed = await bcrypt.hash(haslo, 10);
    const user = await prisma.user.create({
      data: { imie, nazwisko, mail, telefon, rola: rola || 'user', haslo: hashed },
    });
    res.status(201).json({ success: true, message: 'Registered', data: { id: user.id } });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || 'Could not create user' });
  }
});

// Auth: login
app.post('/auth/login', async (req, res) => {
  const { mail, haslo } = req.body;
  if (!mail || !haslo) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const user = await prisma.user.findUnique({ where: { mail } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(haslo, user.haslo);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id);
    res.json({ success: true, message: 'Zalogowano', data: { token, userId: user.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset password
app.post('/auth/reset', async (req, res) => {
  const { mail, imie, nowe_haslo } = req.body;
  if (!mail || !imie || !nowe_haslo) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const user = await prisma.user.findUnique({ where: { mail } });
    if (!user || user.imie !== imie) return res.status(404).json({ success: false, message: 'User not found' });
    const hashed = await bcrypt.hash(nowe_haslo, 10);
    await prisma.user.update({ where: { id: user.id }, data: { haslo: hashed } });
    res.json({ success: true, message: 'Haslo zmienione' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Profile
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId as number;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({
      id: user.id,
      imie: user.imie,
      nazwisko: user.nazwisko,
      mail: user.mail,
      telefon: user.telefon,
      rola: user.rola,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Orders
app.get('/orders', authMiddleware, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { uzytkownik: true } });
    const mapped = orders.map(o => ({
      id: o.id,
      nazwa: o.nazwa,
      status: o.status,
      data_utworzenia: o.data_utworzenia,
      opis: o.opis,
      uzytkownik_id: o.uzytkownik_id,
    }));
    res.json({ success: true, message: 'OK', data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

app.post('/orders', authMiddleware, async (req, res) => {
  const { nazwa, opis } = req.body;
  try {
    const userId = (req as any).userId as number;
    const order = await prisma.order.create({ data: { nazwa, opis, status: 'nowe', uzytkownik_id: userId } });
    res.status(201).json({ success: true, message: 'Created', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

// Notifications (placeholder)
app.get('/notifications', authMiddleware, async (_req, res) => {
  res.json({ success: true, message: 'OK', data: [] })
})

export default app

