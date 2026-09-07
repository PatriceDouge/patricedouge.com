import type { MDXComponents } from "mdx/types";

import * as canova from "./canova";
import * as daniels from "./daniels";
import * as hansons from "./hansons";
import * as hudson from "./hudson";
import * as lydiard from "./lydiard";
import * as mantzEyestone from "./mantz-eyestone";
import * as norwegian from "./norwegian";
import * as pathToUbiquitousAi from "./path-to-ubiquitous-ai";
import * as pfitzinger from "./pfitzinger";
import * as polarized from "./polarized";
import * as tinman from "./tinman";

/**
 * Per-document diagram modules, keyed by content slug. `loadDocument` merges
 * `diagrams[slug]` into the components map, which is why the same diagram name
 * (`WeeklyStructureTimeline`, say) can mean something different in each article
 * without colliding.
 */
export const diagrams: Record<string, MDXComponents> = {
  canova,
  daniels,
  hansons,
  hudson,
  lydiard,
  "mantz-eyestone": mantzEyestone,
  norwegian,
  "path-to-ubiquitous-ai": pathToUbiquitousAi,
  pfitzinger,
  polarized,
  tinman,
};
