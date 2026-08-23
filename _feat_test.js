const fs=require('fs');
const h=fs.readFileSync('验配师考试复习系统.html','utf-8');
const re=/<script>([\s\S]*?)<\/script>/g; let m, blocks=[];
while((m=re.exec(h))) blocks.push(m[1]);
const js=blocks.sort((a,b)=>b.length-a.length)[0];
fs.writeFileSync('_c.js', js);
const {execSync}=require('child_process');
try{ execSync('node --check _c.js'); console.log('JS语法: OK'); }catch(e){ console.log('JS语法: ERR'); fs.unlinkSync('_c.js'); process.exit(1);}
fs.unlinkSync('_c.js');
const store={}; global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},length:0,removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]};
global.confirm=()=>true;global.alert=()=>{};global.window={};
const els={}; function mkEl(){return {style:{display:'none'},value:'',checked:false,textContent:'',set textContent(v){this._t=v},get textContent(){return this._t},click(){},files:[]};}
global.document={getElementById:(id)=>{if(!els[id])els[id]=mkEl();return els[id];},documentElement:{setAttribute:()=>{}},addEventListener:()=>{},querySelectorAll:()=>[],createElement:()=>({click(){},set href(v){},set download(v){},style:{}}),body:{appendChild(){},removeChild(){}}};
global.URL={createObjectURL:()=>'blob:x',revokeObjectURL:()=>{}};
global.FileReader=function(){this.readAsText=()=>{};};
let out=''; const appEl={get innerHTML(){return out},set innerHTML(x){out=String(x)},classList:{add(){},remove(){},contains(){return false}},style:{}};
global.document.app=appEl;
const T=`
var fail=0; function chk(n,c){console.log((c?'✅':'❌')+' '+n); if(!c)fail++;}
// 1) 模拟考配置页
S.page='exam'; render();
chk('模拟考配置页渲染', out.indexOf('模拟考试配置')>=0 && out.indexOf('type="range"')>=0);
// 设参数并开考
EXAM.single=5; EXAM.multi=3; EXAM.minutes=30; startExam();
chk('开考后生成题列表', EXAM.qlist.length===8);
chk('renderExam进入答题', out.indexOf('q-card')>=0);
// 作答：单选选对、多选选全
var q0=BANK[EXAM.qlist[0]]; EXAM.answers[EXAM.qlist[0]]=[q0.a];
var q1=BANK[EXAM.qlist[1]]; EXAM.answers[EXAM.qlist[1]]=q1.a.split(''); // 多选全选
EXAM.idx=1; examNext(); EXAM.idx=7; submitExam(false);
chk('交卷后显示报告', out.indexOf('模拟考试报告')>=0);
chk('报告含正确率', out.indexOf('正确率')>=0);
// 2) 设置页
S.page='setting'; render();
chk('设置页含重置/导入导出/弱项', out.indexOf('重置所有学习数据')>=0 && out.indexOf('导出进度 JSON')>=0 && out.indexOf('弱项间隔重练')>=0);
// 弱项调度：开启 + last=0 → startQuiz应把错题塞入weakFirst
LS.set('weak_review',{on:true,days:1,last:0});
LS.set('wrong',[10,20,30]);
S.weakFirst=null; S.mode='all'; S.history=[]; startQuiz();
chk('弱项调度: weakFirst非空且含错题', S.weakFirst && S.weakFirst.length>0 && S.weakFirst.indexOf(10)>=0);
chk('弱项调度: 首题优先出弱项', S.qid===10);
// 3) home含模拟考入口
S.page='home'; render();
chk('首页有模拟考入口', out.indexOf('模拟考试')>=0);
// 4) tab含设置
chk('顶栏含设置tab', out.indexOf("'设置'")>=0 || out.indexOf('设置')>=0);
console.log(fail===0?'ALL PASS ✅':('FAILED: '+fail));
`;
(function(){ eval(js+T); })();
