import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import http from "@/shared/api/http";
export default function SearchResults() {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await http.get("/api/search", { params: { q } });
      setItems(data);
    })();
  }, [q]);
  return (
    <>
      <h1>검색 결과: {q}</h1>
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
