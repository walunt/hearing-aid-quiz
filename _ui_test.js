const fs=require('fs');
const h=fs.readFileSync('验配师考试复习系统.html','utf-8');
const re=/<script>([\s\S]*?)<\/script>/g; let m, blocks=[];
while((m=re.exec(h))) blocks.push(m[1]);
const js=blocks.sort((a,b)=>b.length-a.length)[0];
fs.writeFileSync('_c.js', js);
const {execSync}=require('child_process');
try{ execSync('node --check _c.js'); console.log('JS语法: OK'); }catch(e){ console.log('JS语法: ERR'); fs.unlinkSync('_c.js'); process.exit(1);}
fs.unlinkSync('_c.js');
const store={};
const lsObj={ getItem:k=>store[k]??null, setItem:(k,v)=>{store[k]=String(v)}, removeItem:k=>{delete store[k]}, key:i=>Object.keys(store)[i] };
Object.defineProperty(lsObj,'length',{get:()=>Object.keys(store).length});
global.localStorage=lsObj;
global.confirm=(msg)=>true; // 两次同意
global.alert=()=>{};global.window={};
const els={}; function mkEl(){return {style:{display:'none'},value:'',checked:false,textContent:'',set textContent(v){this._t=v},get textContent(){return this._t},click(){},files:[]};}
let out=''; global.__getOut=()=>out;
const appEl={get innerHTML(){return out},set innerHTML(x){out=String(x)},classList:{add(){},remove(){},contains(){return false}},style:{}};
global.document={getElementById:(id)=>{ if(id==='app') return appEl; if(!els[id])els[id]=mkEl(); return els[id]; },
  documentElement:{setAttribute:()=>{}},addEventListener:()=>{},querySelectorAll:()=>[],createElement:()=>({click(){},set href(v){},set download(v){},style:{}}),body:{appendChild(){},removeChild(){}}};
global.URL={createObjectURL:()=>'blob:x',revokeObjectURL:()=>{}};global.FileReader=function(){this.readAsText=()=>{};};
global.clearInterval=()=>{}; global.setInterval=()=>({});
const T=`
var fail=0; function chk(n,c){console.log((c?'✅':'❌')+' '+n); if(!c)fail++;}
function O(){ return global.__getOut(); }
S.page='home'; render();
chk('顶栏已删设置tab', O().indexOf('>设置<')<0 && O().indexOf("'设置'")<0);
S.page='setting'; render();
chk('设置页仍可访问', O().indexOf('系统数据设置')>=0);
chk('去序号①②③④⑤', O().indexOf('①')<0 && O().indexOf('④')<0 && O().indexOf('⑤')<0);
chk('保留三项标题', O().indexOf('弱项间隔重练')>=0 && O().indexOf('进度导入 / 导出')>=0 && O().indexOf('重置所有学习数据')>=0);
// resetAll 二次确认（两次都同意）
LS.set('stats',{total:5,correct:3}); LS.set('wrong',[1,2]); 
var c1=0,c2=0; global.confirm=(msg)=>{ if(c1===0){c1++; return true;} c2++; return true; };
resetAll();
chk('清空后stats为null', LS.get('stats',null)===null);
chk('清空后wrong为null', LS.get('wrong',null)===null);
S.mode='all'; S.history=[]; startQuiz();
chk('主刷题仍可用', O().indexOf('q-card')>=0);
console.log(fail===0?'ALL PASS ✅':('FAILED: '+fail));
`;
(function(){ eval(js+T); })();
