const fs=require('fs');
const h=fs.readFileSync('验配师考试复习系统.html','utf-8');
const re=/<script>([\s\S]*?)<\/script>/g; let m, blocks=[];
while((m=re.exec(h))) blocks.push(m[1]);
const js=blocks.sort((a,b)=>b.length-a.length)[0];  // 取最长的(主逻辑)
fs.writeFileSync('_c.js', js);
console.log('script块数:', blocks.length, '| 主块长度:', js.length);
const {execSync}=require('child_process');
try{ execSync('node --check _c.js'); console.log('JS语法: OK'); }catch(e){ console.log('JS语法: ERR\n'+e.stdout+e.stderr); process.exit(1);}
fs.unlinkSync('_c.js');
// 渲染测试
const store={}; global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},length:0,removeItem:k=>{delete store[k]}};
global.confirm=()=>true;global.window={};
const els={}; function mkEl(){return {style:{display:'none'},_t:'▸',set textContent(v){this._t=v},get textContent(){return this._t}};}
global.document={getElementById:(id)=>{if(!els[id])els[id]=mkEl();return els[id];},documentElement:{setAttribute:()=>{}},addEventListener:()=>{},querySelectorAll:()=>[]};
let out=''; const appEl={get innerHTML(){return out},set innerHTML(x){out=String(x)},classList:{add(){},remove(){},contains(){return false}},style:{}};
global.document.app=appEl;
const T=`
S.page='lecture'; render();
var fail=0; function chk(n,c){console.log((c?'✅':'❌')+' '+n); if(!c)fail++;}
chk('渲染长度>5000', out.length>5000);
// 展开第①课看完整内容(应含 h3 章节与表格)
toggleLec('l1');
chk('l1含完整章节(声导抗测试 h3)', out.indexOf('声导抗测试')>=0);
chk('l1含表格 lec-tbl', out.indexOf('lec-tbl')>=0);
// 展开学习汇总
toggleLec('sum');
chk('汇总含知识地图/测听主线', out.indexOf('知识地图')>=0 || out.indexOf('测听')>=0);
chk('6张课卡片', (out.match(/lect-card/g)||[]).length===6);
console.log(fail===0?'ALL PASS':'FAILED: '+fail);
`;
(function(){ eval(js+T); })();
