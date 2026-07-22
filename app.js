const levels=window.LEVELS;
let levelIndex=Number(localStorage.getItem("fd_level")||0); if(levelIndex>=levels.length) levelIndex=0;
let found=[],hints=2,timeLeft=90,timerId;
const $=id=>document.getElementById(id), imgA=$("imgA"),imgB=$("imgB"),overlayA=$("overlayA"),overlayB=$("overlayB");
const states={topWrap:{scale:1,x:0,y:0},bottomWrap:{scale:1,x:0,y:0}};
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>$("toast").classList.remove("show"),1100)}
function update(){ $("progress").textContent=`${found.length} / 7`;$("levelCount").textContent=`${levelIndex+1} / ${levels.length}`;$("hintCount").textContent=hints;$("nextBtn").disabled=found.length<7;$("timer").textContent=timeLeft}
function startTimer(){clearInterval(timerId);timeLeft=90;update();timerId=setInterval(()=>{timeLeft--;update();if(timeLeft<=0){clearInterval(timerId);showModal("時間到","重新挑戰本關","再試一次",false)}},1000)}
function resetZoom(){for(const id of ["topWrap","bottomWrap"]){states[id]={scale:1,x:0,y:0};renderZoom(id)}}
function load(){const l=levels[levelIndex];found=[];imgA.src=l.a;imgB.src=l.b;overlayA.innerHTML="";overlayB.innerHTML="";$("levelTitle").textContent=`第 ${levelIndex+1} 關｜${l.title}`;resetZoom();startTimer()}
function renderZoom(id){const layer=id==="topWrap"?$("zoomA"):$("zoomB"),s=states[id];layer.style.transform=`translate(${s.x}px,${s.y}px) scale(${s.scale})`}
function normalizedPoint(e,wrap){const r=wrap.getBoundingClientRect(),s=states[wrap.id];return{x:((e.clientX-r.left)-s.x)/(r.width*s.scale),y:((e.clientY-r.top)-s.y)/(r.height*s.scale)}}
function hit(e,wrap){const p=normalizedPoint(e,wrap),spots=levels[levelIndex].spots;let best=-1,dist=999;spots.forEach((s,i)=>{if(found.includes(i))return;const d=Math.hypot(p.x-s.x,p.y-s.y);if(d<s.r&&d<dist){best=i;dist=d}});if(best<0){toast("不是這裡");return}found.push(best);draw(best);update();if(found.length===7){clearInterval(timerId);localStorage.setItem("fd_level",String(Math.min(levelIndex+1,levels.length-1)));setTimeout(()=>showModal(levelIndex===levels.length-1?"完成全部關卡":"過關",`剩餘 ${timeLeft} 秒`,levelIndex===levels.length-1?"重新開始":"下一關",true),250)}}
function draw(i){const s=levels[levelIndex].spots[i];[overlayA,overlayB].forEach(o=>{const d=document.createElement("div");d.className="spot";d.style.left=s.x*100+"%";d.style.top=s.y*100+"%";d.style.width=s.r*200+"%";d.style.aspectRatio="1";o.appendChild(d)})}
function showModal(t,txt,btn,success){$("modalTitle").textContent=t;$("modalText").textContent=txt;$("modalBtn").textContent=btn;$("modal").classList.add("show");$("modal").dataset.success=success?"1":"0"}
function attachGestures(id){const wrap=$(id);let pts=new Map(),startDist=0,startScale=1,startMid=null,startXY=null,moved=false;
wrap.addEventListener("pointerdown",e=>{wrap.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;if(pts.size===1)startXY={x:e.clientX-states[id].x,y:e.clientY-states[id].y};if(pts.size===2){const a=[...pts.values()];startDist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);startScale=states[id].scale;startMid={x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2}}});
wrap.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===1&&states[id].scale>1){moved=true;states[id].x=e.clientX-startXY.x;states[id].y=e.clientY-startXY.y;renderZoom(id)}else if(pts.size===2){moved=true;const a=[...pts.values()],dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);states[id].scale=Math.max(1,Math.min(3,startScale*dist/startDist));renderZoom(id)}});
wrap.addEventListener("pointerup",e=>{pts.delete(e.pointerId);if(!moved&&pts.size===0)hit(e,wrap)});wrap.addEventListener("pointercancel",e=>pts.delete(e.pointerId));
}
attachGestures("topWrap");attachGestures("bottomWrap");
$("hintBtn").onclick=()=>{if(hints<=0){toast("提示已用完");return}const remain=levels[levelIndex].spots.map((_,i)=>i).filter(i=>!found.includes(i));if(!remain.length)return;hints--;const i=remain[Math.floor(Math.random()*remain.length)],s=levels[levelIndex].spots[i];[overlayA,overlayB].forEach(o=>{const d=document.createElement("div");d.className="hintPulse";d.style.left=s.x*100+"%";d.style.top=s.y*100+"%";d.style.width=s.r*240+"%";d.style.aspectRatio="1";o.appendChild(d);setTimeout(()=>d.remove(),1700)});update()}
$("restartBtn").onclick=load;$("nextBtn").onclick=()=>{if(found.length<7)return;levelIndex=(levelIndex+1)%levels.length;load()}
$("modalBtn").onclick=()=>{$("modal").classList.remove("show");if($("modal").dataset.success==="1"){levelIndex=levelIndex===levels.length-1?0:levelIndex+1;if(levelIndex===0)hints=2}load()}
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
load();