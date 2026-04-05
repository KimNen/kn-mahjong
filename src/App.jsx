import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ═══════ AUDIO ═══════ */
let actx=null;function ctx(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx;}
function note(f,d=0.1,tp="sine",v=0.13,dl=0){try{const c=ctx(),o=c.createOscillator(),g=c.createGain();o.type=tp;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime+dl);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dl+d);o.connect(g);g.connect(c.destination);o.start(c.currentTime+dl);o.stop(c.currentTime+dl+d+0.05);}catch(e){}}
const SFX={tap:()=>note(800,0.04,"sine",0.06),discard:()=>{note(350,0.07,"triangle",0.1);note(280,0.09,"triangle",0.06,0.03);},pon:()=>{note(523,0.12,"sine",0.1);note(659,0.15,"sine",0.1,0.1);},chi:()=>{note(523,0.1,"sine",0.08);note(587,0.1,"sine",0.08,0.08);note(659,0.12,"sine",0.08,0.16);},ron:()=>{note(440,0.25,"sawtooth",0.07);note(554,0.25,"sawtooth",0.07,0.05);note(659,0.35,"sawtooth",0.09,0.1);},tsumo:()=>{note(523,0.12,"sine",0.1);note(659,0.12,"sine",0.1,0.1);note(784,0.15,"sine",0.12,0.2);note(1047,0.35,"sine",0.1,0.3);},riichi:()=>{note(1047,0.12,"sine",0.08);note(1319,0.15,"sine",0.06,0.08);note(1568,0.25,"sine",0.08,0.16);},lose:()=>{note(440,0.18,"sine",0.08);note(349,0.18,"sine",0.08,0.12);note(294,0.35,"sine",0.06,0.24);},kan:()=>{note(440,0.1,"square",0.06);note(554,0.1,"square",0.06,0.08);note(659,0.1,"square",0.06,0.16);note(880,0.2,"square",0.08,0.24);},start:()=>{note(659,0.1,"sine",0.06);note(784,0.1,"sine",0.06,0.1);note(1047,0.15,"sine",0.08,0.2);},call:()=>note(880,0.06,"sine",0.07),yakuman:()=>{[523,659,784,1047,1319].forEach((f,i)=>note(f,0.2,"sine",0.12,i*0.12));}};
const isSafari=typeof navigator!=="undefined"&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let bestVoice=null;function initV(){if(isSafari)return;try{const vs=speechSynthesis.getVoices();const ko=vs.filter(v=>v.lang.startsWith("ko"));for(const p of["google","premium","neural","natural","enhanced","microsoft"]){const f=ko.find(v=>v.name.toLowerCase().includes(p));if(f){bestVoice=f;return;}}bestVoice=ko.find(v=>!v.localService)||ko[0]||null;}catch(e){}}
if(typeof window!=="undefined"&&window.speechSynthesis&&!isSafari){speechSynthesis.onvoiceschanged=initV;setTimeout(initV,100);}
function speak(t){if(isSafari)return;try{if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);if(bestVoice)u.voice=bestVoice;u.lang="ko-KR";u.rate=1.0;u.pitch=1.15;u.volume=0.85;speechSynthesis.speak(u);}catch(e){}}

/* ═══════ TILES ═══════ */
const SUITS={m:"萬",p:"筒",s:"索"},WINDS=["東","南","西","北"],DRAGONS=["白","發","中"];
const DC={"白":"#aaa","發":"#2d8a5e","中":"#d94060"},SC={m:"#c9405a",p:"#3a7cc4",s:"#2d8a5e"};
const PN=["나","동이🐱","남이🐰","서이🐻"],WL=["東","南","西","北"];
const YN={riichi:"리치",tsumo:"멘젠쯔모",pinfu:"핑후",tanyao:"탕야오",yakuhai:"역패",iipeikou:"이페코",chiitoitsu:"치또이쯔",honitsu:"혼이쯔",chinitsu:"친이쯔",toitoi:"또이또이",fanpai_wind:"자풍/장풍",sanshoku:"삼색동순",ittsu:"일기통관",chanta:"찬타",sanankou:"삼암각",kokushi:"국사무쌍",daisangen:"대삼원",ippatsu:"일발",dora:"도라",suuankou:"사암각",tsuuiisou:"자일색",chinroutou:"친로또",daisuushii:"대사희",shousuushii:"소사희",ryanpeikou:"량페코"};
function mkD(){const d=[];for(const s of["m","p","s"])for(let v=1;v<=9;v++)for(let i=0;i<4;i++)d.push(`${v}${s}`);for(let v=1;v<=7;v++)for(let i=0;i<4;i++)d.push(`${v}z`);return d;}
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function tK(t){return({m:0,p:100,s:200,z:300}[t[t.length-1]]||0)+parseInt(t);}
function srt(h){return[...h].sort((a,b)=>tK(a)-tK(b));}
function cntT(ts){const c={};for(const t of ts)c[t]=(c[t]||0)+1;return c;}
const A34=(()=>{const a=[];for(const s of["m","p","s"])for(let v=1;v<=9;v++)a.push(`${v}${s}`);for(let v=1;v<=7;v++)a.push(`${v}z`);return a;})();
function tL(t){const v=parseInt(t),s=t[t.length-1];if(s==="z")return v<=4?WINDS[v-1]:DRAGONS[v-5];return`${v}${SUITS[s]}`;}
function nxD(i){const v=parseInt(i),s=i[i.length-1];if(s==="z"){if(v<=4)return`${v%4+1}z`;return`${(v-5+1)%3+5}z`;}return`${v%9+1}${s}`;}
const isHon=t=>t[t.length-1]==="z";const isTrm=t=>{const v=parseInt(t);return t[t.length-1]!=="z"&&(v===1||v===9);};
const MAN_CH=["一","二","三","四","五","六","七","八","九"];
const PIN_P={1:[[.5,.45]],2:[[.5,.28],[.5,.68]],3:[[.5,.2],[.5,.48],[.5,.78]],4:[[.32,.28],[.68,.28],[.32,.7],[.68,.7]],5:[[.3,.22],[.7,.22],[.5,.48],[.3,.75],[.7,.75]],6:[[.32,.18],[.68,.18],[.32,.48],[.68,.48],[.32,.78],[.68,.78]],7:[[.32,.14],[.68,.14],[.32,.42],[.5,.42],[.68,.42],[.35,.72],[.65,.72]],8:[[.32,.13],[.68,.13],[.32,.35],[.68,.35],[.32,.58],[.68,.58],[.32,.8],[.68,.8]],9:[[.24,.18],[.5,.18],[.76,.18],[.24,.48],[.5,.48],[.76,.48],[.24,.78],[.5,.78],[.76,.78]]};
function rnSou(v,sm){const w=sm?20:32,h=sm?26:40;if(v===1)return{t1:true,w,h};const cols=v<=3?v:v<=6?3:v<=8?4:3,rows=Math.ceil(v/cols);const st=[];for(let i=0;i<v;i++){const col=i%cols,row=Math.floor(i/cols);const sw=sm?2.5:3.5;const gap=w/(cols+1);const rh=h/(rows+1);st.push({x:gap*(col+1)-sw/2,y:rh*(row+1)-((sm?8:12)/2),w:sw,h:sm?8:12});}return{st,w,h};}

