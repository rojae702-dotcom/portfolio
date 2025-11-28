// 연도 자동 표시
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const sections = Array.from(document.querySelectorAll("main > section"));
  const navLinks = document.querySelectorAll(
    '.nav-link[href^="#"], .home-cta[href^="#"]'
  );
  const navMenuLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const dotButtons = document.querySelectorAll(".dot-nav .dot");

  if (!main || sections.length === 0) return;

  let currentIndex = 0;

  function getSectionOffset(section) {
    return section.offsetTop - main.offsetTop;
  }

  function scrollToSectionIndex(index) {
    if (index < 0 || index >= sections.length) return;
    const targetSection = sections[index];
    const offsetTop = getSectionOffset(targetSection);

    main.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });

    setActiveIndex(index);
  }

  function setActiveIndex(index) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;

    const activeId = "#" + sections[index].id;

    // 상단 메뉴 active
    navMenuLinks.forEach((link) => {
      if (link.getAttribute("href") === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // 도트 active
    dotButtons.forEach((dot) => {
      if (dot.dataset.target === activeId) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function getClosestSectionIndex(scrollTop) {
    // 뷰포트 중앙 기준으로 가장 가까운 섹션 찾기
    const center = scrollTop + main.clientHeight / 2;
    let closestIndex = 0;
    let minDiff = Infinity;

    sections.forEach((sec, i) => {
      const pos = getSectionOffset(sec);
      const diff = Math.abs(pos - center);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    return closestIndex;
  }

  function handleAnchorClick(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    const index = sections.findIndex((sec) => "#" + sec.id === targetId);
    if (index === -1) return;

    scrollToSectionIndex(index);
  }

  // 네비/홈 CTA 클릭 → 섹션으로 부드럽게 이동
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      if (!targetId.startsWith("#")) return; // 외부 링크는 무시

      e.preventDefault();
      handleAnchorClick(targetId);
    });
  });

  // 도트 클릭 → 섹션 이동
  dotButtons.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.dataset.target;
      if (!targetId) return;
      handleAnchorClick(targetId);
    });
  });

  // 자연 스크롤 시 현재 섹션 감지해서 active만 바꿔주기
  main.addEventListener("scroll", () => {
    const scrollTop = main.scrollTop;
    const idx = getClosestSectionIndex(scrollTop);
    setActiveIndex(idx);
  });

  // 창 크기 변경 시에도 다시 계산
  window.addEventListener("resize", () => {
    const scrollTop = main.scrollTop;
    const idx = getClosestSectionIndex(scrollTop);
    setActiveIndex(idx);
  });

  // 초기 상태
  setActiveIndex(0);
});
