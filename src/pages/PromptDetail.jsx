import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "@/shared/api/http";
export default function PromptDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await http.get(`/api/prompts/${id}`);
      setP(data);
    })();
  }, [id]);
  if (!p) return "로딩...";
  return (
    <>
      <h1>{p.title}</h1>
      <pre>{p.content}</pre>
    </>
  );
}
