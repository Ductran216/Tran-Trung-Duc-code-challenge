import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import * as path from "path";

/**
 * Get project root path
 * @description without trailing slash
 */
export function getRootPath(): string {
  return path.resolve(process.cwd());
}

/**
 * Get the project src path
 * @param srcName - src directory name (default: "src")
 * @description without trailing slash
 */
export function getSrcPath(srcName = "src"): string {
  const rootPath = getRootPath();
  return `${rootPath}/${srcName}`;
}

export default defineConfig(() => {
  const rootPath = getRootPath();
  const srcPath = getSrcPath();

  return {
    base: "/",
    resolve: {
      alias: {
        "~": rootPath,
        "@": srcPath,
      },
    },
    plugins: [react()],
  };
});
