import { create } from 'zustand';
import { FIELD_COLS, FIELD_ROWS } from './constants';

export type Tile = {
  id: number;
  x: number;
  y: number;
  value: number;

  isNew: boolean;
  isMerged: boolean;
  isMerging: boolean;
};

type GameStore = {
  tiles: Tile[];
  gameOver: boolean;

  init: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
  spawnNumber: () => void;
  removeMerged: () => void;
  handlePostMove: (prevTiles: Tile[]) => void;
};

let tileId = 0;

export const useGameStore = create<GameStore>((set, get) => ({
  tiles: [],
  gameOver: false,

  init: () => {
    tileId = 0;
    set(() => ({
      tiles: [],
      gameOver: false,
    }));
    get().spawnNumber();
  },

  spawnNumber: () => {
    set((state) => {
      const emptyTiles = getEmptyTiles(state.tiles);
      if (!emptyTiles.length) {
        return state;
      }

      return {
        tiles: [
          ...state.tiles,
          {
            ...emptyTiles[Math.floor(Math.random() * emptyTiles.length)],
            value: Math.random() < 0.9 ? 2 : 4,
            id: tileId++,
            isNew: true,
            isMerged: false,
            isMerging: false,
          },
        ],
      };
    });
  },

  removeMerged: () => {
    set((state) => {
      const filtered = state.tiles.filter((t) => !t.isMerged);
      filtered.forEach((tile) => {
        tile.isNew = false;
        tile.isMerging = false;
      });
      return { tiles: filtered };
    });
  },

  moveLeft: () => {
    get().removeMerged();
    const prevTiles = structuredClone(get().tiles);
    set((state) => {
      for (let y = 0; y < FIELD_ROWS; y++) {
        const row = state.tiles
          .filter((t) => t.y === y)
          .sort((a, b) => a.x - b.x);

        // Move to the left
        for (let x = 0; x < row.length; x++) {
          row[x].x = x;
        }

        // Merge
        for (let x = 0; x < row.length - 1; x++) {
          if (
            row[x].value === row[x + 1].value &&
            !row[x].isMerged &&
            !row[x + 1].isMerged
          ) {
            row[x].value *= 2;
            row[x].isMerging = true;
            row[x + 1].isMerged = true;
          }
        }

        // // Move to the left
        let x = 0;
        for (const tile of row) {
          tile.x = tile.isMerged ? x - 1 : x;
          if (!tile.isMerged) x++;
        }
      }
      return { tiles: [...state.tiles] };
    });

    get().handlePostMove(prevTiles);
  },

  moveRight: () => {
    get().removeMerged();
    const prevTiles = structuredClone(get().tiles);
    set((state) => {
      for (let y = 0; y < FIELD_ROWS; y++) {
        const row = state.tiles
          .filter((t) => t.y === y)
          .sort((a, b) => a.x - b.x);

        // Move to the right
        for (let i = 0; i < row.length; i++) {
          row[i].x = FIELD_COLS - row.length + i;
        }

        // Merge
        for (let x = row.length - 1; x > 0; x--) {
          if (
            row[x].value === row[x - 1].value &&
            !row[x].isMerged &&
            !row[x - 1].isMerged
          ) {
            row[x].value *= 2;
            row[x].isMerging = true;
            row[x - 1].isMerged = true;
          }
        }

        // Move to the right
        let x = FIELD_COLS - 1;
        for (let i = row.length - 1; i >= 0; i--) {
          const tile = row[i];
          tile.x = tile.isMerged ? x + 1 : x;
          if (!tile.isMerged) x--;
        }
      }
      return { tiles: [...state.tiles] };
    });
    get().handlePostMove(prevTiles);
  },

  moveUp: () => {
    get().removeMerged();
    const prevTiles = structuredClone(get().tiles);
    set((state) => {
      for (let x = 0; x < FIELD_COLS; x++) {
        const col = state.tiles
          .filter((t) => t.x === x)
          .sort((a, b) => a.y - b.y);

        // Move to the top
        for (let y = 0; y < col.length; y++) {
          col[y].y = y;
        }

        // Merge
        for (let y = 0; y < col.length - 1; y++) {
          if (
            col[y].value === col[y + 1].value &&
            !col[y].isMerged &&
            !col[y + 1].isMerged
          ) {
            col[y].value *= 2;
            col[y].isMerging = true;
            col[y + 1].isMerged = true;
          }
        }

        // Move to the top again (adjust merged)
        let y = 0;
        for (const tile of col) {
          tile.y = tile.isMerged ? y - 1 : y;
          if (!tile.isMerged) y++;
        }
      }
      return { tiles: [...state.tiles] };
    });
    get().handlePostMove(prevTiles);
  },

  moveDown: () => {
    get().removeMerged();
    const prevTiles = structuredClone(get().tiles);
    set((state) => {
      for (let x = 0; x < FIELD_COLS; x++) {
        const col = state.tiles
          .filter((t) => t.x === x)
          .sort((a, b) => a.y - b.y);

        // Move to the bottom
        for (let i = 0; i < col.length; i++) {
          col[i].y = FIELD_ROWS - col.length + i;
        }

        // Merge
        for (let y = col.length - 1; y > 0; y--) {
          if (
            col[y].value === col[y - 1].value &&
            !col[y].isMerged &&
            !col[y - 1].isMerged
          ) {
            col[y].value *= 2;
            col[y].isMerging = true;
            col[y - 1].isMerged = true;
          }
        }

        // Move to the down
        let y = FIELD_ROWS - 1;
        for (let i = col.length - 1; i >= 0; i--) {
          const tile = col[i];
          tile.y = tile.isMerged ? y + 1 : y;
          if (!tile.isMerged) y--;
        }
      }
      return { tiles: [...state.tiles] };
    });
    get().handlePostMove(prevTiles);
  },

  handlePostMove: (prevTiles: Tile[]) => {
    const newTiles = get().tiles;
    const moved = hasTilesChanged(prevTiles, newTiles);
    if (moved) {
      get().spawnNumber();
      const tilesAfterSpawn = get().tiles;
      if (isGameOver(tilesAfterSpawn)) {
        set(() => ({ gameOver: true }));
      }
    }
  },
}));

