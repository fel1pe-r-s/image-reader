import { pool } from "../database/database.js";

export async function getPreviousConsumption(customerCode, measureType) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM measure 
             WHERE customer_code = $1 AND measure_type = $2
             ORDER BY measure_datetime DESC 
             LIMIT 1`,
      [customerCode, measureType]
    );
    if (result.rows.length === 0) {
      console.log("No previous consumption found");
      return null;
    }
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error fetching previous consumption:", err);
    throw err;
  } finally {
    client.release();
  }
}
