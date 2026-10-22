(() => {
'use strict';
const P = {O:'#ff8a2b',OD:'#c4560f',OL:'#ffa84f',C:'#fff1d6',CS:'#f0d5a8',B:'#f6d9ab',R:'#cf4430',RD:'#a3301f',RL:'#e8654f',
  OUT:'#6a2e12',TIP:'#b4520d',CH:'#e8202c',CHL:'#ff9ca2',EY:'#3a1a0c',TEAL:'#25909c',PINK:'#ff8fa8'};

const mk = (w,h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return {c, g:c.getContext('2d')}; };
const R = (g,col,x,y,w,h) => { g.fillStyle = col; g.fillRect(x,y,w,h); };
const E = (g,col,cx,cy,rx,ry) => {
  g.fillStyle = col;
  for (let y = Math.floor(cy-ry); y <= Math.ceil(cy+ry); y++)
    for (let x = Math.floor(cx-rx); x <= Math.ceil(cx+rx); x++) {
      const dx = (x+.5-cx)/rx, dy = (y+.5-cy)/ry;
      if (dx*dx + dy*dy <= 1) g.fillRect(x,y,1,1);
    }
};
const EC = (g,cx,cy,rx,ry) => {
  for (let y = Math.floor(cy-ry); y <= Math.ceil(cy+ry); y++)
    for (let x = Math.floor(cx-rx); x <= Math.ceil(cx+rx); x++) {
      const dx = (x+.5-cx)/rx, dy = (y+.5-cy)/ry;
      if (dx*dx + dy*dy <= 1) g.clearRect(x,y,1,1);
    }
};
const RR = (g,col,x,y,w,h,r) => {
  g.fillStyle = col;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const cx = i < r ? r : (i >= w-r ? w-r-1 : i), cy = j < r ? r : (j >= h-r ? h-r-1 : j);
    const dx = i-cx, dy = j-cy;
    if (dx*dx + dy*dy <= r*r) g.fillRect(x+i,y+j,1,1);
  }
};
const L = (g,col,x0,y0,x1,y1) => {
  g.fillStyle = col;
  const dx = Math.abs(x1-x0), sx = x0<x1?1:-1, dy = -Math.abs(y1-y0), sy = y0<y1?1:-1; let err = dx+dy;
  for (;;) { g.fillRect(x0,y0,1,1); if (x0===x1 && y0===y1) break; const e2 = 2*err; if (e2>=dy){err+=dy;x0+=sx;} if (e2<=dx){err+=dx;y0+=sy;} }
};
const PTS = (g,col,pts) => { g.fillStyle = col; pts.forEach(p => g.fillRect(p[0],p[1],1,1)); };
const OUTL = (g,w,h,col) => {
  const id = g.getImageData(0,0,w,h), d = id.data, a = new Uint8Array(w*h);
  for (let i = 0; i < w*h; i++) a[i] = d[i*4+3] > 10 ? 1 : 0;
  const r = parseInt(col.slice(1,3),16), gg = parseInt(col.slice(3,5),16), b = parseInt(col.slice(5,7),16);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y*w+x; if (a[i]) continue;
    if ((x>0&&a[i-1])||(x<w-1&&a[i+1])||(y>0&&a[i-w])||(y<h-1&&a[i+w])) { d[i*4]=r; d[i*4+1]=gg; d[i*4+2]=b; d[i*4+3]=255; }
  }
  g.putImageData(id,0,0);
};
const LAYER = (main,w,h,col,fn) => { const t = mk(w,h); fn(t.g); if (col) OUTL(t.g,w,h,col); main.drawImage(t.c,0,0); };
const FD = (fn) => { const t = mk(24,24); fn(t.g); OUTL(t.g,24,24,P.OUT); return t.c.toDataURL(); };
const fromMap = (rows,pal,outline) => {
  const w = rows[0].length, h = rows.length, t = mk(w+2,h+2);
  rows.forEach((row,y) => [...row].forEach((ch,x) => { if (pal[ch]) R(t.g,pal[ch],x+1,y+1,1,1); }));
  if (outline) OUTL(t.g,w+2,h+2,outline);
  return t.c.toDataURL();
};


