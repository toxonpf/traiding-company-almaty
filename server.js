require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const express = require('express');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const adminTables = new Set([
  'categories',
  'products',
  'receipts',
  'receipt_items',
  'sales',
  'sale_items',
  'suppliers',
  'profiles',
  'prices',
  'batches',
  'stock_movements'
]);

app.use(express.json());
app.use(express.static(publicDir));

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) {
    return null;
  }

  return data.user;
}

function isAdminEmail(email) {
  if (!email) {
    return false;
  }
  return adminEmails.includes(String(email).toLowerCase());
}

async function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  return next();
}

async function requireAdmin(req, res, next) {
  const token = getBearerToken(req);
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!isAdminEmail(user.email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  req.user = user;
  return next();
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const origin = req.get('origin') || 'http://localhost:3000';
    const redirectTo = process.env.SITE_URL || origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      user: data.user,
      session: data.session || null,
      isAdmin: isAdminEmail(email)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      user: data.user,
      session: data.session || null,
      isAdmin: isAdminEmail(email)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/auth/resend', async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const origin = req.get('origin') || 'http://localhost:3000';
    const redirectTo = process.env.SITE_URL || origin;
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: redirectTo }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resend email' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  return res.json({
    email: req.user.email,
    isAdmin: isAdminEmail(req.user.email)
  });
});

app.get('/api/products', async (req, res) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase env vars are missing' });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ items: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/admin/:table', requireAdmin, async (req, res) => {
  const table = req.params.table;
  if (!adminTables.has(table)) {
    return res.status(400).json({ error: 'Unknown table' });
  }

  const limit = Number(req.query.limit) || 100;

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(limit);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ items: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load data' });
  }
});

app.post('/api/admin/:table', requireAdmin, async (req, res) => {
  const table = req.params.table;
  if (!adminTables.has(table)) {
    return res.status(400).json({ error: 'Unknown table' });
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .insert(req.body)
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ items: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create record' });
  }
});

app.patch('/api/admin/:table/:id', requireAdmin, async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  if (!adminTables.has(table)) {
    return res.status(400).json({ error: 'Unknown table' });
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .update(req.body)
      .eq('id', id)
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ items: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update record' });
  }
});

app.delete('/api/admin/:table/:id', requireAdmin, async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  if (!adminTables.has(table)) {
    return res.status(400).json({ error: 'Unknown table' });
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ items: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Fallback to index.html so direct links still work
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