/* ═══════ WIN ═══════ */
function canM(c,n){if(n===0)return true;const ks=Object.keys(c).filter(k=>c[k]>0).sort((a,b)=>tK(a)-tK(b));if(!ks.length)return false;const f=ks[0],v=parseInt(f),s=f[f.length-1];if(c[f]>=3){c[f]-=3;if(canM(c,n-1)){c[f]+=3;return true;}c[f]+=3;}if(s!=="z"&&v<=7){const t2=`${v+1}${s}`,t3=`${v+2}${s}`;if((c[t2]||0)>=1&&(c[t3]||0)>=1){c[f]--;c[t2]--;c[t3]--;if(canM(c,n-1)){c[f]++;c[t2]++;c[t3]++;return true;}c[f]++;c[t2]++;c[t3]++;}}return false;}
function isW(h,m=[]){const nm=4-m.length;if(h.length!==nm*3+2)return false;const c=cntT(h);for(const p of Object.keys(c)){if(c[p]<2)continue;const c2={...c};c2[p]-=2;if(c2[p]===0)delete c2[p];if(canM({...c2},nm))return true;}if(m.length===0&&h.length===14){const vs=Object.values(c);if(vs.length===7&&vs.every(v=>v===2))return true;const kt=["1m","9m","1p","9p","1s","9s","1z","2z","3z","4z","5z","6z","7z"];if(kt.every(t=>h.includes(t)))return true;}return false;}
function getW(h,m=[]){return A34.filter(t=>isW([...h,t],m));}
function isTP(h,m=[]){for(const t of A34)if(isW([...h,t],m))return true;return false;}
function fTP(h,m){const r=[];for(let i=0;i<h.length;i++){const h2=[...h];h2.splice(i,1);const w=getW(h2,m);if(w.length>0)r.push({idx:i,tile:h[i],wc:w.length});}r.sort((a,b)=>b.wc-a.wc);return r;}
function isFuri(hand,melds,disc){const w=getW(hand,melds);return w.length>0&&w.some(wt=>disc.includes(wt));}
function getSafe(ri,disc){const s=new Set();ri.forEach((r,i)=>{if(r)(disc[i]||[]).forEach(t=>s.add(t));});return s;}

/* ═══════ FU ═══════ */
function calcFu(h,oM,wt,isTsu,isCl){const c=cntT(h);if(isCl&&h.length===14&&Object.values(c).length===7&&Object.values(c).every(v=>v===2))return 25;let fu=isCl&&!isTsu?40:30;return Math.ceil(fu/10)*10;}

/* ═══════ YAKU ═══════ */
function exM(h){const res=[];const c=cntT(h);function f(ct,sets,n){if(n===0){res.push(sets.map(s=>({...s})));return;}const ks=Object.keys(ct).filter(k=>ct[k]>0).sort((a,b)=>tK(a)-tK(b));if(!ks.length)return;const fi=ks[0],v=parseInt(fi),s=fi[fi.length-1];if(ct[fi]>=3){ct[fi]-=3;f(ct,[...sets,{tp:"k",ts:[fi,fi,fi]}],n-1);ct[fi]+=3;}if(s!=="z"&&v<=7){const t2=`${v+1}${s}`,t3=`${v+2}${s}`;if((ct[t2]||0)>=1&&(ct[t3]||0)>=1){ct[fi]--;ct[t2]--;ct[t3]--;f(ct,[...sets,{tp:"s",ts:[fi,t2,t3]}],n-1);ct[fi]++;ct[t2]++;ct[t3]++;}}}const nm=Math.floor((h.length-2)/3);for(const p of Object.keys(c)){if(c[p]<2)continue;const c2={...c};c2[p]-=2;if(c2[p]===0)delete c2[p];const b=res.length;f({...c2},[],nm);for(let i=b;i<res.length;i++)res[i]={pair:p,melds:res[i]};}return res;}
function calcY(h,oM,wt,isTsu,isRi,sw,rw,dora,isIp){const y=[],cl=oM.length===0,c=cntT(h),aT=[...h,...oM.flatMap(m=>m.tiles)];if(cl&&h.length===14&&Object.values(c).length===7&&Object.values(c).every(v=>v===2)){y.push({n:"chiitoitsu",h:2});if(isRi)y.push({n:"riichi",h:1});if(isIp)y.push({n:"ippatsu",h:1});if(isTsu)y.push({n:"tsumo",h:1});if(h.every(t=>!isHon(t)&&!isTrm(t)))y.push({n:"tanyao",h:1});const ns=new Set(h.map(t=>t[t.length-1]).filter(s=>s!=="z"));if(ns.size===1)y.push({n:h.some(isHon)?"honitsu":"chinitsu",h:h.some(isHon)?3:6});let dc=0;for(const t of h)for(const d of dora)if(t===d)dc++;if(dc)y.push({n:"dora",h:dc});return y;}
  const kt=["1m","9m","1p","9p","1s","9s","1z","2z","3z","4z","5z","6z","7z"];if(cl&&h.length===14&&kt.every(t=>h.includes(t))){y.push({n:"kokushi",h:13});return y;}
  const decs=exM(h);if(!decs.length)return y;let bY=[],bH=0;
  for(const dec of decs){const yy=[];const aM=[...dec.melds,...oM.map(m=>({tp:m.type==="pon"?"k":"s",ts:m.tiles}))];const sh=aM.filter(m=>m.tp==="s"),ko=aM.filter(m=>m.tp==="k");const closedK=dec.melds.filter(m=>m.tp==="k").length;
    if(cl&&closedK===4)yy.push({n:"suuankou",h:13});if([5,6,7].filter(v=>ko.some(m=>m.ts[0]===`${v}z`)).length===3)yy.push({n:"daisangen",h:13});const wK=[1,2,3,4].filter(v=>ko.some(m=>m.ts[0]===`${v}z`));if(wK.length===4)yy.push({n:"daisuushii",h:13});if(wK.length===3&&parseInt(dec.pair)<=4&&dec.pair[dec.pair.length-1]==="z")yy.push({n:"shousuushii",h:13});if(aT.every(isHon))yy.push({n:"tsuuiisou",h:13});if(aT.every(isTrm))yy.push({n:"chinroutou",h:13});
    if(!yy.some(y2=>y2.h>=13)){if(isRi)yy.push({n:"riichi",h:1});if(isIp)yy.push({n:"ippatsu",h:1});if(isTsu&&cl)yy.push({n:"tsumo",h:1});if(cl&&sh.length===4){const pv=parseInt(dec.pair),ps=dec.pair[dec.pair.length-1];if(!(ps==="z"&&(pv>=5||pv===sw||pv===rw)))yy.push({n:"pinfu",h:1});}if(aT.every(t=>!isHon(t)&&!isTrm(t)))yy.push({n:"tanyao",h:1});for(const m of ko){const t=m.ts[0],vv=parseInt(t),ss=t[t.length-1];if(ss==="z"){if(vv>=5)yy.push({n:"yakuhai",h:1});if(vv<=4&&vv===sw)yy.push({n:"fanpai_wind",h:1});if(vv<=4&&vv===rw&&vv!==sw)yy.push({n:"fanpai_wind",h:1});}}if(ko.length>=4)yy.push({n:"toitoi",h:2});if(closedK>=3&&!cl)yy.push({n:"sanankou",h:2});if(cl){const sk=sh.map(m=>m.ts.join(","));const dp=sk.filter((k,i)=>sk.indexOf(k)!==i).length;if(dp>=2)yy.push({n:"ryanpeikou",h:3});else if(dp>=1)yy.push({n:"iipeikou",h:1});}const ns=new Set(aT.map(t=>t[t.length-1]).filter(s=>s!=="z"));if(ns.size===1)yy.push({n:aT.some(isHon)?"honitsu":"chinitsu",h:cl?(aT.some(isHon)?3:6):(aT.some(isHon)?2:5)});for(const s of["m","p","s"]){if(sh.some(m=>m.ts[0]===`1${s}`)&&sh.some(m=>m.ts[0]===`4${s}`)&&sh.some(m=>m.ts[0]===`7${s}`))yy.push({n:"ittsu",h:cl?2:1});}for(let v=1;v<=7;v++){if(["m","p","s"].every(s=>sh.some(m=>m.ts[0]===`${v}${s}`))){yy.push({n:"sanshoku",h:cl?2:1});break;}}}
    let dc=0;for(const t of aT)for(const d of dora)if(t===d)dc++;if(dc)yy.push({n:"dora",h:dc});const th=yy.reduce((s,y2)=>s+y2.h,0);if(th>bH){bH=th;bY=yy;}}return bY;}
