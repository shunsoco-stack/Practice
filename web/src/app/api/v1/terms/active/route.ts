import { jsonOk } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

export async function GET() {
  const terms = store.getActiveTerms();
  return jsonOk({ terms });
}