function ryzSprite(expr, fr) {
  const W = 48, H = 48, {c,g} = mk(W,H);
  const fat = /^(full|burp)/.test(expr), s = fat ? 2 : 0, u = fr ? -1 : 0;
  // tails
  LAYER(g,W,H,P.OUT,t => {
    RR(t,P.O,32+s,34,6,6,2); RR(t,P.O,36+s,32+u,5,6,2); RR(t,P.TIP,39+s,29+u,5,6,2);
  });
 
  LAYER(g,W,H,P.OUT,t => {
    for (let y = 32; y <= 43; y++) {
      const k = (y-32)/11, half = Math.round(10 + k*4 + (fat?1.5:0));
      R(t,y===32?P.RL:P.R,22-half,y,half*2,1);
      if (y >= 34) for (let kk = -3; kk <= 3; kk++) { const x = 22 + kk*4; if (x > 22-half+1 && x < 22+half-2) R(t,P.RD,x,y,1,1); }
    }
  });
  // foot
  LAYER(g,W,H,P.OUT,t => { E(t,P.O,8,41,4,3); E(t,P.O,29,42,3,3.5); });
  // body
  LAYER(g,W,H,P.OUT,t => {
    if (fat) RR(t,P.O,10,19,26,15,6); else RR(t,P.O,13,20,20,14,3);
    const sx = fat ? 33 : 30, sy = fat ? 24 : 25;
    R(t,P.OD,sx,sy,3,1); R(t,P.OD,sx,sy+3,3,1); R(t,P.OD,sx,sy+6,3,1);
    if (fat) E(t,P.B,22,28,8,5.5); else E(t,P.B,21,28,5,4);
  });
  // hand
  LAYER(g,W,H,P.OUT,t => {
    if (fat) { E(t,P.OL,15,28.5,2,2); E(t,P.OL,29,28.5,2,2); } else { E(t,P.OL,17,29.5,2,2); E(t,P.OL,26,29.5,2,2); }
  });
  // cream
  LAYER(g,W,H,P.OUT,t => {
    RR(t,P.C,9,9,27,14,4);
    R(t,P.CS,32,13,3,9); R(t,P.CS,11,21,21,1);
    R(t,'#ffffff',11,10,7,2); R(t,'#ffffff',11,12,2,1);
    RR(t,P.C,11,22,4,3,1); RR(t,P.C,17,22,3,4,1); RR(t,P.C,24,22,4,3,1); RR(t,P.C,30,22,3,4,1);
  });
  // ceri
  LAYER(g,W,H,P.OUT,t => {
    E(t,P.CH,23,6,3,3); R(t,P.CHL,21,5,1,1); R(t,'#6a3a14',24,2,1,2); R(t,'#6a3a14',25,1,2,1);
  });
  // face
  const EY = P.EY;
  PTS(g,'#b8641e',[[33,11],[34,12],[34,13]]);
  R(g,EY,14,16,2,1); R(g,EY,19,16,2,1);
  const arc = () => PTS(g,EY,[[27,17],[28,16],[29,15],[30,15],[31,16],[32,17]]);
  const blush = () => { R(g,P.PINK,11,18,3,2); R(g,P.PINK,30,19,4,2); };
  const open = () => { E(g,EY,29.5,15,2.7,3.3); E(g,'#ffffff',29.5,14.3,1.5,1.8); E(g,P.TEAL,29.5,16.9,1.5,1); };
  const smile = () => PTS(g,EY,[[15,19],[16,20],[17,20],[18,20],[19,19]]);
  switch (expr) {
    case 'idle': case 'fullopen': open(); if (expr==='fullopen') { blush(); smile(); } break;
    case 'blink': R(g,EY,27,15,6,1); R(g,EY,28,16,4,1); break;
    case 'happy': arc(); blush(); smile(); break;
    case 'eat1': arc(); blush(); R(g,EY,15,18,5,3); R(g,P.PINK,16,20,3,1); break;
    case 'eat2': arc(); blush(); R(g,EY,16,19,3,2); break;
    case 'angry': {
      E(g,EY,29.5,16,2.5,2); R(g,'#ffffff',29,15,1,1);
      const br = [[26,13],[27,13],[28,12],[29,12],[30,11],[31,11],[32,10],[33,10]];
      PTS(g,'#7a1d0c',br); PTS(g,'#7a1d0c',br.map(p => [p[0],p[1]+1]));
      R(g,'#ff6a5a',11,18,3,2); R(g,'#ff6a5a',30,19,4,2);
      PTS(g,EY,[[15,21],[16,20],[17,20],[18,20],[19,21]]); break; }
    case 'reject':
      PTS(g,EY,[[27,12],[28,13],[29,14],[30,15],[29,16],[28,17],[27,18]]);
      PTS(g,EY,[[14,20],[15,19],[16,20],[17,19],[18,20],[19,19],[20,20]]); R(g,P.PINK,17,21,2,2); R(g,'#bfe9a8',11,18,3,2); break;
    case 'surprise':
      E(g,EY,29.5,14.5,3,4); E(g,'#ffffff',29.5,14,2,2.8); R(g,EY,16,19,3,3); R(g,P.PINK,17,20,1,1); break;
    case 'full': arc(); blush(); smile(); break;
    case 'burp': arc(); blush(); R(g,EY,16,18,4,4); R(g,P.PINK,17,19,2,2); break;
  }
  return c.toDataURL();
}

