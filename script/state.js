// indexedDB 연결
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        // DB open
        const request = indexedDB.open("EnglishTest", 1);

        // DB 업그레이드 필요 여부 조회 및 업그레이드
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            db.createObjectStore("wordsbank", {
                keyPath:"title"
            });
        }

        // 연결 성공
        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        }

        // 연결 실패
        request.onerror = () => {
            reject("DB 연결 실패");
        }
    });
}

// 전역변수 생성
export const state = {
    db: null,
    firebaseDB: null,
    exam: {
        examIndex: 0,
        score: 0,
        mode: "",
        questions: [],
        questionCount:0
    },
    user: {
        name: "",
        choosnWordsbank: ""
    }
}

// db 연결 초기화
export async function getIndexedDB() {
    if (state.db === null) {
        state.db = await openIndexedDB();
    }

    return state.db;
}