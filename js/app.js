
/* 사용설명서 8장 전체 기능표에서 추출한 코드 번호 초안. 조건부 코드 표시, 기기 용량별 가변 코드 일부는 고정 목록으로 표시. */
const CATALOG = {"dr":[0,9,11,12,13,14,15,16,17,18,19,20,26,27,28,80,81,87,89,91,92,93,94,95,97,98],"bA":[0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,53,54,55,56,70,71],"Ad":[0,1,2,7,8,9,10,13,20,21,22,23,24,25,26,27,28,29,30,31,32,33,41,42,44,45,46,47,50,60,61,64,65,66,67,68,70,74,75,79,80,85,86],"Cn":[0,4,5,9,10,11,20,21,22,23,24,29,30,53,70,71,77,96,97,98],"In":[0,1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,35,37,38,39,40,41,46,47,50,52,53,54,55,56,61,62,65,66,67,68,69,70,71,72,84,85,86,87,88,89,90,99],"OU":[0,1,2,3,4,5,6,7,8,9,10,11,12,29,30,31,33,41,50,51,52,53,54,55,56,57,58,67,68,69,70,71,72],"CM":[0,1,2,3,4,5,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,68,70,71,72,73,74,75,76,77,86,90,91,92,93],"AP":[0,1,2],"Pr":[0,5,6,7,8,9,12,17,18,19,20,21,22,25,26,27,28,29,30,31,32,33,34,35,36,40,41,42,43,45,50,51,52,53,54,55,56,57,58,59,66,67,68,77,78,79,80,81,82,86,87,88,89,90,91,92,93,94,95,96],"M2":[0,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,25,26,27,28,29,30,31,32,33,34,40,41,42],"US":[0,1,2,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],"UF":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]};
const G=['op','dr','bA','Ad','Cn','In','OU','CM','AP','Pr','M2','US','UF'];
const GROUPLABEL={op:'운전 그룹',dr:'드라이브',bA:'기본 기능',Ad:'확장 기능',Cn:'제어 기능',In:'입력 단자대',OU:'출력 단자대',CM:'통신 기능',AP:'응용 기능',Pr:'보호 기능',M2:'제2모터',US:'사용자 시퀀스',UF:'사용자 함수'};
const OPS=['base','acc','dec','drv','frq','st1','st2','st3','cur','rpm','dcl','vol','non','drc'];
const OPLABEL={base:'기본 운전 주파수',acc:'가속 시간',dec:'감속 시간',drv:'운전지령 방법',frq:'주파수 설정 방법',st1:'1속 주파수',st2:'2속 주파수',st3:'3속 주파수',cur:'출력 전류',rpm:'모터 회전수',dcl:'DC 링크 전압',vol:'출력 전압',non:'고장 상태',drc:'회전 방향'};
const OPVIEW={base:'0.00',acc:'ACC',dec:'dEC',drv:'drv',frq:'Frq',st1:'St1',st2:'St2',st3:'St3',cur:'CUr',rpm:'Rpm',dcl:'dCL',vol:'vOL',non:'nOn',drc:'drC'};
const FN={0:'None',1:'Fx',2:'Rx',3:'RST',4:'External Trip',5:'BX',6:'JOG',7:'Speed-L',8:'Speed-M',9:'Speed-H',11:'XCEL-L',12:'XCEL-M',13:'RUN Enable',14:'3-Wire',15:'2nd Source',16:'Exchange',17:'Up',18:'Down',20:'U/D Clear',21:'Analog Hold',22:'I-Term Clear',23:'PID Openloop',24:'P Gain2',25:'XCEL Stop',26:'2nd Motor',27:'U/D Enable',33:'Base Block',34:'Pre Excite',38:'Timer In',40:'dis Aux Ref',46:'FWD JOG',47:'REV JOG',49:'XCEL-H',50:'User Seq',51:'Fire Mode',52:'KEB-1 Select'};
const DEFAULTS={base:0,acc:5,dec:10,drv:1,frq:0,st1:10,st2:20,st3:30,drc:0,'In.65':1,'In.66':2,'In.67':5,'In.68':3,'In.69':7,'In.70':8,'In.71':9,'In.72':0,'CM.01':1,'CM.02':0,'CM.03':3,'CM.04':0,'dr.93':0};
const JUMP_DEFAULT={dr:9,bA:20,Ad:20,Cn:4,In:65,OU:30,CM:20,AP:1,Pr:5,M2:4,US:1,UF:1};
const PRESETS={exam:{name:'2026.10.17 기출',base:3,st1:9,st2:15,st3:21,terms:{P3:5,P4:7,P5:8}},photo:{name:'사진 설정 예시',base:null,st1:30,st2:45,st3:60,terms:{P3:5,P4:7,P5:8}}};
let task=1,mode='practice',profile=structuredClone(PRESETS.exam),params={},powered=true,run=false,dir=1,groupDirection=1,plcFreq=0,terminal={P3:false,P4:false,P5:false},stage='browse',group='op',opIdx=0,code=0,edit='',cursor=0,editKey='',inputType='',dummy=false,initialized=false,history=[],toastTimer=0,monitorOverlay=false;
const qs=x=>document.getElementById(x);
function codeKey(){return group==='op'?OPS[opIdx]:`${group}.${String(code).padStart(2,'0')}`}
function storedKey(){return group==='op'?OPS[opIdx]:`${group}.${String(code).padStart(2,'0')}`}
function valueFor(k){return params[k]??DEFAULTS[k]??0}
function spec(k){if(['base','st1','st2','st3'].includes(k))return {type:'hz',max:400};if(['acc','dec'].includes(k))return {type:'sec',max:600};if(k==='drv')return {type:'int',max:5,allowed:[0,1,2,3,4,5]};if(k==='frq')return {type:'int',max:9,allowed:[0,1,2,3,4,5,6,8,9]};if(/^In\.\d\d$/.test(k)&&Number(k.slice(3))>=65&&Number(k.slice(3))<=72)return {type:'term',max:52,allowed:Object.keys(FN).map(Number)};if(k==='dr.93')return {type:'init',max:14,allowed:[0,1,2,3,4,5,6,7,8,9,12,13,14]};if(['CM.01','CM.02','CM.03','CM.04'].includes(k))return {type:'int',max:k==='CM.01'?250:k==='CM.02'?2:k==='CM.03'?7:3};if(k==='drc')return {type:'int',max:1};return null}
function nameOf(k){if(OPLABEL[k])return OPLABEL[k];if(/^In\.(6[5-9]|7[0-2])$/.test(k))return 'P'+(Number(k.slice(3))-64)+' 입력 단자 기능';if(k==='dr.93')return '파라미터 초기화';if(k==='CM.01')return 'RS-485 인버터 ID';if(k==='CM.02')return '통신 프로토콜';if(k==='CM.03')return '통신 속도';if(k==='CM.04')return '통신 프레임';if(k.endsWith('.00'))return '점프 코드';return '탐색용 코드 · 동작 미구현'}
function descOf(k){let v=valueFor(k);if(k==='drv')return ['Keypad','Fx/Rx-1','Fx/Rx-2','Int 485','Field Bus','UserSeqLink'][v]||'미정';if(k==='frq')return ({0:'Keypad-1',1:'Keypad-2',2:'V1',3:'V2',4:'V0',5:'I2',6:'Int 485',8:'Field Bus',9:'UserSeqLink'})[v]||'미정';if(k.startsWith('In.'))return FN[v]??'정의되지 않은 값';return k==='dr.93'?'0: No / 1: All Grp (전체 초기화)':spec(k)?.type==='hz'?`${Number(v).toFixed(2)} Hz`:String(v)}
function codeDisplay(){if(group==='op'){let k=OPS[opIdx];return k==='base'?Number(valueFor('base')).toFixed(2):OPVIEW[k]}return `${group}.${String(code).padStart(2,' ')}`}
function codeList(){return CATALOG[group]||[0]}
function resetEditor(){stage='browse';edit='';cursor=0;editKey='';dummy=false}
function initParams(){monitorOverlay=false;params={...DEFAULTS};initialized=false;run=false;dir=1;groupDirection=1;plcFreq=0;terminal={P3:false,P4:false,P5:false};group='op';opIdx=0;code=0;resetEditor();powered=true;history=[];record('인버터 공장 출하값으로 세션 시작 (dr.93 수행 이력과는 별개)');}
function record(t,warn=false){history.unshift({t,warn});history=history.slice(0,30);qs('log').innerHTML=history.map(x=>`<div class="${x.warn?'warn':''}">${escapeHTML(x.t)}</div>`).join('')}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function toast(t){let x=qs('toast');x.textContent=t;x.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>x.classList.remove('show'),2600)}
function formatEdit(k){let s=spec(k);let v=valueFor(k);return s.type==='hz'?Number(v).toFixed(2):s.type==='sec'?Number(v).toFixed(1):String(v)}
function isDigit(ch){return ch>='0'&&ch<='9'}
function lastDigitIndex(s){for(let i=s.length-1;i>=0;i--)if(isDigit(s[i]))return i;return 0}
function beginEdit(k){editKey=k;let sp=spec(k);if(!sp){stage='dummy';dummy=true;render();return}inputType=sp.type;edit=formatEdit(k);cursor=lastDigitIndex(edit);stage='edit';render()}
function getEditingValue(){return Number(edit)}
function moveCursor(){
 // 실제 G100C: 오른쪽 낮은 자리에서 시작하여 MODE/SHIFT를 누르면 왼쪽 높은 자리로 이동.
 // 예: 0.00 -> 0.0[0] -> 0.[0]0 -> [0].00 -> [0]0.00 (4자리).
 const pos=[];for(let i=0;i<edit.length;i++)if(isDigit(edit[i]))pos.push(i);
 const at=pos.indexOf(cursor);
 if(at>0){cursor=pos[at-1];return;}
 // 가장 높은 자리에서 한 번 더 누르면, 허용 자릿수 내에서 왼쪽 자리를 추가.
 // 점프 코드는 두 자리(예: 3 -> 03), 주파수는 최대 4자리(0.00 -> 00.00).
 const limit=stage==='jump'?2:inputType==='hz'||inputType==='sec'?4:(spec(editKey)?.max>=10?2:1);
 if(pos.length<limit){edit='0'+edit;cursor=0;}else{cursor=pos[pos.length-1];}
}
function adjustDigit(delta){let sp=stage==='jump'?{type:'jump',max:99}:spec(editKey);if(!sp)return;let before=edit;let arr=edit.split(''),cur=Number(arr[cursor]||0);for(let step=1;step<=10;step++){
 let n=(cur+delta*step+100)%10;arr[cursor]=String(n);let num=Number(arr.join(''));if(num<0||num>sp.max)continue;
 // 별도 기능 정의가 없는 In 값은 숫자 자체는 볼 수 있으나 ENT에서 거절하도록 유지
 edit=arr.join('');break;
 }if(before!==edit)render()}