function calcPts(han,fu,isDl,isTsu){if(han<=0)return 0;let b;if(han>=13)b=8000;else if(han>=11)b=6000;else if(han>=8)b=4000;else if(han>=6)b=3000;else if(han>=5)b=2000;else b=Math.min(2000,fu*Math.pow(2,han+2));return Math.ceil(b*(isDl?6:4)/100)*100;}

/* ═══════ BOT ═══════ */
function canPon(h,t){return h.filter(x=>x===t).length>=2;}
function canCKan(h){const c=cntT(h);return Object.keys(c).filter(k=>c[k]===4);}
function canChi(h,t){const v=parseInt(t),s=t[t.length-1];if(s==="z")return[];const r=[],has=tv=>h.includes(`${tv}${s}`);if(v>=3&&has(v-2)&&has(v-1))r.push([`${v-2}${s}`,`${v-1}${s}`,t]);if(v>=2&&v<=8&&has(v-1)&&has(v+1))r.push([`${v-1}${s}`,t,`${v+1}${s}`]);if(v<=7&&has(v+1)&&has(v+2))r.push([t,`${v+1}${s}`,`${v+2}${s}`]);return r;}
function botD(h,m){const tp=fTP(h,m);if(tp.length>0)return tp[0].idx;let bi=0,bs=-999;for(let i=0;i<h.length;i++){let sc=0;const t=h[i],v=parseInt(t),s=t[t.length-1],cn=h.filter(x=>x===t).length;if(cn>=3)sc-=60;if(cn===2)sc-=25;if(s==="z"&&cn===1)sc+=20;if(s!=="z"&&(v===1||v===9)&&cn===1)sc+=8;if(s!=="z"){const h2=[...h];h2.splice(i,1);for(const o of h2)if(o[o.length-1]===s&&Math.abs(parseInt(o)-v)<=2)sc-=10;}if(s!=="z"&&v>=2&&v<=8)sc-=5;if(sc>bs){bs=sc;bi=i;}}return bi;}
function botPon(h,m,t){let rm=0;const h2=h.filter(x=>{if(x===t&&rm<2){rm++;return false;}return true;});const nm=[...m,{type:"pon",tiles:[t,t,t]}];for(let i=0;i<h2.length;i++){const h3=[...h2];h3.splice(i,1);if(isTP(h3,nm))return true;}return m.length>=1&&Math.random()<0.35;}
function getAdv(h,m,dl){if(!h||h.length<2)return null;const r=[];for(let i=0;i<h.length;i++){const t=h[i],h2=[...h];h2.splice(i,1);const w=getW(h2,m),tp=w.length>0;const v=parseInt(t),s=t[t.length-1],cn=h.filter(x=>x===t).length;let sc=0;if(tp)sc+=1000+w.length*50;if(s==="z"&&cn===1)sc+=20;if(s!=="z"&&(v===1||v===9)&&cn===1)sc+=10;if(cn>=2)sc-=30;if(cn>=3)sc-=80;if(dl.includes(t))sc-=100;if(s!=="z"){let c2=0;for(const o of h2)if(o[o.length-1]===s&&Math.abs(parseInt(o)-v)<=2)c2++;sc-=c2*8;}r.push({tile:t,idx:i,sc,tp,wc:w.length});}r.sort((a,b)=>b.sc-a.sc);const b=r[0];return{...b,reason:b.tp?`텐파이! ${b.wc}종 대기`:(b.tile[b.tile.length-1]==="z"?"고립 자패 정리":"연결 적은 패 정리")};}

/* ═══════ GUIDE ═══════ */
const GD=[{t:"마작 기초",i:"🌸",c:"4멘쯔+1또이쯔=화료!\n반장전: 동장4국+남장4국\n\n⚠️후리텐: 대기패를 버렸으면\n론 불가 (쯔모만 가능)"},{t:"점수 & 안전패",i:"📊",c:"점수 = 부(符) × 판수(翻)\n🛡️안전패: 리치자가 버린 패 = 현물\n파란 테두리로 표시됩니다\n💎리치봉: 탁 위에 막대로 표시"},{t:"역 & 역만",i:"📜",c:"1판: 리치,쯔모,탕야오,핑후,역패\n2판: 치또이,또이또이,찬타\n3판: 혼이쯔  6판: 친이쯔\n역만: 국사무쌍,사암각,대삼원 등"},{t:"조작법",i:"🎮",c:"패 클릭→선택→버리기\n⭐추천 / 🛡️안전패(파랑) / 🎯대기\n🐱고양이 어드바이저\n🔊효과음+🗣️음성 토글"}];

/* ═══════ STATE ═══════ */
const INIT_H={wall:[],dw:[],hands:[[],[],[],[]],disc:[[],[],[],[]],melds:[[],[],[],[]],cur:0,phase:"waiting",drawn:null,winner:null,lastD:null,lastDB:-1,callO:null,chiC:[],msg:"",sel:-1,turns:0,ri:[false,false,false,false],riT:[-1,-1,-1,-1],ip:[false,false,false,false],wY:[],wP:0,wFu:30};
const INIT_G={...INIT_H,pts:[25000,25000,25000,25000],doraI:[],roundWind:1,roundNum:1,dealer:0,honba:0,riichiPool:0,phase:"menu"};

