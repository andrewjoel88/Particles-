
let raindrops = [];
let gravity; 
let wind;
let numberOfParticles = 500;

function  setup(){
    createCanvas(800, 800);
    for (let i = 0; i < numberOfParticles; i++) {
        raindrops[i] = new Raindrop(i);
    }
   gravity = createVector(0, 0);
   wind = createVector(0, 0);
  //  frameRate(5);
}

function draw(){
  let windXAmount = map(mouseX, 0, width, -0.005, 0.005);
  let windYAmount = map(mouseY, 0, height, 0, 0);
  wind.set(windXAmount, windYAmount);
  background(0);
    for (let i = 0; i < raindrops.length; i++) {
      raindrops[i].update();
      raindrops[i].show(); 
    }
    // text(dropcount, width/2, height/2);
}
// Replace `raindrops` with the actual array name (e.g., drops, particles)
function removeDropsNear(x, y, removeRadius = 50) {
  const arrName = typeof raindrops !== 'undefined' ? raindrops
                : (typeof drops !== 'undefined' ? drops
                : (typeof particles !== 'undefined' ? particles : null));
  if (!arrName) return;
  for (let i = arrName.length - 1; i >= 0; i--) {
    const d = dist(x, y, arrName[i].x, arrName[i].y);
    if (d <= removeRadius) arrName.splice(i, 1);
  }
}

function mousePressed() {
  removeDropsNear(mouseX, mouseY, 60); // change 60 to taste
}

function mouseDragged() {
  removeDropsNear(mouseX, mouseY, 40); // optional: remove while dragging
}


class Raindrop {
  constructor(myId) {
    // This code runs once when an instance is created.
    this.id = myId;
    this.location = createVector(random(width), random(height));
    this.size = 10;
    this.velocity = p5.Vector.random2D();
    this.birthTime = millis();
    this.age;
    this.disrupted = false;
    this.from = color(0, 0, 0);
    this.to = color(255, 255, 255);
  }

  show() {
    // This code runs once when .show() is called.
    //this.size = map(this.age, 0, 5000, 10, 0);]
    console.log(this.size);
    let lerpAmount = map(this.age, 0, 5000, 0, 1); //3 second color shift
    let fillColor = lerpColor(this.from, this.to, lerpAmount);
    fill(fillColor);
    rect(this.location.x, this.location.y, this.size, this.size);
  }

  update() {
    // This code runs once when .update() is called.
    if(this.disrupted){
      this.age = millis() - this.disruptionTime;
    }
    if(this.age > 5000){
      this.birth();
    }
    if(
      this.location.x > mouseX - 10 && 
      this.location.x < mouseX + 10 && 
      this.location.y > mouseY - 10 &&
      this.location.y < mouseY + 10
    ){
      this.disrupt();
      console.log("disrupted particle");
    }
    this.velocity.add(gravity);
    this.velocity.add(wind);
    this.location.add(this.velocity);
    if(this.location.y > height || this.location.y < 0){
      this.velocity.y = this.velocity.y * -1;
    }
    if(this.location.x > width || this.location.x < 0){
      this.velocity.x = this.velocity.x * -1;
    }
    this.checkForParticleCollisions();
  }
  birth(){
    this.location = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.disrupted = false;
    this.age = 0;
  }

  disrupt(){
    this.velocity = p5.Vector.random2D().mult(5);
    this.disruptionTime = millis();
    this.disrupted = true;
  }
  checkForParticleCollisions(){
    for(let i = 0; i < numberOfParticles; i++){
      if (this.id != raindrops[i].id){
        if(
          this.location.x > raindrops[i].location.x - 5 && 
          this.location.x < raindrops[i].location.x + 5 && 
          this.location.y > raindrops[i].location.y - 5 &&
          this.location.y < raindrops[i].location.y + 5
        ){
          this.disrupt();
        }
      }
    }

  }
}



