import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Checks that the project uses TypeScript
 * @throws Error if TypeScript is not configured
 */
export function ensureTypeScriptProject(): void {
  const projectRoot = process.cwd();
  const tsconfigPath = join(projectRoot, 'tsconfig.json');
  
  if (!existsSync(tsconfigPath)) {
    throw new Error(
      '❌ TypeScript configuration not found!\n\n' +
      '@c1ach0/harmonix requires TypeScript.\n\n' +
      'Create a tsconfig.json file:\n' +
      '  npx tsc --init\n\n' +
      'Or use this minimal configuration:\n' +
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          module: "commonjs",
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          esModuleInterop: true,
          strict: true
        }
      }, null, 2)
    );
  }
  
  try {
    require.resolve('typescript');
  } catch {
    throw new Error(
      '❌ TypeScript is not installed!\n\n' +
      'Install TypeScript:\n' +
      '  npm install --save-dev typescript\n' +
      '  # or\n' +
      '  yarn add -D typescript'
    );
  }
}

export function validateTypeScriptConfig(): void {
  try {
    const tsConfigPath = join(process.cwd(), 'tsconfig.json');
    const tsConfig = require(tsConfigPath);
    const compilerOptions = tsConfig.compilerOptions || {};
    
    const required = {
      experimentalDecorators: true,
      emitDecoratorMetadata: true
    };
    
    const missing: string[] = [];
    
    for (const [key, value] of Object.entries(required)) {
      if (compilerOptions[key] !== value) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0) {
      console.warn(
        '⚠️  Missing required TypeScript options:\n' +
        missing.map(opt => `  - ${opt}: true`).join('\n') +
        '\n\nAdd these to your tsconfig.json'
      );
    }
  } catch (error) {
    console.warn('⚠️  Could not validate tsconfig.json');
  }
}