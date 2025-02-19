/**
 * 用于检测 localStorage 是否可用的函数
 * 如果不可用，则意味着当前浏览器处于无痕模式或禁用了 localStorage
 */
function checkStorageSupport() {
  try {
    const testKey = '__test_key__' + Date.now();
    window.localStorage.setItem(testKey, 'test');
    const v = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    // 如果取出的值不是"test"说明有问题
    if (v !== 'test') {
      return false;
    }
    return true;
  } catch (e) {
    // 只要报错，就视为不可用
    return false;
  }
}

// 创建一个内存对象，用于在无法使用 localStorage 时保存数据
const inMemoryStore = {};

// 检测 localStorage 是否可用
const canUseLocalStorage = checkStorageSupport();

/**
 * 安全设置 key
 */
function safeSetItem(key, value) {
  if (canUseLocalStorage) {
    window.localStorage.setItem(key, value);
  } else {
    inMemoryStore[key] = value;
  }
}

/**
 * 安全读取 key
 */
function safeGetItem(key) {
  if (canUseLocalStorage) {
    return window.localStorage.getItem(key);
  } else {
    return inMemoryStore[key] || null;
  }
}

/**
 * 安全删除 key
 */
function safeRemoveItem(key) {
  if (canUseLocalStorage) {
    window.localStorage.removeItem(key);
  } else {
    delete inMemoryStore[key];
  }
}

/**
 * 安全清空
 */
function safeClear() {
  if (canUseLocalStorage) {
    window.localStorage.clear();
  } else {
    for (const k in inMemoryStore) {
      delete inMemoryStore[k];
    }
  }
}


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

//function to control navigation bar visibility
function updateNavigationVisibility(isQuizMode = false) {
  const navigationBar = document.querySelector('.functions-row');
  if (navigationBar) {
      navigationBar.style.display = isQuizMode ? 'none' : 'flex';
  }
}

//searchbar hider/shower
function setSearchBarVisibility(isVisible = false) {
  const searchBar = document.getElementById('.search-bar');
  if (searchBar) {
    searchBar.style.display = isVisible ? 'flex' : 'none';
  }
}

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

  // Show navigation bar when returning to home
  updateNavigationVisibility(false);

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

      // Check if we're in quiz mode
      if (document.getElementById('quiz-container').style.display === 'block') {
        if (isBattleMode) {
            // Battle mode confirmation
            showIOSConfirm(
                "确认退出",
                "确定要退出大乱斗模式吗？当前进度将不会保存。",
                () => {
                    resetQuiz();
                    performTabSwitch(tab);
                },
                () => {} // User canceled, do nothing
            );
        } else {
            // Regular quiz mode confirmation
            showIOSConfirm(
                "确认离开",
                "确定要退出考试吗？系统将保存当前进度，您可以稍后继续考试。",
                () => {
                    // Save current quiz state
                    stopTimer();
                    elapsedTime += (new Date() - quizStartTime);
                    saveCurrentExam();
                    
                    // Switch to selected tab
                    performTabSwitch(tab);
                    
                    // Show continue exam button if applicable
                    if (loadCurrentExam()) {
                        document.getElementById('continue-exam-func-btn').style.display = 'flex';
                        document.getElementById('continue-exam-func-btn').classList.remove('disabled');
                    }
                },
                () => {} // User canceled, do nothing
            );
        }
        return;
    }

    // If not in quiz mode, perform normal tab switch
    performTabSwitch(tab);
}

// Helper function to perform the actual tab switch
function performTabSwitch(tab) {
  const functionsRow = document.querySelector('.functions-row');
  Array.from(document.querySelectorAll('.tabbar-item')).forEach(el => {
      el.classList.remove('active');
  });

  hideAll(); // Avoid page overlap
  document.getElementById('summary-container').style.display = 'none';

  switch (tab) {
      case 'home':
          document.querySelectorAll('.tabbar-item')[0].classList.add('active');
          resetQuiz();
          functionsRow.style.display = 'flex';
          document.getElementById('container').style.display = 'block';
          break;
          
      case 'campus':
          document.querySelectorAll('.tabbar-item')[1].classList.add('active');
          showCampusLife();
          functionsRow.style.display = 'none';
          break;
          
      case 'car':
          document.querySelectorAll('.tabbar-item')[2].classList.add('active');
          showCarSurrounding();
          functionsRow.style.display = 'none';
          break;
          
      case 'ai':
          document.querySelectorAll('.tabbar-item')[3].classList.add('active');
          functionsRow.style.display = 'none';
          showIOSAlert("提示", "AI咨询功能暂未实现");
          break;
          
      case 'personal':
          document.querySelectorAll('.tabbar-item')[4].classList.add('active');
          document.getElementById('personal-center-container').style.display = 'block';
          functionsRow.style.display = 'none';
          break;
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

/**
 * 准备第一题的图片
 */
async function prepareFirstQuestionImage() {
  const firstQuestion = questions[0];
  if (!firstQuestion?.image) return;

  try {
      await ensureImageLoaded(firstQuestion.image);
  } catch (error) {
      console.warn('加载第一题图片失败:', error);
  }
}

/**
 * 确保图片已加载（统一的图片加载函数）
 */
async function ensureImageLoaded(imageUrl) {
  if (!imageUrl) return null;

  try {
      // 检查本地存储
      const localUrl = await localDataManager.getLocalImage(imageUrl);
      if (localUrl) return localUrl;

      // 下载并缓存
      await localDataManager.downloadAndCacheImage(imageUrl);
      return await localDataManager.getLocalImage(imageUrl);
  } catch (error) {
      console.warn(`图片加载失败: ${imageUrl}`, error);
      return null;
  }
}



// 题目获取和加载函数
async function fetchQuestionsCN(sobj) {
  try {
      document.getElementById('sheet-name').textContent = "加载中...";
      document.getElementById('question').textContent = "加载中...";

      // 1. 从本地获取题目内容
      let cnQuestions = await localDataManager.getQuizData('ZH', sobj.internalCode);
      
      // 本地没有，从服务器获取并存储
      if (!cnQuestions || !cnQuestions.length) {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sobj.spreadId}/values/${encodeURIComponent(sobj.sheetName)}?key=${sobj.apiKey}`;
          const response = await fetch(url);
          
          if (!response.ok) {
              throw new Error("fetch ZH question failed: " + sobj.sheetName);
          }
          
          const data = await response.json();
          if (!data.values || !data.values.length) {
              throw new Error("fetch ZH question empty:" + sobj.sheetName);
          }
          
          cnQuestions = processSheetData(data.values);
          await localDataManager.saveQuizData('ZH', sobj.internalCode, cnQuestions);
      }

      // 2. 处理日语内容（如果需要）
      if (showJapanese) {
          let jpItem = categoriesData.find(x => x.lang === "JA" && x.internalCode === sobj.internalCode);
          if (jpItem) {
              try {
                  let urlJP = `https://sheets.googleapis.com/v4/spreadsheets/${jpItem.spreadId}/values/${encodeURIComponent(jpItem.sheetName)}?key=${jpItem.apiKey}`;
                  let jr = await fetch(urlJP);
                  if (jr.ok) {
                      let jd = await jr.json();
                      if (jd.values && jd.values.length > 0) {
                          let arrJP = processSheetData(jd.values, true);
                          cnQuestions.forEach((q, i) => {
                              if (arrJP[i]) {
                                  q.jpQuestion = arrJP[i].question;
                                  q.jpExplanation = arrJP[i].explanation;
                              }
                          });
                      }
                  }
              } catch (e2) {
                  console.warn('加载日语内容失败:', e2);
              }
          }
      }

      // 3. 设置题目状态
      currentSheetName = sobj.sheetName;
      questions = randomOrder ? shuffle(cnQuestions) : cnQuestions;
      
      // 添加元数据
      questions.forEach(q => {
          q.spreadId = sobj.spreadId;
          q.apiKey = sobj.apiKey;
          q.sheetName = sobj.sheetName;
          q.internalCode = sobj.internalCode;
      });

      isBattleMode = false;
      isMistakeMode = false;
      isFavoritesMode = false;

      // 4. 初始化图片加载
      await prepareFirstQuestionImage();

      // 5. 启动考试
      startQuiz();

      // 6. 后台加载其余图片
      startBackgroundImagePreload(questions.slice(1));

  } catch (e) {
      console.error('获取题目失败:', e);
      document.getElementById('sheet-name').textContent = `加载套题[${sobj.sheetName}]失败`;
      document.getElementById('question').textContent = "";
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

  updateNavigationVisibility(true);

  if(!isBattleMode){
    loadQuestion();
    startTimer();
  }
}

/**
 * 更新题目状态
 */
function updateQuestionState(q, favoriteBtn) {
  resetButtonHighlight();
  
  const ans = userAnswers[currentQuestionIndex];
  if (ans === "⭕") document.getElementById('btn-correct').classList.add('highlight');
  if (ans === "❌") document.getElementById('btn-wrong').classList.add('highlight');

  const remainElem = document.getElementById('remaining-questions');
  if (isBattleMode) {
      remainElem.textContent = "";
  } else {
      remainElem.textContent = `剩余题数：${(questions.length - currentQuestionIndex - 1)}`;
  }

  favoriteBtn.classList.remove('favorited');
  let favKey = getFavoriteKey(q);
  if (favorites[favKey]) favoriteBtn.classList.add('favorited');
}


