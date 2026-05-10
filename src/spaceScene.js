export function initSpaceScene() {
  const wrap = document.getElementById('wrap');
  const cv = document.getElementById('c');
  const ctx = cv.getContext('2d');
  const cur = document.getElementById('cur');

  // PASTE EVERYTHING FROM THE ORIGINAL <script>
  // STARTING FROM:
  //
  // let W,H,CX,CY;
  //
  // UNTIL THE VERY END:
  //
  // draw();

  let W,H,CX,CY;

function resize(){
  W = cv.width = window.innerWidth;
  H = cv.height = window.innerHeight;
  CX = W / 2;
  CY = H / 2;
}

resize();

window.addEventListener('resize', () => {
  resize();
  init();
});

let zoom = 1;
let targetZoom = 1;

const ZOOM_MIN = 0.12;
const ZOOM_MAX = 3.5;

wrap.addEventListener('wheel', e => {
  e.preventDefault();

  targetZoom = Math.max(
    ZOOM_MIN,
    Math.min(
      ZOOM_MAX,
      targetZoom * Math.pow(0.999, e.deltaY)
    )
  );
},{ passive:false });

document.getElementById('zin').onclick = () => {
  targetZoom = Math.min(ZOOM_MAX, targetZoom * 1.22);
};

document.getElementById('zout').onclick = () => {
  targetZoom = Math.max(ZOOM_MIN, targetZoom / 1.22);
};

let mouse = {
  x:-9999,
  y:-9999,
  on:false
};

let drag = {
  active:false,
  lastX:0,
  lastY:0
};

let rotY = Math.PI/2;
let rotX = 0.08;

let velY = 0.004;
let velX = 0;

wrap.addEventListener('mousemove', e => {

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.on = true;

  cur.style.left = mouse.x + 'px';
  cur.style.top = mouse.y + 'px';

  if(drag.active){

    const dx = mouse.x - drag.lastX;
    const dy = mouse.y - drag.lastY;

    velY = dx * 0.013;
    velX = dy * 0.009;

    rotY += dx * 0.013;
    rotX += dy * 0.009;

    drag.lastX = mouse.x;
    drag.lastY = mouse.y;
  }
});

wrap.addEventListener('mousedown', e => {
  drag.active = true;
  drag.lastX = e.clientX;
  drag.lastY = e.clientY;

  velY = 0;
  velX = 0;
});

window.addEventListener('mouseup', () => {
  drag.active = false;
});

wrap.addEventListener('mouseleave', () => {
  mouse.on = false;
  drag.active = false;
});

const BASE_R = 100;

let starPts = [];
let planetPts = [];
let debrisPts = [];

function randShell(r0,r1){

  const phi = Math.acos(2*Math.random()-1);
  const theta = Math.random()*Math.PI*2;

  const r = r0 + (r1-r0)*Math.cbrt(Math.random());

  return {
    x:r*Math.sin(phi)*Math.cos(theta),
    y:r*Math.sin(phi)*Math.sin(theta),
    z:r*Math.cos(phi)
  };
}

function init(){

  starPts = [];

  for(let i=0;i<6000;i++){

    const near = i < 1200;
    const mid = !near && i < 3000;

    const pos = near
      ? randShell(500,1600)
      : mid
      ? randShell(1600,3200)
      : randShell(3200,6000);

    const roll = Math.random();

    const hue =
      roll < 0.14 ? [255,238,170] :
      roll < 0.28 ? [170,210,255] :
      roll < 0.36 ? [255,200,200] :
      [215,200,255];

    starPts.push({
      wx:pos.x,
      wy:pos.y,
      wz:pos.z,
      r:near ? 0.9 + Math.random()*1.5 :
        mid ? 0.5 + Math.random()*0.9 :
        0.25 + Math.random()*0.55,
      a:near ? 0.45 + Math.random()*0.55 :
        mid ? 0.2 + Math.random()*0.55 :
        0.08 + Math.random()*0.45,
      tw:Math.random()*6.28,
      twSpeed:0.003+Math.random()*0.02,
      hue,
      halo:near && Math.random()<0.2
    });
  }

  planetPts = [];

  /* ULTRA DENSE PLANET */
  const N = 2200;

  for(let i=0;i<N;i++){

    const phi = Math.acos(1 - 2*(i+.5)/N);
    const th = Math.PI * (1 + Math.sqrt(5)) * i;

    planetPts.push({
      nx:Math.sin(phi)*Math.cos(th),
      ny:Math.sin(phi)*Math.sin(th),
      nz:Math.cos(phi),

      /* SMALLER PARTICLES BUT MUCH MORE OF THEM */
      sr:.55+Math.random()*.7,

      lat:(Math.sin(phi)*Math.sin(th)+1)/2,
      phase:Math.random()*6.28
    });
  }

  debrisPts = [];

  const BANDS = [
    {count:900,minR:1.35,maxR:1.75,thick:0.06,aMin:.55,aMax:.95,srMin:.5,srMax:2.2},
    {count:820,minR:1.75,maxR:2.15,thick:0.08,aMin:.48,aMax:.88,srMin:.5,srMax:2.4},
    {count:750,minR:2.15,maxR:2.6,thick:0.1,aMin:.4,aMax:.80,srMin:.5,srMax:2.5},
    {count:680,minR:2.6,maxR:3.1,thick:0.13,aMin:.32,aMax:.72,srMin:.4,srMax:2.6},
    {count:600,minR:3.1,maxR:3.7,thick:0.16,aMin:.25,aMax:.62,srMin:.4,srMax:2.7},
    {count:520,minR:3.7,maxR:4.4,thick:0.2,aMin:.18,aMax:.50,srMin:.4,srMax:2.8},
    {count:440,minR:4.4,maxR:5.2,thick:0.25,aMin:.12,aMax:.40,srMin:.35,srMax:2.8},
    {count:360,minR:5.2,maxR:6.2,thick:0.32,aMin:.08,aMax:.30,srMin:.3,srMax:2.6},
    {count:280,minR:6.2,maxR:7.5,thick:0.4,aMin:.05,aMax:.20,srMin:.3,srMax:2.4}
  ];

  for(const b of BANDS){

    for(let i=0;i<b.count;i++){

      debrisPts.push({
        angle:Math.random()*Math.PI*2,
        dist:(b.minR+Math.random()*(b.maxR-b.minR))*BASE_R,
        yOff:(Math.random()-.5)*b.thick*BASE_R,
        speed:(0.0008+Math.random()*.002)*(Math.random()>.5?1:-1),
        sr:b.srMin+Math.random()*(b.srMax-b.srMin),
        a:b.aMin+Math.random()*(b.aMax-b.aMin),
        colorT:Math.random()
      });
    }
  }
}

init();

function rotPoint(x,y,z,rY,rX){

  const cy = Math.cos(rY);
  const sy = Math.sin(rY);

  const x1 = x*cy + z*sy;
  const z1 = -x*sy + z*cy;

  const cx2 = Math.cos(rX);
  const sx2 = Math.sin(rX);

  return {
    x:x1,
    y:y*cx2-z1*sx2,
    z:y*sx2+z1*cx2
  };
}

let frame = 0;
let selfRot = 0;

function draw(){

  frame++;

  zoom += (targetZoom-zoom)*0.07;

  if(!drag.active){

    velY += (0.004-velY)*0.015;
    velX *= 0.92;

    rotY += velY;
    rotX += velX;
  }

  ctx.clearRect(0,0,W,H);

  ctx.fillStyle = '#00000e';
  ctx.fillRect(0,0,W,H);

  ctx.save();

  ctx.translate(CX,CY);
  ctx.scale(zoom,zoom);

  const hw = W/zoom;
  const hh = H/zoom;

  for(const s of starPts){

    const p = rotPoint(
      s.wx,
      s.wy,
      s.wz,
      rotY,
      rotX
    );

    if(p.z < 30) continue;

    const sc = 900/p.z;

    const sx = p.x*sc;
    const sy = p.y*sc;

    if(
      sx < -hw ||
      sx > hw ||
      sy < -hh ||
      sy > hh
    ) continue;

    const tw =
      0.45 + 0.55 *
      Math.sin(frame*s.twSpeed+s.tw);

    const [r,g,b] = s.hue;

    ctx.beginPath();
    ctx.arc(sx,sy,s.r,0,6.28);

    ctx.fillStyle =
      `rgba(${r},${g},${b},${s.a*tw})`;

    ctx.fill();

    if(s.halo){

      ctx.beginPath();
      ctx.arc(sx,sy,s.r*3.5,0,6.28);

      ctx.fillStyle =
        `rgba(${r},${g},${b},${s.a*tw*0.07})`;

      ctx.fill();
    }
  }

  const allPts = [];

  selfRot += 0.004;

  for(const d of planetPts){

    const cosS = Math.cos(selfRot);
    const sinS = Math.sin(selfRot);

    const p = rotPoint(
      d.nx*BASE_R*cosS+d.nz*BASE_R*sinS,
      d.ny*BASE_R,
      -d.nx*BASE_R*sinS+d.nz*BASE_R*cosS,
      rotY,
      rotX
    );

    allPts.push({
      type:'p',
      sx:p.x,
      sy:p.y,
      sz:p.z,
      d,
      pulse:.88+.12*Math.sin(frame*.022+d.phase)
    });
  }

  for(const d of debrisPts){

    d.angle += d.speed;

    const p = rotPoint(
      Math.cos(d.angle)*d.dist,
      d.yOff,
      Math.sin(d.angle)*d.dist,
      rotY,
      rotX
    );

    allPts.push({
      type:'d',
      sx:p.x,
      sy:p.y,
      sz:p.z,
      d
    });
  }

  allPts.sort((a,b)=>a.sz-b.sz);

  for(const pt of allPts){

    const {type,sx,sy,sz,d} = pt;

    const wx = sx*zoom + CX;
    const wy = sy*zoom + CY;

    const dm = mouse.on
      ? Math.sqrt((wx-mouse.x)**2+(wy-mouse.y)**2)/zoom
      : 9999;

    if(type==='p'){

      if(sz < -BASE_R*.08) continue;

      const depth =
        Math.max(0,(sz/BASE_R+1)/2);

      const bright =
        .12 + depth*.88;

      const t = d.lat;

      const glow =
        Math.max(0,1-dm/105)*1.5;

      const rv =
        Math.round(120 + t * 110);

      const gv =
        Math.round(170 + t * 55);

      const bv =
        255;

      ctx.beginPath();

      ctx.arc(
        sx,
        sy,
        Math.max(
          .25,
          d.sr*(.45+depth*.6)*pt.pulse+glow*.7
        ),
        0,
        6.28
      );

      ctx.fillStyle =
        `rgba(${rv},${gv},${bv},${Math.min(1,0.82 + bright + glow * 0.4)})`;

      ctx.fill();

    } else {

      const maxD = 7.5*BASE_R;

      const depth =
        Math.max(0,(sz/maxD+1)/2);

      const bright =
        .15+depth*.85;

      const glow =
        Math.max(0,1-dm/85)*1.7;

      const t = d.colorT;

      const rv =
        Math.round(135+t*110);

      const gv =
        Math.round(82+t*65);

      const bv =
        Math.round(205+t*50);

      ctx.beginPath();

      ctx.arc(
        sx,
        sy,
        Math.max(
          .3,
          d.sr*(.45+depth*.55)+glow*.8
        ),
        0,
        6.28
      );

      ctx.fillStyle =
        `rgba(${rv},${gv},${bv},${Math.min(1,d.a*bright+glow*.28)})`;

      ctx.fill();
    }
  }

  const ag = ctx.createRadialGradient(
    0,0,BASE_R*.7,
    0,0,BASE_R*1.6
  );

  ag.addColorStop(0,'rgba(100,60,220,.1)');
  ag.addColorStop(.6,'rgba(65,45,180,.05)');
  ag.addColorStop(1,'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.arc(0,0,BASE_R*1.6,0,6.28);

  ctx.fillStyle = ag;
  ctx.fill();

  ctx.restore();

  requestAnimationFrame(draw);
}

draw();
}