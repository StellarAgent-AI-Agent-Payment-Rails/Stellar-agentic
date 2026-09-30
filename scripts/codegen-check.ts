/**
 * Drift detection for generated SDK types and decoders.
 *
 * Runs on CI and fails when a contract spec has changed but the SDKs
 * have not been regenerated. The failure message names the contract and
 * field that diverged.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateAll,
  parseSpecFile,
  type ContractSpec,
  type TypeDef,
  type TypeRef,
} from "./codegen.js";

export interface Diagnostic {
  contract: string;
  file: string;
  message: string;
}

export function describeType(t: TypeRef): string {
  switch (t.kind) {
    case "primitive":
      return t.name;
    case "udt":
      return t.name;
    case "option":
      return `Option < ${describeType(t.value)} >`;
    case "vec":
      return `Vec < ${describeType(t.element)} >`;
  }
}

function typedefKey(td: TypeDef): string {
  return `${td.kind}:${td.name}`;
}

export function compareSpecs(committed: ContractSpec, generated: ContractSpec): Diagnostic[] {
  const diags: Diagnostic[] = [];
  const committedMap = new Map(committed.typedefs.map((td) => [typedefKey(td), td]));
  const generatedMap = new Map(generated.typedefs.map((td) => [typedefKey(td), td]));

  for (const [key, gen] of generatedMap) {
    const com = committedMap.get(key);
    if (!com) {
      diags.push({
        contract: generated.contract,
        file: generated.contract,
        message: `new type \${gen.name}\ is missing from the committed generated output`,
      });
      continue;
    }
    if (com.kind !== gen.kind) {
      diags.push({
        contract: generated.contract,
        file: generated.contract,
        message: `type \${gen.name}\ kind changed from \${com.kind} to \${gen.kind}`,
      });
      continue;
    }
    if (gen.kind === "struct" && com.kind === "struct") {
      const comFields = new Map(com.fields.map((f) => [f.name, f]));
      const genFields = new Map(gen.fields.map((f) => [f.name, f]));
      for (const [name, genF] of genFields) {
        const comF = comFields.get(name);
        if (!comF) {
          diags.push({
            contract: generated.contract,
            file: generated.contract,
            message: `struct \${gen.name}\.\${name}\ is missing from the committed generated output`,
          });
          continue;
        }
        if (describeType(comF.type) !== describeType(genF.type)) {
          diags.push({
            contract: generated.contract,
            file: generated.contract,
            message: `struct \${gen.name}\.\${name}\ type changed from \${describeType(comF.type)} to \${describeType(genF.type)}`,
          });
        }
      }
    }
    if (gen.kind === "union" && com.kind === "union") {
      const comCases = new Set(com.cases.map((c) => c.name));
      for (const c of gen.cases) {
        if (!comCases.has(c.name)) {
          diags.push({
            contract: generated.contract,
            file: generated.contract,
            message: `union \${gen.name}\.\${c.name}\ is missing from the committed generated output`,
          });
        }
      }
    }
  }

  for (const [key, com] of committedMap) {
    if (!generatedMap.has(key)) {
      diags.push({
        contract: generated.contract,
        file: generated.contract,
        message: `type \${com.name}\ is stale in the committed generated output`,
      });
    }
  }

  return diags;
}

export function runCheck(rootDir: string): Diagnostic[] {
  const diags: Diagnostic[] = [];
  const contractsDir = join(rootDir, "contracts");
  const outputs = generateAll(contractsDir);
  for (const o of outputs) {
    const abs = resolve(rootDir, o.path);
    if (!existsSync(abs)) {
      diags.push({
        contract: o.path,
        file: o.path,
        message: `generated file is missing — run \`pnpm codegen\``,
      });
      continue;
    }
    const actual = readFileSync(abs, "utf-8");
    if (actual !== o.content) {
      diags.push({
        contract: o.path,
        file: o.path,
        message: `generated output differs from the committed file — run \`pnpm codegen\``,
      });
    }
  }
  return diags;
}

function main(): void {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const diags = runCheck(root);
  if (diags.length === 0) {
    console.log("codegen:check ok — SDKs match contract specs");
    return;
  }
  console.error("codegen:check failed — contract specs changed but SDKs were not regenerated:");
  for (const d of diags) {
    console.error(`  [${d.contract}] ${d.message}`);
  }
  console.error("\nRun `pnpm codegen` and commit the result.");
  process.exitCode(1);
}

if (import.meta.url === `pathToFileURL(argv[1])`) {
  main();
}

function pathToFileURL(_p: string): string {
  return `file://${resolve(_p)}`;
}
