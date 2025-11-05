import styled from "styled-components";

export const Page = styled.div`
  min-height: 100svh;
  background: #ffffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: #0b1220;
  margin: 0 0 8px;
`;

export const Desc = styled.p`
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  /* ✅ 모든 입력 필드 높이 일치 */
  input {
    height: 44px;
  }
`;

export const Input = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 0;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }
`;

export const DuplicateButton = styled.button`
  height: 44px;
  padding: 0 12px;
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;

  &:hover:not(:disabled) {
    background: #000;
    color: #fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  height: 48px;
  margin-top: 10px;
  background: #ff8a00;
  color: #ffffff;
  font-weight: 700;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  transition: filter 120ms ease, transform 120ms ease;

  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.35);
  }
`;

export const KakaoButton = styled.button`
  height: 48px;
  background: #fee500;
  color: #000000;
  font-weight: 700;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  transition: filter 120ms ease, transform 120ms ease;

  &:hover {
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(254, 229, 0, 0.35);
  }
`;

export const KakaoIcon = styled.img`
  width: 18px;
  height: 18px;
  display: inline-block;
`;