export default function Mahjong(){
  const[G,setG]=useState(INIT_G);const[bm,setBm]=useState(true);const[sfxOn,setSfx]=useState(true);const[voiceOn,setVoice]=useState(!isSafari);
  const[showG,setShowG]=useState(false);const[gP,setGP]=useState(0);const tmr=useRef(null);
  const fx=useCallback(n=>{if(sfxOn&&SFX[n])SFX[n]();},[sfxOn]);const say=useCallback(t=>{if(voiceOn)speak(t);},[voiceOn]);
  const dL=useMemo(()=>G.doraI.map(nxD),[G.doraI]);const pH=G.hands[0]||[];
  const rLbl=`${G.roundWind===1?"東":"南"}${G.roundNum}局${G.honba>0?` ${G.honba}본장`:""}`;

  const startGame=useCallback(()=>{
    const dk=shuf(mkD()),dw=dk.splice(0,14),h=[[],[],[],[]];for(let i=0;i<4;i++)h[i]=srt(dk.splice(0,13));
    setG({...INIT_H,wall:dk,dw,hands:h,doraI:[dw[0]],phase:"drawing",cur:0,pts:[25000,25000,25000,25000],roundWind:1,roundNum:1,dealer:0,honba:0,riichiPool:0});fx("start");say("동1국!");
  },[fx,say]);

  const nextRound=useCallback(()=>{setG(prev=>{
    let{roundWind:rw,roundNum:rn,dealer:dl,honba:hb,riichiPool:rp,pts,winner}=prev;const p=[...pts];
    if(winner===dl||winner===-1)hb++;else{dl=(dl+1)%4;if(dl===0){rn++;if(rn>4){rw++;rn=1;}}hb=0;}
    if(winner>=0){p[winner]+=rp*1000;rp=0;}
    if(rw>2||p.some(x=>x<0))return{...prev,phase:"gameEnd"};
    const dk=shuf(mkD()),dw=dk.splice(0,14),h=[[],[],[],[]];for(let i=0;i<4;i++)h[i]=srt(dk.splice(0,13));
    say(`${rw===1?"동":"남"}${rn}국!`);
    return{...INIT_H,wall:dk,dw,hands:h,doraI:[dw[0]],phase:"drawing",cur:dl,pts:p,roundWind:rw,roundNum:rn,dealer:dl,honba:hb,riichiPool:rp};
  });},[say]);

  /* Discard processing */
  function procDisc(g,c,t){
    g.disc[c].push(t);g.drawn=null;g.lastD=t;g.lastDB=c;g.sel=-1;
    const dl=g.doraI.map(nxD);
    for(let i=0;i<4;i++){if(i===c)continue;if(isW([...g.hands[i],t],g.melds[i])){
      if(isFuri(g.hands[i],g.melds[i],g.disc[i]))continue;
      const sw=(i-g.dealer+4)%4+1;const yk=calcY([...g.hands[i],t],g.melds[i],t,false,g.ri[i],sw,g.roundWind,dl,g.ip[i]);
      if(yk.length>0){const han=yk.reduce((s,y)=>s+y.h,0);const fu=calcFu([...g.hands[i],t],g.melds[i],t,false,true);const pt=calcPts(han,fu,i===g.dealer,false);
        if(i===0)return{...g,callO:{ron:[0],pon:[],chi:false},phase:"callPhase",msg:"론 가능!",_ev:"ronAvail"};
        g.pts=[...g.pts];g.pts[i]+=pt+g.honba*300;g.pts[c]-=pt+g.honba*300;
        return{...g,phase:"gameOver",winner:i,msg:`${PN[i]}의 론!`,wY:yk,wP:pt,wFu:fu,_ev:yk.some(y=>y.h>=13)?"yakuman":"botRon"};}}}
    const calls={ron:[],pon:[],chi:false};let hc=false;
    if(c!==0&&!g.ri[0]){if(canPon(g.hands[0],t)){calls.pon.push(0);hc=true;}}
    const nxt=(c+1)%4;if(nxt===0&&!g.ri[0]){const cc=canChi(g.hands[0],t);if(cc.length>0){calls.chi=true;g.chiC=cc;hc=true;}}
    if(hc){const ms=[];if(calls.pon.length)ms.push("퐁");if(calls.chi)ms.push("치");return{...g,callO:calls,phase:"callPhase",msg:`${ms.join("/")} 가능!`,_ev:"callAvail"};}
    for(let i=1;i<4;i++){if(i===c||g.ri[i])continue;if(canPon(g.hands[i],t)&&botPon(g.hands[i],g.melds[i],t)){let rm=0;g.hands[i]=g.hands[i].filter(x=>{if(x===t&&rm<2){rm++;return false;}return true;});g.melds[i]=[...g.melds[i],{type:"pon",tiles:[t,t,t],from:c}];g.disc[c].pop();return{...g,cur:i,phase:"botPon",_ev:"botPon"};}}
    return{...g,cur:nxt,phase:"drawing",msg:""};
  }

  /* Effects */
  useEffect(()=>{if(G.phase==="drawing"){tmr.current=setTimeout(()=>{setG(prev=>{
    const g={...prev,hands:prev.hands.map(h=>[...h]),wall:[...prev.wall]};
    if(g.wall.length===0)return{...g,phase:"gameOver",winner:-1,msg:"유국",_ev:"draw"};
    const t=g.wall.pop();g.hands[g.cur].push(t);g.drawn=t;g.turns++;const dl=g.doraI.map(nxD);const sw=(g.cur-g.dealer+4)%4+1;
    if(isW(g.hands[g.cur],g.melds[g.cur])){
      if(g.cur===0)return{...g,phase:"canTsumo",msg:"쯔모 가능!",_ev:"canTsumo"};
      const yk=calcY(g.hands[g.cur],g.melds[g.cur],t,true,g.ri[g.cur],sw,g.roundWind,dl,g.ip[g.cur]);
      if(yk.length>0){const han=yk.reduce((s,y)=>s+y.h,0);const fu=calcFu(g.hands[g.cur],g.melds[g.cur],t,true,g.melds[g.cur].length===0);const pt=calcPts(han,fu,g.cur===g.dealer,true);g.pts=[...g.pts];g.pts[g.cur]+=pt+g.honba*300;for(let i=0;i<4;i++)if(i!==g.cur)g.pts[i]-=Math.ceil((pt+g.honba*300)/3);
        return{...g,phase:"gameOver",winner:g.cur,msg:`${PN[g.cur]}의 쯔모!`,wY:yk,wP:pt,wFu:fu,_ev:yk.some(y=>y.h>=13)?"yakuman":"botTsumo"};}}
    return g.cur===0?{...g,phase:"discarding",msg:""}:{...g,phase:"botTurn"};});},G.cur===0?60:300);return()=>clearTimeout(tmr.current);}
  },[G.phase,G.cur]); // eslint-disable-line
  useEffect(()=>{if(G.phase==="botTurn"&&G.cur!==0){tmr.current=setTimeout(()=>setG(prev=>{
    const g={...prev,hands:prev.hands.map(h=>[...h]),disc:prev.disc.map(d=>[...d]),melds:prev.melds.map(m=>[...m]),ri:[...prev.ri],riT:[...prev.riT],ip:[...prev.ip],pts:[...prev.pts]};
    const c=g.cur,h=g.hands[c],m=g.melds[c];const tp=fTP(h,m);
    if(!g.ri[c]&&m.length===0&&g.pts[c]>=1000&&tp.length>0){g.ri[c]=true;g.riT[c]=g.turns;g.ip[c]=true;g.pts[c]-=1000;g.riichiPool=(g.riichiPool||0)+1;g._ev="riichi";}
    const idx=tp.length>0?tp[0].idx:botD(h,m);if(idx<0||idx>=h.length)return prev;
    const t=g.hands[c].splice(idx,1)[0];g.hands[c]=srt(g.hands[c]);return procDisc(g,c,t);
  }),400);return()=>clearTimeout(tmr.current);}
  },[G.phase,G.cur]); // eslint-disable-line
  useEffect(()=>{if(G.phase==="botPon"&&G.cur!==0){tmr.current=setTimeout(()=>setG(prev=>{
    const g={...prev,hands:prev.hands.map(h=>[...h]),disc:prev.disc.map(d=>[...d]),melds:prev.melds.map(m=>[...m]),ri:[...prev.ri],ip:[...prev.ip],pts:[...prev.pts]};
    const c=g.cur,idx=botD(g.hands[c],g.melds[c]);if(idx<0||idx>=g.hands[c].length)return prev;
    const t=g.hands[c].splice(idx,1)[0];g.hands[c]=srt(g.hands[c]);return procDisc(g,c,t);
  }),500);return()=>clearTimeout(tmr.current);}
  },[G.phase,G.cur]); // eslint-disable-line
  useEffect(()=>{const e=G._ev;if(!e)return;if(e==="botTsumo"){fx("tsumo");say(`${PN[G.winner||G.cur]} 쯔모!`);}if(e==="botRon"){fx("ron");say(`${PN[G.winner||0]} 론!`);}if(e==="botPon"){fx("pon");say("퐁!");}if(e==="riichi"){fx("riichi");say(`${PN[G.cur]} 리치!`);}if(e==="canTsumo"){fx("call");say("쯔모 가능!");}if(e==="callAvail")fx("call");if(e==="ronAvail"){fx("call");say("론 가능!");}if(e==="draw"){fx("lose");say("유국");}if(e==="yakuman"){fx("yakuman");say("역만!");}setG(p=>({...p,_ev:undefined}));},[G._ev]); // eslint-disable-line

  /* Player actions */
  const act={
    sel:i=>{fx("tap");setG(p=>({...p,sel:p.sel===i?-1:i}));},
    discard:()=>{if(G.phase!=="discarding"||G.sel<0)return;fx("discard");setG(prev=>{const g={...prev,hands:prev.hands.map(h=>[...h]),disc:prev.disc.map(d=>[...d]),melds:prev.melds.map(m=>[...m]),ri:[...prev.ri],ip:[...prev.ip],pts:[...prev.pts]};const t=g.hands[0].splice(g.sel,1)[0];g.hands[0]=srt(g.hands[0]);return procDisc(g,0,t);});},
    tsumo:()=>{fx("tsumo");say("쯔모!");setG(p=>{const h=p.hands[0],wt=h[h.length-1],dl=p.doraI.map(nxD),sw=(0-p.dealer+4)%4+1;const yk=calcY(h,p.melds[0],wt,true,p.ri[0],sw,p.roundWind,dl,p.ip[0]);const han=yk.reduce((s,y)=>s+y.h,0);const fu=calcFu(h,p.melds[0],wt,true,p.melds[0].length===0);const pt=calcPts(han,fu,0===p.dealer,true);const pts=[...p.pts];pts[0]+=pt+p.honba*300;for(let i=1;i<4;i++)pts[i]-=Math.ceil((pt+p.honba*300)/3);return{...p,phase:"gameOver",winner:0,msg:"나의 쯔모!",wY:yk,wP:pt,wFu:fu,pts};});},
    ron:()=>{fx("ron");say("론!");setG(p=>{const dl=p.doraI.map(nxD),sw=(0-p.dealer+4)%4+1;const yk=calcY([...p.hands[0],p.lastD],p.melds[0],p.lastD,false,p.ri[0],sw,p.roundWind,dl,p.ip[0]);const han=yk.reduce((s,y)=>s+y.h,0);const fu=calcFu([...p.hands[0],p.lastD],p.melds[0],p.lastD,false,true);const pt=calcPts(han,fu,0===p.dealer,false);const pts=[...p.pts];pts[0]+=pt+p.honba*300;pts[p.lastDB]-=pt+p.honba*300;return{...p,phase:"gameOver",winner:0,msg:"나의 론!",wY:yk,wP:pt,wFu:fu,pts};});},
    pon:()=>{fx("pon");say("퐁!");setG(p=>{const t=p.lastD,nh=p.hands.map(h=>[...h]),nm=p.melds.map(m=>[...m]),nd=p.disc.map(d=>[...d]);nd[p.lastDB].pop();let rm=0;nh[0]=nh[0].filter(x=>{if(x===t&&rm<2){rm++;return false;}return true;});nm[0]=[...nm[0],{type:"pon",tiles:[t,t,t],from:p.lastDB}];return{...p,hands:nh,melds:nm,disc:nd,callO:null,cur:0,phase:"discarding",drawn:null,msg:"퐁!"};});},
    chi:combo=>{fx("chi");say("치!");setG(p=>{const t=p.lastD,nh=p.hands.map(h=>[...h]),nm=p.melds.map(m=>[...m]),nd=p.disc.map(d=>[...d]);nd[p.lastDB].pop();for(const ct of combo){if(ct===t)continue;const i=nh[0].indexOf(ct);if(i>=0)nh[0].splice(i,1);}nm[0]=[...nm[0],{type:"chi",tiles:srt(combo),from:p.lastDB}];return{...p,hands:nh,melds:nm,disc:nd,callO:null,chiC:[],cur:0,phase:"discarding",drawn:null,msg:"치!"};});},
    skip:()=>{fx("tap");setG(p=>({...p,callO:null,chiC:[],cur:(p.lastDB+1)%4,phase:"drawing",msg:""}));},
    skipT:()=>{fx("tap");setG(p=>({...p,phase:"discarding",msg:""}));},
    ri:()=>{fx("riichi");say("리치!");setG(p=>{const ri=[...p.ri],riT=[...p.riT],ip=[...p.ip],pts=[...p.pts];ri[0]=true;riT[0]=p.turns;ip[0]=true;pts[0]-=1000;return{...p,ri,riT,ip,pts,msg:"리치!",riichiPool:(p.riichiPool||0)+1};});},
    kan:tile=>{fx("kan");say("깡!");setG(p=>{const nh=p.hands.map(h=>[...h]),nm=p.melds.map(m=>[...m]),dw=[...p.dw],di=[...p.doraI];let rm=0;nh[0]=nh[0].filter(t=>{if(t===tile&&rm<4){rm++;return false;}return true;});nm[0]=[...nm[0],{type:"kan",tiles:[tile,tile,tile,tile],closed:true}];if(dw.length>di.length)di.push(dw[di.length]);let dr=null;if(dw.length>0){dr=dw.pop();nh[0].push(dr);}const w=dr&&isW(nh[0],nm[0]);return{...p,hands:nh,melds:nm,dw,doraI:di,drawn:dr,phase:w?"canTsumo":"discarding",msg:w?"쯔모 가능!":"깡!"};});},
  };

  /* Computed */
  const adv=useMemo(()=>bm&&G.phase==="discarding"?getAdv(pH,G.melds[0],dL):null,[bm,G.phase,pH,G.melds,dL]);
  const myW=useMemo(()=>{if(pH.length%3===2)return getW(pH.slice(0,-1),G.melds[0]);return pH.length%3===1?getW(pH,G.melds[0]):[];},[pH,G.melds]);
  const riOK=useMemo(()=>G.phase==="discarding"&&!G.ri[0]&&G.melds[0].length===0&&G.pts[0]>=1000&&pH.length>=14&&fTP(pH,G.melds[0]).length>0,[G.phase,G.ri,G.melds,G.pts,pH]);
  const ckT=G.phase==="discarding"&&!G.ri[0]?canCKan(pH):[];
  const myFuri=useMemo(()=>isFuri(pH.length%3===2?pH.slice(0,-1):pH,G.melds[0],G.disc[0]),[pH,G.melds,G.disc]);
  const safe=useMemo(()=>getSafe(G.ri,G.disc),[G.ri,G.disc]);

  /* UI */
  const C={bg:"#f5efe5",pk:"#d94060",mt:"#2d8a5e",gd:"#d4960a",lv:"#8068a8",br:"#4a3e32",lb:"#8a7e72",bl:"#3a7cc4",bd:"#d8d0c4"};const font="'Nunito','Noto Sans KR',sans-serif";
  const Tile=({tile,fd,sm,rot,onClick,sl,hl,glow,star,sf})=>{const v=fd?0:parseInt(tile),s=fd?"":tile[tile.length-1];const w=sm?25:40,h=sm?35:56;
    const face=()=>{if(fd)return null;if(s==="m"){const fs=sm?11:18,fs2=sm?7:11;return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",lineHeight:1}}><span style={{fontSize:fs,fontWeight:900,color:"#1a1a1a",fontFamily:"serif"}}>{MAN_CH[v-1]}</span><span style={{fontSize:fs2,fontWeight:900,color:"#c44040",fontFamily:"serif"}}>萬</span></div>);}if(s==="p"){const pw=sm?20:32,ph=sm?26:40,r=sm?2.8:4.2;return(<svg viewBox={`0 0 ${pw} ${ph}`} width={pw} height={ph} style={{display:"block"}}>{PIN_P[v].map(([x,y],i)=>(<g key={i}><circle cx={x*pw} cy={y*ph} r={r} fill="none" stroke="#2a6cb4" strokeWidth={r*0.7}/><circle cx={x*pw} cy={y*ph} r={r*0.45} fill="#c44040"/></g>))}</svg>);}if(s==="s"){const d=rnSou(v,sm);if(d.t1)return(<svg viewBox={`0 0 ${d.w} ${d.h}`} width={d.w} height={d.h}><rect x={d.w*0.35} y={d.h*0.1} width={d.w*0.3} height={d.h*0.5} rx={d.w*0.15} fill="#2d8a5e"/><circle cx={d.w*0.5} cy={d.h*0.75} r={sm?3:5} fill="#c44040"/></svg>);return(<svg viewBox={`0 0 ${d.w} ${d.h}`} width={d.w} height={d.h}>{d.st.map((st,i)=>(<rect key={i} x={st.x} y={st.y} width={st.w} height={st.h} rx={1} fill={i%2===0?"#2d8a5e":"#3aaa6e"}/>))}</svg>);}if(s==="z"){if(v<=4)return(<span style={{fontSize:sm?14:22,fontWeight:900,color:"#3a3a3a",fontFamily:"serif",lineHeight:1}}>{WINDS[v-1]}</span>);if(v===5)return(<div style={{background:"#fff",border:`${sm?1.5:2}px solid #888`,borderRadius:sm?2:3,width:sm?16:26,height:sm?18:28,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:sm?9:14,color:"#aaa",fontWeight:700}}>白</span></div>);if(v===6)return(<span style={{fontSize:sm?14:22,fontWeight:900,color:"#1a7a40",fontFamily:"serif",lineHeight:1}}>發</span>);if(v===7)return(<span style={{fontSize:sm?14:22,fontWeight:900,color:"#d03040",fontFamily:"serif",lineHeight:1}}>中</span>);}return null;};
    return(<div onClick={onClick} style={{width:rot?h:w,height:rot?w:h,background:fd?"linear-gradient(145deg,#ccc4b8,#b8b0a4)":"linear-gradient(145deg,#fffefc,#f0ebe4)",border:hl?`2px solid ${C.pk}`:sl?`2px solid ${C.gd}`:sf?`2px solid ${C.bl}`:glow?`2px solid ${C.mt}`:star?`2px solid ${C.gd}`:"1px solid #c8c0b4",borderRadius:sm?3:5,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:onClick?"pointer":"default",boxShadow:sl?"0 -5px 14px rgba(212,150,10,0.2)":sf?"0 0 6px rgba(58,124,196,0.2)":star?"0 0 10px rgba(212,150,10,0.25)":glow?"0 0 8px rgba(45,138,94,0.3)":"0 1px 3px rgba(0,0,0,0.08)",transform:sl?"translateY(-10px)":star?"translateY(-3px)":"none",transition:"all 0.15s",flexShrink:0,position:"relative",overflow:"hidden"}}>{face()}{star&&<div style={{position:"absolute",top:-8,right:-6,fontSize:14,animation:"bounce 1s infinite"}}>⭐</div>}{sf&&!sl&&<div style={{position:"absolute",top:0,left:0,fontSize:sm?6:8,background:C.bl,color:"#fff",borderRadius:"0 0 3px 0",padding:"0 2px",lineHeight:1.2}}>🛡</div>}{glow&&!star&&<div style={{position:"absolute",top:-3,right:-3,width:7,height:7,borderRadius:"50%",background:C.mt,border:"1.5px solid #fff"}}/>}</div>);};
  const MD=({m,sm})=>(<div style={{display:"flex",gap:1,padding:"2px 3px",background:"rgba(255,252,245,0.6)",borderRadius:5,border:"1px solid #e0d8cc"}}>{m.tiles.map((t,i)=><Tile key={i} tile={t} sm={sm}/>)}{m.closed&&<span style={{fontSize:7,color:C.lb,alignSelf:"center"}}>暗</span>}</div>);
  const Bub=({text,type})=>{if(!text)return null;const bg={tip:"#fdf8eb",good:"#ecf7f0",warn:"#fdf0f2"}[type]||"#fdf8eb";return(<div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 12px",background:bg,border:`1.5px solid ${type==="good"?"#a8d8b8":type==="warn"?"#e8a0b0":"#e8d4a0"}`,borderRadius:14,maxWidth:380,margin:"3px auto",animation:"fadeIn 0.3s"}}><span style={{fontSize:20,flexShrink:0}}>🐱</span><div style={{fontSize:11,color:C.br,lineHeight:1.5,fontWeight:600}}>{text}</div></div>);};
  const Tog=({on,fn,lb})=>(<div onClick={fn} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",userSelect:"none"}}><div style={{width:32,height:18,borderRadius:9,background:on?"linear-gradient(135deg,#d4960a,#c08008)":"#c8c0b4",padding:2,transition:"all 0.2s"}}><div style={{width:14,height:14,borderRadius:7,background:"#fff",transform:on?"translateX(14px)":"",transition:"transform 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div><span style={{fontSize:10,fontWeight:700,color:on?"#c08008":C.lb}}>{lb}</span></div>);
  const Btn=({ch,bg,onClick,pu})=>(<button onClick={onClick} style={{padding:"7px 18px",fontSize:12,fontWeight:800,color:"#fff",background:bg,border:"none",borderRadius:20,cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.1)",animation:pu?"pulse 1.2s infinite":"none"}}>{ch}</button>);
  const Btn2=({ch,onClick})=>(<button onClick={onClick} style={{padding:"7px 16px",fontSize:12,fontWeight:700,color:C.lb,background:"rgba(255,255,255,0.7)",border:`1px solid ${C.bd}`,borderRadius:20,cursor:"pointer"}}>{ch}</button>);
  const link=<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet"/>;
  const css=<style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}`}</style>;
  const GM=()=>(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={()=>setShowG(false)}><div onClick={e=>e.stopPropagation()} style={{background:"#faf5ed",borderRadius:24,padding:"24px 28px",maxWidth:400,width:"90%",maxHeight:"80vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",border:`2px solid ${C.gd}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontSize:16,fontWeight:900,color:C.br}}>{GD[gP].i} {GD[gP].t}</span><button onClick={()=>setShowG(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.lb}}>✕</button></div><div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.8,color:C.br,background:"rgba(255,255,255,0.6)",borderRadius:14,padding:16}}>{GD[gP].c}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:14}}><button onClick={()=>setGP(Math.max(0,gP-1))} disabled={gP===0} style={{padding:"7px 16px",borderRadius:18,border:"none",background:gP===0?"#ddd":C.mt,color:gP===0?"#bbb":"#fff",fontWeight:700,cursor:gP>0?"pointer":"default"}}>←</button><span style={{fontSize:12,color:C.lb}}>{gP+1}/{GD.length}</span><button onClick={()=>setGP(Math.min(GD.length-1,gP+1))} disabled={gP>=GD.length-1} style={{padding:"7px 16px",borderRadius:18,border:"none",background:gP>=GD.length-1?"#ddd":C.pk,color:gP>=GD.length-1?"#bbb":"#fff",fontWeight:700,cursor:gP<GD.length-1?"pointer":"default"}}>→</button></div></div></div>);

  /* MENU */
  if(G.phase==="menu")return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse at 30% 20%,#fdf8f0,${C.bg})`,fontFamily:font,gap:18,padding:20}}>{link}<div style={{letterSpacing:6,color:C.lb,fontWeight:700,fontSize:12}}>✿ KN MAHJONG ✿</div><div style={{display:"flex",gap:8}}>{["🀄","🀅","🀇","🀙"].map((e,i)=>(<div key={i} style={{width:52,height:70,background:"linear-gradient(145deg,#fff,#f0ebe4)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",transform:`rotate(${(i-1.5)*7}deg)`,border:"1px solid #d0c8bc"}}>{e}</div>))}</div><div style={{fontSize:46,fontWeight:900,color:C.br,letterSpacing:8}}>麻雀</div><div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}><Tog on={bm} fn={()=>setBm(!bm)} lb="🐣 초보자"/><Tog on={sfxOn} fn={()=>setSfx(!sfxOn)} lb="🔊 효과음"/>{!isSafari&&<Tog on={voiceOn} fn={()=>setVoice(!voiceOn)} lb="🗣️ 음성"/>}</div><div style={{fontSize:11,color:C.lb,textAlign:"center",lineHeight:1.6}}>반장전 · 후리텐 · 부계산 · 안전패 · 리치봉</div><button onClick={startGame} style={{padding:"14px 48px",fontSize:17,fontWeight:900,color:"#fff",background:"linear-gradient(135deg,#d94060,#b83048)",border:"none",borderRadius:50,cursor:"pointer",boxShadow:"0 4px 20px rgba(217,64,96,0.3)",letterSpacing:2}}>게임 시작 🎮</button><button onClick={()=>{setShowG(true);setGP(0);}} style={{padding:"10px 24px",fontSize:14,fontWeight:700,color:C.br,background:"rgba(255,255,255,0.6)",border:`2px solid ${C.gd}`,borderRadius:50,cursor:"pointer"}}>📖 가이드</button>{showG&&<GM/>}{css}</div>);

  /* GAME OVER / ROUND END */
  if(G.phase==="gameOver"||(G.phase==="draw"&&G.winner===-1)||G.phase==="gameEnd"){const isYM=G.wY.some(y=>y.h>=13);const isEnd=G.phase==="gameEnd"||(G.roundWind===2&&G.roundNum===4&&G.winner!==G.dealer);const rank=[...G.pts].map((p,i)=>({p,i})).sort((a,b)=>b.p-a.p);
    return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse,#fdf8f0,${C.bg})`,fontFamily:font,gap:10,padding:20}}>{link}
      <div style={{fontSize:11,color:C.lb,fontWeight:700}}>{rLbl}</div>
      <div style={{fontSize:38,fontWeight:900,color:G.winner===0?(isYM?"#b83048":C.gd):G.winner===-1?C.lb:C.pk}}>{G.winner===0?(isYM?"🎆 역만!":"🎉 화료!"):G.winner===-1?"😢 유국":"😿 패배"}</div>
      <div style={{fontSize:14,color:C.br,fontWeight:700}}>{G.msg}</div>
      {G.winner>=0&&G.wY.length>0&&(<div style={{background:"rgba(255,255,255,0.7)",borderRadius:14,padding:12,maxWidth:320,width:"90%"}}>{G.wY.map((y,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #ece4d8",fontSize:13}}><span style={{color:C.br}}>{YN[y.n]||y.n}</span><span style={{fontWeight:900,color:y.h>=13?"#b83048":C.pk}}>{y.h>=13?"역만":y.h+"판"}</span></div>))}<div style={{display:"flex",justifyContent:"space-between",paddingTop:5,fontSize:13}}><span style={{fontWeight:800,color:C.br}}>{G.wFu}부 {G.wY.reduce((s,y)=>s+y.h,0)}판</span><span style={{fontWeight:900,color:"#b83048"}}>{G.wP}점</span></div></div>)}
      <div style={{background:"rgba(255,255,255,0.5)",borderRadius:10,padding:8,maxWidth:280,width:"90%"}}>{[0,1,2,3].map(i=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"2px 4px",fontSize:11,fontWeight:i===0?800:600,color:G.pts[i]<0?"#c44":C.br}}><span>{WL[i]}{PN[i]}{i===G.dealer?" 親":""}</span><span>{G.pts[i].toLocaleString()}</span></div>))}</div>
      {G.winner>=0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>{srt(G.hands[G.winner]).map((t,i)=><Tile key={i} tile={t}/>)}</div>}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        {!isEnd?<button onClick={nextRound} style={{padding:"11px 32px",fontSize:14,fontWeight:900,color:"#fff",background:"linear-gradient(135deg,#d94060,#b83048)",border:"none",borderRadius:50,cursor:"pointer"}}>다음 국 ▶</button>
        :<div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:C.gd,marginBottom:6}}>🏆 최종 결과</div>{rank.map((r,i)=>(<div key={i} style={{fontSize:13,fontWeight:i===0?900:600,color:i===0?C.gd:C.br}}>{i+1}위 {PN[r.i]} {r.p.toLocaleString()}점</div>))}<button onClick={()=>setG({...INIT_G})} style={{marginTop:10,padding:"11px 32px",fontSize:14,fontWeight:900,color:"#fff",background:"linear-gradient(135deg,#d94060,#b83048)",border:"none",borderRadius:50,cursor:"pointer"}}>새 게임 🔄</button></div>}
        <Btn2 ch="메뉴" onClick={()=>setG({...INIT_G})}/>
      </div>{css}</div>);}

  /* TABLE */
  const BotH=({p})=>{const h=G.hands[p]||[],ac=G.cur===p,pm=G.melds[p]||[];return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,fontWeight:800,color:ac?C.gd:C.br}}>{WL[p]}{PN[p]}</span><span style={{fontSize:9,color:C.lb}}>{h.length}</span>{G.ri[p]&&<span style={{fontSize:8,background:C.lv,color:"#fff",padding:"1px 4px",borderRadius:6,fontWeight:800}}>立</span>}{p===G.dealer&&<span style={{fontSize:8,background:C.gd,color:"#fff",padding:"1px 3px",borderRadius:6,fontWeight:800}}>親</span>}</div><div style={{display:"flex",gap:1,flexWrap:"wrap",justifyContent:"center"}}>{h.map((_,i)=><Tile key={i} tile="x" fd sm/>)}</div>{pm.length>0&&<div style={{display:"flex",gap:2,justifyContent:"center"}}>{pm.map((m,i)=><MD key={i} m={m} sm/>)}</div>}</div>);};
  const BotV=({p})=>{const h=G.hands[p]||[],ac=G.cur===p,pm=G.melds[p]||[];return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:44}}><span style={{fontSize:10,fontWeight:800,color:ac?C.gd:C.br,writingMode:"vertical-rl"}}>{WL[p]}{PN[p]}</span>{G.ri[p]&&<span style={{fontSize:8,background:C.lv,color:"#fff",padding:"1px 4px",borderRadius:6,fontWeight:800}}>立</span>}{p===G.dealer&&<span style={{fontSize:8,background:C.gd,color:"#fff",padding:"1px 3px",borderRadius:6,fontWeight:800}}>親</span>}<div style={{display:"flex",flexDirection:"column",gap:1}}>{h.map((_,i)=><Tile key={i} tile="x" fd sm rot/>)}</div>{pm.length>0&&<div style={{display:"flex",flexDirection:"column",gap:2}}>{pm.map((m,i)=><MD key={i} m={m} sm/>)}</div>}</div>);};
  const DZ=({p})=><div style={{display:"flex",flexWrap:"wrap",gap:1,justifyContent:"center",maxWidth:160,minHeight:30}}>{(G.disc[p]||[]).map((t,i)=><Tile key={i} tile={t} sm hl={i===(G.disc[p]||[]).length-1&&G.lastDB===p&&G.phase==="callPhase"}/>)}</div>;

  return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:`radial-gradient(ellipse at 50% 50%,#f0e8dc,${C.bg})`,fontFamily:font}}>{link}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 10px",background:"rgba(255,255,255,0.4)",borderBottom:`1px solid ${C.bd}40`}}>
      <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:10,color:C.lb,fontWeight:700}}>🀄{G.wall.length}</span><span style={{fontSize:10,color:C.gd,fontWeight:800}}>{rLbl}</span>{dL.length>0&&<div style={{display:"flex",gap:2,alignItems:"center"}}><span style={{fontSize:9,color:C.lb}}>도라</span>{dL.map((d,i)=><Tile key={i} tile={d} sm/>)}</div>}</div>
      <div style={{fontSize:12,fontWeight:800,color:C.br,background:"rgba(255,255,255,0.5)",padding:"3px 12px",borderRadius:18}}>{G.msg||"🎴"}</div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}><Tog on={bm} fn={()=>setBm(!bm)} lb="🐣"/><Tog on={sfxOn} fn={()=>setSfx(!sfxOn)} lb="🔊"/>{!isSafari&&<Tog on={voiceOn} fn={()=>setVoice(!voiceOn)} lb="🗣️"/>}<button onClick={()=>{setShowG(true);setGP(0);}} style={{fontSize:9,color:C.br,background:"rgba(255,255,255,0.5)",border:`1px solid ${C.bd}`,padding:"2px 7px",borderRadius:8,cursor:"pointer"}}>📖</button><button onClick={()=>setG({...INIT_G})} style={{fontSize:9,color:C.lb,background:"none",border:`1px solid ${C.bd}`,padding:"2px 7px",borderRadius:8,cursor:"pointer"}}>메뉴</button></div></div>
    <div style={{display:"flex",justifyContent:"center",gap:8,padding:"3px",flexWrap:"wrap",alignItems:"center"}}>{[0,1,2,3].map(i=>(<span key={i} style={{fontSize:10,color:i===0?C.pk:C.br,fontWeight:i===0?900:600}}>{PN[i]} {G.pts[i].toLocaleString()}{G.ri[i]?" 💎":""}{i===G.dealer?" 親":""}</span>))}{bm&&myW.length>0&&<span style={{fontSize:9,fontWeight:900,color:myFuri?"#c44":C.mt,background:myFuri?"#fde8e8":"#ecf7f0",padding:"1px 8px",borderRadius:10}}>{myFuri?"⚠️후리텐":"🎯텐파이"}</span>}</div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"0 4px",minHeight:0}}>
      <BotH p={2}/>
      <div style={{display:"flex",alignItems:"center",gap:6,width:"100%",justifyContent:"center"}}>
        <BotV p={1}/>
        <div style={{width:320,minHeight:200,background:"linear-gradient(145deg,#d8cfb8,#c8bfa8)",borderRadius:12,border:"2px solid #b8b0a0",boxShadow:"inset 0 2px 12px rgba(0,0,0,0.08),0 4px 16px rgba(0,0,0,0.06)",display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr 1fr",padding:8,gap:4,position:"relative"}}>
          <DZ p={1}/><DZ p={2}/><DZ p={0}/><DZ p={3}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:10,color:"#a09888",fontWeight:700,background:"rgba(216,207,184,0.9)",padding:"2px 8px",borderRadius:8}}>{rLbl}</span>
            {G.ri.some(Boolean)&&<div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>{G.ri.map((r,i)=>r?<div key={i} style={{width:24,height:5,background:"linear-gradient(90deg,#e8d4a0,#f0e0b0)",border:"1px solid #c8b888",borderRadius:2,position:"relative"}}><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:4,height:4,borderRadius:"50%",background:"#c44040"}}/></div>:null)}</div>}
            {G.riichiPool>0&&<span style={{fontSize:8,color:"#a09888"}}>공탁 {G.riichiPool}개</span>}
          </div>
        </div>
        <BotV p={3}/>
      </div>
    </div>
    {bm&&G.phase==="discarding"&&adv&&<Bub text={`💡 ${tL(adv.tile)} 추천 — ${adv.reason}`} type={adv.tp?"good":"tip"}/>}
    {bm&&G.phase==="discarding"&&myFuri&&<Bub text="⚠️ 후리텐! 대기패를 이미 버려서 론 불가 (쯔모만 가능)" type="warn"/>}
    {bm&&G.phase==="callPhase"&&G.callO?.ron?.includes(0)&&<Bub text="론 가능! ⚡" type="good"/>}
    {bm&&riOK&&<Bub text="텐파이! 리치 추천 💎" type="good"/>}
    {bm&&G.phase==="canTsumo"&&<Bub text="쯔모! 🌟" type="good"/>}
    {bm&&safe.size>0&&G.phase==="discarding"&&<Bub text="🛡️ 파란 테두리 = 리치자의 현물(안전패)" type="tip"/>}
    {myW.length>0&&(G.phase==="discarding"||G.phase==="canTsumo")&&(<div style={{display:"flex",justifyContent:"center",gap:3,alignItems:"center",padding:"2px 0"}}><span style={{fontSize:10,color:myFuri?"#c44":C.mt,fontWeight:800}}>🎯대기</span>{myW.map((t,i)=><Tile key={i} tile={t} sm glow/>)}</div>)}
    <div style={{padding:"6px 8px 14px",borderTop:`1px solid ${C.bd}40`,background:"rgba(255,255,255,0.3)"}}>
      {G.melds[0]?.length>0&&<div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:4}}>{G.melds[0].map((m,i)=><MD key={i} m={m}/>)}</div>}
      <div style={{display:"flex",gap:3,justifyContent:"center",flexWrap:"wrap",marginBottom:8}}>{pH.map((t,i)=>{const isDr=i===pH.length-1&&G.drawn;const isStar=bm&&adv&&adv.idx===i&&G.phase==="discarding";const isSf=safe.has(t)&&G.phase==="discarding"&&!isStar;
        return(<div key={i} style={{marginLeft:isDr?12:0,animation:isDr?"slideIn 0.2s ease":"none"}}><Tile tile={t} sl={G.sel===i} onClick={G.phase==="discarding"?()=>act.sel(i):undefined} glow={myW.includes(t)} star={isStar} sf={isSf}/></div>);})}</div>
      <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap"}}>
        {G.phase==="discarding"&&G.sel>=0&&<Btn ch="버리기 🗑️" bg="linear-gradient(135deg,#d94060,#b83048)" onClick={act.discard}/>}
        {riOK&&<Btn ch="리치! 💎" bg={`linear-gradient(135deg,${C.lv},#604888)`} onClick={act.ri}/>}
        {ckT.map(t=><Btn key={t} ch={`암깡 ${tL(t)}`} bg="linear-gradient(135deg,#d4960a,#b07808)" onClick={()=>act.kan(t)}/>)}
        {G.phase==="canTsumo"&&<><Btn ch="쯔모! 🌟" bg="linear-gradient(135deg,#d4960a,#b07808)" onClick={act.tsumo} pu/><Btn2 ch="패스" onClick={act.skipT}/></>}
        {G.phase==="callPhase"&&G.callO&&<>
          {G.callO.ron?.includes(0)&&!isFuri(pH,G.melds[0],G.disc[0])&&<Btn ch="론! ⚡" bg="linear-gradient(135deg,#d4960a,#b07808)" onClick={act.ron} pu/>}
          {G.callO.pon?.includes(0)&&<Btn ch="퐁 🟢" bg={`linear-gradient(135deg,${C.mt},#1a6a44)`} onClick={act.pon}/>}
          {G.callO.chi&&G.chiC.map((c,i)=><Btn key={i} ch={`치 [${c.map(tL).join("·")}]`} bg={`linear-gradient(135deg,${C.bl},#2a5c94)`} onClick={()=>act.chi(c)}/>)}
          <Btn2 ch="패스 ⏭️" onClick={act.skip}/></>}
      </div></div>
    {showG&&<GM/>}{css}</div>);
}
