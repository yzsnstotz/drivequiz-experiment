// ==================================================
// 全局命名空间
// ==================================================
window.quizApp = {};

// ==================================================
// 启动页面控制
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splash-screen');
  const mainContent = document.getElementById('main-content');

  // 显示启动页面5秒
  setTimeout(() => {
    // 添加淡出动画类
    splashScreen.classList.add('fade-out');
    
    // 等待淡出动画完成后隐藏启动页面并显示主内容
    setTimeout(() => {
      splashScreen.style.display = 'none';
      mainContent.style.display = 'block';
    }, 500); // 500ms是淡出动画的持续时间
  }, 5000); // 5000ms = 5秒
});

// ==================================================
// 0. iOS风格弹窗/确认弹窗
// ==================================================
function showIOSAlert(title, message, onOK) {
  const mask = document.createElement('div');
  mask.style.position = 'fixed';
  mask.style.inset = '0';
  mask.style.backgroundColor = 'rgba(0,0,0,0.4)';
  mask.style.zIndex = '99999';
  mask.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.left = '50%';
  box.style.top = '50%';
  box.style.transform = 'translate(-50%,-50%)';
  box.style.width = '80%';
  box.style.maxWidth = '320px';
  box.style.background = '#fff';
  box.style.borderRadius = '14px';
  box.style.overflow = 'hidden';
  box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  box.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';

  const titleElem = document.createElement('div');
  titleElem.style.padding = '16px';
  titleElem.style.fontSize = '16px';
  titleElem.style.fontWeight = '600';
  titleElem.textContent = title;
  box.appendChild(titleElem);

  const msgElem = document.createElement('div');
  msgElem.style.padding = '0 16px 16px';
  msgElem.style.fontSize = '14px';
  msgElem.style.color = '#666';
  msgElem.textContent = message;
  box.appendChild(msgElem);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.borderTop = '1px solid #ccc';

  const okBtn = document.createElement('button');
  okBtn.style.flex = '1';
  okBtn.style.padding = '12px 0';
  okBtn.style.border = 'none';
  okBtn.style.background = 'transparent';
  okBtn.style.fontSize = '16px';
  okBtn.style.color = '#007AFF';
  okBtn.textContent = '确定';
  okBtn.addEventListener('click', () => {
    document.body.removeChild(mask);
    if (onOK) onOK();
  });

  btnRow.appendChild(okBtn);
  box.appendChild(btnRow);

  mask.appendChild(box);
  document.body.appendChild(mask);
}

function showIOSConfirm(title, message, onYes, onNo) {
  const mask = document.createElement('div');
  mask.style.position = 'fixed';
  mask.style.inset = '0';
  mask.style.backgroundColor = 'rgba(0,0,0,0.4)';
  mask.style.zIndex = '99999';
  mask.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.left = '50%';
  box.style.top = '50%';
  box.style.transform = 'translate(-50%,-50%)';
  box.style.width = '80%';
  box.style.maxWidth = '320px';
  box.style.background = '#fff';
  box.style.borderRadius = '14px';
  box.style.overflow = 'hidden';
  box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  box.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';

  const titleElem = document.createElement('div');
  titleElem.style.padding = '16px';
  titleElem.style.fontSize = '16px';
  titleElem.style.fontWeight = '600';
  titleElem.textContent = title;
  box.appendChild(titleElem);

  const msgElem = document.createElement('div');
  msgElem.style.padding = '0 16px 16px';
  msgElem.style.fontSize = '14px';
  msgElem.style.color = '#666';
  msgElem.textContent = message;
  box.appendChild(msgElem);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.borderTop = '1px solid #ccc';

  const cancelBtn = document.createElement('button');
  cancelBtn.style.flex = '1';
  cancelBtn.style.padding = '12px 0';
  cancelBtn.style.border = 'none';
  cancelBtn.style.background = 'transparent';
  cancelBtn.style.fontSize = '16px';
  cancelBtn.style.color = '#007AFF';
  cancelBtn.textContent = '取消';
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(mask);
    if (onNo) onNo();
  });

  const okBtn = document.createElement('button');
  okBtn.style.flex = '1';
  okBtn.style.padding = '12px 0';
  okBtn.style.border = 'none';
  okBtn.style.background = 'transparent';
  okBtn.style.fontSize = '16px';
  okBtn.style.color = '#007AFF';
  okBtn.textContent = '确定';
  okBtn.addEventListener('click', () => {
    document.body.removeChild(mask);
    if (onYes) onYes();
  });

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(okBtn);
  box.appendChild(btnRow);

  mask.appendChild(box);
  document.body.appendChild(mask);
}

// ==================================================
// 1. 初始化
// ==================================================
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1) 确保数据库初始化完成
    await localDataManager.initDB();

    // 2) 读取套题配置 + 渲染
    await fetchCategoriesData();
    renderCategoryCards();

    // 3) 加载收藏
    favorites = loadFavorites();

    // 4) 检查是否有存档
    if(loadCurrentExam()) {
      document.getElementById('continue-exam-func-btn').style.display='flex';
      document.getElementById('continue-exam-func-btn').classList.remove('disabled');
    } else {
      document.getElementById('continue-exam-func-btn').style.display='none';
    }

    // 5) 加载广告
    try {
      await loadTopBanner();
      await loadPopupAds();
      await loadBottomBanners();
      await loadSliderBanner();
    } catch (error) {
      console.error('加载广告资源失败:', error);
    }

    // 6) 获取用户IP写log(演示省略具体提交)
    // await getClientIPAndLogAccess();

    // 7) 检查本地版本
    await checkLocalVersion();

    // 8) 绑定暗色模式
    document.getElementById('dark-mode-switch').addEventListener('change',(e)=>{
      if(e.target.checked){
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode','true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.removeItem('darkMode');
      }
    });
    if(localStorage.getItem('darkMode')==='true'){
      document.getElementById('dark-mode-switch').checked=true;
      document.body.classList.add('dark-mode');
    }

  } catch (error) {
    console.error('初始化失败:', error);
  }
});

window.addEventListener('beforeunload', ()=>{
  if(document.getElementById('quiz-container').style.display==='block'){
    saveCurrentExam();
  }
});

// ==================================================
// 全局变量
// ==================================================
let logs = [];

let userLocation = "未知地点";
let categoriesData = [];
let sheetListForBattle = [];

// 当前考试相关
let questions = [];
let currentQuestionIndex = 0;
let currentSheetName = "";
let userAnswers = [];
let answerVisible = false;
let mistakeQuestions = [];
let favorites = {};

let isBattleMode = false;    // 是否大乱斗
let isMistakeMode = false;
let isFavoritesMode = false;

// 计时器
window.quizStartTime = null;
window.quizEndTime = null;
window.timerInterval = null;
window.elapsedTime = 0;

// 三大复选框
let randomOrder = loadRandomOrderSetting();
let autoNext = loadAutoNextSetting();
let showJapanese = loadShowJapaneseSetting();

let currentExamId = null;

// ==================================================
// 大乱斗相关变量
// ==================================================
let battleScore = 0;
let battleLives = 5;
let battleTimeLeft = 20.0;
let battleTimerInterval = null;
let battleIntroShown = false;
let battleCountdownTimeout = null;
let battleImageLoadingProgress = {
  total: 0,
  loaded: 0,
  currentIndex: 0
};

// ==================================================
// 2. 通用函数
// ==================================================
function resetQuiz() {
  stopTimer();
  stopBattleTimer();

  currentQuestionIndex = 0;
  questions = [];
  userAnswers = [];
  answerVisible = false;
  currentSheetName = "";
  mistakeQuestions = [];
  isBattleMode = false;
  isMistakeMode = false;
  isFavoritesMode = false;

  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('container').style.display = 'block';

  // 重置大乱斗
  battleScore = 0;
  battleLives = 5;
  battleTimeLeft = 20.0;

  // 重置所有按钮显示状态
  updateButtonsVisibility(false);

  // 隐藏大乱斗特有的元素
  document.getElementById('battle-header').style.display = 'none';
  document.getElementById('battle-loading-bar-wrap').style.display = 'none';
}

// 统一隐藏所有容器
function hideAll(){
  document.getElementById('container').style.display='none';
  document.getElementById('quiz-container').style.display='none';
  document.getElementById('result-container').style.display='none';
  document.getElementById('mistake-review-container').style.display='none';
  document.getElementById('current-mistakes-container').style.display='none';
  document.getElementById('favorites-container').style.display='none';
  document.getElementById('summary-container').style.display='none';
  document.getElementById('campus-life-container').style.display='none';
  document.getElementById('car-surrounding-container').style.display='none';
  document.getElementById('personal-center-container').style.display='none';
}

// 底部导航切换
function switchTab(tab){
  const functionsRow = document.querySelector('.functions-row');
  Array.from(document.querySelectorAll('.tabbar-item')).forEach(el=>{
    el.classList.remove('active');
  });

  hideAll(); // 避免页面串
  document.getElementById('summary-container').style.display='none'; // 确保做题历史容器被隐藏

  if(tab==='home'){
    document.querySelectorAll('.tabbar-item')[0].classList.add('active');
    resetQuiz(); // 回到首页
    functionsRow.style.display = 'flex';
    document.getElementById('container').style.display='block';
  } else if(tab==='campus'){
    document.querySelectorAll('.tabbar-item')[1].classList.add('active');
    showCampusLife();
    functionsRow.style.display = 'none';
  } else if(tab==='car'){
    document.querySelectorAll('.tabbar-item')[2].classList.add('active');
    showCarSurrounding();
    functionsRow.style.display = 'none';
  } else if(tab==='ai'){
    document.querySelectorAll('.tabbar-item')[3].classList.add('active');
    functionsRow.style.display = 'none';
    showIOSAlert("提示","AI咨询功能暂未实现");
  } else if(tab==='personal'){
    document.querySelectorAll('.tabbar-item')[4].classList.add('active');
    document.getElementById('personal-center-container').style.display='block';
    functionsRow.style.display = 'none';
  }
}

// 随机题序、自动翻题、是否显示日语
function loadRandomOrderSetting(){
  return localStorage.getItem('randomOrder')==='true';
}
function saveRandomOrderSetting(v){
  localStorage.setItem('randomOrder', v?'true':'false');
}
function loadAutoNextSetting(){
  return localStorage.getItem('autoNext')==='true';
}
function saveAutoNextSetting(v){
  localStorage.setItem('autoNext', v?'true':'false');
}
function loadShowJapaneseSetting(){
  return localStorage.getItem('showJapanese')==='true';
}
function saveShowJapaneseSetting(v){
  localStorage.setItem('showJapanese', v?'true':'false');
}

// ==================================================
// 3. 考题数据获取 + UI渲染
// ==================================================
const SYSTEM_SPREADSHEET_ID = "1JJNB6216xpR7PwyID1P2Caw92MTGF8EUKs-0bE-ZsXQ";
const SYSTEM_API_KEY = "AIzaSyApEcu1zgGEexoS_diT6PkCPQDWkX5Adhk";
const SYSTEM_CN_SHEET_NAME = "ZH";

