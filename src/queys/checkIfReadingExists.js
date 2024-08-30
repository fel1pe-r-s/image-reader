import { pool } from "../database/database.js";
export async function checkIfReadingExists(
  customer_code,
  measure_type,
  measure_datetime
) {
  const query = `
      SELECT 1 
      FROM measure 
      WHERE customer_code = $1 
      AND measure_type = $2 
      AND date_trunc('month', measure_datetime) = date_trunc('month', $3::timestamp)
      LIMIT 1`;
  const { rows } = await pool.query(query, [
    customer_code,
    measure_type,
    measure_datetime,
  ]);
  return rows.length > 0;
}
