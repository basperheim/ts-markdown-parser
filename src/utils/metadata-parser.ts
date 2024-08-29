import { stripLeadingWhitespace } from "../libs";

/**
 * Converts a string to kebab-case format for slugs
 * (trims, removes spaces, special chars, double-hyphens, etc.. and makes lowercase).
 *
 * @param {string} str Input string to be converted.
 * @returns {string} Returns `kebab-cased` string.
 */
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\- ]+/g, "") // Remove all non-alphanumeric characters except hyphens and spaces
    .replace(/[\s\-]+/g, "-") // Replace spaces and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
    .replace(/-{2,}/g, "-") // Replace double hyphens
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
    .trim();
};

/**
 * Normalizes a string by:
 * - Removing specific types of quotes.
 * - Trimming leading and trailing spaces.
 * - Converting the string to lowercase.
 *
 * @param {string} str Input string to be normalized.
 * @returns {string} Normalized string.
 */
const normalizeString = (str: string): string => {
  return str
    .replace(/[\"\u201C\u201D\u201E\u201F]+/g, "") // Remove various types of quotes
    .replace(/[\u2018\u2019\u201A\u2039\u203A]+/g, "") // Remove special single quotes
    .trim()
    .toLowerCase();
};

/**
 * Formats a date string into 'yyyy-MM-dd' format if valid, otherwise returns null.
 *
 * @param {string} dateStr Date string to be formatted.
 * @returns {string | null} Formatted date string or null if invalid.
 */
const formatDate = (dateStr: string): string | null => {
  const parsedDate = new Date(dateStr);

  if (parsedDate.toString() !== "Invalid Date") {
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
};

/**
 * Strips leading and trailing quotes from a string.
 *
 * @param {string} str String from which quotes are to be removed.
 * @returns {string} String with leading and trailing quotes removed.
 */
const stripQuotes = (str: string): string => {
  return str.replace(/(^["'`]+|["'`]+$)/g, ""); // Remove leading and trailing quotes
};

/**
 * Parses a YAML string and returns an object representation.
 * - Handles keyword normalization, slug conversion, date formatting, and number parsing.
 *
 * @param {string} yamlString YAML string to be parsed.
 * @returns {Record<string, any>} Parsed YAML object.
 */
const parseYaml = (yamlString: string): Record<string, any> => {
  if (typeof yamlString !== "string" || !yamlString) {
    throw new Error(`YAML string is invalid: ${typeof yamlString}`);
  }

  const yamlLines = stripLeadingWhitespace(yamlString).split("\n");
  // console.dir({ yamlLines });
  const result: Record<string, any> = {};

  yamlLines.forEach((line) => {
    const [key, ...valueParts] = line.split(":").map((str) => str.trim());

    // Handle cases where the value might contain colons
    const value = valueParts.join(":").trim();

    if (key && value) {
      const trimmedKey = key.trim();

      // Keywords
      if (normalizeString(trimmedKey).includes("keyword")) {
        if (value.includes(",")) {
          const splitKeywords = value.split(",");
          result[trimmedKey] = splitKeywords.map((kw) => normalizeString(kw.replace(/[\"|\']+/g, ""))).filter((kw) => kw); // Remove empty strings
        } else {
          result[trimmedKey] = [normalizeString(value.replace(/[\"|\'|\,]+/g, ""))].filter((kw) => kw);
        }
      }

      // URL slug
      else if (normalizeString(trimmedKey).includes("slug")) {
        const slug = stripQuotes(value);
        if (slug) {
          result[trimmedKey] = slugify(slug);
        } else {
          result[trimmedKey] = "";
        }
      }

      // Date
      else if (/date|created_at|createdat|creation_date/i.test(normalizeString(trimmedKey))) {
        const formattedDate = formatDate(value);
        if (formattedDate !== null) {
          result[trimmedKey] = formattedDate;
        } else {
          const numberValue = parseFloat(stripQuotes(value));
          result[trimmedKey] = isNaN(numberValue) ? value : numberValue;
        }
      }

      // All other YAML keys
      else {
        try {
          const parsedNum = parseFloat(stripQuotes(value));
          if (isNaN(parsedNum)) {
            result[trimmedKey] = stripQuotes(value);
          } else {
            result[trimmedKey] = parsedNum;
          }
        } catch (err) {
          result[trimmedKey] = stripQuotes(value);
        }
      }
    }
  });

  return result;
};

/**
 * Parses metadata from a markdown string containing YAML front matter.
 * - Extracts and parses the YAML block.
 *
 * @param {string} markdown Markdown string containing YAML front matter.
 * @returns {Record<string, any>} Parsed metadata object.
 */
export const parseMetadata = (markdown: string): Record<string, any> => {
  if (!markdown || typeof markdown !== "string") {
    return {};
  }

  const lines = stripLeadingWhitespace(markdown).split("\n");
  // console.dir({ lines });

  const metadataBlock: string[] = [];

  let metadata: Record<string, any> = {};
  let inMetadata = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect start of YAML front matter
    if (line === "---" && i === 0) {
      inMetadata = true;
      continue;
    }

    // Detect end of YAML front matter
    if (line === "---" && inMetadata) {
      inMetadata = false;
      metadata = parseYaml(metadataBlock.join("\n"));
      break;
    }

    if (inMetadata) {
      // console.log(line);
      metadataBlock.push(line);
    }
  }

  return metadata;
};
