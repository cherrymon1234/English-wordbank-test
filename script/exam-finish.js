// 변수, 모듈 선언
import { firestoreDB } from "./firebaseDB.js";
import { collection, query, where, getDocs, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { state } from "./state.js";
import { examPage, examFinishPage } from "./file.js";

const examFinishSelectedFile = document.getElementById("selected-file");
const examFinishSelectedMode = document.getElementById("selected-mode");
const examFinishScore = document.getElementById("exam-score");

// Doc저장
async function addDoc(id, result) {
    await setDoc(doc(firestoreDB, "ResultData", id), result);
    console.log("Result Save Success")
}

// 외부 데이터베이스 결과 저장
async function saveResult(result) {  
    const name = result.name;
    const wordsbank = result.wordsbank;
    const questionCount = result.questionCount;
    const id = `${name}_${wordsbank}_${questionCount}`;
    const q = query(
        collection(firestoreDB, "ResultData"),
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
    examPage.classList.remove("show");
    examFinishPage.classList.add("show");

    examFinishSelectedFile.innerText = state.user.choosnWordsbank;
    examFinishSelectedMode.innerText = state.exam.mode;
    examFinishScore.innerText = `${state.exam.score}/${state.exam.questionCount}`;

    const result = {
        name: state.user.name,
        wordsbank: state.user.choosnWordsbank,
        mode: state.exam.mode,
        score: state.exam.score,
        questionCount: state.exam.questionCount,
        accuracy: (state.exam.score / state.exam.questionCount) * 100,
        saveTime: new Date().getTime()
    }

    saveResult(result);
}