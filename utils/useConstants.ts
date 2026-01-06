import getFile from "~/utils/getFile";
interface ImageData {
  id: string;
  src: string;
  alt: string;
}

async function getAllConstants() {
  const options = await getFile("general", "options", "text");
  return parseOptionsToConstants(options);
}

function parseOptionsToConstants(optionsText: string) {
  const lines = optionsText
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));
  const constants: any = {};
  const constantsWithVariables: Array<{keys: string[], value: string}> = [];

  // First pass: parse constants without variables
  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (!key || valueParts.length === 0) continue;

    const value = valueParts.join(":").trim();
    const keyParts = key.trim().split(".");

    // Check if value contains variable references
    if (value.includes("{") && value.includes("}")) {
      constantsWithVariables.push({ keys: keyParts, value });
    } else {
      setNestedValue(constants, keyParts, value);
    }
  }

  // Second pass: resolve constants with variables
  for (const { keys, value } of constantsWithVariables) {
    const resolvedValue = resolveVariables(value, constants);
    setNestedValue(constants, keys, resolvedValue);
  }

  return transformConstants(constants);
}

function setNestedValue(obj: any, keys: string[], value: string) {
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

function transformConstants(constants: any) {
  const result: any = {};

  const hasIntegerKeys = (obj: any) => {
    if (!obj || typeof obj !== "object") return false;
    return Object.keys(obj).every((key) => /^\d+$/.test(key));
  };

  const transformToArray = (obj: any) => {
    const arr = [];
    for (const [key, value] of Object.entries(obj)) {
      arr[parseInt(key) - 1] = value;
    }
    return arr;
  };

  const processObject = (obj: any) => {
    if (!obj || typeof obj !== "object") return obj;

    if (hasIntegerKeys(obj)) {
      return transformToArray(obj);
    }

    const processed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = processObject(value);
    }
    return processed;
  };

  const processedConstants = processObject(constants);

  return processedConstants;
}

function resolveVariables(value: string, constants: any): string {
  return value.replace(/\{([^}]+)\}/g, (match, path) => {
    const keys = path.split(".");
    let current = constants;
    
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // If variable not found, return the original placeholder
        return match;
      }
    }
    
    return typeof current === "string" ? current : match;
  });
}

export default async function useConstants() {
  const { data: constants } = await useAsyncData(
    "site-constants",
    () => getAllConstants(),
    {
      server: true,
      lazy: false,
    },
  );
  return constants;
}