/* ---------- Mfood ---------- */
const FOOD_DRAW = {
  burger: g => {
    RR(g,'#6e3517',3,15,18,4,2);
    E(g,'#e9a24c',12,9,9.5,5.5); g.clearRect(0,12,24,12);
    R(g,'#f6c780',7,5,6,1); [[8,7],[12,6],[15,8],[10,9],[17,6]].forEach(p => R(g,'#fff1cf',p[0],p[1],2,1));
    R(g,'#5dbb3b',3,12,18,2); for (let x = 3; x < 21; x += 2) R(g,'#5dbb3b',x,14,1,1);
    R(g,'#ffd23c',4,14,16,1); R(g,'#ffd23c',6,15,2,1); R(g,'#ffd23c',15,15,2,2);
    RR(g,'#e9a24c',4,19,16,3,1);
  },
  salad: g => {
    E(g,'#8fc8ec',12,14,10.5,8); g.clearRect(0,0,24,14);
    E(g,'#4fae3a',8,9,5,4); E(g,'#7ed957',14,8,5.5,4.5); E(g,'#5cc040',11,6,4,3.5);
    E(g,'#e5382a',16,10,2,2); R(g,'#ff8a80',16,9,1,1);
    E(g,'#c9f0a0',7,10,2.4,2.4); E(g,'#8fcf6a',7,10,1.2,1.2);
    R(g,'#c6e6f8',2,13,20,2); R(g,'#d8f0ff',5,17,3,1); R(g,'#6fa8d0',8,21,8,1);
  },
  watermelon: g => {
    E(g,'#3d9a3a',12,7,11,12); E(g,'#c8ec96',12,7,10,11); E(g,'#ee3d4a',12,7,9,10); g.clearRect(0,0,24,7);
    [[8,10],[12,12],[16,10],[10,14],[14,15],[12,8]].forEach(p => R(g,'#2a1410',p[0],p[1],1,2));
    R(g,'#ff7078',5,8,3,1);
  },
  pizza: g => {
    for (let y = 3; y <= 21; y++) { const half = Math.round(10.5*(1-(y-3)/18)); R(g,'#ffc83a',12-half,y,Math.max(1,half*2),1); }
    RR(g,'#e0a050',2,2,20,4,2); R(g,'#f2c07a',4,3,8,1);
    E(g,'#d3392b',8,9,2.6,2.6); E(g,'#d3392b',15,10,2.6,2.6); E(g,'#d3392b',12,15,2.2,2.2);
    R(g,'#a82418',7,8,1,1); R(g,'#a82418',14,9,1,1); R(g,'#a82418',11,14,1,1);
    R(g,'#ffe27a',5,7,2,1); R(g,'#ffe27a',17,13,1,1);
  },
  pineapple: g => {
    E(g,'#ffcf3a',12,15,7,8);
    for (let y = 8; y < 23; y++) for (let x = 5; x < 20; x++) {
      const dx = (x+.5-12)/7, dy = (y+.5-15)/8;
      if (dx*dx + dy*dy <= 1 && ((x+y)%4===0 || (x-y+40)%4===0)) R(g,'#e5902a',x,y,1,1);
    }
    R(g,'#3f8f2a',8,4,2,5); R(g,'#4fa534',11,1,2,8); R(g,'#3f8f2a',14,4,2,5); R(g,'#6fc83a',12,2,1,5); R(g,'#ffe98a',9,11,1,3);
  },
  cupcake: g => {
    for (let y = 14; y <= 22; y++) { const half = Math.round(7.5-(y-14)/8*2.5); R(g,'#e0bd8f',12-half,y,half*2,1); }
    for (let x = 8; x <= 16; x += 3) R(g,'#b98f62',x,15,1,7);
    E(g,'#ff8fc0',12,12,8.5,3.2); E(g,'#ff8fc0',12,9,6.5,3); E(g,'#ff8fc0',12,6.2,4,2.6);
    R(g,'#ffc4de',7,11,3,1); R(g,'#ffc4de',9,8,2,1); R(g,'#ffc4de',10,5,2,1);
    R(g,'#e8649b',14,12,4,1); R(g,'#e8649b',14,9,3,1);
    [[8,12,'#4fc3f7'],[14,11,'#ffd23c'],[12,8,'#7ed957'],[15,8,'#ffffff'],[11,6,'#4fc3f7'],[10,13,'#ffffff'],[16,13,'#ffd23c']].forEach(p => R(g,p[2],p[0],p[1],1,1));
    E(g,P.CH,12,3,1.8,1.8);
  },
  donut: g => {
    E(g,'#e5a04a',12,13,10.5,8.5); E(g,'#ff8fc0',12,11.5,10,7.5); EC(g,12,11.5,3.6,2.6);
    R(g,'#ffc4de',5,8,4,1); R(g,'#ffc4de',4,9,1,2);
    [[7,12,'#4fc3f7'],[16,8,'#ffd23c'],[18,12,'#ffffff'],[10,16,'#7ed957'],[15,15,'#4fc3f7'],[8,7,'#ffd23c'],[14,6,'#ffffff'],[19,10,'#7ed957']].forEach(p => R(g,p[2],p[0],p[1],2,1));
  },
  icecream: g => {
    for (let y = 13; y <= 22; y++) {
      const half = Math.max(1,Math.round(6*(1-(y-13)/10)));
      R(g,'#e2a04c',12-half,y,half*2,1);
      for (let x = 12-half; x < 12+half; x++) if ((x+y)%4===0) R(g,'#b97a2e',x,y,1,1);
    }
    E(g,'#ffd1e3',12,12,7,4.2); R(g,'#ffd1e3',6,15,2,2); R(g,'#ffd1e3',15,15,2,1);
    E(g,'#fff3d8',12,7.5,5.5,4); R(g,'#ffffff',9,5,2,1);
    E(g,P.CH,12,3,1.8,1.8);
  },
  cake: g => {
    E(g,'#dbe9f2',12,20,10.5,2.6);
    RR(g,'#ff9db8',4,10,16,10,2); R(g,'#fff6e6',4,14,16,2); R(g,'#fff6e6',4,18,16,1);
    RR(g,'#fff6e6',3,8,18,4,2); R(g,'#fff6e6',6,12,2,3); R(g,'#fff6e6',14,12,2,2);
    E(g,P.CH,12,6,3,2.6); R(g,'#4fa534',11,3,3,1); R(g,P.CHL,10,5,1,1);
  }
};