function normalizeCandidate(k,v){let sp=spec(k);if(!sp)return false;return v>=0&&v<=sp.max&&(!sp.allowed||sp.allowed.includes(v))}
function duplicateOwner(k,v){if(!k.startsWith('In.')||v===0)return null;for(let n=65;n<=72;n++){let other='In.'+n;if(other!==k&&Number(valueFor(other))===v)return other}return null}
function applyParam(k,v){if(k==='dr.93'&&v!==0){if(run){toast('운전 중에는 초기화할 수 없습니다.');record('초기화 불가 · 운전 중',true);resetEditor();return}if(v===1){params={...DEFAULTS};initialized=true;run=false;dir=1;plcFreq=0;record('dr.93 = 1 (All Grp) · 전체 공장 초기화 완료');toast('전체 그룹 초기화 완료');}else{const mapping={2:'dr',3:'bA',4:'Ad',5:'Cn',6:'In',7:'OU',8:'CM',9:'AP',12:'Pr',13:'M2',14:'op'};let selected=mapping[v];for(const ky of Object.keys(params)){if(selected==='op'&&OPLABEL[ky]||ky.startsWith(selected+'.'))params[ky]=DEFAULTS[ky]??0}record(`dr.93=${v} · ${selected} 그룹 초기화`);toast('선택 그룹 초기화 완료')}params['dr.93']=0;resetEditor();return}
 params[k]=v;record(`${k} ← ${v}${k.startsWith('In.')?' ('+(FN[v]??'기타')+')':''}`);resetEditor();}