// Helper function to ensure image is loaded
async function ensureImageLoaded(imageUrl) {
  if (!imageUrl) return null;

  try {
      // Check local storage first
      const localUrl = await localDataManager.getLocalImage(imageUrl);
      if (localUrl) return localUrl;

      // If not in local storage, download and cache
      const downloaded = await localDataManager.downloadAndCacheImage(imageUrl);
      if (downloaded) {
          return await localDataManager.getLocalImage(imageUrl);
      }
      return null;
  } catch (error) {
      console.warn(`Image loading failed: ${imageUrl}`, error);
      return null;
  }
}



/**
 * 优化后的题目展示函数
 */
async function loadQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) return;

  const questionElem = document.getElementById('question');
  const imageContainer = document.getElementById('image');
  const favoriteBtn = document.getElementById('favorite-btn');
  document.getElementById('answer-display').textContent = "";

  // 更新题目文本
  let text = q.question;
  if (showJapanese && q.jpQuestion) {
      text += "\n-----\n" + q.jpQuestion;
  }
  questionElem.textContent = text;

  // 重置图片容器
  imageContainer.style.display = 'none';
  imageContainer.innerHTML = "";

  // 处理图片加载
  if (q.image) {
      try {
          // 显示加载状态
          imageContainer.style.display = 'flex';
          imageContainer.textContent = "加载中...";

          // 尝试从本地存储获取图片
          const localUrl = await localDataManager.getLocalImage(q.image);
          
          if (localUrl) {
              console.log('Using local image:', q.image);
              const img = new Image();
              
              // 设置图片加载事件处理
              img.onload = () => {
                  console.log('Local image loaded successfully:', q.image);
                  imageContainer.innerHTML = "";
                  imageContainer.appendChild(img);
                  imageContainer.style.display = 'flex';
              };
              
              img.onerror = async (error) => {
                  console.error('Local image load failed:', q.image, error);
                  // 如果本地加载失败，尝试重新下载
                  try {
                      const downloaded = await localDataManager.downloadAndCacheImage(q.image);
                      if (downloaded) {
                          const newLocalUrl = await localDataManager.getLocalImage(q.image);
                          if (newLocalUrl) {
                              img.src = newLocalUrl;
                              return;
                          }
                      }
                  } catch (e) {
                      console.error('Image recovery failed:', e);
                  }
                  imageContainer.style.display = 'none';
                  imageContainer.innerHTML = "";
              };

              // 设置图片源
              img.src = localUrl;
              
              // 添加超时处理
              setTimeout(() => {
                  if (imageContainer.textContent === "加载中...") {
                      console.warn('Image load timeout:', q.image);
                      imageContainer.style.display = 'none';
                      imageContainer.innerHTML = "";
                  }
              }, 10000); // 10秒超时
              
          } else {
              console.log('Local image not found, downloading:', q.image);
              // 尝试下载并缓存图片
              const downloaded = await localDataManager.downloadAndCacheImage(q.image);
              if (downloaded) {
                  const newLocalUrl = await localDataManager.getLocalImage(q.image);
                  if (newLocalUrl) {
                      const img = new Image();
                      img.onload = () => {
                          imageContainer.innerHTML = "";
                          imageContainer.appendChild(img);
                          imageContainer.style.display = 'flex';
                      };
                      img.onerror = () => {
                          imageContainer.style.display = 'none';
                          imageContainer.innerHTML = "";
                      };
                      img.src = newLocalUrl;
                  } else {
                      throw new Error('Failed to get local URL after download');
                  }
              } else {
                  throw new Error('Failed to download image');
              }
          }
      } catch (error) {
          console.error('Image handling error:', error);
          imageContainer.style.display = 'none';
          imageContainer.innerHTML = "";
      }
  }

  // 更新UI状态
  updateQuestionState(q, favoriteBtn);
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

// Update the showFavorites function
async function showFavorites() {
    hideAll();
    document.getElementById('favorites-container').style.display = 'block';
    
    const favKeys = Object.keys(favorites);
    const listDiv = document.getElementById('favorites-list');
    listDiv.innerHTML = "";

    if (!favKeys.length) {
        listDiv.innerHTML = '<div class="empty-state">暂无收藏题目</div>';
        return;
    }

    updateNavigationVisibility(true);

    for (const key of favKeys) {
        const item = favorites[key];
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        const content = document.createElement('div');
        content.className = 'favorite-card-content';
        
        let questionText = item.question;
        if (showJapanese && item.jpQuestion) {
            questionText += `\n${item.jpQuestion}`;
        }

        // Create the base structure without the image first
        content.innerHTML = `
            <div class="favorite-question">${questionText}</div>
            <div class="favorite-details" style="display: none;">
                <div class="favorite-image" style="display: none;"></div>
                <div class="favorite-answer">
                    <div class="answer-title">正确答案：${item.answer}</div>
                    ${item.explanation ? `
                        <div class="answer-explanation">${item.explanation}</div>
                    ` : ''}
                </div>
            </div>
        `;

        // Handle image loading separately
        if (item.image) {
            const imageContainer = content.querySelector('.favorite-image');
            try {
                const localUrl = await localDataManager.getLocalImage(item.image);
                if (localUrl) {
                    const img = new Image();
                    img.src = localUrl;
                    img.alt = "题目图片";
                    img.loading = "lazy";
                    imageContainer.innerHTML = '';
                    imageContainer.appendChild(img);
                    imageContainer.style.display = 'block';
                } else {
                    // Only attempt to download and cache if not found locally
                    await localDataManager.downloadAndCacheImage(item.image);
                    const newLocalUrl = await localDataManager.getLocalImage(item.image);
                    if (newLocalUrl) {
                        const img = new Image();
                        img.src = newLocalUrl;
                        img.alt = "题目图片";
                        img.loading = "lazy";
                        imageContainer.innerHTML = '';
                        imageContainer.appendChild(img);
                        imageContainer.style.display = 'block';
                    }
                }
            } catch (error) {
                console.warn('加载收藏题目图片失败:', error);
                imageContainer.style.display = 'none';
            }
        }

        // Click event for expand/collapse
        content.addEventListener('click', () => {
            const details = content.querySelector('.favorite-details');
            if (card.classList.contains('expanded')) {
                details.style.display = 'none';
                card.classList.remove('expanded');
            } else {
                details.style.display = 'block';
                card.classList.add('expanded');
            }
        });

        // Left swipe gesture for delete
        let startX = 0;
        let isSwiping = false;

        content.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            content.style.transition = 'none';
            isSwiping = true;
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const diff = e.touches[0].clientX - startX;
            if (diff < 0) {
                const translate = Math.max(-80, diff);
                content.style.transform = `translateX(${translate}px)`;
            }
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            isSwiping = false;
            content.style.transition = 'transform 0.3s ease';
            const diff = e.changedTouches[0].clientX - startX;
            
            if (diff < -40) {
                content.style.transform = 'translateX(-80px)';
                card.classList.add('showing-delete');
            } else {
                content.style.transform = 'translateX(0)';
                card.classList.remove('showing-delete');
            }
        });

        // Create delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'favorite-remove-btn';
        deleteBtn.textContent = '取消收藏';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            delete favorites[key];
            saveFavorites(favorites);
            card.remove();
            if (Object.keys(favorites).length === 0) {
                listDiv.innerHTML = '<div class="empty-state">暂无收藏题目</div>';
            }
        };

        card.appendChild(content);
        card.appendChild(deleteBtn);
        listDiv.appendChild(card);
    }

    // Search functionality
    const searchInput = document.getElementById('favorites-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const cards = listDiv.getElementsByClassName('favorite-card');
            
            Array.from(cards).forEach(card => {
                const question = card.querySelector('.favorite-question').textContent.toLowerCase();
                card.style.display = question.includes(searchText) ? 'block' : 'none';
            });
        });
    }
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
/**
 * Unified question loading system that handles all modes
 * @param {string} mode - 'normal', 'battle', 'favorite', or 'mistake'
 * @param {Object} options - Additional options needed for specific modes
 * @returns {Promise<Array>} Array of questions
 */