function bouquet(vase) {
  const W = 40, H = vase ? 84 : 64, {c,g} = mk(W,H), y0 = vase ? 46 : 63, S = '#5c9a3c';
  [[20,y0,10,18],[20,y0,21,12],[20,y0,31,22],[20,y0,6,30],[21,y0,35,33]].forEach(a => { L(g,S,a[0],a[1],a[2],a[3]); L(g,S,a[0]+1,a[1],a[2]+1,a[3]); });
  E(g,'#7fbf55',14,30,3.5,1.6); E(g,'#79b650',27,34,3.5,1.6); E(g,'#6aa845',13,22,2.5,1.2); E(g,'#6aa845',29,28,2.5,1.2);
  if (!vase) { E(g,'#7fbf55',14,48,3.5,1.6); E(g,'#79b650',27,52,3.5,1.6); E(g,'#6aa845',13,40,2.5,1.2); }
  LAYER(g,W,H,'#b04870',t => { E(t,'#f08cab',6,29,2.4,3); E(t,'#f08cab',35,32,2.4,3); });
  [[10,15,6.5],[22,9,7.5],[31,19,6]].forEach(f => LAYER(g,W,H,'#bf5578',t => {
    const cx = f[0], cy = f[1], r = f[2];
    E(t,'#f7b3c8',cx,cy,r,r*.9); E(t,'#ffd8e4',cx-1,cy-1.2,r*.7,r*.62);
    L(t,'#e98aa8',Math.round(cx-r*.5),Math.round(cy+r*.5),Math.round(cx+r*.4),Math.round(cy+r*.7));
    E(t,'#ffe27a',cx,cy-.5,1.8,1.4);
  }));
  if (vase) LAYER(g,W,H,'#6c9784',t => {
    RR(t,'#d9eee4',16,39,8,7,2); RR(t,'#d9eee4',13,45,14,38,5); RR(t,'#b5d9c6',14,60,12,22,4);
    L(t,'#7fb08e',19,60,17,80); L(t,'#7fb08e',22,60,24,80); R(t,'#ffffff',15,49,1,16);
  });
  return c.toDataURL();
}


