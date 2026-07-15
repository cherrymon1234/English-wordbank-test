// 변수 선언
import { changePage } from "./page.js";
import { selectPage } from "./page/select-page.js";
import { rankingPage } from "./page/ranking-page.js";
const menuButton = document.getElementById("menu-button");
const menuSidebar = document.getElementById("menu-sidebar");
const rankingButton = document.getElementById("view-ranking");

// 사이드바 보이기
function openSidebar(option) {
    const sidebar = option;

    if (sidebar.classList[1] == "show") {
        sidebar.classList.remove("show");
    }
    else {
        sidebar.classList.add("show");
    }
}

// 클릭감지
menuButton.addEventListener("click", () => {
    openSidebar(menuSidebar);
});

rankingButton.addEventListener("click", () => {
    changePage(selectPage, rankingPage);
})