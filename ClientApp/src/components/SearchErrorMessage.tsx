import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import * as v from "valibot";

function showMsg(msg: string) {
  return (
    <div style={{ color: "red", padding: "8px", margin: "8px 0" }}>
      {msg}
    </div>
  );
}

export function SearchErrorMessage({
  error,
}: {
  error: FetchBaseQueryError | SerializedError;
}) {
  const errorSchema = v.object({
    message: v.string(),
  });

  if ("data" in error) {
    const errorMsg = v.safeParse(errorSchema, error.data);
    
    if (errorMsg.success) {
      return showMsg(errorMsg.output.message);
    }

    return showMsg("Erro ao buscar dados.");
  }

  return showMsg("Não foi possível conectar ao servidor.");
}
