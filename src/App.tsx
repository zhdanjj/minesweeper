import React, { useState } from 'react';
import Grid from './components/Grid';
import Status from './components/Status';
import type { Cell } from './grid';
import { makeGrid, forEachCell } from './grid';

function App() {
  const bombs = 25

  const [grid, setGrid] = useState(makeGrid(bombs))
  const [state, setState] = useState('inprogress' as 'inprogress' | 'victory' | 'defeat')

  function onSetGrid (grid: Cell[][]) {
    setGrid([...grid])
  }

  function onNewGame () {
    setState('inprogress')
    setGrid(makeGrid(bombs))
  }

  function onGameLost () {
    setState('defeat')
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        grid[i][j].open = true
      }
    }
    setGrid([...grid])
  }

  const flags = grid.flat().reduce((acc, v) => v.flag ? acc + 1 : acc, 0)
  const minesLeft = bombs - flags

  return (
    <div className="App">
      <Status
        minesLeft={minesLeft}
        gameStatus={state}
        onNewGame={onNewGame}
      />
      <Grid
        grid={grid}
        setGrid={onSetGrid}
        onGameLost={onGameLost}
      />
    </div>
  );
}

export default App;