async function loadQuestionsUnified(mode, options = {}) {
  console.log(`=== Starting question loading (${mode} mode) ===`);
  let loadedQuestions = [];

  try {
      // Step 1: Load questions based on mode
      switch (mode) {
          case 'normal':
              loadedQuestions = await loadNormalModeQuestions(options.categoryObj);
              break;
          case 'battle':
              loadedQuestions = await loadBattleModeQuestions();
              break;
          case 'favorite':
              loadedQuestions = await loadFavoriteModeQuestions(options.favorites);
              break;
          case 'mistake':
              loadedQuestions = await loadMistakeModeQuestions(options.mistakes);
              break;
          default:
              throw new Error('Unknown loading mode');
      }

      if (!loadedQuestions || !Array.isArray(loadedQuestions) || loadedQuestions.length === 0) {
          throw new Error('No questions available');
      }

      // Step 2: Process loaded questions
      loadedQuestions = await processLoadedQuestions(loadedQuestions, mode);

      // Step 3: Preload images
      if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
          // Start with first question's image
          if (loadedQuestions[0].image) {
              await ensureImageLoaded(loadedQuestions[0].image);
          }

          // Background load remaining images
          if (loadedQuestions.length > 1) {
              const remainingQuestions = loadedQuestions.slice(1);
              startBackgroundImagePreload(remainingQuestions);
          }
      }

      return loadedQuestions;
  } catch (error) {
      console.error(`Question loading failed (${mode} mode):`, error);
      throw error;
  }
}


/**
 * Load questions for normal quiz mode
 */
async function loadNormalModeQuestions(categoryObj) {
    // First try loading from local storage
    let questions = await localDataManager.getQuizData('ZH', categoryObj.internalCode);
    
    // If not in local storage, fetch from server
    if (!questions || !questions.length) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${categoryObj.spreadId}/values/${encodeURIComponent(categoryObj.sheetName)}?key=${categoryObj.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`获取题目失败: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.values || !data.values.length) {
            throw new Error('题目数据为空');
        }
        
        questions = processSheetData(data.values);
        
        // Save to local storage
        await localDataManager.saveQuizData('ZH', categoryObj.internalCode, questions);
    }

    // Add metadata
    return questions.map(q => ({
        ...q,
        spreadId: categoryObj.spreadId,
        apiKey: categoryObj.apiKey,
        sheetName: categoryObj.sheetName,
        internalCode: categoryObj.internalCode
    }));
}

/**
 * Load questions for battle mode
 */
async function loadBattleModeQuestions() {
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
 * Load questions for favorite mode
 */
async function loadFavoriteModeQuestions(favorites) {
    const favKeys = Object.keys(favorites);
    if (!favKeys.length) return [];

    let allQuestions = [];
    const groupedFavorites = groupFavoritesBySheet(favorites);

    for (const [sheetKey, items] of Object.entries(groupedFavorites)) {
        const [spreadId, sheetName] = sheetKey.split('||');
        if (!spreadId || !sheetName) continue;

        // Try loading from local storage first
        const internalCode = items[0].internalCode || '';
        let baseQuestions = await localDataManager.getQuizData('ZH', internalCode);

        // If not in local storage, fetch from server
        if (!baseQuestions || !baseQuestions.length) {
            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadId}/values/${encodeURIComponent(sheetName)}?key=${items[0].apiKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.values && data.values.length) {
                        baseQuestions = processSheetData(data.values);
                        await localDataManager.saveQuizData('ZH', internalCode, baseQuestions);
                    }
                }
            } catch (error) {
                console.warn(`获取收藏题目失败: ${sheetName}`, error);
                continue;
            }
        }

        // Match favorites with base questions
        for (const favItem of items) {
            const baseQuestion = baseQuestions?.[favItem.rowIndex];
            if (baseQuestion) {
                allQuestions.push({
                    ...baseQuestion,
                    spreadId,
                    apiKey: favItem.apiKey,
                    sheetName,
                    internalCode
                });
            } else {
                allQuestions.push({...favItem});
            }
        }
    }

    return allQuestions;
}

/**
 * Load questions for mistake review mode
 */
async function loadMistakeModeQuestions(mistakes) {
    const mistakeKeys = Object.keys(mistakes);
    if (!mistakeKeys.length) return [];

    let allQuestions = [];
    const groupedMistakes = groupMistakesBySheet(mistakes);

    for (const [sheetKey, items] of Object.entries(groupedMistakes)) {
        const [spreadId, sheetName] = sheetKey.split('||');
        if (!spreadId || !sheetName) continue;

        // Try loading from local storage first
        const internalCode = items[0].internalCode || '';
        let baseQuestions = await localDataManager.getQuizData('ZH', internalCode);

        // If not in local storage, fetch from server
        if (!baseQuestions || !baseQuestions.length) {
            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadId}/values/${encodeURIComponent(sheetName)}?key=${items[0].apiKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.values && data.values.length) {
                        baseQuestions = processSheetData(data.values);
                        await localDataManager.saveQuizData('ZH', internalCode, baseQuestions);
                    }
                }
            } catch (error) {
                console.warn(`获取错题数据失败: ${sheetName}`, error);
                continue;
            }
        }

        // Match mistakes with base questions
        for (const mistakeItem of items) {
            const baseQuestion = baseQuestions?.[mistakeItem.rowIndex];
            if (baseQuestion) {
                allQuestions.push({
                    ...baseQuestion,
                    userAnswer: mistakeItem.userAnswer || '',
                    spreadId,
                    apiKey: mistakeItem.apiKey,
                    sheetName,
                    internalCode
                });
            } else {
                allQuestions.push({...mistakeItem});
            }
        }
    }

    return allQuestions;
}

/**
 * Helper function to group favorites by sheet
 */
function groupFavoritesBySheet(favorites) {
    const grouped = {};
    Object.values(favorites).forEach(item => {
        const key = `${item.spreadId}||${item.sheetName}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });
    return grouped;
}

/**
 * Helper function to group mistakes by sheet
 */
function groupMistakesBySheet(mistakes) {
    const grouped = {};
    Object.values(mistakes).forEach(item => {
        const key = `${item.spreadId}||${item.sheetName}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });
    return grouped;
}

/**
 * Process loaded questions with common logic
 */
async function processLoadedQuestions(questions, mode) {
  // Add Japanese content if needed
  if (showJapanese) {
      questions = await addJapaneseContent(questions);
  }

  // Validate each question's structure
  questions = questions.map(q => ({
      ...q,
      image: q.image || '',                 // Ensure image property exists
      question: q.question || '无题目',      // Ensure question text exists
      answer: q.answer || '',               // Ensure answer exists
      explanation: q.explanation || '',      // Ensure explanation exists
      jpQuestion: q.jpQuestion || '',       // Ensure Japanese properties exist
      jpExplanation: q.jpExplanation || ''
  }));

  // Filter out invalid questions
  questions = questions.filter(q => 
      q.question !== '无题目' && 
      (q.answer === '⭕' || q.answer === '❌')
  );

  // Shuffle if random order is enabled (except for battle mode)
  if (randomOrder && mode !== 'battle') {
      questions = shuffle(questions);
  }

  return questions;
}

// 3. Add missing Japanese content handling function
async function addJapaneseContent(questions) {
    if (!questions || !questions.length) return questions;
    
    // Group questions by internal code for batch processing
    const questionsByCode = {};
    questions.forEach(q => {
        if (!questionsByCode[q.internalCode]) {
            questionsByCode[q.internalCode] = [];
        }
        questionsByCode[q.internalCode].push(q);
    });

    // Process each group
    for (const [internalCode, questionGroup] of Object.entries(questionsByCode)) {
        const jpItem = categoriesData.find(x => 
            x.lang === "JA" && 
            x.internalCode === internalCode
        );

        if (jpItem) {
            try {
                const urlJP = `https://sheets.googleapis.com/v4/spreadsheets/${jpItem.spreadId}/values/${encodeURIComponent(jpItem.sheetName)}?key=${jpItem.apiKey}`;
                const response = await fetch(urlJP);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.values && data.values.length > 0) {
                        const jpQuestions = processSheetData(data.values, true);
                        
                        // Match and merge Japanese content
                        questionGroup.forEach((q, idx) => {
                            if (jpQuestions[idx]) {
                                q.jpQuestion = jpQuestions[idx].question;
                                q.jpExplanation = jpQuestions[idx].explanation;
                            }
                        });
                    }
                }
            } catch (error) {
                console.warn(`加载日语内容失败 (${internalCode}):`, error);
            }
        }
    }

    return questions;
}


/**
 * Initialize quiz state and UI for any quiz mode
 * @param {string} title - Title to display for the quiz
 */
function initializeQuiz(title) {
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    answerVisible = false;
    mistakeQuestions = [];
    elapsedTime = 0;
    currentExamId = Date.now().toString();
    
    // Clear any existing exam state
    clearCurrentExam();
    
    // Update UI
    hideAll();
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('sheet-name').textContent = title || `当前套题：${currentSheetName}`;
    
    // Update navigation
    updateNavigationVisibility(true);
    
    // Load first question and start timer
    loadQuestion();
    startTimer();
}


// Update the start functions to use the unified loading system
async function startFavoritesQuiz() {
    try {
        const favKeys = Object.keys(favorites);
        if (!favKeys.length) {
            showIOSAlert("提示", "暂无收藏题目");
            return;
        }

        questions = await loadQuestionsUnified('favorite', { favorites });
        
        isFavoritesMode = true;
        isBattleMode = false;
        isMistakeMode = false;
        currentSheetName = "我的收藏";
        
        initializeQuiz("收藏题单元测试");
    } catch (error) {
        console.error('启动收藏测试失败:', error);
        showIOSAlert("错误", error.message);
    }
}