function commitFirst(){let k=editKey,v=getEditingValue();
 // 실제 G100(C): 입력값이 기존 저장값과 같으면 전체값 점멸/재확인 없이 코드 목록으로 바로 복귀.
 if(v===Number(valueFor(k))){resetEditor();render();return}
 if(!normalizeCandidate(k,v)){record(`${k}: 유효하지 않은 값 ${v} (rd/no)`,true);toast('허용되지 않은 파라미터 값 · rd/no');resetEditor();render();return}
 let other=duplicateOwner(k,v);if(other){record(`${k}: ${v} (${FN[v]}) 중복 · ${other}에서 사용 중 (OL)`,true);toast(`OL 중복 설정: ${other}에서 ${FN[v]} 사용 중`);resetEditor();render();return}
 stage='confirm';render()}
let comboIgnoreUntil=0;
function press(action){monitorOverlay=false;if(Date.now()<comboIgnoreUntil&&['mode','up','down'].includes(action))return;if(!powered&&action!=='power'){toast('전원이 꺼져 있습니다.');return}
 if(action==='esc'){if(stage==='browse'){group='op';opIdx=0;code=0}else resetEditor();render();return}
 if(action==='run'){if(stage!=='browse'){toast('파라미터 설정 화면입니다.');return}if(Number(valueFor('drv'))!==0){toast(mode==='exam'?'현재 운전 지령 설정에서는 RUN 키로 운전할 수 없습니다.':'drv=0 (Keypad)일 때 RUN 키로 운전할 수 있습니다.');return}run=true;dir=1;monitorOverlay=true;record('RUN 키 · 정회전 지령');render();return}
 if(action==='stop'){run=false;plcFreq=0;monitorOverlay=true;record('STOP / RESET 키');render();return}
 if(stage==='dummy'){if(action==='enter'||action==='mode')resetEditor();render();return}
 if(stage==='confirm'){if(action==='enter'){applyParam(editKey,getEditingValue())}else{record(`${editKey} 값 입력 취소`);resetEditor()}render();return}
 if(stage==='edit'||stage==='jump'){if(action==='up'||action==='down'){adjustDigit(action==='up'?1:-1);return}if(action==='mode'||action==='modeRev'){moveCursor();render();return}if(action==='enter'){
 if(stage==='jump'){let v=Number(edit);let cs=codeList();if(cs.includes(v)){code=v;record(`점프 코드 → ${group}.${v}`)}else{toast('선택한 코드가 목록에 없습니다.');record(`점프 코드 ${v} · 코드 없음`,true)}resetEditor();render();return}commitFirst();return}return}
 if(stage==='browse'){if(action==='mode'||action==='modeRev'||action==='modeToggle'){if(action==='modeToggle'){groupDirection*=-1;record('MODE/SHIFT 1초 이상 · '+(groupDirection===1?'정방향':'역방향')+'으로 전환')}let i=G.indexOf(group);let step=action==='modeRev'?-1:groupDirection;group=G[(i+step+G.length)%G.length];if(group==='op')opIdx=0;else code=0;render();return}
 if(action==='up'||action==='down'){let d=action==='up'?1:-1;if(group==='op')opIdx=(opIdx+d+OPS.length)%OPS.length;else{let l=codeList();let pos=l.indexOf(code);code=l[(pos+d+l.length)%l.length]}render();return}
 if(action==='enter'){if(group!=='op'&&code===0){stage='jump';editKey=`${group}.00`;inputType='jump';edit=String(JUMP_DEFAULT[group]??1);cursor=lastDigitIndex(edit);render();return}beginEdit(storedKey());return}}
}
function powerCycle(){monitorOverlay=false;powered=!powered;if(!powered){run=false;plcFreq=0;resetEditor();record('전원 OFF');qs('powerBtn').textContent='전원 ON'}else{group='op';opIdx=0;code=0;record('전원 ON · 설정값 유지');qs('powerBtn').textContent='전원 OFF'}render()}
// Reset ONLY after the user has acknowledged loss of the current settings.
function resetForNewAttempt(){
  initParams();
  qs('powerBtn').textContent='전원 OFF';
  qs('practiceProgress').open=false;
  closeResult();
}
function newSession(){
  if(!window.confirm('처음 상태로 되돌릴까요?\n현재 인버터 설정과 조작 기록이 사라집니다.\n선택한 기출문제와 채점 모드는 유지됩니다.'))return;
  resetForNewAttempt();render();toast('인버터 설정을 초기화했습니다.');
}
function reqs(){if(task===3)return[{label:'운전지령 · Int 485',detail:'drv = 3',test:()=>Number(valueFor('drv'))===3},{label:'주파수 설정 · Int 485',detail:'Frq = 6',test:()=>Number(valueFor('frq'))===6}];let rs=[{label:'운전지령 · Keypad',detail:'drv = 0',test:()=>Number(valueFor('drv'))===0},{label:'주파수 설정 · Keypad-1 또는 2',detail:'Frq = 0 또는 1',test:()=>[0,1].includes(Number(valueFor('frq')))}];for(let [k,label] of [['base','0속'],['st1','1속'],['st2','2속'],['st3','3속']]){if(profile[k]===null||profile[k]===''||profile[k]===undefined)continue;let target=Number(profile[k]);rs.push({label:`${label} 주파수`,detail:`${k==='base'?'기본 운전 주파수':k.toUpperCase()} = ${target.toFixed(2)} Hz`,test:()=>Math.abs(Number(valueFor(k))-target)<.001})}
 for(let n of [3,4,5]){let target=Number(profile.terms['P'+n]);rs.push({label:`P${n} 입력 기능`,detail:`In.${64+n} = ${target} (${FN[target]??'미지정'})`,test:()=>Number(valueFor(`In.${64+n}`))===target})}return rs}
