import "./scratch.css";

import React, { useEffect, useState } from "react";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

import Navbar from "../../components/template/Scratch/Navbar/navbar";

import {
  defineCustomBlocks,
  defineJsGenerators,
  toolbox,
} from "../../components/template/Scratch/blocks/index";

// Motion imports
import {
  moveForward,
  turnRight,
  turnLeft,
  randomPosition,
  moveTo,
  gotoX,
  gotoY,
  glideRandom,
  glidePosition,
} from "../../components/template/Scratch/utils/motion";

import {
  hide,
  say,
  sayForDuration,
  show,
  size,
  think,
  thinkForDuration,
} from "../../components/template/Scratch/utils/looks";

import {
  playSound,
  setVolume,
} from "../../components/template/Scratch/utils/sound";

// Event imports
import { onRunClicked } from "../../components/template/Scratch/utils/event";
import SpriteMovement from "../../components/template/Scratch/sprite-movement/SpriteMovement";
import SpriteControl from "../../components/template/Scratch/sprite-control/SpriteControl";

import { catSprite } from "~/images";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VSAY || Scratch" },
    { name: "login", content: "Welcome to VSAY Portal" },
  ];
}

function App() {
  //  Motion useStates
  const [forward, setForward] = useState(0);
  const [right, setRight] = useState(0);
  const [left, setLeft] = useState();
  const [random, setRandom] = useState({ x: 0, y: 0 });
  const [move, setMove] = useState({ x: 0, y: 0 });
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  // Looks usestates
  const [msg, setMsg] = useState("Hello");
  const [sizeSprite, setSizeSprite] = useState(1);
  const [display, setDisplay] = useState(true);

  // Sound useState
  const [track, setTrack] = useState("");
  const [trackVolume, setTrackVolume] = useState();

  // Sprite contrl useState
  const [imgPath, setImgPath] = useState(catSprite);
  const [bgPath, setBgPath] = useState("none");

  const [codeToRun, setCodeToRun] = useState("");
  const [running, setRunning] = useState(false);

  const navigate = useNavigate();

  // Reset props
  const reset = () => {
    console.log("resetCalled");

    setForward(0);
    setRight(0);
    setLeft(undefined);
    setRandom({ x: 0, y: 0 });
    setMove({ x: 0, y: 0 });
    setMoveX(0);
    setMoveY(0);

    // Looks reset
    setMsg("Hello");
    setSizeSprite(1);
    setDisplay(true);

    // Sound useState
    setTrack("");
    setTrackVolume(undefined);

    // Sprite control reset

    const sprite = document.getElementById("sprite1");

    if (sprite) {
      sprite.style.transform = "none";
    }
  };

  useEffect(() => {
    // Motion global declaration
    window.moveForward = (value) => {
      moveForward(setForward, value);
    };

    window.turnRight = (value) => {
      turnRight(setRight, value);
    };

    window.turnLeft = (value) => {
      turnLeft(setLeft, value);
    };

    window.randomPosition = () => {
      randomPosition(setRandom);
    };

    window.moveTo = (x, y) => {
      if (move.x == x && move.y == y) return;
      moveTo(setMove, x, y);
    };

    window.gotoX = (x) => {
      gotoX(setMoveX, x);
    };

    window.gotoY = (y) => {
      gotoY(setMoveY, y);
    };

    window.glideRandom = (t) => {
      glideRandom(setRandom, t);
    };

    window.glidePosition = (t, x, y) => {
      glidePosition(setMove, t, x, y);
    };

    // Looks global declaration
    window.sayForDuration = (message, duration) => {
      sayForDuration(setMsg, message, duration);
    };

    window.say = (message) => {
      say(setMsg, message);
    };

    window.think = (message) => {
      think(setMsg, message);
    };

    window.thinkForDuration = (message, duration) => {
      thinkForDuration(setMsg, message, duration);
    };

    window.size = (value) => {
      size(setSizeSprite, value);
    };

    window.show = () => {
      show(setDisplay);
    };

    window.hide = () => {
      hide(setDisplay);
    };

    // Sound global declaration
    window.playSound = (sound) => {
      playSound(setTrack, sound);
    };

    window.setVolume = (value) => {
      setVolume(setTrackVolume, value);
    };

    // Event global declaration
    window.window.onRunClicked = () => onRunClicked(setRunning);

    // Define blocks and generators from external files
    defineCustomBlocks();
    defineJsGenerators();

    // Initialize Blockly with toolbox
    const workspace = Blockly.inject("blocklyDiv", { toolbox });

    // Generate code on workspace change
    const generateCode = () => {
      const code = javascriptGenerator.workspaceToCode(workspace);
      console.log("Generated Code:\n", code);

      setCodeToRun(code);
    };
    workspace.addChangeListener(generateCode);

    //

    workspace.addChangeListener(() => {
      const flyout = workspace.getToolbox().getFlyout();
      const flyoutDiv = flyout.getWorkspace().getCanvas()
        .parentElement.parentElement;

      if (!flyout.isVisible()) {
        flyoutDiv.style.overflowY = "hidden"; // Hide scrollbar when flyout is closed
      } else {
        flyoutDiv.style.overflowY = "auto"; // Show when necessary
      }
    });

    return () => {
      workspace.dispose();
      delete window.onRunClicked;
    }; // Clean up
  }, []);

  const executeGeneratedCode = () => {
    try {
      if (codeToRun.includes("onRunClicked")) {
        const cleanCode = codeToRun.replace("// Run Block\n", ""); // Exclude run block
        new Function(cleanCode)();
      } else {
        console.warn(
          "onRunClicked function not found. Code execution skipped."
        );
      }
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  return (
    <main style={{ backgroundColor: "#e6f0ff", height: "100vh" }}>
      <header>
        <Navbar />
      </header>
      <div className="container1">
        <div className="blockly_container">
          <div id="blocklyDiv"></div>
        </div>
        <div className="sprite_area">
          <SpriteMovement
            onRunClicked={executeGeneratedCode}
            msg={msg}
            reset={reset}
            imgPath={imgPath}
            bgPath={bgPath}
          />
          <SpriteControl setImgPath={setImgPath} setBgPath={setBgPath} />
        </div>
      </div>
    </main>
  );
}

export default App;