function bigVase() {
  const W = 56, H = 120, {c,g} = mk(W,H), S = '#5c9a3c', y0 = 74;
  [[28,y0,10,22],[28,y0,28,14],[28,y0,46,24],[28,y0,18,36],[29,y0,40,38],[27,y0,4,34],[29,y0,52,36]].forEach(a => { L(g,S,a[0],a[1],a[2],a[3]); L(g,S,a[0]+1,a[1],a[2]+1,a[3]); });
  [[18,50,4.5,1.8],[38,52,4.5,1.8],[12,41,3.5,1.5],[45,43,3.5,1.5],[23,60,3.5,1.4],[33,62,3.5,1.4],[21,43,3,1.3],[36,45,3,1.3]].forEach(l => E(g,'#7fbf55',l[0],l[1],l[2],l[3]));
  LAYER(g,W,H,'#b04870',t => { E(t,'#f08cab',4,30,2.6,3.4); E(t,'#f08cab',52,33,2.6,3.4); });
  [[11,19,8],[28,11,9.5],[45,21,8],[19,32,6.5],[38,34,6.5]].forEach(f => LAYER(g,W,H,'#bf5578',t => {
    const cx = f[0], cy = f[1], r = f[2];
    E(t,'#f7b3c8',cx,cy,r,r*.9); E(t,'#ffd8e4',cx-1,cy-1.4,r*.7,r*.62);
    L(t,'#e98aa8',Math.round(cx-r*.55),Math.round(cy+r*.5),Math.round(cx+r*.4),Math.round(cy+r*.75));
    E(t,'#ffe27a',cx,cy-.5,2.2,1.7);
  }));
  LAYER(g,W,H,'#2f5f96',t => {
    t.translate(0,20);
    RR(t,'#e8f1fb',20,44,16,12,3);                 // leher
    RR(t,'#e8f1fb',17,41,22,5,2);                  // bibir
    E(t,'#e8f1fb',28,77,17.5,22);                  // perut vas
    RR(t,'#e8f1fb',17,95,22,5,2);                  // kaki
    R(t,'#c3d6ee',37,60,4,34); R(t,'#c3d6ee',24,47,1,0);
    R(t,'#4a86c5',12,66,32,2); R(t,'#4a86c5',12,70,32,1); R(t,'#4a86c5',12,88,32,2);
    R(t,'#4a86c5',20,50,16,1);
    for (let x = 16; x <= 40; x += 6) { E(t,'#4a86c5',x,78,1.8,1.8); R(t,'#e8f1fb',x,78,1,1); }
    R(t,'#ffffff',14,62,2,20);
  });
  VASE_ID = g.getImageData(0,0,W,H);
  return c.toDataURL();
}
function woodTile() {
  const {c,g} = mk(32,16); R(g,'#c88b50',0,0,32,16);
  let s = 7; const rnd = () => (s = (s*9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 70; i++) R(g, rnd()<.5 ? '#d9a066' : '#b5793f', Math.floor(rnd()*32), Math.floor(rnd()*16), 1+Math.floor(rnd()*4), 1);
  R(g,'#8f5b30',0,7,32,1); R(g,'#8f5b30',0,15,32,1); R(g,'#d8a064',0,8,32,1);
  R(g,'#8f5b30',10,0,1,7); R(g,'#8f5b30',24,8,1,7);
  return c.toDataURL();
}

let VASE_ID = null;

const SP = {};
['idle','blink','happy','eat1','eat2','angry','reject','surprise','full','fullopen','burp'].forEach(n => { SP['r_'+n+'_0'] = ryzSprite(n,0); SP['r_'+n+'_1'] = ryzSprite(n,1); });
Object.keys(FOOD_DRAW).forEach(k => { SP['f_'+k] = FD(FOOD_DRAW[k]); });
SP.heart = fromMap(['.XX...XX.','XHXX.XXXX','XXXXXXXXX','XXXXXXXXX','.XXXXXXX.','..XXXXX..','...XXX...','....X....'],{X:'#ff4d7a',H:'#ffb3c6'},'#8a1d3a');
SP.anger = fromMap(['..XX...XX..','.XXX...XXX.','XXX.....XXX','XX.......XX','...........','...........','XX.......XX','XXX.....XXX','.XXX...XXX.','..XX...XX..'],{X:'#e8202c'},'#7a0f18');
SP.xmark = fromMap(['XX.....XX','XXX...XXX','.XXX.XXX.','..XXXXX..','...XXX...','..XXXXX..','.XXX.XXX.','XXX...XXX','XX.....XX'],{X:'#ff4a4a'},'#7a1010');
SP.qmark = fromMap(['.XXXXX.','XX...XX','.....XX','....XX.','...XX..','...X...','.......','...X...'],{X:'#8a4a1c'},null);
SP.star = fromMap(['....X....','....X....','...XXX...','.XXXXXXX.','XXXXXXXXX','.XXXXXXX.','...XXX...','....X....','....X....'],{X:'#ffe14d'},'#d98a1c');
SP.bqv = bigVase();
SP.flower = (() => {
  const {c,g} = mk(16,20);
  R(g,'#5c9a3c',7,10,2,9); E(g,'#7fbf55',11.5,15,2.5,1.3);
  LAYER(g,16,20,'#bf5578',t => { E(t,'#f7b3c8',8,5,5.5,4.8); E(t,'#ffd8e4',7,4,3.6,3); E(t,'#ffe27a',8,5,1.6,1.3); });
  return c.toDataURL();
})();
SP.bq = bouquet(false);
SP.wood = woodTile();
document.documentElement.style.setProperty('--wood','url('+SP.wood+')');


const $ = s => document.querySelector(s);
let timers = [];
const later = (fn,ms) => { const id = setTimeout(() => { timers = timers.filter(t => t !== id); fn(); }, ms); timers.push(id); return id; };
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

function makeTitle(el, text) {
  el.innerHTML = '';
  ['l1','l2','l3','l4'].forEach(cls => {
    const d = document.createElement('div'); d.className = 'tl ' + cls;
    [...text].forEach((ch,i) => { const s = document.createElement('span'); s.textContent = ch; s.style.setProperty('--i',i); d.appendChild(s); });
    el.appendChild(d);
  });
}
makeTitle($('#title'),'RYZAWRS');
makeTitle($('#banner'),'NOM NOM!');

document.querySelectorAll('.vase img').forEach(i => i.src = SP.bqv);
document.querySelectorAll('.bq').forEach(i => i.src = SP.bq);

/* ---------- cover ---------- */
(() => {
  const fl = $('#floaters'), ids = ['cupcake','donut','icecream','cake'];
  for (let i = 0; i < 12; i++) {
    const w = document.createElement('div'); w.className = 'fl';
    w.style.setProperty('--x',(Math.random()*90)+'%'); w.style.setProperty('--d',(10+Math.random()*9)+'s');
    w.style.setProperty('--dl',(-Math.random()*16)+'s'); w.style.setProperty('--s',(Math.random()*5).toFixed(1));
    const im = new Image(); im.src = SP['f_'+ids[i%4]]; im.alt = ''; w.appendChild(im); fl.appendChild(w);
  }
  for (let i = 0; i < 16; i++) {
    const im = new Image(); im.src = SP.star; im.alt = ''; im.className = 'sp';
    im.style.left = (4+Math.random()*90)+'%'; im.style.top = (4+Math.random()*88)+'%';
    im.style.width = (1.6+Math.random()*1.6)+'vmin'; im.style.setProperty('--dl',(-Math.random()*1.2)+'s');
    $('.panel').appendChild(im);
  }
})();


const curtain = $('#curtain');
for (let i = 0; i < 12; i++) { const b = document.createElement('div'); b.className = 'bar'; b.style.setProperty('--i',i); curtain.appendChild(b); }


function fx(src,x,y,size,opt) {
  opt = opt || {};
  const i = new Image(); i.src = src; i.alt = ''; i.className = 'fx' + (opt.stay ? ' stay' : '');
  i.style.left = x+'px'; i.style.top = y+'px'; i.style.width = size+'px';
  i.style.setProperty('--dx',(opt.dx !== undefined ? opt.dx : (Math.random()*50-25))+'px');
  document.body.appendChild(i); setTimeout(() => i.remove(), opt.stay ? 950 : 1050);
}

/* ---------- Ryzawr ---------- */
function Ryz(img) { this.img = img; this.pose = 'idle'; this.tail = 0; this.blink = false; this.draw(); }
Ryz.prototype.draw = function () {
  let p = this.pose;
  if (p === 'idle' && this.blink) p = 'blink';
  if (p === 'fullopen' && this.blink) p = 'full';
  this.img.src = SP['r_'+p+'_'+this.tail];
};
Ryz.prototype.set = function (p) { this.pose = p; this.draw(); };
const R2 = new Ryz($('#r2spr')), R3 = new Ryz($('#r3spr'));
let held = false;
[$('#r2in'),$('#r3in')].forEach(el => { const i = new Image(); i.src = SP.flower; i.alt = ''; i.className = 'held'; el.appendChild(i); });
setInterval(() => { R2.tail ^= 1; R3.tail ^= 1; R2.draw(); R3.draw(); }, 450);
(function blinkLoop() {
  [R2,R3].forEach(r => { r.blink = true; r.draw(); });
  setTimeout(() => { [R2,R3].forEach(r => { r.blink = false; r.draw(); }); }, 150);
  setTimeout(blinkLoop, 1800 + Math.random()*2600);
})();
const setAnim = (el,name) => { el.className = 'inner' + (name ? ' '+name : ''); };


const pages = [null,$('#p1'),$('#p2'),$('#p3')];
let navBusy = false, ambient = null;
function show(n) {
  clearTimers(); if (ambient) { clearInterval(ambient); ambient = null; }
  pages.forEach((p,i) => { if (p) p.classList.toggle('active', i === n); });
  if (n === 2) resetGame();
  if (n === 3) startP3();
}
function go(n) {
  if (navBusy) return; navBusy = true;
  curtain.classList.add('on');
  setTimeout(() => {
    show(n);
    curtain.classList.add('out'); curtain.classList.remove('on');
    setTimeout(() => { curtain.classList.remove('out'); navBusy = false; }, 700);
  }, 620);
}
$('#play').addEventListener('click',() => go(2));
$('#again').addEventListener('click',() => go(2));


const SWEETS = ['cupcake','donut','icecream','cake'];
const ORDER = ['burger','salad','watermelon','pizza','pineapple','cupcake','donut','icecream','cake'];
const NEED = 5;
const wrap = $('#r2'), r2in = $('#r2in'), bub = $('#bub'), bubImg = $('#bubImg'), shelf = $('#shelf'), hud = $('#hud');
let fed = 0, request = 'cupcake', state = 'idle', taps = [], petting = false, petTimer = null, drag = null;

// HUD
for (let i = 0; i < NEED; i++) { const im = new Image(); im.src = SP.f_cupcake; im.alt = ''; hud.appendChild(im); }
const updateHUD = (pop) => { [...hud.children].forEach((im,i) => { const on = i < fed; if (on && !im.classList.contains('on') && pop) { im.classList.remove('on'); void im.offsetWidth; } im.classList.toggle('on', on); }); };

// foods
ORDER.forEach(id => {
  const d = document.createElement('div'); d.className = 'food'; d.dataset.id = id;
  const im = new Image(); im.src = SP['f_'+id]; im.alt = ''; im.draggable = false; d.appendChild(im); shelf.appendChild(d);
});
const foodEl = id => shelf.querySelector('.food[data-id="'+id+'"]');

function setBubble(kind) {
  bubImg.src = kind === 'req' ? SP['f_'+request] : kind === 'no' ? SP.xmark : kind === 'q' ? SP.qmark : SP.anger;
  bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop');
}
function newRequest() {
  const pool = SWEETS.filter(s => s !== request || fed === 0);
  request = pool[Math.floor(Math.random()*pool.length)];
  setBubble('req');
}
function resetGame() {
  fed = 0; state = 'idle'; taps = []; petting = false; drag = null;
  document.querySelectorAll('.ghost,.fx').forEach(n => n.remove());
  shelf.querySelectorAll('.food').forEach(f => f.className = 'food');
  R2.set('idle'); setAnim(r2in,''); wrap.style.filter = '';
  updateHUD(false); request = 'none'; newRequest();
}
function backToIdle(ms,anim) {
  later(() => { if (state === 'idle') { R2.set('idle'); setAnim(r2in,''); } }, ms);
}

const rect = () => wrap.getBoundingClientRect();
const overRyz = (x,y) => { const r = rect(); return x > r.left+r.width*.12 && x < r.left+r.width*.96 && y > r.top+r.height*.10 && y < r.top+r.height*.97; };
const fxSize = () => Math.max(18, rect().width*.085);

function burstHearts(n) {
  const r = rect();
  for (let i = 0; i < n; i++) later(() => fx(SP.heart, r.left+r.width*(.22+Math.random()*.5), r.top+r.height*(.15+Math.random()*.25), fxSize(), {dx:Math.random()*80-40}), i*90);
}

/* ---- foodie ---- */
shelf.addEventListener('pointerdown', e => {
  const el = e.target.closest('.food');
  if (!el || drag || el.classList.contains('away') || el.classList.contains('lifted')) return;
  e.preventDefault();
  const r = el.getBoundingClientRect();
  const ghost = new Image(); ghost.src = el.querySelector('img').src; ghost.className = 'ghost'; ghost.draggable = false;
  ghost.style.width = (r.width*1.18)+'px';
  document.body.appendChild(ghost);
  drag = {el, ghost, id: el.dataset.id, home: r, over: false, pid: e.pointerId};
  el.classList.add('lifted');
  moveGhost(e.clientX, e.clientY);
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
  window.addEventListener('pointercancel', onDragEnd);
});
function moveGhost(x,y) { drag.ghost.style.left = x+'px'; drag.ghost.style.top = y+'px'; drag.x = x; drag.y = y; }
function ghostCenter() {
  const gr = drag.ghost.getBoundingClientRect(); return {x: gr.left+gr.width/2, y: gr.top+gr.height/2};
}
function onDragMove(e) {
  if (!drag) return;
  moveGhost(e.clientX, e.clientY);
  const c = ghostCenter(), over = overRyz(c.x, c.y);
  if (over !== drag.over) {
    drag.over = over;
    if (state === 'idle') R2.set(over ? (drag.id === 'flower' ? 'happy' : 'eat1') : 'idle');
  }
}
function onDragEnd() {
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
  window.removeEventListener('pointercancel', onDragEnd);
  if (!drag) return;
  const d = drag; drag = null;
  const c = (() => { const gr = d.ghost.getBoundingClientRect(); return {x: gr.left+gr.width/2, y: gr.top+gr.height/2}; })();
  if (state === 'idle') R2.set('idle');
  if (overRyz(c.x, c.y)) handleDrop(d); else returnHome(d);
}
function returnHome(d, after) {
  const h = d.home;
  d.ghost.classList.add('fly');
  d.ghost.style.transition = 'left .28s ease-out, top .28s ease-out, width .28s ease-out';
  d.ghost.style.left = (h.left+h.width/2)+'px'; d.ghost.style.top = (h.top+h.height/2)+'px'; d.ghost.style.width = h.width+'px';
  setTimeout(() => { d.ghost.remove(); d.el.classList.remove('lifted'); if (after) after(); }, 290);
}
function handleDrop(d) {
  if (state === 'angry') { returnHome(d); inner(r2in,'nope'); later(() => { if (state === 'angry') setAnim(r2in,'shake'); }, 700); return; }
  if (state !== 'idle') { returnHome(d); return; }
  if (d.id === 'flower') { giveFlower(d); return; }
  if (d.id === request) { feed(d); return; }
  if (SWEETS.indexOf(d.id) >= 0) {           // manis, tapi bukan yang diminta
    state = 'busy'; R2.set('blink'); setAnim(r2in,'nope'); setBubble('q'); returnHome(d);
    later(() => { state = 'idle'; R2.set('idle'); setAnim(r2in,''); setBubble('req'); }, 900);
  } else {                                    // sayur / buah / makanan asin -> ditolak
    state = 'busy'; R2.set('reject'); setAnim(r2in,'nope'); setBubble('no'); returnHome(d);
    later(() => { state = 'idle'; R2.set('idle'); setAnim(r2in,''); setBubble('req'); }, 1100);
  }
}
const inner = (el,n) => setAnim(el,n);

function feed(d) {
  state = 'eat';
  const r = rect(), mx = r.left + r.width*.36, my = r.top + r.height*.42;
  d.ghost.classList.add('fly');
  d.ghost.style.transition = 'left .3s ease-in, top .3s ease-in, width .3s ease-in, opacity .3s ease-in';
  d.ghost.style.left = mx+'px'; d.ghost.style.top = my+'px'; d.ghost.style.width = (r.width*.1)+'px'; d.ghost.style.opacity = '.2';
  d.el.classList.add('away'); d.el.classList.remove('lifted');
  setTimeout(() => d.ghost.remove(), 300);
  later(() => {
    setAnim(r2in,'chew');
    for (let k = 0; k < 6; k++) later(() => R2.set(k%2 ? 'eat2' : 'eat1'), k*150);
    later(() => {
      fed++; updateHUD(true); burstHearts(5);
      R2.set('happy'); setAnim(r2in,'hop');
      later(() => { d.el.classList.remove('away'); d.el.classList.add('pop'); }, 500);
      if (fed >= NEED) {
        state = 'full';
        later(() => { R2.set('full'); setAnim(r2in,'puff'); }, 500);
        later(() => go(3), 1900);
      } else {
        later(() => { state = 'idle'; R2.set('idle'); setAnim(r2in,''); newRequest(); }, 900);
      }
    }, 930);
  }, 300);
}

/* ---- flowerrr ---- */
const STUB = {classList:{add(){},remove(){}}};
function onVaseFlower(x,y) {
  const img = $('#p2 .vase img'); if (!img || !VASE_ID) return false;
  const r = img.getBoundingClientRect();
  const u = Math.floor((x-r.left)/r.width*VASE_ID.width), v = Math.floor((y-r.top)/r.height*VASE_ID.height);
  if (u < 0 || v < 0 || u >= VASE_ID.width || v > 62) return false;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const xx = u+dx, yy = v+dy;
    if (xx < 0 || yy < 0 || xx >= VASE_ID.width || yy >= VASE_ID.height) continue;
    if (VASE_ID.data[(yy*VASE_ID.width+xx)*4+3] > 10) return true;
  }
  return false;
}
document.addEventListener('pointerdown', e => {
  if (!pages[2].classList.contains('active') || drag || navBusy) return;
  if (!onVaseFlower(e.clientX, e.clientY)) return;
  e.preventDefault(); e.stopPropagation();
  const vr = $('#p2 .vase img').getBoundingClientRect();
  const ghost = new Image(); ghost.src = SP.flower; ghost.className = 'ghost'; ghost.draggable = false;
  ghost.style.width = Math.max(40, vr.width*.34)+'px';
  document.body.appendChild(ghost);
  const hs = vr.width*.4;
  drag = {el: STUB, ghost, id: 'flower', home: {left: vr.left+vr.width*.3, top: vr.top+vr.height*.12, width: hs, height: hs}, over: false, pid: e.pointerId};
  moveGhost(e.clientX, e.clientY);
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
  window.addEventListener('pointercancel', onDragEnd);
}, true);
function giveFlower(d) {
  state = 'busy';
  const r = rect();
  d.ghost.classList.add('fly');
  d.ghost.style.transition = 'left .3s ease-in, top .3s ease-in, width .3s ease-in, opacity .3s ease-in';
  d.ghost.style.left = (r.left+r.width*.35)+'px'; d.ghost.style.top = (r.top+r.height*.58)+'px'; d.ghost.style.width = (r.width*.16)+'px'; d.ghost.style.opacity = '.3';
  setTimeout(() => d.ghost.remove(), 300);
  later(() => {
    held = true;
    document.querySelectorAll('.held').forEach(i => { i.classList.add('on'); i.classList.remove('pop'); void i.offsetWidth; i.classList.add('pop'); });
    R2.set('happy'); setAnim(r2in,'hop'); burstHearts(6);
  }, 300);
  later(() => { state = 'idle'; R2.set('idle'); setAnim(r2in,''); }, 1200);
}