function selectTask(t){monitorOverlay=false;task=t;qs('task1').classList.toggle('active',t===1);qs('task3').classList.toggle('active',t===3);qs('plcDemo').classList.toggle('hidden',t!==3);qs('customSheet').classList.toggle('hidden',mode!=='practice'||selectedExamId!=='custom'||t!==1);qs('terminalHelp').textContent=t===1?'모의 스위치를 누르면 선택 주파수를 LCD와 하단에 즉시 표시합니다. 키패드를 누르면 이전 메뉴로 돌아갑니다.':'3과제의 RS-485 모의 명령을 누르면 LCD에 주파수가 즉시 표시됩니다.';render()}
function setMode(m){
  if(m===mode)return;
  if(mode==='practice'&&m==='exam'){
    if(!window.confirm('시험 모드를 시작할까요?\n현재 연습 중인 인버터 설정과 조작 기록이 초기화됩니다.\n선택한 기출문제는 유지됩니다.'))return;
    resetForNewAttempt();
  }else if(mode==='exam'&&m==='practice'){
    if(!window.confirm('시험을 종료하고 연습 모드로 돌아갈까요?\n인버터 설정값은 초기화하지 않고 그대로 유지됩니다.'))return;
    closeResult();
  }
  mode=m;
  qs('practiceBtn').classList.toggle('active',m==='practice');
  qs('examBtn').classList.toggle('active',m==='exam');
  if(m==='exam')qs('practiceProgress').open=false;
  render();toast(m==='practice'?'연습 모드 · 설정값 유지':'시험 모드 · 설정 초기화 완료');
}
function loadPreset(type){if(mode==='exam'){toast('연습 모드에서 먼저 문제를 선택하세요.');return}profile=structuredClone(PRESETS[type]);if(type==='exam'){fillCustom(profile)}render();toast(profile.name+' 요구사항 적용')}
function useCustom(){if(mode==='exam'){toast('연습 모드에서 먼저 문제를 설정하세요.');return}if(task===3){toast('사용자 정의 단자배치는 1과제에서 이용하세요.');return}document.querySelector('#customSheet').scrollIntoView({behavior:'smooth',block:'nearest'});toast('P3/P4/P5 및 주파수를 변경한 뒤 아래 적용 버튼을 누르세요.')}
function fillCustom(p){for(let i of [3,4,5])qs('goalP'+i).value=p.terms['P'+i];for(const [id,k] of [['goalBase','base'],['goalSt1','st1'],['goalSt2','st2'],['goalSt3','st3']])qs(id).value=p[k]??''}
function applyCustom(){if(mode==='exam'){toast('시험모드에서는 문제를 수정할 수 없습니다.');return}let terms={};for(let i of [3,4,5])terms['P'+i]=Number(qs('goalP'+i).value);let vals=Object.values(terms).filter(x=>x!==0);if(new Set(vals).size!==vals.length){toast('서로 다른 단자에 같은 기능을 동시에 요구할 수 없습니다.');return}
 let freqs={};for(const [id,key] of [['goalBase','base'],['goalSt1','st1'],['goalSt2','st2'],['goalSt3','st3']]){let v=qs(id).value.trim();if(v===''&&key==='base'){freqs[key]=null;continue}let x=Number(v);if(v===''||!Number.isFinite(x)||x<0||x>400){toast('주파수는 0~400 Hz 범위에서 입력하세요. 0속만 빈칸 허용.');return}freqs[key]=x}
 profile={name:'직접 설정 문제',...freqs,terms};selectedExamId='custom';qs('examSelect').value='custom';selectTask(1);render();toast('사용자 지정 요구사항 적용 완료')}
function grade(show){let rs=reqs(),done=rs.filter(x=>x.test());if(!show)return;qs('resultScore').textContent=done.length+' / '+rs.length+' 항목';qs('resultDescription').textContent=`${task}과제 · ${profile.name} · ${done.length===rs.length?'모든 설정 요구사항을 충족했습니다.':'미완료 항목을 확인하고 다시 설정하세요.'}`;qs('resultItems').innerHTML=rs.map(r=>`<div class="resultItem"><span class="${r.test()?'ok':'ng'}">${r.test()?'✓':'✕'}</span><div><strong>${escapeHTML(r.label)}</strong>${mode==='practice'?`<div class="minor">${escapeHTML(r.detail)}</div>`:''}</div></div>`).join('');qs('resultModal').classList.remove('hidden')}
function closeResult(){qs('resultModal').classList.add('hidden')}
function toggleTerm(p){terminal[p]=!terminal[p];monitorOverlay=powered;record(`${p} 접점 ${terminal[p]?'ON':'OFF'}`);render()}
function plcCommand(f,d){if(task!==3)return;if(Number(valueFor('drv'))!==3||Number(valueFor('frq'))!==6){toast(mode==='exam'?'현재 설정에서는 통신 운전 명령을 실행할 수 없습니다.':'통신 운전을 위해 drv=3, Frq=6을 설정해야 합니다.');return}plcFreq=f;dir=d||1;run=f>0;monitorOverlay=true;record(`가상 PLC 통신 · ${f>0?(d===-1?'역회전':'정회전')+' '+f+'Hz':'STOP'}`);render()}
// 입력 스위치의 '선택 주파수'와 모터가 실제로 출력할 '운전 주파수'를 구분한다.
// 정지 상태여도 단자를 누르면 어떤 다단속이 선택되는지 LCD와 수치에 보여준다.
function monitorInfo(){
 const assigned=[3,4,5].map(n=>({on:terminal['P'+n],value:Number(valueFor(`In.${64+n}`))}));
 const bx=task===1&&assigned.some(x=>x.on&&x.value===5);
 const bits=assigned.filter(x=>x.on).reduce((sum,x)=>sum+(x.value===7?1:x.value===8?2:x.value===9?4:0),0);
 const supported=task===3||bits<=3;
 let selected=task===3?plcFreq:bits===0?Number(valueFor('base')):supported?Number(valueFor('st'+bits)):NaN;
 if(bx)selected=0;
 const active=powered&&run&&!bx;
 const output=active&&Number.isFinite(selected)?selected:0;
 const state=!powered?'전원 OFF':bx?'BX 비상정지 · 출력 차단':!supported?'4~7속 설정 미구현':active?'운전 중':'정지 중';
 return {freq:selected,output,bits,state,bx,active,supported};
}
function lcdFreq(n){if(!Number.isFinite(n))return '----';return Number(n).toFixed(n<100?2:1)}
// 실제 시험지 문장만 표출한다. 정답 코드/값의 해석은 연습 진행도에만 있다.
function hzText(v){if(v===null||v===undefined||v==='')return '—';const n=Number(v);return Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'')}
function featureName(v){return ({0:'미사용',5:'비상정지(BX)',7:'Speed-L',8:'Speed-M',9:'Speed-H'})[Number(v)]??(FN[Number(v)]??'지정 기능')}
function switchPattern(speed){
  let keys=['P3','P4','P5'],terms=profile.terms;
  if(speed==='bx'){
    let has=keys.some(p=>Number(terms[p])===5);
    return [...keys.map(p=>Number(terms[p])===5?'ON':'-'),has?'BX':'—'];
  }
  let want=speed===1?[7]:speed===2?[8]:speed===3?[7,8]:[];
  const found=want.every(f=>keys.some(p=>Number(terms[p])===f));
  return [...keys.map(p=>want.includes(Number(terms[p]))?'ON':'OFF'),found?'ok':'—'];
}

