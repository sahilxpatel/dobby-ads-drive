import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

const server = new McpServer({
  name: "dobby-ads",
  version: "1.0.0"
});

// TOOL 1: create_folder
server.tool(
  "create_folder",
  "Creates a new folder in Dobby Ads Drive. Can create nested folders by providing a parentId.",
  {
    name: z.string(),
    parentId: z.string().optional(),
    token: z.string()
  },
  async ({ name, parentId, token }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/folders`,
        { name, parentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return {
        content: [{ type: "text", text: `Folder '${name}' created successfully!` }]
      };
    } catch (error) {
      console.error("Error in create_folder:", error.message);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// TOOL 2: list_folders
server.tool(
  "list_folders",
  "Lists all folders in Dobby Ads Drive. Optionally list folders inside a specific parent folder.",
  {
    token: z.string(),
    parentId: z.string().optional()
  },
  async ({ token, parentId }) => {
    try {
      const queryString = parentId ? `?parentId=${parentId}` : "";
      const response = await axios.get(
        `${API_BASE_URL}/api/folders${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const folders = response.data;
      if (!folders || folders.length === 0) {
        return {
          content: [{ type: "text", text: "No folders found." }]
        };
      }
      
      const formattedList = folders
        .map(folder => `- ${folder.name} (${folder.size || 0} KB)`)
        .join("\n");
        
      return {
        content: [{ type: "text", text: formattedList }]
      };
    } catch (error) {
      console.error("Error in list_folders:", error.message);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// TOOL 3: upload_image
server.tool(
  "upload_image",
  "Uploads an image to a specific folder in Dobby Ads Drive using a public image URL.",
  {
    name: z.string(),
    imageUrl: z.string(),
    folderId: z.string(),
    token: z.string()
  },
  async ({ name, imageUrl, folderId, token }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/images/upload`,
        { name, imageUrl, folderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      return {
        content: [{ type: "text", text: `Image '${name}' uploaded successfully!` }]
      };
    } catch (error) {
      console.error("Error in upload_image:", error.message);
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  server.close().then(() => {
    process.exit(0);
  });
});
