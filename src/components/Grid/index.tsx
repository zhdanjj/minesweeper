import './Grid.css';
import type { Cell, CellWithCoords } from '../../grid';
import { getCellsAround } from '../../grid';

type GridProps = {
  grid: Cell[][],
  setGrid: (grid: Cell[][]) => void,
  onGameLost: () => void,
}

export default function Grid (props: GridProps) {
  const divStyle = {
    '--width': props.grid[0].length
  } as React.CSSProperties;

  function onClick (cell: Cell, x: number, y: number,) {
    if (cell.isBomb) {
      props.onGameLost()
      return
    }

    if (!cell.open && !cell.flag) {
      cell.open = true

      if (!cell.bombsAround) {
        const closedEmpty: CellWithCoords[] = [{cell, x, y}]
        do {
          const c = closedEmpty.pop() as CellWithCoords
          getCellsAround(props.grid, c.x, c.y).forEach(v => {
            if  (!v.cell.bombsAround && !v.cell.open) {
              closedEmpty.push(v)
            }
            v.cell.open = true
          })
        } while (closedEmpty.length)
      }

      props.setGrid(props.grid)
      return
    }

    if (cell.open) {
      const closedAround = getCellsAround(props.grid, x, y).filter(v => !v.cell.open)
      let marked = closedAround.reduce((acc, v) => v.cell.flag ? acc + 1 : acc, 0)

      if (marked === cell.bombsAround) {
        closedAround.forEach(v => {
          if (!v.cell.flag)
            onClick(v.cell, v.x, v.y)
        })
      }
      props.setGrid(props.grid)
      return
    }
  }

  function onContext (cell: Cell) {
    if (!cell.open) {
      cell.flag = !cell.flag
      props.setGrid(props.grid)
    }
  }

  return (
    <div className="Grid" style={divStyle}>
      {
        props.grid.map((row, i) => {
          return row.map((cell, j) => (
            <div
              className={'GridCell' + (!cell.open && ' GridCell_closed' || '') + (cell.flag && ' GridCell_flag' || '')}
              key={i + '' + j}
              onClick={() => { onClick(cell, j, i) }}
              onContextMenu={(e) => { e.preventDefault(); onContext(cell) }}
            >
              { cell.isBomb && '💣' || cell.bombsAround > 0 && cell.bombsAround }
            </div>
          ))
        })
      }
    </div>
  )
}
