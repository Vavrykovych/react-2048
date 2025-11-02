import {
  ArrowBackRounded,
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
  RestartAltRounded,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import './GameButtons.css';

export const GameButtons = ({
  gameOver,
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  init,
}: {
  gameOver: boolean;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
  init: () => void;
}) => {
  return (
    <div className="game-buttons-container">
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveUp} disabled={gameOver}>
          <ArrowUpwardRounded fontSize="large" />
        </IconButton>
      </div>
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveLeft} disabled={gameOver}>
          <ArrowBackRounded fontSize="large" />
        </IconButton>
        <IconButton size="large" onClick={init} disabled={!gameOver}>
          <RestartAltRounded fontSize="large" />
        </IconButton>
        <IconButton size="large" onClick={moveRight} disabled={gameOver}>
          <ArrowForwardRounded fontSize="large" />
        </IconButton>
      </div>
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveDown} disabled={gameOver}>
          <ArrowDownwardRounded fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};
