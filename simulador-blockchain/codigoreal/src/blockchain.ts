import { sha256 } from 'js-sha256';

// --- LAS REGLAS DEL JUEGO EVOLUCIONADAS ---

// Una transacción: Cuando alguien le pasa plata a otro.
export interface Transaction {
  from: string; // El que paga (su dirección)
  to: string;   // El que recibe (su dirección)
  amount: number; // Cuánta plata estamos moviendo
  timestamp: number; // El momento exacto del trato
}

// Una billetera: Tu cuenta para guardar los Be Rich Fast coins.
export interface Wallet {
  address: string; // Tu número de cuenta público (puedes dárselo a cualquiera)
  privateKey: string; // Tu llave secreta (si la pierdes, pailas con tu dinero)
  balance: number; // Lo que tienes en el saldo ahora mismo
}

// El Bloque: Es como una página de un libro contable que nadie puede borrar.
export interface Block {
  index: number;        // El número de la página (0, 1, 2...)
  timestamp: number;    // Cuándo se cerró este bloque
  data: string;         // Aquí metemos los recibos (las transacciones) en formato texto
  previousHash: string; // El sello del bloque de atrás. Si el de atrás cambia, este también se rompe.
  hash: string;         // El sello único de ESTE bloque. Es su ADN.
  nonce: number;        // Un número que probamos a lo loco hasta que el sello sale bonito (con ceros).
  difficulty: number;   // Cuántos ceros pedimos. Más ceros = más sudor para el procesador.
  reward: number;       // El premio que se lleva el minero por trabajar.
  miner: string;        // La dirección del afortunado que minó el bloque.
  attempts?: number;    // CURIOSIDAD: ¿Cuántos intentos nos tomó encontrar esto?
  // INNOVACIÓN: El sello circular que amarra todas las transacciones entre sí
  ringHash?: string; 
}

// --- UTILIDADES ---

// Crea una billetera de la nada. Te da una dirección y una llave.
export const generateWallet = (): Wallet => {
  const randomString = Math.random().toString(36).substring(2, 15);
  const address = "0x" + sha256(randomString).substring(0, 40); // Hacemos un hash para que parezca profesional
  return {
    address,
    privateKey: randomString,
    balance: 0
  };
};

// NUEVO: El Anillo de Entrelazamiento (Circular Transaction Hashing)
// Si cambias una sola transacción, el anillo entero se rompe porque cada una depende de la siguiente y la última de la primera.
export const calculateRingHash = (transactions: Transaction[]): string => {
  if (transactions.length === 0) return sha256("EMPTY_RING");
  
  let ringData = "";
  for (let i = 0; i < transactions.length; i++) {
    const current = transactions[i];
    const next = transactions[(i + 1) % transactions.length]; // El "Enlace Circular"
    ringData += sha256(JSON.stringify(current) + JSON.stringify(next));
  }
  return sha256(ringData);
};

// El Triturador (Hash): Metes los datos del bloque y te da un sello único de 64 letras y números.
export const calculateHash = (
  index: number,
  timestamp: number,
  data: string,
  previousHash: string,
  nonce: number,
  difficulty: number,
  reward: number,
  miner: string,
  ringHash: string = "" // Incluimos el anillo en el ADN del bloque
): string => {
  return sha256(`${index}${timestamp}${data}${previousHash}${nonce}${difficulty}${reward}${miner}${ringHash}`);
};

// El Bloque Génesis: El bloque 0. El que empezó todo. No tiene bloques atrás.
export const createGenesisBlock = (minerAddress: string): Block => {
  // Le regalamos 1000 monedas al primer valiente para que el sistema arranque.
  const genesisTx: Transaction = { from: "SYSTEM", to: minerAddress, amount: 1000, timestamp: Date.now() };
  const genesisData = JSON.stringify([genesisTx]);
  const ringHash = calculateRingHash([genesisTx]);
  const difficulty = 2;
  let nonce = 0;
  const timestamp = Date.now();
  const previousHash = "0".repeat(64); // No hay nada antes, así que ponemos ceros.
  let hash = "";
  const target = "0".repeat(difficulty);

  // Buscamos el sello válido
  while (true) {
    hash = calculateHash(0, timestamp, genesisData, previousHash, nonce, difficulty, 0, minerAddress, ringHash);
    if (hash.startsWith(target)) break;
    nonce++;
  }

  return {
    index: 0,
    timestamp,
    data: genesisData,
    previousHash,
    hash,
    nonce,
    difficulty, 
    reward: 0,
    miner: minerAddress,
    attempts: nonce,
    ringHash
  };
};

