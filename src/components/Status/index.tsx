import './Status.css';

type StatusProps = {
  minesLeft: number,
  gameStatus: 'inprogress' | 'victory' | 'defeat',
  onNewGame: () => void,
}

export default function Status (props: StatusProps) {
  return (
    <div className="Status">
      <div className="Status__minesLeft">
        💣 { props.minesLeft }
      </div>
      <button className="Status__btnGame" onClick={props.onNewGame}>
        {
          props.gameStatus === 'victory' && '😎'
          ||
          props.gameStatus === 'inprogress' && '🙂'
          ||
          props.gameStatus === 'defeat' && '😵'
        }
      </button>
    </div>
  )
}