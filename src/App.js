// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;





import { useEffect } from "react";
import "./App.css";
import { initSpaceScene } from "./spaceScene";

function App() {
  useEffect(() => {
    initSpaceScene();
  }, []);

  return (
    <div id="wrap">
      <canvas id="c"></canvas>

      <div id="cur"></div>

      <div id="ttl">
        Astronomical Radiometric Mapping of Extrasolar Yields
      </div>

      <div id="lbl">
        Armey J1701.27
      </div>

      <div id="zoom">
        <button id="zin">+</button>
        <button id="zout">−</button>
      </div>
    </div>
  );
}

export default App;