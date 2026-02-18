let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  // 背景の紺色（残像を少し長めにするために透明度をさらに下げました）
  background(230, 80, 15, 5); 

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }

  // 自動で湧き出す光も、さらにゆっくり静かに
  if (frameCount % 80 == 0) {
    particles.push(new LightParticle(width / 2, height / 2, true));
  }
}

function mousePressed() {
  if (navigator.vibrate) {
    navigator.vibrate(20); 
  }
  
  // クリック時の粒子を少し増やし、スローな広がりを強調
  for (let i = 0; i < 12; i++) {
    particles.push(new LightParticle(mouseX, mouseY, false));
  }
}

class LightParticle {
  constructor(x, y, isAuto) {
    this.pos = createVector(x, y);
    // スピードを極限まで落としました (0.1 〜 0.4)
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.4)); 
    this.acc = createVector(0, 0);
    
    this.maxLife = random(200, 350); // 寿命を長くして、ゆっくり消えるように
    this.life = this.maxLife;
    
    this.d = isAuto ? random(2, 4) : random(4, 10);
    this.noiseOffset = random(1000);
    this.baseHue = random(250, 280); // ラベンダー・バイオレット系
  }

  finished() {
    return this.life < 0;
  }

  update() {
    // 揺らぎ（ノイズ）の影響もより小さく、滑らかに
    let n = noise(this.pos.x * 0.003, this.pos.y * 0.003, frameCount * 0.005 + this.noiseOffset);
    let angle = map(n, 0, 1, 0, TWO_PI * 4);
    this.acc = p5.Vector.fromAngle(angle).mult(0.005);
    
    this.vel.add(this.acc);
    this.vel.limit(0.5); // 最高速度を低く制限
    this.pos.add(this.vel);
    
    this.life -= 0.4; // 減衰スピードを遅く
  }

  show() {
    noStroke();
    let alpha = map(this.life, 0, this.maxLife, 0, 80);
    let currentHue = this.baseHue + sin(frameCount * 0.02 + this.noiseOffset) * 15;
    
    // 光の広がり（グロー効果）
    for (let i = 3; i > 0; i--) {
      fill(currentHue, 50, 100, alpha / (i * 2));
      ellipse(this.pos.x, this.pos.y, this.d * (i * 2.5));
    }
    
    // 芯の部分
    fill(currentHue, 10, 100, alpha);
    ellipse(this.pos.x, this.pos.y, this.d);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}