async function fetchCategoriesData(retryCount = 3, retryDelay = 1000) {
  try {
    for(let attempt=1; attempt<=retryCount; attempt++){
      try{
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SYSTEM_SPREADSHEET_ID}/values/考题管理!A:G?key=${SYSTEM_API_KEY}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(()=> controller.abort(), 10000);
        const r = await fetch(url,{ 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'Origin': window.location.origin
          }
        });
        clearTimeout(timeoutId);

        if(!r.ok){
          const errorMessage = `请求失败: HTTP ${r.status} ${r.statusText}`;
          console.warn(errorMessage);
          throw new Error(errorMessage);
        }
        const dat = await r.json();
        if(!dat.values || dat.values.length<2){
          const errorMessage = "考题管理Sheet数据为空或格式不正确";
          console.warn(errorMessage);
          throw new Error(errorMessage);
        }
        const rows = dat.values.slice(1);
        categoriesData = rows.map(row=>({
          internalName:(row[0]||"").trim(),
          lang:(row[1]||"").trim(),
          categoryName:(row[2]||"").trim(),
          sheetName:(row[3]||"").trim(),
          spreadId:(row[4]||"").trim(),
          apiKey:(row[5]||"").trim(),
          internalCode:(row[6]||"").trim()
        })).filter(x=> x.categoryName && x.sheetName && x.spreadId && x.apiKey);

        if(!categoriesData.length){
          const msg="没有找到有效的考题分类数据";
          console.warn(msg);
          throw new Error(msg);
        }
        renderCategoryCards();
        return;
      }catch(e){
        const isTimeout=e.name==='AbortError';
        const isNetworkError=e instanceof TypeError && e.message.includes('fetch');
        const errorMsg=isTimeout?'请求超时':isNetworkError?'网络连接失败': e.message;
        console.error(`第${attempt}次获取考题分类数据失败: ${errorMsg}`);

        if(attempt===retryCount){
          throw new Error(errorMsg);
        }
        const delay = retryDelay * Math.pow(2, attempt-1);
        await new Promise(res=> setTimeout(res, delay));
      }
    }
  } catch(e){
    console.error('获取考题分类最终失败:', e);
    categoriesData=[];
    const errorMessage = e.message.includes('网络') ? '网络连接失败，请稍后重试'
      : e.message.includes('超时') ? '服务器响应超时，请稍后重试'
      : '获取数据失败，请稍后重试';
    document.getElementById('sheet-name').textContent= errorMessage;
    document.getElementById('category-list-wrap').innerHTML=
      `<div class="error-message">${errorMessage}<br><button onclick="location.reload()" class="retry-btn">重新加载</button></div>`;
  }
}

// 给题库类型（或分类）配一个更好看的图标
function getIosStyleIconForCategory() {
  // 这里放一个更美观一点的iOS感Material Icon
  // 您可以按需替换，以下只是示例
  return `
    <div class="category-icon-container" style="display:flex;align-items:center;justify-content:center;">
      <svg width="32" height="32" viewBox="0 0 512 512" fill="#666">
        <path d="M256 48c-70.7 0-128 57.3-128 128v64h32v-64c0-53 43-96 96-96s96 43 96 96v64h32v-64c0-70.7-57.3-128-128-128z"></path>
        <path d="M144 288v128h224V288H144zm16 16h192v96H160v-96z"></path>
      </svg>
    </div>
  `;
}

function renderCategoryCards(){
  const wrap= document.getElementById('category-list-wrap');
  wrap.innerHTML="";

  const catMap={};
  categoriesData.forEach(item=>{
    if(item.lang==="ZH"){
      if(!catMap[item.categoryName]){
        catMap[item.categoryName]=[];
      }
      catMap[item.categoryName].push(item);
    }
  });
  const finalArr= Object.keys(catMap).map(k=>({
    name:k, list:catMap[k]
  }));

  finalArr.forEach(catObj=>{
    const card = document.createElement('div');
    card.className="category-card";
    card.innerHTML= `
      ${getIosStyleIconForCategory()}
      <div class="category-text">${catObj.name}</div>
    `;
    card.onclick=()=>{
      showSheetButtons(catObj.list);
    };
    wrap.appendChild(card);
  });
}

function showSheetButtons(sheetArr){
  const wrap= document.getElementById('category-list-wrap');
  wrap.innerHTML="";
  if(!sheetArr|| !sheetArr.length){
    wrap.innerHTML="<div style='color:#888;padding:10px;'>该类别暂无套题</div>";
    return;
  }
  sheetArr.forEach(sobj=>{
    const card = document.createElement('div');
    card.className="category-card";
    card.innerHTML=`
      ${getIosStyleIconForCategory()}
      <div class="category-text">${sobj.sheetName||"[无标题]"}</div>
    `;
    card.onclick=()=>{
      fetchQuestionsCN(sobj);
    };
    wrap.appendChild(card);
  });

  // 返回上一级
  const backCard = document.createElement('div');
  backCard.className="category-card";
  backCard.innerHTML=`
    <div class="category-icon-container" style="display:flex;align-items:center;justify-content:center;">
      <svg width="32" height="32" fill="#666" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
    </div>
    <div class="category-text">返回</div>
  `;
  backCard.onclick= renderCategoryCards;
  wrap.appendChild(backCard);
}

async function fetchQuestionsCN(sobj){
  try{
    document.getElementById('sheet-name').textContent="加载中...";
    document.getElementById('question').textContent="加载中...";

    // 先从本地拿
    let localQs = await localDataManager.getQuizData('ZH', sobj.internalCode);
    let cnQuestions;
    if(localQs && localQs.length){
      cnQuestions= localQs;
    } else {
      // 不在本地，则去在线
      let urlCN= `https://sheets.googleapis.com/v4/spreadsheets/${sobj.spreadId}/values/${encodeURIComponent(sobj.sheetName)}?key=${sobj.apiKey}`;
      let resp= await fetch(urlCN);
      if(!resp.ok) throw new Error("fetch ZH question failed: " + sobj.sheetName);
      let d= await resp.json();
      if(!d.values|| !d.values.length) throw new Error("fetch ZH question empty:" + sobj.sheetName);
      cnQuestions= processSheetData(d.values);
      // 保存
      await localDataManager.saveQuizData('ZH', sobj.internalCode, cnQuestions);
    }

    // 如果需要日语
    if(showJapanese){
      let jpItem = categoriesData.find(x=> x.lang==="JA" && x.internalCode=== sobj.internalCode);
      if(jpItem){
        try{
          let urlJP= `https://sheets.googleapis.com/v4/spreadsheets/${jpItem.spreadId}/values/${encodeURIComponent(jpItem.sheetName)}?key=${jpItem.apiKey}`;
          let jr= await fetch(urlJP);
          if(jr.ok){
            let jd= await jr.json();
            if(jd.values && jd.values.length>0){
              let arrJP= processSheetData(jd.values,true);
              cnQuestions.forEach((q,i)=>{
                if(arrJP[i]){
                  q.jpQuestion= arrJP[i].question;
                  q.jpExplanation= arrJP[i].explanation;
                }
              });
            }
          }
        }catch(e2){}
      }
    }

    currentSheetName= sobj.sheetName;
    questions= randomOrder? shuffle(cnQuestions): cnQuestions;
    isBattleMode=false;
    isMistakeMode=false;
    isFavoritesMode=false;

    // 缓存图片
    for(const q of questions){
      q.spreadId= sobj.spreadId;
      q.apiKey= sobj.apiKey;
      q.sheetName= sobj.sheetName;
      q.internalCode= sobj.internalCode;
      if(q.image){
        await localDataManager.downloadAndCacheImage(q.image);
      }
    }

    startQuiz();
  } catch(e){
    console.error(e);
    document.getElementById('sheet-name').textContent=`加载套题[${sobj.sheetName}]失败`;
    document.getElementById('question').textContent="";
  }
}

function processSheetData(values, isJP=false){
  return values.map((row, idx)=>{
    let q = (row[0]||"").trim().replace(/\u200B/g,'');
    let img= (row[1]||"").trim();
    let ans= ((row[2]||"").trim().toLowerCase()==='o')?'⭕':'❌';
    let exp= (row[3]||"").trim();
    return {
      rowIndex: idx,
      question: isJP? q: (q||"无题目"),
      image: img,
      answer: ans,
      explanation: exp
    };
  }).filter(q=> isJP || q.question!=="无题目");
}

function shuffle(arr){
  for(let i= arr.length-1; i>0; i--){
    const j= Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]]=[arr[j], arr[i]];
  }
  return arr;
}

// 启动普通模式
function startQuiz(){
  currentQuestionIndex=0;
  userAnswers=[];
  answerVisible=false;
  mistakeQuestions=[];
  elapsedTime=0;
  currentExamId= Date.now().toString();
  clearCurrentExam();

  hideAll();
  document.getElementById('quiz-container').style.display='block';
  document.getElementById('sheet-name').textContent=`当前套题：${currentSheetName}`;

  if(!isBattleMode){
    loadQuestion();
    startTimer();
  }
}

// 加载单题
async function loadQuestion(){
  const q= questions[currentQuestionIndex];
  if(!q) return;

  const questionElem= document.getElementById('question');
  const imageContainer= document.getElementById('image');
  const favoriteBtn= document.getElementById('favorite-btn');
  document.getElementById('answer-display').textContent="";

  let text= q.question;
  if(showJapanese && q.jpQuestion){
    text+= "\n-----\n"+ q.jpQuestion;
  }
  questionElem.textContent= text;

  imageContainer.style.display='none';
  imageContainer.innerHTML="";

  if(q.image){
    let localURL= await localDataManager.getLocalImage(q.image);
    if(localURL){
      imageContainer.style.display='flex';
      let img= new Image();
      img.src= localURL;
      img.onload=()=>{
        imageContainer.innerHTML="";
        imageContainer.appendChild(img);
      };
      img.onerror=()=>{
        imageContainer.style.display='none';
      };
    } else {
      // 线上获取
      imageContainer.style.display='flex';
      imageContainer.textContent="加载中...";
      let netImg= new Image();
      netImg.src= q.image;
      netImg.onload= async()=>{
        imageContainer.innerHTML="";
        imageContainer.appendChild(netImg);
        await localDataManager.downloadAndCacheImage(q.image);
      };
      netImg.onerror=()=>{
        imageContainer.style.display='none';
      };
    }
  }

  resetButtonHighlight();
  let ans= userAnswers[currentQuestionIndex];
  if(ans==="⭕") document.getElementById('btn-correct').classList.add('highlight');
  if(ans==="❌") document.getElementById('btn-wrong').classList.add('highlight');

  // 如果是大乱斗，不显示“剩余题数”
  const remainElem= document.getElementById('remaining-questions');
  if(isBattleMode){
    remainElem.textContent="";
  } else {
    remainElem.textContent= `剩余题数：${(questions.length - currentQuestionIndex -1)}`;
  }

  favoriteBtn.classList.remove('favorited');
  let favKey= getFavoriteKey(q);
  if(favorites[favKey]) favoriteBtn.classList.add('favorited');

  saveCurrentExam();
}

