import { initServer } from "ts-rest-hono";
import { contract } from "./contract";

const s = initServer();

export const router = s.router(contract, {
  getUsers: async () => {
    const users = [
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
    ];

    return {
      status: 200,
      body: users,
    };
  },
});

// If you need to access the tags for OpenAPI generation
// export const getOpenAPITags = () => {
//   return Object.entries(contract).reduce(
//     (acc, [key, value]) => {
//       if (value.metadata?.tags) {
//         value.metadata.tags.forEach((tag) => {
//           if (!acc.some((t) => t.name === tag)) {
//             acc.push({ name: tag });
//           }
//         });
//       }
//       return acc;
//     },
//     [] as { name: string }[],
//   );
// };
