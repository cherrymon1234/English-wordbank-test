// 전역변수 생성
export const state = {
    indexedDB: null,
    firestoreDB: null,
    user: {
        name: "",
        choosnWordsbank: ""
    },
    exam: {
        examIndex: 0,
        score: 0,
        mode: "",
        questions: [],
        questionCount:0
    }
}