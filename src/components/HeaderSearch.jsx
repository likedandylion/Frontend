// src/components/HeaderSearch.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 6px;
`;


const Input = styled.input`
  width: 220px;       /* 가로 길이 늘리기 */
  height: 36px;       /* 세로 길이 늘리기 */
  padding: 0 12px;
  border: 2px solid #000;
  font-size: 14px;
  border-radius: 4px; /* 살짝 둥글게 */
  outline: none;

  &:focus {
    box-shadow: 3px 3px 0 #000;
  }
`;


const Button = styled.button`
  height: 36px;         
  padding: 0 14px;
  border: none;
  background-color: #000;    
  color: #fff;             
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 #000;
  }
`;

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="프롬프트 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button type="submit">검색</Button>
    </Form>
  );
}
