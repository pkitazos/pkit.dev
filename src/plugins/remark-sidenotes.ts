import type {
  FootnoteDefinition,
  Node,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";

/**
 * Turns GFM footnotes into Tufte-style side and margin notes.
 *
 *   Some text.[^note]     -> numbered sidenote
 *   Some text.[^mn-note]  -> unnumbered margin note (⊕ toggle on small screens)
 *
 *   [^note]: The note's content.
 *
 * Each reference is replaced in place by a <label>, a hidden checkbox and a
 * <span> holding the note, so no footnote section is rendered at the bottom.
 * The nodes use `data.hName` so they convert the same way in `.md` and `.mdx`.
 *
 * Adapted from https://github.com/wenkokke/vai-book/
 */
export default function remarkSidenotes() {
  return (tree: Root, file: VFile) => {
    const definitions = new Map<string, FootnoteDefinition>();
    visit(tree, "footnoteDefinition", (definition, index, parent) => {
      definitions.set(definition.identifier, definition);
      parent!.children.splice(index!, 1);
      return index;
    });

    const seen = new Map<string, number>();
    visit(tree, "footnoteReference", (reference, index, parent) => {
      const { identifier } = reference;
      const definition = definitions.get(identifier);
      if (!definition) {
        file.fail(`unknown footnote [^${identifier}]`, reference);
      }

      // Footnotes can be referenced more than once, but ids must be unique.
      const count = (seen.get(identifier) ?? 0) + 1;
      seen.set(identifier, count);
      const id = `sn-${identifier}` + (count > 1 ? `-${count}` : "");

      const isMargin = identifier.startsWith("mn-");
      const nodes = [
        element(
          "label",
          {
            htmlFor: id,
            className: isMargin
              ? ["sidenote-toggle"]
              : ["sidenote-toggle", "sidenote-number"],
          },
          isMargin ? [{ type: "text", value: "⊕" }] : [],
        ),
        element("input", {
          type: "checkbox",
          id,
          className: ["sidenote-checkbox"],
        }),
        element(
          "span",
          {
            className: [isMargin ? "marginnote" : "sidenote"],
          },
          toPhrasing(definition, file),
        ),
      ];

      parent!.children.splice(index!, 1, ...nodes);
      return index! + nodes.length;
    });
  };
}

/** An mdast node that remark-rehype renders as the given element. */
function element(
  tagName: string,
  properties: Record<string, unknown>,
  children: PhrasingContent[] = [],
): PhrasingContent {
  return {
    type: "sidenoteElement",
    data: { hName: tagName, hProperties: properties },
    children,
  } as unknown as PhrasingContent;
}

/** Notes live inside a paragraph, so their content must be inline. */
function toPhrasing(node: Node, file: VFile): PhrasingContent[] {
  switch (node.type) {
    case "footnoteDefinition": {
      const paragraphs = (node as FootnoteDefinition).children;
      // Keep a space between paragraphs once they're joined inline.
      return paragraphs.flatMap((child, i) => [
        ...(i > 0 ? [{ type: "text", value: " " } as const] : []),
        ...toPhrasing(child, file),
      ]);
    }

    case "paragraph":
      return (node as Extract<RootContent, { type: "paragraph" }>).children;

    default:
      file.fail(
        `sidenotes can only contain paragraphs, found ${node.type}`,
        node,
      );
  }
}
