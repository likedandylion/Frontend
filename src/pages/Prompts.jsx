import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "@/shared/api/http";
export default function Prompts() {
  const [items, setItems] = useState([]);
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  useEffect(() => {
    (async () => {
      const { data } = await http.get("/api/prompts", { params: { q } });
      setItems(data);
    })();
  }, [q]);
  return (
    <>
      <h1>전체 프롬프트</h1>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/prompts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/prompts/new">프롬프트 작성</Link>
    </>
  );
}