function resetButtonHighlight(){
  document.getElementById('btn-correct').classList.remove('highlight');
  document.getElementById('btn-wrong').classList.remove('highlight');
}

function selectAnswer(ans){
  userAnswers[currentQuestionIndex]= ans;
  resetButtonHighlight();
  if(ans==="⭕") document.getElementById('btn-correct').classList.add('highlight');
  if(ans==="❌") document.getElementById('btn-wrong').classList.add('highlight');

  if(isBattleMode){
    checkBattleAnswer(ans);
    return;
  }

  saveCurrentExam();
  if(autoNext){
    setTimeout(()=>{
      if(currentQuestionIndex<questions.length-1){
        currentQuestionIndex++;
        loadQuestion();
      } else {
        showIOSAlert("提示","已到最后一题，请交卷");
      }
    },300);
    if(currentQuestionIndex===questions.length-1){
      setTimeout(()=>submitQuiz(),500);
    }
  }
}

function toggleAnswer(){
  const q= questions[currentQuestionIndex];
  if(!q) return;
  const disp= document.getElementById('answer-display');
  if(answerVisible){
    disp.textContent="";
  } else {
    let txt= `正确答案：${q.answer}`;
    if(q.explanation) txt+= `\n解说：${q.explanation}`;
    if(showJapanese && q.jpExplanation){
      txt+= `\n-----\n【日文解说】\n${q.jpExplanation}`;
    }
    disp.textContent= txt;
  }
  answerVisible=!answerVisible;
}

function nextQuestion(){
  if(currentQuestionIndex<questions.length-1){
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showIOSAlert("提示","已是最后一题");
  }
}

function previousQuestion(){
  if(currentQuestionIndex>0){
    currentQuestionIndex--;
    loadQuestion();
  }
}

function getFavoriteKey(q){
  return [q.spreadId, q.rowIndex, q.sheetName, q.question].join("||");
}

function toggleFavorite(){
  const q= questions[currentQuestionIndex];
  let favKey= getFavoriteKey(q);
  const btn= document.getElementById('favorite-btn');
  if(favorites[favKey]){
    delete favorites[favKey];
    btn.classList.remove('favorited');
  } else {
    favorites[favKey]={
      rowIndex: q.rowIndex,
      question: q.question,
      image: q.image,
      answer: q.answer,
      explanation: q.explanation,
      spreadId: q.spreadId,
      apiKey: q.apiKey,
      sheetName: q.sheetName,
      internalCode: q.internalCode||"",
      jpQuestion: q.jpQuestion||"",
      jpExplanation: q.jpExplanation||""
    };
    btn.classList.add('favorited');
  }
  saveFavorites(favorites);
}

function showFavorites(){
  hideAll();
  document.getElementById('favorites-container').style.display='block';
  let favKeys= Object.keys(favorites);
  document.getElementById('favorites-count').textContent=`已收藏 ${favKeys.length} 道题目`;
  let listDiv= document.getElementById('favorites-list');
  listDiv.innerHTML="";
  if(!favKeys.length){
    listDiv.innerHTML="<p>暂无收藏题目</p>";
    return;
  }
  favKeys.forEach(k=>{
    let item= favorites[k];
    let card= document.createElement('div');
    card.className="favorite-card";
    let content= document.createElement('div');
    content.className="favorite-card-swipe";
    let qText= item.question;
    if(showJapanese && item.jpQuestion){
      qText+= "\n-----\n"+ item.jpQuestion;
    }
    content.innerHTML=`
      <div class="fav-question">${qText}</div>
      ${item.image?`<div class="fav-image"><img src="${item.image}"/></div>`:''}
    `;
    let removeBtn= document.createElement('div');
    removeBtn.className="favorite-remove-btn";
    removeBtn.textContent="取消收藏";
    removeBtn.onclick=(e)=>{
      e.stopPropagation();
      delete favorites[k];
      saveFavorites(favorites);
      showFavorites();
    };

    let startX=0, currentX=0, isSwiping=false;
    content.addEventListener('touchstart',(ev)=>{
      if(ev.touches.length===1){
        startX= ev.touches[0].clientX;
        isSwiping=true;
      }
    });
    content.addEventListener('touchmove',(ev)=>{
      if(isSwiping && ev.touches.length===1){
        currentX= ev.touches[0].clientX;
        let diff= currentX - startX;
        if(diff<0 && diff>=-80){
          content.style.transform=`translateX(${diff}px)`;
        }
      }
    });
    content.addEventListener('touchend',(ev)=>{
      isSwiping=false;
      let diff= currentX - startX;
      if(diff<-40){
        content.style.transform="translateX(-80px)";
      } else {
        content.style.transform="translateX(0)";
      }
    });

    card.appendChild(content);
    card.appendChild(removeBtn);
    listDiv.appendChild(card);
  });
}

// 启动收藏模式
async function startFavoritesQuiz(){
  let favKeys= Object.keys(favorites);
  if(!favKeys.length){
    showIOSAlert("提示","暂无收藏题目");
    return;
  }
  isFavoritesMode=true;
  isBattleMode=false;
  isMistakeMode=false;
  currentSheetName="我的收藏";

  let groupMap={};
  favKeys.forEach(k=>{
    let it= favorites[k];
    let gk= it.spreadId+"||"+ it.sheetName;
    if(!groupMap[gk]) groupMap[gk]=[];
    groupMap[gk].push(it);
  });

  let allFavs=[];
  for(const gk in groupMap){
    let [spId, sName]= gk.split("||");
    if(!spId||!sName) continue;
    let baseArr=[];
    try{
      let baseUrl= `https://sheets.googleapis.com/v4/spreadsheets/${spId}/values/${encodeURIComponent(sName)}?key=${groupMap[gk][0].apiKey}`;
      let r= await fetch(baseUrl);
      if(r.ok){
        let d= await r.json();
        if(d.values && d.values.length>0){
          baseArr= processSheetData(d.values);
        }
      }
    }catch(e){}
    if(showJapanese){
      let iCode= groupMap[gk][0].internalCode||"";
      let jpRow= categoriesData.find(x=> x.lang==="JA" && x.internalCode===iCode && x.spreadId=== spId);
      if(jpRow){
        try{
          let urlJP= `https://sheets.googleapis.com/v4/spreadsheets/${jpRow.spreadId}/values/${encodeURIComponent(jpRow.sheetName)}?key=${jpRow.apiKey}`;
          let jr= await fetch(urlJP);
          if(jr.ok){
            let jd= await jr.json();
            if(jd.values && jd.values.length>0){
              let jpArr= processSheetData(jd.values,true);
              baseArr.forEach((q,idx)=>{
                if(jpArr[idx]){
                  q.jpQuestion= jpArr[idx].question;
                  q.jpExplanation= jpArr[idx].explanation;
                }
              });
            }
          }
        }catch(e2){}
      }
    }
    let favSet= new Set();
    groupMap[gk].forEach(fi=>{
      let rowIdx= fi.rowIndex;
      let found= baseArr[rowIdx];
      let key= spId+"_"+rowIdx;
      if(!favSet.has(key)){
        favSet.add(key);
        if(found){
          allFavs.push({
            ...found,
            spreadId: spId, apiKey: fi.apiKey,
            sheetName: sName, internalCode: fi.internalCode||"",
            jpQuestion: found.jpQuestion||"",
            jpExplanation: found.jpExplanation||""
          });
        } else {
          allFavs.push({...fi});
        }
      }
    });
  }
  if(!allFavs.length){
    showIOSAlert("提示","收藏数据为空");
    return;
  }
  questions= randomOrder? shuffle(allFavs): allFavs;
  currentQuestionIndex=0;
  userAnswers=[];
  answerVisible=false;
  mistakeQuestions=[];
  elapsedTime=0;
  currentExamId= Date.now().toString();

  clearCurrentExam();
  hideAll();
  document.getElementById('quiz-container').style.display='block';
  document.getElementById('sheet-name').textContent="收藏题单元测试";
  loadQuestion();
  startTimer();
}

// ==================================================
// 4. 大乱斗模式
// ==================================================
async function openBattleMode(){
  if(!battleIntroShown){
    showBattleIntroPopup();
  } else {
    startBattleGame();
  }
}

// 专门管理按钮显示状态的函数
function updateButtonsVisibility(isBattleMode) {
  // 控制导航按钮和退出按钮
  const prevQuestionBtn = document.getElementById('prev-question-btn');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const exitBattleBtn = document.getElementById('exit-battle-btn');
  const normalQuizControls = document.getElementById('normal-quiz-controls');
  
  if (prevQuestionBtn) prevQuestionBtn.style.display = isBattleMode ? 'none' : 'block';
  if (nextQuestionBtn) nextQuestionBtn.style.display = isBattleMode ? 'none' : 'block';
  if (exitBattleBtn) exitBattleBtn.style.display = isBattleMode ? 'block' : 'none';
  
  // 完全隐藏/显示普通模式控制区
  if (normalQuizControls) {
      normalQuizControls.style.display = isBattleMode ? 'none' : 'block';
  }
}


// Add exit battle game function
function exitBattleGame() {
  showIOSConfirm("确认退出", "确定要退出大乱斗模式吗？当前进度将不会保存。", () => {
      resetQuiz();
  }, () => {
      // User canceled, do nothing
  });
}

function showBattleIntroPopup(){
  battleIntroShown=true;
  let title="大乱斗游戏规则";
  let msg= "1. 初始生命值5，积分0。\n"+
           "2. 答对+10分，答错-1生命。\n"+
           "3. 倒计时随分数提高而缩短(最短3秒)。\n"+
           "4. 生命值=0则游戏结束。\n";
  showIOSConfirm(title, msg, ()=>{
    startBattleGame();
  }, ()=>{});
}

// // **核心：获取全题库**(本地优先，不足则在线)
// async function fetchAllZhQuestionsForBattle(){
//   // 先从本地拿到全部ZH题
//   let zhCategories= categoriesData.filter(x=> x.lang==="ZH");
//   let localAll=[];
//   for(const sobj of zhCategories){
//     let localQs= await localDataManager.getQuizData('ZH', sobj.internalCode);
//     if(localQs && localQs.length){
//       // 补充spreadId等
//       localQs.forEach(q=>{
//         q.spreadId= sobj.spreadId;
//         q.apiKey= sobj.apiKey;
//         q.sheetName= sobj.sheetName;
//         q.internalCode= sobj.internalCode;
//       });
//       localAll.push(...localQs);
//     }
//   }
//   // 如果本地已经很多，直接返回
//   if(localAll.length>0){
//     // 同时我们也可以在后台再去在线获取(若需要更多)
//     // 先返回本地
//     return localAll;
//   }

