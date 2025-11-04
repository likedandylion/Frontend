import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
`;

export const Container = styled.div`
  max-width: 1000px;
  margin: 60px auto 80px; /* ✅ 위 여백 줄여서 타이틀을 위로 */
  padding: 0 16px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px; /* 조금 더 타이트하게 */
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 76px; /* 살짝 줄여서 전체적으로 올라감 */
`;

export const PlanWrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

export const PlanCard = styled.div`
  position: relative;
  flex: 1 1 280px;
  border: 1.5px solid #000;
  padding: 40px 28px;
  box-sizing: border-box;
  background-color: #fff;
  min-width: 280px;
  transition: 0.25s;

  ${({ $highlight }) =>
    $highlight &&
    `
    border-width: 2.3px; /* ✅ 강조 - 테두리만 살짝 두껍게 */
    font-weight: 700;  /* ✅ 프로 플랜의 텍스트 전체 살짝 강조 */
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 3px 3px 0px #000;
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 2px;
`;

export const PlanHeader = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const Price = styled.p`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;

  span {
    font-size: 14px;
    font-weight: 400;
    color: #555;
  }
`;

export const FeatureList = styled.ul`
  text-align: left;
  margin-bottom: 30px;
  list-style: none;
  padding: 0;
`;

export const Feature = styled.li`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
  color: #111;
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export const Button = styled.button`
  border: 1.5px solid #000;
  background-color: #fff;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

export const HighlightButton = styled(Button)`
  background-color: #000;
  color: #fff;

  &:hover {
    background-color: #111;
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;
