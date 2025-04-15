import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// Trivia category mapping
const triviaCategories = {
  Film: "11",
  "Video Games": "15"
};

// In-memory cache for monkeys
let monkeyList = [];

async function fetchMonkeys() {
  if (monkeyList.length > 0) {
    return monkeyList;
  }

  try {
    const response = await fetch("https://www.montemagno.com/monkeys.json");
    if (response.ok) {
      monkeyList = await response.json();
    }
  } catch (error) {
    console.error("Error fetching monkeys:", error);
  }

  return monkeyList ?? [];
}

server.tool(
  "GetMonkeys",
  {},
  async () => {
    const monkeys = await fetchMonkeys();
    return {
      content: [
        {
          type: "json",
          json: monkeys
        }
      ]
    };
  }
);

server.tool(
  "GetMonkey",
  { name: z.string() },
  async ({ name }) => {
    const monkeys = await fetchMonkeys();
    const monkey = monkeys.find(
      (m) => m.Name?.toLowerCase() === name.toLowerCase()
    );

    if (!monkey) {
      return {
        content: [
          {
            type: "text",
            text: `Monkey with name "${name}" not found.`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "json",
          json: monkey
        }
      ]
    };
  }
);

// Function to fetch trivia questions
async function fetchTrivias(amount, category) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=medium&type=multiple`
    );
    if (response.ok) {
      const triviaResponse = await response.json();
      return triviaResponse;
    }
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
  }

  return { response_code: 1, results: [] }; // Default empty response
}

server.tool(
  "GetTrivias",
  {
    amount: z.number().min(1).max(50),
    category: z.string().refine((value) => triviaCategories[value], {
      message: "Invalid category. Valid categories are: Film, Video Games."
    })
  },
  async ({ amount, category }) => {
    const categoryId = triviaCategories[category];
    const triviaResponse = await fetchTrivias(amount, categoryId);

    if (triviaResponse.response_code !== 0) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch trivia questions. Please try again."
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "json",
          json: triviaResponse.results
        }
      ]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);