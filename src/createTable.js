import { pool } from "./database.js";

const createMeasureTable = async () => {
  const client = await pool.connect();

  try {
    const query = `
    CREATE TABLE IF NOT EXISTS measure (
      id SERIAL PRIMARY KEY,
      measure_uuid UUID NOT NULL,
      customer_code VARCHAR(50) NOT NULL,
      measure_datetime TIMESTAMP NOT NULL,
      measure_type VARCHAR(10) NOT NULL CHECK (measure_type IN ('WATER', 'GAS')),
      image_name VARCHAR(255) NOT NULL,
      measure_consumption VARCHAR(255) NOT NULL,
      measure_value INTEGER,
      has_confirmed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await client.query(query);
    console.log("Tabela 'measure' criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  } finally {
    client.release();
  }
};

createMeasureTable().catch((err) => console.error(err));
