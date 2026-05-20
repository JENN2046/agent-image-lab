"use strict";

const YAML = require("yaml");

function parseYamlDocument(text) {
  return YAML.parse(text);
}

function parseRegistryRows(registryText, registryKey, listKey, idField) {
  const document = parseYamlDocument(registryText);
  const registry = document && document[registryKey];
  if (!registry || !Array.isArray(registry[listKey])) return [];
  return registry[listKey].map((entry) => ({
    [idField]: entry && entry[idField],
    data: entry || {},
    block: YAML.stringify(entry || {}).trim(),
  }));
}

function scalar(row, field) {
  const value = row && row.data ? row.data[field] : null;
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function stringList(row, field) {
  const value = row && row.data ? row.data[field] : null;
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

function countRowsById(rows, idField, id) {
  return rows.filter((row) => row[idField] === id).length;
}

module.exports = {
  parseYamlDocument,
  parseRegistryRows,
  scalar,
  stringList,
  countRowsById,
};