//   // 如果本地为空，则去在线拉
//   let bigArr=[];
//   for(const sobj of zhCategories){
//     try{
//       let url= `https://sheets.googleapis.com/v4/spreadsheets/${sobj.spreadId}/values/${encodeURIComponent(sobj.sheetName)}?key=${sobj.apiKey}`;
//       let resp= await fetch(url);
//       if(resp.ok){
//         let d= await resp.json();
//         if(d.values && d.values.length>0){
//           let arr= processSheetData(d.values);
//           // 保存到DB
//           await localDataManager.saveQuizData('ZH', sobj.internalCode, arr);
//           // 同步图片
//           for(const q of arr){
//             q.spreadId= sobj.spreadId;
//             q.apiKey= sobj.apiKey;
//             q.sheetName= sobj.sheetName;
//             q.internalCode= sobj.internalCode||"";
//             if(q.image){
//               await localDataManager.downloadAndCacheImage(q.image);
//             }
//           }
//           bigArr.push(...arr);
//         }
//       }
//     }catch(e){
//       console.warn("在线获取题目失败:", sobj.sheetName, e);
//     }
//   }
//   return bigArr;
// }

/**
 * Load battle questions with local-first strategy
 * @returns {Promise<Array>} Array of questions
 */
async function loadBattleQuestions() {
  // First log the initial state
  console.log('=== 开始加载大乱斗题库 ===');
  
  const zhCategories = categoriesData.filter(x => x.lang === "ZH");
  let allQuestions = [];
  let needsUpdate = false;
  
  // Check local storage first
  for (const category of zhCategories) {
      const localData = await localDataManager.getQuizData('ZH', category.internalCode);
      if (localData && localData.length) {
          console.log(`本地已有题库: ${category.sheetName}, 数量: ${localData.length}`);
          allQuestions.push(...localData.map(q => ({
              ...q,
              spreadId: category.spreadId,
              apiKey: category.apiKey,
              sheetName: category.sheetName,
              internalCode: category.internalCode
          })));
      } else {
          console.log(`需要下载题库: ${category.sheetName}`);
          needsUpdate = true;
      }
  }

  // If any category is missing or we need to update
  if (needsUpdate || allQuestions.length < 100) {
      console.log('开始在线更新题库...');
      
      for (const category of zhCategories) {
          try {
              const url = `https://sheets.googleapis.com/v4/spreadsheets/${category.spreadId}/values/${encodeURIComponent(category.sheetName)}?key=${category.apiKey}`;
              const response = await fetch(url);
              
              if (response.ok) {
                  const data = await response.json();
                  if (data.values && data.values.length > 0) {
                      const processedQuestions = processSheetData(data.values);
                      const questionsWithMetadata = processedQuestions.map(q => ({
                          ...q,
                          spreadId: category.spreadId,
                          apiKey: category.apiKey,
                          sheetName: category.sheetName,
                          internalCode: category.internalCode
                      }));

                      // Save to IndexedDB
                      await localDataManager.saveQuizData('ZH', category.internalCode, questionsWithMetadata);
                      console.log(`已更新题库: ${category.sheetName}, 题目数: ${questionsWithMetadata.length}`);
                      
                      // Update our current collection
                      allQuestions = allQuestions.filter(q => q.internalCode !== category.internalCode);
                      allQuestions.push(...questionsWithMetadata);
                  }
              }
          } catch (error) {
              console.error(`更新题库失败: ${category.sheetName}`, error);
          }
      }
  }

  console.log(`题库准备完成，总题目数: ${allQuestions.length}`);
  return allQuestions;
}

/**
 * Preload a single question's image
 * @param {Object} question Question object containing image URL
 */
async function preloadQuestionImage(question) {
  if (!question.image) return;

  try {
      // Always check local storage first
      const hasLocal = await localDataManager.hasLocalImage(question.image);
      console.log(`图片缓存检查: ${question.image}, 本地${hasLocal ? '已有' : '没有'}`);
      
      if (!hasLocal) {
          // Only download if not in local storage
          await localDataManager.downloadAndCacheImage(question.image);
          console.log(`图片已下载: ${question.image}`);
      }
      
      battleImageLoadingProgress.loaded++;
      console.log(`图片加载进度: ${battleImageLoadingProgress.loaded}/${battleImageLoadingProgress.total}`);
      updateBattleLoadingProgress();
  } catch (e) {
      console.warn(`图片预加载失败: ${question.image}`, e);
  }
}

/**
 * Background process to preload remaining images
 * @param {Array} questions Array of questions to preload images for
 */
async function backgroundImagePreload(questions) {
  const batchSize = 3; // Process 3 images at a time
  
  while (battleImageLoadingProgress.currentIndex < questions.length) {
      const batch = questions.slice(
          battleImageLoadingProgress.currentIndex,
          battleImageLoadingProgress.currentIndex + batchSize
      );

      await Promise.all(
          batch.map(async question => {
              if (question.image) {
                  await preloadQuestionImage(question);
              }
          })
      );

      battleImageLoadingProgress.currentIndex += batchSize;
      
      // Small delay between batches to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
  }
}



/**
 * Start background preloading of images for battle questions
 * @param {Array} questions Array of questions to preload images for
 */
async function startBackgroundImagePreload(questions) {
  // Reset progress tracking
  battleImageLoadingProgress = {
      total: questions.filter(q => q.image).length,
      loaded: 0,
      currentIndex: 0
  };

  // Start with current question's image
  if (currentQuestionIndex >= 0 && questions[currentQuestionIndex]?.image) {
      await preloadQuestionImage(questions[currentQuestionIndex]);
  }

  // Then load the rest in background
  backgroundImagePreload(questions);
}

// 大乱斗开始
let allBattleQuestions = [];  // 全部题库(本地+在线)；中途也可能再次加载
async function startBattleGame() {
  isBattleMode = true;
  isMistakeMode = false;
  isFavoritesMode = false;

  resetQuiz();
  isBattleMode = true;

  hideAll();
  document.getElementById('quiz-container').style.display = 'block';
  document.getElementById('battle-header').style.display = 'flex';
  document.getElementById('battle-loading-bar-wrap').style.display = 'block';

  updateButtonsVisibility(true);
  
  // Initialize game state
  battleScore = 0;
  battleLives = 5;
  battleTimeLeft = 20.0;

  document.getElementById('sheet-name').textContent = "大乱斗加载中...";

  // Step 1: Load all text questions first (priority)
  let loadedQuestions = await loadBattleQuestions();
  if (!loadedQuestions.length) {
      showIOSAlert("提示", "无法获取任何题目");
      resetQuiz();
      return;
  }

  // Shuffle questions immediately after loading
  loadedQuestions = shuffle(loadedQuestions);
  allBattleQuestions = loadedQuestions;
  questions = allBattleQuestions; // Set questions immediately

  // Setup initial state before countdown
  currentQuestionIndex = 0;
  userAnswers = [];
  mistakeQuestions = [];
  elapsedTime = 0;
  currentExamId = Date.now().toString();
  clearCurrentExam();
  
  // Load first question before countdown
  await loadQuestion();

  // Update progress to 50% after loading text content
  updateBattleLoadingBar(50);

  // Start background image preloading
  startBackgroundImagePreload(questions);

  // Show 3-second countdown and start the game
  showBattleCountdown(() => {
      document.getElementById('sheet-name').textContent = "大乱斗进行中...";
      startBattleTimer();
  });
}
/**
 * Update the loading progress bar based on image loading progress
 */
function updateBattleLoadingProgress() {
  if (battleImageLoadingProgress.total === 0) return;
  
  const baseProgress = 50; // Text content loading accounts for first 50%
  const imageProgress = (battleImageLoadingProgress.loaded / battleImageLoadingProgress.total) * 50;
  const totalProgress = Math.min(baseProgress + imageProgress, 100);
  
  updateBattleLoadingBar(totalProgress);
}


/**
 * Update the BattleloadingBar
 */
function updateBattleLoadingBar(pct){
  const bar= document.getElementById('battle-loading-bar');
  bar.style.width= pct+'%';
  bar.textContent= pct+'%';
}


function showBattleCountdown(onFinish){
  stopBattleTimer();
  document.getElementById('battle-loading-bar-wrap').style.display='none';

  let overlay= document.createElement('div');
  overlay.style.position='fixed';
  overlay.style.inset='0';
  overlay.style.background='rgba(0,0,0,0.7)';
  overlay.style.zIndex='9999';
  overlay.style.display='flex';
  overlay.style.alignItems='center';
  overlay.style.justifyContent='center';
  overlay.style.fontSize='60px';
  overlay.style.color='#fff';

  let num=3;
  overlay.textContent=num;
  document.body.appendChild(overlay);

  battleCountdownTimeout= setInterval(()=>{
    num--;
    if(num<=0){
      clearInterval(battleCountdownTimeout);
      document.body.removeChild(overlay);
      if(onFinish) onFinish();
    }else{
      overlay.textContent=num;
    }
  },1000);
}

// 计时
function startBattleTimer(){
  stopBattleTimer();
  // 动态计算
  let dynamicSec= 20 - (battleScore/50);
  if(dynamicSec<3) dynamicSec=3;
  battleTimeLeft= parseFloat(dynamicSec.toFixed(2));

  updateBattleHeader();

  battleTimerInterval= setInterval(()=>{
    battleTimeLeft-=0.01;
    if(battleTimeLeft<=0){
      loseOneLife();
    } else {
      updateBattleHeader();
    }
  },10);
}

function stopBattleTimer(){
  if(battleTimerInterval){
    clearInterval(battleTimerInterval);
    battleTimerInterval=null;
  }
}

function updateBattleHeader(){
  document.getElementById('battle-score').textContent= `得分:${battleScore}`;
  let hearts="";
  for(let i=0;i<battleLives;i++){
    hearts+="❤️";
  }
  document.getElementById('battle-lives').textContent=`生命值:${hearts}`;
  document.getElementById('battle-timer').textContent=`时间:${battleTimeLeft.toFixed(2)}s`;
}

function loseOneLife(){
  stopBattleTimer();
  battleLives--;
  updateBattleHeader();
  userAnswers[currentQuestionIndex]=""; // 超时

  if(battleLives<=0){
    battleGameOver();
    return;
  }
  nextBattleQuestion();
}

function checkBattleAnswer(ans){
  stopBattleTimer();
  const q= questions[currentQuestionIndex];

  if (!q) {
    console.error('Question not found at index:', currentQuestionIndex);
    return;
}

userAnswers[currentQuestionIndex]= ans;
  if(ans=== q.answer){
    battleScore+= 10;
  } else {
    battleLives--;
  }
  updateBattleHeader();
  if(battleLives<=0){
    battleGameOver();
    return;
  }
  nextBattleQuestion();
}

async function nextBattleQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) {
      console.error('Current question not found');
      battleGameOver();
      return;
  }

  const userAns = userAnswers[currentQuestionIndex];
  if (userAns !== q.answer) {
      mistakeQuestions.push({ ...q, userAnswer: userAns });
  }

  currentQuestionIndex++;
  
  // If we've reached the end of current questions
  if (currentQuestionIndex >= questions.length) {
      showIOSAlert("提示", "正在加载更多题目,请稍后...", async () => {
          const newQuestions = await loadBattleQuestions();
          if (newQuestions && newQuestions.length > questions.length) {
              allBattleQuestions = shuffle(newQuestions);
              questions = allBattleQuestions;
              currentQuestionIndex = 0;
              loadQuestion();
              startBattleTimer();
          } else {
              battleGameOver();
          }
      });
      return;
  }

  loadQuestion();
  startBattleTimer();
}

