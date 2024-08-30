import { filesCreateImage } from "../lib/gemini.js";
import { checkIfReadingExists } from "../queys/checkIfReadingExists.js";
import { getPreviousConsumption } from "../queys/getPreviousConsumption.js";
import { insertData } from "../queys/queysInsert.js";

export async function controllerUpload(req, res) {
  const file = req.file;
  const { customer_code, measure_datetime, measure_type } = req.body;
  if (!file || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Missing required fields",
    });
  }

  const readingExists = await checkIfReadingExists(
    customer_code,
    measure_type,
    measure_datetime
  );
  if (readingExists) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Reading of the month already done",
    });
  }

  const result = await getPreviousConsumption(customer_code, measure_type);
  const measure_consumption = result?.measure_consumption || 0;
  const previousReading = measure_consumption;
  const { text } = await filesCreateImage(file.key);
  console.log(text);
  function extractEConverterValor(jsonString) {
    const regex = /"measure_consumption":\s*"(\d+)"/;
    const regex2 = /measure_consumption:\s*(\d+)/;

    let match = jsonString.match(regex);

    if (match) {
      return Number(match[1]);
    }
    match = jsonString.match(regex2);
    if (match) {
      return Number(match[1]);
    } else {
      return new Error("Error: variable measure_consumption not found.");
    }
  }

  const consumption = extractEConverterValor(text);

  const ReadingCurrent = consumption;

  function calculateWaterGasAccount(
    ReadingCurrent,
    previousReading = 0,
    measureType
  ) {
    let ratePerUnit;
    let measure_type = measureType.toUpperCase();
    if (measure_type === "GAS") {
      ratePerUnit = 1.8;
    } else if (measure_type === "WATER") {
      ratePerUnit = 2.5;
    } else {
      throw new Error('Invalid measurement type. Use "gas" or "water".');
    }

    const consumption = ReadingCurrent - previousReading;

    const measure_value = Math.round(consumption * ratePerUnit);

    return measure_value;
  }

  const measure_value = calculateWaterGasAccount(
    ReadingCurrent,
    previousReading,
    measure_type
  );

  const image_name = file.key;
  const measure_uuid = crypto.randomUUID();
  const app_url = process.env.APP_URL || "http://localhost";
  const port = process.env.PORT || 3333;
  const image_url = `${app_url}:${port}/files/${image_name}`;

  insertData({
    measure_uuid,
    customer_code,
    measure_datetime,
    measure_type,
    image_name,
    measure_consumption: ReadingCurrent,
    measure_value,
  });

  res.json({
    image_url,
    measure_value,
    measure_uuid,
    ReadingCurrent,
    text,
  });
}