// Structured exam data is loaded from JSON (web) or embedded for the single-file edition.
let EXAMS=[],EXAM_BY_ID={},selectedExamId='',lastRealExamId='',examReady=false;
const EXAM_FEATURE_CODES={'BX':5,'Speed-L':7,'Speed-M':8,'Speed-H':9,'None':0};
function currentExam(){return EXAM_BY_ID[selectedExamId]||EXAM_BY_ID[lastRealExamId]||null}
function profileFromExam(e){
 const s=e.task1.speeds,t=e.task1.terminalFunctions;
 return {name:e.title,date:e.date,base:s['0']?.hz??null,st1:s['1']?.hz??null,st2:s['2']?.hz??null,st3:s['3']?.hz??null,
   terms:{P3:EXAM_FEATURE_CODES[t.P3],P4:EXAM_FEATURE_CODES[t.P4],P5:EXAM_FEATURE_CODES[t.P5]},examId:e.id};
}
function fillExamSelect(){
 qs('examSelect').innerHTML=EXAMS.map(e=>{
  const type=Number(e.terminalType);
  const stars=Number.isInteger(type)&&type>0?'*'.repeat(type):'';
  return `<option value="${escapeHTML(e.id)}">${escapeHTML(e.title)}${stars}</option>`;
 }).join('')+'<option value="custom">직접 설정</option>';
}
function chooseExam(id,quiet=false){
  const dropdown=qs('examSelect');
  // This handler is also called by HTML select onchange, which has already
  // modified the displayed value before we show the confirmation dialog.
  if(id===selectedExamId){dropdown.value=selectedExamId;return;}
  if(id==='custom'&&mode==='exam'){
    dropdown.value=selectedExamId;
    toast('직접 설정은 연습 모드에서 변경할 수 있습니다.');return;
  }
  if(id!=='custom'&&!EXAM_BY_ID[id]){dropdown.value=selectedExamId;return;}
  if(!quiet&&selectedExamId){
    const okay=window.confirm('다른 문제로 전환할까요?\n현재 인버터 설정과 조작 기록이 초기화됩니다.\n이 작업은 취소할 수 없습니다.');
    if(!okay){dropdown.value=selectedExamId;return;}
  }
  if(id==='custom'){
    if(selectedExamId!=='custom')fillCustom(profile);
    selectedExamId='custom';profile={...profile,name:'직접 설정 문제',examId:null};
  }else{
    const e=EXAM_BY_ID[id];
    selectedExamId=id;lastRealExamId=id;profile=profileFromExam(e);
  }
  dropdown.value=id;
  // Quiet boot has a separate initParams() call; subsequent changes reset here.
  if(!quiet)resetForNewAttempt();
  render();
  if(!quiet)toast(id==='custom'?'직접 설정 모드로 전환했습니다.':'새 기출문제로 변경했습니다. 인버터는 출하 초기 상태입니다.');
}
async function bootExams(){
 try{
   const embedded=qs('embeddedExamData');
   if(embedded){EXAMS=JSON.parse(embedded.textContent)}
   else{const resp=await fetch('data/exams-all.json',{cache:'no-cache'});if(!resp.ok)throw new Error(`HTTP ${resp.status}`);EXAMS=await resp.json()}
   EXAMS.sort((a,b)=>b.date.localeCompare(a.date));
   EXAM_BY_ID=Object.fromEntries(EXAMS.map(e=>[e.id,e]));examReady=true;
   fillExamSelect();chooseExam(EXAMS[0].id,true);initParams();render();
 }catch(err){console.error(err);qs('examOrigin').textContent='문제 데이터 로드 실패: '+err.message+' · 웹 서버를 통해 접속하거나 오프라인 단일 HTML을 사용하세요.';initParams();render()}
}
function showSourceIssue(){
 const e=currentExam();const x=qs('sourceWarning');
 const warnings=selectedExamId!=='custom'&&e?.extraction?.warnings||[];
 x.classList.toggle('hidden',!warnings.length);
 if(warnings.length)x.textContent='원본 기출 확인 필요: '+warnings.join(' / ')+' · 원문 설정과 ON/OFF 표를 그대로 수록했으며 임의로 수정하지 않았습니다.';
}
function sourceTableRows(){
 const e=EXAM_BY_ID[selectedExamId];return e?.task1?.speeds||null;
}
function task3CommandButtons(){
 const e=currentExam();if(!e)return;
 let entries=[];
 for(const step of e.task3.operationSteps||[]){
  if(!step.motor_mentions)continue;
  const directions=step.text.includes('역회전')&&!step.text.includes('정회전')?-1:1;
  for(const f of step.frequencies_hz||[]){if(!Number.isFinite(f)||f<0||f>400)continue;
   const label=`${directions===-1?'역회전':'정회전'} ${f} Hz`;
   if(!entries.some(a=>a.label===label))entries.push({freq:f,dir:directions,label});
  }
 }
 entries=entries.slice(0,8);
 qs('plcButtons').innerHTML=entries.map(x=>`<button class="btn" onclick="plcCommand(${x.freq},${x.dir})">${escapeHTML(x.label)}</button>`).join('')+'<button class="btn" onclick="plcCommand(0,0)">정지</button>';
}

