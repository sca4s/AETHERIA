/***************************************************************************
 * 1. WEB AUDIO SYNTHESIZER
 ***************************************************************************/
class CathedralAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playSelect(isWhite = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = isWhite ? 580 : 440;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.30);
  }

  playCursorStep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.045);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playStoneSlide(duration = 0.42, isJump = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (isJump) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(310, now + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(80, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
      return;
    }

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.linearRampToValueAtTime(240, now + duration * 0.7);
    filter.Q.value = 2.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.setValueAtTime(0.10, now + duration - 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playAttackCharge() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  playShatterImpact() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.5);
    subGain.gain.setValueAtTime(0.32, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.56);

    for (let i = 0; i < 8; i++) {
      const delay = 0.03 + Math.random() * 0.4;
      const shardOsc = this.ctx.createOscillator();
      const shardGain = this.ctx.createGain();
      shardOsc.type = 'triangle';
      const freq = 950 + Math.random() * 1800;
      shardOsc.frequency.setValueAtTime(freq, now + delay);
      shardOsc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + delay + 0.07);

      shardGain.gain.setValueAtTime(0.06, now + delay);
      shardGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);

      shardOsc.connect(shardGain);
      shardGain.connect(this.ctx.destination);
      shardOsc.start(now + delay);
      shardOsc.stop(now + delay + 0.09);
    }
  }

  playCheckAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [261.63, 329.63].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.62);
    });
  }
}

const soundFX = new CathedralAudio();

/***************************************************************************
 * 2. COMPLETE LEGAL FIDE CHESS ENGINE + MINIMAX AUTOMATON
 ***************************************************************************/
class WizardChessEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.turn = 'w';
    this.castling = { wK: true, wQ: true, bK: true, bQ: true };
    this.enPassant = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.history = [];
    this.capturedByWhite = [];
    this.capturedByBlack = [];

    const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      this.board[0][c] = { type: backRank[c], color: 'b', id: `b_${backRank[c]}_${c}` };
      this.board[1][c] = { type: 'p', color: 'b', id: `b_p_${c}` };
      this.board[6][c] = { type: 'p', color: 'w', id: `w_p_${c}` };
      this.board[7][c] = { type: backRank[c], color: 'w', id: `w_${backRank[c]}_${c}` };
    }
  }

  inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  cloneState() {
    return {
      board: this.board.map(row => row.map(cell => (cell ? { ...cell } : null))),
      turn: this.turn,
      castling: { ...this.castling },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
      capturedByWhite: [...this.capturedByWhite],
      capturedByBlack: [...this.capturedByBlack]
    };
  }

  restoreState(state) {
    this.board = state.board.map(row => row.map(cell => (cell ? { ...cell } : null)));
    this.turn = state.turn;
    this.castling = { ...state.castling };
    this.enPassant = state.enPassant ? { ...state.enPassant } : null;
    this.halfMoveClock = state.halfMoveClock;
    this.fullMoveNumber = state.fullMoveNumber;
    this.capturedByWhite = [...state.capturedByWhite];
    this.capturedByBlack = [...state.capturedByBlack];
  }

  findKing(color, board = this.board) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.color === color && p.type === 'k') return { r, c };
      }
    }
    return null;
  }

  isSquareAttacked(tr, tc, attackerColor, board = this.board) {
    const pawnDir = attackerColor === 'w' ? 1 : -1;
    for (const dc of [-1, 1]) {
      const pr = tr + pawnDir;
      const pc = tc + dc;
      if (this.inBounds(pr, pc)) {
        const p = board[pr][pc];
        if (p && p.color === attackerColor && p.type === 'p') return true;
      }
    }

    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightMoves) {
      const nr = tr + dr, nc = tc + dc;
      if (this.inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p && p.color === attackerColor && p.type === 'n') return true;
      }
    }

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const kr = tr + dr, kc = tc + dc;
        if (this.inBounds(kr, kc)) {
          const p = board[kr][kc];
          if (p && p.color === attackerColor && p.type === 'k') return true;
        }
      }
    }

    const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of orthoDirs) {
      let nr = tr + dr, nc = tc + dc;
      while (this.inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = tr + dr, nc = tc + dc;
      while (this.inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    return false;
  }

  isInCheck(color, board = this.board) {
    const kingPos = this.findKing(color, board);
    if (!kingPos) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(kingPos.r, kingPos.c, enemy, board);
  }

  getPseudoMovesForSquare(r, c) {
    const p = this.board[r][c];
    if (!p) return [];
    const moves = [];
    const color = p.color;
    const enemy = color === 'w' ? 'b' : 'w';

    if (p.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const promoRow = color === 'w' ? 0 : 7;

      const r1 = r + dir;
      if (this.inBounds(r1, c) && !this.board[r1][c]) {
        moves.push({
          fromR: r, fromC: c, toR: r1, toC: c,
          piece: p, captured: null,
          promotion: r1 === promoRow ? 'q' : null
        });

        const r2 = r + dir * 2;
        if (r === startRow && !this.board[r2][c]) {
          moves.push({
            fromR: r, fromC: c, toR: r2, toC: c,
            piece: p, captured: null, isDoublePawn: true
          });
        }
      }

      for (const dc of [-1, 1]) {
        const tc = c + dc;
        if (!this.inBounds(r1, tc)) continue;
        const target = this.board[r1][tc];
        if (target && target.color === enemy) {
          moves.push({
            fromR: r, fromC: c, toR: r1, toC: tc,
            piece: p, captured: target,
            promotion: r1 === promoRow ? 'q' : null
          });
        } else if (this.enPassant && this.enPassant.r === r1 && this.enPassant.c === tc) {
          const epVictim = this.board[r][tc];
          if (epVictim && epVictim.color === enemy) {
            moves.push({
              fromR: r, fromC: c, toR: r1, toC: tc,
              piece: p, captured: epVictim,
              isEnPassant: true, epCaptureR: r, epCaptureC: tc
            });
          }
        }
      }
    } else if (p.type === 'n') {
      const jumps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of jumps) {
        const nr = r + dr, nc = c + dc;
        if (!this.inBounds(nr, nc)) continue;
        const target = this.board[nr][nc];
        if (!target || target.color === enemy) {
          moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, piece: p, captured: target || null });
        }
      }
    } else if (p.type === 'b' || p.type === 'r' || p.type === 'q') {
      const dirs = [];
      if (p.type === 'b' || p.type === 'q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      if (p.type === 'r' || p.type === 'q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);

      for (const [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (this.inBounds(nr, nc)) {
          const target = this.board[nr][nc];
          if (!target) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, piece: p, captured: null });
          } else {
            if (target.color === enemy) {
              moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, piece: p, captured: target });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    } else if (p.type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (!this.inBounds(nr, nc)) continue;
          const target = this.board[nr][nc];
          if (!target || target.color === enemy) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, piece: p, captured: target || null });
          }
        }
      }

      const homeRow = color === 'w' ? 7 : 0;
      if (r === homeRow && c === 4 && !this.isInCheck(color)) {
        const canKingside = color === 'w' ? this.castling.wK : this.castling.bK;
        const canQueenside = color === 'w' ? this.castling.wQ : this.castling.bQ;

        if (canKingside && !this.board[homeRow][5] && !this.board[homeRow][6]) {
          const rook = this.board[homeRow][7];
          if (rook && rook.type === 'r' && rook.color === color) {
            if (!this.isSquareAttacked(homeRow, 5, enemy) && !this.isSquareAttacked(homeRow, 6, enemy)) {
              moves.push({
                fromR: homeRow, fromC: 4, toR: homeRow, toC: 6,
                piece: p, captured: null, isCastle: 'K',
                rookFromC: 7, rookToC: 5
              });
            }
          }
        }

        if (canQueenside && !this.board[homeRow][3] && !this.board[homeRow][2] && !this.board[homeRow][1]) {
          const rook = this.board[homeRow][0];
          if (rook && rook.type === 'r' && rook.color === color) {
            if (!this.isSquareAttacked(homeRow, 3, enemy) && !this.isSquareAttacked(homeRow, 2, enemy)) {
              moves.push({
                fromR: homeRow, fromC: 4, toR: homeRow, toC: 2,
                piece: p, captured: null, isCastle: 'Q',
                rookFromC: 0, rookToC: 3
              });
            }
          }
        }
      }
    }

    return moves;
  }

  getLegalMovesForSquare(r, c) {
    const p = this.board[r][c];
    if (!p || p.color !== this.turn) return [];
    const pseudo = this.getPseudoMovesForSquare(r, c);
    const legal = [];

    for (const m of pseudo) {
      const testBoard = this.board.map(row => row.map(cell => (cell ? { ...cell } : null)));
      testBoard[m.toR][m.toC] = { ...testBoard[m.fromR][m.fromC] };
      testBoard[m.fromR][m.fromC] = null;
      if (m.isEnPassant) testBoard[m.epCaptureR][m.epCaptureC] = null;
      if (m.isCastle) {
        testBoard[m.fromR][m.rookToC] = testBoard[m.fromR][m.rookFromC];
        testBoard[m.fromR][m.rookFromC] = null;
      }
      if (!this.isInCheck(p.color, testBoard)) {
        legal.push(m);
      }
    }
    return legal;
  }

  getAllLegalMoves(color = this.turn) {
    const prevTurn = this.turn;
    this.turn = color;
    const all = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] && this.board[r][c].color === color) {
          all.push(...this.getLegalMovesForSquare(r, c));
        }
      }
    }
    this.turn = prevTurn;
    return all;
  }

  coordToAlgebraic(r, c) {
    return `${'abcdefgh'[c]}${8 - r}`;
  }

  makeMove(move, chosenPromotion = null) {
    const snapshot = this.cloneState();
    const piece = { ...this.board[move.fromR][move.fromC] };
    const captured = move.isEnPassant
      ? this.board[move.epCaptureR][move.epCaptureC]
      : this.board[move.toR][move.toC];

    this.board[move.fromR][move.fromC] = null;
    if (move.isEnPassant) {
      this.board[move.epCaptureR][move.epCaptureC] = null;
    }

    const promoType = chosenPromotion || move.promotion;
    if (promoType) piece.type = promoType;
    this.board[move.toR][move.toC] = piece;

    let rookMoved = null;
    if (move.isCastle) {
      const rook = this.board[move.fromR][move.rookFromC];
      this.board[move.fromR][move.rookFromC] = null;
      this.board[move.fromR][move.rookToC] = rook;
      rookMoved = {
        id: rook.id,
        fromR: move.fromR,
        fromC: move.rookFromC,
        toR: move.fromR,
        toC: move.rookToC
      };
    }

    if (piece.type === 'k') {
      if (piece.color === 'w') { this.castling.wK = false; this.castling.wQ = false; }
      else { this.castling.bK = false; this.castling.bQ = false; }
    }
    if (move.fromR === 7 && move.fromC === 0) this.castling.wQ = false;
    if (move.fromR === 7 && move.fromC === 7) this.castling.wK = false;
    if (move.fromR === 0 && move.fromC === 0) this.castling.bQ = false;
    if (move.fromR === 0 && move.fromC === 7) this.castling.bK = false;
    if (move.toR === 7 && move.toC === 0) this.castling.wQ = false;
    if (move.toR === 7 && move.toC === 7) this.castling.wK = false;
    if (move.toR === 0 && move.toC === 0) this.castling.bQ = false;
    if (move.toR === 0 && move.toC === 7) this.castling.bK = false;

    if (move.isDoublePawn) {
      this.enPassant = { r: (move.fromR + move.toR) / 2, c: move.fromC };
    } else {
      this.enPassant = null;
    }

    if (captured) {
      if (piece.color === 'w') this.capturedByWhite.push(captured.type);
      else this.capturedByBlack.push(captured.type);
    }

    const nextTurn = this.turn === 'w' ? 'b' : 'w';
    if (this.turn === 'b') this.fullMoveNumber++;
    this.turn = nextTurn;

    const inCheck = this.isInCheck(this.turn);
    const replies = this.getAllLegalMoves(this.turn);
    const isCheckmate = inCheck && replies.length === 0;
    const isStalemate = !inCheck && replies.length === 0;

    let san = '';
    if (move.isCastle === 'K') san = 'O-O';
    else if (move.isCastle === 'Q') san = 'O-O-O';
    else {
      const origType = move.piece.type;
      if (origType !== 'p') san += origType.toUpperCase();
      else if (captured) san += 'abcdefgh'[move.fromC];
      if (captured) san += 'x';
      san += this.coordToAlgebraic(move.toR, move.toC);
      if (promoType) san += `=${promoType.toUpperCase()}`;
    }
    if (isCheckmate) san += '#';
    else if (inCheck) san += '+';

    const record = {
      snapshot,
      move,
      pieceAfter: { ...piece },
      captured: captured ? { ...captured } : null,
      rookMoved,
      san,
      color: move.piece.color,
      inCheck,
      isCheckmate,
      isStalemate
    };

    this.history.push(record);
    return record;
  }

  undo() {
    if (this.history.length === 0) return null;
    const last = this.history.pop();
    this.restoreState(last.snapshot);
    return last;
  }

  evaluateBoard() {
    const values = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (!p) continue;
        let val = values[p.type] || 0;
        const centerDist = Math.abs(3.5 - r) + Math.abs(3.5 - c);
        if (p.type === 'n' || p.type === 'b' || p.type === 'q') {
          val += (7 - centerDist) * 6;
        } else if (p.type === 'p') {
          const advancement = p.color === 'w' ? (6 - r) : (r - 1);
          val += advancement * 12;
          if (c >= 2 && c <= 5) val += 8;
        }
        score += p.color === 'w' ? val : -val;
      }
    }
    return score;
  }

  chooseAIMove(difficulty = 'adept') {
    const legalMoves = this.getAllLegalMoves(this.turn);
    if (legalMoves.length === 0) return null;

    if (difficulty === 'novice') {
      const captures = legalMoves.filter(m => m.captured);
      if (captures.length > 0 && Math.random() < 0.65) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const depth = difficulty === 'archmage' ? 3 : 2;
    const isMaximizing = this.turn === 'w';
    legalMoves.sort((a, b) => (b.captured ? 10 : 0) - (a.captured ? 10 : 0));

    let bestMove = legalMoves[0];
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const m of legalMoves) {
      const snap = this.cloneState();
      this.makeMove(m, 'q');
      const val = this.minimax(depth - 1, -Infinity, Infinity, !isMaximizing);
      this.history.pop();
      this.restoreState(snap);

      const captureBias = m.captured ? (isMaximizing ? 18 : -18) : 0;
      const jitter = (Math.random() - 0.5) * 8;
      const totalVal = val + captureBias + jitter;

      if (isMaximizing && totalVal > bestValue) {
        bestValue = totalVal;
        bestMove = m;
      } else if (!isMaximizing && totalVal < bestValue) {
        bestValue = totalVal;
        bestMove = m;
      }
    }

    return bestMove;
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) return this.evaluateBoard();
    const moves = this.getAllLegalMoves(isMaximizing ? 'w' : 'b');
    if (moves.length === 0) {
      if (this.isInCheck(isMaximizing ? 'w' : 'b')) {
        return isMaximizing ? -99999 - depth * 100 : 99999 + depth * 100;
      }
      return 0;
    }

    moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const m of moves) {
        const snap = this.cloneState();
        this.makeMove(m, 'q');
        const ev = this.minimax(depth - 1, alpha, beta, false);
        this.history.pop();
        this.restoreState(snap);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of moves) {
        const snap = this.cloneState();
        this.makeMove(m, 'q');
        const ev = this.minimax(depth - 1, alpha, beta, true);
        this.history.pop();
        this.restoreState(snap);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}

