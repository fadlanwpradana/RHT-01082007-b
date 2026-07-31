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
import bgMusic from "../src/assets/omy.mp3";
import dustPhoto1 from "./assets/rht1.jpg";
import dustPhoto2 from "./assets/rht2.jpg";
import dustPhoto3 from "./assets/rht3.jpg";
import dustPhoto4 from "./assets/rht4.jpg";
import dustPhoto5 from "./assets/rht5.jpeg";

const dustPhotos = [dustPhoto1, dustPhoto2, dustPhoto3, dustPhoto4, dustPhoto5];

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    initSpaceScene();

    const playMusic = async () => {
      try {
        audioRef.current.volume = 0.1; // 10% volume
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
      <img
        id="dust-photo"
        src={dustPhoto1}
        data-photos={JSON.stringify(dustPhotos)}
        alt=""
        aria-hidden="true"
      />

      <div id="ttl">Radiometric Infrared Flux Field Astrometry</div>
      <div id="ttl2">
        "Some people look at the stars and see galaxies. I look at them and see
        you."
      </div>

      <div id="lbl">RHT-01082007 b</div>

      <div id="zoom">
        <button id="zin">+</button>
        <button id="zout">−</button>
      </div>
    </div>
  );
}

export default App;
