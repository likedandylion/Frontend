import styled from "styled-components";

/* ---------- 기본 ---------- */
export const Page = styled.div`
  width: 100%;
  background: #fff;
`;

/* ---------- Hero Section ---------- */
export const HeroSection = styled.section`
  width: 100%;
  height: 80vh; /* 한 화면 꽉 채움 */
  background: #ffffff;
  text-align: left;
  box-sizing: border-box;
  padding: 140px 96px 0; /* ✅ 위쪽(140px), 좌우(96px) 여백 — Hero를 위쪽 정렬 */
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Heading = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #000;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 40px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
`;

export const OutlineButton = styled.button`
  padding: 14px 28px;
  border: 1.5px solid #000;
  background: #fff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

/* ---------- Category Section ---------- */
export const CategorySection = styled.section`
  padding: 30px 0 30px; /* ✅ Hero 아래 공간 충분히 띄움 */
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  background: #fff;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export const CategoryCard = styled.div`
  border: 2px solid #000;
  padding: 22px 16px;
  font-size: 18px;
  font-weight: 600;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 3px 3px 0 #000;
  }
`;

/* ---------- Prompt Section ---------- */
export const PromptSection = styled.section`
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 96px; /* ✅ Hero와 Category 정렬 맞춤 */
`;

export const PromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* ✅ 세로 정렬 정확히 */
  margin-bottom: 24px;
`;

export const PromptTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Icon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  vertical-align: middle;
`;

export const RegisterButton = styled.button`
  border: 1.5px solid #000;
  background: #fff;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const PromptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
`;

export const PromptCard = styled.div`
  border: 2px solid #000;
  background: #fff;
  transition: 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 4px 0 #000;
  }
`;

export const CardTopBar = styled.div`
  height: 32px;
  background: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
`;

export const CardDots = styled.div`
  display: flex;
  gap: 6px;
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  background: #555;
  border-radius: 50%;
`;

export const CardMeta = styled.span`
  font-size: 12px;
`;

export const CardBody = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  min-height: 150px;
`;

export const PromptTitleText = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const PromptDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
`;

export const PromptActions = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ViewButton = styled.button`
  border: 1.5px solid #000;
  background: #fff;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const MorePromptsButton = styled.button`
  margin: 60px auto 0; /* ✅ 카드들과 시각적 간격 확보 */
  display: block;
  border: 1.5px solid #000;
  background: #fff;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

/* ---------- Pricing Section ---------- */
export const PricingSection = styled.section`
  border-top: 1px solid #000;
  margin-top: 100px;
  padding-top: 80px;
`;

/* ---------- HowTo Section ---------- */
export const HowToSection = styled.section`
  padding: 120px 40px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #000;
`;

export const HowToTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const HowToSubtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 60px;
`;

export const HowToSteps = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
`;

export const Step = styled.div`
  flex: 1 1 250px;
  text-align: center;
`;

export const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin: 0 auto 20px;
`;

export const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const StepText = styled.p`
  font-size: 14px;
  color: #444;
  line-height: 1.5;
`;

/* ---------- Start Section ---------- */
export const StartSection = styled.section`
  padding: 120px 40px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #000;
`;

export const StartTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const StartSubtitle = styled.p`
  font-size: 15px;
  color: #555;
  margin-bottom: 40px;
  line-height: 1.6;
`;

export const StartButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const StartBlackButton = styled.button`
  background: #000;
  color: #fff;
  border: 1.5px solid #000;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 22px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #111;
  }
`;

export const StartOutlineButton = styled.button`
  background: #fff;
  color: #000;
  border: 1.5px solid #000;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 22px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