function renderPaper(){
 let html=''; const e=currentExam();
 if(task===1){
   let terms=profile.terms;
   let rows=sourceTableRows();
   let sourceRows=rows||{};
   let speeds=[['0속','0',profile.base],['1속','1',profile.st1],['2속','2',profile.st2],['3속','3',profile.st3]];
   if(!rows || (e?.task1?.sourceTableHasBxRow))speeds.push(['비상정지','bx',null]);
   let body=speeds.map(([label,n,v])=>{
     let switches,frequency;
     if(rows&&sourceRows[n]){
        const row=sourceRows[n];switches=['SS1','SS2','SS3'].map(k=>row.switches[k]);
        frequency=n==='bx'?'BX':hzText(row.hz);
     }else{
       const pattern=switchPattern(n==='bx'?'bx':Number(n));
       switches=pattern.slice(0,3);frequency=n==='bx'?'BX':hzText(v);
     }
     return `<tr><td>${label}</td>${switches.map(v=>`<td>${escapeHTML(v||'-')}</td>`).join('')}<td>${frequency}</td></tr>`;
   }).join('');
   html=`<div class="paperTitle">■ 제1과제 : 회로 배선과 인버터 다단속 제어</div>
     <div class="paperLine">2) 다음과 같이 인버터의 파라미터를 설정한다.</div>
     <div class="paperIndented"><span class="paperNumber">(1)</span> 운전그룹 설정
       <div class="paperSub"><div class="paperSubLine">① 운전지령 : Keypad</div><div class="paperSubLine">② 주파수 설정 방법 : Keypad-1 또는 Keypad-2</div></div></div>
     <div class="paperIndented"><span class="paperNumber">(2)</span> 디지털 입력(다기능 단자대) 설정
       <div class="paperSub"><div class="paperSubLine">① P3 : ${escapeHTML(featureName(terms.P3))}</div><div class="paperSubLine">② P4 : ${escapeHTML(featureName(terms.P4))}</div><div class="paperSubLine">③ P5 : ${escapeHTML(featureName(terms.P5))}</div></div></div>
     <div class="paperIndented"><span class="paperNumber">(3)</span> 다단속 설정</div>
     <table class="paperTable"><thead><tr><th>구분</th><th>SS1</th><th>SS2</th><th>SS3</th><th>f [Hz]</th></tr></thead><tbody>${body}</tbody></table>
     ${rows&&!e.task1.sourceTableHasBxRow?`<div class="paperFoot">※ 원문 다단속 표에는 비상정지 행이 없으며, 별도의 동작사항으로 기술됩니다. ${escapeHTML(e.task1.emergencyInstruction||'')}</div>`:''}
     <div class="paperFoot">SS1=P3, SS2=P4, SS3=P5. 원본 기출에서 제시된 설정값과 표를 따릅니다.</div>`;
 }else{
   const title=e?.task3?.taskLabel||'PLC 공정제어';
   const steps=e?.task3?.operationSteps||[];
   const excerpts=steps.filter(x=>x.motor_mentions || /정지|역회전|정회전/.test(x.text));
   const req4=e?.task3?.avoidAccelDecelChanges?'4) 인버터의 가속/감속시간은 따로 설정하지 마시오.':'';
   const req7=e?.task3?.communicationRequired?'7) PLC와 인버터 간 RS-485 통신을 수행하시오.':'';
   html=`<div class="paperTitle">■ 제3과제 : ${escapeHTML(title)}</div>
     <div class="paperLine">2. 요구사항 (인버터 관련 항목)</div>
     <div class="paperIndented">${escapeHTML(req4)}${req4&&req7?'<br>':''}${escapeHTML(req7)}</div>
     <div class="paperLine">3. 동작사항 (인버터 관련 발췌)</div>
     <div class="paperIndented">운전지령 : Int 485 / 주파수 설정 방법 : Int 485</div>
     <div class="motorSteps">${excerpts.map(s=>`<div class="step"><b>${s.number})</b> ${escapeHTML(s.text).replace(/\n/g,'<br>')}</div>`).join('')}</div>
     <details class="task3Details"><summary>3과제 동작사항 원문 전체 보기</summary>
       ${steps.map(s=>`<div class="step"><b>${s.number})</b> ${escapeHTML(s.text).replace(/\n/g,'<br>')}</div>`).join('')}</details>
     <div class="paperFoot">실제 PDF의 인버터 관련 동작사항을 발췌했습니다. PLC 로직 및 실제 통신 구현·채점은 지원하지 않습니다.</div>`;
 }
 qs('examPaper').innerHTML=html;
}
function renderReq(){
  const rs=reqs(),done=rs.filter(r=>r.test()).length;
  qs('taskTag').textContent=profile.name;
  qs('examOrigin').textContent=selectedExamId==='custom'?'사용자 지정 문제 · 연습모드에서 설정을 변경할 수 있습니다.':`출처: ${currentExam()?.source?.filename??'알 수 없음'} · 1과제 p.${currentExam()?.source?.task1Page??'?'} / 3과제 p.${currentExam()?.source?.task3Page??'?'}`;
  showSourceIssue();task3CommandButtons();
  qs('taskDesc').textContent=task===1?'제1과제 · 인버터 파라미터 설정':'제3과제 · 인버터 통신 운전 설정';
  renderPaper();
  const practicing=mode==='practice';
  // 시험모드에서는 진행도와 정답 코드를 화면에 생성하지 않는다.
  qs('practiceProgress').classList.toggle('hidden',!practicing);
  qs('examNotice').style.display=practicing?'none':'';
  qs('problemEditor').classList.toggle('hidden',!practicing||selectedExamId!=='custom'||task!==1);
  qs('customSheet').classList.toggle('hidden',!practicing||selectedExamId!=='custom'||task!==1);
  qs('requirements').innerHTML=practicing?rs.map(r=>{
    const good=r.test();return `<div class="requirement"><span class="reqicon ${good?'done':''}">${good?'✓':'·'}</span><div><div class="reqhead">${escapeHTML(r.label)}</div><div class="reqsub">${escapeHTML(r.detail)}</div></div></div>`
  }).join(''):'';
  qs('progressText').textContent=practicing?`${done} / ${rs.length} 충족`:'';
  qs('progBar').style.width=practicing?`${100*done/rs.length}%`:'0%';
}
function renderSwitches(){
 qs('switches').innerHTML=[3,4,5].map(n=>{let v=Number(valueFor('In.'+(64+n)));return `<div class="switch"><strong>P${n}</strong>${mode==='practice'?`<span class="minor">${escapeHTML(FN[v]??'기타')} (${v})</span>`:'<span class="minor">모의 접점</span>'}<button class="toggle ${terminal['P'+n]?'on':''}" onclick="toggleTerm('P${n}')">${terminal['P'+n]?'ON':'OFF'}</button></div>`}).join('');
 const m=monitorInfo(),additional=task===3?'PLC→인버터 모의 지령':`Speed 비트 조합: ${m.bits} · 다단속 ${m.bits}속`;
 const showHz=m.bx?'BX · 0.00 Hz':Number.isFinite(m.freq)?`${m.freq.toFixed(2)} Hz`:'--.-- Hz';
 const outputNote=m.active?`모의 출력 ${m.output.toFixed(2)} Hz (가/감속 미반영)`:'모터 출력 0.00 Hz · 선택 주파수만 표시';
 qs('monitor').innerHTML=`<strong>${showHz}</strong> &nbsp; ${m.state}<span class="small">${additional}${m.bx?' · BX 입력이 최우선':''} · ${outputNote}</span>`;
}
// Four-digit segmented LCD. The A–Z masks below follow G100(C) manual V4.04, PDF p.66 (printed p.52),
// "숫자와 영문자를 표현하는 방식". A letter has the SAME mask regardless of case in the code label.
// Segment coordinates: a=top, b=upper-right, c=lower-right, d=bottom, e=lower-left, f=upper-left, g=middle.
// The original per-case approximation was inaccurate for q, I/J/K/M/Q/R/V/W/X/Z and some lower-case letters.
const MANUAL_LETTERS={
 A:'abcefg', B:'cdefg', C:'adef', D:'bcdeg', E:'adefg', F:'aefg', G:'acdef', H:'bcefg',
 I:'ef', J:'bcd', K:'bdefg', L:'def', M:'ace', N:'ceg', O:'abcdef', P:'abefg',
 Q:'abcfg', R:'eg', S:'acdfg', T:'defg', U:'bcdef', V:'cde', W:'bdf', X:'cfg',
 Y:'bcdfg', Z:'adg'
};
const SEG={
 0:'abcdef', 1:'bc', 2:'abdeg', 3:'abcdg', 4:'bcfg', 5:'acdfg',
 6:'acdefg', 7:'abc', 8:'abcdefg', 9:'abcdfg', '-':'g', ' ':'',
 ...MANUAL_LETTERS,
 ...Object.fromEntries(Object.entries(MANUAL_LETTERS).map(([letter,mask])=>[letter.toLowerCase(),mask]))
};
const POLY={a:'7,3 38,3 33,9 12,9',b:'40,5 46,10 46,34 40,40 36,33 36,12',c:'40,44 46,50 46,74 40,79 36,72 36,51',d:'7,81 38,81 33,75 12,75',e:'4,44 10,51 10,72 4,79 0,74 0,50',f:'4,5 10,12 10,33 4,40 0,34 0,10',g:'7,42 12,38 33,38 38,42 33,47 12,47'};
function parseDisplay(s){let chars=[];for(let i=0;i<s.length;i++){if(s[i]==='.'&&chars.length){chars[chars.length-1].dot=true;continue}chars.push({c:s[i],dot:false,idx:i})}return chars.slice(-4)}
function svgLCD(s,blinkChar=-1,blinkAll=false){let units=parseDisplay(String(s));while(units.length<4)units.unshift({c:' ',dot:false,idx:-1});let content=units.map((unit,i)=>{let lit=SEG[unit.c]??SEG[unit.c.toUpperCase()]??'';
 // 꺼진 7세그먼트 윤곽은 모든 자리에서 항상 희미하게 표시한다.
 let off=Object.keys(POLY).map(k=>`<polygon points="${POLY[k]}" fill="#58262b" opacity=".20" />`).join('');
 // 실제로 켜진 세그먼트만 점멸시켜 공백 자리와 비점등 세그먼트는 깜빡이지 않는다.
 let on=Object.keys(POLY).filter(k=>lit.includes(k)).map(k=>`<polygon points="${POLY[k]}" fill="#ff343e" />`).join('');
 let dot=unit.dot?'<circle cx="49" cy="80" r="4" fill="#ff343e"/>':'';
 let blink=unit.c!==' '&&(blinkAll||(blinkChar>=0&&unit.idx===blinkChar))?'style="animation:blink 1s steps(1) infinite"':'';
 return `<g transform="translate(${13+i*56} 0)">${off}<g ${blink}>${on}${dot}</g></g>`}).join('');return `<svg viewBox="0 0 244 87" role="img" aria-label="${escapeHTML(s)}"><rect width="244" height="87" fill="transparent"/>${content}</svg>`}
