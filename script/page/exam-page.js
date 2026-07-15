// 변수 선언
import { state } from "../state.js";
import { changePage } from "../page.js";
import { selectPage } from "./select-page.js";
import { examFinish } from "./exam-result-page.js";
const question = document.getElementById("question-text");
const questionCount = document.getElementById("question-count-text");
const answerOptions = document.querySelectorAll(".answer-option");
const prograssBar = document.getElementById("progress-bar");
const optionDefaultColor = "#27ae60";
export const examPage = document.getElementById("exam-page");

// 시험 요소 설정
function setExamQuestions() {
    const examIndex = state.exam.examIndex;
    question.innerText = state.exam.questions[examIndex].question;
    questionCount.innerText = `${examIndex+1}/${state.exam.questionCount}`

    for (let i = 0; i < answerOptions.length; i++) {
        answerOptions[i].value = state.exam.questions[examIndex].option[i]
        answerOptions[i].innerText = state.exam.questions[examIndex].option[i]
        answerOptions[i].style.background = optionDefaultColor;
    }
}

// 진행도바 업데이트
function updatePrograssBar(current, total) {
    const percent = (current / total ) * 100;
    prograssBar.style.width = percent + "%";
}

// 정답 여부 스타일 변경 및 점수 계산
function isSelectedCurrentAnswer(choosnOption) {
    const examIndex = state.exam.examIndex;
    const currentAnswer = Array.from(answerOptions).find(option => option.value === state.exam.questions[examIndex].answer);

    if (!currentAnswer) {
        choosnOption.style.background = "rgb(239, 83, 80)";
        return false;
    }

    if (choosnOption === currentAnswer) {
        currentAnswer.style.background = "#32754e";
        state.exam.score++;
        return true;
    }
    else {
        currentAnswer.style.background = "#32754e";
        choosnOption.style.background = "rgb(239, 83, 80)";
        return false;
    }
}

// examData 저장
function saveExamData(selectedOption, iscorrect) {
    const index = state.exam.examIndex;
    const data = {
        question: state.exam.questions[index].question,
        answer: state.exam.questions[index].answer,
        option: state.exam.questions[index].option,
        selected: selectedOption.value,
        correct: iscorrect
    };
    state.exam.examData.push(data);
    return data;
}

// option 버튼별 클릭 감지 및 함수 실행
answerOptions.forEach(option => {
    option.addEventListener("click", () => {
        const isCorrect = isSelectedCurrentAnswer(option);
        saveExamData(option, isCorrect);
        state.exam.examIndex++;

        if (state.exam.examIndex < state.exam.questionCount) {
            updatePrograssBar(state.exam.examIndex, state.exam.questionCount);
            
            setTimeout(function() {
                setExamQuestions();
            }, 500);
        }
        else {
            updatePrograssBar(state.exam.examIndex, state.exam.questionCount);

            setTimeout(function() {
                examFinish();
            }, 500);
            
        }
    })
});

// 화면 변경
export function examStart() {
    changePage(selectPage, examPage);

    setExamQuestions();
    updatePrograssBar(state.exam.examIndex, state.exam.questionCount);
}