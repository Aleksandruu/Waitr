#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const componentPath = process.argv[2];

if (!componentPath) {
  console.error("❌ No component path provided!");
  process.exit(1);
}

// Current directory (where you run the command)
const currentDir = process.cwd();
const fullComponentPath = path.join(currentDir, componentPath);

// Extract component name from the last part of the path
const componentName = path.basename(componentPath);

if (fs.existsSync(fullComponentPath)) {
  console.error("❌ Component already exists!");
  process.exit(1);
}

fs.mkdirSync(fullComponentPath, { recursive: true });

// Templates
const componentTemplate = `import styles from "./${componentName}.module.scss";

type ${componentName}Props = {
  // props here
};

const ${componentName} = ({}: ${componentName}Props) => {
  return <></>;
};

export default ${componentName};
`;

const scssTemplate = "";

const storyTemplate = `import type { Meta, StoryObj } from "@storybook/react";
import ${componentName} from "./${componentName}";

const meta = {
  title: "Components/${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
`;

// Helper function
const createFile = (filePath, content) => {
  fs.writeFileSync(filePath, content.trimStart());
};

// Create files
createFile(
  path.join(fullComponentPath, `${componentName}.tsx`),
  componentTemplate
);
createFile(
  path.join(fullComponentPath, `${componentName}.module.scss`),
  scssTemplate
);
createFile(
  path.join(fullComponentPath, `${componentName}.stories.ts`),
  storyTemplate
);

console.log(
  `✅ ${componentName} component created successfully in ${fullComponentPath}`
);
