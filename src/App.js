import logo from './logo.svg';
import './App.css';

import Draggable from 'react-draggable'; // The default
import TEN_C from './assets/cards/10C';

function App() {

  const handleCardDrag = (e, data) => {
    console.log(data);
  }

  const checkCollision = (collider, colliding) => {
    const colliderRect = collider.getBoundingClientRect();
    const collidingRect = colliding.getBoundingClientRect();
    return !(
      colliderRect.right < collidingRect.left ||
      collidingRect.right < collidingRect.left ||
      collidingRect.bottom < colliderRect.top ||
      colliderRect.bottom < colliderRect.top
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='dragArea' style={{width: '500px', height: '500px', border: '1px solid white'}}></div>
        <TEN_C />
      </header>
    </div>
  );
}

export default App;
