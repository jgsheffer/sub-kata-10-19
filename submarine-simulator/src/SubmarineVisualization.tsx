import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Command, Position } from './types';
import {
  Box, Container, Typography, Radio, RadioGroup, FormControlLabel, TextField,
  Fab, Snackbar, Grid, CardContent, AppBar, Toolbar
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import { theme } from './theme';
import { VisualizationContainer, ControlCard } from './StyledComponents';
import { setupScene } from './SceneSetup';
import { createTextSprite, updateTextSprite } from './TextSprite';
import { calculatePositionWithAim } from './submarine';

const SubmarineVisualization: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const submarineRef = useRef<THREE.Group | null>(null);
  const fishRef = useRef<THREE.Group[]>([]);
  const positionTextRef = useRef<THREE.Sprite | null>(null);
  const pathRef = useRef<THREE.Line | null>(null);

  const initialCommands: Command[] = [
    'forward 5',
    'down 5',
    'forward 8',
    'up 3',
    'down 8',
    'forward 2',
     'left 90',
     'forward 10',
     'left 90',
     'forward 10',

  ];
  const initialPosition: Position = { x: 0, y: 0, z: 0, pitch: 0, yaw: 0 };
  const [commands, setCommands] = useState<Command[]>(initialCommands);
  const [commandType, setCommandType] = useState<'forward' | 'up' | 'down' | 'left' | 'right'>('forward');
  const [commandValue, setCommandValue] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position>(initialPosition);

  const updatePositionText = (position: Position) => {
    if (positionTextRef.current && submarineRef.current) {
      const text = `X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}`;
      updateTextSprite(positionTextRef.current, text);
    }
  };

  const updateSubmarineRotation = (pitch: number, yaw: number) => {
    if (submarineRef.current) {
      submarineRef.current.rotation.x = pitch;
      submarineRef.current.rotation.y = -yaw; // Reverse the yaw rotation
    }
  };

  const initializePath = () => {
    if (sceneRef.current && !pathRef.current) {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
      pathRef.current = new THREE.Line(geometry, material);
      sceneRef.current.add(pathRef.current);
    }
  };
  const updatePath = (position: THREE.Vector3) => {
    if (pathRef.current) {
      const positions = pathRef.current.geometry.getAttribute('position');
      let newPositions: Float32Array;
      
      if (positions && positions.array.length > 0) {
        newPositions = new Float32Array([...Array.from(positions.array), position.x, position.y, position.z]);
      } else {
        newPositions = new Float32Array([position.x, position.y, position.z]);
      }
      
      pathRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
      pathRef.current.geometry.attributes.position.needsUpdate = true;
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const { scene, camera, renderer, submarine, fish } = setupScene(mountRef.current);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    submarineRef.current = submarine;
    fishRef.current = fish;

    positionTextRef.current = createTextSprite('X: 0.00, Y: 0.00, Z: 0.00');
    positionTextRef.current.position.set(0, 2, 0);
    submarine.add(positionTextRef.current);

    initializePath();

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Animate fish
      fishRef.current.forEach((fish) => {
        fish.position.x -= 0.05;
        if (fish.position.x < -50) {
          fish.position.x = 50;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    updatePositionText(currentPosition);
  }, [currentPosition]);

  const handleAddCommand = () => {
    const value = parseInt(commandValue, 10);
    if (!isNaN(value) && value > 0) {
      const newCommand = `${commandType} ${value}` as Command;
      setCommands([...commands, newCommand]);
      setSnackbarOpen(true);
    } else {
      alert('Please enter a valid positive number for the command value.');
    }
  };

  const handlePlay = () => {
    if (!submarineRef.current) return;
    setIsPlaying(true);
    const duration = commands.length * 500; // 0.5 second per command
    const startTime = Date.now();

    const animateSubmarine = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const newPosition = calculatePositionWithAim(commands.slice(0, Math.ceil(progress * commands.length)));

      submarineRef.current!.position.x = THREE.MathUtils.lerp(submarineRef.current!.position.x, newPosition.x, 0.05);
      submarineRef.current!.position.y = THREE.MathUtils.lerp(submarineRef.current!.position.y, newPosition.y, 0.05);
      submarineRef.current!.position.z = THREE.MathUtils.lerp(submarineRef.current!.position.z, newPosition.z, 0.05);

      setCurrentPosition(newPosition);
      updateSubmarineRotation(newPosition.pitch, newPosition.yaw);
      updatePath(submarineRef.current!.position);

      if (progress < 1) {
        requestAnimationFrame(animateSubmarine);
      } else {
        setIsPlaying(false);
      }
    };

    animateSubmarine();
  };

  const handleReset = () => {
    setCommands(initialCommands);
    setIsPlaying(false);
    setCurrentPosition(initialPosition);
    if (submarineRef.current) {
      submarineRef.current.position.set(0, 0, 0);
      submarineRef.current.rotation.set(0, 0, 0);
    }
    updatePositionText(initialPosition);
    if (pathRef.current && sceneRef.current) {
      sceneRef.current.remove(pathRef.current);
      pathRef.current = null;
      initializePath();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h1" component="h1" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Submarine Simulator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <VisualizationContainer elevation={3}>
              <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            </VisualizationContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <ControlCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Current Position</Typography>
                <Typography>X: {currentPosition.x.toFixed(2)}</Typography>
                <Typography>Y: {currentPosition.y.toFixed(2)}</Typography>
                <Typography>Z: {currentPosition.z.toFixed(2)}</Typography>
                <Typography>Pitch: {(currentPosition.pitch * 180 / Math.PI).toFixed(2)}°</Typography>
                <Typography>Yaw: {(currentPosition.yaw * 180 / Math.PI).toFixed(2)}°</Typography>
              </CardContent>
            </ControlCard>
            <ControlCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Controls</Typography>
                <RadioGroup row value={commandType} onChange={(e) => setCommandType(e.target.value as 'forward' | 'up' | 'down' | 'left' | 'right')}>
                  <FormControlLabel value="forward" control={<Radio />} label="Forward" />
                  <FormControlLabel value="up" control={<Radio />} label="Up" />
                  <FormControlLabel value="down" control={<Radio />} label="Down" />
                  <FormControlLabel value="left" control={<Radio />} label="Left" />
                  <FormControlLabel value="right" control={<Radio />} label="Right" />
                </RadioGroup>
                <TextField
                  fullWidth
                  type="number"
                  value={commandValue}
                  onChange={(e) => setCommandValue(e.target.value)}
                  label="Value"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Fab color="secondary" onClick={handleAddCommand} disabled={isPlaying}>
                    <AddIcon />
                  </Fab>
                  <Fab color="primary" onClick={handlePlay} disabled={isPlaying || commands.length === 0}>
                    <PlayArrowIcon />
                  </Fab>
                  <Fab color="default" onClick={handleReset} disabled={isPlaying}>
                    <ReplayIcon />
                  </Fab>
                </Box>
              </CardContent>
            </ControlCard>
            <ControlCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Commands</Typography>
                <Box component="ul" sx={{ pl: 2, maxHeight: '200px', overflowY: 'auto' }}>
                  {commands.map((command, index) => (
                    <li key={index}>{command}</li>
                  ))}
                </Box>
              </CardContent>
            </ControlCard>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Command added successfully"
      />
    </ThemeProvider>
  );
};

export default SubmarineVisualization;