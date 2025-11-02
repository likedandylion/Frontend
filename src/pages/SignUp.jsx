import { useState } from "react";
import http from "@/shared/api/http";
export default function SignUp() {
  const [f, setF] = useState({ email: "", password: "", name: "" });
  const submit = async (e) => {
    e.preventDefault();
    await http.post("/api/signup", f);
    alert("회원가입 완료");
  };
  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={submit}>
        <input
          placeholder="이메일"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <input
          placeholder="이름"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <button>가입</button>
      </form>
    </>
  );
}
