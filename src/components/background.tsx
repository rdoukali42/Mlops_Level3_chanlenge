
import React, { useEffect, useRef } from 'react';

// Define proper interfaces for the Vector and Particle classes
interface VectorType {
  x: number;
  y: number;
  set: (x: number, y: number) => VectorType;
  add: (v: VectorType) => VectorType;
  mult: (n: number) => VectorType;
  setMag: (n: number) => VectorType;
  sub: (v: VectorType) => VectorType;
  magSq: () => number;
  clone: () => VectorType;
}

interface ParticleType {
  state: string;
  createdAt: number;
  pos: VectorType;
  vel: VectorType;
  isClone: boolean;
  offset?: number;
  char?: string;
  pickChar: () => void;
  reset: () => void;
  clone: () => void;
  remove: () => void;
}

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleList: ParticleType[] = [];
  const columns: number[] = [];
  const w = 12;
  const h = w * 2;
  let lastUpdateAt = -1000;
  let animationFrame: number;

  class Vector implements VectorType {
    x: number;
    y: number;
    
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    
    set(x: number, y: number) {
      this.x = x;
      this.y = y;
      return this;
    }
    
    add(v: VectorType) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    
    mult(n: number) {
      this.x *= n;
      this.y *= n;
      return this;
    }
    
    setMag(n: number) {
      const mag = Math.sqrt(this.x * this.x + this.y * this.y) || 1;
      return this.set((this.x / mag) * n, (this.y / mag) * n);
    }
    
    sub(v: VectorType) {
      return new Vector(this.x - v.x, this.y - v.y);
    }
    
    magSq() {
      return this.x * this.x + this.y * this.y;
    }
    
    clone() {
      return new Vector(this.x, this.y);
    }
  }

  class Particle implements ParticleType {
    state: string;
    createdAt: number;
    pos: VectorType;
    vel: VectorType;
    isClone: boolean;
    offset?: number;
    char?: string;
    
    constructor(isClone = false) {
      this.state = 'good';
      this.createdAt = performance.now();
      this.pos = new Vector();
      this.vel = new Vector();
      this.isClone = isClone;
      this.pickChar();
      if (!this.isClone) this.reset();
    }
    
    reset() {
      const now = performance.now();
      const xCount = Math.ceil(window.innerWidth / w);
      const validColumns = [];
      for (let i = 0; i < xCount; i++) {
        const n = columns[i];
        if (!n || now - n > 2500) validColumns.push(i);
      }
      if (validColumns.length === 0) validColumns.push(0);
      const columnIndex = validColumns[Math.floor(Math.random() * validColumns.length)];
      columns[columnIndex] = now;
      const x = (columnIndex + 0.5) * w;
      this.pos = new Vector(x, -w);
      this.vel.set(0, 0);
    }
    
    pickChar() {
      if (this.isClone && Math.random() < 0.9) return;
      const offsetGroup = [
        [0x30, 0x39],
        [0x41, 0x5a],
        [0xff66, 0xff9d]
      ][Math.floor(Math.random() * 3)];
      this.offset = Math.floor(Math.random() * (offsetGroup[1] - offsetGroup[0])) + offsetGroup[0];
      this.char = String.fromCodePoint(this.offset);
    }
    
    clone() {
      if (!this.isClone) {
        const p = new Particle(true);
        p.pos = this.pos.clone();
        p.char = this.char;
        particleList.push(p);
      } else {
        this.remove();
      }
    }
    
    remove() {
      const index = particleList.indexOf(this);
      if (index !== -1) particleList.splice(index, 1);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 40; i++) {
      const p = new Particle(false);
      p.pos.y = Math.random() * canvas.height;
      particleList.push(p);
    }

    const draw = (e) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '600 24px "Roboto Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const shouldUpdate = lastUpdateAt + 100 < e;
      for (let i = particleList.length - 1; i >= 0; i--) {
        const p = particleList[i];
        const aliveTime = e - p.createdAt;
        const style = p.isClone
          ? `hsla(161, 70%, 60%, ${Math.max(0, 1 - (aliveTime - 2000) / 500)})`
          : '#5CD8B1';
        ctx.fillStyle = style;
        ctx.fillText(p.char, p.pos.x, p.pos.y);
        if (shouldUpdate) {
          if (!p.isClone) {
            p.clone();
            p.pos.y += 24;
          }
          p.pickChar();
          if (p.pos.y > canvas.height) p.reset();
        }
        p.pos.add(p.vel.clone().mult(0.875));
      }
      if (shouldUpdate) lastUpdateAt = e;
      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default MatrixRain;