function battleGameOver(){
  stopBattleTimer();
  // 最后一题漏记录
  if(currentQuestionIndex<questions.length){
    const q= questions[currentQuestionIndex];
    const userAns= userAnswers[currentQuestionIndex]||"";
    if(userAns!== q.answer){
      mistakeQuestions.push({...q, userAnswer:userAns});
    }
  }

  hideAll();
  document.getElementById('quiz-container').style.display='block';
  document.getElementById('sheet-name').textContent="大乱斗结束";

  showIOSAlert("游戏结束", `您的得分：${battleScore}`, ()=>{
    resetQuiz();
  });
}

// ==================================================
// 5. 错题复习
// ==================================================
function startMistakeQuiz(){
  let mObj= loadMistakesFromCache();
  let keys= Object.keys(mObj);
  if(!keys.length){
    showIOSAlert("提示","没有错题记录");
    return;
  }
  isMistakeMode=true;
  isBattleMode=false;
  isFavoritesMode=false;
  currentSheetName="错题集";

  let groupMap={};
  keys.forEach(k=>{
    let it= mObj[k];
    let gk= it.spreadId+"||"+ it.sheetName;
    if(!groupMap[gk]) groupMap[gk]=[];
    groupMap[gk].push(it);
  });

  let allQs=[];
  (async()=>{
    for(const gk in groupMap){
      let [spId,sName]= gk.split("||");
      if(!spId||!sName) continue;
      let baseArr=[];
      try{
        let theKey= groupMap[gk][0].apiKey;
        let url= `https://sheets.googleapis.com/v4/spreadsheets/${spId}/values/${encodeURIComponent(sName)}?key=${theKey}`;
        let r= await fetch(url);
        if(r.ok){
          let d= await r.json();
          if(d.values && d.values.length>0){
            baseArr= processSheetData(d.values);
          }
        }
      }catch(e){}
      if(showJapanese){
        let iCode= groupMap[gk][0].internalCode||"";
        let jpEntry= categoriesData.find(x=> x.lang==="JA" && x.internalCode=== iCode && x.spreadId=== spId);
        if(jpEntry){
          try{
            let jurl= `https://sheets.googleapis.com/v4/spreadsheets/${jpEntry.spreadId}/values/${encodeURIComponent(jpEntry.sheetName)}?key=${jpEntry.apiKey}`;
            let jr= await fetch(jurl);
            if(jr.ok){
              let jd= await jr.json();
              if(jd.values && jd.values.length>0){
                let arrJP= processSheetData(jd.values,true);
                baseArr.forEach((bb,idx)=>{
                  if(arrJP[idx]){
                    bb.jpQuestion= arrJP[idx].question;
                    bb.jpExplanation= arrJP[idx].explanation;
                  }
                });
              }
            }
          }catch(e2){}
        }
      }
      groupMap[gk].forEach(mItem=>{
        let rowIdx= mItem.rowIndex;
        let found= baseArr[rowIdx];
        if(found){
          allQs.push({
            ...found,
            userAnswer:mItem.userAnswer||"",
            spreadId: spId, apiKey:mItem.apiKey,
            sheetName:mItem.sheetName, internalCode:mItem.internalCode||"",
            jpQuestion:found.jpQuestion||"",
            jpExplanation:found.jpExplanation||""
          });
        } else {
          allQs.push({...mItem});
        }
      });
    }
    if(!allQs.length){
      showIOSAlert("提示","错题数据为空");
      return;
    }
    questions= randomOrder? shuffle(allQs): allQs;
    currentQuestionIndex=0;
    userAnswers=[];
    answerVisible=false;
    mistakeQuestions=[];
    elapsedTime=0;
    currentExamId= Date.now().toString();

    clearCurrentExam();
    hideAll();
    document.getElementById('quiz-container').style.display='block';
    document.getElementById('sheet-name').textContent="错题单元测试";
    loadQuestion();
    startTimer();
  })();
}

// ==================================================
// 6. 交卷 / 计分
// ==================================================
function submitQuiz(){
  if(isBattleMode){
    showIOSAlert("提示","大乱斗模式请用游戏内流程结束");
    return;
  }

  if(!allQuestionsAnswered()){
    showIOSConfirm("确认交卷","还有未作答题目，确定交卷吗？",()=>{
      finalizeQuiz();
    },()=>{});
  } else {
    finalizeQuiz();
  }
}

function finalizeQuiz(){
  stopTimer();
  quizEndTime= new Date();
  let ms= quizEndTime - quizStartTime + elapsedTime;
  let mm= Math.floor(ms/60000);
  let ss= Math.floor((ms%60000)/1000);

  let incorrect=0, correct=0, unanswered=0;
  let mistakesObj= loadMistakesFromCache();
  mistakeQuestions=[];
  let total= questions.length;
  let totalScore=0;
  let scorePer= 100/total;

  questions.forEach((q,i)=>{
    let ans= userAnswers[i];
    if(!ans){
      unanswered++;
    } else if(ans=== q.answer){
      correct++;
      totalScore+= scorePer;
    } else {
      incorrect++;
      let k= getMistakeKey(q);
      if(mistakesObj[k]){
        mistakesObj[k].count++;
        if(!mistakesObj[k].examIds) mistakesObj[k].examIds=[];
        if(!mistakesObj[k].examIds.includes(currentExamId)){
          mistakesObj[k].examIds.push(currentExamId);
        }
        mistakesObj[k].userAnswer=ans;
      } else {
        mistakesObj[k]={
          rowIndex:q.rowIndex,
          question:q.question,
          image:q.image,
          answer:q.answer,
          explanation:q.explanation,
          jpQuestion:q.jpQuestion||"",
          jpExplanation:q.jpExplanation||"",
          spreadId:q.spreadId,
          apiKey:q.apiKey,
          sheetName:q.sheetName,
          internalCode:q.internalCode||"",
          count:1,
          userAnswer:ans,
          examIds:[currentExamId]
        };
      }
      mistakeQuestions.push({...q,userAnswer:ans});
    }
  });
  totalScore= Math.floor(totalScore);
  if(totalScore>100) totalScore=100;
  saveMistakesToCache(mistakesObj);
  clearCurrentExam();

  hideAll();
  document.getElementById('result-container').style.display='block';

  let scoreMsg="", scoreClass="";
  if(totalScore===100){
    scoreMsg="满分！非常棒！";
    scoreClass="score-excellent";
  } else if(totalScore>=90){
    scoreMsg="合格！继续加油！";
    scoreClass="score-good";
  } else {
    scoreMsg="不合格，请继续努力。";
    scoreClass="score-bad";
  }
  const scoreEl= document.getElementById('score');
  scoreEl.textContent= `得分：${totalScore}分 - ${scoreMsg}`;
  scoreEl.className= scoreClass;

  document.getElementById('mistake-count').textContent=`做错：${incorrect}道`;
  document.getElementById('correct-count').textContent=`做对：${correct}道`;
  document.getElementById('unanswered-count').textContent=`未做：${unanswered}道`;
  document.getElementById('completion-status').textContent=`完成度：${correct+incorrect}/${total}`;

  let ansed= correct+incorrect;
  let pct= Math.floor(ansed/total*100);
  let bar= document.getElementById('progress-bar');
  bar.style.width= pct+'%';
  bar.textContent= pct+'%';
  if(pct>=90) bar.style.backgroundColor='#28a745';
  else if(pct>=70) bar.style.backgroundColor='#ffc107';
  else bar.style.backgroundColor='#dc3545';

  let history= loadQuizHistory();
  history.push({
    examId: currentExamId,
    dateTime: new Date().toLocaleString(),
    sheetName: currentSheetName,
    wrongCount: incorrect,
    correctCount: correct,
    unansweredCount: unanswered,
    timeSpent: `${mm}分钟${ss}秒`,
    answered: ansed,
    total,
    score: totalScore
  });
  saveQuizHistory(history);
}

function allQuestionsAnswered(){
  return questions.every((q,i)=>{
    return userAnswers[i]==="⭕" || userAnswers[i]==="❌";
  });
}

function getMistakeKey(q){
  return [q.spreadId, q.rowIndex, q.sheetName].join("||");
}

function viewMistakes(){
  hideAll();
  document.getElementById('current-mistakes-container').style.display='block';
  const c= document.getElementById('current-mistakes-list');
  c.innerHTML="";
  if(!mistakeQuestions.length){
    c.innerHTML="<p>本次没有错题</p>";
    return;
  }
  mistakeQuestions.forEach((item,idx)=>{
    let wrap= document.createElement('div');
    let qText= item.question;
    if(showJapanese && item.jpQuestion){
      qText+= "\n-----\n"+ item.jpQuestion;
    }
    let html= `<div style="font-weight:bold;margin-bottom:6px;">题目 ${idx+1}：</div><div>${qText}</div>`;
    if(item.image){
      html+= `<div style="margin-top:10px;"><img src="${item.image}" style="max-width:100%;max-height:150px;object-fit:contain;"></div>`;
    }
    html+= `<div style="margin-top:6px;"><strong>您的错误答案：</strong>${item.userAnswer||"无"}</div>
            <div><strong>正确答案：</strong>${item.answer}</div>`;
    if(item.explanation){
      html+= `<div><strong>解说：</strong>${item.explanation}</div>`;
    }
    if(showJapanese && item.jpExplanation){
      html+= `<div><strong>日文解说：</strong>${item.jpExplanation}</div>`;
    }
    wrap.innerHTML= html;
    c.appendChild(wrap);
  });
}

function showScore(){
  hideAll();
  document.getElementById('result-container').style.display='block';
}

// 继续考试
function continueExam(){
  const exam= loadCurrentExam();
  if(!exam){
    showIOSAlert("提示","没有未完成考试");
    return;
  }
  showIOSConfirm("恢复进度",`检测到上次考试未完成(套题:${exam.sheetName}),是否继续?`,()=>{
    currentSheetName= exam.sheetName;
    currentQuestionIndex= exam.currentQuestionIndex;
    userAnswers= exam.userAnswers;
    questions= exam.questions;
    isBattleMode= exam.isBattleMode;
    isMistakeMode= exam.isMistakeMode;
    isFavoritesMode= exam.isFavoritesMode;
    elapsedTime= exam.elapsedTime||0;
    currentExamId= exam.currentExamId||Date.now().toString();

    randomOrder= exam.randomOrder;
    autoNext= exam.autoNext;
    showJapanese= exam.showJapanese;

    hideAll();
    document.getElementById('quiz-container').style.display='block';
    if(isBattleMode){
      showIOSAlert("提示","大乱斗存档不支持恢复，将重新开始。");
      clearCurrentExam();
      resetQuiz();
      return;
    }
    document.getElementById('sheet-name').textContent=`当前套题：${currentSheetName}`;
    loadQuestion();
    startTimer();
  },()=>{});
}

// 考试计时
function startTimer(){
  let t= document.getElementById('timer');
  quizStartTime= new Date();
  timerInterval= setInterval(()=>{
    let now= new Date();
    let e= now- quizStartTime + elapsedTime;
    let m= Math.floor(e/60000);
    let s= Math.floor((e%60000)/1000);
    t.textContent=`时间：${String(m).padStart(2,'0')}分钟${String(s).padStart(2,'0')}秒`;
  },1000);
}
function stopTimer(){
  clearInterval(timerInterval);
}

