import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  background: #fff;
  padding: 80px 0 90px;
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 840px;
  max-width: 100%;
  border: 2px solid #000000;
  background: #fff;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const WindowHeader = styled.div`
  background: #000;
  color: #ffffff;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
`;

export const DotGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  background: ${({ $color }) => $color || "#555"};
  border-radius: 50%;
`;

export const HeaderRight = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

export const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 36px 40px;
  gap: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

export const TitleInput = styled.input`
  border: none;
  border-bottom: 2px solid #000;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 0;
  outline: none;

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
  font-size: 13px;
  border-radius: 0;
  cursor: pointer;

  &:hover {
    border-color: #111;
  }
`;

export const TagBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TagInput = styled.input`
  border: 1px solid #ddd;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #0070f3;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagItem = styled.span`
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 16px;
  cursor: pointer;
  color: #333;

  &:hover {
    background: #eee;
  }
`;

export const PromptGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PromptSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContentArea = styled.textarea`
  border: 1px solid #ddd;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  height: 180px;
  resize: none;
  overflow-y: auto;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #0070f3;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

export const SubmitButton = styled.button`
  align-self: flex-end;
  background: #111;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;
