import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  chain,
  mergeWith,
  filter,
  noop,
} from "@angular-devkit/schematics";
import { strings, normalize } from "@angular-devkit/core";
import { Schema } from "./schema";

export function ngrxSignal(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    // Determine the name - use provided name or derive from parent folder
    let name = options.name;
    if (!name) {
      // Get the current working directory path
      const workingDir = process.cwd();
      const pathSegments = workingDir
        .split("/")
        .filter((segment) => segment.length > 0);
      name = pathSegments[pathSegments.length - 1] || "feature";
      _context.logger.info(
        `Auto-detected feature name: ${name} from current directory`
      );
    }

    // Normalize the path
    const targetPath = normalize(options.path || "./");

    // Create the folder structure path
    const storePath = options.flat
      ? targetPath
      : normalize(`${targetPath}/+state`);

    const templateSource = apply(url("./files"), [
      // Filter out test files if skipTests is true
      options.skipTests ? filter((path) => !path.endsWith(".spec.ts")) : noop(),
      template({
        ...strings,
        ...options,
        name,
      }),
      move(storePath),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
