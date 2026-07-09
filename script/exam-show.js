// 변수 선언
import { state } from "./state.js";
import { examFinish} from "./exam-finish.js";
const selectPage = document.getElementById("select-page");
const examPage = document.getElementById("exam-page");
const question = document.getElementById("question-text");
const questionCount = document.getElementById("question-count-text");
const answerOptions = document.querySelectorAll(".answer-option");
const optionDefaultColor = ""; // 임시
 

// 시험 요소 설정
function setExamQuestions() {
    const examIndex = state.exam.examIndex;
    question.innerText = state.exam.questions[examIndex].question;
    questionCount.innerText = `${examIndex+1}/${state.exam.questionCount}`

    for (let i = 0; i < answerOptions.length; i++) {
        answerOptions[i].value = state.exam.questions[examIndex].option[i]
        answerOptions[i].innerText = state.exam.questions[examIndex].option[i]
        answerOptions[i].style.color = optionDefaultColor; // 임시
    }
}

// 정답 여부 스타일 변경 및 점수 계산
export function isSelectedCurrentAnswer(choosnOption) {
    const examIndex = state.exam.examIndex;
    let currentAnswer = null;

    answerOptions.forEach(option => {
        if (option.value === state.exam.questions[examIndex].answer) {
            currentAnswer = option;
        }
    })

    if (choosnOption === currentAnswer) {
        currentAnswer.style.color = "green";
        state.exam.score++;
    }
    else {
        currentAnswer.style.color = "green";
        choosnOption.style.color = "red";
    }
}

// option 버튼별 클릭 감지 및 함수 실행
answerOptions.forEach(option => {
    option.addEventListener("click", () => {
        isSelectedCurrentAnswer(option);
        state.exam.examIndex++;

        if (state.exam.examIndex < state.exam.questionCount) {
            setTimeout(function() {
                setExamQuestions();
            }, 500);
        }
        else {
            setTimeout(function() {
                examFinish();
            }, 500);
            
        }
    })
});

// 화면 변경
export function examStart() {
    selectPage.style.display = "none";
    examPage.style.display = "block";

    setExamQuestions();
}