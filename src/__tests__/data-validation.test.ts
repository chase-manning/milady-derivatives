import fs from "fs";
import path from "path";

interface MiladyDerivative {
  openseaId: string;
  name: string;
  description: string;
  chainId: number;
  volume: number;
  image: string;
  parent?: string;
  coingeckoId?: string;
  magicEdenSlug?: string;
  tensorSlug?: string;
  website?: string;
}

describe("Data Validation Tests", () => {
  let data: MiladyDerivative[];

  beforeAll(() => {
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
      data.forEach((item) => {
        expect(item).toHaveProperty("openseaId");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("description");
        expect(item).toHaveProperty("chainId");
        expect(item).toHaveProperty("volume");
        expect(item).toHaveProperty("image");

        expect(typeof item.openseaId).toBe("string");
        expect(typeof item.name).toBe("string");
        expect(typeof item.description).toBe("string");
        expect(typeof item.chainId).toBe("number");
        expect(typeof item.volume).toBe("number");
        expect(typeof item.image).toBe("string");

        expect(item.openseaId.trim()).not.toBe("");
        expect(item.name.trim()).not.toBe("");
        expect(item.description.trim()).not.toBe("");
        expect(item.image.trim()).not.toBe("");

        expect(item.volume).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(item.volume)).toBe(true);

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
      data.forEach((item) => {
        expect(item.image).toMatch(/^\/api\/images\//);
      });
    });

    test("parent should be present and URL-friendly when set", () => {
      data.forEach((item) => {
        expect(item.parent).toBeDefined();
        expect(typeof item.parent).toBe("string");
        expect(item.parent!.trim()).not.toBe("");
        expect(item.parent).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe("Image File Existence Validation", () => {
    test("all referenced image files should exist", () => {
      const imagesDir = path.join(process.cwd(), "public", "api", "images");

      data.forEach((item) => {
        const imagePath = item.image.replace("/api/images/", "");
        const fullImagePath = path.join(imagesDir, imagePath);
        expect(fs.existsSync(fullImagePath)).toBe(true);
      });
    });

    test("should have consistent image file extensions", () => {
      data.forEach((item) => {
        const extension = path.extname(item.image).toLowerCase();
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
      data.forEach((item) => {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.name.length).toBeLessThan(200);
      });
    });

    test("descriptions should be reasonable length", () => {
      data.forEach((item) => {
        expect(item.description.length).toBeGreaterThan(0);
        expect(item.description.length).toBeLessThan(1000);
      });
    });

    test("openseaId should be URL-friendly", () => {
      data.forEach((item) => {
        expect(item.openseaId).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe("Chain ID Validation", () => {
    test("should only use known chain IDs", () => {
      const knownChainIds = [
        1, 101, 137, 420, 900, 999, 2741, 8453, 43114, 80094,
      ];

      data.forEach((item) => {
        expect(knownChainIds).toContain(item.chainId);
      });
    });
  });

  describe("Volume Data Validation", () => {
    test("volume should be a reasonable value", () => {
      data.forEach((item) => {
        expect(item.volume).toBeGreaterThanOrEqual(0);
        expect(item.volume).toBeLessThan(10000);
      });
    });

    test("should have some items with non-zero volume", () => {
      const itemsWithVolume = data.filter((item) => item.volume > 0);
      expect(itemsWithVolume.length).toBeGreaterThan(0);
    });
  });

  describe("Live stats file", () => {
    test("live-stats.json should be valid when present", () => {
      const livePath = path.join(
        process.cwd(),
        "public",
        "api",
        "live-stats.json"
      );
      if (!fs.existsSync(livePath)) return;
      const live = JSON.parse(fs.readFileSync(livePath, "utf-8"));
      expect(live).toHaveProperty("updatedAt");
      expect(live).toHaveProperty("stats");
      expect(typeof live.stats).toBe("object");
    });
  });
});
