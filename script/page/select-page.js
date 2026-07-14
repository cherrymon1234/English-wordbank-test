// 변수 선언
import { state } from "../state.js";
import { getIndexedDB } from "../DB/indexedDB.js";
import { synchronizationOptions } from "../file.js";
import { examStart } from "./exam-page.js";
const startBtn = document.getElementById("start-button");
export const selectPage = document.getElementById("select-page");

// 페이지 로딩시 함수 실행
document.addEventListener("DOMContentLoaded",() => {
    synchronizationOptions();
    selectPage.classList.add("show");
})

// 배열 섞기
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// value값에 맞는 DB 추출
export function getMatchDB(title) {
    return new Promise(async(resolve, reject) => {
        const db = await getIndexedDB();
        const transaction = db.transaction("wordsbank","readonly");
        const store = transaction.objectStore("wordsbank");
        const getMatchRequest = store.get(title);

        getMatchRequest.onsuccess = (event) => {
            resolve(event.target.result);
        }

        getMatchRequest.onerror = () => {
            reject("리스트 불러오기 실패");
        }
    });
}

// 문제, 정답 생성
function createQuestion(wordsbank, mode) {
    let queLeng = null;
    let ansLeng = null;
    const lengList = ["kor", "eng"];

    if (mode === "kor-to-eng") {
        queLeng = lengList[0];
        ansLeng = lengList[1];
    }
    else if (mode === "eng-to-kor") {
        queLeng = lengList[1];
        ansLeng = lengList[0];
    }
    else if (mode === "random") {
        if (Math.random() < 0.5) {
            queLeng = lengList[0];
            ansLeng = lengList[1];
        }
        else {
            queLeng = lengList[1];
            ansLeng = lengList[0];
        }
    }

    const DB = wordsbank.words;
    const index = Math.floor(Math.random() * DB.length);
    const question = DB[index][queLeng];
    const answer = DB[index][ansLeng];

    return {
        question: question,
        answer: answer,
        queLeng: queLeng,
        ansLeng: ansLeng
    };
}

// 선택 선지 생성
function createAnswerOptions(wordsbank, leng, answer) {
    // 언어를 받아와서 DB리스트에서 랜덤으로 4개 추출
    const DB = wordsbank.words;
    const answerOptions = [];

    for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * DB.length);
        answerOptions.push(DB[index][leng]);
    }

    answerOptions.push(answer);

    shuffle(answerOptions);

    return answerOptions;
}

//시험 생성
export function createExam(wordsbank, mode, questionCount) {
    const Exam = [];

    for (let index = 0; index < questionCount; index++) {
        const questions = createQuestion(wordsbank, mode);
        const option = createAnswerOptions(wordsbank, questions.ansLeng, questions.answer);

        Exam.push({
            question: questions.question,
            answer: questions.answer,
            option: option
        })
    }

    return Exam;
}

// 버튼 클릭 감지 시 함수 실행
startBtn.addEventListener("click", async () => {
    //이름
    const name = document.getElementById("nickname-input").value;
    if (name === "") {
        alert("이름을 입력해주세요");
        return;
    }

    // 파일선택
    const choosnWordsbank = document.getElementById("wordsbank-select").value; // eng-words.txt
    if (choosnWordsbank === "default-option") {
        alert("파일을 선택해주세요");
        return;
    }

    const wordsbank = await getMatchDB(choosnWordsbank);

    // 모드 선택
    const mode = document.getElementById("mode-select").value;
    if (mode === "default-option") {
        alert("모드를 선택해주세요");
        return;
    }

    // 문제 수 선택
    let questionCount = document.getElementById("questions-number-select").value;
    if (questionCount === "default-option") {
        alert("총 문제 수를 선택해주세요");
        return;
    }
    else if (questionCount === "all") {
        questionCount = wordsbank.words.length;
    }
    else {
        questionCount = parseInt(questionCount);
    }
    
    // 최종 출력
    state.exam.questions = createExam(wordsbank, mode, questionCount);
    state.exam.questionCount = questionCount;
    state.exam.mode = mode;
    state.user.name = name;
    state.user.choosnWordsbank = choosnWordsbank;

    examStart();
})