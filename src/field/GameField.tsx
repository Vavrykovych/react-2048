import { FIELD_COLS, FIELD_ROWS } from '../constants';
import type { Tile } from '../gameStore';
import './GameField.css';

export const tileColors: Record<number, string> = {
  0: 'var(--color-cell-empty)',
  2: 'var(--color-2)',
  4: 'var(--color-4)',
  8: 'var(--color-8)',
  16: 'var(--color-16)',
  32: 'var(--color-32)',
  64: 'var(--color-64)',
  128: 'var(--color-128)',
  256: 'var(--color-256)',
  512: 'var(--color-512)',
  1024: 'var(--color-1024)',
  2048: 'var(--color-2048)',
};

export const GameField = ({ tiles }: { tiles: Tile[] }) => {
  return (
    <div
      className="game-field"
      style={
        {
          '--rows': FIELD_COLS,
          '--cols': FIELD_ROWS,
          width:
            'calc(var(--cell-size) * var(--rows) + (var(--rows) - 0.5) * var(--gap-size) + 20px)',
          height:
            'calc(var(--cell-size) * var(--cols) + (var(--cols) - 0.5) * var(--gap-size) + 20px)',
        } as React.CSSProperties
      }
    >
      {tiles.map((tile) => (
        <div
          key={`cell-${tile.id}`}
          className={`game-cell ${tile.isNew ? 'new' : ''} ${tile.isMerging ? 'merging' : ''}`}
          style={{
            backgroundColor: tileColors[tile.value],
            left: `calc(var(--cell-size) * ${tile.x} + ${tile.x} * var(--gap-size) + 10px)`,
            top: `calc(var(--cell-size) * ${tile.y} + ${tile.y} * var(--gap-size) + 10px)`,
            zIndex: tile.value,
          }}
        >
          {tile.value}
        </div>
      ))}
    </div>
  );
};
