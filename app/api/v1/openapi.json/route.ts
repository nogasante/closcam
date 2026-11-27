const spec = {
  openapi: "3.0.3",
  info: {
    title: "CloScam community lookup",
    version: "1.0.0",
    description: "Read-only lookup of community reports. No reporter data and no evidence files.",
  },
  paths: {
    "/api/v1/lookup": {
      get: {
        parameters: [
          { name: "type", in: "query", required: true, schema: { type: "string", enum: ["phone", "url", "business"] } },
          { name: "q", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Lookup result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", enum: ["flagged", "reported_unverified", "clean_unknown"] },
                    reportCount: { type: "integer" },
                    scamTypes: { type: "array", items: { type: "string" } },
                    lastReported: { type: "string", nullable: true },
                    disputeOpen: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export function GET() {
  return Response.json(spec);
}
