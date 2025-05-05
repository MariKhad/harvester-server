import * as fs from 'fs/promises';

export async function writeJsonToFile(filePath: string, jsonData: any) {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2); // 2 пробела для форматирования
    await fs.writeFile(filePath, jsonString, 'utf-8');
    console.log(`Данные успешно записаны в файл ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Ошибка записи в файл ${filePath}:`, error);
    return false;
  }
}

export async function readJsonFromFile(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    console.log(`Данные успешно прочитаны из файла ${filePath}`);
    return jsonData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Файл ${filePath} не найден.`);
      return null; // Возвращаем null, если файл не найден
    } else {
      console.error(`Ошибка чтения файла ${filePath}:`, error);
      return null; // Возвращаем null при других ошибках
    }
  }
}