// Minar: El trabajo sucio.
export const mineBlock = (
  index: number,
  data: string,
  previousHash: string,
  difficulty: number,
  minerAddress: string,
  method: "incremental" | "random" = "incremental",
  onProgress?: (nonce: number) => void
): Promise<Block> => {
  return new Promise((resolve) => {
    const timestamp = Date.now();
    let nonce = method === "incremental" ? 0 : Math.floor(Math.random() * 1000000);
    let attempts = 0;
    const target = "0".repeat(difficulty);
    
    // Calculamos el Ring Hash antes de minar
    let txs: Transaction[] = [];
    try { txs = JSON.parse(data); } catch(e) {}
    const ringHash = calculateRingHash(txs);

    let reward = 0;
    if (Array.isArray(txs)) {
      const totalSent = txs.reduce((acc, tx) => acc + tx.amount, 0);
      reward = totalSent * 0.1; // 10% de lo mandado
    }

    const step = () => {
      const chunkSize = 500;
      for (let i = 0; i < chunkSize; i++) {
        const hash = calculateHash(index, timestamp, data, previousHash, nonce, difficulty, reward, minerAddress, ringHash);
        
        if (hash.startsWith(target)) {
          resolve({
            index,
            timestamp,
            data,
            previousHash,
            hash,
            nonce,
            difficulty,
            reward,
            miner: minerAddress,
            attempts: attempts + i + 1,
            ringHash
          });
          return;
        }

        if (method === "incremental") {
            nonce++;
        } else {
            nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }
      }
      
      attempts += chunkSize;
      if (onProgress) onProgress(nonce);
      setTimeout(step, 0);
    };

    setTimeout(step, 0);
  });
};

// El Contable: Revisa toda la historia de la cadena.
export const getBalances = (chain: Block[]): Record<string, number> => {
  const balances: Record<string, number> = {};

  chain.forEach(block => {
    if (block.miner) {
      balances[block.miner] = (balances[block.miner] || 0) + block.reward;
    }

    try {
      const transactions: Transaction[] = JSON.parse(block.data);
      if (Array.isArray(transactions)) {
        transactions.forEach(tx => {
          if (tx.from !== "SYSTEM") {
            balances[tx.from] = (balances[tx.from] || 0) - tx.amount;
          }
          balances[tx.to] = (balances[tx.to] || 0) + tx.amount;
        });
      }
    } catch (e) {}
  });

  return balances;
};

// El Ajustador: Decide si el juego está muy fácil o muy difícil.
export const adjustDifficulty = (lastBlock: Block, currentTime: number): number => {
  const MINE_RATE = 3000;
  const timeTaken = currentTime - lastBlock.timestamp;

  if (timeTaken < MINE_RATE) {
    return lastBlock.difficulty + 1;
  } else if (timeTaken > MINE_RATE * 2) {
    return Math.max(1, lastBlock.difficulty - 1);
  }
  return lastBlock.difficulty;
};

// El Detective: Mira si un bloque es legal.
export const isValidBlock = (block: Block, previousBlock: Block | null): boolean => {
  if (!previousBlock) {
      return block.index === 0 && block.previousHash === "0".repeat(64);
  }

  if (block.index !== previousBlock.index + 1) return false;
  if (block.previousHash !== previousBlock.hash) return false;
  
  const target = "0".repeat(block.difficulty);
  if (!block.hash.startsWith(target)) return false;

  // Validación del Anillo de Entrelazamiento
  let txs: Transaction[] = [];
  try { txs = JSON.parse(block.data); } catch(e) {}
  const expectedRingHash = calculateRingHash(txs);
  if (block.ringHash && block.ringHash !== expectedRingHash) return false;

  const recalculatedHash = calculateHash(
    block.index,
    block.timestamp,
    block.data,
    block.previousHash,
    block.nonce,
    block.difficulty,
    block.reward,
    block.miner,
    block.ringHash || ""
  );

  return recalculatedHash === block.hash;
};
