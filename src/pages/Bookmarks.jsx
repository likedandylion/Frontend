import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "@/shared/api/http";
export default function Bookmarks() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await http.get("/api/bookmarks");
      setItems(data);
    })();
  }, []);
  return (
    <>
      <h1>북마크</h1>
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