/***************************************************************************
 * 3. PASTEL TEXTURE & GEOMETRY HELPERS
 ***************************************************************************/
const SQUARE_SIZE = 1.35;
const BOARD_OFFSET = (7 * SQUARE_SIZE) / 2;

function boardToWorld(r, c) {
  return new THREE.Vector3(
    c * SQUARE_SIZE - BOARD_OFFSET,
    0,
    r * SQUARE_SIZE - BOARD_OFFSET
  );
}

function createStoneTexture(baseHex, veinHex, noiseStrength = 12) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const alpha = Math.random() * (noiseStrength / 255);
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(30,25,50,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.strokeStyle = veinHex;
  ctx.lineWidth = 1.4;
  for (let v = 0; v < 6; v++) {
    ctx.beginPath();
    let x = Math.random() * 256;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 256) {
      y += 18 + Math.random() * 22;
      x += (Math.random() - 0.5) * 34;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createLabelTexture(char) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.font = 'bold 32px "Cinzel", serif';
  ctx.fillStyle = 'rgba(254, 215, 170, 0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, 32, 34);
  return new THREE.CanvasTexture(canvas);
}

/***************************************************************************
 * 4. SOFT PASTEL REALM CONFIGURATIONS
 ***************************************************************************/
const REALM_CONFIGS = {
  cathedral: {
    name: 'Pastel Sanctuary',
    bgHex: 0x231f33,
    fogDensity: 0.017,
    ambientHex: 0x5e548e,
    ambientIntensity: 1.55,
    spotHex: 0xfff1f2,
    spotIntensity: 2.1,
    rimWestHex: 0xe9d5ff,
    rimEastHex: 0xfed7aa,
    lightSqBase: '#fdf2f8',
    lightSqVein: 'rgba(244, 162, 184, 0.22)',
    darkSqBase: '#5e548e',
    darkSqVein: 'rgba(233, 213, 255, 0.24)',
    frameColor: 0x3b3355,
    trimColor: 0xf9dcc4
  },
  night: {
    name: 'Dream Night Glade',
    bgHex: 0x1a1b2f,
    fogDensity: 0.014,
    ambientHex: 0x43497a,
    ambientIntensity: 1.6,
    spotHex: 0xe0e7ff,
    spotIntensity: 2.0,
    rimWestHex: 0xbae6fd,
    rimEastHex: 0xc7d2fe,
    lightSqBase: '#eef2ff',
    lightSqVein: 'rgba(165, 180, 252, 0.25)',
    darkSqBase: '#3b4270',
    darkSqVein: 'rgba(186, 230, 253, 0.25)',
    frameColor: 0x262947,
    trimColor: 0xbae6fd
  },
  day: {
    name: 'Morning Sky Citadel',
    bgHex: 0x8ecae6,
    fogDensity: 0.009,
    ambientHex: 0xe0f2fe,
    ambientIntensity: 1.7,
    spotHex: 0xfffbeb,
    spotIntensity: 2.2,
    rimWestHex: 0xbae6fd,
    rimEastHex: 0xfde68a,
    lightSqBase: '#fffbeb',
    lightSqVein: 'rgba(253, 230, 138, 0.25)',
    darkSqBase: '#6b9ac4',
    darkSqVein: 'rgba(224, 242, 254, 0.25)',
    frameColor: 0xf1f5f9,
    trimColor: 0xfed7aa
  },
  grass: {
    name: 'Mint Blossom Meadow',
    bgHex: 0x2b413c,
    fogDensity: 0.015,
    ambientHex: 0x52796f,
    ambientIntensity: 1.6,
    spotHex: 0xfef3c7,
    spotIntensity: 2.1,
    rimWestHex: 0xbbf7d0,
    rimEastHex: 0xfbcfe8,
    lightSqBase: '#f0fdf4',
    lightSqVein: 'rgba(134, 239, 172, 0.25)',
    darkSqBase: '#4a6b5d',
    darkSqVein: 'rgba(187, 247, 208, 0.24)',
    frameColor: 0x3b5249,
    trimColor: 0xbbf7d0
  },
  ocean: {
    name: 'Aqua Pastel Lagoon',
    bgHex: 0x1d3549,
    fogDensity: 0.013,
    ambientHex: 0x457b9d,
    ambientIntensity: 1.6,
    spotHex: 0xe0f2fe,
    spotIntensity: 2.1,
    rimWestHex: 0xa5f3fc,
    rimEastHex: 0xcddafd,
    lightSqBase: '#ecfeff',
    lightSqVein: 'rgba(165, 243, 252, 0.28)',
    darkSqBase: '#3d637d',
    darkSqVein: 'rgba(186, 230, 253, 0.28)',
    frameColor: 0x2b4c65,
    trimColor: 0xa5f3fc
  },
  space: {
    name: 'Lilac Astral Nebula',
    bgHex: 0x191326,
    fogDensity: 0.008,
    ambientHex: 0x4a3b69,
    ambientIntensity: 1.65,
    spotHex: 0xf5f3ff,
    spotIntensity: 2.1,
    rimWestHex: 0xe9d5ff,
    rimEastHex: 0xfbcfe8,
    lightSqBase: '#faf5ff',
    lightSqVein: 'rgba(216, 180, 254, 0.28)',
    darkSqBase: '#44355b',
    darkSqVein: 'rgba(251, 207, 232, 0.28)',
    frameColor: 0x2e2340,
    trimColor: 0xe9d5ff
  },
  sand: {
    name: 'Peach Blush Dunes',
    bgHex: 0x4a3531,
    fogDensity: 0.015,
    ambientHex: 0x8d6e63,
    ambientIntensity: 1.65,
    spotHex: 0xfff7ed,
    spotIntensity: 2.2,
    rimWestHex: 0xfed7aa,
    rimEastHex: 0xfbcfe8,
    lightSqBase: '#fff7ed',
    lightSqVein: 'rgba(254, 215, 170, 0.28)',
    darkSqBase: '#7c5850',
    darkSqVein: 'rgba(251, 207, 232, 0.26)',
    frameColor: 0x5c4038,
    trimColor: 0xfed7aa
  }
};
