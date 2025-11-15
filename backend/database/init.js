export function initDatabase(db) {
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatarUrl TEXT NOT NULL,
      availability TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      clientId TEXT NOT NULL,
      assignedTo TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      amount REAL NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    );
  `);

  // Check if we need to seed data
  const result = db.exec('SELECT COUNT(*) as count FROM clients');
  const clientCount = result[0]?.values[0]?.[0] || 0;

  if (clientCount === 0) {
    console.log('Seeding database with initial data...');
    seedDatabase(db);
  }
}

function seedDatabase(db) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toISOString().split('T')[0];

  // Insert clients
  const clients = [
    { id: 'c1', name: 'Alice Johnson', address: 'Eichenweg 123', phone: '555-0101', email: 'alice@example.com' },
    { id: 'c2', name: 'Bob Williams', address: 'Kiefernstraße 456', phone: '555-0102', email: 'bob@example.com' },
    { id: 'c3', name: 'Charlie Brown', address: 'Ahorn-Allee 789', phone: '555-0103', email: 'charlie@example.com' },
    { id: 'c4', name: 'Diana Miller', address: 'Birken-Weg 101', phone: '555-0104', email: 'diana@example.com' },
  ];
  clients.forEach(c => {
    db.run('INSERT INTO clients (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?)',
      [c.id, c.name, c.address, c.phone, c.email]);
  });

  // Insert employees
  const employees = [
    {
      id: 'e1',
      name: 'David Green',
      role: 'Chefgärtner',
      avatarUrl: 'https://i.pravatar.cc/150?u=e1',
      availability: JSON.stringify({ monday: true, tuesday: true, wednesday: true, thursday: true, friday: false, saturday: false, sunday: false })
    },
    {
      id: 'e2',
      name: 'Eve Gardener',
      role: 'Gartenbau-Expertin',
      avatarUrl: 'https://i.pravatar.cc/150?u=e2',
      availability: JSON.stringify({ monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: false, sunday: false })
    },
    {
      id: 'e3',
      name: 'Frank Spade',
      role: 'Landschaftsgärtner',
      avatarUrl: 'https://i.pravatar.cc/150?u=e3',
      availability: JSON.stringify({ monday: false, tuesday: false, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false })
    },
    {
      id: 'e4',
      name: 'Grace Roots',
      role: 'Nachwuchs-Gärtnerin',
      avatarUrl: 'https://i.pravatar.cc/150?u=e4',
      availability: JSON.stringify({ monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false })
    },
  ];
  employees.forEach(e => {
    db.run('INSERT INTO employees (id, name, role, avatarUrl, availability) VALUES (?, ?, ?, ?, ?)',
      [e.id, e.name, e.role, e.avatarUrl, e.availability]);
  });

  // Insert tasks
  const tasks = [
    { id: 't1', title: 'Rasenmähen & Kantenschneiden', clientId: 'c1', assignedTo: JSON.stringify(['e1', 'e4']), dueDate: formatDate(today), status: 'in-progress', description: "Standardmäßiges Mähen, Kanten an allen Gehwegen und der Einfahrt schneiden." },
    { id: 't2', title: 'Unkraut jäten in Beeten', clientId: 'c2', assignedTo: JSON.stringify(['e2']), dueDate: formatDate(today), status: 'open', description: "Entfernen Sie alles Unkraut aus den vorderen und hinteren Gartenbeeten." },
    { id: 't3', title: 'Rosensträucher beschneiden', clientId: 'c1', assignedTo: JSON.stringify(['e2']), dueDate: formatDate(tomorrow), status: 'open', description: "Sorgfältiger Schnitt aller 15 Rosensträucher." },
    { id: 't4', title: 'Sprinkleranlage installieren', clientId: 'c3', assignedTo: JSON.stringify(['e1', 'e3']), dueDate: formatDate(nextWeek), status: 'open', description: "Vollständige Installation einer 5-Zonen-Sprinkleranlage." },
    { id: 't5', title: 'Blumenbeete mulchen', clientId: 'c4', assignedTo: JSON.stringify(['e4']), dueDate: formatDate(tomorrow), status: 'in-progress', description: "5 cm dunkelbraunen Mulch auf alle Blumenbeete auftragen." },
    { id: 't6', title: 'Vierteljährliche Düngung', clientId: 'c2', assignedTo: JSON.stringify(['e1']), dueDate: formatDate(yesterday), status: 'completed', description: "Ausgewogenen Dünger auf alle Rasenflächen auftragen." },
    { id: 't7', title: 'Herbst-Aufräumarbeiten', clientId: 'c3', assignedTo: JSON.stringify(['e1', 'e4']), dueDate: formatDate(today), status: 'open', description: "Laub harken, Schmutz entfernen und auf den Winter vorbereiten." },
    { id: 't8', title: 'Neue einjährige Pflanzen setzen', clientId: 'c4', assignedTo: JSON.stringify(['e2']), dueDate: formatDate(yesterday), status: 'completed', description: "Bunte einjährige Pflanzen am vorderen Gehweg pflanzen." },
  ];
  tasks.forEach(t => {
    db.run('INSERT INTO tasks (id, title, clientId, assignedTo, dueDate, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [t.id, t.title, t.clientId, t.assignedTo, t.dueDate, t.status, t.description]);
  });

  // Insert bills
  const bills = [
    { id: 'b1', clientId: 'c1', amount: 150.00, dueDate: formatDate(nextWeek), status: 'due' },
    { id: 'b2', clientId: 'c2', amount: 75.00, dueDate: formatDate(yesterday), status: 'paid' },
    { id: 'b3', clientId: 'c3', amount: 1200.00, dueDate: formatDate(today), status: 'due' },
    { id: 'b4', clientId: 'c4', amount: 250.00, dueDate: new Date(2023, 11, 15).toISOString().split('T')[0], status: 'overdue' },
    { id: 'b5', clientId: 'c2', amount: 75.00, dueDate: new Date(2023, 10, 20).toISOString().split('T')[0], status: 'paid' },
  ];
  bills.forEach(b => {
    db.run('INSERT INTO bills (id, clientId, amount, dueDate, status) VALUES (?, ?, ?, ?, ?)',
      [b.id, b.clientId, b.amount, b.dueDate, b.status]);
  });

  console.log('Database seeded successfully!');
}
