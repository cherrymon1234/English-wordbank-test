// file 제목 및 내용 불러오기
import { state } from "./state.js";
import { getIndexedDB } from "./state.js";
const submitBtn = document.getElementById("wordsbank-upload");
const wordsbankSelect = document.getElementById("wordsbank-select");
export const selectPage = document.getElementById("main-page");
export const examPage = document.getElementById("exam-page");
export const examFinishPage = document.getElementById("exam-result-page");

// 선택한 파일 데이터 꺼내기
function uploadFile() {
    const file = document.getElementById("wordsbank-input").files[0];
    if (!file) {
        alert("파일을 선택해주세요.");
        return null;
    }
    const title = file.name;

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const lines = reader.result.split(/\r?\n/);
            const words = [];

            lines.forEach(line => {

                const data = line.split(",");

                if (data.length >= 2) {
                    words.push({
                        eng: data[0],
                        kor: data[1]
                    });
                }

            });

            resolve({
                title: title,
                words: words
            });
        };

        reader.onerror = () => {
            reject("파일 읽기 실패");
        };

        reader.readAsText(file);
    });
}

// 리스트 불러오기
function loadWordsbanks(){
    return new Promise(async(resolve, reject) => {
        const db = await getIndexedDB();
        const transaction = db.transaction("wordsbank","readonly");
        const store = transaction.objectStore("wordsbank");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
        }

        getAllRequest.onerror = () => {
            reject("리스트 불러오기 실패");
        }
    });
}

// 현재 리스트 내역을 option과 동기화하기
async function synchronizationOptions() {
    // DB, opt 조회
    const DB = await loadWordsbanks();
    const wordsbanks = [];
    const wordsbankOptions = [];

    Array.from(wordsbankSelect.children).forEach(option => {
        if (option.id != "default-option") {
            wordsbankOptions.push(option.value);
        };
    });

    DB.forEach(wordsbank => {
        wordsbanks.push(wordsbank.title);
    })

    // DB -> opt 여부 확인 및 opt 추가
    wordsbanks.forEach(wordsbank => {
        if (!wordsbankOptions.includes(wordsbank)){
            const option = document.createElement("option");

            option.id = wordsbank
            option.value = wordsbank
            option.textContent = wordsbank

            wordsbankSelect.appendChild(option);
        };
    });

    // opt -> DB 여부 확인 및 opt 제거
    wordsbankOptions.forEach(option => {
        if (!wordsbanks.includes(option)) {
            document.getElementById(option).remove();
        };
    });
}

// 페이지 로딩시 함수 실행
document.addEventListener("DOMContentLoaded", async () => {
    synchronizationOptions();
    selectPage.classList.add("show");
})

// 클릭감지 및 함수 실행
submitBtn.addEventListener("click", async () => {
    const db = await getIndexedDB();
    if (db === null) {
        alert("데이터베이스를 준비중입니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    const fileData = await uploadFile();
    if (fileData === null) {
        return;
    }

    // indexedDB에 title과 words를 저장
    const {title, words} = fileData;

    // 중복 여부 확인
    const DB = await loadWordsbanks();
    const wordsbanks = [];

    DB.forEach(wordsbank => {
        wordsbanks.push(wordsbank.title);
    });

    if (wordsbanks.includes(title)) {
        alert("이미 추가된 파일입니다.");
        return;
    };

    const transaction = db.transaction("wordsbank","readwrite");
    const store = transaction.objectStore("wordsbank");

    const addRequest = store.add({
        title:title,
        words:words
    });

    addRequest.onsuccess = () =>{
        synchronizationOptions();
        console.log("File Save Success")
    }
});