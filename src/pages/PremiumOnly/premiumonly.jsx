import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "@/shared/api/http";
export default function PremiumOnly() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await http.get("/api/premium/prompts");
      setItems(data);
    })();
  }, []);
  return (
    <>
      <h1>프리미엄 전용 프롬프트</h1>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/prompts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
