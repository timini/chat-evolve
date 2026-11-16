import { describe, it, expect } from "vitest";
import {
  tokenize,
  sentencesOf,
  codonForIndex,
  cycleMark,
  seedMarksForVariant,
  genePools,
  maskKey,
  G2,
} from "./content";

describe("tokenize", () => {
  it("splits on whitespace keeping punctuation attached", () => {
    expect(tokenize("Hello, world.")).toEqual(["Hello,", "world."]);
  });
  it("returns [] for empty input", () => {
    expect(tokenize("")).toEqual([]);
  });
});

describe("sentencesOf", () => {
  it("splits text into sentences with trailing punctuation", () => {
    expect(sentencesOf("One. Two! Three?")).toEqual(["One.", " Two!", " Three?"]);
  });
});

describe("codonForIndex", () => {
  it("is deterministic for a given seed + index", () => {
    expect(codonForIndex("A", 3)).toBe(codonForIndex("A", 3));
  });
  it("only ever returns A/T/G/C", () => {
    for (let i = 0; i < 50; i++) expect("ATGC").toContain(codonForIndex("X", i));
  });
});

describe("cycleMark", () => {
  it("cycles none → dominant → purged → none", () => {
    expect(cycleMark(undefined)).toBe("dominant");
    expect(cycleMark("dominant")).toBe("purged");
    expect(cycleMark("purged")).toBeUndefined();
  });
});

describe("seedMarksForVariant", () => {
  it("maps word-range genes onto sentence indices", () => {
    // G2 variant A: gene at words 13-18 + 22-29 are both in sentence 1 (0-indexed)
    const marks = seedMarksForVariant(G2.variants[0]!);
    expect(marks[1]).toBe("dominant");
  });
});

describe("genePools", () => {
  it("collects dominant and purged sentences across variants", () => {
    const marks = {
      A: { 0: "dominant" as const },
      B: { 1: "purged" as const },
      C: {},
    };
    const pools = genePools(G2, marks);
    expect(pools.dominant).toHaveLength(1);
    expect(pools.purged).toHaveLength(1);
    expect(pools.dominant[0]!.src).toBe("A");
    expect(pools.purged[0]!.src).toBe("B");
  });
});

describe("maskKey", () => {
  it("dots out the middle of a long key", () => {
    const masked = maskKey("sk-ant-api03-ABCDEFGH");
    expect(masked.startsWith("sk-a")).toBe(true);
    expect(masked.endsWith("EFGH")).toBe(true);
    expect(masked).toContain("•");
  });
  it("fully dots a short key", () => {
    expect(maskKey("abcd")).toBe("••••");
  });
  it("returns empty for empty input", () => {
    expect(maskKey("")).toBe("");
  });
});
