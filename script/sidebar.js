// 변수 선언
const menuButton = document.getElementById("menu-button");
const userButton = document.getElementById("user-button");
const menuSidebar = document.getElementById("menu-sidebar");
const userSidebar = document.getElementById("user-sidebar");

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

userButton.addEventListener("click", () => {
    openSidebar(userSidebar);
});