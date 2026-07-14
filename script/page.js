// 페이지 전환 함수
export function changePage(originPage, nextPage) {
    originPage.classList.remove("show");
    nextPage.classList.add("show");
}