async function startMistakeQuiz() {
    try {
        const mistakes = loadMistakesFromCache();
        const mistakeKeys = Object.keys(mistakes);
        if (!mistakeKeys.length) {
            showIOSAlert("提示", "没有错题记录");
            return;
        }

        // 将错题对象转换为数组格式
        const mistakesArray = mistakeKeys.map(key => mistakes[key]);
        
        // 确保错题数据格式正确
        if (!Array.isArray(mistakesArray) || mistakesArray.length === 0) {
            throw new Error('错题数据格式不正确');
        }

        questions = await loadQuestionsUnified('mistake', { mistakes: mistakesArray });
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('加载题目失败');
        }
        
        isMistakeMode = true;
        isBattleMode = false;
        isFavoritesMode = false;
        currentSheetName = "错题集";
        
        // 初始化答题状态
        currentQuestionIndex = 0;
        userAnswers = new Array(questions.length).fill(null);
        
        initializeQuiz("错题单元测试");
    } catch (error) {
        console.error('启动错题复习失败:', error);
        showIOSAlert("错误", error.message);
    }
}

/**
 * Loads questions for battle mode with optimized local-first strategy
 * @returns {Promise<Array>} Array of battle mode questions
 */
async function loadBattleQuestions() {
    console.log('=== 开始加载大乱斗题库 ===');
    
    // Get all Chinese categories from categoriesData
    const zhCategories = categoriesData.filter(x => x.lang === "ZH");
    if (!zhCategories.length) {
        throw new Error('无法找到中文题库配置');
    }

    let allQuestions = [];
    let needsUpdate = false;

    // First try loading from local storage
    for (const category of zhCategories) {
        try {
            const localData = await localDataManager.getQuizData('ZH', category.internalCode);
            if (localData && localData.length) {
                console.log(`本地已有题库: ${category.sheetName}, 数量: ${localData.length}`);
                // Add metadata to questions
                const questionsWithMetadata = localData.map(q => ({
                    ...q,
                    spreadId: category.spreadId,
                    apiKey: category.apiKey,
                    sheetName: category.sheetName,
                    internalCode: category.internalCode
                }));
                allQuestions.push(...questionsWithMetadata);
            } else {
                console.log(`需要下载题库: ${category.sheetName}`);
                needsUpdate = true;
            }
        } catch (error) {
            console.warn(`检查本地题库失败: ${category.sheetName}`, error);
            needsUpdate = true;
        }
    }

    // If we have enough local questions and don't need updates, return them
    if (allQuestions.length >= 100 && !needsUpdate) {
        console.log(`使用本地题库，总题目数: ${allQuestions.length}`);
        return allQuestions;
    }

    // Otherwise, fetch from server
    console.log('开始在线更新题库...');
    for (const category of zhCategories) {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${category.spreadId}/values/${encodeURIComponent(category.sheetName)}?key=${category.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
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

                // Save to local storage
                await localDataManager.saveQuizData('ZH', category.internalCode, questionsWithMetadata);
                console.log(`已更新题库: ${category.sheetName}, 题目数: ${questionsWithMetadata.length}`);

                // Update our current collection
                allQuestions = allQuestions.filter(q => q.internalCode !== category.internalCode);
                allQuestions.push(...questionsWithMetadata);

                // Start preloading images in background
                for (const question of questionsWithMetadata) {
                    if (question.image) {
                        localDataManager.downloadAndCacheImage(question.image).catch(error => {
                            console.warn(`预加载图片失败: ${question.image}`, error);
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`更新题库失败: ${category.sheetName}`, error);
        }
    }

    // If we still don't have enough questions after trying online
    if (allQuestions.length === 0) {
        throw new Error('无法获取任何题目');
    }

    console.log(`题库准备完成，总题目数: ${allQuestions.length}`);
    return allQuestions;
}

/**
 * Preload a single question's image
 * @param {Object} question Question object containing image URL
 */
// 保留现有的大乱斗模式函数，但优化其内部实现
async function preloadQuestionImage(question) {
  if (!question.image) return;

  try {
      const hasLocal = await localDataManager.hasLocalImage(question.image);
      
      if (!hasLocal) {
          await localDataManager.downloadAndCacheImage(question.image);
      }
      
      if (typeof battleImageLoadingProgress !== 'undefined') {
          battleImageLoadingProgress.loaded++;
          updateBattleLoadingProgress();
      }
  } catch (e) {
      console.warn(`大乱斗模式图片预加载失败: ${question.image}`, e);
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
  const batchSize = 3; // Process 3 images at a time
  let currentIndex = 0;

  while (currentIndex < questions.length) {
      const batch = questions
          .slice(currentIndex, currentIndex + batchSize)
          .filter(q => q.image);

      await Promise.all(
          batch.map(question => ensureImageLoaded(question.image))
      );

      currentIndex += batchSize;
      
      // Small delay between batches to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
  }
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
  document.querySelector('.battle-info-container').style.display = 'flex';

  updateButtonsVisibility(true);
  updateNavigationVisibility(true);
  
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
// function startMistakeQuiz(){
//   let mObj= loadMistakesFromCache();
//   let keys= Object.keys(mObj);
//   if(!keys.length){
//     showIOSAlert("提示","没有错题记录");
//     return;
//   }
//   isMistakeMode=true;
//   isBattleMode=false;
//   isFavoritesMode=false;
//   currentSheetName="错题集";

//   let groupMap={};
//   keys.forEach(k=>{
//     let it= mObj[k];
//     let gk= it.spreadId+"||"+ it.sheetName;
//     if(!groupMap[gk]) groupMap[gk]=[];
//     groupMap[gk].push(it);
//   });

//   let allQs=[];
//   (async()=>{
//     for(const gk in groupMap){
//       let [spId,sName]= gk.split("||");
//       if(!spId||!sName) continue;
//       let baseArr=[];
//       try{
//         let theKey= groupMap[gk][0].apiKey;
//         let url= `https://sheets.googleapis.com/v4/spreadsheets/${spId}/values/${encodeURIComponent(sName)}?key=${theKey}`;
//         let r= await fetch(url);
//         if(r.ok){
//           let d= await r.json();
//           if(d.values && d.values.length>0){
//             baseArr= processSheetData(d.values);
//           }
//         }
//       }catch(e){}
//       if(showJapanese){
//         let iCode= groupMap[gk][0].internalCode||"";
//         let jpEntry= categoriesData.find(x=> x.lang==="JA" && x.internalCode=== iCode && x.spreadId=== spId);
//         if(jpEntry){
//           try{
//             let jurl= `https://sheets.googleapis.com/v4/spreadsheets/${jpEntry.spreadId}/values/${encodeURIComponent(jpEntry.sheetName)}?key=${jpEntry.apiKey}`;
//             let jr= await fetch(jurl);
//             if(jr.ok){
//               let jd= await jr.json();
//               if(jd.values && jd.values.length>0){
//                 let arrJP= processSheetData(jd.values,true);
//                 baseArr.forEach((bb,idx)=>{
//                   if(arrJP[idx]){
//                     bb.jpQuestion= arrJP[idx].question;
//                     bb.jpExplanation= arrJP[idx].explanation;
//                   }
//                 });
//               }
//             }
//           }catch(e2){}
//         }
//       }
//       groupMap[gk].forEach(mItem=>{
//         let rowIdx= mItem.rowIndex;
//         let found= baseArr[rowIdx];
//         if(found){
//           allQs.push({
//             ...found,
//             userAnswer:mItem.userAnswer||"",
//             spreadId: spId, apiKey:mItem.apiKey,
//             sheetName:mItem.sheetName, internalCode:mItem.internalCode||"",
//             jpQuestion:found.jpQuestion||"",
//             jpExplanation:found.jpExplanation||""
//           });
//         } else {
//           allQs.push({...mItem});
//         }
//       });
//     }
//     if(!allQs.length){
//       showIOSAlert("提示","错题数据为空");
//       return;
//     }
//     questions= randomOrder? shuffle(allQs): allQs;
//     currentQuestionIndex=0;
//     userAnswers=[];
//     answerVisible=false;
//     mistakeQuestions=[];
//     elapsedTime=0;
//     currentExamId= Date.now().toString();

//     clearCurrentExam();
//     hideAll();
//     document.getElementById('quiz-container').style.display='block';
//     document.getElementById('sheet-name').textContent="错题单元测试";
//     loadQuestion();
//     startTimer();
//   })();
// }

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

    updateNavigationVisibility(true)

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

    updateNavigationVisibility(false);

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
function clearAllHistory() {
  showIOSConfirm("清除历史", "确认清除所有历史记录和错题吗？", () => {
    safeClear();
    favorites = {};
    showIOSAlert("提示", "历史已清除，包括收藏", () => {
      resetQuiz();
    });
  }, () => {});
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
async function showCampusLife(){
  hideAll();
  document.getElementById('campus-life-container').style.display='block';
  const listDiv = document.getElementById('campus-life-list');
  listDiv.innerHTML = "";
  let data = allBannerData.filter(x => x.category === "校园周边");
  if(!data.length){
    listDiv.innerHTML = "<p>暂无校园周边数据</p>";
    return;
  }

  // 按子类分组
  let groupMap = {};
  data.forEach(item => {
    const subCategory = item.subCategory || '其他';
    if (!groupMap[subCategory]) groupMap[subCategory] = [];
    groupMap[subCategory].push(item);
  });

  // 按子类名称排序
  let sortedSubCategories = Object.keys(groupMap).sort();

  // 为每个子类创建一个slider组
  for (const subCategory of sortedSubCategories) {
    const items = groupMap[subCategory];
    const groupDiv = document.createElement('div');
    groupDiv.className = "slider-group";
    groupDiv.innerHTML = `
      <div class="slider-header">
        <div class="slider-title">${subCategory}</div>
        <div class="slider-primary-text">校园周边 - ${subCategory}</div>
        <div class="slider-secondary-text">为您精选${items.length}家${subCategory}商户</div>
      </div>
    `;

    const rowDiv = document.createElement('div');
    rowDiv.className = "slider-row";

    // 添加商户卡片
    for (const item of items) {
      const videoId = item.type === "abs" ? getYoutubeVideoId(item.link) : null;
      const div = document.createElement('div');
      div.className = "slider-item";
      div.innerHTML = `
        <div class="slider-item-content">
          <div class="slider-image-wrapper">
            <img src="${await localDataManager.getLocalImage(item.image, 'banner') || item.image}" 
                 alt="${item.title || subCategory}" 
                 loading="lazy" />
            ${videoId ? `
              <div class="video-indicator">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            ` : ''}
          </div>
          <div class="slider-text">${item.title || subCategory}</div>
        </div>
      `;

      div.addEventListener('click', () => {
        const link = item.type === "abs" ? ensureAbsoluteUrl(item.link) : `./ads/pages/merchant.html?merchantId=${item.id}`;
        window.open(link, "_blank");
      });

      rowDiv.appendChild(div);
    }

    groupDiv.appendChild(rowDiv);
    listDiv.appendChild(groupDiv);
  }
}

async function showCarSurrounding(){
  hideAll();
  document.getElementById('car-surrounding-container').style.display='block';
  const listDiv = document.getElementById('car-surrounding-list');
  listDiv.innerHTML = "";
  let data = allBannerData.filter(x => x.category === "汽车周边");
  if(!data.length){
    listDiv.innerHTML = "<p>暂无汽车周边数据</p>";
    return;
  }

  // 按子类分组
  let groupMap = {};
  data.forEach(item => {
    const subCategory = item.subCategory || '其他';
    if (!groupMap[subCategory]) groupMap[subCategory] = [];
    groupMap[subCategory].push(item);
  });

  // 按子类名称排序
  let sortedSubCategories = Object.keys(groupMap).sort();

  // 为每个子类创建一个slider组
  for (const subCategory of sortedSubCategories) {
    const items = groupMap[subCategory];
    const groupDiv = document.createElement('div');
    groupDiv.className = "slider-group";
    groupDiv.innerHTML = `
      <div class="slider-header">
        <div class="slider-title">${subCategory}</div>
        <div class="slider-primary-text">汽车周边 - ${subCategory}</div>
        <div class="slider-secondary-text">为您精选${items.length}家${subCategory}商户</div>
      </div>
    `;

    const rowDiv = document.createElement('div');
    rowDiv.className = "slider-row";

    // 添加商户卡片
    for (const item of items) {
      const videoId = item.type === "abs" ? getYoutubeVideoId(item.link) : null;
      const div = document.createElement('div');
      div.className = "slider-item";
      div.innerHTML = `
        <div class="slider-item-content">
          <div class="slider-image-wrapper">
            <img src="${await localDataManager.getLocalImage(item.image, 'banner') || item.image}" 
                 alt="${item.title || subCategory}" 
                 loading="lazy" />
            ${videoId ? `
              <div class="video-indicator">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            ` : ''}
          </div>
          <div class="slider-text">${item.title || subCategory}</div>
        </div>
      `;

      div.addEventListener('click', () => {
        const link = item.type === "abs" ? ensureAbsoluteUrl(item.link) : `./ads/pages/merchant.html?merchantId=${item.id}`;
        window.open(link, "_blank");
      });

      rowDiv.appendChild(div);
    }

    groupDiv.appendChild(rowDiv);
    listDiv.appendChild(groupDiv);
  }
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
    })).filter(x=>x.id);
  } catch(e){
    console.error(e);
    return [];
  }
}

// Video player component and handler functions
function createVideoPlayer(url, onClose) {
  const container = document.createElement('div');
  container.className = 'video-player-container';
  
  const youtubeId = getYoutubeVideoId(url);
  const isDirectVideo = ['.mp4', '.webm', '.ogg'].some(ext => 
      url.toLowerCase().endsWith(ext)
  );
  
  let playerHtml;
  if (youtubeId) {
      const embedUrl = createYouTubeEmbedUrl(youtubeId);
      playerHtml = `
          <iframe 
              src="${embedUrl}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
          ></iframe>`;
  } else if (isDirectVideo) {
      playerHtml = `
          <video controls playsinline preload="metadata">
              <source src="${url}" type="video/mp4">
              您的浏览器不支持视频播放
          </video>`;
  } else {
      console.warn('Unsupported video URL format:', url);
      return null;
  }

  container.innerHTML = `
      <div class="video-player-overlay">
          <div class="video-player-content">
              <div class="video-player-header">
                  <button class="video-close-btn" aria-label="关闭视频">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                  </button>
              </div>
              <div class="video-wrapper">
                  ${playerHtml}
              </div>
          </div>
      </div>
  `;

  // Add styles with performance optimizations
  const style = document.createElement('style');
  style.textContent = `
      .video-player-container {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
      }
      .video-player-overlay {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          will-change: transform;
      }
      .video-player-content {
          width: 100%;
          max-width: 800px;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
      }
      .video-player-header {
          padding: 8px;
          text-align: right;
          background: rgba(0, 0, 0, 0.5);
          position: absolute;
          inset: 0 0 auto 0;
          z-index: 1;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
      }
      .video-close-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: white;
          opacity: 0.8;
          transition: opacity 0.2s;
          touch-action: manipulation;
      }
      .video-close-btn:hover,
      .video-close-btn:focus {
          opacity: 1;
      }
      .video-close-btn svg {
          width: 24px;
          height: 24px;
          display: block;
      }
      .video-wrapper {
          position: relative;
          padding-top: 56.25%;
          background: #000;
      }
      .video-wrapper video,
      .video-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
      }
  `;
  document.head.appendChild(style);

  // Add event listeners with performance optimizations
  const closeBtn = container.querySelector('.video-close-btn');
  closeBtn.addEventListener('click', () => {
      container.remove();
      style.remove();
      if (onClose) onClose();
  }, { passive: true });

  // Handle click outside with passive event listener
  container.addEventListener('click', (e) => {
      if (e.target === container || e.target.classList.contains('video-player-overlay')) {
          closeBtn.click();
      }
  }, { passive: true });

  return container;
}

// Function to safely create a YouTube embed URL with proper parameters
function createYouTubeEmbedUrl(videoId) {
  const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',           // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      enablejsapi: '1'     // Enable JavaScript API
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}


// Function to extract YouTube video ID from various YouTube URL formats
function getYoutubeVideoId(url) {
  if (!url) return null;
  
  try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtu.be')) {
          return urlObj.pathname.slice(1);
      }
      
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
      
      const embedMatch = urlObj.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return embedMatch[1];
  } catch (e) {
      console.warn('Invalid URL format:', url);
  }
  return null;
}

