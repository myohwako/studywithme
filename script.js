// script.js
// ------------------- 전역 변수 및 데이터 -------------------
const missionData = [{
    id: 1,
    text: "게임기 폐기하기",
    img: "assets/1-game.png",
    message: `첫 달이라 그런지 너무 풀어져 있네.\n 아직도 주말마다 한 시간씩 게임을 하잖아! 그만하게 도와주자.`,
    emoji: "assets/character-1.png"
  },
  {
    id: 2,
    text: "야간 독서실 강제 등록하기",
    img: "assets/2-study.png",
    message: `메디컬 입시는 학원만으로는 부족해..\n 의지가 약한 아이니까 밤늦게까지 공부할 수 있도록 독서실을 등록시켜야겠어.`,
    emoji: "assets/character-2.png"
  },
  {
    id: 3,
    text: "연애 금지하기",
    img: "assets/3-love.png",
    message: `연애에 빠져있는 것 같아. 저렇게 여유로울 수가!\n 집중력을 높이기 위해 조치를 취하자.`,
    emoji: "assets/character-3.png"
  },
  {
    id: 4,
    text: "시간표 편성해주기",
    img: "assets/4-time.png",
    message: `시간 개념도 없는 것 같아.\n 스스로 시간 분배도 못 하는 것 같으니 도와주자.`,
    emoji: "assets/character-4.png"
  },
  {
    id: 5,
    text: "영양제 챙겨주기",
    img: "assets/5-pill.png",
    message: `최근들어 집중력도 저하되고 체력도 부족해 보여.\n 하지만 이미 충분히 많이 자고 있다고 생각해. 영양제를 챙겨주자.`,
    emoji: "assets/character-5.png"
  },
  {
    id: 6,
    text: "담배 압수하고 방학동안 외출 금지",
    img: "assets/6-cigar.png",
    message: `담배를 피다니!! 정신이 어디에 있는 거야?\n 서랍에서 당장 담배를 압수하고 방학동안 외출을 금지시키자.`,
    emoji: "assets/character-6.png"
  },
  {
    id: 7,
    text: "정신과 예약하고 공부 시간 늘리기",
    img: "assets/7-blood.png",
    message: `몸에 일부러 상처 낸 흔적을 발견했어.. 어떻게 이렇게 저렴한 짓만 골라 할 수 있지?\n 당장 정신과 예약하고, 허튼 생각 못하게 하루 공부 시간을 더 늘려야 겠어.`,
    emoji: "assets/character-7.png"
  },
  {
    id: 8,
    text: "어떻게든 무단결석 막기",
    img: "assets/8-truancy.png",
    message: `등교를 거부하고 있어. 의대 가겠다는 애가 저렇게 멍청해서야.\n 내가 다 부끄럽다. 폭력을 강행해서라도 등교시키자.`,
    emoji: "assets/character-8.png"
  },
  {
    id: 9,
    text: "방 안에 감금하기",
    img: "assets/9-drop.png",
    message: `끝내 자퇴하겠다고 해. 막아야 해.`,
    emoji: "assets/character-9.png"
  },
  {
    id: 10,
    text: "...",
    img: "assets/10-heart.png",
    message: `방에서 나오지도 않고 공부만 하네. 이제 마지막 달이니 그럴 만도 하지.`,
    emoji: "assets/character-9.png"
  }
];

const tooltipMessages = {
  1: "안녕!ㅎㅎ",
  2: "이정도 성적이면 불안할지도.. 하지만 사실 난 의대에 가고 싶지는 않은데...",
  3: "여자친구라도 있어서 다행이다 ㅎㅎ",
  4: "지금 시간표는 나한테는 너무 빡빡한 것 같아..",
  5: "어떻게든 공부 시간을 늘리려다 보니 잠도 못 자고 힘들어.. 더 집중이 안 되는 것 같아.",
  6: "한 번만 봐줘...",
  7: "힘들어",
  8: "...",
  9: "...",
  10: "이제 좀 익숙해 진 것 같아."
};


let currentMission = 1;
let missionStates = Array(10).fill(false);
let stress = 0;
const userName = localStorage.getItem("username") || "아이";


document.addEventListener("DOMContentLoaded", () => {
  const cam = document.querySelector(".cam-container");
  const camName = document.getElementById("cam-name");
  const characterDisplay = document.getElementById("character-display");

  camName.textContent = `이름: ${userName}`;
  characterDisplay.innerHTML = `<img src="${missionData[currentMission - 1].emoji}" alt="감정 이미지">`;

  renderMissions();
  updateCalendar();
  updateStatus();
  makeDraggable(cam);
  makeDraggable(document.getElementById("calendar-modal"));
  initTooltip();
});

