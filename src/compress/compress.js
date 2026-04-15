/**
 * compress.js — utilities for compressing and decompressing snapshot data
 * Uses zlib under the hood for gzip-based compression.
 */

const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Compresses a snapshot object into a gzipped Buffer.
 * @param {object} snapshot
 * @returns {Promise<Buffer>}
 */
async function compressSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('compressSnapshot: snapshot must be a non-null object');
  }
  const json = JSON.stringify(snapshot);
  const compressed = await gzip(Buffer.from(json, 'utf8'));
  return compressed;
}

/**
 * Decompresses a gzipped Buffer back into a snapshot object.
 * @param {Buffer} buffer
 * @returns {Promise<object>}
 */
async function decompressSnapshot(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('decompressSnapshot: input must be a Buffer');
  }
  const decompressed = await gunzip(buffer);
  const json = decompressed.toString('utf8');
  return JSON.parse(json);
}

/**
 * Returns the compression ratio (compressed / original) as a float.
 * Lower is better.
 * @param {object} snapshot
 * @returns {Promise<number>}
 */
async function compressionRatio(snapshot) {
  const original = Buffer.byteLength(JSON.stringify(snapshot), 'utf8');
  const compressed = await compressSnapshot(snapshot);
  return compressed.length / original;
}

module.exports = { compressSnapshot, decompressSnapshot, compressionRatio };
