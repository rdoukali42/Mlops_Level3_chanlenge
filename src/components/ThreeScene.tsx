
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/use-mobile';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Renderer with antialiasing and alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);
    
    // Camera setup with 75 degree FOV
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    camera.position.y = 0;
    camera.position.x = 0;
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create room dimensions
    const roomSize = 40;
    const gridDivisions = 20;
    const gridColor = 0x0AFF16; // Vibrant green color
    const gridOpacity = 0.4;
    
    // Room grid materials
    const gridMaterial = new THREE.LineBasicMaterial({ 
      color: gridColor, 
      transparent: true, 
      opacity: gridOpacity,
    });
    
    // Create the room (floor and walls)
    const roomGroup = new THREE.Group();
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize, gridDivisions, gridDivisions);
    floorGeometry.rotateX(-Math.PI / 2); // Rotate to be horizontal
    const floorGrid = new THREE.GridHelper(roomSize, gridDivisions, gridColor, gridColor);
    floorGrid.position.y = -roomSize/2;
    roomGroup.add(floorGrid);
    
    // Back Wall
    const backWallGrid = new THREE.GridHelper(roomSize, gridDivisions, gridColor, gridColor);
    backWallGrid.rotation.x = Math.PI / 2;
    backWallGrid.position.z = -roomSize/2;
    roomGroup.add(backWallGrid);
    
    // Left Wall
    const leftWallGrid = new THREE.GridHelper(roomSize, gridDivisions, gridColor, gridColor);
    leftWallGrid.rotation.z = Math.PI / 2;
    leftWallGrid.position.x = -roomSize/2;
    roomGroup.add(leftWallGrid);
    
    // Right Wall
    const rightWallGrid = new THREE.GridHelper(roomSize, gridDivisions, gridColor, gridColor);
    rightWallGrid.rotation.z = Math.PI / 2;
    rightWallGrid.position.x = roomSize/2;
    roomGroup.add(rightWallGrid);
    
    // Add the room to the scene
    scene.add(roomGroup);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x0AFF16, 0.1);
    scene.add(ambientLight);
    
    // Add point light in the center of the room for subtle glow
    const pointLight = new THREE.PointLight(0x0AFF16, 0.2);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Scene scale adjustments for mobile
    if (isMobile) {
      camera.position.z = 30;
      roomGroup.scale.set(0.7, 0.7, 0.7);
    }
    
    // Initial camera position
    camera.position.y = 5;
    camera.position.z = 15;
    camera.lookAt(0, 0, -10);
    
    // Handle scroll events for parallax effect
    let scrollY = window.scrollY;
    let targetY = 5;
    let targetZ = 15;
    
    const handleScroll = () => {
      scrollY = window.scrollY;
      const scrollProgress = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      
      // Move camera based on scroll position
      targetY = 5 - scrollProgress * 12; // Move down as we scroll
      targetZ = 15 - scrollProgress * 25; // Move forward as we scroll
      
      // Pulse effect increases with scroll
      const pulseIntensity = 0.3 + scrollProgress * 0.7;
      pointLight.intensity = 0.1 + 0.1 * Math.sin(Date.now() * 0.001) * pulseIntensity;
    };
    window.addEventListener('scroll', handleScroll);
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      
      // Adjust room scale for different viewport sizes
      if (width < 768) {
        roomGroup.scale.set(0.7, 0.7, 0.7);
        camera.position.z = targetZ + 10;
      } else {
        roomGroup.scale.set(1, 1, 1);
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth camera movement
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      
      // Subtle room rotation for added dynamism
      roomGroup.rotation.y += 0.0005;
      
      // Apply pulsing effect to grid lines
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time) * 0.1 + 0.9;
      roomGroup.children.forEach(grid => {
        if (grid instanceof THREE.GridHelper) {
          const material = grid.material as THREE.Material;
          if (Array.isArray(material)) {
            material.forEach(mat => {
              if (mat instanceof THREE.LineBasicMaterial) {
                mat.opacity = gridOpacity * pulse;
              }
            });
          } else if (material instanceof THREE.LineBasicMaterial) {
            material.opacity = gridOpacity * pulse;
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      // Dispose materials and geometries
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [isMobile]);
  
  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};

export default ThreeScene;