function renderMissions() {
  const leftContainer = document.getElementById("mission-left");
  const rightContainer = document.getElementById("mission-right");

  leftContainer.innerHTML = "";
  rightContainer.innerHTML = "";

  missionData.forEach(({
    id,
    text,
    img
  }) => {
    const div = document.createElement("div");
    div.className = "mission";
    div.dataset.id = id;

    const iconImg = document.createElement("img");
    iconImg.src = img;
    iconImg.alt = `Mission ${id}`;
    iconImg.style.width = "50px";
    iconImg.style.height = "50px";
    iconImg.style.objectFit = "cover";

    const textP = document.createElement("p");
    textP.textContent = `${id}. ${text}`;

    div.appendChild(iconImg);
    div.appendChild(textP);

    // 상태 처리
    if (missionStates[id - 1]) div.classList.add("cleared");
    else if (id !== currentMission) div.classList.add("locked");

    // 클릭 이벤트
    div.addEventListener("click", () => {
      const existingModal = document.querySelector(".modal.mission-modal");
      if (id === currentMission && !existingModal) {
        createModal(id);
      }
    });

    if (id <= 5) leftContainer.appendChild(div);
    else rightContainer.appendChild(div);
  });
}



// 좌측 하단 Start 버튼
const startBtn = document.querySelector("#start-button");
const slideMenu = document.querySelector("#slide-menu");

startBtn.addEventListener("click", () => {
  slideMenu.innerHTML = ""; // 기존 내용 제거

  const options = ["저장하기", "Main 으로 나가기", "재부팅"];
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "slide-menu-btn";
    slideMenu.appendChild(btn);

    if (option === "저장하기") {
      btn.onclick = () => saveCurrentSlot(1); // 슬롯1에 저장
    }
    if (option === "Main 으로 나가기") {
      btn.onclick = () => location.href = "main.html";
    }
    if (option === "재부팅") {
      btn.onclick = () => location.reload();
    }
  });

  slideMenu.classList.add("show");
});


// 로드버튼
const loadBtn = document.getElementById("load-button");

function checkSaveExists() {
  if (!localStorage.getItem("saveSlot1")) {
    loadBtn.style.opacity = "0.4";
    loadBtn.disabled = true;
  } else {
    loadBtn.style.opacity = "1";
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", () => {
  const savedData = JSON.parse(localStorage.getItem("saveSlot1"));
  if (savedData) {
    loadGameData(savedData); // 사용자 정의 함수
    window.location.href = "game.html"; // 게임 화면으로 이동
  }
});

checkSaveExists();

// 저장/불러오기
function saveCurrentSlot(slotNum) {
  const saveData = {
    currentMission: currentMissionIndex,
    diaryEntries: [...diaryList],
    unlocked: [...unlockedMissions]
  };
  localStorage.setItem(`saveSlot${slotNum}`, JSON.stringify(saveData));
}


