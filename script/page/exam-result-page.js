// 변수, 모듈 선언
import { collection, query, where, getDocs, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { state } from "../state.js";
import { selectPage, createExam, getMatchDB } from "./select-page.js";
import { examPage, examStart } from "./exam-page.js";
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
async function addDoc(id, result) {
    await setDoc(doc(state.firestoreDB, "ResultData", id), result);
    console.log("Result Save Success")
}

// 외부 데이터베이스 결과 저장
async function saveResult(result) {  
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
        addDoc(id, result);
        return;
    }
    else {
        const oldDocData = snapshot.docs[0].data();

        if (result.score > oldDocData.score) {
            addDoc(id, result);
            return;
        }
        else {
            return;
        }
    }
}

// 시험 마무리 html 관리
export function examFinish() {
    changePage(examPage, examResultPage);

    const accuracy = (state.exam.score / state.exam.questionCount) * 100;

    examFinishSelectedFile.innerText = state.user.choosnWordsbank;
    examFinishSelectedMode.innerText = state.exam.mode;
    examFinishScore.innerText = state.exam.score;
    examFinishIncorrect.innerText = (state.exam.questionCount - state.exam.score);
    examFinishAccuracy.innerText = `${accuracy}%`;
    examFinishQuestionCount.innerText = state.exam.questionCount;

    const result = {
        name: state.user.name,
        wordsbank: state.user.choosnWordsbank,
        mode: state.exam.mode,
        score: state.exam.score,
        questionCount: state.exam.questionCount,
        accuracy: accuracy,
        saveTime: new Date().getTime()
    }

    saveResult(result);
}

function returnToMain() {
    changePage(examResultPage, selectPage);
    
    state.exam = {
        examIndex: 0,
        score: 0,
        mode: "",
        questions: [],
        questionCount:0
    };
    state.user = {
        name: state.user.name,
        choosnWordsbank: ""
    };

    document.getElementById("wordsbank-select").value = "default-option";
    document.getElementById("mode-select").value = "default-option";
    document.getElementById("questions-number-select").value = "default-option";
}

examFinishHomeButton.addEventListener("click", returnToMain);

examFinishReplayButton.addEventListener("click", async () => {
    const wordsbank = await getMatchDB(state.user.choosnWordsbank);

    examResultPage.classList.remove("show");
    state.exam = {
        examIndex: 0,
        score: 0,
        mode: state.exam.mode,
        questions: createExam(wordsbank, state.exam.mode, state.exam.questionCount),
        questionCount:state.exam.questionCount
    };
    
    examStart();
})