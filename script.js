// CURSOR
(function(){
  var cur=document.getElementById('cur');
  var mx=window.innerWidth/2, my=window.innerHeight/2;
  var canvas=document.createElement('canvas');
  canvas.style.position='fixed';
  canvas.style.top='0';
  canvas.style.left='0';
  canvas.style.width='100vw';
  canvas.style.height='100vh';
  canvas.style.zIndex='9998';
  canvas.style.pointerEvents='none';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  function rsz(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  window.addEventListener('resize',rsz);
  rsz();

  var trail = [];
  var trailLength = 20;
  for(var i=0; i<trailLength; i++) {
    trail.push({x: mx, y: my});
  }
  
  var curColor='#00d4e8';

  document.addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
  });
  
  (function tick(){
    cur.style.left=mx+'px';
    cur.style.top=my+'px';
    
    // offset so the tail comes out of the base of the arrow
    var targetX = mx + 6; 
    var targetY = my + 6;
    
    // physics step
    trail[0].x += (targetX - trail[0].x) * 0.4;
    trail[0].y += (targetY - trail[0].y) * 0.4;
    
    for(var i=1; i<trailLength; i++){
      trail[i].x += (trail[i-1].x - trail[i].x) * 0.4;
      trail[i].y += (trail[i-1].y - trail[i].y) * 0.4;
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Draw connected path for smooth continuous fluid ribbon
    if (trailLength > 1) {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(trail[0].x, trail[0].y);
      for(var i=1; i<trailLength-1; i++){
        var xc = (trail[i].x + trail[i+1].x) / 2;
        var yc = (trail[i].y + trail[i+1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      ctx.lineTo(trail[trailLength-1].x, trail[trailLength-1].y);
      ctx.strokeStyle = curColor;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 12;
      ctx.shadowColor = curColor;
      ctx.stroke();
    }
    
    // Draw shrinking circles to give variable thickness and a rounded front/back
    for(var i=0; i<trailLength; i++){
      var radius = 4 * (1 - i/trailLength);
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, Math.max(0.1, radius), 0, Math.PI*2);
      ctx.fillStyle = curColor;
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  })();
  
  document.querySelectorAll('a,button,.pcard,.skcard,.ccard,.cbtn,.close-btn').forEach(function(el){
    el.addEventListener('mouseenter',function(){
        cur.style.transform = 'translate(-2px,-2px) scale(1.1)';
        cur.style.color = '#ffffff';
        curColor = '#ffffff';
    });
    el.addEventListener('mouseleave',function(){
        cur.style.transform = 'translate(-2px,-2px) scale(1)';
        cur.style.color = 'var(--teal)';
        curColor = '#00d4e8';
    });
  });
})();

// HUMANOID ROBOT
(function(){
  var cv=document.getElementById('robot-canvas');
  var g=cv.getContext('2d');
  var W=400,H=480;
  cv.width=W; cv.height=H;
  var PI=Math.PI;
  var CX=W/2;
  var msx=W/2,msy=H/2,lx=0,ly=0,t=0;

  document.addEventListener('mousemove',function(e){
    var r=cv.getBoundingClientRect();
    msx=e.clientX-r.left; msy=e.clientY-r.top;
  });

  // chrome gradient left-to-right
  function cg(x,y,w,h){
    var gr=g.createLinearGradient(x,y,x+w,y+h);
    gr.addColorStop(0,'#e0eaf5');
    gr.addColorStop(0.2,'#c0d0e4');
    gr.addColorStop(0.5,'#8fa8c0');
    gr.addColorStop(0.78,'#607888');
    gr.addColorStop(1,'#304050');
    return gr;
  }
  // chrome radial (for round parts)
  function cr(x,y,r2){
    var gr=g.createRadialGradient(x-r2*0.35,y-r2*0.35,r2*0.05,x,y,r2);
    gr.addColorStop(0,'#eef4fc');
    gr.addColorStop(0.25,'#c8daea');
    gr.addColorStop(0.6,'#7898b0');
    gr.addColorStop(1,'#304858');
    return gr;
  }

  function drawRobot(){
    var bob=Math.sin(t*0.75)*5;
    g.clearRect(0,0,W,H);

    // ambient glow
    var amb=g.createRadialGradient(CX,220+bob,10,CX,220+bob,200);
    amb.addColorStop(0,'rgba(20,80,140,0.10)');
    amb.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=amb; g.fillRect(0,0,W,H);

    // floor shadow
    g.save(); g.globalAlpha=0.3;
    var fs=g.createRadialGradient(CX,472,4,CX,472,70);
    fs.addColorStop(0,'rgba(0,160,220,0.6)'); fs.addColorStop(1,'transparent');
    g.fillStyle=fs; g.beginPath(); g.ellipse(CX,472,65,10,0,0,2*PI); g.fill(); g.restore();

    // ---- positions ----
    var BY=240+bob;   // torso centre Y
    var HY=BY-170;    // head centre Y

    // ── UPPER ARMS (behind torso) ──
    [-1,1].forEach(function(s){
      var ax=CX+s*68;
      var sw=Math.sin(t*0.65+(s>0?PI:0))*7;
      // upper arm
      g.save();
      g.beginPath();
      g.moveTo(ax-10,BY-75); g.lineTo(ax+10,BY-75);
      g.lineTo(ax+12+sw,BY-10); g.lineTo(ax-12+sw,BY-10);
      g.closePath();
      g.fillStyle=cg(ax-12,BY-75,24,65);
      g.shadowColor='rgba(0,0,0,0.5)'; g.shadowBlur=12; g.fill(); g.restore();
      // elbow ball
      g.save();
      g.beginPath(); g.arc(ax+sw*0.8,BY-8,12,0,2*PI);
      g.fillStyle=cr(ax+sw*0.8-4,BY-12,12);
      g.shadowColor='rgba(0,0,0,0.5)'; g.shadowBlur=10; g.fill();
      g.strokeStyle='rgba(200,225,245,0.25)'; g.lineWidth=1; g.stroke(); g.restore();
      // forearm
      var lsw=Math.sin(t*0.8+(s>0?PI:0)+0.6)*10;
      var ex=ax+sw*0.8, ey=BY-8;
      g.save();
      g.beginPath();
      g.moveTo(ex-10,ey+10); g.lineTo(ex+10,ey+10);
      g.lineTo(ex+8+lsw,ey+68); g.lineTo(ex-8+lsw,ey+68);
      g.closePath();
      g.fillStyle=cg(ex-10,ey+10,20,58);
      g.shadowColor='rgba(0,0,0,0.45)'; g.shadowBlur=10; g.fill(); g.restore();
      // wrist
      var wx=ex+lsw,wy=ey+68;
      g.save(); g.beginPath(); g.ellipse(wx,wy,9,7,0,0,2*PI);
      g.fillStyle=cr(wx-3,wy-3,9); g.shadowColor='rgba(0,0,0,0.4)'; g.shadowBlur=8; g.fill(); g.restore();
      // hand
      g.save(); g.beginPath();
      g.moveTo(wx-9,wy+6); g.bezierCurveTo(wx-11,wy+18,wx-8,wy+28,wx-3,wy+32);
      g.lineTo(wx+3,wy+32); g.bezierCurveTo(wx+8,wy+28,wx+11,wy+18,wx+9,wy+6);
      g.closePath();
      g.fillStyle=cg(wx-11,wy+6,22,26);
      g.shadowColor='rgba(0,0,0,0.4)'; g.shadowBlur=8; g.fill();
      g.strokeStyle='rgba(160,200,225,0.2)'; g.lineWidth=1; g.stroke(); g.restore();
      // 3 finger lines
      g.save(); g.strokeStyle='rgba(40,70,90,0.35)'; g.lineWidth=1;
      [-4,0,4].forEach(function(fo){
        g.beginPath(); g.moveTo(wx+fo,wy+12); g.lineTo(wx+fo*1.1,wy+30); g.stroke();
      }); g.restore();
    });

    // ── TORSO ──
    var tx=CX+lx*2;
    g.save(); g.beginPath();
    // torso outline — broad muscular chest tapering to waist
    g.moveTo(tx-52,BY-80);
    g.bezierCurveTo(tx-56,BY-60,tx-58,BY-20,tx-50,BY+30);
    g.bezierCurveTo(tx-42,BY+70,tx-26,BY+82,tx,BY+84);
    g.bezierCurveTo(tx+26,BY+82,tx+42,BY+70,tx+50,BY+30);
    g.bezierCurveTo(tx+58,BY-20,tx+56,BY-60,tx+52,BY-80);
    g.closePath();
    var tgrad=g.createLinearGradient(tx-58,BY-80,tx+58,BY+84);
    tgrad.addColorStop(0,'#d8e6f0');
    tgrad.addColorStop(0.18,'#b8cce0');
    tgrad.addColorStop(0.45,'#8aa4bc');
    tgrad.addColorStop(0.72,'#607898');
    tgrad.addColorStop(1,'#2e4258');
    g.fillStyle=tgrad;
    g.shadowColor='rgba(0,0,0,0.65)'; g.shadowBlur=28; g.fill(); g.restore();

    // chest specular
    g.save();
    var cs=g.createRadialGradient(tx-12,BY-52,4,tx-4,BY-40,50);
    cs.addColorStop(0,'rgba(255,255,255,0.48)');
    cs.addColorStop(0.5,'rgba(200,222,240,0.14)');
    cs.addColorStop(1,'rgba(255,255,255,0)');
    g.beginPath(); g.ellipse(tx-4,BY-36,46,38,0,0,2*PI);
    g.fillStyle=cs; g.fill(); g.restore();

    // sternum line
    g.save(); g.beginPath();
    g.moveTo(tx,BY-78); g.bezierCurveTo(tx-1,BY-30,tx-2,BY+10,tx-3,BY+50);
    g.strokeStyle='rgba(30,55,80,0.45)'; g.lineWidth=2;
    g.shadowColor='rgba(0,0,0,0.3)'; g.shadowBlur=4; g.stroke(); g.restore();

    // pec crease lines
    g.save(); g.strokeStyle='rgba(100,140,170,0.25)'; g.lineWidth=1.2;
    // left pec bottom arc
    g.beginPath(); g.moveTo(tx-4,BY-26); g.bezierCurveTo(tx-22,BY-20,tx-44,BY-32,tx-50,BY-52);
    g.stroke();
    // right pec bottom arc
    g.beginPath(); g.moveTo(tx+4,BY-26); g.bezierCurveTo(tx+22,BY-20,tx+44,BY-32,tx+50,BY-52);
    g.stroke(); g.restore();

    // abs segments
    [-1,1].forEach(function(s){
      [BY+8,BY+28,BY+48].forEach(function(ay,i){
        g.save(); g.beginPath(); g.ellipse(tx+s*18,ay,13,9,0,0,2*PI);
        var ag=g.createRadialGradient(tx+s*18-4,ay-3,1,tx+s*18,ay,13);
        ag.addColorStop(0,'rgba(215,232,248,0.45)');
        ag.addColorStop(0.6,'rgba(110,148,178,0.18)');
        ag.addColorStop(1,'rgba(50,80,110,0.04)');
        g.fillStyle=ag; g.fill();
        g.strokeStyle='rgba(90,130,160,0.25)'; g.lineWidth=0.8; g.stroke(); g.restore();
      });
    });

    // torso edge stroke
    g.save(); g.beginPath();
    g.moveTo(tx-52,BY-80);
    g.bezierCurveTo(tx-56,BY-60,tx-58,BY-20,tx-50,BY+30);
    g.bezierCurveTo(tx-42,BY+70,tx-26,BY+82,tx,BY+84);
    g.bezierCurveTo(tx+26,BY+82,tx+42,BY+70,tx+50,BY+30);
    g.bezierCurveTo(tx+58,BY-20,tx+56,BY-60,tx+52,BY-80);
    g.closePath();
    g.strokeStyle='rgba(200,228,248,0.28)'; g.lineWidth=1.5; g.stroke(); g.restore();

    // ── SHOULDERS ──
    [-1,1].forEach(function(s){
      var sx=tx+s*56, sy=BY-64;
      g.save(); g.beginPath(); g.ellipse(sx,sy,26,30,s*0.15,0,2*PI);
      g.fillStyle=cr(sx+s*(-9),sy-10,26);
      g.shadowColor='rgba(0,0,0,0.55)'; g.shadowBlur=16; g.fill();
      g.strokeStyle='rgba(200,228,248,0.22)'; g.lineWidth=1; g.stroke();
      // shoulder specular
      var ss=g.createRadialGradient(sx+s*(-8),sy-11,2,sx+s*(-4),sy-6,16);
      ss.addColorStop(0,'rgba(255,255,255,0.52)'); ss.addColorStop(1,'rgba(255,255,255,0)');
      g.beginPath(); g.ellipse(sx+s*(-3),sy-5,16,13,s*0.25,0,2*PI);
      g.fillStyle=ss; g.fill(); g.restore();
    });

    // ── NECK ──
    var nx=tx+lx*3;
    g.save(); g.beginPath();
    g.moveTo(nx-15,BY-80); g.bezierCurveTo(nx-17,BY-68,nx-13,BY-56,nx-11,BY-50);
    g.lineTo(nx+11,BY-50); g.bezierCurveTo(nx+13,BY-56,nx+17,BY-68,nx+15,BY-80);
    g.closePath();
    var ng=g.createLinearGradient(nx-17,BY-80,nx+17,BY-50);
    ng.addColorStop(0,'#c0d4e8'); ng.addColorStop(0.5,'#88a0b8'); ng.addColorStop(1,'#4a6070');
    g.fillStyle=ng; g.shadowColor='rgba(0,0,0,0.45)'; g.shadowBlur=10; g.fill(); g.restore();
    // neck ring
    g.save(); g.beginPath(); g.ellipse(nx,BY-62,13,5,0,0,2*PI);
    g.strokeStyle='rgba(160,195,220,0.35)'; g.lineWidth=1.5; g.stroke(); g.restore();

    // ── LEGS ──
    [-1,1].forEach(function(s){
      var lbx=CX+s*28, lby=BY+84;
      var lsw=Math.sin(t*0.7+(s>0?PI:0))*5;

      // thigh
      g.save(); g.beginPath();
      g.moveTo(lbx-17,lby); g.bezierCurveTo(lbx-20,lby+30,lbx-18+lsw,lby+68,lbx-14+lsw,lby+90);
      g.lineTo(lbx+14+lsw,lby+90); g.bezierCurveTo(lbx+18+lsw,lby+68,lbx+20,lby+30,lbx+17,lby);
      g.closePath();
      g.fillStyle=cg(lbx-20,lby,38,90);
      g.shadowColor='rgba(0,0,0,0.45)'; g.shadowBlur=14; g.fill();
      g.strokeStyle='rgba(190,218,238,0.2)'; g.lineWidth=1; g.stroke();
      // thigh specular
      var ts=g.createRadialGradient(lbx-6,lby+14,2,lbx-2,lby+24,18);
      ts.addColorStop(0,'rgba(228,242,255,0.48)'); ts.addColorStop(1,'rgba(228,242,255,0)');
      g.beginPath(); g.ellipse(lbx-1,lby+28,12,26,0,0,2*PI);
      g.fillStyle=ts; g.fill(); g.restore();

      // knee
      var kx=lbx+lsw, ky=lby+92;
      g.save(); g.beginPath(); g.ellipse(kx,ky,16,14,0,0,2*PI);
      g.fillStyle=cr(kx+s*(-5),ky-5,16);
      g.shadowColor='rgba(0,0,0,0.5)'; g.shadowBlur=12; g.fill();
      var ks=g.createRadialGradient(kx+s*(-5),ky-6,1,kx,ky,14);
      ks.addColorStop(0,'rgba(255,255,255,0.48)'); ks.addColorStop(1,'rgba(255,255,255,0)');
      g.beginPath(); g.arc(kx,ky,13,0,2*PI); g.fillStyle=ks; g.fill();
      g.strokeStyle='rgba(190,218,238,0.25)'; g.lineWidth=1; g.stroke(); g.restore();

      // shin
      var skx=kx, sky=ky+13;
      g.save(); g.beginPath();
      g.moveTo(skx-12,sky); g.bezierCurveTo(skx-14,sky+28,skx-11+lsw*0.4,sky+60,skx-8+lsw*0.4,sky+84);
      g.lineTo(skx+8+lsw*0.4,sky+84); g.bezierCurveTo(skx+11+lsw*0.4,sky+60,skx+14,sky+28,skx+12,sky);
      g.closePath();
      g.fillStyle=cg(skx-14,sky,28,84);
      g.shadowColor='rgba(0,0,0,0.4)'; g.shadowBlur=12; g.fill();
      g.strokeStyle='rgba(185,215,235,0.18)'; g.lineWidth=1; g.stroke(); g.restore();

      // foot
      var fx=skx+lsw*0.4, fy=sky+86;
      g.save(); g.beginPath();
      g.moveTo(fx-12,fy); g.bezierCurveTo(fx-14,fy+8,fx-16,fy+16,fx-18,fy+18);
      g.lineTo(fx+14,fy+18); g.bezierCurveTo(fx+14,fy+12,fx+12,fy+6,fx+12,fy);
      g.closePath();
      g.fillStyle=cg(fx-18,fy,32,18);
      g.shadowColor='rgba(0,0,0,0.5)'; g.shadowBlur=10; g.fill(); g.restore();
    });

    // ── HEAD ──
    var hx=CX+lx*14, hy=HY+bob+ly*8;

    // skull dome
    g.save(); g.beginPath();
    g.arc(hx,hy,44,PI,2*PI);  // top half circle
    g.bezierCurveTo(hx+44,hy+10,hx+42,hy+30,hx+28,hy+50);
    g.lineTo(hx-28,hy+50);
    g.bezierCurveTo(hx-42,hy+30,hx-44,hy+10,hx-44,hy);
    g.closePath();
    var hgrad=g.createLinearGradient(hx-44,hy-44,hx+44,hy+50);
    hgrad.addColorStop(0,'#dceaf6'); hgrad.addColorStop(0.15,'#c0d4e8');
    hgrad.addColorStop(0.42,'#90aaC2'); hgrad.addColorStop(0.70,'#607888'); hgrad.addColorStop(1,'#304050');
    g.fillStyle=hgrad;
    g.shadowColor='rgba(0,0,0,0.6)'; g.shadowBlur=22; g.fill(); g.restore();

    // skull highlight
    g.save();
    var sh=g.createRadialGradient(hx-14,hy-28,3,hx-8,hy-20,32);
    sh.addColorStop(0,'rgba(255,255,255,0.52)'); sh.addColorStop(1,'rgba(255,255,255,0)');
    g.beginPath(); g.ellipse(hx-8,hy-18,30,22,0,0,2*PI);
    g.fillStyle=sh; g.fill(); g.restore();

    // skull stroke
    g.save(); g.beginPath();
    g.arc(hx,hy,44,PI,2*PI);
    g.bezierCurveTo(hx+44,hy+10,hx+42,hy+30,hx+28,hy+50);
    g.lineTo(hx-28,hy+50);
    g.bezierCurveTo(hx-42,hy+30,hx-44,hy+10,hx-44,hy);
    g.closePath();
    g.strokeStyle='rgba(210,235,252,0.32)'; g.lineWidth=1.5; g.stroke(); g.restore();

    // face plate (slightly recessed)
    g.save(); g.beginPath();
    g.moveTo(hx-28,hy-2);
    g.bezierCurveTo(hx-30,hy+14,hx-26,hy+34,hx-14,hy+44);
    g.quadraticCurveTo(hx,hy+48,hx+14,hy+44);
    g.bezierCurveTo(hx+26,hy+34,hx+30,hy+14,hx+28,hy-2);
    g.quadraticCurveTo(hx,hy-8,hx-28,hy-2);
    g.closePath();
    var fg=g.createLinearGradient(hx-30,hy-8,hx+30,hy+48);
    fg.addColorStop(0,'#aabccc'); fg.addColorStop(0.5,'#8098b0'); fg.addColorStop(1,'#526070');
    g.fillStyle=fg; g.fill(); g.restore();

    // EYES
    var ey2=hy+12+ly*3;
    [-15,15].forEach(function(ox){
      var ex=hx+ox+lx*5;
      // socket
      g.save(); g.beginPath(); g.ellipse(ex,ey2,9,6,0,0,2*PI);
      g.fillStyle='#141e28'; g.fill(); g.restore();
      // iris glow
      var ep=0.72+Math.sin(t*2.4)*0.28;
      var eg=g.createRadialGradient(ex,ey2,0,ex,ey2,8);
      eg.addColorStop(0,'rgba(50,210,255,'+ep+')');
      eg.addColorStop(0.35,'rgba(0,160,220,'+(ep*0.7)+')');
      eg.addColorStop(1,'rgba(0,50,90,0)');
      g.save(); g.shadowColor='#00b8f0'; g.shadowBlur=18;
      g.beginPath(); g.ellipse(ex,ey2,7,5,0,0,2*PI);
      g.fillStyle=eg; g.fill(); g.restore();
      // pupil
      g.save(); g.beginPath(); g.ellipse(ex+lx*1.5,ey2+ly*1.2,3,2.4,0,0,2*PI);
      g.fillStyle='#001422'; g.fill(); g.restore();
      // eye specular
      g.save(); g.beginPath(); g.arc(ex+3,ey2-2,1.5,0,2*PI);
      g.fillStyle='rgba(255,255,255,0.85)'; g.fill(); g.restore();
    });

    // nose bridge (subtle ridge)
    g.save(); g.beginPath(); g.moveTo(hx,hy+22); g.lineTo(hx,hy+34);
    g.strokeStyle='rgba(50,75,95,0.35)'; g.lineWidth=2; g.stroke(); g.restore();

    // MOUTH — subtle line
    g.save(); g.beginPath();
    g.moveTo(hx-12,hy+40); g.quadraticCurveTo(hx,hy+44,hx+12,hy+40);
    g.strokeStyle='rgba(40,65,85,0.5)'; g.lineWidth=1.5; g.stroke(); g.restore();

    // jaw plate
    g.save(); g.beginPath();
    g.moveTo(hx-28,hy+32); g.bezierCurveTo(hx-30,hy+44,hx-22,hy+52,hx-14,hy+54);
    g.lineTo(hx+14,hy+54); g.bezierCurveTo(hx+22,hy+52,hx+30,hy+44,hx+28,hy+32);
    g.closePath();
    var jg=g.createLinearGradient(hx-30,hy+32,hx+30,hy+54);
    jg.addColorStop(0,'#8098b0'); jg.addColorStop(1,'#3a5060');
    g.fillStyle=jg; g.fill(); g.restore();

    // TEMPLE PIECE (blue circular, right side — like reference image)
    var tpx=hx+42+lx*1.5, tpy=hy-2;
    // outer chrome ring
    g.save(); g.beginPath(); g.arc(tpx,tpy,13,0,2*PI);
    var tpg=g.createRadialGradient(tpx-4,tpy-4,1,tpx,tpy,13);
    tpg.addColorStop(0,'#c8dce8'); tpg.addColorStop(0.5,'#7090a8'); tpg.addColorStop(1,'#304050');
    g.fillStyle=tpg; g.shadowColor='rgba(0,0,0,0.5)'; g.shadowBlur=12; g.fill();
    g.strokeStyle='rgba(190,220,240,0.4)'; g.lineWidth=1.5; g.stroke(); g.restore();
    // inner glowing blue disc
    g.save(); g.shadowColor='#0090e0'; g.shadowBlur=20;
    g.beginPath(); g.arc(tpx,tpy,8,0,2*PI);
    var tdc=g.createRadialGradient(tpx-3,tpy-3,1,tpx,tpy,8);
    tdc.addColorStop(0,'#60c8ff'); tdc.addColorStop(0.4,'#0080c0'); tdc.addColorStop(1,'#003060');
    g.fillStyle=tdc; g.fill();
    g.strokeStyle='rgba(80,180,255,0.8)'; g.lineWidth=1.5; g.stroke(); g.restore();
    // spinning ring inside disc
    g.save(); g.shadowColor='#40c0ff'; g.shadowBlur=8;
    g.translate(tpx,tpy); g.rotate(t*1.2);
    for(var si=0;si<3;si++){
      var sa=si*(2*PI/3);
      g.beginPath(); g.moveTo(Math.cos(sa)*3,Math.sin(sa)*3); g.lineTo(Math.cos(sa)*6.5,Math.sin(sa)*6.5);
      g.strokeStyle='rgba(150,220,255,0.9)'; g.lineWidth=1.5; g.stroke();
    }
    g.restore();
    // centre dot
    g.save(); g.beginPath(); g.arc(tpx,tpy,2.5,0,2*PI);
    var cd=g.createRadialGradient(tpx,tpy,0,tpx,tpy,2.5);
    cd.addColorStop(0,'#ffffff'); cd.addColorStop(1,'#80d0ff');
    g.fillStyle=cd; g.shadowColor='#80d0ff'; g.shadowBlur=10; g.fill(); g.restore();

    // neck-to-collar blue accent
    g.save(); g.beginPath();
    g.moveTo(tx-38+lx*2,BY-82); g.quadraticCurveTo(tx+lx*3,BY-92,tx+38+lx*2,BY-82);
    g.strokeStyle='rgba(0,150,220,0.55)'; g.lineWidth=1.8;
    g.shadowColor='#0090d0'; g.shadowBlur=10; g.stroke(); g.restore();
  }

  function frame(){
    t+=0.016;
    lx+=(((msx/W)*2-1)-lx)*0.065;
    ly+=(((msy/H)*2-1)-ly)*0.065;
    drawRobot();
    requestAnimationFrame(frame);
  }
  frame();
})();

// BG PARTICLES
(function(){
  var cv=document.getElementById('bg-canvas');
  var cx=cv.getContext('2d');
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  window.addEventListener('resize',function(){cv.width=window.innerWidth;cv.height=window.innerHeight;});
  var pts=[];
  for(var i=0;i<60;i++) pts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.2+0.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,a:Math.random()*.3+.08});
  (function loop(){
    cx.clearRect(0,0,cv.width,cv.height);
    for(var i=0;i<pts.length;i++){
      var p=pts[i]; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0;
      if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0;
      cx.beginPath(); cx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cx.fillStyle='rgba(0,212,232,'+p.a+')'; cx.fill();
      for(var j=i+1;j<pts.length;j++){
        var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<95){cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.strokeStyle='rgba(0,212,232,'+(0.055*(1-d/95))+')';cx.lineWidth=0.5;cx.stroke();}
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// SCROLL ANIMATIONS
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skfill').forEach(function(b){setTimeout(function(){b.style.width=b.getAttribute('data-w')+'%';},300);});
      e.target.querySelectorAll('.titem').forEach(function(item,i){setTimeout(function(){item.classList.add('visible');},i*200);});
    }
  });
},{threshold:0.1});
document.querySelectorAll('.fade-sec').forEach(function(s){obs.observe(s);});
window.addEventListener('scroll',function(){
  var y=window.scrollY;
  document.querySelectorAll('section[id]').forEach(function(sec){
    if(y>=sec.offsetTop-100&&y<sec.offsetTop+sec.offsetHeight-100)
      document.querySelectorAll('.nav-links a').forEach(function(a){a.style.color=a.getAttribute('href')==='#'+sec.id?'var(--teal)':'';});
  });
});

function showProPopup(pdfUrl) {
  if (pdfUrl) {
    document.getElementById('pro-popup-iframe').src = pdfUrl;
  } else {
    document.getElementById('pro-popup-iframe').src = '';
    alert('Document not available.');
    return;
  }
  document.getElementById('pro-popup').classList.add('active');
}
function closeProPopup() {
  document.getElementById('pro-popup-iframe').src = '';
  document.getElementById('pro-popup').classList.remove('active');
}
document.getElementById('pro-popup').addEventListener('click', function(e) {
  if (e.target === this) closeProPopup();
});