// 미션 모달창을 총괄하는!!! 
function createModal(id) {
  const existingModal = document.querySelector(".modal.mission-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.className = "modal mission-modal";

  modal.innerHTML = `
    <div class="modal-header">
      <span>Mission ${id}</span>
      <span class="close-btn">✕</span>
    </div>
    <div class="modal-body" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <p style="white-space: pre-line;">${missionData[id - 1].message}</p>
        <div class="mini-game-area" style="margin-top: 16px;"></div>
      </div>
      <button class="confirm-btn" style="align-self: flex-end; display: ${id === 1 || id === 2 ? "none" : "block"};">확인</button>
    </div>
  `;

  if (id === 1) MiniGame1(modal);
  if (id === 2) MiniGame2(modal);
  if (id === 3) MiniGame3(modal);
  if (id === 4) MiniGame4(modal);
  if (id === 5) MiniGame5(modal);
  if (id === 6) MiniGame6(modal);
  if (id === 7) MiniGame7(modal);
  if (id === 8) MiniGame8(modal);
  if (id === 9) MiniGame9(modal);
  if (id === 10) MiniGame10(modal);

  document.body.appendChild(modal);
  makeDraggable(modal);

  modal.querySelector(".confirm-btn").onclick = (e) => {
    e.stopPropagation();

    if (id === 10) {
      modal.remove();
      triggerFinalPhase();
      return;
    }

    modal.remove();
    missionStates[id - 1] = true;
    stress += Math.floor(Math.random() * 10) + 5;
    if (currentMission < 10) currentMission = id + 1;
    renderMissions();
    updateCalendar();
    updateStatus();
    addDiaryNote(id);

    const characterDisplay = document.getElementById("character-display");
    if (currentMission <= 10) {
      characterDisplay.innerHTML = `<img src="${missionData[currentMission - 1].emoji}" alt="감정 이미지">`;
    }
    if (currentMission <= missionData.length) {
      showTypingMessage(missionData[currentMission - 1].message);
    }

  };

  modal.querySelector(".close-btn").onclick = (e) => {
    e.stopPropagation();
    modal.remove();
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Mission 1 미니게임 =================================================================
function MiniGame1(modal) {
  const area = modal.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");
  confirmBtn.style.display = "none";

  const img = document.createElement("img");
  img.src = "assets/game-0.png";
  img.style.width = "100%";
  img.style.maxWidth = "400px";
  img.style.margin = "0 auto";
  img.style.display = "block";
  area.appendChild(img);

  let stage = 0;

  function spawnButton() {
    const btn = document.createElement("button");
    btn.textContent = "격파!";
    btn.style.position = "absolute";
    btn.style.zIndex = 10;
    btn.style.background = "red";
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.padding = "10px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "1rem";

    const rect = img.getBoundingClientRect();
    const x = Math.random() * 200 + 100;
    const y = Math.random() * 100 + 100;
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    area.appendChild(btn);

    btn.onclick = () => {
      area.removeChild(btn);
      stage++;
      img.src = `assets/game-${stage}.png`;
      if (stage < 3) setTimeout(spawnButton, 1000);
      else confirmBtn.style.display = "block";
    };

    Object.assign(btn.style, {
      position: "absolute",
      top: `${Math.random() * 60 + 10}%`,
      left: `${Math.random() * 60 + 10}%`,
      transform: "translate(-50%, -50%)",
      padding: "12px",
      backgroundColor: "rgb(255, 255, 255, 0.9)",
      color: "red",
      border: "4px solid red",
      borderRadius: "48px",
      cursor: "pointer",
      fontSize: "1.5rem",
      fontWeight: "bold",
      fontFamily: "Galmuri11",
      animation: "blink 1s ease-in-out infinite",
      zIndex: 5
    });
  }

  setTimeout(spawnButton, 1000);
}

// Mission 2 미니게임 =================================================================
function MiniGame2(modal) {
  const body = modal.querySelector(".modal-body");
  const area = body.querySelector(".mini-game-area");
  area.innerHTML = ""; // 기존 미니게임 영역만 비움

  // 기존 설명 <p> 제거
  const desc = body.querySelector("p");
  if (desc) desc.remove();

  // 신청서 박스
  const signatureBox = document.createElement("div");
  Object.assign(signatureBox.style, {
    padding: "1.5rem",
    backgroundColor: "white",
    border: "1px solid black",
    fontFamily: "Galmuri11",
    textAlign: "center",
    position: "relative"
  });

  const title = document.createElement("div");
  title.textContent = "독서실 등록 신청서";
  Object.assign(title.style, {
    fontSize: "1.25rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "0.5rem"
  });

  const content = document.createElement("div");
  content.textContent = "야간 독서실 사용 신청 서명하기";
  Object.assign(content.style, {
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "1rem",
    color: "#444"
  });

  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 120;
  Object.assign(canvas.style, {
    border: "2px dashed #999",
    backgroundColor: "#fff",
    width: "100%",
    height: "80px"
  });

  // 드로잉 설정
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  let drawing = false;
  let isSigned = false;
  let drawCount = 0;

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.stroke();

    drawCount++;
    if (!isSigned && drawCount > 10) {
      isSigned = true;
      const confirmBtn = modal.querySelector(".confirm-btn");
      if (confirmBtn) confirmBtn.style.display = "block";
    }
  });

  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });

  // 요소 조립
  signatureBox.appendChild(title);
  signatureBox.appendChild(content);
  signatureBox.appendChild(canvas);

  area.appendChild(desc);
  area.appendChild(signatureBox);
}


