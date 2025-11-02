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
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  init,
}: {
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
  init: () => void;
}) => {
  return (
    <div className="game-buttons-container">
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveUp}>
          <ArrowUpwardRounded fontSize="large" />
        </IconButton>
      </div>
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveLeft}>
          <ArrowBackRounded fontSize="large" />
        </IconButton>
        <IconButton disabled size="large" onClick={init}>
          <RestartAltRounded fontSize="large" />
        </IconButton>
        <IconButton size="large" onClick={moveRight}>
          <ArrowForwardRounded fontSize="large" />
        </IconButton>
      </div>
      <div className="game-buttons-row">
        <IconButton size="large" onClick={moveDown}>
          <ArrowDownwardRounded fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};