/* ---- pat pat ---- */
const pet = {last:null, dist:0, rev:0, dir:0, heart:0};
wrap.addEventListener('pointermove', e => {
  if (state !== 'idle' || drag) return;
  const r = rect(), rx = (e.clientX-r.left)/r.width, ry = (e.clientY-r.top)/r.height;
  if (!(rx > .16 && rx < .80 && ry > .08 && ry < .52)) { pet.last = null; return; }
  const now = performance.now();
  if (pet.last) {
    if (now - pet.last.t > 600) { pet.dist = 0; pet.rev = 0; }
    const dx = e.clientX - pet.last.x, dy = e.clientY - pet.last.y;
    pet.dist += Math.hypot(dx,dy);
    const dir = Math.sign(dx);
    if (Math.abs(dx) > 2 && dir && dir !== pet.dir) { pet.rev++; pet.dir = dir; }
  }
  pet.last = {x:e.clientX, y:e.clientY, t:now};
  if (pet.rev >= 2 && pet.dist > r.width*.22) doPet(e.clientX, e.clientY, now);
});
function doPet(x,y,now) {
  if (!petting) { petting = true; R2.set('happy'); }
  if (now - pet.heart > 170) { pet.heart = now; fx(SP.heart, x + (Math.random()*30-15), y - 10, fxSize()); }
  clearTimeout(petTimer);
  petTimer = setTimeout(() => {
    petting = false; pet.dist = 0; pet.rev = 0;
    if (state === 'idle') R2.set('idle');
  }, 650);
}

