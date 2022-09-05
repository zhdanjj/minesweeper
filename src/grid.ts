export type Cell = {
  isBomb: boolean,
  bombsAround: number,
  open: boolean,
  flag: boolean,
}

function makeCell (): Cell {
  return {
    isBomb: false,
    bombsAround: 0,
    open: false,
    flag: false,
  }
}

function getRandomInt (max: number, min=0): number {
  return Math.floor(Math.random() * (max - min)) + min
}

export type CellWithCoords = {
  cell: Cell,
  x: number,
  y: number,
}

export function getCellsAround (grid: Cell[][], x: number, y: number): CellWithCoords[] {
  const coords: [number, number][] = [
    [x, y - 1],
    [x, y + 1],

    [x - 1, y],
    [x - 1, y - 1],
    [x - 1, y + 1],

    [x + 1, y],
    [x + 1, y - 1],
    [x + 1, y + 1],
  ]

  return coords.reduce((acc: CellWithCoords[], v) => {
    const cell = getCell(grid, ...v)
    cell && acc.push({
      cell,
      x: v[0],
      y: v[1],
    })
    return acc
  }, [])
}

function getCell (grid: Cell[][], x: number, y: number) {
  return grid[y] && grid[y][x]
}

export function forEachCell (grid: Cell[][], cb: (cell: Cell, x: number, y: number) => void) {
  const w = grid[0].length
  const h = grid.length

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      cb(grid[i][j], j, i)
    }
  }
}

export function makeGrid (bombs: number, width=18, height=9,): Cell[][] {
  const grid: Cell[][] = []

  for (let i = 0; i < height; i++) {
    const row = []
    for (let j = 0; j < width; j++) {
      row.push( makeCell() )
    }
    grid.push(row)
  }

  let mines = bombs
  while (mines) {
    const x = getRandomInt(width)
    const y = getRandomInt(height)

    if (!grid[y][x].isBomb) {
      grid[y][x].isBomb = true
      mines--
    }
  }

  function isBomb(x: number, y: number) {
    return grid[y] && grid[y][x] && grid[y][x].isBomb
  }

  function getBombsAround (x: number, y: number) {
    let c = 0

    getCellsAround(grid, x, y).forEach(v => {
      v.cell.isBomb && c++
    })
    return c
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid[y][x].bombsAround = getBombsAround(x, y)
    }
  }

  return grid
}
