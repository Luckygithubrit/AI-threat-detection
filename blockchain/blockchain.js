// ============================================================
// blockchain/blockchain.js
// SHA-256 based immutable logging
// ============================================================

const crypto = require('crypto');

// In-memory blockchain chain (in production, persist to DB)
const chain = [];

/**
 * Generate SHA-256 hash of data string
 */
function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create a new block and add to chain
 */
function addBlock(data) {
  const previousHash = chain.length > 0 ? chain[chain.length - 1].hash : '0';
  const timestamp    = new Date().toISOString();
  const blockData    = JSON.stringify({ data, previousHash, timestamp });
  const hash         = generateHash(blockData);

  const block = { index: chain.length, timestamp, data, previousHash, hash };
  chain.push(block);
  return block;
}

/**
 * Verify entire chain integrity
 */
function verifyChain() {
  for (let i = 1; i < chain.length; i++) {
    const current  = chain[i];
    const previous = chain[i - 1];
    const recomputed = generateHash(
      JSON.stringify({ data: current.data, previousHash: current.previousHash, timestamp: current.timestamp })
    );
    if (current.hash !== recomputed)       return false;
    if (current.previousHash !== previous.hash) return false;
  }
  return true;
}

/**
 * Get entire chain
 */
function getChain() {
  return chain;
}

module.exports = { generateHash, addBlock, verifyChain, getChain };
