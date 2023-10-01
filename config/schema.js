const db = require('./db');

async function createSchema() {
  const createSchemaQuery = `
    CREATE SCHEMA IF NOT EXISTS my_schema;
    
    CREATE TABLE IF NOT EXISTS my_schema.lists (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      active BOOLEAN NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      notes TEXT
    );
    
    CREATE TABLE IF NOT EXISTS my_schema.items (
      id SERIAL PRIMARY KEY,
      list_id INTEGER,
      name VARCHAR(255) NOT NULL,
      is_reoccurring BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      frequency INTEGER,
      frequency_period VARCHAR(50),
      last_added DATE,
      next_add_date DATE,
      amount NUMERIC,
      measurement VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES my_schema.lists(id)
    );
  `;

  try {
    await db.connect();
    await db.query(createSchemaQuery);
    console.log('Schema created successfully');
  } catch (error) {
    console.error('Error creating schema:', error);
  } finally {
    db.end();
  }
}

module.exports = createSchema;