/**
 * 人生已完成清单模块
 * 使用事件委托优化性能
 */

const tags = [
  "送礼物", "被送礼物", "暗恋", "明恋", "失恋", "表白", "被表白", "留长发", "剪短发", "染发",
  "漂发", "烫发", "化妆", "做美甲", "放下一个人", "有过遗憾", "爱而不得", "双向奔赴",
  "当海王", "拒绝他人表白", "表白被拒", "被渣", "犯过傻", "装糊涂", "犯校规", "迟到",
  "旷课", "上课睡觉", "打架被叫家长", "去酒吧", "和朋友去KTV", "断片", "失眠", "睡一天",
  "吵架", "绝交", "晚上一个人哭", "献血", "住院", "做手术", "晕倒", "会做饭", "做一桌菜",
  "做饭给家人", "做甜品给喜欢的人", "有超过10年的好朋友", "有个无条件可信任的朋友",
  "买花", "被送花", "给自己买礼物", "通宵补作业", "一个人散步", "夜跑", "深夜散心",
  "向陌生人吐露心声", "一个人出去吃饭", "一个人看电影", "摄影", "一个人去酒吧",
  "一个人过生日", "一个人逛超市", "一个人去图书馆", "一个人看病", "一个人去唱歌",
  "社死过", "一个人出门逛", "一个人在外难过", "给自己写信", "出国", "一个人旅游",
  "跟朋友旅游", "拥有要好的异性朋友", "谈恋爱", "考试不及格", "考试第一名", "当班干部",
  "竞选学生会", "上电视", "上报纸", "登台演出", "主持节目", "演讲", "野性消费",
  "被雪糕刺客伤过", "被老师点名表扬", "被老师点名批评", "全校表扬", "被背叛", "被伤害",
  "被坚定选择", "获奖", "学一种外语", "写论文", "写书", "写诗", "写日记", "写剧本",
  "写歌", "拍影片", "参加比赛", "拍写真", "买相机", "会一种乐器", "有过超过5年的兴趣爱好",
  "参加志愿活动", "自己一个人住宾馆", "看鬼片", "去密室", "去鬼屋", "去游乐场",
  "去看现场演唱会", "去音乐节", "偶遇明星", "去签售会", "在图书馆待一天", "兼职",
  "打工", "看画展", "捐款", "道歉", "释怀", "失望", "淋雨", "种花", "养宠物", "泡温泉",
  "跳伞", "坐过山车", "蹦极", "骑马", "卡丁车", "攀岩", "游泳", "滑雪", "滑冰", "旱冰",
  "滑板", "去野炊", "登山", "看雪", "看海", "看日出", "看日落", "拿驾照", "自驾游",
  "给父母买衣服", "当伴娘/郎", "摆地摊", "和同学打水仗", "社团活动", "组建社团", "写信",
  "独自坐飞机", "拼拼图", "办生日会", "健身", "买名牌", "开网店", "练字", "沉迷游戏",
  "拍毕业照", "面试成功", "放孔明灯", "逛小吃街", "和网友见面", "发表成果", "买唱片",
  "异地恋", "异国恋", "认识不同国籍的人", "创业", "看极光", "进公司工作", "做未来规划",
  "搬家", "一个人租房", "转学", "被骗", "撒谎", "改掉一个坏习惯", "加入校队", "坐摩天轮",
  "在朋友家过夜", "擅长一项运动", "谈过一场刻骨铭心的恋爱"
];

const initLifeChecklist = () => {
  const tagsContainer = document.querySelector(".tags-container");
  const counter = document.querySelector(".counter");

  if (!tagsContainer || !counter) return;

  // 使用 DocumentFragment 减少 DOM 操作
  const fragment = document.createDocumentFragment();
  tags.forEach((text) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    tag.dataset.active = "false";
    fragment.appendChild(tag);
  });
  tagsContainer.appendChild(fragment);

  // 使用事件委托处理点击
  tagsContainer.addEventListener("click", (e) => {
    const tag = e.target.closest(".tag");
    if (!tag) return;

    const isActive = tag.dataset.active === "true";
    tag.dataset.active = (!isActive).toString();
    tag.classList.toggle("active", !isActive);

    // 更新计数器
    const activeCount = tagsContainer.querySelectorAll(".tag.active").length;
    counter.textContent = `已完成：${activeCount}`;
  });
};

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", initLifeChecklist);
