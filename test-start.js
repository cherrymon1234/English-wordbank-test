const startBtn = document.getElementById("start-button");
document.write('<script src="file.js"></script>');

// 만들어야할거 1.유저가 선택한 단어장 불러오기

function createExam(){

}




startBtn.addEventListener("click", async () => {
    const choosnWordsbank = document.getElementById("wordsbank-select").value; // eng-words.txt

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("wordsbank","readonly");
        const store = transaction.objectStore("wordsbank");
        const getAllRequest = store.get(value);

        getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
        }

        getAllRequest.onerror = () => {
            reject("리스트 불러오기 실패");
        }
    });
})