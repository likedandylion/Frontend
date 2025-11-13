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

/* =========================
   💳 결제 모달 스타일
   ========================= */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 0;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  box-shadow: 8px 8px 0px #000;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;

export const PaymentInfo = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
`;

export const PlanInfo = styled.div`
  text-align: center;
`;

export const PlanName = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const PlanPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #000;

  span {
    font-size: 16px;
    font-weight: 400;
    color: #666;
  }
`;

export const CardForm = styled.div`
  margin-bottom: 24px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

export const CardInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #000;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  transition: box-shadow 0.2s;

  &:focus {
    outline: none;
    box-shadow: 3px 3px 0px #000;
  }

  &::placeholder {
    color: #999;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalNote = styled.p`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
  padding: 12px;
  background-color: #fff9e6;
  border: 1px solid #ffd700;
`;

export const PaymentButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #000;
  color: #fff;
  border: 2px solid #000;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0px #000;
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #000;
  }
`;

/* =========================
   🔄 결제 처리 중 스타일
   ========================= */
export const ProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ProcessingText = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const ProcessingSubtext = styled.div`
  font-size: 14px;
  color: #666;
`;

/* =========================
   ✅ 결제 완료 스타일
   ========================= */
export const CompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-weight: 700;
`;

export const CompleteTitle = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const CompleteText = styled.div`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
`;

export const CompleteSubtext = styled.div`
  font-size: 14px;
  color: #666;
`;
