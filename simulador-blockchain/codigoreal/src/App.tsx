import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { type Block, type Wallet, type Transaction, calculateHash, createGenesisBlock, mineBlock, isValidBlock, generateWallet, getBalances, adjustDifficulty } from './blockchain';
import { Trash2, ShieldAlert, Plus, ArrowRightLeft, Pickaxe, Activity, BrainCircuit, Hammer, Wallet as WalletIcon, Network, ChevronDown, Check, Zap, Cpu, ShieldCheck, Fingerprint, Radio } from 'lucide-react';

// --- COMPONENTS ---

const IdentitySelector = ({ 
    wallets, 
    selectedIndex, 
    onSelect, 
    onCreate 
}: { 
    wallets: Wallet[], 
    selectedIndex: number, 
    onSelect: (idx: number) => void,
    onCreate: () => void 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentWallet = wallets[selectedIndex];

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                className="inline-flex items-center gap-4 bg-gold-900/10 border border-gold-900/30 px-6 py-3 rounded-full hover:border-gold-500/50 hover:bg-gold-900/20 transition-all cursor-pointer group min-w-[300px]"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                    {selectedIndex + 1}
                </div>
                <div className="text-left flex-1 min-w-0">
                    <div className="text-sm font-bold text-gold-100 font-tech truncate">{currentWallet.address}</div>
                    <div className="text-[10px] text-gold-600 group-hover:text-gold-400 font-luxury uppercase tracking-widest">
                        {isOpen ? "Select Identity" : "Active Identity"}
                    </div>
                </div>
                <ChevronDown size={14} className={clsx("text-gold-700 transition-transform duration-300", isOpen && "rotate-180")}/>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-full min-w-[320px] origin-top-right rounded-md bg-black border border-gold-900/50 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
                    >
                        <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gold-900">
                            {wallets.map((wallet, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { onSelect(idx); setIsOpen(false); }}
                                    className={clsx(
                                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                                        selectedIndex === idx ? "bg-gold-900/30 border-l-2 border-gold-500" : "hover:bg-gold-900/10 border-l-2 border-transparent"
                                    )}
                                >
                                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 font-bold shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={clsx("text-xs font-tech truncate", selectedIndex === idx ? "text-gold-300" : "text-neutral-400")}>
                                            {wallet.address}
                                        </div>
                                    </div>
                                    {selectedIndex === idx && <Check size={12} className="text-gold-500"/>}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-gold-900/30 p-2 bg-neutral-900/50">
                            <button 
                                onClick={() => { onCreate(); setIsOpen(false); }}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold-900/20 px-4 py-2 text-[10px] uppercase tracking-widest text-gold-500 hover:bg-gold-900/40 hover:text-gold-300 transition-all font-bold"
                            >
                                <Plus size={12}/> Create New Wallet
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BlockNode = ({ block, prevHash, onUpdate, onDelete, isGenesis }: { 
    block: Block, prevHash: string, onUpdate: (b: Block) => void, onDelete: (idx: number) => void, isGenesis: boolean 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mining, setMining] = useState(false);
  const [data, setData] = useState(block.data);
  const [nonce, setNonce] = useState(block.nonce);
  const [timestamp, setTimestamp] = useState(block.timestamp);
  const [difficulty, setDifficulty] = useState(block.difficulty);
  const [previousHash, setPreviousHash] = useState(block.previousHash);
  const [miner, setMiner] = useState(block.miner);

  const currentHash = calculateHash(block.index, timestamp, data, previousHash, nonce, difficulty, block.reward, miner, block.ringHash);
  const target = "0".repeat(difficulty);
  const isPoWValid = currentHash.startsWith(target);
  const isLinkValid = previousHash === prevHash;

  useEffect(() => {
    if(!isEditing) {
        setData(block.data);
        setNonce(block.nonce);
        setTimestamp(block.timestamp);
        setDifficulty(block.difficulty);
        setPreviousHash(block.previousHash);
        setMiner(block.miner);
    }
  }, [block, isEditing]);

  const handleRepair = async () => {
    setMining(true);
    const repairBlock = async () => {
        let localNonce = 0;
        const start = Date.now();
        let found = false;
        while (Date.now() - start < 5000) {
            const h = calculateHash(block.index, timestamp, data, previousHash, localNonce, difficulty, block.reward, miner, block.ringHash);
            if(h.startsWith(target)) {
                setNonce(localNonce);
                onUpdate({ ...block, data, nonce: localNonce, timestamp, difficulty, previousHash, hash: h, miner });
                found = true;
                break;
            }
            localNonce++;
        }
        setMining(false);
        if(!found) alert("Too hard! Lower the difficulty.");
    };
    setTimeout(repairBlock, 100);
  };

  const handleSave = () => {
     const h = calculateHash(block.index, timestamp, data, previousHash, nonce, difficulty, block.reward, miner, block.ringHash);
     onUpdate({ ...block, data, nonce, timestamp, difficulty, previousHash, hash: h, miner });
     setIsEditing(false);
  };

  let parsedData = null;
  try { parsedData = JSON.parse(data); } catch(e) {}

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={clsx(
            "relative w-[480px] shrink-0 p-6 flex flex-col gap-4 transition-all duration-500 rounded-lg backdrop-blur-md border",
            (!isPoWValid || !isLinkValid) 
                ? "border-red-900/50 bg-red-950/20 shadow-[0_0_30px_rgba(220,38,38,0.2)]" 
                : "border-gold-500/30 bg-black/80 shadow-[0_0_20px_rgba(212,165,40,0.1)] hover:shadow-[0_0_30px_rgba(212,165,40,0.2)] hover:border-gold-400/50"
    )}>
        <div className="flex justify-between items-start border-b border-gold-900/30 pb-3 font-luxury">
            <div>
                <span className="text-[9px] text-gold-600/70 uppercase tracking-[0.2em] block mb-1">BLOCK HEIGHT</span>
                <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-500 drop-shadow-sm">
                    #{String(block.index).padStart(3,'0')}
                </span>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
                 {!isEditing ? (
                    <div className="flex gap-2">
                        {!isGenesis && (
                            <button onClick={() => onDelete(block.index)} className="text-gold-800 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        )}
                        <button onClick={() => setIsEditing(true)} className="text-[9px] text-gold-500 hover:text-gold-300 uppercase tracking-widest border border-gold-900/50 px-2 py-1 rounded hover:bg-gold-900/20 transition-all">[EDIT]</button>
                    </div>
                 ) : (
                    <div className="flex gap-2">
                        <button onClick={handleRepair} disabled={mining} className={clsx("text-[9px] uppercase tracking-widest px-2 py-1 rounded border", mining ? "text-neutral-500 border-neutral-800" : "text-blue-400 border-blue-900/50 animate-pulse bg-blue-900/10")}>
                            {mining ? "MINING..." : "REPAIR"}
                        </button>
                        <button onClick={handleSave} className="text-[9px] text-emerald-400 border border-emerald-900/50 bg-emerald-900/10 px-2 py-1 rounded hover:bg-emerald-900/20 uppercase tracking-widest">SAVE</button>
                    </div>
                 )}
            </div>
        </div>

        <div className="flex flex-col gap-4 font-tech">
            <div className="space-y-1">
                <label className="text-[9px] text-gold-700 uppercase tracking-widest">LEDGER DATA</label>
                {isEditing ? (
                    <textarea value={data} onChange={e => setData(e.target.value)} className="w-full bg-black/50 border border-gold-900/30 p-3 text-xs text-gold-100 h-28 focus:outline-none focus:border-gold-500/50 focus:shadow-[0_0_10px_rgba(212,165,40,0.2)] transition-all rounded-sm font-tech"/>
                ) : (
                    <div className="w-full bg-black/40 border border-gold-900/20 p-3 text-[10px] text-gold-200/80 h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gold-900">
                        {Array.isArray(parsedData) ? (
                            <div className="space-y-2">
                                {parsedData.map((tx: Transaction, i: number) => (
                                    <div key={i} className="flex gap-3 border-b border-gold-900/20 pb-2 last:border-0 items-center">
                                        <span className="text-gold-500">◈</span>
                                        <div className="flex-1 truncate">
                                            <span className="text-gold-600">{tx.from === "SYSTEM" ? "CENTRAL BANK" : tx.from.substring(0,6) + "..."}</span>
                                            <span className="text-neutral-600 mx-2 text-[8px]">➜</span>
                                            <span className="text-gold-300">{tx.to.substring(0,6)}...</span>
                                        </div>
                                        <span className="text-emerald-400 font-bold">{tx.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : block.data}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gold-900/5 p-3 rounded border border-gold-900/10">
                <div>
                    <label className="text-[8px] text-gold-700 uppercase tracking-widest block mb-1">MINER ID</label>
                    <div className="text-[10px] text-purple-300 truncate font-bold" title={block.miner}>
                        {block.miner ? (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                {block.miner.substring(0, 10)}...
                            </span>
                        ) : "GENESIS_GHOST"}
                    </div>
                </div>
                <div>
                    <label className="text-[8px] text-gold-700 uppercase tracking-widest block mb-1">RING STATUS</label>
                    <div className="text-[10px] text-gold-400 font-bold flex items-center gap-1">
                        <Zap size={10} className="text-gold-500" />
                        {block.ringHash ? "ENTANGLED" : "CLASSIC"}
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                 <div className="flex justify-between items-end">
                    <label className="text-[9px] text-gold-800 uppercase tracking-widest">BLOCK HASH</label>
                    {!isPoWValid && <span className="text-[9px] text-red-500 font-bold bg-red-950/50 px-1 rounded animate-pulse">INVALID PROOF</span>}
                </div>
                <div className={clsx("text-[9px] break-all p-2 rounded border font-tech transition-colors shadow-inner", isPoWValid ? "text-gold-300 border-gold-800/30 bg-gold-900/5" : "text-red-400 border-red-900/50 bg-red-900/10")}>
                    {block.hash}
                </div>
            </div>
        </div>
    </motion.div>
  );
};

const MempoolNode = ({ transactions, onMine, isMining, prevHash }: { transactions: Transaction[], onMine: () => void, isMining: boolean, prevHash: string }) => {
    const totalAmount = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const reward = totalAmount * 0.1;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} className="relative w-[480px] shrink-0 p-6 flex flex-col gap-4 border border-dashed border-gold-500/30 bg-black/40 rounded-lg shadow-[0_0_20px_rgba(212,165,40,0.05)]">
            <div className="absolute -top-3 left-6 bg-black px-2 text-[9px] text-gold-500 uppercase tracking-[0.2em] border border-gold-900/50 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></div>
                Pending Block
            </div>
            <div className="flex justify-between items-start border-b border-dashed border-gold-900/30 pb-3 font-luxury opacity-70">
                <div>
                    <span className="text-[9px] text-gold-600/50 uppercase tracking-[0.2em] block mb-1">TARGET HEIGHT</span>
                    <span className="text-2xl text-gold-700/50">NEXT</span>
                </div>
            </div>
            <div className="flex-1 min-h-[100px] flex flex-col gap-2">
                <label className="text-[9px] text-gold-700 uppercase tracking-widest">TRANSACTIONS QUEUE</label>
                <div className="w-full bg-black/40 border border-gold-900/10 p-3 text-[10px] text-gold-200/80 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gold-900/50">
                    <div className="space-y-2">
                        {transactions.map((tx, i) => (
                            <div key={i} className="flex gap-3 border-b border-gold-900/10 pb-2 last:border-0 items-center">
                                <span className="text-gold-500/50">◈</span>
                                <div className="flex-1 truncate opacity-70">
                                    <span className="text-gold-600">{tx.from === "SYSTEM" ? "CENTRAL BANK" : tx.from.substring(0,6) + "..."}</span>
                                    <span className="text-neutral-600 mx-2 text-[8px]">➜</span>
                                    <span className="text-gold-300">{tx.to.substring(0,6)}...</span>
                                </div>
                                <span className="text-emerald-400/70 font-bold">{tx.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gold-900/30">
                 <button onClick={onMine} disabled={isMining} className="relative w-full overflow-hidden py-4 bg-gradient-to-r from-gold-900 to-gold-800 text-gold-100 text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 font-bold hover:from-gold-700 hover:to-gold-600 hover:text-black hover:shadow-[0_0_20px_rgba(212,165,40,0.2)] rounded-sm group disabled:opacity-50 disabled:cursor-wait">
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {isMining ? <Pickaxe size={14} className="animate-spin"/> : <Hammer size={14} className="fill-current"/>}
                    {isMining ? "FINDING NONCE..." : `SEAL BLOCK (REWARD: ${reward.toFixed(2)})`}
                 </button>
            </div>
        </motion.div>
    );
}

const ConsensusView = ({ 
    pendingBlock, 
    onFinalize 
}: { 
    pendingBlock: Block | null, 
    onFinalize: (block: Block) => void 
}) => {
    const [resonance, setResonance] = useState(0); 
    const [isInfected, setIsInfected] = useState(false);
    const [isForging, setIsForging] = useState(false);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>(["SYSTEM READY: AWAITING FORGE COMMAND..."]);
    const [nodes, setNodes] = useState([
        { id: 'ALPHA', role: 'Integrity Warden', status: 'idle', desc: 'Verifies the circular links between each transaction in the Ring.' },
        { id: 'SIGMA', role: 'Hash Sync', status: 'idle', desc: 'Synchronizes local hash calculations with the rest of the network.' },
        { id: 'OMEGA', role: 'Final Sealer', status: 'idle', desc: 'Executes the final cryptographic seal once resonance reaches 100%.' },
    ]);

    if (!pendingBlock) return (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 z-10 font-tech">
             <Radio size={48} className="text-gold-900 mb-4 animate-pulse" />
             <h2 className="font-luxury text-gold-700 tracking-[0.4em] uppercase text-xl">Chamber Idle</h2>
             <p className="text-[10px] text-neutral-600 mt-2 tracking-widest uppercase">Waiting for mined data from the Live Network</p>
        </div>
    );

    let transactions: Transaction[] = [];
    try { transactions = JSON.parse(pendingBlock.data); } catch(e) {}

    const addLog = (msg: string) => {
        setLogs(prev => [msg, ...prev].slice(0, 8));
    };

    const startConsensus = () => {
        if (isInfected) {
            addLog("CRITICAL: CONSENSUS ABORTED - RING CORRUPTION DETECTED");
            return alert("SECURITY BREACH: Ring integrity compromised!");
        }
        setIsForging(true);
        addLog("INITIATING RESONANCE FIELD...");
        
        let step = 0;
        const interval = setInterval(() => {
            if (step === 0) {
                setNodes(n => n.map((node, i) => i === 0 ? {...node, status: 'verifying'} : node));
                addLog("ALPHA: VALIDATING CIRCULAR LINKS...");
            }
            if (step === 10) {
                setNodes(n => n.map((node, i) => i === 1 ? {...node, status: 'verifying'} : node));
                addLog("SIGMA: BROADCASTING HASH PROOF...");
            }
            if (step === 20) {
                setNodes(n => n.map((node, i) => i === 2 ? {...node, status: 'verifying'} : node));
                addLog("OMEGA: PREPARING CRYPTO-SEAL...");
            }
            
            if (step >= 30 && step < 100) {
                setResonance(prev => Math.min(prev + 2, 100));
                setNodes(n => n.map(node => ({...node, status: 'resonating'})));
                if (step % 20 === 0) addLog(`RESONANCE FIELD AT ${Math.floor(step)}%...`);
            }

            if (step === 100) {
                clearInterval(interval);
                setNodes(n => n.map(node => ({...node, status: 'synced'})));
                addLog("CONSENSUS REACHED: BLOCK FINALIZED");
                setTimeout(() => onFinalize(pendingBlock), 1500);
            }
            step++;
        }, 40);
    };

    const handleInfect = () => {
        setIsInfected(true);
        setNodes(n => n.map(node => ({...node, status: 'breach'})));
        setResonance(0);
        setIsForging(false);
        addLog("!!! ALERT: EXTERNAL ATTACK DETECTED !!!");
        addLog("ERROR: TX#1 DATA MODIFIED -> RING_HASH COLLISION");
    };

    const handleRepair = () => {
        setIsInfected(false);
        setNodes(n => n.map(node => ({...node, status: 'idle'})));
        addLog("RESTORING RING INTEGRITY...");
        addLog("RECALCULATING ENTANGLED HASH... SUCCESS");
    };

    return (
        <div className={clsx(
            "flex-1 flex overflow-hidden z-10 transition-colors duration-1000",
            isInfected ? "bg-red-950/10" : "bg-transparent"
        )}>
            {/* LEFT SIDE: LIVE TERMINAL */}
            <aside className="w-80 border-r border-gold-900/20 bg-black/40 backdrop-blur p-6 flex flex-col font-tech">
                <div className="flex items-center gap-2 mb-6 border-b border-gold-900/30 pb-4">
                    <Activity size={14} className="text-gold-500 animate-pulse" />
                    <h3 className="text-[10px] uppercase tracking-widest text-gold-200">Consensus Log</h3>
                </div>
                <div className="flex-1 space-y-4 overflow-hidden">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div 
                                key={i + log}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1 - (i * 0.12), x: 0 }}
                                className={clsx("text-[9px] leading-relaxed", log.includes("!!!") ? "text-red-500 font-bold" : "text-gold-600")}
                            >
                                <span className="text-[8px] opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="mt-6 pt-6 border-t border-gold-900/30">
                    <div className="text-[8px] text-gold-800 uppercase mb-2 tracking-widest">Protocol Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div className="text-neutral-600">Algo: <span className="text-gold-500">P.o.R</span></div>
                        <div className="text-neutral-600">Ring: <span className="text-gold-500">Entangled</span></div>
                    </div>
                </div>
            </aside>

            {/* CENTER: THE CHAMBER */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
                
                {/* EDUCATIONAL TOOLTIP (FLOAT) */}
                <AnimatePresence>
                    {hoveredNode && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-10 right-10 w-64 bg-black/90 border border-gold-500/50 p-4 rounded shadow-2xl z-50 pointer-events-none"
                        >
                            <div className="text-gold-500 text-[10px] font-luxury uppercase tracking-widest mb-1">
                                {nodes.find(n => n.id === hoveredNode)?.id} — {nodes.find(n => n.id === hoveredNode)?.role}
                            </div>
                            <div className="text-neutral-400 text-[9px] font-tech leading-relaxed">
                                {nodes.find(n => n.id === hoveredNode)?.desc}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    animate={isInfected ? { x: [-2, 2, -2, 2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="relative w-full max-w-4xl flex flex-col items-center"
                >
                    {/* RING VISUALIZER */}
                    <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: isInfected ? [1, 1.1, 0.9, 1] : [1, 1.05, 1], rotate: isInfected ? [0, 5, -5, 0] : 360 }}
                            transition={{ duration: isInfected ? 0.2 : 20, repeat: Infinity, ease: "linear" }}
                            className={clsx(
                                "absolute w-56 h-56 rounded-full border backdrop-blur-3xl flex flex-col items-center justify-center z-10 transition-colors duration-500",
                                isInfected ? "border-red-500 bg-red-900/10 shadow-[0_0_50px_rgba(220,38,38,0.4)]" : "border-gold-500/20 bg-gold-900/5"
                            )}
                        >
                            {isInfected ? <ShieldAlert size={48} className="text-red-500 animate-pulse" /> : <Fingerprint size={40} className="text-gold-500 mb-2 opacity-80" />}
                            <span className={clsx("text-[8px] font-luxury tracking-[0.3em]", isInfected ? "text-red-400" : "text-gold-500")}>
                                {isInfected ? "RING BROKEN" : "ENTANGLED HUB"}
                            </span>
                            <div className="mt-2 text-[7px] font-tech text-neutral-600 bg-black/50 px-2 py-1 rounded">
                                {isInfected ? "DATA_COLLISION" : "ACTIVE_SYNC"}
                            </div>
                        </motion.div>

                        {transactions.map((tx, i) => {
                            const angle = (i * 360) / transactions.length;
                            return (
                                <motion.div
                                    key={i}
                                    style={{ transform: `rotate(${angle}deg) translateY(-180px) rotate(-${angle}deg)` }}
                                    className={clsx(
                                        "absolute bg-black/90 border p-3 rounded shadow-2xl z-20 transition-all duration-500 group cursor-help",
                                        isInfected && i === 0 ? "border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] bg-red-900/20" : "border-gold-500/20"
                                    )}
                                >
                                    <div className={clsx("text-[7px] mb-1 font-tech uppercase", isInfected && i === 0 ? "text-red-400" : "text-gold-700")}>
                                        {isInfected && i === 0 ? "MALICIOUS TX" : `TX NODE #${i}`}
                                    </div>
                                    <div className={clsx("text-[10px] font-bold", isInfected && i === 0 ? "text-red-500" : "text-gold-100")}>
                                        {isInfected && i === 0 ? "999,999.00" : tx.amount.toFixed(2)}
                                    </div>
                                </motion.div>
                            );
                        })}

                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <motion.circle 
                                cx="225" cy="225" r="180" 
                                fill="none" stroke={isInfected ? "rgba(220,38,38,0.5)" : "rgba(212,165,40,0.3)"} 
                                strokeWidth="2" 
                                strokeDashoffset={1130 - (1130 * resonance / 100)} 
                                strokeDasharray="1130" 
                                className={clsx(isInfected ? "drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" : "drop-shadow-[0_0_10px_rgba(212,165,40,0.5)]")}
                            />
                        </svg>
                    </div>

                    {/* INTERACTIVE NODES */}
                    <div className="mt-8 flex gap-12 z-30">
                        {nodes.map((node) => (
                            <div 
                                key={node.id} 
                                className="flex flex-col items-center gap-4 cursor-pointer"
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                <div className={clsx(
                                    "w-16 h-16 rounded-2xl border flex flex-col items-center justify-center transition-all duration-700 relative z-10",
                                    node.status === 'idle' ? "bg-black/80 border-gold-900/30 text-gold-900" :
                                    node.status === 'verifying' ? "bg-gold-900/20 border-gold-400 text-gold-400 scale-110" :
                                    node.status === 'resonating' ? "bg-gold-500 border-black text-black scale-105" :
                                    node.status === 'breach' ? "bg-red-950/40 border-red-500 text-red-500" :
                                    "bg-emerald-500 border-black text-black"
                                )}>
                                    {node.status === 'synced' ? <ShieldCheck size={28} /> : 
                                     node.status === 'breach' ? <ShieldAlert size={28} /> : <Cpu size={24} />}
                                </div>
                                <div className="text-center">
                                    <div className={clsx("text-[10px] font-luxury tracking-[0.2em]", node.status === 'breach' ? "text-red-500" : "text-gold-500")}>{node.id}</div>
                                    <div className="text-[7px] text-neutral-600 uppercase mt-1 font-tech font-bold tracking-widest">{node.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CONTROLS */}
                    <div className="mt-12 flex gap-4 w-full max-w-md">
                        {resonance === 0 && !isForging ? (
                            <>
                                {!isInfected ? (
                                    <>
                                        <button onClick={startConsensus} className="flex-1 py-4 bg-gold-600 text-black font-bold text-[10px] uppercase tracking-[0.3em] rounded hover:bg-gold-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,165,40,0.3)]">
                                            <Zap size={14} /> Forge Consensus
                                        </button>
                                        <button onClick={handleInfect} className="px-6 py-4 bg-red-950/20 border border-red-900 text-red-500 font-bold text-[9px] uppercase tracking-widest rounded hover:bg-red-900 hover:text-white transition-all">
                                            Attack
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={handleRepair} className="w-full py-4 bg-emerald-600 text-black font-bold text-[10px] uppercase tracking-[0.3em] rounded hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                                        <Activity size={14} /> Restore Integrity
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="w-full">
                                <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] text-gold-500 mb-2 font-luxury">
                                    <span>{resonance === 100 ? "SUCCESS" : "RESONANCE SYNCING"}</span>
                                    <span>{Math.floor(resonance)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gold-900/20 rounded-full overflow-hidden border border-gold-900/30">
                                    <motion.div className="h-full bg-gradient-to-r from-gold-600 to-gold-300" initial={{ width: 0 }} animate={{ width: `${resonance}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
      const w = generateWallet();
      return [w];
  });
  
  const [chain, setChain] = useState<Block[]>(() => [createGenesisBlock(wallets[0].address)]);
  const [selectedWalletIdx, setSelectedWalletIdx] = useState(0); 
  const [mempool, setMempool] = useState<Transaction[]>([]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'network' | 'vault' | 'consensus'>('vault');
  const [pendingBlock, setPendingBlock] = useState<Block | null>(null);

  // Vault State
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  
  // Mining State
  const [difficulty, setDifficulty] = useState(2);
  const [autoDifficulty, setAutoDifficulty] = useState(true); 
  const [miningMethod, setMiningMethod] = useState<"incremental" | "random">("incremental");
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0); 
  const scrollRef = useRef<HTMLDivElement>(null);

  const balances = useMemo(() => getBalances(chain), [chain]);

  useEffect(() => {
      if(scrollRef.current && currentView === 'network') {
          scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
      }
  }, [chain.length, mempool.length, currentView]); 

  const createWallet = () => {
      const w = generateWallet();
      setWallets([...wallets, w]);
      setSelectedWalletIdx(wallets.length);
  };

  const addTransaction = () => {
      if(!recipientAddress || !amount) return;
      const val = Number(amount);
      const sender = wallets[selectedWalletIdx].address;
      const senderBalance = balances[sender] || 0;
      if (senderBalance < val) {
          alert("Insufficient funds in the vault.");
          return;
      }
      const tx: Transaction = { from: sender, to: recipientAddress, amount: val, timestamp: Date.now() };
      setMempool([...mempool, tx]);
      setRecipientAddress("");
      setAmount("");
      alert("Transaction queued successfully!");
      setCurrentView('network'); 
  };

  const mineNextBlock = async () => {
     if(mempool.length === 0) return;
     setIsMining(true);
     setHashRate(0);
     
     const prevBlock = chain[chain.length - 1];
     const newIndex = prevBlock.index + 1;
     const minerAddress = wallets[selectedWalletIdx].address;
     const blockData = JSON.stringify(mempool);

     let miningDifficulty = difficulty;
     if (autoDifficulty) {
         miningDifficulty = adjustDifficulty(prevBlock, Date.now());
         setDifficulty(miningDifficulty); 
     }

     try {
         const interval = setInterval(() => {
             setHashRate(Math.floor(Math.random() * 500) + 1000); 
         }, 100);

         const newBlock = await mineBlock(newIndex, blockData, prevBlock.hash, miningDifficulty, minerAddress, miningMethod);
         
         clearInterval(interval);
         setPendingBlock(newBlock);
         setCurrentView('consensus'); // Jump to consensus after mining
     } catch (e) {
         console.error(e);
     } finally {
         setIsMining(false);
         setHashRate(0);
     }
  };

  const finalizeConsensus = (block: Block) => {
      setChain([...chain, block]);
      setMempool([]);
      setPendingBlock(null);
      setCurrentView('network');
  };

  const updateBlock = (updatedBlock: Block) => {
      const newChain = [...chain];
      const pos = newChain.findIndex(b => b.index === updatedBlock.index);
      if(pos !== -1) newChain[pos] = updatedBlock;
      setChain(newChain);
  };

  const deleteBlock = (index: number) => {
      if(!confirm("Destroying this block will invalidate the chain forward. Proceed?")) return;
      const newChain = chain.filter(b => b.index !== index);
      setChain(newChain);
  };

  const verifyChain = () => {
      let valid = true;
      for(let i=1; i<chain.length; i++) {
          if (!isValidBlock(chain[i], chain[i-1])) {
              alert(`SECURITY BREACH DETECTED: Block #${chain[i].index}`);
              valid = false;
              break;
          }
      }
      if (valid) alert("SYSTEM INTEGRITY: 100% SECURE");
  };

  const currentWallet = wallets[selectedWalletIdx];
  const currentBalance = balances[currentWallet.address] || 0;

  return (
    <div className="h-screen w-screen bg-[#020202] text-gold-100 font-sans flex flex-col overflow-hidden selection:bg-gold-500/30 selection:text-white">
        
        {/* HEADER NAVIGATION */}
        <header className="h-20 shrink-0 border-b border-gold-900/30 flex items-center justify-between px-8 bg-black/50 backdrop-blur z-50">
            <div className="flex items-center gap-8">
                 <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-gold-300 shadow-[0_0_15px_rgba(212,165,40,0.5)] flex items-center justify-center">
                            <span className="font-luxury text-black font-bold text-lg">B</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-luxury text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                            BE RICH FAST
                        </h1>
                    </div>
                </div>

                {/* TABS UPDATED */}
                <div className="flex bg-black/40 border border-gold-900/30 rounded-full p-1 gap-1">
                    <button 
                        onClick={() => setCurrentView('vault')}
                        className={clsx("flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all", currentView === 'vault' ? "bg-gold-600 text-black font-bold shadow-[0_0_15px_rgba(212,165,40,0.4)]" : "text-neutral-500 hover:text-gold-400")}
                    >
                        <WalletIcon size={14} /> My Vault
                    </button>
                    <button 
                        onClick={() => setCurrentView('network')}
                        className={clsx("flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all", currentView === 'network' ? "bg-gold-600 text-black font-bold shadow-[0_0_15px_rgba(212,165,40,0.4)]" : "text-neutral-500 hover:text-gold-400")}
                    >
                        <Network size={14} /> Live Network
                    </button>
                    <button 
                        onClick={() => setCurrentView('consensus')}
                        className={clsx("flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all relative overflow-visible", currentView === 'consensus' ? "bg-gold-600 text-black font-bold shadow-[0_0_15px_rgba(212,165,40,0.4)]" : "text-neutral-500 hover:text-gold-400")}
                    >
                        <Zap size={14} /> Consensus
                        {pendingBlock && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>}
                    </button>
                </div>
            </div>

            <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gold-600/60 font-tech">
                <div className="flex items-center gap-2">
                    <Activity size={14} className={isMining ? "text-green-500 animate-pulse" : "text-neutral-700"}/> 
                    {isMining ? `Mining @ ${hashRate} H/s` : "Network Idle"}
                </div>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                 style={{
                     backgroundImage: `linear-gradient(rgba(212, 165, 40, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 165, 40, 0.05) 1px, transparent 1px)`,
                     backgroundSize: '40px 40px'
                 }}>
            </div>

            {/* --- VIEW 1: VAULT --- */}
            {currentView === 'vault' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 z-10 flex items-center justify-center p-12">
                    <div className="w-[800px] bg-black/80 backdrop-blur border border-gold-900/30 p-8 rounded-lg shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="mb-10 text-center relative z-20">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 mb-4 block">Current Identity</label>
                            <IdentitySelector wallets={wallets} selectedIndex={selectedWalletIdx} onSelect={setSelectedWalletIdx} onCreate={createWallet} />
                        </div>
                        <div className="mb-12 flex flex-col items-center justify-center gap-2">
                             <div className="text-[60px] font-luxury text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-600 drop-shadow-[0_2px_10px_rgba(212,165,40,0.3)] flex items-baseline gap-2">
                                {currentBalance.toFixed(2)} <span className="text-xl text-gold-800 tracking-widest">BRF</span>
                             </div>
                             <div className="text-[10px] uppercase tracking-[0.2em] text-gold-700">Available Balance</div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-bold flex items-center gap-2">
                                    <ArrowRightLeft size={12}/> Recipient
                                </label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-black/60 border border-gold-900/30 p-4 text-xs font-tech text-gold-100 focus:outline-none focus:border-gold-500 transition-colors rounded appearance-none cursor-pointer hover:border-gold-500/50"
                                        value={recipientAddress}
                                        onChange={e => setRecipientAddress(e.target.value)}
                                    >
                                        <option value="" disabled>Select a beneficiary...</option>
                                        {wallets.filter(w => w.address !== currentWallet.address).map((w) => (
                                            <option key={w.address} value={w.address}>User #{wallets.indexOf(w) + 1} ({w.address.substring(0, 12)}...)</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-4 text-gold-700 pointer-events-none">▼</div>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-bold">Amount</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-black/60 border border-gold-900/30 p-4 text-xs font-tech text-gold-100 focus:outline-none focus:border-gold-500 transition-colors rounded placeholder:text-neutral-800" />
                             </div>
                        </div>
                        <button onClick={addTransaction} disabled={!amount || !recipientAddress} className="w-full mt-8 py-5 bg-gold-600 text-black text-xs uppercase tracking-[0.3em] font-bold hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(212,165,40,0.4)] transition-all rounded disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10">
                            <Check size={16}/> Sign & Broadcast Transaction
                        </button>
                    </div>
                </motion.div>
            )}

            {/* --- VIEW 2: NETWORK --- */}
            {currentView === 'network' && (
                <>
                    <aside className="w-72 shrink-0 bg-black/80 border-r border-gold-900/20 flex flex-col z-40 h-full backdrop-blur-sm shadow-2xl relative">
                        <div className="p-6 flex-1 overflow-y-auto scrollbar-gold">
                             <h3 className="text-[9px] uppercase tracking-[0.2em] text-gold-500 mb-4 border-b border-gold-900/30 pb-2 font-luxury">Rich List</h3>
                             <div className="space-y-2">
                                {Object.entries(balances).sort(([,a], [,b]) => b - a).map(([addr, bal], i) => (
                                    <div key={addr} className="flex justify-between items-center text-[10px] font-tech group hover:bg-gold-900/10 p-2 rounded transition-colors border-b border-gold-900/10">
                                        <div className="flex flex-col">
                                            <span className={clsx("font-bold text-xs", i===0 ? "text-gold-400" : "text-neutral-500")}>
                                                {i===0 && "👑 "} {wallets.find(w => w.address === addr) ? `User #${wallets.findIndex(w => w.address === addr)+1}` : "Unknown"}
                                            </span>
                                            <span className="text-[8px] text-neutral-600">{addr.substring(0, 8)}...</span>
                                        </div>
                                        <span className={clsx("font-bold", bal > 0 ? "text-emerald-400" : "text-neutral-600")}>{bal.toFixed(0)}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <div className="p-6 border-t border-gold-900/30 bg-black/60">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase tracking-widest text-gold-600 font-bold">Auto-Difficulty</span>
                                    <button onClick={() => setAutoDifficulty(!autoDifficulty)} className={clsx("text-[9px] px-2 py-1 rounded border transition-colors", autoDifficulty ? "bg-gold-600 text-black border-gold-600 font-bold" : "text-neutral-500 border-neutral-800")}>{autoDifficulty ? "ON" : "OFF"}</button>
                                </div>
                                <div className="flex items-center justify-between">
                                     <span className="text-[9px] uppercase tracking-widest text-gold-600 font-bold flex items-center gap-2"><BrainCircuit size={12}/> Strategy</span>
                                     <div className="flex gap-1 bg-black border border-gold-900/50 rounded p-1">
                                        <button onClick={() => setMiningMethod("incremental")} className={clsx("text-[8px] px-2 py-1 rounded uppercase tracking-wider transition-all", miningMethod === "incremental" ? "bg-gold-700 text-black font-bold" : "text-neutral-600")}>Linear</button>
                                        <button onClick={() => setMiningMethod("random")} className={clsx("text-[8px] px-2 py-1 rounded uppercase tracking-wider transition-all", miningMethod === "random" ? "bg-gold-700 text-black font-bold" : "text-neutral-600")}>Random</button>
                                     </div>
                                </div>
                                <button onClick={verifyChain} className="text-[9px] text-neutral-600 hover:text-gold-400 transition-colors flex items-center justify-center gap-2 w-full pt-4 font-bold uppercase tracking-[0.2em] border-t border-white/5 mt-2">
                                    <ShieldAlert size={12}/> AUDIT CHAIN
                                </button>
                            </div>
                        </div>
                    </aside>
                    <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden flex items-center p-16 gap-0 h-full w-full scrollbar-thin scrollbar-thumb-gold-900/50 scrollbar-track-black z-10">
                        <AnimatePresence>
                            {chain.map((block, i) => {
                                const prevHash = i > 0 ? chain[i-1].hash : "0".repeat(64);
                                return (
                                    <div key={block.index} className="flex items-center">
                                        <BlockNode block={block} prevHash={prevHash} onUpdate={updateBlock} onDelete={deleteBlock} isGenesis={i === 0}/>
                                        {i < chain.length - 1 && (
                                            <div className="relative w-16 h-[2px] bg-neutral-900 overflow-hidden shrink-0">
                                                <div className="absolute inset-0 bg-gradient-to-r from-gold-700 via-gold-300 to-gold-700 animate-shine"></div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {mempool.length > 0 && (
                                <>
                                    <div className="relative w-16 h-[2px] bg-neutral-900 overflow-hidden shrink-0">
                                         <div className="absolute inset-0 bg-gold-900/30 animate-pulse"></div>
                                    </div>
                                    <MempoolNode transactions={mempool} onMine={mineNextBlock} isMining={isMining} prevHash={chain[chain.length-1].hash}/>
                                </>
                            )}
                        </AnimatePresence>
                        <div className="w-64 shrink-0 h-10"></div>
                    </div>
                </>
            )}

            {/* --- VIEW 3: CONSENSUS --- */}
            {currentView === 'consensus' && (
                <ConsensusView pendingBlock={pendingBlock} onFinalize={finalizeConsensus} />
            )}
        </div>
    </div>
  );
}
