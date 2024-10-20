import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculatePositionWithAim, Command, Position } from './types';
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

const SubmarineVisualization: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const submarineRef = useRef<THREE.Group | null>(null);
  const fishRef = useRef<THREE.Group[]>([]);
  const positionTextRef = useRef<THREE.Sprite | null>(null);

  const initialCommands: Command[] = [
    'forward 5',
    'down 5',
    'forward 8',
    'up 3',
    'down 8',
    'forward 2'
  ];
  const [commands, setCommands] = useState<Command[]>(initialCommands);
  const [commandType, setCommandType] = useState<'forward' | 'up' | 'down'>('forward');
  const [commandValue, setCommandValue] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position>({ horizontal: 0, depth: 0, aim: 0 });

  const updatePositionText = (position: Position) => {
    if (positionTextRef.current && submarineRef.current) {
      const text = `H: ${position.horizontal.toFixed(2)}, D: ${position.depth.toFixed(2)}`;
      updateTextSprite(positionTextRef.current, text);
    }
  };

  const updateSubmarineRotation = (aim: number) => {
    if (submarineRef.current) {
      // Convert aim to radians and limit the rotation to a maximum of 45 degrees
      const rotationAngle = THREE.MathUtils.degToRad(Math.min(Math.max(aim * -5, -45), 45));
      submarineRef.current.rotation.z = rotationAngle;
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

    positionTextRef.current = createTextSprite('H: 0.00, D: 0.00, A: 0.00');
    positionTextRef.current.position.set(0, 2, 0);
    submarine.add(positionTextRef.current);

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
// update the text sprite when the current position changes
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
    const totalDistance = 80;
    const duration = commands.length * 500; // 0.5 second per command
    const startTime = Date.now();

    const animateSubmarine = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const newPosition = calculatePositionWithAim(commands.slice(0, Math.ceil(progress * commands.length)));
      const targetX = -40 + (newPosition.horizontal / 50) * totalDistance;
      const targetY = -newPosition.depth / 10;

      submarineRef.current!.position.x = THREE.MathUtils.lerp(submarineRef.current!.position.x, targetX, 0.05);
      submarineRef.current!.position.y = THREE.MathUtils.lerp(submarineRef.current!.position.y, targetY, 0.05);

      setCurrentPosition(newPosition);
      updatePositionText(newPosition);
      updateSubmarineRotation(newPosition.aim);

      if (progress < 1) {
        requestAnimationFrame(animateSubmarine);
      } else {
        setIsPlaying(false);
      }
    };

    animateSubmarine();
  };

  const handleReset = () => {
    setCommands([]);
    setIsPlaying(false);
    const initialPosition = { horizontal: 0, depth: 0, aim: 0 };
    setCurrentPosition(initialPosition);
    if (submarineRef.current) {
      submarineRef.current.position.set(-40, 0, 0);
      submarineRef.current.rotation.z = 0;
    }
    updatePositionText(initialPosition);
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
                <Typography>Horizontal: {currentPosition.horizontal}</Typography>
                <Typography>Depth: {currentPosition.depth}</Typography>
                <Typography>Aim: {currentPosition.aim}</Typography>
                <Typography>Product: {currentPosition.horizontal * currentPosition.depth}</Typography>
              </CardContent>
            </ControlCard>
            <ControlCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Controls</Typography>
                <RadioGroup row value={commandType} onChange={(e) => setCommandType(e.target.value as 'forward' | 'up' | 'down')}>
                  <FormControlLabel value="forward" control={<Radio />} label="Forward" />
                  <FormControlLabel value="up" control={<Radio />} label="Up" />
                  <FormControlLabel value="down" control={<Radio />} label="Down" />
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