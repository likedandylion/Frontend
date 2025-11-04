import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import http from "@/shared/api/http";
import { useAuth } from "@/features/auth/useAuth";
export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await http.post("/api/login", f);
    login(data.accessToken, data.user);
    nav(loc.state?.from?.pathname || "/", { replace: true });
  };
  return (
    <>
      <h1>로그인</h1>
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
        <button>로그인</button>
      </form>
    </>
  );
}
