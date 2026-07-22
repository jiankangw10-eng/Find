
const levels = window.LEVELS;
let levelIndex = 0;
let found = [];
let hints = 3;

const imgA = document.getElementById("imgA");
const imgB = document.getElementById("imgB");
const overlayA = document.getElementById("overlayA");
const overlayB = document.getElementById("overlayB");
const progress = document.getElementById("progress");
const levelCount = document.getElementById("levelCount");
const levelTitle = document.getElementById("levelTitle");
const hintBtn = document.getElementById("hintBtn");
const hintCount = document.getElementById("hintCount");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalBtn = document.getElementById("modalBtn");

function showToast(text){
  toast.textContent=text; toast.classList.add("show");
  clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),1100);
}

function loadLevel(){
  const lvl = levels[levelIndex];
  found = [];
  imgA.src = lvl.a; imgB.src = lvl.b;
  overlayA.innerHTML = ""; overlayB.innerHTML = "";
  levelTitle.textContent = `第 ${levelIndex+1} 關｜${lvl.title}`;
  levelCount.textContent = `${levelIndex+1} / ${levels.length}`;
  updateUI();
}

function updateUI(){
  progress.textContent = `${found.length} / 5`;
  hintCount.textContent = hints;
  nextBtn.disabled = found.length < 5;
}

function getPoint(e, wrap){
  const rect = wrap.getBoundingClientRect();
  return {x:(e.clientX-rect.left)/rect.width,y:(e.clientY-rect.top)/rect.height};
}

function checkHit(e, wrap){
  const p = getPoint(e, wrap);
  const lvl = levels[levelIndex];
  let hit = -1, best = Infinity;
  lvl.spots.forEach((s,i)=>{
    if(found.includes(i)) return;
    const d = Math.hypot(p.x-s.x,p.y-s.y);
    if(d < s.r && d < best){best=d;hit=i;}
  });
  if(hit>=0){
    found.push(hit);
    drawSpot(hit);
    navigator.vibrate?.(35);
    updateUI();
    if(found.length===5){
      setTimeout(()=>{
        modalTitle.textContent = levelIndex===levels.length-1 ? "全部完成！" : "過關！";
        modalText.textContent = levelIndex===levels.length-1 ? "你完成了 5 個關卡。" : "你找到了全部不同之處。";
        modalBtn.textContent = levelIndex===levels.length-1 ? "重新挑戰" : "下一關";
        modal.classList.add("show");
      },300);
    }
  }else{
    showToast("這裡沒有不同，再找找看");
  }
}

function drawSpot(i){
  const s=levels[levelIndex].spots[i];
  [overlayA,overlayB].forEach(o=>{
    const d=document.createElement("div");
    d.className="spot";
    d.style.left=(s.x*100)+"%"; d.style.top=(s.y*100)+"%";
    d.style.width=(s.r*200)+"%"; d.style.aspectRatio="1";
    o.appendChild(d);
  });
}

document.getElementById("topWrap").addEventListener("click",e=>checkHit(e,e.currentTarget));
document.getElementById("bottomWrap").addEventListener("click",e=>checkHit(e,e.currentTarget));

hintBtn.addEventListener("click",()=>{
  if(hints<=0){showToast("提示已用完");return;}
  const remain = levels[levelIndex].spots.map((_,i)=>i).filter(i=>!found.includes(i));
  if(!remain.length)return;
  hints--;
  const i=remain[Math.floor(Math.random()*remain.length)];
  const s=levels[levelIndex].spots[i];
  [overlayA,overlayB].forEach(o=>{
    const d=document.createElement("div");
    d.className="hintPulse";
    d.style.left=(s.x*100)+"%"; d.style.top=(s.y*100)+"%";
    d.style.width=(s.r*240)+"%"; d.style.aspectRatio="1";
    o.appendChild(d);
    setTimeout(()=>d.remove(),1800);
  });
  updateUI();
});

restartBtn.addEventListener("click",()=>loadLevel());
nextBtn.addEventListener("click",()=>{
  if(found.length<5)return;
  levelIndex=(levelIndex+1)%levels.length;
  loadLevel();
});

modalBtn.addEventListener("click",()=>{
  modal.classList.remove("show");
  if(levelIndex===levels.length-1){levelIndex=0;hints=3;}else{levelIndex++;}
  loadLevel();
});

loadLevel();