// Function to get YouTube thumbnail URL with different quality options
function getYouTubeThumbnailUrl(videoId, quality = 'maxresdefault') {
  //function getYouTubeThumbnailUrl(videoId, quality = 'maxresdefault') {
  // Available qualities: 
  // maxresdefault.jpg (1280x720)
  // sddefault.jpg (640x480)
  // hqdefault.jpg (480x360)
  // mqdefault.jpg (320x180)
  // default.jpg (120x90)
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}




// Function to check if thumbnail exists and fallback to lower quality if needed
async function getValidYouTubeThumbnail(videoId) {
  if (!videoId) return null;
  
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'default'];
  
  // First, check local cache for any quality
  for (const quality of qualities) {
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
      try {
          const hasLocal = await localDataManager.hasLocalImage(thumbnailUrl, 'banner');
          if (hasLocal) {
              return thumbnailUrl;
          }
      } catch (error) {
          console.warn(`Cache check failed for ${quality}:`, error);
      }
  }

  // If no cached version exists, handle remote loading
  for (const quality of qualities) {
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
      try {
          // Create a temporary image element
          const loaded = await new Promise((resolve, reject) => {
              const img = new Image();
              const timeoutId = setTimeout(() => reject(new Error('Load timeout')), 5000);
              
              img.onload = () => {
                  clearTimeout(timeoutId);
                  // Only consider it successful if we got actual dimensions
                  if (img.width > 0 && img.height > 0) {
                      resolve(true);
                  } else {
                      reject(new Error('Invalid image dimensions'));
                  }
              };
              
              img.onerror = () => {
                  clearTimeout(timeoutId);
                  reject(new Error('Load failed'));
              };
              
              // Don't set crossOrigin to avoid CORS issues
              img.src = thumbnailUrl;
          });

          if (loaded) {
              // Store the URL reference without trying to cache the actual image
              await localDataManager.storeImageReference(thumbnailUrl, 'banner');
              return thumbnailUrl;
          }
      } catch (error) {
          console.warn(`Failed to load ${quality}:`, error);
          continue;
      }
  }

  // Return default fallback
  return '/assets/images/video-placeholder.jpg';
}