// Mission 3 미니게임 =================================================================
function MiniGame3(modal) {
  const body = modal.querySelector(".modal-body");
  const gameArea = body.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 설명 텍스트 교체
  const desc = body.querySelector("p");
  desc.textContent = missionData[2].message;

  // 중앙 정렬 스타일 적용
  Object.assign(gameArea.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  });

  // 폰 프레임 박스
  const phoneBox = document.createElement("div");
  Object.assign(phoneBox.style, {
    width: "300px",
    height: "500px",
    background: "#eee",
    borderRadius: "24px",
    padding: "1rem",
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "Galmuri11",
    position: "relative"
  });

  // 상단 프로필
  const header = document.createElement("div");
  header.textContent = "여자친구♡";
  Object.assign(header.style, {
    fontSize: "0.8rem",
    textAlign: "center",
    marginBottom: "0.5rem"
  });

  // 채팅 창
  const chatBox = document.createElement("div");
  Object.assign(chatBox.style, {
    flexGrow: "1",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    marginBottom: "0.5rem"
  });

  // 기본 대화 내용
  const initialChats = [{
      sender: "gf",
      text: "왜 요즘 연락이 없어?"
    },
    {
      sender: "me",
      text: "미안, 좀 바빴어."
    },
    {
      sender: "gf",
      text: "진짜 왜 이렇게 의욕이 없니..."
    },
    {
      sender: "me",
      text: "나도 노력하고 있어.."
    },
    {
      sender: "me",
      text: "우리 부모님 나 의대 못 가면 엄청 실망하실거야.."
    },
    {
      sender: "gf",
      text: "하... 알지"
    },
    {
      sender: "gf",
      text: "그래도 하루 쯤은 시간 내줄 수 있잖아"
    },
    {
      sender: "gf",
      text: "내일 내 생일인 것도 모르지 ㅡㅡ"
    },
    {
      sender: "me",
      text: "그걸 어떻게 몰라"
    },
    {
      sender: "me",
      text: "그럼 내일 만날래? 한시간 정도는 시간 낼 수 있을 것 같아"
    },
    {
      sender: "gf",
      text: "좋아"
    },
    {
      sender: "gf",
      text: "조아해 ⌯⦁⩊⦁⌯ಣ"
    }
  ];

  initialChats.forEach(chat => {
    const bubble = document.createElement("div");
    bubble.textContent = chat.text;
    Object.assign(bubble.style, {
      alignSelf: chat.sender === "gf" ? "flex-start" : "flex-end",
      background: chat.sender === "gf" ? "#f0f0f0" : "#d0f0ff",
      color: "#000",
      padding: "8px 12px",
      borderRadius: "16px",
      maxWidth: "80%"
    });
    chatBox.appendChild(bubble);
  });

  // 입력창 영역
  const inputArea = document.createElement("div");
  Object.assign(inputArea.style, {
    display: "flex",
    gap: "0.5rem"
  });

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "메시지 입력...";
  Object.assign(input.style, {
    flexGrow: "1",
    padding: "8px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontFamily: "Galmuri11"
  });

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "전송";
  Object.assign(sendBtn.style, {
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: "#fa8ee5",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontFamily: "Galmuri11"
  });

  sendBtn.onclick = () => {
    if (input.value.trim() === "") return;

    // 플레이어 채팅
    const playerBubble = document.createElement("div");
    playerBubble.textContent = input.value;
    Object.assign(playerBubble.style, {
      alignSelf: "flex-end",
      background: "#d0f0ff",
      padding: "8px 12px",
      borderRadius: "16px",
      maxWidth: "80%"
    });
    chatBox.appendChild(playerBubble);
    input.value = "";

    // 여자친구 답변
    setTimeout(() => {
      const reply = document.createElement("div");
      reply.textContent = "진짜 질린다. 헤어져.";
      Object.assign(reply.style, {
        alignSelf: "flex-start",
        background: "#f0f0f0",
        padding: "8px 12px",
        borderRadius: "16px",
        maxWidth: "80%"
      });
      chatBox.appendChild(reply);
    }, 800);

    setTimeout(() => {
      const blocked = document.createElement("div");
      blocked.textContent = "차단당했습니다.";
      Object.assign(blocked.style, {
        alignSelf: "center",
        color: "red",
        fontWeight: "bold",
        marginTop: "1rem"
      });
      chatBox.appendChild(blocked);
      confirmBtn.style.display = "block";
    }, 1800);
  };

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);

  // 조립
  phoneBox.appendChild(header);
  phoneBox.appendChild(chatBox);
  phoneBox.appendChild(inputArea);
  gameArea.appendChild(phoneBox);

  // 확인 버튼 스타일
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none"
  });
}


