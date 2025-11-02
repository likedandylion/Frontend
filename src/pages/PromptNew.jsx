import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "@/shared/api/http";
export default function PromptNew() {
  const [f, setF] = useState({ title: "", content: "" });
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await http.post("/api/prompts", f);
    nav(`/prompts/${data.id}`);
  };
  return (
    <>
      <h1>프롬프트 작성</h1>
      <form onSubmit={submit}>
        <input
          placeholder="제목"
          value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })}
        />
        <textarea
          rows={8}
          placeholder="내용"
          value={f.content}
          onChange={(e) => setF({ ...f, content: e.target.value })}
        />
        <button>등록</button>
      </form>
    </>
  );
}