function getEmptyTiles(tiles: Tile[]): { x: number; y: number }[] {
  const emptyTiles: { x: number; y: number }[] = [];
  for (let y = 0; y < FIELD_ROWS; y++) {
    for (let x = 0; x < FIELD_COLS; x++) {
      if (!tiles.some((t) => t.x === x && t.y === y)) {
        emptyTiles.push({ x, y });
      }
    }
  }
  return emptyTiles;
}

function hasTilesChanged(prev: Tile[], next: Tile[]): boolean {
  if (prev.length !== next.length) return true;

  const mapPrev = new Map(prev.map((t) => [t.id, t]));
  for (const n of next) {
    const p = mapPrev.get(n.id);
    if (!p || p.x !== n.x || p.y !== n.y || p.value !== n.value) {
      return true;
    }
  }
  return false;
}

function isGameOver(tiles: Tile[]): boolean {
  return (
    getEmptyTiles(tiles).length === 0 &&
    !canMergeHorizontally(tiles) &&
    !canMergeVertically(tiles)
  );
}

function canMergeHorizontally(tiles: Tile[]): boolean {
  for (let y = 0; y < FIELD_ROWS; y++) {
    const row = tiles
      .filter((t) => t.y === y && !t.isMerged)
      .sort((a, b) => a.x - b.x);
    for (let x = 0; x < row.length - 1; x++) {
      if (row[x].value === row[x + 1].value) {
        return true;
      }
    }
  }
  return false;
}

function canMergeVertically(tiles: Tile[]): boolean {
  for (let x = 0; x < FIELD_COLS; x++) {
    const col = tiles
      .filter((t) => t.x === x && !t.isMerged)
      .sort((a, b) => a.y - b.y);

    for (let y = 0; y < col.length - 1; y++) {
      if (col[y].value === col[y + 1].value) {
        return true;
      }
    }
  }
  return false;
}