// Mission 4 미니게임 =================================================================
function MiniGame4(modal) {
  const body = modal.querySelector(".modal-body");
  const gameArea = body.querySelector(".mini-game-area");
  gameArea.innerHTML = ""; // 기존 내용 제거

  // 설명 텍스트
  /*   const desc = document.createElement("p");
    desc.textContent = missionData[3].message;
    Object.assign(desc.style, {
      whiteSpace: "pre-line",
      fontFamily: "Galmuri11",
      fontSize: "1rem",
      marginBottom: "1rem",
      textAlign: "center",
    });
    gameArea.appendChild(desc); */

  // 과목 블록 정보
  const subjects = [{
      name: "화학",
      color: "#f28b82"
    },
    {
      name: "미적분",
      color: "#facc88"
    },
    {
      name: "생명",
      color: "#efff90"
    },
    {
      name: "국어",
      color: "#ccff90"
    },
    {
      name: "영어",
      color: "#aecbfa"
    },
    {
      name: "취침",
      color: "#d7aefb"
    },
  ];

  // 드래그 가능한 블록 컨테이너
  const blockContainer = document.createElement("div");
  Object.assign(blockContainer.style, {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "1rem",
  });

  subjects.forEach((subject) => {
    const block = document.createElement("div");
    block.className = "draggable-block";
    block.textContent = subject.name;
    block.setAttribute("draggable", "true");
    block.dataset.subject = subject.name;
    block.dataset.color = subject.color;
    Object.assign(block.style, {
      backgroundColor: subject.color,
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "grab",
      fontFamily: "Galmuri11",
      fontSize: "0.9rem",
      border: "1px solid #aaa",
      userSelect: "none",
    });
    blockContainer.appendChild(block);
  });

  gameArea.appendChild(blockContainer);

  // 시간대
  const timeLabels = [
    "00:00 ~ 04:00",
    "04:00 ~ 08:00",
    "08:00 ~ 12:00",
    "12:00 ~ 16:00",
    "16:00 ~ 20:00",
    "20:00 ~ 00:00",
  ];

  // 시간표 그리드
  const timetable = document.createElement("div");
  Object.assign(timetable.style, {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gridTemplateRows: "repeat(2, 100px)",
    gap: "10px",
    justifyContent: "center",
  });

  const slots = [];

  timeLabels.forEach((label, i) => {
    const slot = document.createElement("div");
    slot.className = "timetable-slot";
    Object.assign(slot.style, {
      width: "100px",
      height: "100px",
      border: "2px dashed #aaa",
      backgroundColor: "#fff",
      fontFamily: "Galmuri11",
      fontSize: "0.75rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      overflow: "hidden",
    });

    const timeText = document.createElement("div");
    timeText.textContent = label;
    Object.assign(timeText.style, {
      fontWeight: "bold",
      marginBottom: "4px",
    });

    const content = document.createElement("div");
    content.className = "slot-content";
    content.textContent = "";
    Object.assign(content.style, {
      fontSize: "0.9rem",
      color: "#333",
    });

    slot.appendChild(timeText);
    slot.appendChild(content);

    // 드롭 이벤트
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.style.borderColor = "#666";
    });

    slot.addEventListener("dragleave", () => {
      slot.style.borderColor = "#aaa";
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.style.borderColor = "#aaa";

      const subjectName = e.dataTransfer.getData("subject");
      const color = e.dataTransfer.getData("color");

      // 기존에 이 블록을 배치한 슬롯 있으면 제거
      slots.forEach((s) => {
        if (s.dataset.subject === subjectName) {
          s.querySelector(".slot-content").textContent = "";
          s.dataset.subject = "";
          s.style.backgroundColor = "#fff";
        }
      });

      // 새로 배치
      content.textContent = subjectName;
      slot.style.backgroundColor = color;
      slot.dataset.subject = subjectName;

      // 확인 버튼 조건 확인
      const filled = slots.every((s) => s.querySelector(".slot-content").textContent.trim() !== "");
      if (filled) confirmBtn.style.display = "block";
    });

    slots.push(slot);
    timetable.appendChild(slot);
  });

  gameArea.appendChild(timetable);

  // 드래그 시작 설정
  const blocks = blockContainer.querySelectorAll(".draggable-block");
  blocks.forEach((block) => {
    block.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("subject", block.dataset.subject);
      e.dataTransfer.setData("color", block.dataset.color);
    });
  });

  // 확인 버튼 고정
  const confirmBtn = modal.querySelector(".confirm-btn");
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none",
  });
}


// Mission 5 미니게임 =================================================================
function MiniGame5(modal) {
  const body = modal.querySelector(".modal-body");
  const miniGameArea = body.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 초기화
  miniGameArea.innerHTML = "";

  // pill 클릭 시 생성되는 텍스트 (맨 위로)
  const finalMsg = document.createElement("div");
  finalMsg.textContent = "";
  Object.assign(finalMsg.style, {
    color: "red",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Galmuri11",
    marginBottom: "1rem",
  });
  miniGameArea.appendChild(finalMsg);

  // 중심 pill 이미지
  const pillImg = document.createElement("img");
  pillImg.src = "assets/5-pill.png";
  pillImg.alt = "pill";
  Object.assign(pillImg.style, {
    width: "60px",
    height: "60px",
    cursor: "pointer",
    display: "block",
    margin: "20px auto",
    zIndex: 10,
    position: "relative",
  });
  miniGameArea.appendChild(pillImg);

  let clickCount = 0;

  pillImg.addEventListener("click", () => {
    clickCount++;

    const newPill = document.createElement("img");
    newPill.src = "assets/5-pill.png";
    newPill.alt = "pill";

    const angle = Math.floor(Math.random() * 360);
    const top = Math.random() * 40 + 30; // 30~70%
    const left = Math.random() * 60 + 10;

    Object.assign(newPill.style, {
      position: "absolute",
      top: `${top}%`,
      left: `${left}%`,
      width: "50px",
      height: "50px",
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      zIndex: 2,
      pointerEvents: "none",
    });

    miniGameArea.appendChild(newPill);

    if (clickCount === 20) {
      finalMsg.textContent = "잠은 죽어서 자라";
      confirmBtn.style.display = "block";
    }
  });

  // 확인 버튼 우측 하단 고정 스타일
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none",
  });
}