function render(){let display='0.00',cursorBlink=-1,allBlink=false,k=storedKey();
 const m=monitorInfo(),preview=powered&&monitorOverlay;
 if(!powered)display='    ';
 else if(preview)display=m.bx?' bX ':lcdFreq(m.freq);
 else if(stage==='browse')display=codeDisplay();
 else if(stage==='dummy')display='----';
 else{display=edit;if(stage==='edit'||stage==='jump')cursorBlink=cursor;else if(stage==='confirm')allBlink=true}
 qs('lcd').innerHTML=svgLCD(display,cursorBlink,allBlink);let desc=preview?(task===3?'가상 PLC 통신':'P3/P4/P5 다기능 입력')+` · ${Number.isFinite(m.freq)?m.freq.toFixed(2)+' Hz': '미구현 주파수'} 선택 · ${m.state}. 키패드 버튼을 누르면 이전 설정 화면으로 복귀합니다.`:powered?(stage==='browse'?`${GROUPLABEL[group]} · ${nameOf(k)}${spec(k)&&code!==0?` · 현재값: ${descOf(k)}`:''}`:stage==='jump'?`${GROUPLABEL[group]} 점프 코드 입력: 숫자 자릿수 조정 후 ENT를 누르세요.`:stage==='dummy'?`${nameOf(k)} · 탐색용 더미 코드. 상세 값과 변경 동작은 미구현입니다. ENT 또는 MODE로 돌아가세요.`:stage==='edit'?`${nameOf(editKey)} · ${inputType==='term'?(FN[getEditingValue()]??'정의되지 않은 값'):`입력값 ${edit}`} · 값을 바꿨다면 ENT로 저장 확인, 변경 없으면 ENT로 복귀`:`${nameOf(editKey)} · 값 전체 점멸: ENT를 한 번 더 눌러 확정, 다른 키로 취소`):'전원 OFF · 전원 ON 버튼으로 복귀할 수 있습니다.';
 qs('groupDirection').textContent=groupDirection===1?'정방향 →':'역방향 ←';qs('lcdNote').textContent=desc;qs('screenState').textContent=preview?'모의 주파수 모니터':powered?`${GROUPLABEL[group]} · ${stage==='browse'?'탐색':stage==='edit'?'값 편집':stage==='jump'?'점프 입력':stage==='confirm'?'저장 확인':'미구현 코드'}`:'전원 OFF';// Normal: SET flashes in edit/jump/confirm; RUN lit in run; FWD or REV according to direction.
 // Special BX: on the user's actual G100C photo all four lamps are illuminated at once.
 // The manual specifies BX output cut-off but does not explicitly prescribe the four-lamp pattern.
 const bxLights=powered&&m.bx;
 const states={Set:bxLights||(powered&&stage!=='browse'),Run:bxLights||(powered&&run),Fwd:bxLights||(powered&&run&&dir>=0),Rev:bxLights||(powered&&run&&dir<0)};
 for(const [name,on] of Object.entries(states)){
   const lamp=qs('led'+name);lamp.classList.toggle('active',on);
   lamp.classList.toggle('pulse',name==='Set'&&on&&!bxLights);
   lamp.setAttribute('aria-label',`${name} 표시등 ${on?'켜짐':'꺼짐'}`);
   lamp.setAttribute('title',`${name}: ${on?'ON':'OFF'}${name==='Set'&&!bxLights&&on?' (점멸)':''}`);
 }
 renderReq();renderSwitches()}
