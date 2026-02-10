import { NextRequest } from "next/server";
import { getActor, jsonError, jsonOk } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  if (actor.role !== "admin") {
    return jsonError("forbidden", "Admin role is required.", 403);
  }
  const reports = store.getReports();
  return jsonOk({ reports });
}