// Mission 6 미니게임 =================================================================
function MiniGame6(modal) {
  const body = modal.querySelector(".modal-body");
  const miniGameArea = body.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 서랍
  const drawerGrid = document.createElement("div");
  Object.assign(drawerGrid.style, {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    justifyItems: "center",
    margin: "1rem auto",
    maxWidth: "300px",
  });

  // 담배가 숨겨진 위치 (0~8)
  const secretIndex = Math.floor(Math.random() * 9);
  let found = false;

  for (let i = 0; i < 9; i++) {
    const drawer = document.createElement("div");
    Object.assign(drawer.style, {
      width: "80px",
      height: "80px",
      backgroundColor: "#eee",
      border: "2px solid #555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Galmuri11",
      fontSize: "0.85rem",
      cursor: "pointer",
      position: "relative"
    });

    drawer.textContent = "서랍";

    drawer.onclick = () => {
      if (found) return;

      if (i === secretIndex) {
        found = true;
        drawer.innerHTML = `<img src="assets/6-cigar.png" alt="담배" style="width: 40px;">`;

        const warning = document.createElement("div");
        warning.textContent = "이번 방학 외출 금지다.";
        Object.assign(warning.style, {
          color: "red",
          fontWeight: "bold",
          fontSize: "1.2rem",
          fontFamily: "Galmuri11",
          textAlign: "center",
          marginTop: "1rem"
        });
        miniGameArea.appendChild(warning);

        confirmBtn.style.display = "block";
      } else {
        drawer.textContent = "비었음";
        drawer.style.backgroundColor = "#ccc";
        drawer.style.cursor = "default";
      }
    };

    drawerGrid.appendChild(drawer);
  }

  miniGameArea.appendChild(drawerGrid);

  // 확인 버튼 우측 하단 고정 스타일
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none",
  });
}

// Mission 7 미니게임 =================================================================
function MiniGame7(modal) {
  const body = modal.querySelector(".modal-body");
  const miniGameArea = body.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 초기화
  miniGameArea.innerHTML = "";

  // 스크롤 가능한 긴 텍스트 영역
  const scrollBox = document.createElement("div");
  Object.assign(scrollBox.style, {
    height: "200px",
    overflowY: "scroll",
    border: "1px solid red",
    padding: "1rem",
    marginBottom: "1.6rem",
    fontFamily: "Galmuri11",
    fontSize: "1.6rem",
    color: "red",
    backgroundColor: "#fff5f5"
  });
  scrollBox.textContent = `
이 약은 복용 후 졸림, 감정 둔화, 무기력, 방향감각 상실을 유발할 수 있습니다.
이 약을 복용한 이후 발생한 어떠한 행동에도 책임지지 않습니다.
의심하지 마십시오. 당신은 이미 선택했습니다.
벽이 속삭였어요. 벽이. 틀림없이. 벽 안쪽에서 바늘이 움직였고, 그 바늘은 제 이름을 꿰매고 있었습니다다. 바늘 바늘 바늘 바늘이 말하길, ‘공부해.’  
창문 뒤에 서 있는 남자는 매일 밤 3시 33분에 고개를 돌립니다. 제 꿈속에서도 정확히 3시 33분이었고, 그 남자는 제 뇌를 들여다보더니 웃었습니다다. 왜 웃었을까요?..  
손끝에서 벌레가 기어나오더니 다시 손바닥으로 들어갔습니다다. 근데 누구도 믿지 않았습니다. 그들은 보지 못해요.

  `.repeat(7); // 텍스트 반복

  miniGameArea.appendChild(scrollBox);

  // 체크박스 세트
  const checklist = [
    "전부 읽었으며 동의합니다.",
    "약을 복용합니다.",
    "공부 시간을 늘립니다."
  ];
  const checkboxWrap = document.createElement("div");
  Object.assign(checkboxWrap.style, {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
    fontFamily: "Galmuri11",
    fontSize: "1rem"
  });

  checklist.forEach(text => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "0.5rem";
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(text));
    checkboxWrap.appendChild(label);
  });

  miniGameArea.appendChild(checkboxWrap);

  // 확인 버튼 숨김 및 체크 확인
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none"
  });

  const checkboxes = checkboxWrap.querySelectorAll("input[type='checkbox']");
  checkboxWrap.addEventListener("change", () => {
    const allChecked = [...checkboxes].every(c => c.checked);
    confirmBtn.style.display = allChecked ? "block" : "none";
  });
}