const heldKeys=new Set();
for(const [index,key] of [[3,'mode'],[1,'up'],[4,'down']]){
  const btn=document.querySelectorAll('.physical')[index];
  btn.addEventListener('pointerdown',()=>{
    heldKeys.add(key);
    if(heldKeys.size>=2){comboIgnoreUntil=Date.now()+650;modeComboConsumed=true;clearTimeout(holdTimer);holdActive=false;press('esc');toast('MODE/SHIFT + ▲/▼ 등의 ESC 복합 입력')}
  });
  for(const ev of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(ev,()=>heldKeys.delete(key));
}
// 사용자 실기 관찰 기반: 탐색 중 MODE/SHIFT 1초 이상 누르면 그룹 이동 방향을 토글해 다음 홀드까지 유지.
// 매뉴얼은 '반대방향으로 이동'이라고만 표기하며, 홀드 후 지속 시간까지 명시하지는 않는다.
// 편집/점프 중 긴 누름은 그룹 방향에 영향 없이 왼쪽 자릿수 이동을 1회 수행한다.
const modeBtn=qs('modeShiftKey');
let holdTimer=null, holdActive=false, longFired=false, modeComboConsumed=false, keyHoldTimer=null, keyboardHeld=false, keyboardLong=false;
function longModeAction(){return stage==='browse'?'modeToggle':'mode'}
function clearPointerMode(){clearTimeout(holdTimer);holdTimer=null;holdActive=false;longFired=false}
modeBtn.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(Date.now()<comboIgnoreUntil){modeComboConsumed=true;holdActive=false;return;}
  modeComboConsumed=false;clearTimeout(holdTimer);holdActive=true;longFired=false;
  holdTimer=setTimeout(()=>{
    if(!holdActive||heldKeys.size>=2||Date.now()<comboIgnoreUntil)return;
    longFired=true;press(longModeAction());
  },1000);
});
modeBtn.addEventListener('pointerup',()=>{
  if(!holdActive)return;
  clearTimeout(holdTimer);
  if(!longFired&&!modeComboConsumed&&Date.now()>=comboIgnoreUntil)press('mode');
  holdActive=false;
});
for(const ev of ['pointercancel','lostpointercapture'])modeBtn.addEventListener(ev,clearPointerMode);
// 키보드의 Space/Enter로 MODE 버튼을 선택한 경우도 접근성을 위해 짧게 누름으로 처리.
modeBtn.addEventListener('click',e=>{if(e.detail===0)press('mode')});
modeBtn.addEventListener('contextmenu',e=>e.preventDefault());
function keyboardCanControl(){return !['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)&&qs('resultModal').classList.contains('hidden')}
window.addEventListener('keydown',e=>{
  if(!keyboardCanControl())return;
  if(e.key.toLowerCase()==='m'){
    e.preventDefault();if(keyboardHeld||e.repeat)return;
    keyboardHeld=true;keyboardLong=false;
    keyHoldTimer=setTimeout(()=>{if(!keyboardHeld)return;keyboardLong=true;press(longModeAction())},1000);
    return;
  }
  const a={'ArrowUp':'up','ArrowDown':'down','Enter':'enter','Escape':'esc','r':'run','R':'run','s':'stop','S':'stop'}[e.key];
  if(a){e.preventDefault();press(a)}
});
window.addEventListener('keyup',e=>{
  if(e.key.toLowerCase()!=='m'||!keyboardHeld)return;
  clearTimeout(keyHoldTimer);keyboardHeld=false;
  if(!keyboardLong&&keyboardCanControl())press('mode');
});
window.addEventListener('blur',()=>{clearTimeout(keyHoldTimer);keyboardHeld=false;clearPointerMode()});
qs('resultModal').addEventListener('click',e=>{if(e.target.id==='resultModal')closeResult()});
bootExams();
