import fs from "node:fs/promises";

class FileManager {
  async writeFile(filename, data) {
    try {
      data = JSON.stringify(data, null, 2);
      await fs.writeFile(filename, data);
    } catch {
      console.log("write error =>", error);
    }
  }
  async readFile(filename) {
    try {
      const fileContent = await fs.readFile(filename, "utf8");
      const fileData = JSON.parse(fileContent);
      return fileData;
    } catch (error) {
      console.error("Read error =>", error);
      return null;
    }
  }
}

export const fileManager = new FileManager();