// Mission 8 미니게임 =================================================================
function MiniGame8(modal) {
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 캠 컨테이너 가져오기
  const camContainer = document.querySelector(".cam-container");
  camContainer.style.position = "relative";

  // 안내 텍스트 삽입
  const hint = document.createElement("div");
  hint.textContent = "캠에 보이는 주인공을 10회 가격하세요";
  Object.assign(hint.style, {
    color: "red",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "1rem",
    fontFamily: "Galmuri11"
  });

  // 모달 하단 영역에 텍스트 추가
  const miniGameArea = modal.querySelector(".mini-game-area");
  miniGameArea.appendChild(hint);

  let hitCount = 0;

  // 클릭 이벤트 연결
  function onCamClick(e) {
    hitCount++;

    const handImg = document.createElement("img");
    handImg.src = "https://png.pngtree.com/png-clipart/20250111/original/pngtree-crimson-handprint-soaked-in-blood-leaving-a-dark-stain-png-image_19087318.png";
    handImg.alt = "피손바닥";

    const rect = camContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    Object.assign(handImg.style, {
      position: "absolute",
      top: `${y - 30}px`,
      left: `${x - 30}px`,
      width: "200px",
      height: "200px",
      transform: `rotate(${Math.random() * 360}deg)`,
      zIndex: 9999,
      pointerEvents: "none",
    });

    camContainer.appendChild(handImg);

    if (hitCount === 10) {
      confirmBtn.style.display = "block";
      camContainer.removeEventListener("click", onCamClick);
    }
  }

  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "none",
  });

  camContainer.addEventListener("click", onCamClick);
}

// Mission 9 미니게임 =================================================================
function MiniGame9(modal) {
  const miniGameArea = modal.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 초기화
  miniGameArea.innerHTML = "";
  miniGameArea.style.backgroundColor = "black";
  miniGameArea.style.position = "relative";
  miniGameArea.style.overflow = "hidden";


  const desc = document.createElement("p");
  desc.textContent = "그는 이미 당신의 말을 잘 듣습니다.";
  Object.assign(desc.style, {
    color: "#fff",
    fontFamily: "Galmuri11",
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "1rem"
  });
  miniGameArea.appendChild(desc);

  // 확인 버튼 표시
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "block",
  });
}


// Mission 10 미니게임 =================================================================
function MiniGame10(modal) {
  const miniGameArea = modal.querySelector(".mini-game-area");
  const confirmBtn = modal.querySelector(".confirm-btn");

  // 초기화
  miniGameArea.innerHTML = "";
  miniGameArea.style.backgroundColor = "black";
  miniGameArea.style.position = "relative";
  miniGameArea.style.overflow = "hidden";

  // 점 생성
  for (let i = 0; i < 200; i++) {
    const dot = document.createElement("div");
    dot.textContent = ".";
    Object.assign(dot.style, {
      position: "absolute",
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: "red",
      fontSize: `${Math.random() * 2 + 1}rem`,
      fontFamily: "monospace",
      opacity: Math.random(),
      pointerEvents: "none",
    });
    miniGameArea.appendChild(dot);
  }

  // 확인 버튼 표시
  Object.assign(confirmBtn.style, {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
    display: "block",
  });
}



function makeDraggable(el) {
  const header = el.querySelector(".modal-header") || el.querySelector(".program-header");
  if (!header) return;

  header.onmousedown = function (e) {
    e.preventDefault();
    let offsetX = e.clientX - el.getBoundingClientRect().left;
    let offsetY = e.clientY - el.getBoundingClientRect().top;

    function onMouseMove(e) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
      el.style.position = "fixed";
      el.style.margin = "0";
      el.style.transform = "none";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMouseMove);
    }, {
      once: true
    });
  };
}

function addDiaryNote(id) {
  const diary = document.getElementById("diary-container");
  const note = document.createElement("div");
  note.className = "memo-note";
  note.innerHTML = `
    <strong>${id}月</strong><br>
    ${userName}의 일기 ${id}<br>
    <small style="opacity: 0.7; white-space: pre-line;">${tooltipMessages[id] || "..."}</small>
  `;
  diary.appendChild(note);
  note.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

function initTooltip() {
  const characterDisplay = document.getElementById("character-display");
  const tooltip = document.createElement("div");
  tooltip.id = "cam-tooltip";
  tooltip.style.cssText = `position: fixed; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.9rem; pointer-events: none; z-index: 99999; display: none; white-space: nowrap;`;
  document.body.appendChild(tooltip);

  characterDisplay.addEventListener("mouseenter", () => tooltip.style.display = "block");
  characterDisplay.addEventListener("mouseleave", () => tooltip.style.display = "none");
  characterDisplay.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
    let message = tooltipMessages[currentMission] || "안녕!ㅎㅎ";

    // 배열로 옮김. 여기는 삭제
    /*     if (currentMission === 2) message = "사실 난 의대에 가고 싶지는 않은데...";
        else if (currentMission === 3) message = "여자친구..";
        else if (currentMission === 4) message = "지금 시간표는 나한테는 너무 빡빡한 것 같아..";
        else if (currentMission === 5) message = "어떻게든 공부 시간을 늘리려다 보니 잠도 못 자고 힘들어.. 더 집중이 안 되는 것 같아.";
        else if (currentMission === 6) message = "한 번만 봐줘...";
        else if (currentMission === 7) message = "힘들어";
        else if (currentMission >= 8) message = "...";
        else if (stress > 50) message = "너무 힘들어..."; */
    tooltip.textContent = message;
  });
}

