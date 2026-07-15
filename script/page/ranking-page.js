// 결과페이지에서 넘어오는경우 현재 state의 선택된 파일, 문제 수를 이미 선택된상태로 넘어오도록
// 페이지가 전환될때, 선택옵션이 바뀌는 경우를 갑지하여 밑에 보여줄 데이터를 바꿈
// 현재 선택된 파일과 문제 수가 일치하는 모든데이터를 firestoreDB에서 찾아서 ranking-item의 형태로 html에 추가

// 변수선언
import { state } from "../state.js";
import { collection, where, query, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { loadWordsbanks } from "../file.js";
import { returnToMain } from "./exam-result-page.js";
export const rankingPage = document.getElementById("ranking-page");
const selectedFile = document.getElementById("ranking-selected-file");
const questionCount = document.getElementById("ranking-questionCount");
const selectPageQuestionCount = document.getElementById("questions-number-select");
const rankingList = document.getElementById("ranking-list");
const returnButton = document.getElementById("ranking-return-button");

// 파일 선택 옵션 동기화
async function synchronizationFileOptions() {
    const indexedDB = await loadWordsbanks();
    const wordsbanks = [];

    indexedDB.forEach(wordsbank => {
        wordsbanks.push(wordsbank.title);
    })

    wordsbanks.forEach(wordsbank => {
        const option = document.createElement("option");

        option.id = wordsbank
        option.value = wordsbank
        option.textContent = wordsbank

        selectedFile.appendChild(option);
    })
}

// 문제 수 선택 옵션 동기화
function synchronizationQuestionCountOptions() {
    const selectPageQuestionCountList = [];

    Array.from(selectPageQuestionCount.children).forEach(option => {
        if (option.value !== "default-option") {
            selectPageQuestionCountList.push(option.value);
        }
    });

    selectPageQuestionCountList.forEach(questionCountOption => {
        const option = document.createElement("option");

        option.id = questionCountOption;
        option.value = questionCountOption
        option.textContent = questionCountOption;

        questionCount.appendChild(option)
    })
}

// firestoreDB에서 데이터 불러오기 및 적용
export async function loadData() {
    // 기존 html요소 삭제
    const rankingItems = document.querySelectorAll(".ranking-item");
    rankingItems.forEach(item => {
        item.remove();
    })

    // 선택 여부 확인
    if (selectedFile.value === "default-option") {
        const div = document.createElement("div");
        const span = document.createElement("span");

        div.classList.add("ranking-item");
        span.classList.add("empty-data");
        span.textContent = "단어장을 선택해주세요.";

        div.appendChild(span);
        rankingList.appendChild(div);
        return;
    }
    else if (questionCount.value === "default-option") {
        const div = document.createElement("div");
        const span = document.createElement("span");

        div.classList.add("ranking-item");
        span.classList.add("empty-data");
        span.textContent = "총 문제 수를 선택해주세요.";

        div.appendChild(span);
        rankingList.appendChild(div);
        return;
    }

    // 데이터 검색
    let selectedQuestionCount = questionCount.value;

    if (selectedQuestionCount !== "all") {
        selectedQuestionCount = Number(selectedQuestionCount);
    }

    const q = query(
        collection(state.firestoreDB, "ResultData"),
        where("wordsbank", "==", selectedFile.value),
        where("questionCount", "==", selectedQuestionCount)
    );
    const snapshot = await getDocs(q);
    const datas = [];

    // 데이터 저장
    if (snapshot.empty) {
        const div = document.createElement("div");
        const span = document.createElement("span");

        div.classList.add("ranking-item");
        span.classList.add("empty-data");
        span.textContent = "데이터가 없습니다.";

        div.appendChild(span);
        rankingList.appendChild(div);
    }
    else {
        snapshot.docs.forEach(docs => {
            const data = docs.data();
            datas.push(data);
        })

        datas.sort((a, b) => {
            return b.score - a.score;
        });

        datas.forEach((data, index) => {
            const div = document.createElement("div");
            const rankSpan = document.createElement("span");
            const nameSpan = document.createElement("span");
            const scoreSpan = document.createElement("span");
            const accuracySpan = document.createElement("span");
            
            div.classList.add("ranking-item");
            rankSpan.classList.add("rank-number");
            nameSpan.classList.add("user-name");
            scoreSpan.classList.add("user-score");
            accuracySpan.classList.add("user-accuracy");

            rankSpan.textContent = `${(index + 1)}위`;
            nameSpan.textContent = data.name;
            scoreSpan.textContent = `${data.score}점`;
            accuracySpan.textContent = `${data.accuracy}%`;

            div.appendChild(rankSpan);
            div.appendChild(nameSpan);
            div.appendChild(scoreSpan);
            div.appendChild(accuracySpan);
            rankingList.appendChild(div);
        })
    }
}

// 페이지 로딩시 함수 실행
document.addEventListener("DOMContentLoaded", async () => {
    await synchronizationFileOptions();
    await synchronizationQuestionCountOptions();
    await loadData();
})

// 선택 변경시 함수 실행
selectedFile.addEventListener("change", loadData);
questionCount.addEventListener("change", loadData);

// 버튼 클릭 이벤트
returnButton.addEventListener("click", async () => {
    selectedFile.value = "default-option";
    questionCount.value = "default-option";
    await loadData();
    returnToMain(rankingPage);
})