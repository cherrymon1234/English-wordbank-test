// 변수, 모듈 선언
import { collection, query, where, getDocs, addDoc, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { state } from "../state.js";
import { selectPage, createExam, getMatchDB } from "./select-page.js";
import { examPage, examStart } from "./exam-page.js";
import { rankingPage, loadData } from "./ranking-page.js";
import { changePage } from "../page.js";

export const examResultPage = document.getElementById("exam-result-page");
const examFinishSelectedFile = document.getElementById("selected-file");
const examFinishSelectedMode = document.getElementById("selected-mode");
const examFinishScore = document.getElementById("exam-score");
const examFinishIncorrect = document.getElementById("exam-incorrect");
const examFinishAccuracy = document.getElementById("exam-accuracy");
const examFinishQuestionCount = document.getElementById("exam-questionCount");
const examFinishHomeButton = document.getElementById("return-button");
const examFinishReplayButton = document.getElementById("replay-button");
const examFinishRankingButton = document.getElementById("ranking-button");

// Doc저장
async function resultDataAddDoc(id, result) {
    await setDoc(doc(state.firestoreDB, "ResultData", id), result);
    console.log("Result Save Success")
}

// 외부 데이터베이스 최고점수 저장
async function saveHighResult(result) {  
    const name = result.name;
    const wordsbank = result.wordsbank;
    const questionCount = result.questionCount;
    const id = `${name}_${wordsbank}_${questionCount}`;
    const q = query(
        collection(state.firestoreDB, "ResultData"),
        where("name", "==", name),
        where("wordsbank", "==", wordsbank),
        where("questionCount", "==", questionCount)
    );

    // 사전 저장 여부 확인
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        resultDataAddDoc(id, result);
        return;
    }
    else {
        const oldDocData = snapshot.docs[0].data();

        if (result.score > oldDocData.score) {
            resultDataAddDoc(id, result);
            return;
        }
        else {
            return;
        }
    }
}

// 시험별 데이터 저장
async function saveHistoryData(data) {
    await addDoc(
        collection(state.firestoreDB, "HistoryData"),
        data
    );
}

// 시험 마무리 html 관리
export function examFinish() {
    changePage(examPage, examResultPage);

    const accuracyValue = (state.exam.score / state.exam.questionCount) * 100;
    const accuracy = Number(accuracyValue.toFixed(1));

    examFinishSelectedFile.innerText = state.user.choosnWordsbank;
    examFinishSelectedMode.innerText = state.exam.mode;
    examFinishScore.innerText = state.exam.score;
    examFinishIncorrect.innerText = (state.exam.questionCount - state.exam.score);
    examFinishAccuracy.innerText = `${accuracy}%`;
    examFinishQuestionCount.innerText = state.exam.questionCount;

    const historyData = {
        name: state.user.name,
        wordsbank: state.user.choosnWordsbank,
        mode: state.exam.mode,
        score: state.exam.score,
        accuracy: accuracy,
        questionCount: state.exam.questionCount,
        saveTime: new Date().getTime(),
        examData: state.exam.examData
    };

    const highResult = {
        name: state.user.name,
        wordsbank: state.user.choosnWordsbank,
        mode: state.exam.mode,
        score: state.exam.score,
        questionCount: state.exam.questionCount,
        accuracy: accuracy,
        saveTime: new Date().getTime()
    };

    saveHistoryData(historyData);
    saveHighResult(highResult);
}

//선택 페이지로 돌아가기
export function returnToMain(originPage) {
    changePage(originPage, selectPage);
    
    state.exam = {
        examIndex: 0,
        score: 0,
        mode: "",
        questions: [],
        questionCount:0,
        examData: []
    };
    state.user = {
        name: state.user.name,
        choosnWordsbank: ""
    };

    document.getElementById("wordsbank-select").value = "default-option";
    document.getElementById("mode-select").value = "default-option";
    document.getElementById("questions-number-select").value = "default-option";
}

// 돌아가기 버튼
examFinishHomeButton.addEventListener("click", () => {
    returnToMain(examResultPage);
});

// 다시하기 버튼
examFinishReplayButton.addEventListener("click", async () => {
    const wordsbank = await getMatchDB(state.user.choosnWordsbank);

    examResultPage.classList.remove("show");
    state.exam = {
        examIndex: 0,
        score: 0,
        mode: state.exam.mode,
        questions: createExam(wordsbank, state.exam.mode, state.exam.questionCount),
        questionCount:state.exam.questionCount,
        examData: []
    };
    
    examStart();
})

// 랭킹보기 버튼
examFinishRankingButton.addEventListener("click", () => {
    document.getElementById("ranking-selected-file").value = state.user.choosnWordsbank;
    document.getElementById("ranking-questionCount").value = state.exam.questionCount;

    state.exam = {
        examIndex: 0,
        score: 0,
        mode: "",
        questions: [],
        questionCount:0,
        examData: []
    };
    state.user = {
        name: state.user.name,
        choosnWordsbank: ""
    };
    
    loadData()
    changePage(examResultPage, rankingPage);
})