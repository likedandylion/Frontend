// src/pages/Home/home.styles.js
import styled from "styled-components";

const c = (t, k, fb) => t?.colors?.[k] ?? fb;
const s = (t, k, fb) => t?.space?.[k] ?? fb;
const f = (t, k, fb) => t?.fontSizes?.[k] ?? fb;

export const Page = styled.div`
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: ${(p) => c(p.theme, "background", "#ffffff")};
`;

export const HeroSection = styled.section`
  /* ===== 가로선-타일 간격 변수 =====
     line-gap: 가로선(위)↔타일, 타일↔하단 보더(아래) 간격을 동일하게 유지
     divider-offset: 버튼 ↔ 가로선(위) 간격 */
  --line-gap: 20px;
  --divider-offset: 200px;

  width: 100%;
  padding: 96px 0 var(--line-gap); /* 하단 패딩을 line-gap으로 → 타일과 하단 보더 간격 동일 */
  min-height: calc(100svh - var(--nav-height, 56px));
  display: flex;
  align-items: flex-start;

  /* 하단 구분선(검정) */
  border-bottom: 1px solid #000000;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const Heading = styled.h1`
  margin: 0 0 ${(p) => s(p.theme, 5, "28px")};
  color: #0b1220;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-size: clamp(36px, 6.5vw, 64px);
  word-break: keep-all;
`;

export const Subtitle = styled.p`
  margin: 0 0 ${(p) => s(p.theme, 8, "40px")};
  color: ${(p) => c(p.theme, "subtle", "#374151")};
  line-height: 1.7;
  font-size: ${(p) => f(p.theme, "md", "17px")};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => s(p.theme, 3, "12px")};
  margin-bottom: 0; /* 간격은 Divider가 책임지도록 0으로 */
`;

export const OutlineButton = styled.button`
  appearance: none;
  background: transparent;
  color: #000000;
  border: 1.5px solid #000000;
  padding: 14px 22px;
  border-radius: 0; /* 네모 */
  font-size: ${(p) => f(p.theme, "md", "16px")};
  font-weight: 700;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, transform 120ms ease;

  &:hover {
    background: #000000;
    color: #ffffff;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
  }
`;

/* 버튼 아래 가로선(검정) */
export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background: #000000;
  border: 0;
  /* 버튼 ↔ 선 간격은 divider-offset, 선 ↔ 타일 간격은 line-gap */
  margin: var(--divider-offset) 0 var(--line-gap);
`;

/* ---- 네모 타일 4열 ---- */
export const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(p) => s(p.theme, 4, "16px")};
  margin: 0; /* 선과의 간격은 Divider가 책임 */
`;

export const Tile = styled.button`
  appearance: none;
  width: 100%;
  min-height: 84px;
  padding: 18px 20px;
  border-radius: 0; /* 모서리 0 */
  border: 1.5px solid #000000; /* 검정 테두리 */
  background: transparent;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, transform 120ms ease;

  &:hover {
    background: #000000;
    color: #ffffff;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
  }
`;

export const TileLabel = styled.span`
  font-size: ${(p) => f(p.theme, "md", "16px")};
  font-weight: 700;
`;

export const TileIcon = styled.svg`
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
`;
