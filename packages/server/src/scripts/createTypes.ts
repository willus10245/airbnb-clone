import { generateNamespace } from "@gql2ts/from-schema";
import * as fs from "fs";
import * as path from "path";

import { genSchema } from "../utils/genSchema";

const typescriptTypes = generateNamespace("GQL", genSchema());
const filepath = path.join(__dirname, "../types/schema.d.ts");
fs.writeFile(filepath, typescriptTypes, err => {
  console.log(err);
});
