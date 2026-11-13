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
    this.castling = { ...this.castling };
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
 * 3. PASTEL TEXTURE & GEOMETRY HELPERS (WITH TEXTURE CACHING FOR ZERO LAG)
 ***************************************************************************/
const SQUARE_SIZE = 1.35;
const BOARD_OFFSET = (7 * SQUARE_SIZE) / 2;
const STONE_TEXTURE_CACHE = new Map();

function boardToWorld(r, c) {
  return new THREE.Vector3(
    c * SQUARE_SIZE - BOARD_OFFSET,
    0,
    r * SQUARE_SIZE - BOARD_OFFSET
  );
}

function createStoneTexture(baseHex, veinHex, noiseStrength = 12) {
  const cacheKey = `${baseHex}_${veinHex}_${noiseStrength}`;
  if (STONE_TEXTURE_CACHE.has(cacheKey)) {
    return STONE_TEXTURE_CACHE.get(cacheKey);
  }

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
  STONE_TEXTURE_CACHE.set(cacheKey, tex);
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
    themeMode: 'dark',
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
    themeMode: 'dark',
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
    themeMode: 'light',
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
    themeMode: 'dark',
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
    themeMode: 'dark',
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
    themeMode: 'dark',
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
    themeMode: 'light',
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

/***************************************************************************
 * 5. MAIN 3D AETHERIA CHESS APPLICATION CONTROLLER
 ***************************************************************************/
class WizardsChessApp {
  constructor() {
    this.engine = new WizardChessEngine();

    this.controlPlatform = 'pc';
    this.graphicsDef = 'high'; // 'high' (HD) or 'low' (2GB RAM Optimized)
    this.playerColor = 'w'; // 'w' (Pastel Pearl / South) or 'b' (Dusk Lilac / North)
    this.playerNameWhite = 'Pearl';
    this.playerNameBlack = 'Lilac';
    this.hasLaunchedSanctuary = false;

    this.currentRealm = 'cathedral';
    this.gameMode = 'ai';
    this.aiDifficulty = 'adept';
    this.dynamicActionCam = true;
    this.isAnimating = false;
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.pendingPromotionMove = null;

    this.cursorSquare = { r: 6, c: 4 };

    this.squareMeshes = [];
    this.pieceMeshes = new Map();
    this.cachedInteractables = [];
    this.interactablesDirty = true;

    this.shatterFragments = [];
    this.trailParticles = [];
    this.shockwaves = [];

    this.envGroup = null;
    this.oceanMesh = null;
    this.oceanBasePositions = null;
    this.grassInstancedMesh = null;
    this.grassDummyMatrices = [];
    this.reusableDummy = new THREE.Object3D();
    this.fallingLeaves = [];
    this.envParticles = null;
    this.spaceRings = [];

    // Smooth Dark <-> White / Realm Chromatic Interpolation State
    this.themeTransition = {
      active: false,
      elapsed: 0,
      duration: 0.58,
      fromBg: new THREE.Color(0x231f33),
      toBg: new THREE.Color(0x231f33),
      fromFog: new THREE.Color(0x231f33),
      toFog: new THREE.Color(0x231f33),
      fromFogDensity: 0.017,
      toFogDensity: 0.017,
      fromAmbient: new THREE.Color(0x5e548e),
      toAmbient: new THREE.Color(0x5e548e),
      fromAmbientInt: 1.55,
      toAmbientInt: 1.55,
      fromSpot: new THREE.Color(0xfff1f2),
      toSpot: new THREE.Color(0xfff1f2),
      fromSpotInt: 2.1,
      toSpotInt: 2.1,
      fromRimW: new THREE.Color(0xe9d5ff),
      toRimW: new THREE.Color(0xe9d5ff),
      fromRimE: new THREE.Color(0xfed7aa),
      toRimE: new THREE.Color(0xfed7aa),
      fromFrame: new THREE.Color(0x3b3355),
      toFrame: new THREE.Color(0x3b3355),
      fromTrim: new THREE.Color(0xf9dcc4),
      toTrim: new THREE.Color(0xf9dcc4),
      fromLightTint: new THREE.Color(0xffffff),
      toLightTint: new THREE.Color(0xffffff),
      fromDarkTint: new THREE.Color(0xffffff),
      toDarkTint: new THREE.Color(0xffffff)
    };

    // Base Camera Radius (automatically scaled by screen aspect ratio & HUD safe zones)
    this.baseRadius = 15.6;
    this.cameraState = {
      theta: 0,
      phi: 0.90,
      radius: 15.6,
      target: new THREE.Vector3(0, 0.35, 0),
      desiredTheta: 0,
      desiredPhi: 0.90,
      desiredRadius: 15.6,
      desiredTarget: new THREE.Vector3(0, 0.35, 0),
      shakeIntensity: 0,
      savedBeforeAction: null
    };

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.frameCounter = 0;

    this.initThreeScene();
    this.initSharedMaterials();
    this.buildChessBoard();
    this.buildCursorMesh();
    this.setEnvironmentRealm('cathedral', true);
    this.syncPiecesWithEngine();
    this.initLauncherAndDeviceDetection();
    this.initControlsAndEvents();
    this.computeResponsiveUIScale();
    this.adaptCameraToScreenAspect(true);
    this.updateHUD();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * Computes fluid proportional UI scale (--ui-scale) based on exact screen dimensions
   * so larger screens get larger UIs, smaller screens get smaller UIs, and no HUD panels overlap.
   */
  computeResponsiveUIScale() {
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    const shortSide = Math.min(w, h);

    let scale = 1.0;
    if (w < 360) scale = 0.80;
    else if (w < 480) scale = 0.88;
    else if (w < 640) scale = 0.92;
    else if (w < 1024) scale = 0.96;
    else if (w < 1440) scale = 1.0;
    else if (w < 1920) scale = 1.08;
    else if (w < 2560) scale = 1.18;
    else scale = 1.28;

    if (shortSide < 620) {
      scale = Math.min(scale, 0.82);
    } else if (shortSide < 720) {
      scale = Math.min(scale, 0.90);
    }

    document.documentElement.style.setProperty('--ui-scale', scale.toFixed(3));
  }

  /**
   * Automatically adapts Camera FOV, Vertical Target Offset, and Orbit Distance
   * so the 8x8 chessboard never overlaps the Top HUD or Bottom Chronicle.
   */
  getAspectAdjustedRadius(baseR = this.baseRadius) {
    const container = document.getElementById('canvas-container');
    const w = container ? container.clientWidth : window.innerWidth;
    const h = container ? container.clientHeight : window.innerHeight;
    const aspect = Math.max(0.35, w / Math.max(1, h));

    const headerEl = document.getElementById('top-hud-header');
    const headerH = headerEl ? headerEl.getBoundingClientRect().height : 96;
    const topRatio = Math.min(0.35, headerH / Math.max(1, h));
    const safeClearanceMultiplier = 1 + topRatio * 0.45;

    if (aspect < 1.0) {
      return Math.min(31, (baseR / Math.pow(aspect, 0.78)) * safeClearanceMultiplier);
    }
    return baseR * Math.max(1.0, safeClearanceMultiplier * 0.96);
  }

  adaptCameraToScreenAspect(instant = false) {
    this.computeResponsiveUIScale();

    const container = document.getElementById('canvas-container');
    const w = container ? container.clientWidth : window.innerWidth;
    const h = container ? container.clientHeight : window.innerHeight;
    const aspect = w / Math.max(1, h);

    this.camera.aspect = aspect;
    this.camera.fov = aspect < 0.85 ? 46 : 42;
    this.camera.updateProjectionMatrix();

    const maxPixelRatio = this.graphicsDef === 'low' ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(maxPixelRatio);
    this.renderer.setSize(w, h, false);

    const targetRadius = this.getAspectAdjustedRadius(this.baseRadius);
    this.cameraState.desiredRadius = targetRadius;

    if (!this.cameraState.savedBeforeAction) {
      const yOffset = aspect < 0.85 ? 0.52 : 0.38;
      this.cameraState.desiredTarget.y = yOffset;
      if (instant) this.cameraState.target.y = yOffset;
    }

    if (instant) {
      this.cameraState.radius = targetRadius;
    }
  }

  /**
   * Switches between High Definition (HD) and Low Definition (2GB RAM Smooth Mode)
   * without removing any visual elements, realms, or gameplay features.
   */
  applyGraphicsDefinition(mode, rebuildEnv = true) {
    this.graphicsDef = mode === 'low' ? 'low' : 'high';
    document.body.setAttribute('data-perf-mode', this.graphicsDef);

    const cardHigh = document.getElementById('card-def-high');
    const cardLow = document.getElementById('card-def-low');
    if (cardHigh && cardLow) {
      if (this.graphicsDef === 'low') {
        cardLow.classList.add('selected-device');
        cardHigh.classList.remove('selected-device');
        const lowCheck = cardLow.querySelector('.def-check');
        const highCheck = cardHigh.querySelector('.def-check');
        if (lowCheck) lowCheck.classList.remove('hidden');
        if (highCheck) highCheck.classList.add('hidden');
      } else {
        cardHigh.classList.add('selected-device');
        cardLow.classList.remove('selected-device');
        const lowCheck = cardLow.querySelector('.def-check');
        const highCheck = cardHigh.querySelector('.def-check');
        if (highCheck) highCheck.classList.remove('hidden');
        if (lowCheck) lowCheck.classList.add('hidden');
      }
    }

    const badgeText = this.graphicsDef === 'low' ? '2GB LOW' : 'HD';
    const hudDefBadge = document.getElementById('hud-def-badge');
    const labelDefMobile = document.getElementById('label-def-mobile');
    const labelDefDesktop = document.getElementById('label-def-desktop');
    const btnDefDesktop = document.getElementById('btn-def-toggle');
    const btnDefMobile = document.getElementById('btn-def-mobile');

    if (hudDefBadge) hudDefBadge.textContent = badgeText;
    if (labelDefMobile) labelDefMobile.textContent = badgeText;
    if (labelDefDesktop) labelDefDesktop.textContent = badgeText;
    if (btnDefDesktop) btnDefDesktop.classList.toggle('active-peach', this.graphicsDef === 'low');
    if (btnDefMobile) btnDefMobile.classList.toggle('active-peach', this.graphicsDef === 'low');

    if (this.renderer) {
      const targetPR = this.graphicsDef === 'low' ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75);
      this.renderer.setPixelRatio(targetPR);
      this.renderer.shadowMap.enabled = this.graphicsDef === 'high';
      if (this.mainSpotLight) {
        this.mainSpotLight.castShadow = this.graphicsDef === 'high';
      }
      this.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          obj.material.needsUpdate = true;
        }
      });
    }

    this.adaptCameraToScreenAspect(false);
    if (rebuildEnv && this.currentRealm) {
      this.setEnvironmentRealm(this.currentRealm, true);
    }
  }

  /**
   * Applies the player's chosen side of the board ('w' for Pearl/South or 'b' for Lilac/North),
   * rotates the 3D camera to face their side, and triggers the Automaton if it is the AI's turn.
   */
  applyPlayerSide(side, triggerAIIfNeeded = false) {
    this.playerColor = side === 'b' ? 'b' : 'w';

    const cardWhite = document.getElementById('card-side-white');
    const cardBlack = document.getElementById('card-side-black');
    if (cardWhite && cardBlack) {
      if (this.playerColor === 'b') {
        cardBlack.classList.add('selected-device');
        cardWhite.classList.remove('selected-device');
        const bCheck = cardBlack.querySelector('.side-check');
        const wCheck = cardWhite.querySelector('.side-check');
        if (bCheck) bCheck.classList.remove('hidden');
        if (wCheck) wCheck.classList.add('hidden');
      } else {
        cardWhite.classList.add('selected-device');
        cardBlack.classList.remove('selected-device');
        const bCheck = cardBlack.querySelector('.side-check');
        const wCheck = cardWhite.querySelector('.side-check');
        if (wCheck) wCheck.classList.remove('hidden');
        if (bCheck) bCheck.classList.add('hidden');
      }
    }

    this.cameraState.savedBeforeAction = null;
    this.cameraState.desiredTheta = this.playerColor === 'b' ? Math.PI : 0;
    this.cameraState.desiredPhi = 0.90;
    this.cameraState.desiredRadius = this.getAspectAdjustedRadius(this.baseRadius);

    ['btn-cam-white', 'btn-cam-black', 'btn-cam-top'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const isActive =
          (this.playerColor === 'w' && id === 'btn-cam-white') ||
          (this.playerColor === 'b' && id === 'btn-cam-black');
        el.classList.toggle('active-peach', isActive);
      }
    });

    this.cursorSquare = this.playerColor === 'b' ? { r: 1, c: 4 } : { r: 6, c: 4 };
    this.updateCursorMeshPosition();

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.clearHighlights();
    this.updateCheckHighlight();
    this.applyPlayerNames();

    if (
      triggerAIIfNeeded &&
      this.hasLaunchedSanctuary &&
      this.gameMode === 'ai' &&
      this.engine.turn !== this.playerColor &&
      !this.isAnimating
    ) {
      this.triggerAITurn();
    }
  }

  /**
   * Synchronizes custom player names from the launcher inputs across all HUD badges,
   * camera buttons, spoils headers, and turn indicators.
   */
  applyPlayerNames() {
    const inputW = document.getElementById('input-name-white');
    const inputB = document.getElementById('input-name-black');

    const rawW = inputW ? inputW.value.trim() : '';
    const rawB = inputB ? inputB.value.trim() : '';

    this.playerNameWhite = rawW || 'Pearl';
    this.playerNameBlack = rawB || 'Lilac';

    const camWhiteLabel = document.getElementById('label-cam-white');
    const camBlackLabel = document.getElementById('label-cam-black');
    if (camWhiteLabel) camWhiteLabel.textContent = this.playerNameWhite;
    if (camBlackLabel) camBlackLabel.textContent = this.playerNameBlack;

    const spoilsWhite = document.getElementById('spoils-title-white');
    const spoilsBlack = document.getElementById('spoils-title-black');
    if (spoilsWhite) spoilsWhite.textContent = `${this.playerNameWhite} Spoils`;
    if (spoilsBlack) spoilsBlack.textContent = `${this.playerNameBlack} Spoils`;

    const sidePill = document.getElementById('selected-side-pill');
    if (sidePill) {
      sidePill.textContent =
        this.playerColor === 'w'
          ? `Playing as ${this.playerNameWhite} (White)`
          : `Playing as ${this.playerNameBlack} (Black)`;
    }

    const hudSideBtnLabel = document.getElementById('label-player-side');
    if (hudSideBtnLabel) {
      hudSideBtnLabel.textContent =
        this.playerColor === 'w'
          ? `Side: ${this.playerNameWhite}`
          : `Side: ${this.playerNameBlack}`;
    }

    this.updateHUD();
  }

  disposeGroupResources(group) {
    if (!group) return;
    const sharedMats = new Set([
      this.matMarble,
      this.matWhiteRune,
      this.matObsidian,
      this.matBlackRune,
      this.matCathedralStone,
      this.matPedestalStone,
      this.boardTrimMat
    ]);

    group.traverse(obj => {
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => {
            if (m && !sharedMats.has(m)) m.dispose();
          });
        } else if (!sharedMats.has(obj.material)) {
          obj.material.dispose();
        }
      }
    });
  }

  initThreeScene() {
    const container = document.getElementById('canvas-container');
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x231f33);
    this.scene.fog = new THREE.FogExp2(0x231f33, 0.017);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 180);

    // Enforces 'highp' shader precision so mobile GPUs never overflow into black NaN pixels on specular highlights
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp'
    });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight(0x5e548e, 1.55);
    this.scene.add(this.ambientLight);

    this.mainSpotLight = new THREE.SpotLight(0xfff1f2, 1.95);
    this.mainSpotLight.position.set(4, 21, 6);
    this.mainSpotLight.angle = Math.PI / 2.8;
    this.mainSpotLight.penumbra = 0.75;
    this.mainSpotLight.decay = 1.1;
    this.mainSpotLight.distance = 75;
    this.mainSpotLight.castShadow = true;
    this.mainSpotLight.shadow.mapSize.width = 1024;
    this.mainSpotLight.shadow.mapSize.height = 1024;
    this.mainSpotLight.shadow.bias = -0.0012;
    this.mainSpotLight.shadow.normalBias = 0.02;
    this.scene.add(this.mainSpotLight);

    this.rimLightWest = new THREE.DirectionalLight(0xe9d5ff, 0.95);
    this.rimLightWest.position.set(-18, 12, -8);
    this.scene.add(this.rimLightWest);

    this.rimLightEast = new THREE.DirectionalLight(0xfed7aa, 0.85);
    this.rimLightEast.position.set(18, 9, 10);
    this.scene.add(this.rimLightEast);

    this.actionLight = new THREE.PointLight(0xfbcfe8, 0, 12);
    this.actionLight.position.set(0, 3, 0);
    this.scene.add(this.actionLight);
  }

  initSharedMaterials() {
    // Soft Pastel Pearl (Light Pieces) & Pastel Dusk Lavender (Dark Pieces)
    // Safe roughness >= 0.30 prevents mobile GPU GGX specular division overflow (black dots)
    const pearlTex = createStoneTexture('#fff5f7', 'rgba(244, 162, 184, 0.20)', 9);
    const lilacSlateTex = createStoneTexture('#483d5e', 'rgba(216, 180, 254, 0.24)', 12);

    this.matMarble = new THREE.MeshStandardMaterial({
      map: pearlTex,
      color: 0xfff7f9,
      roughness: 0.34,
      metalness: 0.04
    });
    this.matWhiteRune = new THREE.MeshStandardMaterial({
      color: 0xfed7aa,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.85,
      roughness: 0.35,
      metalness: 0.35
    });

    this.matObsidian = new THREE.MeshStandardMaterial({
      map: lilacSlateTex,
      color: 0x4f4366,
      roughness: 0.32,
      metalness: 0.24
    });
    this.matBlackRune = new THREE.MeshStandardMaterial({
      color: 0xe9d5ff,
      emissive: 0xc084fc,
      emissiveIntensity: 0.95,
      roughness: 0.35,
      metalness: 0.35
    });

    this.matCathedralStone = new THREE.MeshStandardMaterial({
      color: 0x2e2842,
      roughness: 0.80,
      metalness: 0.10
    });
    this.matPedestalStone = new THREE.MeshStandardMaterial({
      color: 0x3b3354,
      roughness: 0.55,
      metalness: 0.20
    });
  }

  buildChessBoard() {
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);

    const boardSpan = 8 * SQUARE_SIZE;

    // Positioned cleanly below the 64 tiles so there is zero Z-fighting or shadow intersection
    const frameGeo = new THREE.BoxGeometry(boardSpan + 1.3, 0.48, boardSpan + 1.3);
    this.boardFrameMesh = new THREE.Mesh(frameGeo, this.matPedestalStone.clone());
    this.boardFrameMesh.position.y = -0.47;
    this.boardFrameMesh.receiveShadow = true;
    this.boardFrameMesh.castShadow = false;
    this.boardGroup.add(this.boardFrameMesh);

    const trimGeo = new THREE.BoxGeometry(boardSpan + 0.18, 0.48, boardSpan + 0.18);
    this.boardTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf9dcc4,
      roughness: 0.40,
      metalness: 0.45
    });
    this.boardTrimMesh = new THREE.Mesh(trimGeo, this.boardTrimMat);
    this.boardTrimMesh.position.y = -0.46;
    this.boardTrimMesh.castShadow = false;
    this.boardGroup.add(this.boardTrimMesh);

    const upperPedestalGeo = new THREE.CylinderGeometry(5.2, 6.2, 1.4, 8);
    this.upperPedestal = new THREE.Mesh(upperPedestalGeo, this.matPedestalStone);
    this.upperPedestal.position.y = -1.42;
    this.upperPedestal.rotation.y = Math.PI / 8;
    this.upperPedestal.receiveShadow = true;
    this.boardGroup.add(this.upperPedestal);

    const lowerPedestalGeo = new THREE.CylinderGeometry(6.2, 7.6, 1.6, 8);
    this.lowerPedestal = new THREE.Mesh(lowerPedestalGeo, this.matCathedralStone);
    this.lowerPedestal.position.y = -2.82;
    this.lowerPedestal.rotation.y = Math.PI / 8;
    this.lowerPedestal.receiveShadow = true;
    this.boardGroup.add(this.lowerPedestal);

    this.squareMeshes = Array.from({ length: 8 }, () => Array(8).fill(null));
    const squareGeo = new THREE.BoxGeometry(SQUARE_SIZE * 0.985, 0.22, SQUARE_SIZE * 0.985);

    const neutralLightTex = createStoneTexture('#ffffff', 'rgba(244, 162, 184, 0.20)', 10);
    const neutralDarkTex = createStoneTexture('#ffffff', 'rgba(233, 213, 255, 0.22)', 12);

    this.lightSquareMat = new THREE.MeshStandardMaterial({
      map: neutralLightTex,
      color: new THREE.Color('#fdf2f8'),
      roughness: 0.38,
      metalness: 0.04
    });

    this.darkSquareMat = new THREE.MeshStandardMaterial({
      map: neutralDarkTex,
      color: new THREE.Color('#5e548e'),
      roughness: 0.40,
      metalness: 0.10
    });

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const sqMesh = new THREE.Mesh(squareGeo, isLight ? this.lightSquareMat : this.darkSquareMat);
        const worldPos = boardToWorld(r, c);
        sqMesh.position.set(worldPos.x, -0.11, worldPos.z);
        sqMesh.receiveShadow = true;
        sqMesh.castShadow = false;
        sqMesh.userData = { type: 'square', r, c, isLight };
        this.boardGroup.add(sqMesh);
        this.squareMeshes[r][c] = sqMesh;
      }
    }

    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const labelGeo = new THREE.PlaneGeometry(0.42, 0.42);

    for (let i = 0; i < 8; i++) {
      const pos = i * SQUARE_SIZE - BOARD_OFFSET;
      const fileMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture(files[i]),
        transparent: true,
        depthWrite: false
      });
      const fFront = new THREE.Mesh(labelGeo, fileMat);
      fFront.rotation.x = -Math.PI / 2;
      fFront.position.set(pos, -0.21, boardSpan / 2 + 0.36);
      this.boardGroup.add(fFront);

      const fBack = new THREE.Mesh(labelGeo, fileMat);
      fBack.rotation.x = -Math.PI / 2;
      fBack.rotation.z = Math.PI;
      fBack.position.set(pos, -0.21, -boardSpan / 2 - 0.36);
      this.boardGroup.add(fBack);

      const rankMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture(ranks[i]),
        transparent: true,
        depthWrite: false
      });
      const rLeft = new THREE.Mesh(labelGeo, rankMat);
      rLeft.rotation.x = -Math.PI / 2;
      rLeft.position.set(-boardSpan / 2 - 0.36, -0.21, pos);
      this.boardGroup.add(rLeft);

      const rRight = new THREE.Mesh(labelGeo, rankMat);
      rRight.rotation.x = -Math.PI / 2;
      rRight.position.set(boardSpan / 2 + 0.36, -0.21, pos);
      this.boardGroup.add(rRight);
    }

    this.indicatorGroup = new THREE.Group();
    this.scene.add(this.indicatorGroup);
  }

  buildCursorMesh() {
    this.cursorGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.50, 0.60, 4);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.rotation.z = Math.PI / 4;
    this.cursorGroup.add(ring);

    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.45, 32),
      new THREE.MeshBasicMaterial({
        color: 0xfed7aa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
      })
    );
    innerRing.rotation.x = -Math.PI / 2;
    this.cursorGroup.add(innerRing);

    this.scene.add(this.cursorGroup);
    this.updateCursorMeshPosition();
  }

  updateCursorMeshPosition() {
    if (!this.cursorGroup) return;
    const pos = boardToWorld(this.cursorSquare.r, this.cursorSquare.c);
    this.cursorGroup.position.set(pos.x, 0.04, pos.z);
  }

  /*************************************************************************
   * 7 PASTEL 3D ENVIRONMENTS (WITH SMOOTH DARK <-> WHITE TRANSITION)
   *************************************************************************/
  setEnvironmentRealm(realmKey, instant = false) {
    if (!REALM_CONFIGS[realmKey]) return;
    this.currentRealm = realmKey;
    const cfg = REALM_CONFIGS[realmKey];

    document.querySelectorAll('.hud-env-btn, .start-env-btn').forEach(btn => {
      btn.classList.toggle('active-peach', btn.getAttribute('data-env') === realmKey);
    });
    const realmLabel = document.getElementById('active-realm-label');
    if (realmLabel) realmLabel.textContent = cfg.name;

    const prevTheme = document.body.getAttribute('data-theme-mode') || 'dark';
    const nextTheme = cfg.themeMode || 'dark';
    document.body.setAttribute('data-theme-mode', nextTheme);

    const veil = document.getElementById('theme-transition-veil');
    if (veil && !instant) {
      const veilColor = nextTheme === 'light'
        ? 'rgba(240, 249, 255, 0.34)'
        : (prevTheme === 'light' ? 'rgba(30, 27, 46, 0.38)' : 'rgba(233, 213, 255, 0.18)');
      document.documentElement.style.setProperty('--veil-color', veilColor);
      veil.classList.add('veil-active');
      if (this.veilTimeout) clearTimeout(this.veilTimeout);
      this.veilTimeout = setTimeout(() => {
        veil.classList.remove('veil-active');
      }, 360);
    }

    if (instant) {
      this.scene.background.setHex(cfg.bgHex);
      this.scene.fog.color.setHex(cfg.bgHex);
      this.scene.fog.density = cfg.fogDensity;

      this.ambientLight.color.setHex(cfg.ambientHex);
      this.ambientLight.intensity = cfg.ambientIntensity;
      this.mainSpotLight.color.setHex(cfg.spotHex);
      this.mainSpotLight.intensity = cfg.spotIntensity;
      this.rimLightWest.color.setHex(cfg.rimWestHex);
      this.rimLightEast.color.setHex(cfg.rimEastHex);

      this.boardFrameMesh.material.color.setHex(cfg.frameColor);
      this.boardTrimMat.color.setHex(cfg.trimColor);
      this.lightSquareMat.color.set(cfg.lightSqBase);
      this.darkSquareMat.color.set(cfg.darkSqBase);
      this.themeTransition.active = false;
    } else {
      const tt = this.themeTransition;
      tt.active = true;
      tt.elapsed = 0;
      tt.duration = 0.58;

      tt.fromBg.copy(this.scene.background);
      tt.toBg.setHex(cfg.bgHex);
      tt.fromFog.copy(this.scene.fog.color);
      tt.toFog.setHex(cfg.bgHex);
      tt.fromFogDensity = this.scene.fog.density;
      tt.toFogDensity = cfg.fogDensity;

      tt.fromAmbient.copy(this.ambientLight.color);
      tt.toAmbient.setHex(cfg.ambientHex);
      tt.fromAmbientInt = this.ambientLight.intensity;
      tt.toAmbientInt = cfg.ambientIntensity;

      tt.fromSpot.copy(this.mainSpotLight.color);
      tt.toSpot.setHex(cfg.spotHex);
      tt.fromSpotInt = this.mainSpotLight.intensity;
      tt.toSpotInt = cfg.spotIntensity;

      tt.fromRimW.copy(this.rimLightWest.color);
      tt.toRimW.setHex(cfg.rimWestHex);
      tt.fromRimE.copy(this.rimLightEast.color);
      tt.toRimE.setHex(cfg.rimEastHex);

      tt.fromFrame.copy(this.boardFrameMesh.material.color);
      tt.toFrame.setHex(cfg.frameColor);
      tt.fromTrim.copy(this.boardTrimMat.color);
      tt.toTrim.setHex(cfg.trimColor);

      tt.fromLightTint.copy(this.lightSquareMat.color);
      tt.toLightTint.set(cfg.lightSqBase);
      tt.fromDarkTint.copy(this.darkSquareMat.color);
      tt.toDarkTint.set(cfg.darkSqBase);
    }

    // Clamp roughness >= 0.30 across all realms to prevent mobile WebGL specular black spots
    this.lightSquareMat.roughness = realmKey === 'space' ? 0.30 : 0.38;
    this.lightSquareMat.metalness = realmKey === 'space' ? 0.22 : 0.04;
    this.darkSquareMat.roughness = realmKey === 'space' ? 0.32 : 0.40;
    this.darkSquareMat.metalness = realmKey === 'space' ? 0.24 : 0.10;

    if (this.envGroup) {
      this.scene.remove(this.envGroup);
      this.disposeGroupResources(this.envGroup);
    }
    this.envGroup = new THREE.Group();
    this.scene.add(this.envGroup);

    this.oceanMesh = null;
    this.oceanBasePositions = null;
    this.grassInstancedMesh = null;
    this.grassDummyMatrices = [];
    this.fallingLeaves = [];
    this.envParticles = null;
    this.spaceRings = [];

    this.lowerPedestal.visible = realmKey !== 'space';

    if (realmKey === 'cathedral') this.buildRealmCathedral();
    else if (realmKey === 'night') this.buildRealmNightGlade();
    else if (realmKey === 'day') this.buildRealmSunlitDay();
    else if (realmKey === 'grass') this.buildRealmVerdantGrass();
    else if (realmKey === 'ocean') this.buildRealmOceanWaves();
    else if (realmKey === 'space') this.buildRealmDeepSpace();
    else if (realmKey === 'sand') this.buildRealmGoldenSand();
  }

  updateThemeTransition(dt) {
    const tt = this.themeTransition;
    if (!tt.active) return;

    tt.elapsed += dt;
    const rawT = Math.min(1, tt.elapsed / tt.duration);
    const ease = rawT < 0.5
      ? 4 * rawT * rawT * rawT
      : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

    this.scene.background.copy(tt.fromBg).lerp(tt.toBg, ease);
    this.scene.fog.color.copy(tt.fromFog).lerp(tt.toFog, ease);
    this.scene.fog.density = tt.fromFogDensity + (tt.toFogDensity - tt.fromFogDensity) * ease;

    this.ambientLight.color.copy(tt.fromAmbient).lerp(tt.toAmbient, ease);
    this.ambientLight.intensity = tt.fromAmbientInt + (tt.toAmbientInt - tt.fromAmbientInt) * ease;

    this.mainSpotLight.color.copy(tt.fromSpot).lerp(tt.toSpot, ease);
    this.mainSpotLight.intensity = tt.fromSpotInt + (tt.toSpotInt - tt.fromSpotInt) * ease;

    this.rimLightWest.color.copy(tt.fromRimW).lerp(tt.toRimW, ease);
    this.rimLightEast.color.copy(tt.fromRimE).lerp(tt.toRimE, ease);

    this.boardFrameMesh.material.color.copy(tt.fromFrame).lerp(tt.toFrame, ease);
    this.boardTrimMat.color.copy(tt.fromTrim).lerp(tt.toTrim, ease);

    this.lightSquareMat.color.copy(tt.fromLightTint).lerp(tt.toLightTint, ease);
    this.darkSquareMat.color.copy(tt.fromDarkTint).lerp(tt.toDarkTint, ease);

    if (rawT >= 1) {
      tt.active = false;
    }
  }

  buildRealmCathedral() {
    const isLow = this.graphicsDef === 'low';
    const floorGeo = new THREE.CylinderGeometry(48, 48, 0.5, isLow ? 28 : 48);
    const floorMesh = new THREE.Mesh(floorGeo, this.matCathedralStone);
    floorMesh.position.y = -3.6;
    floorMesh.receiveShadow = !isLow;
    this.envGroup.add(floorMesh);

    const inlayMesh = new THREE.Mesh(
      new THREE.RingGeometry(8.2, 8.6, isLow ? 32 : 64),
      new THREE.MeshBasicMaterial({ color: 0xfed7aa, side: THREE.DoubleSide, transparent: true, opacity: 0.30 })
    );
    inlayMesh.rotation.x = -Math.PI / 2;
    inlayMesh.position.y = -3.32;
    this.envGroup.add(inlayMesh);

    const numPillars = 12;
    const radius = 22;
    for (let i = 0; i < numPillars; i++) {
      const angle = (i / numPillars) * Math.PI * 2;
      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(Math.cos(angle) * radius, -3.4, Math.sin(angle) * radius);
      pillarGroup.lookAt(0, -3.4, 0);

      const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 26, isLow ? 8 : 12), this.matCathedralStone);
      colMesh.position.y = 13;
      pillarGroup.add(colMesh);

      const archCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 21, 0),
        new THREE.Vector3(0, 28, 9),
        new THREE.Vector3(0, 31, radius)
      );
      const archMesh = new THREE.Mesh(new THREE.TubeGeometry(archCurve, isLow ? 8 : 12, 0.28, isLow ? 6 : 8, false), this.matCathedralStone);
      pillarGroup.add(archMesh);

      if (i % 2 === 0) {
        const glassColor = i % 4 === 0 ? 0xfbcfe8 : 0xe9d5ff;
        const rayMat = new THREE.MeshBasicMaterial({
          color: glassColor,
          transparent: true,
          opacity: 0.035,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const ray = new THREE.Mesh(new THREE.ConeGeometry(3.2, 18, isLow ? 8 : 12, 1, true), rayMat);
        ray.position.set(0, 11, 2.3);
        ray.rotation.x = -Math.PI / 3.4;
        pillarGroup.add(ray);
      }
      this.envGroup.add(pillarGroup);
    }

    this.createAmbientParticles(isLow ? 75 : 180, 0xfed7aa, 0.09, 28);
  }

  buildRealmNightGlade() {
    const isLow = this.graphicsDef === 'low';
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x222642, roughness: 0.85, metalness: 0.1 });
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(55, 55, 0.6, isLow ? 28 : 48), groundMat);
    ground.position.y = -3.6;
    ground.receiveShadow = !isLow;
    this.envGroup.add(ground);

    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(4.0, isLow ? 16 : 24, isLow ? 16 : 24), moonMat);
    moon.position.set(-22, 24, -36);
    this.envGroup.add(moon);

    const moonHalo = new THREE.Mesh(
      new THREE.RingGeometry(4.1, 7.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd, side: THREE.DoubleSide, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })
    );
    moonHalo.position.copy(moon.position);
    moonHalo.lookAt(0, 0, 0);
    this.envGroup.add(moonHalo);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const dist = 16 + (i % 2) * 4;
      const x = Math.cos(ang) * dist;
      const z = Math.sin(ang) * dist;

      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 4.5 + (i % 3), 0.7),
        new THREE.MeshStandardMaterial({ color: 0x333963, roughness: 0.6 })
      );
      stone.position.set(x, -1.2, z);
      stone.lookAt(0, -1.2, 0);
      this.envGroup.add(stone);

      const runeCrystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.MeshBasicMaterial({ color: 0xbae6fd })
      );
      runeCrystal.position.set(x, 1.8 + (i % 3) * 0.5, z);
      this.envGroup.add(runeCrystal);
    }

    this.createStarfieldDome(isLow ? 260 : 600, 0xe0f2fe);
    this.createAmbientParticles(isLow ? 85 : 200, 0xbbf7d0, 0.11, 24);
  }

  buildRealmSunlitDay() {
    const isLow = this.graphicsDef === 'low';
    const poolMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.30, metalness: 0.20 });
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(52, 52, 0.4, isLow ? 28 : 48), poolMat);
    pool.position.y = -3.55;
    pool.receiveShadow = !isLow;
    this.envGroup.add(pool);

    const whiteColMat = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.35, metalness: 0.05 });
    const plazaRing = new THREE.Mesh(new THREE.RingGeometry(7.2, 16.5, isLow ? 28 : 48), whiteColMat);
    plazaRing.rotation.x = -Math.PI / 2;
    plazaRing.position.y = -3.32;
    this.envGroup.add(plazaRing);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 9.5, isLow ? 10 : 14), whiteColMat);
      col.position.set(Math.cos(ang) * 15, 1.4, Math.sin(ang) * 15);
      this.envGroup.add(col);
    }

    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.88 });
    for (let c = 0; c < 12; c++) {
      const cloudGroup = new THREE.Group();
      const ang = (c / 12) * Math.PI * 2;
      const dist = 24 + (c % 3) * 8;
      cloudGroup.position.set(Math.cos(ang) * dist, 11 + (c % 4) * 2.5, Math.sin(ang) * dist);
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.6 + Math.random() * 1.1, isLow ? 7 : 10, isLow ? 7 : 10), cloudMat);
        puff.position.set((p - 1) * 1.4, Math.random() * 0.5, (Math.random() - 0.5) * 1.1);
        cloudGroup.add(puff);
      }
      this.envGroup.add(cloudGroup);
      this.spaceRings.push({ mesh: cloudGroup, speed: 0.035 + (c % 3) * 0.015, isCloud: true });
    }

    this.createAmbientParticles(isLow ? 70 : 160, 0xfef3c7, 0.09, 26);
  }

  buildRealmVerdantGrass() {
    const isLow = this.graphicsDef === 'low';
    const meadowMat = new THREE.MeshStandardMaterial({ color: 0x3b594f, roughness: 0.88, metalness: 0.05 });
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 0.8, isLow ? 28 : 48), meadowMat);
    ground.position.y = -3.5;
    ground.receiveShadow = !isLow;
    this.envGroup.add(ground);

    const bladeCount = isLow ? 800 : 2400;
    const animatedBladesLimit = isLow ? 140 : 450;
    const bladeGeo = new THREE.ConeGeometry(0.08, 0.9, 4);
    bladeGeo.translate(0, 0.45, 0);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xa7f3d0,
      roughness: 0.55,
      metalness: 0.05
    });

    this.grassInstancedMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, bladeCount);
    const dummy = this.reusableDummy;
    const colorVar = new THREE.Color();
    this.grassDummyMatrices = [];

    for (let i = 0; i < bladeCount; i++) {
      const rDist = 6.2 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * rDist;
      const z = Math.sin(theta) * rDist;
      const scaleY = 0.6 + Math.random() * 1.0;
      const rotY = Math.random() * Math.PI * 2;

      dummy.position.set(x, -3.12, z);
      dummy.rotation.set((Math.random() - 0.5) * 0.2, rotY, (Math.random() - 0.5) * 0.2);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      this.grassInstancedMesh.setMatrixAt(i, dummy.matrix);

      colorVar.setHSL(0.36 + (Math.random() - 0.5) * 0.08, 0.55, 0.58 + Math.random() * 0.18);
      this.grassInstancedMesh.setColorAt(i, colorVar);

      if (i < animatedBladesLimit) {
        this.grassDummyMatrices.push({ index: i, x, z, scaleY, rotY, phase: Math.random() * Math.PI * 2 });
      }
    }
    this.grassInstancedMesh.instanceMatrix.needsUpdate = true;
    if (this.grassInstancedMesh.instanceColor) this.grassInstancedMesh.instanceColor.needsUpdate = true;
    this.envGroup.add(this.grassInstancedMesh);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d5950, roughness: 0.9 });
    const canopyColors = [0xa7f3d0, 0xfbcfe8, 0xfde68a, 0xbae6fd];
    for (let t = 0; t < 14; t++) {
      const ang = (t / 14) * Math.PI * 2;
      const dist = 16.5 + (t % 3) * 4;
      const tree = new THREE.Group();
      tree.position.set(Math.cos(ang) * dist, -3.1, Math.sin(ang) * dist);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.70, 5.2, 8), trunkMat);
      trunk.position.y = 2.6;
      tree.add(trunk);

      const foliageMat = new THREE.MeshStandardMaterial({
        color: canopyColors[t % canopyColors.length],
        roughness: 0.75
      });
      for (let c = 0; c < 3; c++) {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2 - c * 0.4, isLow ? 0 : 1), foliageMat);
        crown.position.set((Math.random() - 0.5) * 0.7, 5.2 + c * 1.3, (Math.random() - 0.5) * 0.7);
        tree.add(crown);
      }
      this.envGroup.add(tree);
    }

    const leafCount = isLow ? 45 : 110;
    const leafGeo = new THREE.PlaneGeometry(0.22, 0.15);
    const leafColors = [0xfbcfe8, 0xbbf7d0, 0xfef3c7, 0xe9d5ff];
    for (let l = 0; l < leafCount; l++) {
      const leafMat = new THREE.MeshBasicMaterial({
        color: leafColors[l % leafColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        (Math.random() - 0.5) * 26,
        -2 + Math.random() * 15,
        (Math.random() - 0.5) * 26
      );
      leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.envGroup.add(leaf);
      this.fallingLeaves.push({
        mesh: leaf,
        speedY: 0.55 + Math.random() * 0.75,
        swayPhase: Math.random() * Math.PI * 2,
        rotSpeed: 1.2 + Math.random() * 2.0
      });
    }
  }

  buildRealmOceanWaves() {
    const isLow = this.graphicsDef === 'low';
    const segs = isLow ? 24 : 44;
    const seaGeo = new THREE.PlaneGeometry(100, 100, segs, segs);
    seaGeo.rotateX(-Math.PI / 2);

    const posAttr = seaGeo.attributes.position;
    this.oceanBasePositions = new Float32Array(posAttr.array.length);
    this.oceanBasePositions.set(posAttr.array);

    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x2b4c65,
      emissiveIntensity: 0.35,
      roughness: 0.30,
      metalness: 0.35,
      flatShading: true
    });

    this.oceanMesh = new THREE.Mesh(seaGeo, seaMat);
    this.oceanMesh.position.y = -2.15;
    this.oceanMesh.receiveShadow = !isLow;
    this.envGroup.add(this.oceanMesh);

    const spireMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.40, metalness: 0.30 });
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc });
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const dist = 17 + (i % 2) * 5;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 9 + (i % 3) * 2.5, 6), spireMat);
      spire.position.set(Math.cos(ang) * dist, 0.5, Math.sin(ang) * dist);
      this.envGroup.add(spire);

      const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), crystalMat);
      beacon.position.set(Math.cos(ang) * dist, 5.6 + (i % 3) * 1.3, Math.sin(ang) * dist);
      this.envGroup.add(beacon);
    }

    this.createAmbientParticles(isLow ? 80 : 180, 0xa5f3fc, 0.1, 28);
  }

  buildRealmDeepSpace() {
    const isLow = this.graphicsDef === 'low';
    this.createStarfieldDome(isLow ? 380 : 900, 0xf5f3ff);

    const ringConfigs = [
      { rIn: 9.5, rOut: 10.2, color: 0xe9d5ff, tiltX: 0.35, tiltZ: -0.2, speed: 0.16 },
      { rIn: 12.5, rOut: 13.5, color: 0xbae6fd, tiltX: -0.45, tiltZ: 0.3, speed: -0.11 },
      { rIn: 16.2, rOut: 16.8, color: 0xfbcfe8, tiltX: 0.2, tiltZ: 0.5, speed: 0.08 }
    ];

    for (const rc of ringConfigs) {
      const ringGeo = new THREE.RingGeometry(rc.rIn, rc.rOut, isLow ? 32 : 56);
      const ringMat = new THREE.MeshBasicMaterial({
        color: rc.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + rc.tiltX;
      ring.rotation.y = rc.tiltZ;
      this.envGroup.add(ring);
      this.spaceRings.push({ mesh: ring, speed: rc.speed });
    }

    const astGroup = new THREE.Group();
    const astMat = new THREE.MeshStandardMaterial({ color: 0xcddafd, roughness: 0.6, metalness: 0.2 });
    const astCount = isLow ? 36 : 70;
    for (let a = 0; a < astCount; a++) {
      const ang = (a / astCount) * Math.PI * 2;
      const rad = 11.5 + (Math.random() - 0.5) * 4.2;
      const ast = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + Math.random() * 0.32, 0), astMat);
      ast.position.set(Math.cos(ang) * rad, (Math.random() - 0.5) * 3.2, Math.sin(ang) * rad);
      ast.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      astGroup.add(ast);
    }
    this.envGroup.add(astGroup);
    this.spaceRings.push({ mesh: astGroup, speed: 0.12, isYOrbit: true });

    this.createAmbientParticles(isLow ? 95 : 220, 0xe9d5ff, 0.11, 30);
  }

  buildRealmGoldenSand() {
    const isLow = this.graphicsDef === 'low';
    const segs = isLow ? 26 : 48;
    const sandGeo = new THREE.PlaneGeometry(100, 100, segs, segs);
    sandGeo.rotateX(-Math.PI / 2);
    const pos = sandGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const dist = Math.hypot(vx, vz);
      if (dist > 8.5) {
        const duneHeight =
          Math.sin(vx * 0.14 + vz * 0.08) * 1.5 +
          Math.cos(vz * 0.18) * 1.0;
        pos.setY(i, duneHeight * Math.min(1, (dist - 8.5) / 8));
      }
    }
    sandGeo.computeVertexNormals();

    const sandTex = createStoneTexture('#f9dcc4', 'rgba(244, 162, 184, 0.20)', 14);
    const sandMat = new THREE.MeshStandardMaterial({
      map: sandTex,
      color: 0xfed7aa,
      roughness: 0.82,
      metalness: 0.06
    });

    const dunesMesh = new THREE.Mesh(sandGeo, sandMat);
    dunesMesh.position.y = -3.1;
    dunesMesh.receiveShadow = !isLow;
    this.envGroup.add(dunesMesh);

    const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x9d756d, roughness: 0.7 });
    const goldCapMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.35, metalness: 0.5 });

    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + 0.2;
      const dist = 17.5;
      const obGroup = new THREE.Group();
      obGroup.position.set(Math.cos(ang) * dist, -3.1, Math.sin(ang) * dist);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 8.2, 4), obeliskMat);
      pillar.position.y = 4.1;
      obGroup.add(pillar);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.1, 4), goldCapMat);
      cap.position.y = 8.75;
      obGroup.add(cap);

      this.envGroup.add(obGroup);
    }

    for (const [px, pz, scale] of [[-28, -32, 10], [32, -26, 8.5], [0, -38, 13]]) {
      const pyr = new THREE.Mesh(new THREE.ConeGeometry(scale, scale * 1.1, 4), obeliskMat);
      pyr.position.set(px, -3.1 + (scale * 1.1) / 2, pz);
      pyr.rotation.y = Math.PI / 4;
      this.envGroup.add(pyr);
    }

    this.createAmbientParticles(isLow ? 80 : 180, 0xfed7aa, 0.09, 28);
  }

  createStarfieldDome(count, colorHex) {
    const starPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 45 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.65;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi) + 4;
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.22,
      transparent: true,
      opacity: 0.85
    });
    this.envGroup.add(new THREE.Points(geo, mat));
  }

  createAmbientParticles(count, colorHex, size, spread) {
    const posArray = new Float32Array(count * 3);
    const speedArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * spread;
      posArray[i * 3 + 1] = -2 + Math.random() * 14;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * spread;
      speedArray[i] = 0.16 + Math.random() * 0.30;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speedArray, 1));

    const particleMat = new THREE.PointsMaterial({
      color: colorHex,
      size,
      transparent: true,
      opacity: 0.60,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.envParticles = new THREE.Points(particleGeo, particleMat);
    this.envGroup.add(this.envParticles);
  }

  /*************************************************************************
   * PROCEDURAL 3D PASTEL CHESS PIECES
   *************************************************************************/
  createPieceMesh(type, color, id) {
    const group = new THREE.Group();
    const bodyGroup = new THREE.Group();
    group.add(bodyGroup);

    const matStone = color === 'w' ? this.matMarble : this.matObsidian;
    const matRune = (color === 'w' ? this.matWhiteRune : this.matBlackRune).clone();
    const castShadows = this.graphicsDef === 'high';

    const baseBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.52, 0.14, 20), matStone);
    baseBottom.position.y = 0.07;
    baseBottom.castShadow = castShadows;
    baseBottom.receiveShadow = castShadows;
    group.add(baseBottom);

    const baseBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.12, 20), matStone);
    baseBevel.position.y = 0.19;
    baseBevel.castShadow = castShadows;
    group.add(baseBevel);

    const runeRing = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.026, 10, 28), matRune);
    runeRing.rotation.x = Math.PI / 2;
    runeRing.position.y = 0.25;
    group.add(runeRing);

    const accentGroup = new THREE.Group();
    bodyGroup.add(accentGroup);

    const addCastShadow = (mesh) => {
      mesh.castShadow = castShadows;
      mesh.receiveShadow = castShadows;
      return mesh;
    };

    if (type === 'p') {
      const torso = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 0.56, 18), matStone));
      torso.position.y = 0.52;
      bodyGroup.add(torso);

      const collar = addCastShadow(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 20), matStone));
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.8;
      bodyGroup.add(collar);

      const helm = addCastShadow(new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 18), matStone));
      helm.position.y = 1.02;
      bodyGroup.add(helm);

      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), matRune);
      orb.position.y = 1.32;
      accentGroup.add(orb);
    } else if (type === 'r') {
      const tower = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.39, 0.88, 12), matStone));
      tower.position.y = 0.68;
      bodyGroup.add(tower);

      const parapet = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.34, 0.22, 12), matStone));
      parapet.position.y = 1.18;
      bodyGroup.add(parapet);

      const merlonGeo = new THREE.BoxGeometry(0.13, 0.18, 0.13);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const merlon = addCastShadow(new THREE.Mesh(merlonGeo, matStone));
        merlon.position.set(Math.cos(ang) * 0.29, 1.35, Math.sin(ang) * 0.29);
        merlon.rotation.y = -ang;
        bodyGroup.add(merlon);
      }

      const brazier = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), matRune);
      brazier.position.y = 1.44;
      accentGroup.add(brazier);
    } else if (type === 'n') {
      const ped = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.37, 0.45, 16), matStone));
      ped.position.y = 0.46;
      bodyGroup.add(ped);

      const neck = addCastShadow(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.68, 0.42), matStone));
      neck.position.set(0, 0.92, 0.04);
      neck.rotation.x = 0.28;
      bodyGroup.add(neck);

      const forwardSign = color === 'w' ? -1 : 1;
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.24, 0);
      if (forwardSign === 1) headGroup.rotation.y = Math.PI;

      const snout = addCastShadow(new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.56, 6), matStone));
      snout.rotation.x = -Math.PI / 2.4;
      snout.position.set(0, 0.04, -0.18);
      headGroup.add(snout);

      const earGeo = new THREE.ConeGeometry(0.06, 0.2, 4);
      for (const ex of [-0.1, 0.1]) {
        const ear = addCastShadow(new THREE.Mesh(earGeo, matStone));
        ear.position.set(ex, 0.22, 0.05);
        ear.rotation.x = -0.2;
        headGroup.add(ear);
      }

      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.12), matRune);
      mane.position.set(0, -0.08, 0.19);
      mane.rotation.x = 0.25;
      headGroup.add(mane);

      bodyGroup.add(headGroup);
      accentGroup.add(headGroup);
    } else if (type === 'b') {
      const robe = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.37, 0.92, 18), matStone));
      robe.position.y = 0.7;
      bodyGroup.add(robe);

      const mitre = addCastShadow(new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.54, 16), matStone));
      mitre.position.y = 1.38;
      bodyGroup.add(mitre);

      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 10, 24), matRune);
      halo.position.y = 1.38;
      halo.rotation.x = Math.PI / 3;
      accentGroup.add(halo);

      const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), matRune);
      finial.position.y = 1.72;
      accentGroup.add(finial);
    } else if (type === 'q') {
      const lowerGown = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.39, 0.68, 20), matStone));
      lowerGown.position.y = 0.58;
      bodyGroup.add(lowerGown);

      const upperBodice = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.21, 0.52, 20), matStone));
      upperBodice.position.y = 1.15;
      bodyGroup.add(upperBodice);

      const dome = addCastShadow(new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), matStone));
      dome.position.y = 1.46;
      bodyGroup.add(dome);

      const crownRing = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 10, 28), matRune);
      crownRing.rotation.x = Math.PI / 2;
      crownRing.position.y = 1.62;
      accentGroup.add(crownRing);

      const spikeGeo = new THREE.ConeGeometry(0.045, 0.2, 6);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const spike = addCastShadow(new THREE.Mesh(spikeGeo, matStone));
        spike.position.set(Math.cos(ang) * 0.24, 1.68, Math.sin(ang) * 0.24);
        accentGroup.add(spike);
      }

      const pearl = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), matRune);
      pearl.position.y = 1.84;
      accentGroup.add(pearl);
    } else if (type === 'k') {
      const pillar = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.41, 0.82, 16), matStone));
      pillar.position.y = 0.65;
      bodyGroup.add(pillar);

      const mantle = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.26, 0.45, 8), matStone));
      mantle.position.y = 1.25;
      bodyGroup.add(mantle);

      const crownBase = addCastShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 8), matStone));
      crownBase.position.y = 1.56;
      bodyGroup.add(crownBase);

      const kingRuneBand = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.032, 10, 24), matRune);
      kingRuneBand.rotation.x = Math.PI / 2;
      kingRuneBand.position.y = 1.56;
      accentGroup.add(kingRuneBand);

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.36, 0.09), matRune);
      crossV.position.y = 1.88;
      accentGroup.add(crossV);

      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.09), matRune);
      crossH.position.y = 1.92;
      accentGroup.add(crossH);
    }

    group.userData = {
      id,
      type,
      color,
      bodyGroup,
      accentGroup,
      runeRing,
      matRune,
      matStone,
      phaseOffset: Math.random() * Math.PI * 2,
      baseY: 0,
      isSelected: false
    };

    group.traverse(child => {
      if (child.isMesh) child.userData.pieceGroup = group;
    });

    return group;
  }

  rebuildInteractablesCache() {
    this.cachedInteractables = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        this.cachedInteractables.push(this.squareMeshes[r][c]);
      }
    }
    for (const [, pGroup] of this.pieceMeshes) {
      pGroup.traverse(ch => {
        if (ch.isMesh) this.cachedInteractables.push(ch);
      });
    }
    this.interactablesDirty = false;
  }

  syncPiecesWithEngine() {
    for (const [, mesh] of this.pieceMeshes) {
      this.scene.remove(mesh);
      this.disposeGroupResources(mesh);
    }
    this.pieceMeshes.clear();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.engine.board[r][c];
        if (!p) continue;
        const mesh = this.createPieceMesh(p.type, p.color, p.id);
        const worldPos = boardToWorld(r, c);
        mesh.position.copy(worldPos);
        mesh.userData.r = r;
        mesh.userData.c = c;
        this.scene.add(mesh);
        this.pieceMeshes.set(p.id, mesh);
      }
    }

    this.interactablesDirty = true;
    this.clearHighlights();
    this.updateCheckHighlight();
  }

  clearHighlights() {
    while (this.indicatorGroup.children.length > 0) {
      const ch = this.indicatorGroup.children[0];
      this.indicatorGroup.remove(ch);
      if (ch.geometry) ch.geometry.dispose();
      if (ch.material) ch.material.dispose();
    }
    for (const [, mesh] of this.pieceMeshes) {
      mesh.userData.isSelected = false;
    }
  }

  showLegalMoveHighlights(r, c, moves) {
    this.clearHighlights();
    this.updateCheckHighlight();

    const selPos = boardToWorld(r, c);
    const selRing = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.56, 32),
      new THREE.MeshBasicMaterial({ color: 0xfed7aa, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false })
    );
    selRing.rotation.x = -Math.PI / 2;
    selRing.position.set(selPos.x, 0.02, selPos.z);
    this.indicatorGroup.add(selRing);

    const pieceData = this.engine.board[r][c];
    if (pieceData && this.pieceMeshes.has(pieceData.id)) {
      this.pieceMeshes.get(pieceData.id).userData.isSelected = true;
    }

    for (const m of moves) {
      const pos = boardToWorld(m.toR, m.toC);
      const isCapture = Boolean(m.captured);

      if (isCapture) {
        const outerRing = new THREE.Mesh(
          new THREE.RingGeometry(0.48, 0.6, 6),
          new THREE.MeshBasicMaterial({ color: 0xf9a8d4, side: THREE.DoubleSide, transparent: true, opacity: 0.92, depthWrite: false })
        );
        outerRing.rotation.x = -Math.PI / 2;
        outerRing.position.set(pos.x, 0.03, pos.z);
        outerRing.userData = { isPulseIndicator: true };
        this.indicatorGroup.add(outerRing);
      } else {
        const dot = new THREE.Mesh(
          new THREE.RingGeometry(0.12, 0.25, 24),
          new THREE.MeshBasicMaterial({ color: 0xbbf7d0, side: THREE.DoubleSide, transparent: true, opacity: 0.88, depthWrite: false })
        );
        dot.rotation.x = -Math.PI / 2;
        dot.position.set(pos.x, 0.025, pos.z);
        dot.userData = { isPulseIndicator: true };
        this.indicatorGroup.add(dot);
      }
    }
  }

  updateCheckHighlight() {
    const prev = this.indicatorGroup.getObjectByName('check-aura');
    if (prev) {
      this.indicatorGroup.remove(prev);
      if (prev.geometry) prev.geometry.dispose();
      if (prev.material) prev.material.dispose();
    }

    if (this.engine.isInCheck(this.engine.turn)) {
      const kingPos = this.engine.findKing(this.engine.turn);
      if (kingPos) {
        const worldPos = boardToWorld(kingPos.r, kingPos.c);
        const aura = new THREE.Mesh(
          new THREE.RingGeometry(0.32, 0.64, 32),
          new THREE.MeshBasicMaterial({ color: 0xf472b6, side: THREE.DoubleSide, transparent: true, opacity: 0.88, depthWrite: false })
        );
        aura.name = 'check-aura';
        aura.rotation.x = -Math.PI / 2;
        aura.position.set(worldPos.x, 0.035, worldPos.z);
        aura.userData = { isPulseIndicator: true };
        this.indicatorGroup.add(aura);
      }
    }
  }

  /*************************************************************************
   * 3D PHYSICS STONE SHATTER EXPLOSION
   *************************************************************************/
  spawnShatterExplosion(worldPos, victimColor, attackDir) {
    const matStone = victimColor === 'w' ? this.matMarble : this.matObsidian;
    const matRune = victimColor === 'w' ? this.matWhiteRune : this.matBlackRune;

    const shardCount = this.graphicsDef === 'low' ? 16 : 34;
    for (let i = 0; i < shardCount; i++) {
      const isRuneShard = i % 5 === 0;
      const scale = 0.08 + Math.random() * 0.15;

      const geo = i % 2 === 0
        ? new THREE.DodecahedronGeometry(scale, 0)
        : new THREE.TetrahedronGeometry(scale * 1.2, 0);

      geo.scale(0.6 + Math.random() * 0.9, 0.5 + Math.random() * 1.1, 0.6 + Math.random() * 0.9);

      const mat = (isRuneShard ? matRune : matStone).clone();
      mat.transparent = true;
      mat.opacity = 1.0;

      const shard = new THREE.Mesh(geo, mat);
      shard.position.set(
        worldPos.x + (Math.random() - 0.5) * 0.45,
        0.18 + Math.random() * 1.25,
        worldPos.z + (Math.random() - 0.5) * 0.45
      );
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const radialAngle = Math.random() * Math.PI * 2;
      const radialSpeed = 1.5 + Math.random() * 4.2;
      const vel = new THREE.Vector3(
        Math.cos(radialAngle) * radialSpeed + attackDir.x * (2.0 + Math.random() * 2.2),
        2.2 + Math.random() * 4.4,
        Math.sin(radialAngle) * radialSpeed + attackDir.z * (2.0 + Math.random() * 2.2)
      );

      const rotVel = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      this.scene.add(shard);
      this.shatterFragments.push({
        mesh: shard,
        vel,
        rotVel,
        age: 0,
        maxAge: 2.4 + Math.random() * 1.0
      });
    }

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.34, 32),
      new THREE.MeshBasicMaterial({
        color: victimColor === 'w' ? 0xe9d5ff : 0xfed7aa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(worldPos.x, 0.05, worldPos.z);
    this.scene.add(ringMesh);
    this.shockwaves.push({ mesh: ringMesh, age: 0, maxAge: 0.60 });

    this.actionLight.position.set(worldPos.x, 2.2, worldPos.z);
    this.actionLight.color.setHex(victimColor === 'w' ? 0xe9d5ff : 0xfed7aa);
    this.actionLight.intensity = 4.5;
    this.cameraState.shakeIntensity = 0.25;
  }

  spawnTrailSpark(pos, color) {
    if (this.graphicsDef === 'low' && Math.random() < 0.55) return;
    const spark = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.05, 0),
      new THREE.MeshBasicMaterial({
        color: color === 'w' ? 0xfed7aa : 0xe9d5ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    spark.position.set(
      pos.x + (Math.random() - 0.5) * 0.35,
      pos.y + 0.15 + Math.random() * 0.5,
      pos.z + (Math.random() - 0.5) * 0.35
    );
    this.scene.add(spark);
    this.trailParticles.push({
      mesh: spark,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, 0.7 + Math.random() * 0.7, (Math.random() - 0.5) * 0.5),
      age: 0,
      maxAge: 0.40 + Math.random() * 0.20
    });
  }

  /*************************************************************************
   * CHOREOGRAPHED MOVE & SHATTER ANIMATION PIPELINE
   *************************************************************************/
  async executeMoveWithAnimation(move, chosenPromotion = null) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.clearHighlights();

    this.cursorSquare = { r: move.toR, c: move.toC };
    this.updateCursorMeshPosition();

    const attackerMesh = this.pieceMeshes.get(move.piece.id);
    const victimPiece = move.isEnPassant
      ? this.engine.board[move.epCaptureR][move.epCaptureC]
      : this.engine.board[move.toR][move.toC];
    const victimMesh = victimPiece ? this.pieceMeshes.get(victimPiece.id) : null;

    const startPos = boardToWorld(move.fromR, move.fromC);
    const endPos = boardToWorld(move.toR, move.toC);
    const victimPos = move.isEnPassant
      ? boardToWorld(move.epCaptureR, move.epCaptureC)
      : endPos.clone();

    const isJump = move.piece.type === 'n';
    const isCapture = Boolean(victimMesh);

    if (!isCapture) {
      const duration = 0.42;
      soundFX.playStoneSlide(duration, isJump);

      let rookMesh = null, rookStart = null, rookEnd = null;
      if (move.isCastle) {
        const rookPiece = this.engine.board[move.fromR][move.rookFromC];
        if (rookPiece) {
          rookMesh = this.pieceMeshes.get(rookPiece.id);
          rookStart = boardToWorld(move.fromR, move.rookFromC);
          rookEnd = boardToWorld(move.fromR, move.rookToC);
        }
      }

      await this.tweenProgress(duration, (t) => {
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        if (attackerMesh) {
          attackerMesh.position.lerpVectors(startPos, endPos, ease);
          if (isJump) {
            attackerMesh.position.y = Math.sin(t * Math.PI) * 1.55;
            attackerMesh.userData.bodyGroup.rotation.x = Math.sin(t * Math.PI) * 0.30;
          }
          if (Math.random() < 0.35) this.spawnTrailSpark(attackerMesh.position, move.piece.color);
        }
        if (rookMesh) rookMesh.position.lerpVectors(rookStart, rookEnd, ease);
      });

      if (attackerMesh) {
        attackerMesh.position.copy(endPos);
        attackerMesh.userData.bodyGroup.rotation.set(0, 0, 0);
      }
    } else {
      const dir = new THREE.Vector3().subVectors(victimPos, startPos);
      const totalDist = dir.length();
      const normDir = dir.clone().normalize();
      const strikeDist = Math.max(0.1, totalDist - SQUARE_SIZE * 0.78);
      const strikePos = startPos.clone().addScaledVector(normDir, strikeDist);

      if (this.dynamicActionCam) {
        this.cameraState.savedBeforeAction = {
          theta: this.cameraState.desiredTheta,
          phi: this.cameraState.desiredPhi,
          radius: this.cameraState.desiredRadius,
          target: this.cameraState.desiredTarget.clone()
        };
        const midFocus = victimPos.clone().lerp(startPos, 0.25);
        midFocus.y = 0.6;
        this.cameraState.desiredTarget.copy(midFocus);
        this.cameraState.desiredRadius = this.getAspectAdjustedRadius(10.5);
        this.cameraState.desiredPhi = 0.78;
      }

      const approachDur = 0.36;
      soundFX.playStoneSlide(approachDur, isJump);
      await this.tweenProgress(approachDur, (t) => {
        const ease = 1 - Math.pow(1 - t, 3);
        if (attackerMesh) {
          attackerMesh.position.lerpVectors(startPos, strikePos, ease);
          if (isJump) attackerMesh.position.y = Math.sin(t * Math.PI) * 1.4;
          if (Math.random() < 0.5) this.spawnTrailSpark(attackerMesh.position, move.piece.color);
        }
      });

      soundFX.playAttackCharge();
      await this.tweenProgress(0.25, (t) => {
        if (attackerMesh) {
          const body = attackerMesh.userData.bodyGroup;
          body.position.y = Math.sin(t * Math.PI * 0.5) * 0.32;
          body.rotation.x = -normDir.z * t * 0.38;
          body.rotation.z = normDir.x * t * 0.38;
          attackerMesh.userData.matRune.emissiveIntensity = 1.1 + t * 1.8;
        }
        if (victimMesh) {
          victimMesh.position.x = victimPos.x + (Math.random() - 0.5) * 0.05 * t;
          victimMesh.position.z = victimPos.z + (Math.random() - 0.5) * 0.05 * t;
        }
      });

      await this.tweenProgress(0.10, (t) => {
        if (attackerMesh) {
          const body = attackerMesh.userData.bodyGroup;
          body.rotation.x = normDir.z * t * 0.55;
          body.rotation.z = -normDir.x * t * 0.55;
          attackerMesh.position.lerpVectors(strikePos, victimPos, t * 0.55);
        }
      });

      soundFX.playShatterImpact();
      this.spawnShatterExplosion(victimPos, victimPiece.color, normDir);

      if (victimMesh) {
        this.scene.remove(victimMesh);
        this.disposeGroupResources(victimMesh);
        this.pieceMeshes.delete(victimPiece.id);
        this.interactablesDirty = true;
      }

      const postStrikePos = attackerMesh ? attackerMesh.position.clone() : strikePos;
      await this.tweenProgress(0.38, (t) => {
        const ease = 1 - Math.pow(1 - t, 3);
        if (attackerMesh) {
          attackerMesh.position.lerpVectors(postStrikePos, endPos, ease);
          attackerMesh.position.y = 0;
          const body = attackerMesh.userData.bodyGroup;
          body.position.y = (1 - ease) * 0.32;
          body.rotation.x *= (1 - ease);
          body.rotation.z *= (1 - ease);
          attackerMesh.userData.matRune.emissiveIntensity = 0.95 + (1 - ease) * 1.2;
        }
      });

      if (this.dynamicActionCam && this.cameraState.savedBeforeAction) {
        const saved = this.cameraState.savedBeforeAction;
        this.cameraState.savedBeforeAction = null;
        setTimeout(() => {
          this.cameraState.desiredTarget.copy(saved.target);
          this.cameraState.desiredRadius = this.getAspectAdjustedRadius(this.baseRadius);
          this.cameraState.desiredPhi = saved.phi;
          this.cameraState.desiredTheta = saved.theta;
        }, 350);
      }
    }

    const record = this.engine.makeMove(move, chosenPromotion);

    if (chosenPromotion || move.promotion) {
      const oldMesh = this.pieceMeshes.get(record.pieceAfter.id);
      if (oldMesh) {
        this.scene.remove(oldMesh);
        this.disposeGroupResources(oldMesh);
      }
      const promotedMesh = this.createPieceMesh(record.pieceAfter.type, record.pieceAfter.color, record.pieceAfter.id);
      promotedMesh.position.copy(endPos);
      promotedMesh.userData.r = move.toR;
      promotedMesh.userData.c = move.toC;
      this.scene.add(promotedMesh);
      this.pieceMeshes.set(record.pieceAfter.id, promotedMesh);
      this.interactablesDirty = true;
    } else if (attackerMesh) {
      attackerMesh.userData.r = move.toR;
      attackerMesh.userData.c = move.toC;
    }

    if (record.rookMoved && this.pieceMeshes.has(record.rookMoved.id)) {
      const rMesh = this.pieceMeshes.get(record.rookMoved.id);
      rMesh.userData.r = record.rookMoved.toR;
      rMesh.userData.c = record.rookMoved.toC;
    }

    if (record.inCheck) soundFX.playCheckAlert();

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.updateCheckHighlight();
    this.updateHUD(record);
    this.isAnimating = false;

    if (record.isCheckmate || record.isStalemate) {
      this.showGameOverModal(record);
      return;
    }

    if (this.gameMode === 'ai' && this.engine.turn !== this.playerColor) {
      this.triggerAITurn();
    }
  }

  tweenProgress(durationSeconds, onUpdate) {
    return new Promise((resolve) => {
      const start = performance.now();
      const step = (now) => {
        const elapsed = (now - start) / 1000;
        const t = Math.min(1, elapsed / durationSeconds);
        onUpdate(t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  triggerAITurn() {
    const aiColor = this.playerColor === 'w' ? 'b' : 'w';
    if (this.engine.turn !== aiColor || this.isAnimating) return;

    const badge = document.getElementById('status-badge');
    const badgeText = document.getElementById('status-badge-text');
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    badgeText.textContent = 'PONDERING...';

    setTimeout(() => {
      if (this.engine.turn !== aiColor || this.isAnimating) return;
      const aiMove = this.engine.chooseAIMove(this.aiDifficulty);
      if (aiMove) this.executeMoveWithAnimation(aiMove, 'q');
    }, 400);
  }

  async triggerStrikeDemo() {
    if (this.isAnimating) return;

    let allMoves = this.engine.getAllLegalMoves(this.engine.turn);
    let captures = allMoves.filter(m => m.captured);

    if (captures.length === 0) {
      const e4 = allMoves.find(m => m.fromR === 6 && m.fromC === 4 && m.toR === 4 && m.toC === 4);
      if (e4) {
        this.engine.makeMove(e4);
        const bMoves = this.engine.getAllLegalMoves('b');
        const d5 = bMoves.find(m => m.fromR === 1 && m.fromC === 3 && m.toR === 3 && m.toC === 3);
        if (d5) this.engine.makeMove(d5);
        this.syncPiecesWithEngine();
        this.updateHUD();
        allMoves = this.engine.getAllLegalMoves(this.engine.turn);
        captures = allMoves.filter(m => m.captured);
      }
    }

    if (captures.length > 0) {
      const chosenCapture = captures[Math.floor(Math.random() * captures.length)];
      await this.executeMoveWithAnimation(chosenCapture, 'q');
    } else if (allMoves.length > 0) {
      const aggressive = allMoves.sort((a, b) => (this.engine.turn === 'w' ? a.toR - b.toR : b.toR - a.toR))[0];
      await this.executeMoveWithAnimation(aggressive, 'q');
    }
  }

  /*************************************************************************
   * INITIAL SCREEN & RESPONSIVE PLATFORM, DEFINITION, SIDE & NAME SWITCHING
   *************************************************************************/
  initLauncherAndDeviceDetection() {
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    this.applyDevicePlatform(isTouchDevice ? 'mobile' : 'pc');

    const devMem = navigator.deviceMemory || 4;
    const hwCores = navigator.hardwareConcurrency || 4;
    const isLowSpecDevice = devMem <= 2 || hwCores <= 4;
    this.applyGraphicsDefinition(isLowSpecDevice ? 'low' : 'high', true);

    const detectedRamPill = document.getElementById('detected-ram-pill');
    if (detectedRamPill) {
      detectedRamPill.textContent = isLowSpecDevice
        ? '2GB/Low-RAM Recommended'
        : 'High-Def Ready';
    }

    if (window.innerWidth < 768) {
      const historyPanel = document.getElementById('history-panel');
      historyPanel.classList.add('translate-y-[130%]', 'opacity-0', 'pointer-events-none');
    }

    const detectedPill = document.getElementById('detected-device-pill');
    if (detectedPill) {
      detectedPill.textContent = isTouchDevice ? 'Smartphone Detected' : 'PC / Laptop Detected';
    }

    const cardMobile = document.getElementById('card-device-mobile');
    const cardPC = document.getElementById('card-device-pc');

    cardMobile.addEventListener('click', () => {
      soundFX.playSelect(true);
      this.applyDevicePlatform('mobile');
    });
    cardPC.addEventListener('click', () => {
      soundFX.playSelect(true);
      this.applyDevicePlatform('pc');
    });

    // High Definition vs Low Definition (2GB RAM) Cards on 1st Initiation Screen
    const cardDefHigh = document.getElementById('card-def-high');
    const cardDefLow = document.getElementById('card-def-low');
    if (cardDefHigh && cardDefLow) {
      cardDefHigh.addEventListener('click', () => {
        soundFX.playSelect(true);
        this.applyGraphicsDefinition('high', true);
      });
      cardDefLow.addEventListener('click', () => {
        soundFX.playSelect(false);
        this.applyGraphicsDefinition('low', true);
      });
    }

    // Side of the Board Cards (Pearl / White vs Lilac / Black) on 1st Initiation Screen
    const cardSideWhite = document.getElementById('card-side-white');
    const cardSideBlack = document.getElementById('card-side-black');
    if (cardSideWhite && cardSideBlack) {
      cardSideWhite.addEventListener('click', () => {
        soundFX.playSelect(true);
        this.applyPlayerSide('w', false);
      });
      cardSideBlack.addEventListener('click', () => {
        soundFX.playSelect(false);
        this.applyPlayerSide('b', false);
      });
    }

    // Custom Sovereign Names Inputs
    const inputNameWhite = document.getElementById('input-name-white');
    const inputNameBlack = document.getElementById('input-name-black');
    if (inputNameWhite) {
      inputNameWhite.addEventListener('input', () => this.applyPlayerNames());
    }
    if (inputNameBlack) {
      inputNameBlack.addEventListener('input', () => this.applyPlayerNames());
    }
    this.applyPlayerNames();

    document.querySelectorAll('.start-env-btn, .hud-env-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const envKey = btn.getAttribute('data-env');
        soundFX.playSelect(true);
        this.setEnvironmentRealm(envKey, false);
      });
    });

    const startModal = document.getElementById('start-screen-modal');
    document.getElementById('btn-launch-game').addEventListener('click', () => {
      soundFX.playSelect(true);
      this.hasLaunchedSanctuary = true;
      this.applyPlayerNames();
      startModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        startModal.classList.add('hidden');
        this.adaptCameraToScreenAspect(false);
        if (this.gameMode === 'ai' && this.engine.turn !== this.playerColor && !this.isAnimating) {
          this.triggerAITurn();
        }
      }, 320);
    });

    document.getElementById('btn-open-launcher').addEventListener('click', () => {
      startModal.classList.remove('hidden');
      requestAnimationFrame(() => {
        startModal.classList.remove('opacity-0', 'pointer-events-none');
      });
    });
  }

  applyDevicePlatform(platform) {
    this.controlPlatform = platform;
    const cardMobile = document.getElementById('card-device-mobile');
    const cardPC = document.getElementById('card-device-pc');
    const touchDock = document.getElementById('mobile-touch-dock');
    const pcHint = document.getElementById('pc-control-hint');
    const hudBadge = document.getElementById('hud-device-badge');

    if (platform === 'mobile') {
      cardMobile.classList.add('selected-device');
      cardPC.classList.remove('selected-device');
      cardMobile.querySelector('.device-check').classList.remove('hidden');
      cardPC.querySelector('.device-check').classList.add('hidden');

      // Keep floating D-Pad dock and 3D cursor hidden in Touch Mode because direct touch tap & orbit work natively
      if (touchDock) {
        touchDock.classList.add('hidden', 'touch-dock-retired');
        touchDock.classList.remove('flex');
      }
      if (this.cursorGroup) {
        this.cursorGroup.visible = false;
      }
      pcHint.classList.add('hidden');
      pcHint.classList.remove('md:flex');
      if (hudBadge) hudBadge.textContent = 'TOUCH';
      this.baseRadius = 15.8;
    } else {
      cardPC.classList.add('selected-device');
      cardMobile.classList.remove('selected-device');
      cardPC.querySelector('.device-check').classList.remove('hidden');
      cardMobile.querySelector('.device-check').classList.add('hidden');

      if (touchDock) {
        touchDock.classList.add('hidden', 'touch-dock-retired');
        touchDock.classList.remove('flex');
      }
      if (this.cursorGroup) {
        this.cursorGroup.visible = true;
      }
      pcHint.classList.remove('hidden');
      pcHint.classList.add('md:flex');
      if (hudBadge) hudBadge.textContent = 'PC';
      this.baseRadius = 15.4;
    }
    this.adaptCameraToScreenAspect();
  }

  /*************************************************************************
   * GLITCH-FREE TOUCH & MOUSE INPUT CONTROLLER
   *************************************************************************/
  initControlsAndEvents() {
    const dom = this.renderer.domElement;
    const activePointers = new Map();
    let isDragging = false;
    let lastDragPos = { x: 0, y: 0 };
    let downStartPos = { x: 0, y: 0 };
    let initialPinchDist = null;
    let initialPinchRadius = this.cameraState.desiredRadius;

    const clearAllPointers = () => {
      activePointers.clear();
      initialPinchDist = null;
      isDragging = false;
    };

    dom.addEventListener('pointerdown', (e) => {
      if (e.target !== dom) return;
      e.preventDefault();

      if (e.pointerType === 'touch' && activePointers.size >= 2) {
        clearAllPointers();
      }

      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 1) {
        isDragging = false;
        downStartPos = { x: e.clientX, y: e.clientY };
        lastDragPos = { x: e.clientX, y: e.clientY };
      } else if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialPinchRadius = this.cameraState.desiredRadius;
        isDragging = true;
      }
    }, { passive: false });

    dom.addEventListener('pointermove', (e) => {
      if (!activePointers.has(e.pointerId)) return;
      e.preventDefault();

      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 2 && initialPinchDist) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (dist > 15) {
          const scale = initialPinchDist / dist;
          this.cameraState.desiredRadius = Math.max(8.5, Math.min(34, initialPinchRadius * scale));
        }
        return;
      }

      if (activePointers.size === 1) {
        const totalMove = Math.hypot(e.clientX - downStartPos.x, e.clientY - downStartPos.y);
        const dragThreshold = e.pointerType === 'touch' ? 14 : 6;

        if (!isDragging && totalMove > dragThreshold) {
          isDragging = true;
          lastDragPos = { x: e.clientX, y: e.clientY };
          return;
        }

        if (isDragging) {
          const dx = e.clientX - lastDragPos.x;
          const dy = e.clientY - lastDragPos.y;
          const clampedDx = Math.max(-45, Math.min(45, dx));
          const clampedDy = Math.max(-45, Math.min(45, dy));

          this.cameraState.desiredTheta -= clampedDx * 0.0065;
          this.cameraState.desiredPhi = Math.max(0.24, Math.min(1.36, this.cameraState.desiredPhi - clampedDy * 0.0055));
          lastDragPos = { x: e.clientX, y: e.clientY };
        }
      }
    }, { passive: false });

    const onPointerFinish = (e) => {
      const wasInMap = activePointers.has(e.pointerId);
      activePointers.delete(e.pointerId);

      if (activePointers.size < 2) {
        initialPinchDist = null;
      }

      if (activePointers.size === 1) {
        const remaining = Array.from(activePointers.values())[0];
        lastDragPos = { x: remaining.x, y: remaining.y };
      }

      if (wasInMap && !isDragging && activePointers.size === 0 && e.type === 'pointerup') {
        this.handleBoardClick(e.clientX, e.clientY);
      }

      if (activePointers.size === 0) {
        isDragging = false;
      }
    };

    dom.addEventListener('pointerup', onPointerFinish);
    dom.addEventListener('pointercancel', clearAllPointers);
    dom.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') onPointerFinish(e);
    });
    window.addEventListener('blur', clearAllPointers);

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraState.desiredRadius = Math.max(8.5, Math.min(34, this.cameraState.desiredRadius + e.deltaY * 0.01));
    }, { passive: false });

    window.addEventListener('resize', () => this.adaptCameraToScreenAspect());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.adaptCameraToScreenAspect(), 120);
    });

    // Keyboard Controls (ignores WASD shortcuts while typing in name inputs)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') {
        if (e.key === 'Enter') {
          document.activeElement.blur();
        }
        return;
      }

      const startModal = document.getElementById('start-screen-modal');
      if (startModal && !startModal.classList.contains('hidden')) {
        if (e.key === 'Enter') document.getElementById('btn-launch-game').click();
        return;
      }

      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
      }

      const isBlackView = Math.cos(this.cameraState.theta) < 0;
      const dirSign = isBlackView ? -1 : 1;

      if (key === 'w' || key === 'arrowup') this.moveCursorBy(-1 * dirSign, 0);
      else if (key === 's' || key === 'arrowdown') this.moveCursorBy(1 * dirSign, 0);
      else if (key === 'a' || key === 'arrowleft') this.moveCursorBy(0, -1 * dirSign);
      else if (key === 'd' || key === 'arrowright') this.moveCursorBy(0, 1 * dirSign);
      else if (key === 'enter' || key === ' ') this.activateSquare(this.cursorSquare.r, this.cursorSquare.c);
      else if (key === 'escape') {
        this.selectedSquare = null;
        this.legalMovesForSelected = [];
        this.clearHighlights();
        this.updateCheckHighlight();
      } else if (key === 'q') this.cameraState.desiredTheta -= 0.35;
      else if (key === 'e') this.cameraState.desiredTheta += 0.35;
      else if (key === 'r') document.getElementById('btn-cam-white').click();
      else if (key === 'c') this.triggerStrikeDemo();
      else if (key === 'u') document.getElementById('btn-undo').click();
      else if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
        const realms = ['cathedral', 'night', 'day', 'grass', 'ocean', 'space', 'sand'];
        this.setEnvironmentRealm(realms[parseInt(key, 10) - 1], false);
      }
    });

    // Touch D-Pad Controls (preserved for compatibility)
    document.querySelectorAll('[data-dpad]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-dpad');
        const isBlackView = Math.cos(this.cameraState.theta) < 0;
        const dirSign = isBlackView ? -1 : 1;
        if (action === 'up') this.moveCursorBy(-1 * dirSign, 0);
        else if (action === 'down') this.moveCursorBy(1 * dirSign, 0);
        else if (action === 'left') this.moveCursorBy(0, -1 * dirSign);
        else if (action === 'right') this.moveCursorBy(0, 1 * dirSign);
        else if (action === 'select') this.activateSquare(this.cursorSquare.r, this.cursorSquare.c);
      });
    });

    const rotL = document.getElementById('btn-touch-rot-left');
    const rotR = document.getElementById('btn-touch-rot-right');
    const zoomB = document.getElementById('btn-touch-zoom');
    if (rotL) rotL.addEventListener('click', () => { this.cameraState.desiredTheta -= 0.45; });
    if (rotR) rotR.addEventListener('click', () => { this.cameraState.desiredTheta += 0.45; });
    if (zoomB) {
      zoomB.addEventListener('click', () => {
        const base = this.getAspectAdjustedRadius(this.baseRadius);
        this.cameraState.desiredRadius = this.cameraState.desiredRadius > base * 0.9 ? base * 0.75 : base;
      });
    }

    // HUD Buttons
    document.getElementById('btn-mode').addEventListener('click', () => {
      this.gameMode = this.gameMode === 'ai' ? '2p' : 'ai';
      const btn = document.getElementById('btn-mode');
      const label = document.getElementById('label-mode');
      const diffBtn = document.getElementById('btn-difficulty');

      if (this.gameMode === 'ai') {
        btn.classList.add('active-sky');
        label.textContent = 'vs Automaton';
        diffBtn.style.display = 'inline-flex';
        if (this.engine.turn !== this.playerColor && !this.isAnimating) {
          this.triggerAITurn();
        }
      } else {
        btn.classList.remove('active-sky');
        label.textContent = '2P Pass & Play';
        diffBtn.style.display = 'none';
      }
      this.updateHUD();
    });

    document.getElementById('btn-difficulty').addEventListener('click', () => {
      const order = ['novice', 'adept', 'archmage'];
      const names = { novice: 'Novice', adept: 'Adept', archmage: 'Archmage' };
      const idx = (order.indexOf(this.aiDifficulty) + 1) % order.length;
      this.aiDifficulty = order[idx];
      document.getElementById('label-difficulty').textContent = names[this.aiDifficulty];
    });

    const btnSwapSides = document.getElementById('btn-swap-sides');
    if (btnSwapSides) {
      btnSwapSides.addEventListener('click', () => {
        if (this.isAnimating) return;
        const nextSide = this.playerColor === 'w' ? 'b' : 'w';
        soundFX.playSelect(nextSide === 'w');
        this.applyPlayerSide(nextSide, true);
      });
    }

    const setCamPreset = (theta, phi, baseR, activeBtnId) => {
      this.cameraState.savedBeforeAction = null;
      this.baseRadius = baseR;
      this.cameraState.desiredTarget.set(0, 0.35, 0);
      this.cameraState.desiredTheta = theta;
      this.cameraState.desiredPhi = phi;
      this.cameraState.desiredRadius = this.getAspectAdjustedRadius(baseR);
      ['btn-cam-white', 'btn-cam-black', 'btn-cam-top'].forEach(id => {
        document.getElementById(id).classList.toggle('active-peach', id === activeBtnId);
      });
    };

    document.getElementById('btn-cam-white').addEventListener('click', () => setCamPreset(0, 0.90, 15.6, 'btn-cam-white'));
    document.getElementById('btn-cam-black').addEventListener('click', () => setCamPreset(Math.PI, 0.90, 15.6, 'btn-cam-black'));
    document.getElementById('btn-cam-top').addEventListener('click', () => setCamPreset(0, 0.24, 17.2, 'btn-cam-top'));

    document.getElementById('btn-cam-cinematic').addEventListener('click', (e) => {
      this.dynamicActionCam = !this.dynamicActionCam;
      e.currentTarget.classList.toggle('active-sky', this.dynamicActionCam);
    });

    document.getElementById('btn-strike-demo').addEventListener('click', () => this.triggerStrikeDemo());

    document.getElementById('btn-undo').addEventListener('click', () => {
      if (this.isAnimating || this.engine.history.length === 0) return;
      this.engine.undo();
      if (this.gameMode === 'ai' && this.engine.turn !== this.playerColor && this.engine.history.length > 0) {
        this.engine.undo();
      }
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.syncPiecesWithEngine();
      this.updateHUD();
    });

    const resetGame = () => {
      if (this.isAnimating) return;
      document.getElementById('gameover-modal').classList.add('hidden');
      document.getElementById('gameover-modal').classList.remove('flex');
      this.engine.reset();
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.syncPiecesWithEngine();
      this.updateHUD();
      if (this.gameMode === 'ai' && this.playerColor === 'b' && this.hasLaunchedSanctuary) {
        this.triggerAITurn();
      }
    };
    document.getElementById('btn-reset').addEventListener('click', resetGame);
    document.getElementById('btn-modal-newgame').addEventListener('click', resetGame);
    document.getElementById('btn-modal-close').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.add('hidden');
      document.getElementById('gameover-modal').classList.remove('flex');
    });

    const toggleDefMode = () => {
      const nextMode = this.graphicsDef === 'high' ? 'low' : 'high';
      soundFX.playSelect(nextMode === 'high');
      this.applyGraphicsDefinition(nextMode, true);
    };
    const btnDefDesktop = document.getElementById('btn-def-toggle');
    const btnDefMobile = document.getElementById('btn-def-mobile');
    if (btnDefDesktop) btnDefDesktop.addEventListener('click', toggleDefMode);
    if (btnDefMobile) btnDefMobile.addEventListener('click', toggleDefMode);

    const toggleAudio = () => {
      const on = soundFX.toggle();
      document.getElementById('btn-sound').classList.toggle('active-peach', on);
      document.getElementById('btn-sound-mobile').classList.toggle('active-peach', on);
    };
    document.getElementById('btn-sound').addEventListener('click', toggleAudio);
    document.getElementById('btn-sound-mobile').addEventListener('click', toggleAudio);

    const historyPanel = document.getElementById('history-panel');
    const toggleHistory = () => {
      historyPanel.classList.toggle('translate-y-[130%]');
      historyPanel.classList.toggle('opacity-0');
      historyPanel.classList.toggle('pointer-events-none');
    };
    document.getElementById('btn-history-toggle').addEventListener('click', toggleHistory);
    document.getElementById('btn-history-mobile').addEventListener('click', toggleHistory);
    document.getElementById('btn-close-history').addEventListener('click', toggleHistory);

    document.querySelectorAll('.promo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const promoType = btn.getAttribute('data-promo');
        const modal = document.getElementById('promotion-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (this.pendingPromotionMove) {
          const m = this.pendingPromotionMove;
          this.pendingPromotionMove = null;
          this.executeMoveWithAnimation(m, promoType);
        }
      });
    });
  }

  moveCursorBy(dr, dc) {
    if (this.isAnimating) return;
    if (this.cursorGroup && this.controlPlatform === 'pc') {
      this.cursorGroup.visible = true;
    }
    this.cursorSquare.r = (this.cursorSquare.r + dr + 8) % 8;
    this.cursorSquare.c = (this.cursorSquare.c + dc + 8) % 8;
    this.updateCursorMeshPosition();
    soundFX.playCursorStep();
  }

  handleBoardClick(clientX, clientY) {
    if (this.isAnimating) return;
    if (this.gameMode === 'ai' && this.engine.turn !== this.playerColor) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.interactablesDirty) {
      this.rebuildInteractablesCache();
    }

    const hits = this.raycaster.intersectObjects(this.cachedInteractables, false);
    if (hits.length === 0) {
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.clearHighlights();
      this.updateCheckHighlight();
      return;
    }

    const hitObj = hits[0].object;
    let clickedR = null, clickedC = null;

    if (hitObj.userData && hitObj.userData.type === 'square') {
      clickedR = hitObj.userData.r;
      clickedC = hitObj.userData.c;
    } else if (hitObj.userData && hitObj.userData.pieceGroup) {
      clickedR = hitObj.userData.pieceGroup.userData.r;
      clickedC = hitObj.userData.pieceGroup.userData.c;
    }

    if (clickedR === null || clickedC === null) return;
    this.cursorSquare = { r: clickedR, c: clickedC };
    this.updateCursorMeshPosition();
    this.activateSquare(clickedR, clickedC);
  }

  activateSquare(r, c) {
    if (this.isAnimating) return;
    if (this.gameMode === 'ai' && this.engine.turn !== this.playerColor) return;

    if (this.selectedSquare) {
      const matchingMove = this.legalMovesForSelected.find(m => m.toR === r && m.toC === c);
      if (matchingMove) {
        if (matchingMove.promotion) {
          this.pendingPromotionMove = matchingMove;
          const modal = document.getElementById('promotion-modal');
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          return;
        }
        this.executeMoveWithAnimation(matchingMove);
        return;
      }
    }

    const clickedPiece = this.engine.board[r][c];
    if (clickedPiece && clickedPiece.color === this.engine.turn) {
      soundFX.playSelect(clickedPiece.color === 'w');
      this.selectedSquare = { r, c };
      this.legalMovesForSelected = this.engine.getLegalMovesForSquare(r, c);
      this.showLegalMoveHighlights(r, c, this.legalMovesForSelected);
    } else {
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.clearHighlights();
      this.updateCheckHighlight();
    }
  }

  updateHUD(lastRecord = null) {
    const isWhiteTurn = this.engine.turn === 'w';
    const turnDot = document.getElementById('turn-dot');
    const turnText = document.getElementById('turn-text');
    const whiteName = this.playerNameWhite || 'Pearl';
    const blackName = this.playerNameBlack || 'Lilac';

    if (isWhiteTurn) {
      turnDot.className = 'w-2 h-2 rounded-full bg-orange-200 shadow-[0_0_8px_#fed7aa] shrink-0';
      turnText.textContent =
        this.gameMode === 'ai' && this.playerColor !== 'w'
          ? `AI (${whiteName})`
          : `${whiteName}'s Turn`;
      turnText.className = 'hud-turn-label font-semibold tracking-wide text-orange-100 truncate';
    } else {
      turnDot.className = 'w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_#e9d5ff] shrink-0';
      turnText.textContent =
        this.gameMode === 'ai' && this.playerColor !== 'b'
          ? `AI (${blackName})`
          : `${blackName}'s Turn`;
      turnText.className = 'hud-turn-label font-semibold tracking-wide text-purple-200 truncate';
    }

    const badge = document.getElementById('status-badge');
    const badgeText = document.getElementById('status-badge-text');
    const inCheck = this.engine.isInCheck(this.engine.turn);

    if (lastRecord && lastRecord.isCheckmate) {
      badge.classList.remove('hidden');
      badge.classList.add('flex', 'check-alert-pulse');
      badgeText.textContent = 'CHECKMATE';
    } else if (lastRecord && lastRecord.isStalemate) {
      badge.classList.remove('hidden');
      badge.classList.add('flex');
      badgeText.textContent = 'STALEMATE';
    } else if (inCheck) {
      badge.classList.remove('hidden');
      badge.classList.add('flex', 'check-alert-pulse');
      badgeText.textContent = 'CHECK';
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex', 'check-alert-pulse');
    }

    document.getElementById('btn-undo').disabled = this.engine.history.length === 0;
    document.getElementById('move-count-badge').textContent = this.engine.history.length;
    const mobBadge = document.getElementById('move-count-badge-mobile');
    if (mobBadge) mobBadge.textContent = this.engine.history.length;

    document.getElementById('captured-by-white').textContent = this.engine.capturedByWhite.length;
    document.getElementById('captured-by-black').textContent = this.engine.capturedByBlack.length;

    const iconsW = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };
    const iconsB = { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' };

    document.getElementById('graveyard-white').innerHTML = this.engine.capturedByWhite.length
      ? this.engine.capturedByWhite.map(t => `<span>${iconsW[t]}</span>`).join('')
      : '<span class="text-[9px] text-slate-300/75 italic">None</span>';

    document.getElementById('graveyard-black').innerHTML = this.engine.capturedByBlack.length
      ? this.engine.capturedByBlack.map(t => `<span>${iconsB[t]}</span>`).join('')
      : '<span class="text-[9px] text-slate-300/75 italic">None</span>';

    const moveListEl = document.getElementById('move-list');
    if (this.engine.history.length === 0) {
      moveListEl.innerHTML = '<div class="text-slate-200/80 italic text-center py-1.5 font-sans text-[10px]">Tap a piece or use WASD to begin.</div>';
    } else {
      let html = '';
      for (let i = 0; i < this.engine.history.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const wRec = this.engine.history[i];
        const bRec = this.engine.history[i + 1];
        const wCap = wRec.captured ? '<span class="text-pink-300 ml-0.5">✦</span>' : '';
        const bCap = bRec && bRec.captured ? '<span class="text-pink-300 ml-0.5">✦</span>' : '';

        html += `
          <div class="grid grid-cols-7 items-center px-2 py-0.5 rounded-lg ${i + 2 >= this.engine.history.length ? 'bg-white/15' : 'bg-white/[0.04]'}">
            <span class="col-span-1 text-slate-300">${moveNum}.</span>
            <span class="col-span-3 text-orange-100 font-medium">${wRec.san}${wCap}</span>
            <span class="col-span-3 text-purple-200 font-medium">${bRec ? bRec.san + bCap : ''}</span>
          </div>
        `;
      }
      moveListEl.innerHTML = html;
      requestAnimationFrame(() => {
        moveListEl.scrollTop = moveListEl.scrollHeight;
      });
    }
  }

  showGameOverModal(record) {
    const modal = document.getElementById('gameover-modal');
    const title = document.getElementById('gameover-title');
    const subtitle = document.getElementById('gameover-subtitle');

    if (record.isCheckmate) {
      const winner =
        record.color === 'w'
          ? (this.playerNameWhite || 'Pastel Pearl')
          : (this.playerNameBlack || 'Dusk Lilac');
      title.textContent = 'Checkmate';
      subtitle.textContent = `${winner} triumphs in the ${REALM_CONFIGS[this.currentRealm].name} after ${this.engine.history.length} moves.`;
    } else {
      title.textContent = 'Stalemate';
      subtitle.textContent = 'Neither host can claim victory — the Sanctuary duel ends in a serene draw.';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  /*************************************************************************
   * 60FPS ANIMATION LOOP (OPTIMIZED FOR BOTH HD & 2GB RAM LOW-DEF MODES)
   *************************************************************************/
  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.getElapsedTime();
    this.frameCounter++;
    const isLow = this.graphicsDef === 'low';

    if (this.themeTransition.active) {
      this.updateThemeTransition(dt);
    }

    for (const [, pGroup] of this.pieceMeshes) {
      const { bodyGroup, accentGroup, runeRing, matRune, phaseOffset, isSelected } = pGroup.userData;
      if (isLow && !isSelected && !this.isAnimating && (this.frameCounter & 1) === 1) {
        continue;
      }
      const phase = elapsed * 2.0 + phaseOffset;

      if (!this.isAnimating) {
        const hoverAmp = isSelected ? 0.12 : 0.03;
        const hoverOffset = isSelected ? 0.14 : 0.02;
        bodyGroup.position.y = hoverOffset + Math.sin(phase) * hoverAmp;
        bodyGroup.rotation.z = Math.sin(phase * 0.7) * 0.018;
      }

      if (accentGroup && pGroup.userData.type !== 'n') {
        accentGroup.rotation.y = elapsed * 0.75 + phaseOffset;
      }
      if (runeRing) {
        runeRing.scale.setScalar(1 + Math.sin(phase * 1.4) * 0.035);
      }
      if (matRune && !this.isAnimating) {
        matRune.emissiveIntensity = (isSelected ? 1.55 : 0.85) + Math.sin(phase * 1.6) * 0.18;
      }
    }

    if (this.cursorGroup && this.cursorGroup.visible) {
      const cs = 1 + Math.sin(elapsed * 4.0) * 0.05;
      this.cursorGroup.scale.set(cs, 1, cs);
      this.cursorGroup.children[0].rotation.z = elapsed * 0.5;
    }
    for (const child of this.indicatorGroup.children) {
      if (child.userData && child.userData.isPulseIndicator) {
        const s = 1 + Math.sin(elapsed * 4.5) * 0.08;
        child.scale.set(s, s, 1);
      }
    }

    for (let i = this.shatterFragments.length - 1; i >= 0; i--) {
      const frag = this.shatterFragments[i];
      frag.age += dt;

      if (frag.age >= frag.maxAge) {
        this.scene.remove(frag.mesh);
        frag.mesh.geometry.dispose();
        frag.mesh.material.dispose();
        this.shatterFragments.splice(i, 1);
        continue;
      }

      frag.vel.y -= 13.0 * dt;
      frag.mesh.position.addScaledVector(frag.vel, dt);
      frag.mesh.rotation.x += frag.rotVel.x * dt;
      frag.mesh.rotation.y += frag.rotVel.y * dt;
      frag.mesh.rotation.z += frag.rotVel.z * dt;

      const withinBoard = Math.abs(frag.mesh.position.x) < 5.8 && Math.abs(frag.mesh.position.z) < 5.8;
      if (withinBoard && frag.mesh.position.y < 0.06 && frag.vel.y < 0) {
        frag.mesh.position.y = 0.06;
        frag.vel.y = -frag.vel.y * 0.42;
        frag.vel.x *= 0.72;
        frag.vel.z *= 0.72;
        frag.rotVel.multiplyScalar(0.68);
      }

      const lifeRatio = frag.age / frag.maxAge;
      if (lifeRatio > 0.6) {
        frag.mesh.material.opacity = Math.max(0, 1 - (lifeRatio - 0.6) / 0.4);
        frag.mesh.scale.multiplyScalar(0.992);
      }
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.age += dt;
      if (sw.age >= sw.maxAge) {
        this.scene.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        this.shockwaves.splice(i, 1);
        continue;
      }
      const p = sw.age / sw.maxAge;
      const scale = 1 + p * 6.0;
      sw.mesh.scale.set(scale, scale, 1);
      sw.mesh.material.opacity = (1 - p) * 0.85;
    }

    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const tp = this.trailParticles[i];
      tp.age += dt;
      if (tp.age >= tp.maxAge) {
        this.scene.remove(tp.mesh);
        tp.mesh.geometry.dispose();
        tp.mesh.material.dispose();
        this.trailParticles.splice(i, 1);
        continue;
      }
      tp.mesh.position.addScaledVector(tp.vel, dt);
      const p = tp.age / tp.maxAge;
      tp.mesh.material.opacity = (1 - p) * 0.8;
      tp.mesh.scale.setScalar(1 - p * 0.7);
    }

    if (this.oceanMesh && this.oceanBasePositions && (!isLow || (this.frameCounter & 1) === 0)) {
      const posAttr = this.oceanMesh.geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = this.oceanBasePositions[i];
        const bz = this.oceanBasePositions[i + 2];
        arr[i + 1] =
          Math.sin(bx * 0.20 + elapsed * 1.8) * 0.36 +
          Math.cos(bz * 0.16 + elapsed * 1.4) * 0.30;
      }
      posAttr.needsUpdate = true;
    }

    if (this.grassInstancedMesh && this.grassDummyMatrices.length > 0 && (!isLow || (this.frameCounter & 1) === 0)) {
      const dummy = this.reusableDummy;
      for (let i = 0; i < this.grassDummyMatrices.length; i++) {
        const g = this.grassDummyMatrices[i];
        dummy.position.set(g.x, -3.12, g.z);
        const sway = Math.sin(elapsed * 2.0 + g.phase + g.x * 0.2) * 0.15;
        dummy.rotation.set(sway, g.rotY, sway * 0.5);
        dummy.scale.set(1, g.scaleY, 1);
        dummy.updateMatrix();
        this.grassInstancedMesh.setMatrixAt(g.index, dummy.matrix);
      }
      this.grassInstancedMesh.instanceMatrix.needsUpdate = true;
    }

    if (this.fallingLeaves.length > 0) {
      for (const lf of this.fallingLeaves) {
        lf.mesh.position.y -= lf.speedY * dt;
        lf.mesh.position.x += Math.sin(elapsed * 1.4 + lf.swayPhase) * 0.012;
        lf.mesh.rotation.x += lf.rotSpeed * dt;
        lf.mesh.rotation.z += lf.rotSpeed * 0.7 * dt;
        if (lf.mesh.position.y < -3.0) {
          lf.mesh.position.y = 13 + Math.random() * 3;
        }
      }
    }

    if (this.spaceRings.length > 0) {
      for (const sr of this.spaceRings) {
        if (sr.isYOrbit || sr.isCloud) {
          sr.mesh.rotation.y += sr.speed * dt;
        } else {
          sr.mesh.rotation.z += sr.speed * dt;
        }
      }
    }

    if (this.envParticles && (!isLow || (this.frameCounter & 1) === 0)) {
      const positions = this.envParticles.geometry.attributes.position.array;
      const speeds = this.envParticles.geometry.attributes.aSpeed.array;
      const stepDt = isLow ? dt * 2 : dt;
      for (let i = 0; i < speeds.length; i++) {
        positions[i * 3 + 1] += speeds[i] * stepDt;
        positions[i * 3] += Math.sin(elapsed * 0.5 + i) * 0.0025;
        if (positions[i * 3 + 1] > 12) positions[i * 3 + 1] = -2;
      }
      this.envParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.actionLight.intensity > 0) {
      this.actionLight.intensity = Math.max(0, this.actionLight.intensity - dt * 9);
    }

    const cs = this.cameraState;
    const damping = 1 - Math.exp(-8.0 * dt);
    cs.theta += (cs.desiredTheta - cs.theta) * damping;
    cs.phi += (cs.desiredPhi - cs.phi) * damping;
    cs.radius += (cs.desiredRadius - cs.radius) * damping;
    cs.target.lerp(cs.desiredTarget, damping);

    const camX = cs.target.x + cs.radius * Math.sin(cs.phi) * Math.sin(cs.theta);
    const camY = cs.target.y + cs.radius * Math.cos(cs.phi);
    const camZ = cs.target.z + cs.radius * Math.sin(cs.phi) * Math.cos(cs.theta);

    this.camera.position.set(camX, camY, camZ);

    if (cs.shakeIntensity > 0.002) {
      this.camera.position.x += (Math.random() - 0.5) * cs.shakeIntensity;
      this.camera.position.y += (Math.random() - 0.5) * cs.shakeIntensity;
      this.camera.position.z += (Math.random() - 0.5) * cs.shakeIntensity;
      cs.shakeIntensity *= Math.exp(-9.0 * dt);
    } else {
      cs.shakeIntensity = 0;
    }

    this.camera.lookAt(cs.target);
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.wizardChessApp = new WizardsChessApp();
});