// Function to check if URL is a video
function isVideoUrl(url) {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
         getYoutubeVideoId(url) !== null;
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

async function loadBottomBanners() {
  const bottom = document.getElementById('banner-bottom');
  bottom.innerHTML = "";

  // 举例：筛选 position === "bottom" 的数据
  let data = allBannerData.filter(x => x.position === "bottom");
  if (!data.length) {
    bottom.style.display = 'none';
    return;
  }
  bottom.style.display = 'block';

  for (const b of data) {
    if (b.image) {
      await localDataManager.downloadAndCacheImage(b.image, 'banner');
    }
    let slot = document.createElement('div');
    slot.className = "banner-slot";
    const linkUrl = b.type === "abs" ? ensureAbsoluteUrl(b.link) : `./ads/pages/merchant.html?merchantId=${b.id}`;
    let localURL = b.image ? await localDataManager.getLocalImage(b.image, 'banner') : null;
    let imgSrc = localURL || b.image;
    slot.innerHTML = `
      <a href="${linkUrl}" target="_blank">
        <img src="${imgSrc}" alt="广告" />
      </a>
    `;
    bottom.appendChild(slot);
  }
}


function handleSliderItemClick(item) {
  if (item.type === "internal") {
      switch (item.action) {
          case "battle":
              openBattleMode();
              break;
          case "favorites":
              showFavorites();
              break;
          case "mistakes":
              startMistakeQuiz();
              break;
          default:
              console.warn('Unknown internal action:', item.action);
      }
      return;
  }

  const url = item.type === "abs" ? 
      ensureAbsoluteUrl(item.link) : 
      `./ads/pages/merchant.html?merchantId=${item.id}`;

  if (item.type === "abs" && isVideoUrl(url)) {
      const player = createVideoPlayer(url);
      if (player) {
          document.body.appendChild(player);
      } else {
          window.open(url, "_blank");
      }
  } else {
      window.open(url, "_blank");
  }
}


async function loadSliderBanner() {
  try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${ADS_SPREAD_ID}/values/${ADS_SLIDER_MANAGER_SHEET_NAME}?key=${ADS_API_KEY}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error("无法获取Slider数据");
      const d = await r.json();
      if (!d.values || d.values.length <= 1) return;

      const managerData = d.values.slice(1).reduce((acc, row) => {
          if (row[0] && row[0].startsWith('Slider-')) {
              acc[row[0]] = {
                  title: row[1] || '',
                  primaryText: row[2] || '',
                  secondaryText: row[3] || ''
              };
          }
          return acc;
      }, {});

      let sliderData = allBannerData.filter(x => x.position.startsWith("slider-"));
      if (!sliderData.length) {
          document.getElementById('slider-banner-container').style.display = 'none';
          return;
      }
      document.getElementById('slider-banner-container').style.display = 'block';

      // Process each slider item
      for (const item of sliderData) {
          if (item.type === "abs" && item.link) {
              const videoId = getYoutubeVideoId(item.link);
              if (videoId) {
                  try {
                      // Get valid thumbnail URL
                      const thumbnailUrl = await getValidYouTubeThumbnail(videoId);
                      if (thumbnailUrl) {
                          // Update the item's image property
                          item.image = thumbnailUrl;
                      }
                  } catch (error) {
                      console.warn(`无法处理视频 ${videoId} 的缩略图:`, error);
                      // 使用默认图片或占位图
                      item.image = './src/images/default-thumbnail.webp';
                  }
              }
          }
      }

      let groupMap = {};
      sliderData.forEach(item => {
          let suf = item.position.replace('slider-', '');
          if (!groupMap[suf]) groupMap[suf] = [];
          groupMap[suf].push(item);
      });

      let container = document.getElementById('slider-banner-container');
      container.innerHTML = "";
      
      let sortedKeys = Object.keys(groupMap).sort((a, b) => +a - +b);
      for (const k of sortedKeys) {
          let arr = groupMap[k];
          let sliderKey = `Slider-${k}`;
          let mg = managerData[sliderKey] || {};
          let groupDiv = document.createElement('div');
          groupDiv.className = "slider-group";
          groupDiv.innerHTML = `
              <div class="slider-header">
                  <div class="slider-title">${mg.title || sliderKey}</div>
                  ${mg.primaryText ? `<div class="slider-primary-text">${mg.primaryText}</div>` : ''}
                  ${mg.secondaryText ? `<div class="slider-secondary-text">${mg.secondaryText}</div>` : ''}
              </div>
          `;
          let rowDiv = document.createElement('div');
          rowDiv.className = "slider-row";

          for (const item of arr) {
              const videoId = item.type === "abs" ? getYoutubeVideoId(item.link) : null;
              let div = document.createElement('div');
              div.className = "slider-item";
              
              // Add video indicator if it's a YouTube link
              const isVideo = videoId !== null;
              div.innerHTML = `
                  <div class="slider-item-content">
                      <div class="slider-image-wrapper">
                          <img src="${await localDataManager.getLocalImage(item.image, 'banner') || item.image}" 
                               alt="${item.title || '视频缩略图'}"
                               loading="lazy" />
                          ${isVideo ? `
                              <div class="video-indicator">
                                  <svg viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8 5v14l11-7z"/>
                                  </svg>
                              </div>
                          ` : ''}
                      </div>
                      <div class="slider-text">${item.title || ""}</div>
                  </div>
              `;

              div.addEventListener('click', () => handleSliderItemClick(item));
              rowDiv.appendChild(div);
          }
          groupDiv.appendChild(rowDiv);
          container.appendChild(groupDiv);
      }

      // Add styles for video indicator
      const style = document.createElement('style');
      style.textContent = `
          .slider-image-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
          }
          .video-indicator {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.7);
              border-radius: 50%;
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              pointer-events: none;
          }
          .video-indicator svg {
              width: 24px;
              height: 24px;
          }
          .slider-item:hover .video-indicator {
              background: rgba(0, 0, 0, 0.8);
              transform: translate(-50%, -50%) scale(1.1);
              transition: all 0.2s ease;
          }
      `;
      document.head.appendChild(style);

  } catch (e) {
      console.error('加载Slider失败:', e);
      document.getElementById('slider-banner-container').style.display = 'none';
  }
}

function handlePopupAction(popupData) {
  if (popupData.type === "internal") {
      switch (popupData.link) {
          case "battle":
              closePopup();
              openBattleMode();
              break;
          case "favorites":
              closePopup();
              showFavorites();
              break;
          case "mistakes":
              closePopup();
              startMistakeQuiz();
              break;
          default:
              console.warn('Unknown internal action:', popupData.link);
      }
      return;
  }

  const url = popupData.type === "abs" ? 
      ensureAbsoluteUrl(popupData.link) : 
      `./ads/pages/merchant.html?merchantId=${popupData.id}`;

  if (popupData.type === "abs" && isVideoUrl(url)) {
      closePopup();
      const player = createVideoPlayer(url);
      if (player) {
          document.body.appendChild(player);
      } else {
          window.open(url, "_blank");
      }
  } else {
      window.open(url, "_blank");
  }
}

