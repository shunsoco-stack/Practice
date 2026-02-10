import { NextRequest } from "next/server";
import { parseJsonBody, jsonOk } from "@/lib/api/http";
import { ageGateSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, ageGateSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  const isAdult = store.isAdult(parsed.data.birthDate);
  return jsonOk({ isAdult });
}
