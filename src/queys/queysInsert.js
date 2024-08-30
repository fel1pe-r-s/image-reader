import { pool } from "../database.js";

export async function insertData({
  measure_uuid,
  customer_code,
  measure_datetime,
  measure_type,
  image_name,
  measure_consumption,
  measure_value,
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO measure (measure_uuid, customer_code, measure_datetime, measure_type, image_name, measure_consumption, measure_value) 
             VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING id`,
      [
        measure_uuid,
        customer_code,
        measure_datetime,
        measure_type,
        image_name,
        measure_consumption,
        measure_value,
      ]
    );
    return {
      success: result,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    client.release();
  }
}
