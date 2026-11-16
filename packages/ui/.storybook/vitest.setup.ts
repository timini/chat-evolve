import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/react";
import * as projectAnnotations from "./preview";

// Applies Storybook's project-level annotations (decorators, globals, params)
// when stories run as Vitest tests.
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