// 暂停/退出
function pauseExam(){
  if(isBattleMode){
    showIOSAlert("提示","大乱斗不支持暂停退出");
    return;
  }
  stopTimer();
  elapsedTime+=( new Date()- quizStartTime);
  saveCurrentExam();
  showIOSAlert("提示","考试进度已保存",()=>{
    hideAll();
    document.getElementById('container').style.display='block';
    if(loadCurrentExam()){
      document.getElementById('continue-exam-func-btn').style.display='flex';
      document.getElementById('continue-exam-func-btn').classList.remove('disabled');
    } else {
      document.getElementById('continue-exam-func-btn').style.display='none';
    }
  });
}

// ==================================================
// 7. 历史/个人中心
// ==================================================
function clearAllHistory(){
  showIOSConfirm("清除历史","确认清除所有历史记录和错题吗？",()=>{
    localStorage.clear();
    favorites={};
    showIOSAlert("提示","历史已清除，包括收藏",()=>{
      resetQuiz();
    });
  },()=>{});
}

function showSummary(){
  hideAll();
  document.getElementById('summary-container').style.display='block';
  let s= document.getElementById('summary-content');
  s.textContent="加载中...";

  let his= loadQuizHistory();
  if(!his.length){
    s.innerHTML="<p>暂无做题历史</p>";
    return;
  }
  s.innerHTML="";
  his.forEach((rec,idx)=>{
    let div= document.createElement('div');
    div.className="history-card";
    div.onclick=()=> viewHistoryDetail(idx);
    div.innerHTML=`
      <div class="history-card-top">
        <span>${rec.sheetName}</span>
        <span>${rec.dateTime}</span>
      </div>
      <div class="history-card-bottom">
        <div><span>错：${rec.wrongCount}</span></div>
        <div><span>对：${rec.correctCount}</span></div>
        <div><span>未做：${rec.unansweredCount}</span></div>
        <div><span>${rec.score}分</span></div>
      </div>
    `;
    s.appendChild(div);
  });
  document.getElementById('history-detail-container').style.display='none';
  document.getElementById('history-return-btn').style.display='none';
}

function viewHistoryDetail(idx){
  let his= loadQuizHistory();
  if(!his[idx]) return;
  let examId= his[idx].examId;
  if(!examId){
    showIOSAlert("提示","此记录缺少examId，无法关联错题");
    return;
  }
  let mis= loadMistakesFromCache();
  let matched= [];
  Object.keys(mis).forEach(k=>{
    let mo= mis[k];
    if(mo.examIds && mo.examIds.includes(examId)){
      matched.push(mo);
    }
  });
  if(!matched.length){
    showIOSAlert("提示","该次考试没有错题");
    return;
  }
  let detailWrap= document.getElementById('history-detail-container');
  detailWrap.style.display='block';
  detailWrap.innerHTML="";
  matched.forEach((item,i2)=>{
    let wrap= document.createElement('div');
    let qText= item.question;
    if(showJapanese && item.jpQuestion){
      qText+= "\n-----\n"+ item.jpQuestion;
    }
    let html= `<div style="font-weight:bold;margin-bottom:6px;">题目 ${i2+1}：</div><div>${qText}</div>`;
    if(item.image){
      html+= `<div style="margin:10px 0;"><img src="${item.image}" style="max-width:100%;max-height:150px;"></div>`;
    }
    html+= `<div><strong>错误答案：</strong>${item.userAnswer||"无"}</div>
            <div><strong>正确答案：</strong>${item.answer}</div>`;
    if(item.explanation){
      html+= `<div><strong>解说：</strong>${item.explanation}</div>`;
    }
    if(showJapanese && item.jpExplanation){
      html+= `<div><strong>日文解说：</strong>${item.jpExplanation}</div>`;
    }
    wrap.innerHTML= html;
    detailWrap.appendChild(wrap);
  });
  document.getElementById('history-return-btn').style.display='block';
}

function returnFromHistoryDetail(){
  document.getElementById('history-detail-container').style.display='none';
  document.getElementById('history-return-btn').style.display='none';
}

// ==================================================
// 8. 考试设置模态
// ==================================================
function openSettingsModal(){
  document.getElementById('random-checkbox').checked= randomOrder;
  document.getElementById('autonext-checkbox').checked= autoNext;
  document.getElementById('show-japanese-checkbox').checked= showJapanese;
  document.getElementById('settings-modal-mask').style.display='block';
}
function closeSettingsModal(){
  document.getElementById('settings-modal-mask').style.display='none';
}
function applySettingsAndClose(){
  randomOrder= document.getElementById('random-checkbox').checked;
  autoNext= document.getElementById('autonext-checkbox').checked;
  showJapanese= document.getElementById('show-japanese-checkbox').checked;
  saveRandomOrderSetting(randomOrder);
  saveAutoNextSetting(autoNext);
  saveShowJapaneseSetting(showJapanese);
  closeSettingsModal();
  if(document.getElementById('quiz-container').style.display==='block' && !isBattleMode){
    loadQuestion();
  }
}

// ==================================================
// 9. 合宿生活 & 汽车周边(广告区)
// ==================================================
function showCampusLife(){
  hideAll();
  document.getElementById('campus-life-container').style.display='block';
  const listDiv= document.getElementById('campus-life-list');
  listDiv.innerHTML="";
  let data= allBannerData.filter(x=> x.category==="校园周边");
  if(!data.length){
    listDiv.innerHTML="<p>暂无校园周边数据</p>";
    return;
  }
  data.forEach(d=>{
    let c= document.createElement('div');
    c.className="life-item-card";
    c.innerHTML=`
      <div class="category-icon-container">
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          ${
            d.subCategory==='饭店'? '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>' 
            : d.subCategory==='物产店'? '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z"/>' 
            : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>'
          }
        </svg>
      </div>
      <div class="merchant-type">${d.subCategory||'无子类'}</div>
    `;
    c.onclick=()=>{
      const link= d.type==="abs"? ensureAbsoluteUrl(d.link): `./ads/pages/merchant.html?merchantId=${d.id}`;
      window.open(link,"_blank");
    };
    listDiv.appendChild(c);
  });
}

function showCarSurrounding(){
  hideAll();
  document.getElementById('car-surrounding-container').style.display='block';
  const listDiv= document.getElementById('car-surrounding-list');
  listDiv.innerHTML="";
  let data= allBannerData.filter(x=> x.category==="汽车周边");
  if(!data.length){
    listDiv.innerHTML="<p>暂无汽车周边数据</p>";
    return;
  }
  data.forEach(d=>{
    let c= document.createElement('div');
    c.className="car-item-card";
    c.innerHTML=`
      <div class="category-icon-container">
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          ${
            d.subCategory==='汽车用品'?'<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>' 
            : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>'
          }
        </svg>
      </div>
      <div class="merchant-type">${d.subCategory||'无子类'}</div>
    `;
    c.onclick=()=>{
      const link= d.type==="abs"? ensureAbsoluteUrl(d.link): `./ads/pages/merchant.html?merchantId=${d.id}`;
      window.open(link,"_blank");
    };
    listDiv.appendChild(c);
  });
}

// ==================================================
// 10. 广告Banner & Popup
// ==================================================
const ADS_SPREAD_ID="1zddtUI5LO9sD99Ab2bJKZKOFFQQyBO7ezEKOjnoyg7U";
const ADS_API_KEY="AIzaSyApEcu1zgGEexoS_diT6PkCPQDWkX5Adhk";
const ADS_SHEET_NAME="Sheet1";
const ADS_SLIDER_MANAGER_SHEET_NAME="slideManager";
let allBannerData=[];

async function fetchAllBannerData(){
  try{
    const url= `https://sheets.googleapis.com/v4/spreadsheets/${ADS_SPREAD_ID}/values/${ADS_SHEET_NAME}?key=${ADS_API_KEY}`;
    const r= await fetch(url);
    if(!r.ok) throw new Error("无法获取广告数据");
    const d= await r.json();
    if(!d.values|| d.values.length<=1) return [];
    const rows= d.values.slice(1);
    return rows.map(row=>({
      raw:row,
      id: row[0]||"",
      position:(row[1]||"").trim(),
      image: row[2]||"",
      category:(row[3]||"").trim(),
      subCategory:(row[4]||"").trim(),
      subImage: row[5]||"",
      type: (row[11]||"").trim(),
      link: row[12]||"",
      btntext: row[13]||"",
      primetext: row[14]||"",
      secondaryText: row[15]||"",
      title: row[9]||""
    })).filter(x=>x.id && x.position);
  } catch(e){
    console.error(e);
    return [];
  }
}

