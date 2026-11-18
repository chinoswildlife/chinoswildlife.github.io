
/* CHINOS additional activities, based on the educational workbook */
(function(){
"use strict";
const cute=id=>"assets/cute-"+id+".svg";
document.querySelectorAll(".hero-postcard img").forEach((im,i)=>{im.src=cute(["irves","bokhon","mazalai"][i]);});
const animalGrid=document.getElementById("animalGrid");
function updatePictures(){
 animalGrid.querySelectorAll(".animal-card").forEach((card,i)=>{
  const im=card.querySelector(".animal-image img");
  const a=animals[i];if(a&&im){im.src=cute(a.id);im.alt=a.name+" — хүүхдэд зориулсан зурагт дүрслэл";}
 });
}
updatePictures();
animalGrid.addEventListener("click",e=>{
 const b=e.target.closest("[data-animal]");if(!b)return;
 const d=document.getElementById("detailBody");
 const im=d.querySelector(".detail-picture img");if(im)im.src=cute(b.dataset.animal);
});
const animalChoices=[
 ["bokhon","Сүргийг тээврийн хэрэгслээр хөөхгүй"],
 ["irves","Малчидтай хамтран хамгаалах аргыг дэмжинэ"],
 ["mazalai","Баянбүрдийн усыг бохирдуулахгүй"],
 ["havtgai","Гэрийн тэмээтэй андуурахгүй"],
 ["takhi","Зэрлэг адууг хооллохгүй, унахгүй"],
 ["hulan","Ус руу хүрэх хөдөлгөөний замыг хамгаална"]
];
const matchBody=document.getElementById("matchBody"),matchStatus=document.getElementById("matchStatus");
let left=null,right=null,matched=new Set(),busy=false;
const mix=a=>a.slice().sort(()=>Math.random()-.5);
let shuffled=mix(animalChoices);
function drawMatch(){
 left=right=null;matched=new Set();busy=false;shuffled=mix(animalChoices);
 document.getElementById("matchAnimals").innerHTML=animalChoices.map(([id])=>{
 const a=animals.find(x=>x.id===id);
 return '<button class="match-choice" data-left="'+id+'"><img src="'+cute(id)+'" alt="">'+a.name+'</button>';
 }).join("");
 document.getElementById("matchActions").innerHTML=shuffled.map(([id,txt])=>
 '<button class="match-choice" data-right="'+id+'">'+txt+'</button>').join("");
 matchStatus.textContent="Хоорондоо тохирох амьтан, үйлдлийг сонгоорой. 0 / 6";
}
function tryMatch(){
 if(!left||!right||busy)return;
 const l=document.querySelector('[data-left="'+left+'"]'),r=document.querySelector('[data-right="'+right+'"]');
 busy=true;
 if(left===right){
  matched.add(left);[l,r].forEach(b=>{b.classList.add("correct");b.classList.remove("selected");b.disabled=true;});
  matchStatus.textContent=matched.size===6?"🎉 Бүх хосыг зөв оллоо! Байгалийн сайн найз байна!":"✅ Зөв! "+matched.size+" / 6";
  left=right=null;busy=false;
 }else{
  l.classList.add("mistake");r.classList.add("mistake");
  matchStatus.textContent="Дахин нэг бодоод үзээрэй. Амьтанд юу хэрэгтэй вэ?";
  setTimeout(()=>{[l,r].forEach(b=>b.classList.remove("selected","mistake"));left=right=null;busy=false;},450);
 }
}
matchBody.addEventListener("click",e=>{
 const b=e.target.closest("button[data-left],button[data-right]");if(!b||b.disabled||busy)return;
 if(b.dataset.left!==undefined){
  document.querySelectorAll("#matchAnimals .selected").forEach(x=>x.classList.remove("selected"));
  left=b.dataset.left;b.classList.add("selected");
 }else{
  document.querySelectorAll("#matchActions .selected").forEach(x=>x.classList.remove("selected"));
  right=b.dataset.right;b.classList.add("selected");
 }
 tryMatch();
});
document.getElementById("openMatch").onclick=()=>{drawMatch();document.getElementById("matchDialog").showModal();};
document.getElementById("restartMatch").onclick=drawMatch;
const hc=document.getElementById("habitatCanvas"),hctx=hc.getContext("2d");
const sel=document.getElementById("habitatAnimal");
sel.innerHTML=animals.map(a=>'<option value="'+a.id+'">'+a.name+'</option>').join("");
const brushColor=document.getElementById("habitatColor"),brushSize=document.getElementById("habitatSize");
let drawing=false,prev=null,history=[];
function blankHabitat(){
 hctx.fillStyle="#fffdf5";hctx.fillRect(0,0,hc.width,hc.height);
 const g=hctx.createLinearGradient(0,0,0,hc.height);
 g.addColorStop(0,"#d2edf2");g.addColorStop(1,"#f1f5e2");
 hctx.fillStyle=g;hctx.fillRect(0,0,hc.width,hc.height);
 hctx.fillStyle="#d1e6bd";hctx.beginPath();hctx.moveTo(0,465);hctx.quadraticCurveTo(280,380,600,477);hctx.quadraticCurveTo(900,400,1200,451);hctx.lineTo(1200,800);hctx.lineTo(0,800);hctx.fill();
 const a=animals.find(x=>x.id===sel.value);hctx.font="bold 28px system-ui";hctx.fillStyle="#426858";hctx.fillText(a?a.name:"Миний амьдрах орчин",40,54);
 history=[];
}
const coord=e=>{const r=hc.getBoundingClientRect();return{x:(e.clientX-r.left)*hc.width/r.width,y:(e.clientY-r.top)*hc.height/r.height};};
hc.addEventListener("pointerdown",e=>{e.preventDefault();drawing=true;hc.setPointerCapture(e.pointerId);history.push(hctx.getImageData(0,0,hc.width,hc.height));prev=coord(e);hctx.beginPath();hctx.arc(prev.x,prev.y,+brushSize.value/2,0,Math.PI*2);hctx.fillStyle=brushColor.value;hctx.fill();});
hc.addEventListener("pointermove",e=>{if(!drawing)return;const p=coord(e);hctx.strokeStyle=brushColor.value;hctx.lineWidth=+brushSize.value;hctx.lineCap="round";hctx.lineJoin="round";hctx.beginPath();hctx.moveTo(prev.x,prev.y);hctx.lineTo(p.x,p.y);hctx.stroke();prev=p;});
["pointerup","pointercancel","lostpointercapture"].forEach(ev=>hc.addEventListener(ev,()=>drawing=false));
document.getElementById("openHabitat").onclick=()=>{blankHabitat();document.getElementById("habitatDialog").showModal();};
document.getElementById("resetHabitat").onclick=blankHabitat;
sel.onchange=blankHabitat;
document.getElementById("undoHabitat").onclick=()=>{const last=history.pop();if(last)hctx.putImageData(last,0,0);};
document.getElementById("saveHabitat").onclick=()=>{const a=document.createElement("a");a.href=hc.toDataURL("image/png");a.download="CHINOS-mini-orchin.png";a.click();};
document.getElementById("pledgeForm").addEventListener("submit",e=>{
 e.preventDefault();
 const a=document.getElementById("pledgeAnimal"),act=document.getElementById("pledgeAction");
 const name=animals.find(x=>x.id===a.value)?.name||"зэрлэг амьтан";
 const msg="Би "+name+"-г хамгаалахын тулд "+act.value+"";
 const box=document.getElementById("pledgePreview");box.textContent=msg+". 🌿";box.classList.add("visible");
});
document.getElementById("pledgeAnimal").innerHTML=animals.map(a=>'<option value="'+a.id+'">'+a.name+'</option>').join("");
})();
