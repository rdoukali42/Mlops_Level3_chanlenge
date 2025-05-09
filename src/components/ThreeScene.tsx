
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
    camera.position.z = 50;
    camera.position.y = 0;
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create grid material
    const gridSize = 50;
    const gridDivisions = 20;
    const gridColor = 0x0D2E0D;
    
    // Create grid geometry
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: gridColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    
    // Create grid mesh
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = Math.PI / 3.5; // Rotate to give perspective
    grid.position.y = -5;
    scene.add(grid);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x0AFF16, 0.1);
    scene.add(ambientLight);

    // Scene scale adjustments for mobile
    if (isMobile) {
      camera.position.z = 70;
      grid.scale.set(0.7, 0.7, 0.7);
    }
    
    // Handle scroll events for parallax effect
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      
      // Adjust grid scale for different viewport sizes
      if (width < 768) {
        grid.scale.set(0.7, 0.7, 0.7);
        camera.position.z = 70;
      } else {
        grid.scale.set(1, 1, 1);
        camera.position.z = 50;
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Apply subtle movements to the grid
      grid.rotation.z += 0.001;
      
      // Apply parallax effect based on scroll position
      const normalizedScroll = scrollY * 0.0005;
      grid.position.y = -5 - normalizedScroll * 15;
      
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