/* ---- angwy ---- */
let down = null;
wrap.addEventListener('pointerdown', e => { down = {x:e.clientX, y:e.clientY, t:performance.now()}; });
wrap.addEventListener('pointerup', e => {
  if (!down) return;
  const dt = performance.now()-down.t, dd = Math.hypot(e.clientX-down.x, e.clientY-down.y); down = null;
  if (dt < 320 && dd < 14 && overRyz(e.clientX, e.clientY)) onTap(e);
});
function onTap(e) {
  if (state !== 'idle') return;
  const now = performance.now();
  taps.push(now); taps = taps.filter(t => now - t < 1700);
  if (taps.length >= 5) { angry(); return; }
  R2.set('surprise'); setAnim(r2in,'hop');
  later(() => { if (state === 'idle' && !petting) { R2.set('idle'); setAnim(r2in,''); } }, 380);
}
function angry() {
  state = 'angry'; taps = []; petting = false;
  R2.set('angry'); setAnim(r2in,'shake'); setBubble('anger');
  const burst = () => { const r = rect(); fx(SP.anger, r.left+r.width*.74, r.top+r.height*.14, fxSize()*1.3, {stay:true});
                        fx(SP.anger, r.left+r.width*.2, r.top+r.height*.2, fxSize()*1.1, {stay:true}); };
  burst(); later(burst,800); later(burst,1600);
  later(() => { state = 'idle'; R2.set('idle'); setAnim(r2in,''); setBubble('req'); }, 2700);
}


