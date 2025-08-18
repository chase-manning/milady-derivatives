import fs from "fs";
import path from "path";

// Define the expected structure for each item in the data array
interface MiladyDerivative {
  openseaId: string;
  name: string;
  description: string;
  chainId: number;
  volume: number;
  image: string;
}

describe("Data Validation Tests", () => {
  let data: MiladyDerivative[];

  beforeAll(() => {
    // Read the data.json file
    const dataPath = path.join(process.cwd(), "public", "api", "data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    data = JSON.parse(rawData);
  });

  describe("Data Structure Validation", () => {
    test("should have data as an array", () => {
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test("each item should have all required fields", () => {
      data.forEach((item, index) => {
        // Check that all required fields exist
        expect(item).toHaveProperty("openseaId");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("description");
        expect(item).toHaveProperty("chainId");
        expect(item).toHaveProperty("volume");
        expect(item).toHaveProperty("image");

        // Check field types
        expect(typeof item.openseaId).toBe("string");
        expect(typeof item.name).toBe("string");
        expect(typeof item.description).toBe("string");
        expect(typeof item.chainId).toBe("number");
        expect(typeof item.volume).toBe("number");
        expect(typeof item.image).toBe("string");

        // Check that fields are not empty
        expect(item.openseaId.trim()).not.toBe("");
        expect(item.name.trim()).not.toBe("");
        expect(item.description.trim()).not.toBe("");
        expect(item.image.trim()).not.toBe("");

        // Check that volume is a valid number (can be 0)
        expect(item.volume).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(item.volume)).toBe(true);

        // Check that chainId is a valid positive integer
        expect(Number.isInteger(item.chainId)).toBe(true);
        expect(item.chainId).toBeGreaterThan(0);
      });
    });

    test("openseaId should be unique", () => {
      const openseaIds = data.map((item) => item.openseaId);
      const uniqueIds = new Set(openseaIds);
      expect(uniqueIds.size).toBe(openseaIds.length);
    });

    test("image paths should start with /api/images/", () => {
      data.forEach((item, index) => {
        expect(item.image).toMatch(/^\/api\/images\//);
      });
    });
  });

  describe("Image File Existence Validation", () => {
    test("all referenced image files should exist", () => {
      const imagesDir = path.join(process.cwd(), "public", "api", "images");

      data.forEach((item, index) => {
        // Extract filename from the image path
        const imagePath = item.image.replace("/api/images/", "");
        const fullImagePath = path.join(imagesDir, imagePath);

        expect(fs.existsSync(fullImagePath)).toBe(true);
      });
    });

    test("should have consistent image file extensions", () => {
      data.forEach((item, index) => {
        const imagePath = item.image;
        const extension = path.extname(imagePath).toLowerCase();

        // Check that the extension is one of the expected formats
        const validExtensions = [
          ".avif",
          ".png",
          ".jpg",
          ".jpeg",
          ".webp",
          ".svg",
          ".jfif",
        ];
        expect(validExtensions).toContain(extension);
      });
    });
  });

  describe("Data Quality Validation", () => {
    test("names should be reasonable length", () => {
      data.forEach((item, index) => {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.name.length).toBeLessThan(200); // Reasonable max length
      });
    });

    test("descriptions should be reasonable length", () => {
      data.forEach((item, index) => {
        expect(item.description.length).toBeGreaterThan(0);
        expect(item.description.length).toBeLessThan(1000); // Reasonable max length
      });
    });

    test("openseaId should be URL-friendly", () => {
      data.forEach((item, index) => {
        // Check that openseaId contains only valid characters for URLs
        expect(item.openseaId).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe("Chain ID Validation", () => {
    test("should only use known chain IDs", () => {
      const knownChainIds = [1, 137, 420, 900]; // Ethereum, Polygon, Optimism, etc.

      data.forEach((item, index) => {
        expect(knownChainIds).toContain(item.chainId);
      });
    });
  });

  describe("Volume Data Validation", () => {
    test("volume should be a reasonable value", () => {
      data.forEach((item, index) => {
        expect(item.volume).toBeGreaterThanOrEqual(0);
        expect(item.volume).toBeLessThan(10000); // Reasonable max volume
      });
    });

    test("should have some items with non-zero volume", () => {
      const itemsWithVolume = data.filter((item) => item.volume > 0);
      expect(itemsWithVolume.length).toBeGreaterThan(0);
    });
  });
});
