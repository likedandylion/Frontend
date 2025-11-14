import { useEffect, useState } from "react";
import styled from "styled-components";
import logoImage from "@/assets/logo.svg";

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? "auto" : "none")};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  height: 180px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1); /* 로고를 하얀색으로 변환 */
`;

export default function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 최소 1초 표시 후 페이드 아웃
    const timer = setTimeout(() => {
      setIsVisible(false);
      // 페이드 아웃 애니메이션 후 완전히 제거
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500); // transition 시간과 동일
    }, 1000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SplashContainer $isVisible={isVisible}>
      <LogoWrapper>
        <Logo src={logoImage} alt="PROME" />
      </LogoWrapper>
    </SplashContainer>
  );
}