function updateStatus() {
  const el = document.getElementById("stress");
  el.textContent = `스트레스: ${stress}`;
  if (stress >= 30) document.body.classList.add("darkening");
  // if (stress >= 50) document.querySelector(".all-container").style.filter = `hue-rotate(${stress}deg) saturate(150%)`;
}

function showTypingMessage(text) {
  const messageBox = document.getElementById("mission-message");
  messageBox.textContent = "";
  messageBox.style.display = "block";
  let i = 0;
  const interval = setInterval(() => {
    messageBox.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => messageBox.style.display = "none", 3000);
    }
  }, 50);
}

function updateCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement("div");
    cell.textContent = `${i + 1}월`;
    if (missionStates[i]) {
      cell.classList.add("complete");
      cell.textContent += " ✓";
    }
    grid.appendChild(cell);
  }
}

document.getElementById("start-btn").onclick = () => {
  const menu = document.getElementById("start-menu");
  menu.classList.toggle("open");
};

document.getElementById("calendar").onclick = () => {
  const modal = document.getElementById("calendar-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
};

document.getElementById("close-calendar").onclick = () => {
  document.getElementById("calendar-modal").style.display = "none";
};
function triggerFinalPhase() {
  // 1. 기존 UI 제거
  document.querySelector(".all-container").style.display = "none";
  document.getElementById("mission-message").style.display = "none";
  document.getElementById("calendar-modal").style.display = "none";

  // 2. 붉은 배경 + 캠 OFF
  document.body.style.backgroundColor = "#2b0000";
  const cam = document.querySelector(".cam-container");
  cam.classList.add("dark-mode");
  cam.innerHTML = `<div id="dark-cam">[CAM OFFLINE]</div>`;

  // 3. 수능 당일 텍스트 출력
  const finalMsg = document.createElement("div");
  finalMsg.id = "final-msg";
  finalMsg.innerText = "11月 · 수능 당일";
  Object.assign(finalMsg.style, {
    position: "fixed",
    top: "40%",
    width: "100%",
    textAlign: "center",
    fontSize: "2rem",
    color: "white",
    zIndex: 9999,
    fontFamily: "Galmuri11",
    whiteSpace: "pre-line"
  });
  document.body.appendChild(finalMsg);

  // 4. 이후 메시지 변경
  setTimeout(() => {
    finalMsg.innerText = `수능 당일 이후,\n${userName}은(는) 귀가하지 않았습니다.\n당신이 바라보는 CCTV 캠 속에는 텅 빈 방 안만이 보입니다.`;
    finalMsg.style.fontSize = "1.5rem";
    finalMsg.style.color = "red";
  }, 4000);

  // 5. CCTV 화면 출력
  setTimeout(() => {
    finalMsg.remove(); // 이전 텍스트 제거

    const cctvWall = document.createElement("div");
    Object.assign(cctvWall.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "black",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)",
      gap: "2px",
      zIndex: 9999,
    });

    // 12개의 캠 화면
    for (let i = 0; i < 12; i++) {
      const screen = document.createElement("div");
      Object.assign(screen.style, {
        backgroundColor: "#111",
        border: "1px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "0.9rem",
        fontFamily: "monospace"
      });
      screen.textContent = "[EMPTY ROOM]";
      cctvWall.appendChild(screen);
    }

    document.body.appendChild(cctvWall);

    // 6. "다 너를 위한 거였는데..."
    setTimeout(() => {
      const finalSpeech = document.createElement("div");
      finalSpeech.textContent = "다 너를 위한 거였는데...";
      Object.assign(finalSpeech.style, {
        position: "fixed",
        bottom: "5%",
        width: "100%",
        textAlign: "center",
        fontSize: "1.8rem",
        color: "white",
        fontFamily: "Galmuri11",
        zIndex: 10000,
        animation: "fadeIn 2s ease"
      });
      document.body.appendChild(finalSpeech);

      // 7. 3초 후 main.html 이동
      setTimeout(() => {
        window.location.href = "main.html";
      }, 3000);

    }, 3000); // 메시지 등장까지 대기

  }, 3000); // CCTV 화면 전환 시점
}