const r3 = $('#r3'), r3in = $('#r3in'), burp = $('#burp');
function startP3() {
  R3.set('fullopen'); setAnim(r3in,'puff');
  const spawn = () => {
    const r = r3.getBoundingClientRect();
    const isHeart = Math.random() < .6;
    fx(isHeart ? SP.heart : SP.star, r.left + r.width*(.1+Math.random()*.85), r.top + r.height*(.05+Math.random()*.55), Math.max(16, r.width*.07), {dx:Math.random()*60-30});
  };
  for (let i = 0; i < 6; i++) later(spawn, i*120);
  ambient = setInterval(spawn, 480);
  (function loop() {
    R3.set('fullopen');
    later(() => { R3.set('burp'); burp.classList.remove('on'); void burp.offsetWidth; burp.classList.add('on'); }, 900);
    later(() => R3.set('full'), 1900);
    later(loop, 4300);
  })();
}


/* ---------- BACKSOUND ---------- */
const BGM = (() => {
  let ac = null, master = null, timer = null, step = 0, nextT = 0, started = false, muted = false, noiseBuf = null;
  const VOL = 0.5;                                  // volume utama (0 - 1)
  const BPM = 132, SPS = 60 / BPM / 2;              // 1 step = nada 1/8
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  // 4 bar x 8 step (0 = jeda)
  const MEL = [72,76,79,76, 72,76,79,84,   77,81,84,81, 77,81,84,81,
               79,83,86,83, 79,83,86,83,   84,79,76,79, 72,0,76,0];
  const ROOT = [48,53,55,48];                       // C F G C

  function tone(t, midi, dur, type, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = hz(midi);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function hat(t, vol) {
    const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.06);
  }
  function schedule() {
    while (nextT < ac.currentTime + 0.2) {
      const i = step % 32, bar = Math.floor(i / 8), k = i % 8;
      if (MEL[i]) tone(nextT, MEL[i], SPS * 0.9, 'square', 0.12);
      if (k % 2 === 0) tone(nextT, ROOT[bar] + (k % 4 === 2 ? 7 : 0), SPS * 1.6, 'triangle', 0.28);
      if (k % 2 === 1) hat(nextT, 0.10);
      nextT += SPS; step++;
    }
  }
  function start() {
    if (started) { if (ac && ac.state === 'suspended' && !muted && !document.hidden) ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    started = true;
    ac = new AC(); master = ac.createGain(); master.gain.value = muted ? 0 : VOL; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.1), ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    ac.resume(); nextT = ac.currentTime + 0.05;
    timer = setInterval(schedule, 40);
  }
  function setMuted(m) {
    muted = m;
    if (master) master.gain.setTargetAtTime(m ? 0 : VOL, ac.currentTime, 0.05);
    $('#mute').classList.toggle('off', m);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else if (!muted) { ac.resume(); nextT = ac.currentTime + 0.05; }
  });
  return {start, toggle: () => { start(); setMuted(!muted); }};
})();

['pointerup','click','touchend'].forEach(ev => document.addEventListener(ev, () => BGM.start()));
$('#mute').addEventListener('click', e => { e.stopPropagation(); BGM.toggle(); });
$('#mute').addEventListener('pointerdown', e => e.stopPropagation());


document.addEventListener('contextmenu', e => e.preventDefault());
['gesturestart','gesturechange','gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));
document.addEventListener('dblclick', e => e.preventDefault());
})();