function ensureAbsoluteUrl(u){
  if(!u) return '';
  if(/^https?:\/\//.test(u)) return u;
  if(u.startsWith('./')) return u;
  return './'+u;
}

async function loadTopBanner() {
  allBannerData= await fetchAllBannerData();
  let top= allBannerData.filter(x=> x.position==="1");
  if(!top.length){
    document.getElementById('banner-top').style.display='none';
    return;
  }
  document.getElementById('banner-top').style.display='block';
  const b= top[0];
  if(b.image){
    await localDataManager.downloadAndCacheImage(b.image,'banner');
  }
  const cont= document.getElementById('banner-top');
  const linkUrl= b.type==="abs"? ensureAbsoluteUrl(b.link): `./ads/pages/merchant.html?merchantId=${b.id}`;
  let localURL= b.image? await localDataManager.getLocalImage(b.image,'banner'): null;
  if(!localURL && b.image){
    try{
      let netImg= await fetch(b.image);
      if(netImg.ok){
        await localDataManager.downloadAndCacheImage(b.image,'banner');
        localURL= await localDataManager.getLocalImage(b.image,'banner');
      }
    }catch(e){}
  }
  const imgSrc= localURL|| b.image;
  cont.innerHTML= `
    <a href="${linkUrl}" target="_blank">
      <img src="${imgSrc}" alt="广告" style="width:100%; max-height:120px; object-fit:cover; border-radius:12px;"/>
    </a>
  `;
}

async function loadBottomBanners(){
  const bottom= document.getElementById('banner-bottom');
  bottom.innerHTML="";
  let data= allBannerData.filter(x=> x.position === x.position === "1" && "popup" && x.position.startsWith("slider-"));
  if(!data.length){
    bottom.style.display='none';
    return;
  }
  bottom.style.display='block';
  for(const b of data){
    if(b.image){
      await localDataManager.downloadAndCacheImage(b.image,'banner');
    }
    let slot= document.createElement('div');
    slot.className="banner-slot";
    const linkUrl= b.type==="abs"? ensureAbsoluteUrl(b.link): `./ads/pages/merchant.html?merchantId=${b.id}`;
    let localURL= b.image? await localDataManager.getLocalImage(b.image,'banner'): null;
    let imgSrc= localURL|| b.image;
    slot.innerHTML= `
      <a href="${linkUrl}" target="_blank">
        <img src="${imgSrc}" alt="广告" />
      </a>
    `;
    bottom.appendChild(slot);
  }
}

async function loadSliderBanner(){
  try{
    const url= `https://sheets.googleapis.com/v4/spreadsheets/${ADS_SPREAD_ID}/values/${ADS_SLIDER_MANAGER_SHEET_NAME}?key=${ADS_API_KEY}`;
    const r= await fetch(url);
    if(!r.ok) throw new Error("无法获取Slider数据");
    const d= await r.json();
    if(!d.values|| d.values.length<=1) return;

    const managerData= d.values.slice(1).reduce((acc,row)=>{
      if(row[0] && row[0].startsWith('Slider-')){
        acc[row[0]]={
          title: row[1]||'',
          primaryText: row[2]||'',
          secondaryText: row[3]||''
        };
      }
      return acc;
    },{});

    let sliderData= allBannerData.filter(x=> x.position.startsWith("slider-"));
    if(!sliderData.length){
      document.getElementById('slider-banner-container').style.display='none';
      return;
    }
    document.getElementById('slider-banner-container').style.display='block';

    let groupMap={};
    sliderData.forEach(item=>{
      let suf= item.position.replace('slider-','');
      if(!groupMap[suf]) groupMap[suf]=[];
      groupMap[suf].push(item);
    });
    let container= document.getElementById('slider-banner-container');
    container.innerHTML="";
    let sortedKeys= Object.keys(groupMap).sort((a,b)=> +a- +b);
    for(const k of sortedKeys){
      let arr= groupMap[k];
      let sliderKey= `Slider-${k}`;
      let mg= managerData[sliderKey]||{};
      let groupDiv= document.createElement('div');
      groupDiv.className="slider-group";
      groupDiv.innerHTML=`
        <div class="slider-header">
          <div class="slider-title">${mg.title || sliderKey}</div>
          ${mg.primaryText? `<div class="slider-primary-text">${mg.primaryText}</div>`:''}
          ${mg.secondaryText? `<div class="slider-secondary-text">${mg.secondaryText}</div>`:''}
        </div>
      `;
      let rowDiv= document.createElement('div');
      rowDiv.className="slider-row";

      for(const item of arr){
        if(item.image){
          await localDataManager.downloadAndCacheImage(item.image,'banner');
        }
        let linkUrl= item.type==="abs"? ensureAbsoluteUrl(item.link): `./ads/pages/merchant.html?merchantId=${item.id}`;
        let localURL= item.image? await localDataManager.getLocalImage(item.image,'banner'):null;
        let imgSrc= localURL|| item.image;
        let div= document.createElement('div');
        div.className="slider-item";
        div.innerHTML=`
          <a href="${linkUrl}" target="_blank">
            <img src="${imgSrc}" alt="slider广告" />
            <div class="slider-text">${item.title||""}</div>
          </a>
        `;
        rowDiv.appendChild(div);
      }
      groupDiv.appendChild(rowDiv);
      container.appendChild(groupDiv);
    }
  } catch(e){
    console.error('加载Slider失败:', e);
    document.getElementById('slider-banner-container').style.display='none';
  }
}

async function loadPopupAds(){
  if(!allBannerData.length){
    allBannerData= await fetchAllBannerData();
  }
  let popupData= allBannerData.filter(x=> x.position==="popup");
  if(!popupData.length){
    document.getElementById('popup-container').style.display='none';
    return;
  }
  const p= popupData[0];
  document.getElementById('popup-container').style.display='block';
  document.getElementById('popup-state1').style.display='block';
  document.getElementById('popup-state2').style.display='none';

  if(p.image){
    await localDataManager.downloadAndCacheImage(p.image,'banner');
  }
  let localURL= p.image? await localDataManager.getLocalImage(p.image,'banner'): null;
  let imgSrc= localURL|| p.image;

  document.getElementById('popup-diamond').src= imgSrc;
  document.getElementById('popup-small-title').textContent= p.title;
  document.getElementById('popup-small-secondary').textContent= p.secondaryText;

  document.getElementById('popup-full-image').src= imgSrc;
  document.getElementById('popup-full-title').textContent= p.title;
  document.getElementById('popup-full-prime').textContent= p.primetext;
  document.getElementById('popup-action-btn').textContent= p.btntext;
  document.getElementById('popup-full-secondary').textContent= p.secondaryText;

  document.getElementById('popup-action-btn').onclick= ()=>{
    const url= p.type==="abs"? ensureAbsoluteUrl(p.link):`./ads/pages/merchant.html?merchantId=${p.id}`;
    window.open(url,"_blank");
  };

  document.getElementById('popup-state1').onclick=(e)=>{
    if(e.target.closest('.popup-close-btn')) return;
    document.getElementById('popup-state1').style.display='none';
    document.getElementById('popup-state2').style.display='block';
  };
}
function closePopup(){
  document.getElementById('popup-container').style.display='none';
}
function switchToState1(){
  document.getElementById('popup-state2').style.display='none';
  document.getElementById('popup-state1').style.display='block';
}

// ==================================================
// 11. LocalStorage: currentExam / favorites / mistakes / quizHistory
// ==================================================
function loadCurrentExam(){
  let ex= localStorage.getItem('currentExam');
  return ex? JSON.parse(ex): null;
}
function saveCurrentExam(){
  let cur= {
    sheetName: currentSheetName,
    currentQuestionIndex,
    userAnswers,
    questions,
    randomOrder,
    autoNext,
    elapsedTime,
    isBattleMode,
    isMistakeMode,
    isFavoritesMode,
    showJapanese,
    currentExamId
  };
  localStorage.setItem('currentExam', JSON.stringify(cur));
}
function clearCurrentExam(){
  localStorage.removeItem('currentExam');
  document.getElementById('continue-exam-func-btn').style.display='none';
}

function loadFavorites(){
  let f= localStorage.getItem('favorites');
  return f? JSON.parse(f): {};
}
function saveFavorites(obj){
  localStorage.setItem('favorites', JSON.stringify(obj));
}

function loadMistakesFromCache(){
  let m= localStorage.getItem('mistakes');
  return m? JSON.parse(m): {};
}
function saveMistakesToCache(o){
  localStorage.setItem('mistakes', JSON.stringify(o));
}

function loadQuizHistory(){
  let h= localStorage.getItem('quizHistory');
  return h? JSON.parse(h): [];
}
function saveQuizHistory(h){
  localStorage.setItem('quizHistory', JSON.stringify(h));
}

// ==================================================
// 12. 本地版本检查 & 更新
// ==================================================
async function checkLocalVersion(){
  try{
    const updateBtn= document.getElementById('update-btn');
    const localVersionSpan= document.getElementById('local-version');
    const remoteVersionSpan= document.getElementById('remote-version');
    if(!updateBtn|| !localVersionSpan|| !remoteVersionSpan) return;
    
    // 获取远程版本
    const url= `https://sheets.googleapis.com/v4/spreadsheets/${SYSTEM_SPREADSHEET_ID}/values/${SYSTEM_CN_SHEET_NAME}!B6:B7?key=${SYSTEM_API_KEY}`;
    const r= await fetch(url);
    if(!r.ok) throw new Error(`获取版本信息失败: ${r.status}`);
    let d= await r.json();
    const remoteVersion= d.values&&d.values[0]? d.values[0][0]: '未知';
    const serverVersion= d.values&&d.values[1]? d.values[1][0]: '未知';
    
    // 重新生成本地版本号，确保反映最新的本地内容状态
    const localVersion = await localDataManager.generateVersion();
    localDataManager.saveLocalVersion(localVersion);
    
    localVersionSpan.textContent= localVersion;
    remoteVersionSpan.textContent= `${remoteVersion||'-'} (服务端:${serverVersion})`;
    
    if(localVersion === remoteVersion){
      updateBtn.dataset.status='latest';
      let tx= updateBtn.querySelector('.update-text');
      if(tx) tx.textContent='最新';
    } else {
      updateBtn.dataset.status='needUpdate';
      let tx= updateBtn.querySelector('.update-text');
      if(tx) tx.textContent='需要更新';
    }
  }catch(e){
    console.error('检查版本失败:', e);
  }
}

async function fetchRemoteCategories() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SYSTEM_SPREADSHEET_ID}/values/考题管理!A:G?key=${SYSTEM_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
      throw new Error(`获取考题管理数据失败: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.values || data.values.length < 2) {
      throw new Error("考题管理Sheet数据为空或格式不正确");
  }
  
  const rows = data.values.slice(1);
  return rows.map(row => ({
      internalName: (row[0] || "").trim(),
      lang: (row[1] || "").trim(),
      categoryName: (row[2] || "").trim(),
      sheetName: (row[3] || "").trim(),
      spreadId: (row[4] || "").trim(),
      apiKey: (row[5] || "").trim(),
      internalCode: (row[6] || "").trim()
  })).filter(x => x.categoryName && x.sheetName && x.spreadId && x.apiKey);
}

async function checkAndUpdate() {
  const updateBtn = document.getElementById('update-btn');
  if (!updateBtn || updateBtn.dataset.status === 'updating') return;

  function updateStatus(st, txt) {
      updateBtn.dataset.status = st;
      let t = updateBtn.querySelector('.update-text');
      if (t) t.textContent = txt;
  }

  updateStatus('updating', '更新中...');
  let tout = setTimeout(() => {
      if (updateBtn.dataset.status === 'updating') {
          updateStatus('needUpdate', '更新超时');
          localDataManager.updateStatus = 'needUpdate';
      }
  }, 300000);

  try {
      // Fetch remote data information
      const [imageUrls, categories] = await Promise.all([
          fetchRemoteImageData(),
          fetchRemoteCategories()
      ]);

      console.log('=== 开始检查本地数据状态 ===');

      // Check quiz content
      const zhCategories = categories.filter(x => x.lang === "ZH");
      const quizUpdateNeeded = [];

      for (const cat of zhCategories) {
          const localData = await localDataManager.getQuizData('ZH', cat.internalCode);
          if (!localData || !localData.length) {
              console.log(`题库需要更新: ${cat.sheetName}`);
              quizUpdateNeeded.push(cat);
          } else {
              console.log(`题库已存在: ${cat.sheetName} (${localData.length}题)`);
          }
      }

      // Check images
      const localImages = await checkLocalImages(imageUrls);
      const missingImages = imageUrls.filter(img => !localImages.includes(img.url));
      console.log(`需要下载的图片数量: ${missingImages.length}`);

      // Update missing content
      const errors = [];
      if (quizUpdateNeeded.length > 0) {
          for (const cat of quizUpdateNeeded) {
              try {
                  await updateQuizData(cat);
              } catch (e) {
                  errors.push(`题库[${cat.sheetName}]: ${e.message}`);
              }
          }
      }

      if (missingImages.length > 0) {
          const result = await localDataManager.updateFromSystemSheet(imageUrls);
          if (result.failedCount > 0) {
              errors.push(`${result.failedCount}个图片下载失败`);
          }
          // 更新UI显示版本号
          const localVerSpan = document.getElementById('local-version');
          if (localVerSpan) localVerSpan.textContent = result.version;
      } else {
          // 如果没有需要更新的图片，仍然需要生成新版本号
          const newVersion = await localDataManager.generateVersion(imageUrls.map(i => i.url));
          localDataManager.saveLocalVersion(newVersion);
          const localVerSpan = document.getElementById('local-version');
          if (localVerSpan) localVerSpan.textContent = newVersion;
      }
      
      updateStatus('latest', errors.length > 0 ? errors.join(', ') : '最新');

  } catch (e) {
      console.error('更新失败:', e);
      updateStatus('needUpdate', '更新失败');
  } finally {
      clearTimeout(tout);
  }
}

async function fetchRemoteImageData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SYSTEM_SPREADSHEET_ID}/values/${SYSTEM_CN_SHEET_NAME}!C:D?key=${SYSTEM_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`获取系统表数据失败:${response.status}`);
  
  const data = await response.json();
  return data.values ? data.values.slice(1)
      .map(row => ({
          url: row[0],
          type: row[1] || 'quiz'
      }))
      .filter(i => i.url && i.url.trim() !== '') : [];
}

async function checkLocalImages(remoteUrls) {
  const localUrls = [];
  for (const img of remoteUrls) {
      const hasLocal = await localDataManager.hasLocalImage(img.url, img.type);
      if (hasLocal) localUrls.push(img.url);
  }
  return localUrls;
}

async function updateQuizData(category) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${category.spreadId}/values/${encodeURIComponent(category.sheetName)}?key=${category.apiKey}`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  if (data.values && data.values.length > 0) {
      const questions = processSheetData(data.values);
      await localDataManager.saveQuizData('ZH', category.internalCode, questions);
      console.log(`题库[${category.sheetName}]更新完成: ${questions.length}题`);
  }
}


// ==================================================
// 13. 获取客户端IP + log
// ==================================================
// async function getClientIPAndLogAccess(){
  // ... 省略
// }

// ==================================================
// 14. LocalDataManager
// ==================================================
class LocalDataManager {
  constructor(){
    this.dbPromise = null;
    this.versionKey='localImagesVersion';
    this.updateStatus='latest';
    this.dbName='zalemCache';
    this.stores={
      quizImages:'quizImages',
      bannerImages:'bannerImages',
      quizTest:'quizTest'
    };
    this.db=null;
    this.initDB();
  }

  async ensureDbReady() {
    if (!this.dbPromise) {
        this.dbPromise = this.initDB();
    }
    this.db = await this.dbPromise;
    return this.db;
}


async initDB() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = (event) => {
          console.error('数据库打开失败:', event.target.error);
          reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
          const db = event.target.result;
          
          // Add error handler for the database
          db.onerror = (event) => {
              console.error('数据库错误:', event.target.error);
          };
          
          resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create stores if they don't exist
          if (!db.objectStoreNames.contains(this.stores.quizImages)) {
              db.createObjectStore(this.stores.quizImages, { keyPath: 'url' });
          }
          if (!db.objectStoreNames.contains(this.stores.bannerImages)) {
              db.createObjectStore(this.stores.bannerImages, { keyPath: 'url' });
          }
          if (!db.objectStoreNames.contains(this.stores.quizTest)) {
              db.createObjectStore(this.stores.quizTest, { keyPath: 'id' });
          }
      };
  });
  }


  getLocalVersion(){
    return localStorage.getItem(this.versionKey)||'';
  }
  saveLocalVersion(v){
    localStorage.setItem(this.versionKey,v);
  }
  

  async hasLocalImage(url, type='quiz'){
    await this.ensureDbReady();
    if(!url) return false;
    return new Promise(res=>{
      const storeName= (type==='banner'? this.stores.bannerImages:this.stores.quizImages);
      let t= this.db.transaction(storeName,'readonly');
      let s= t.objectStore(storeName);
      let rq= s.get(url);
      rq.onsuccess=()=>{
        let rr= rq.result;
        if(rr && rr.blob){
          res(true);
        } else {
          res(false);
        }
      };
      rq.onerror=()=>{
        console.warn('检查缓存图片失败:',url);
        res(false);
      };
    });
  }
  async getLocalImage(url,type='quiz'){
    await this.ensureDbReady();
    if(!url) return null;
    return new Promise(res=>{
      const storeName= (type==='banner'? this.stores.bannerImages:this.stores.quizImages);
      let t= this.db.transaction(storeName,'readonly');
      let s= t.objectStore(storeName);
      let rq= s.get(url);
      rq.onsuccess=()=>{
        let r= rq.result;
        if(r && r.blob){
          res(URL.createObjectURL(r.blob));
        }else{
          res(null);
        }
      };
      rq.onerror=()=>{
        console.warn('获取缓存图片失败:',url);
        res(null);
      };
    });
  }
  async downloadAndCacheImage(url,type='quiz'){
    await this.ensureDbReady();
    if(!url) return false;
    try{
      if(!/\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
        && !url.includes('drive.google.com')
        && !url.includes('github.com')
        && !url.includes('raw=true')){
        console.error('无效图片URL格式:',url);
        return false;
      }
      let processedUrl= url;
      if(url.includes('github.com') && !url.includes('raw.githubusercontent.com')){
        processedUrl= url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');
      }
      if(processedUrl.startsWith('file://')){
        processedUrl= processedUrl.replace('file://','https://');
      } else if(!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')){
        processedUrl= 'https://'+ processedUrl;
      }
      try{
        let dec= decodeURIComponent(processedUrl);
        let [path,query]= dec.split('?');
        let enc= encodeURI(path);
        if(query) enc+= '?'+ query;
        processedUrl= enc;
      }catch(ee){}
      let resp= await fetch(processedUrl,{credentials:'omit',headers:{'Accept':'image/*'}});
      if(!resp.ok) throw new Error(`HTTP error! status:${resp.status}`);
      let blob= await resp.blob();
      if(!blob.type.startsWith('image/')) throw new Error('下载内容不是图片');

      let storeName= (type==='banner'? this.stores.bannerImages:this.stores.quizImages);
      return new Promise(resolve=>{
        let t= this.db.transaction(storeName,'readwrite');
        let s= t.objectStore(storeName);
        let rq= s.put({url,blob,timestamp:Date.now()});
        t.oncomplete=()=> resolve(true);
        t.onerror= e=>{
          console.error('写入图片DB失败:', e);
          resolve(false);
        };
      });
    }catch(e){
      console.error('下载图片失败:', e.message);
      this.updateStatus='needUpdate';
      return false;
    }
  }
  async saveQuizData(language, category, questions){
    await this.ensureDbReady();
    if(!this.db) return false;
    try{
      return new Promise(resolve=>{
        let id= `${language}_${category}`;
        let data= {id, language, category, questions, timestamp: Date.now()};
        let t= this.db.transaction(this.stores.quizTest,'readwrite');
        let s= t.objectStore(this.stores.quizTest);
        let rq= s.put(data);
        rq.onsuccess=()=> resolve(true);
        rq.onerror=()=>{
          console.error('保存题目数据失败:', id);
          resolve(false);
        };
      });
    }catch(e){
      console.error('saveQuizData出错:', e);
      return false;
    }
  }
  async getQuizData(language, category){
    await this.ensureDbReady();
    if(!this.db) return null;
    try{
      return new Promise(resolve=>{
        let id= `${language}_${category}`;
        let t= this.db.transaction(this.stores.quizTest,'readonly');
        let s= t.objectStore(this.stores.quizTest);
        let rq= s.get(id);
        rq.onsuccess=()=>{
          let r= rq.result;
          resolve(r? r.questions: null);
        };
        rq.onerror=()=>{
          console.error('获取题目数据失败:', id);
          resolve(null);
        };
      });
    }catch(e){
      console.error('getQuizData出错:', e);
      return null;
    }
  }
  async updateFromSystemSheet(imageUrls) {
    if (this.updateStatus === 'updating') {
        console.log('更新进行中...');
        return { version: this.getLocalVersion(), failedCount: 0 };
    }
    
    this.updateStatus = 'updating';
    await this.ensureDbReady();

    try {
        // Handle image updates
        let checks = await Promise.all(imageUrls.map(async it => {
            let has = await this.hasLocalImage(it.url, it.type);
            return { url: it.url, type: it.type, needsDownload: !has };
        }));
        
        let newOnes = checks.filter(x => x.needsDownload);
        let failedCount = 0;
        
        for (const item of newOnes) {
            let ok = await this.downloadAndCacheImage(item.url, item.type);
            if (!ok) failedCount++;
        }

        // 清理未使用的图片
        if (this.db) {
            const neededUrls = new Set(imageUrls.map(i => i.url));
            let tq = this.db.transaction(this.stores.quizImages, 'readwrite');
            let tb = this.db.transaction(this.stores.bannerImages, 'readwrite');
            let sq = tq.objectStore(this.stores.quizImages);
            let sb = tb.objectStore(this.stores.bannerImages);
            
            let rq1 = sq.getAllKeys();
            let rq2 = sb.getAllKeys();
            
            rq1.onsuccess = () => {
                let keys = rq1.result || [];
                keys.forEach(url => {
                    if (!neededUrls.has(url)) {
                        sq.delete(url);
                    }
                });
            };
            
            rq2.onsuccess = () => {
                let keys = rq2.result || [];
                keys.forEach(url => {
                    if (!neededUrls.has(url)) {
                        sb.delete(url);
                    }
                });
            };
        }

        // 生成新版本号
        let newVersion = await this.generateVersion(imageUrls.map(i => i.url));
        this.saveLocalVersion(newVersion);
        this.updateStatus = 'latest';
        
        return { version: newVersion, failedCount };
    } catch (error) {
        this.updateStatus = 'needUpdate';
        throw error;
    }
}

  
  async generateVersion(imageUrls = []) {
    await this.ensureDbReady();
    
    // Get quiz data state
    let quizIds = await new Promise(res => {
      let tr = this.db.transaction(this.stores.quizTest, 'readonly');
      let st = tr.objectStore(this.stores.quizTest);
      let rq = st.getAllKeys();
      rq.onsuccess = () => res(rq.result || []);
      rq.onerror = () => res([]);
    });

    let quizData = await Promise.all(quizIds.map(id => new Promise(resolve => {
      let t = this.db.transaction(this.stores.quizTest, 'readonly');
      let s = t.objectStore(this.stores.quizTest);
      let r = s.get(id);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(null);
    })));

    // Include both image URLs and quiz data in version hash
    let contentParts = [
      imageUrls.sort().join(','),
      quizData.filter(d => d).map(d => {
        // 包含题目内容的详细信息
        const questions = d.questions || [];
        const questionHashes = questions.map(q => {
          const parts = [
            q.question,
            q.answer,
            (q.options || []).join('|'),
            q.image || '',
            q.explanation || ''
          ];
          return parts.join('::');
        }).sort();
        return `${d.id}:${questionHashes.join('|')}`;
      }).sort().join(',')
    ];
    
    let contentString = contentParts.join('|');
    if (!contentString) return 'v0';

    let hash = 0;
    for (let i = 0; i < contentString.length; i++) {
      let ch = contentString.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    
    return 'v' + Math.abs(hash).toString(36);
  }
}



window.localDataManager= new LocalDataManager();
