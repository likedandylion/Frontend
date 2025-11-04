import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  background: #fff;
  padding: 80px 0;
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #000;
  border-radius: 0;
  background: #fff;
`;

export const WindowHeader = styled.div`
  background: #000;
  color: #fff;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

export const DotGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
`;

export const HeaderRight = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 20px;
`;

export const TitleInput = styled.input`
  border: none;
  border-bottom: 2px solid #000;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 0;
  outline: none;
  border-radius: 0;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #0070f3;
  }
`;

export const DescriptionInput = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  padding: 6px 0;
  outline: none;
  border-radius: 0;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: #0070f3;
  }
`;

export const CategoryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CategoryLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const CategoryTag = styled.button`
  border: 1px solid ${({ $active }) => ($active ? "#111" : "#ccc")};
  background: ${({ $active }) => ($active ? "#111" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#111")};
  padding: 6px 12px;
  border-radius: 0;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    border-color: #111;
  }
`;

export const ContentArea = styled.textarea`
  border: 1px solid #ddd;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  height: 320px;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #0070f3;
  }
`;

export const SubmitButton = styled.button`
  align-self: flex-end;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;
