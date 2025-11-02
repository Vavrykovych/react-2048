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
  init: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
  spawnNumber: () => void;
  removeMerged: () => void;
};

let tileId = 0;

export const useGameStore = create<GameStore>((set, get) => ({
  tiles: [],

  init: () => {
    tileId = 0;
    set(() => ({
      tiles: [],
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
    get().spawnNumber();
  },

  moveRight: () => {
    get().removeMerged();
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
    get().spawnNumber();
  },

  moveUp: () => {
    get().removeMerged();
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
    get().spawnNumber();
  },

  moveDown: () => {
    get().removeMerged();
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
    get().spawnNumber();
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
