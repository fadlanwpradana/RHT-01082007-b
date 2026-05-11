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





import { useEffect, useRef } from "react";
import "./App.css";
import { initSpaceScene } from "./spaceScene";
import bgMusic from "../src/assets/jl.mp3";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    initSpaceScene();

    const playMusic = async () => {
      try {
        audioRef.current.volume = 0.02; // 10% volume
        await audioRef.current.play();
      } catch (err) {
        console.log("Autoplay blocked");
      }
    };

    playMusic();

    // browser fallback
    window.addEventListener("click", playMusic);

    return () => {
      window.removeEventListener("click", playMusic);
    };
  }, []);

  return (
    <div id="wrap">

      {/* Background Music */}
      <audio ref={audioRef} loop hidden>
        <source src={bgMusic} type="audio/mp3" />
      </audio>
      
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