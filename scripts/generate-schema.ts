// scripts/generate-schema.ts
import fs from 'fs';
import path from 'path';

const prismaDir = path.join(__dirname, '../prisma');
const modelsDir = path.join(prismaDir, 'models');
const schemaPath = path.join(prismaDir, 'schema.prisma');

const baseSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const modelFiles = fs
  .readdirSync(modelsDir)
  .filter(file => file.endsWith('.prisma'))
  .map(file => fs.readFileSync(path.join(modelsDir, file), 'utf-8'))
  .join('\n\n');

fs.writeFileSync(schemaPath, baseSchema + '\n\n' + modelFiles);
console.log('✅ schema.prisma generated successfully.');