async function loadPopupAds() {
  if (!allBannerData.length) {
      allBannerData = await fetchAllBannerData();
  }
  
  let popupData = allBannerData.filter(x => x.position === "popup");
  if (!popupData.length) {
      document.getElementById('popup-container').style.display = 'none';
      return;
  }
  
  const p = popupData[0];
  document.getElementById('popup-container').style.display = 'block';
  document.getElementById('popup-state1').style.display = 'block';
  document.getElementById('popup-state2').style.display = 'none';

  if (p.image) {
      await localDataManager.downloadAndCacheImage(p.image, 'banner');
  }
  
  let localURL = p.image ? await localDataManager.getLocalImage(p.image, 'banner') : null;
  let imgSrc = localURL || p.image;

  // Set up small popup state
  document.getElementById('popup-diamond').src = imgSrc;
  document.getElementById('popup-small-title').textContent = p.title;
  document.getElementById('popup-small-secondary').textContent = p.secondaryText;

  // Set up large popup state
  document.getElementById('popup-full-image').src = imgSrc;
  document.getElementById('popup-full-title').textContent = p.title;
  document.getElementById('popup-full-prime').textContent = p.primetext;
  document.getElementById('popup-action-btn').textContent = p.btntext;
  document.getElementById('popup-full-secondary').textContent = p.secondaryText;

  // Small popup click handler - always expands to large popup
  document.getElementById('popup-state1').onclick = (e) => {
      if (e.target.closest('.popup-close-btn')) return;
      document.getElementById('popup-state1').style.display = 'none';
      document.getElementById('popup-state2').style.display = 'block';
  };

  // Action button click handler - handles both internal and external actions
  document.getElementById('popup-action-btn').onclick = () => handlePopupAction(p);
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
function loadCurrentExam() {
  let ex = safeGetItem('currentExam');
  if (!ex) return null;
  return JSON.parse(ex);
}

function saveCurrentExam() {
  let cur = {
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
  safeSetItem('currentExam', JSON.stringify(cur));
}


function clearCurrentExam() {
  safeRemoveItem('currentExam');
  document.getElementById('continue-exam-func-btn').style.display = 'none';
}


function loadFavorites() {
  let f = safeGetItem('favorites');
  return f ? JSON.parse(f) : {};
}

function saveFavorites(obj) {
  safeSetItem('favorites', JSON.stringify(obj));
}


function loadMistakesFromCache() {
  let m = safeGetItem('mistakes');
  return m ? JSON.parse(m) : {};
}

function saveMistakesToCache(o) {
  safeSetItem('mistakes', JSON.stringify(o));
}

function loadQuizHistory() {
  let h = safeGetItem('quizHistory');
  return h ? JSON.parse(h) : [];
}

function saveQuizHistory(h) {
  safeSetItem('quizHistory', JSON.stringify(h));
}


// ==================================================
// 12. 本地版本检查 & 更新
// ==================================================
async function checkLocalVersion() {
  try {
      const updateBtn = document.getElementById('update-btn');
      const localVersionSpan = document.getElementById('local-version');
      const remoteVersionSpan = document.getElementById('remote-version');
      if (!updateBtn || !localVersionSpan || !remoteVersionSpan) return;
      
      // Get remote version and image data
      const [versionData, imageUrls] = await Promise.all([
          (async () => {
              const url = `https://sheets.googleapis.com/v4/spreadsheets/${SYSTEM_SPREADSHEET_ID}/values/${SYSTEM_CN_SHEET_NAME}!B6:B7?key=${SYSTEM_API_KEY}`;
              const r = await fetch(url);
              if (!r.ok) throw new Error(`获取版本信息失败: ${r.status}`);
              return await r.json();
          })(),
          fetchRemoteImageData()
      ]);

      const remoteVersion = versionData.values && versionData.values[0]
          ? versionData.values[0][0]
          : '未知';
      const serverVersion = versionData.values && versionData.values[1]
          ? versionData.values[1][0]
          : '未知';

      // Verify actual presence of images
      const allImageUrls = imageUrls.map(img => img.url);
      let missingImages = [];
      
      for (const imageUrl of allImageUrls) {
          const hasImage = await localDataManager.hasLocalImage(imageUrl);
          if (!hasImage) {
              missingImages.push(imageUrl);
          }
      }

      // Generate version based on actual present images
      const localVersion = await localDataManager.generateVersion(allImageUrls);
      localDataManager.saveLocalVersion(localVersion);

      // Update UI
      localVersionSpan.textContent = localVersion;
      remoteVersionSpan.textContent = `${remoteVersion || '-'} (服务端:${serverVersion})`;

      // Update status based on both version and image presence
      if (localVersion === remoteVersion && missingImages.length === 0) {
          updateBtn.dataset.status = 'latest';
          let tx = updateBtn.querySelector('.update-text');
          if (tx) tx.textContent = '最新';
      } else {
          updateBtn.dataset.status = 'needUpdate';
          let tx = updateBtn.querySelector('.update-text');
          if (tx) {
              if (missingImages.length > 0) {
                  tx.textContent = `需要更新(缺少${missingImages.length}张图片)`;
              } else {
                  tx.textContent = '需要更新';
              }
          }
          
          // Log missing images for debugging
          if (missingImages.length > 0) {
              console.warn('Missing images:', missingImages);
          }
      }
  } catch (e) {
      console.error('检查版本失败:', e);
      const updateBtn = document.getElementById('update-btn');
      if (updateBtn) {
          updateBtn.dataset.status = 'needUpdate';
          let tx = updateBtn.querySelector('.update-text');
          if (tx) tx.textContent = '检查失败';
      }
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
  }, 300000); // 5分钟超时

  try {
    // Fetch remote数据
    const [imageUrls, categories] = await Promise.all([
      fetchRemoteImageData(),
      fetchRemoteCategories()
    ]);

    console.log('=== 开始检查本地数据状态 ===');

    // 先检查题库（ZH）
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

    // 检查图片
    const localImages = await checkLocalImages(imageUrls);
    const missingImages = imageUrls.filter(img => !localImages.includes(img.url));
    console.log(`需要下载的图片数量: ${missingImages.length}`);

    // 更新缺失的题库
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

    // 更新缺失的图片
    if (missingImages.length > 0) {
      const result = await localDataManager.updateFromSystemSheet(imageUrls);
      if (result.failedCount > 0) {
        errors.push(`${result.failedCount}个图片下载失败`);
      }
      // 更新UI显示版本号
      const localVerSpan = document.getElementById('local-version');
      if (localVerSpan) localVerSpan.textContent = result.version;
    } else {
      // 即使没有缺失，也重新计算下新版本号
      const newVersion = await localDataManager.generateVersion(imageUrls.map(i => i.url));
      localDataManager.saveLocalVersion(newVersion);
      const localVerSpan = document.getElementById('local-version');
      if (localVerSpan) localVerSpan.textContent = newVersion;
    }

    if (errors.length > 0) {
      updateStatus('needUpdate', errors.join(', '));
    } else {
      updateStatus('latest', '最新');
    }

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
  constructor() {
      this.dbPromise = null;
      this.versionKey = 'localImagesVersion';
      this.updateStatus = 'latest';
      this.dbName = 'zalemCache';
      this.stores = {
          quizImages: 'quizImages',
          bannerImages: 'bannerImages',
          quizTest: 'quizTest'
      };
      this.db = null;
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
              db.onerror = (event) => {
                  console.error('数据库错误:', event.target.error);
              };
              resolve(db);
          };
          
          request.onupgradeneeded = (event) => {
              const db = event.target.result;
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

  getLocalVersion() {
      return localStorage.getItem(this.versionKey) || '';
  }

  saveLocalVersion(v) {
      localStorage.setItem(this.versionKey, v);
  }

  normalizeImageUrl(url) {
    if (!url) return '';
    
    try {
        // Step 1: Basic URL cleanup
        let normalizedUrl = url.trim();
        
        // Step 2: Handle GitHub URLs
        if (normalizedUrl.includes('github.com')) {
            // Convert github.com URLs to raw.githubusercontent.com
            normalizedUrl = normalizedUrl
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
                
            // Remove ?raw=true parameter if present
            normalizedUrl = normalizedUrl.replace('?raw=true', '');
            
            // Fix refs/heads in URL if present
            normalizedUrl = normalizedUrl.replace('/refs/heads/', '/');
        }
        
        // Step 3: Parse and reconstruct the URL to handle encoding correctly
        const urlObj = new URL(normalizedUrl);
        
        // Step 4: Handle pathname encoding
        // Split the path into segments and handle each separately
        const pathSegments = urlObj.pathname.split('/')
            .map(segment => {
                // Decode first to handle any existing encoding
                let decoded = decodeURIComponent(segment);
                // Re-encode but preserve certain characters
                return encodeURIComponent(decoded)
                    .replace(/%20/g, ' ') // Keep spaces readable
                    .replace(/%2F/g, '/') // Keep forward slashes
                    .replace(/%3A/g, ':'); // Keep colons
            });
            
        // Reconstruct the pathname
        urlObj.pathname = pathSegments.join('/');
        
        // Step 5: Return the normalized URL
        return urlObj.toString().replace(/\s/g, '%20');
        
    } catch (e) {
        console.warn('URL normalization error:', e);
        // If something goes wrong, return the original URL
        return url;
    }
}

// Add this method to LocalDataManager class
async storeImageReference(url, type = 'quiz') {
  await this.ensureDbReady();
  if (!url) return false;

  const normalizedUrl = this.normalizeImageUrl(url);
  
  try {
      const storeName = (type === 'banner' ? this.stores.bannerImages : this.stores.quizImages);
      await new Promise((resolve, reject) => {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          // Store just the URL and timestamp, without the blob
          const request = store.put({
              url: normalizedUrl,
              timestamp: Date.now(),
              isReference: true
          });

          transaction.oncomplete = () => resolve(true);
          transaction.onerror = (e) => reject(e);
      });
      
      return true;
  } catch (error) {
      console.error('Failed to store image reference:', error);
      return false;
  }
}


// Add this method to LocalDataManager class
async storeImageBlob(url, blob, type = 'quiz') {
  await this.ensureDbReady();
  if (!url || !blob) return false;

  const normalizedUrl = this.normalizeImageUrl(url);
  
  try {
      const storeName = (type === 'banner' ? this.stores.bannerImages : this.stores.quizImages);
      await new Promise((resolve, reject) => {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put({
              url: normalizedUrl,
              blob: blob,
              timestamp: Date.now()
          });

          transaction.oncomplete = () => resolve(true);
          transaction.onerror = (e) => reject(e);
      });
      
      return true;
  } catch (error) {
      console.error('Failed to store image blob:', error);
      return false;
  }
}

async hasLocalImage(url, type = 'quiz') {
  await this.ensureDbReady();
  if (!url) return false;

  const normalizedUrl = this.normalizeImageUrl(url);
  
  return new Promise(resolve => {
      const storeName = (type === 'banner' ? this.stores.bannerImages : this.stores.quizImages);
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(normalizedUrl);

      request.onsuccess = () => {
          const result = request.result;
          resolve(result ? true : false);
      };

      request.onerror = () => {
          console.warn('Failed to check cached image:', normalizedUrl);
          resolve(false);
      };
  });
}

async getLocalImage(url, type = 'quiz') {
  await this.ensureDbReady();
  if (!url) return null;

  const normalizedUrl = this.normalizeImageUrl(url);
  
  try {
      const storeName = (type === 'banner' ? this.stores.bannerImages : this.stores.quizImages);
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const result = await new Promise((resolve, reject) => {
          const request = store.get(normalizedUrl);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
      });

      if (result) {
          if (result.isReference) {
              // If it's a reference-only entry, return the original URL
              return normalizedUrl;
          } else if (result.blob) {
              // If we have the actual blob, create an object URL
              return URL.createObjectURL(result.blob);
          }
      }
      return null;
  } catch (error) {
      console.error('Error retrieving image:', error);
      return null;
  }
}

  async downloadAndCacheImage(url, type = 'quiz') {
    await this.ensureDbReady();
    if (!url) return false;

    const normalizedUrl = this.normalizeImageUrl(url);
    console.log('Downloading and caching image:', normalizedUrl);
    
    try {
        // Check if already cached
        const hasLocal = await this.hasLocalImage(normalizedUrl, type);
        if (hasLocal) {
            console.log('Image already cached:', normalizedUrl);
            return true;
        }

        // Download image
        const options = {
            credentials: 'omit',
            headers: {
                'Accept': 'image/*'
            }
        };
        
        if (normalizedUrl.includes('ytimg.com')) {
            options.mode = 'no-cors';
        }

        const response = await fetch(normalizedUrl, options);
        if (!response.ok && response.type !== 'opaque') {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        
        // Verify blob is valid
        if (blob.size === 0) {
            throw new Error('Downloaded blob is empty');
        }

        // Store in IndexedDB with retries
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const storeName = (type === 'banner' ? this.stores.bannerImages : this.stores.quizImages);
                await new Promise((resolve, reject) => {
                    const transaction = this.db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put({
                        url: normalizedUrl,
                        blob: blob,
                        timestamp: Date.now()
                    });

                    transaction.oncomplete = () => resolve(true);
                    transaction.onerror = (e) => reject(e);
                });
                
                // Verify storage was successful
                const stored = await this.hasLocalImage(normalizedUrl, type);
                if (stored) {
                    console.log('Successfully cached image:', normalizedUrl);
                    return true;
                }
                
                throw new Error('Storage verification failed');
            } catch (error) {
                console.warn(`Cache attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    } catch (error) {
        console.error('Failed to download and cache image:', normalizedUrl, error);
        return false;
    }
}

  async saveQuizData(language, category, questions) {
      await this.ensureDbReady();
      if (!this.db) return false;
      try {
          return new Promise(resolve => {
              const id = `${language}_${category}`;
              const data = {
                  id,
                  language,
                  category,
                  questions,
                  timestamp: Date.now()
              };
              const transaction = this.db.transaction(this.stores.quizTest, 'readwrite');
              const store = transaction.objectStore(this.stores.quizTest);
              const request = store.put(data);
              request.onsuccess = () => resolve(true);
              request.onerror = () => {
                  console.error('保存题目数据失败:', id);
                  resolve(false);
              };
          });
      } catch (e) {
          console.error('saveQuizData出错:', e);
          return false;
      }
  }

  async getQuizData(language, category) {
      await this.ensureDbReady();
      if (!this.db) return null;
      try {
          return new Promise(resolve => {
              const id = `${language}_${category}`;
              const transaction = this.db.transaction(this.stores.quizTest, 'readonly');
              const store = transaction.objectStore(this.stores.quizTest);
              const request = store.get(id);
              request.onsuccess = () => {
                  const result = request.result;
                  resolve(result ? result.questions : null);
              };
              request.onerror = () => {
                  console.error('获取题目数据失败:', id);
                  resolve(null);
              };
          });
      } catch (e) {
          console.error('getQuizData出错:', e);
          return null;
      }
  }

  async getAllStoredImages(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
            console.error('Failed to get stored images');
            resolve([]);
        };
    });
}

  async getAllQuizData() {
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.stores.quizTest,'readonly');
        const store = transaction.objectStore(this.stores.quizTest);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
          console.error('Failed to get quiz data');
          resolve([]);
      };
  });
}

processQuizDataForVersion(quizData) {
  return quizData
      .filter(d => d && d.id && Array.isArray(d.questions))
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(d => ({
          id: d.id,
          questions: d.questions
              .filter(q => q && typeof q.question === 'string')
              .map(q => ({
                  ...q,
                  options: (Array.isArray(q.options) ? [...q.options] : []).sort(),
                  image: q.image || '',
                  explanation: q.explanation || ''
              }))
              .sort((a, b) => {
                  const qCompare = a.question.localeCompare(b.question);
                  if (qCompare !== 0) return qCompare;
                  return a.answer.localeCompare(b.answer);
              })
      }))
      .map(d => {
          const questionHashes = d.questions.map(q => [
              q.question,
              q.answer,
              q.options.join('|'),
              q.image,
              q.explanation
          ].join('::'));
          return `${d.id}:${questionHashes.join('|')}`;
      })
      .join(',');
}


  async generateVersion(imageUrls = []) {
    await this.ensureDbReady();
    
    // Get actual stored images from IndexedDB
    const storedQuizImages = await this.getAllStoredImages(this.stores.quizImages);
    const storedBannerImages = await this.getAllStoredImages(this.stores.bannerImages);
    
    // Create a set of actually stored image URLs
    const storedUrls = new Set([
        ...storedQuizImages.map(item => item.url),
        ...storedBannerImages.map(item => item.url)
    ]);

    // Filter the provided URLs to only include those that actually exist in storage
    const actuallyStoredUrls = imageUrls.filter(url => storedUrls.has(this.normalizeImageUrl(url)));
    
    // Get quiz data
    const quizData = await this.getAllQuizData();
    
    // Generate version string based on actual stored content
    const contentParts = [
        actuallyStoredUrls.sort().join(','),
        this.processQuizDataForVersion(quizData)
    ];

    const contentString = contentParts.join('|');
    if (!contentString) return 'v0';

    // Generate hash
    let hash = 0;
    const prime = 31;
    for (let i = 0; i < contentString.length; i++) {
        hash = Math.imul(hash, prime) + contentString.charCodeAt(i) | 0;
    }
    
    return 'v' + Math.abs(hash).toString(36);
}

  async updateFromSystemSheet(imageUrls) {
      if (this.updateStatus === 'updating') {
          console.log('更新进行中...');
          return { version: this.getLocalVersion(), failedCount: 0 };
      }
      
      this.updateStatus = 'updating';
      await this.ensureDbReady();

      try {
          const checks = await Promise.all(imageUrls.map(async item => {
              const has = await this.hasLocalImage(item.url, item.type);
              return { url: item.url, type: item.type, needsDownload: !has };
          }));
          
          const newOnes = checks.filter(x => x.needsDownload);
          let failedCount = 0;
          
          for (const item of newOnes) {
              const ok = await this.downloadAndCacheImage(item.url, item.type);
              if (!ok) failedCount++;
          }

          // 清理未使用的图片
          if (this.db) {
              const neededUrls = new Set(imageUrls.map(i => i.url));
              const tq = this.db.transaction(this.stores.quizImages, 'readwrite');
              const tb = this.db.transaction(this.stores.bannerImages, 'readwrite');
              const sq = tq.objectStore(this.stores.quizImages);
              const sb = tb.objectStore(this.stores.bannerImages);
              
              const rq1 = sq.getAllKeys();
              const rq2 = sb.getAllKeys();
              
              rq1.onsuccess = () => {
                  const keys = rq1.result || [];
                  keys.forEach(url => {
                      if (!neededUrls.has(url)) {
                          sq.delete(url);
                      }
                  });
              };
              
              rq2.onsuccess = () => {
                  const keys = rq2.result || [];
                  keys.forEach(url => {
                      if (!neededUrls.has(url)) {
                          sb.delete(url);
                      }
                  });
              };
          }

          const newVersion = await this.generateVersion(imageUrls.map(i => i.url));
          this.saveLocalVersion(newVersion);
          this.updateStatus = 'latest';
          
          return { version: newVersion, failedCount };
      } catch (error) {
          this.updateStatus = 'needUpdate';
          throw error;
      }
  }
}



window.localDataManager= new LocalDataManager();