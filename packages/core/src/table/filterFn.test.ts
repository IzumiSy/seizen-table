import { describe, it, expect } from "vitest";
import { pluginFilterFn, type PluginFilterValue } from "./filterFn";

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Create a mock row object for testing
 */
function createMockRow(values: Record<string, unknown>) {
  return {
    getValue: (columnId: string) => values[columnId],
  } as Parameters<typeof pluginFilterFn>[0];
}

/**
 * Create a plugin filter value
 */
function filter(
  operator: PluginFilterValue["operator"],
  value: string
): PluginFilterValue {
  return { operator, value };
}

// =============================================================================
// Non-Plugin Filter Value (Default Behavior)
// =============================================================================

describe("pluginFilterFn - default behavior (non-plugin filter value)", () => {
  it("matches when cell value contains filter string (case-insensitive)", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(pluginFilterFn(row, "name", "john", () => {})).toBe(true);
    expect(pluginFilterFn(row, "name", "DOE", () => {})).toBe(true);
    expect(pluginFilterFn(row, "name", "hn do", () => {})).toBe(true);
  });

  it("does not match when cell value does not contain filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(pluginFilterFn(row, "name", "Jane", () => {})).toBe(false);
  });

  it("handles null cell values", () => {
    const row = createMockRow({ name: null });
    expect(pluginFilterFn(row, "name", "test", () => {})).toBe(false);
    expect(pluginFilterFn(row, "name", "", () => {})).toBe(true);
  });

  it("handles undefined cell values", () => {
    const row = createMockRow({ name: undefined });
    expect(pluginFilterFn(row, "name", "test", () => {})).toBe(false);
  });

  it("handles numeric cell values", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", "25", () => {})).toBe(true);
    expect(pluginFilterFn(row, "age", "2", () => {})).toBe(true);
  });
});

// =============================================================================
// Empty Check Operators
// =============================================================================

describe("pluginFilterFn - is_empty operator", () => {
  it("returns true for null values", () => {
    const row = createMockRow({ name: null });
    expect(pluginFilterFn(row, "name", filter("is_empty", ""), () => {})).toBe(
      true
    );
  });

  it("returns true for undefined values", () => {
    const row = createMockRow({ name: undefined });
    expect(pluginFilterFn(row, "name", filter("is_empty", ""), () => {})).toBe(
      true
    );
  });

  it("returns true for empty string values", () => {
    const row = createMockRow({ name: "" });
    expect(pluginFilterFn(row, "name", filter("is_empty", ""), () => {})).toBe(
      true
    );
  });

  it("returns false for non-empty values", () => {
    const row = createMockRow({ name: "John" });
    expect(pluginFilterFn(row, "name", filter("is_empty", ""), () => {})).toBe(
      false
    );
  });

  it("returns false for zero", () => {
    const row = createMockRow({ age: 0 });
    expect(pluginFilterFn(row, "age", filter("is_empty", ""), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - is_not_empty operator", () => {
  it("returns false for null values", () => {
    const row = createMockRow({ name: null });
    expect(
      pluginFilterFn(row, "name", filter("is_not_empty", ""), () => {})
    ).toBe(false);
  });

  it("returns false for undefined values", () => {
    const row = createMockRow({ name: undefined });
    expect(
      pluginFilterFn(row, "name", filter("is_not_empty", ""), () => {})
    ).toBe(false);
  });

  it("returns false for empty string values", () => {
    const row = createMockRow({ name: "" });
    expect(
      pluginFilterFn(row, "name", filter("is_not_empty", ""), () => {})
    ).toBe(false);
  });

  it("returns true for non-empty values", () => {
    const row = createMockRow({ name: "John" });
    expect(
      pluginFilterFn(row, "name", filter("is_not_empty", ""), () => {})
    ).toBe(true);
  });

  it("returns true for zero", () => {
    const row = createMockRow({ age: 0 });
    expect(
      pluginFilterFn(row, "age", filter("is_not_empty", ""), () => {})
    ).toBe(true);
  });
});

// =============================================================================
// String Operators
// =============================================================================

describe("pluginFilterFn - contains operator", () => {
  it("matches when cell contains filter string (case-insensitive)", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("contains", "john"), () => {})
    ).toBe(true);
    expect(
      pluginFilterFn(row, "name", filter("contains", "DOE"), () => {})
    ).toBe(true);
  });

  it("does not match when cell does not contain filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("contains", "Jane"), () => {})
    ).toBe(false);
  });

  it("handles null values", () => {
    const row = createMockRow({ name: null });
    expect(
      pluginFilterFn(row, "name", filter("contains", "test"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - not_contains operator", () => {
  it("matches when cell does not contain filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("not_contains", "Jane"), () => {})
    ).toBe(true);
  });

  it("does not match when cell contains filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("not_contains", "John"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - equals operator", () => {
  it("matches when cell equals filter string (case-insensitive)", () => {
    const row = createMockRow({ name: "John" });
    expect(
      pluginFilterFn(row, "name", filter("equals", "john"), () => {})
    ).toBe(true);
    expect(
      pluginFilterFn(row, "name", filter("equals", "JOHN"), () => {})
    ).toBe(true);
  });

  it("does not match when cell does not equal filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("equals", "John"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - not_equals operator", () => {
  it("matches when cell does not equal filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("not_equals", "John"), () => {})
    ).toBe(true);
  });

  it("does not match when cell equals filter string", () => {
    const row = createMockRow({ name: "John" });
    expect(
      pluginFilterFn(row, "name", filter("not_equals", "john"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - starts_with operator", () => {
  it("matches when cell starts with filter string (case-insensitive)", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("starts_with", "john"), () => {})
    ).toBe(true);
  });

  it("does not match when cell does not start with filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("starts_with", "Doe"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - ends_with operator", () => {
  it("matches when cell ends with filter string (case-insensitive)", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("ends_with", "doe"), () => {})
    ).toBe(true);
  });

  it("does not match when cell does not end with filter string", () => {
    const row = createMockRow({ name: "John Doe" });
    expect(
      pluginFilterFn(row, "name", filter("ends_with", "John"), () => {})
    ).toBe(false);
  });
});

// =============================================================================
// Number Operators
// =============================================================================

describe("pluginFilterFn - eq operator", () => {
  it("matches when cell equals filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("eq", "25"), () => {})).toBe(true);
  });

  it("does not match when cell does not equal filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("eq", "30"), () => {})).toBe(
      false
    );
  });

  it("returns false for non-numeric cell values", () => {
    const row = createMockRow({ age: "not a number" });
    expect(pluginFilterFn(row, "age", filter("eq", "25"), () => {})).toBe(
      false
    );
  });

  it("returns false for non-numeric filter values", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("eq", "abc"), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - neq operator", () => {
  it("matches when cell does not equal filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("neq", "30"), () => {})).toBe(
      true
    );
  });

  it("does not match when cell equals filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("neq", "25"), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - gt operator", () => {
  it("matches when cell is greater than filter number", () => {
    const row = createMockRow({ age: 30 });
    expect(pluginFilterFn(row, "age", filter("gt", "25"), () => {})).toBe(true);
  });

  it("does not match when cell is equal to filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("gt", "25"), () => {})).toBe(
      false
    );
  });

  it("does not match when cell is less than filter number", () => {
    const row = createMockRow({ age: 20 });
    expect(pluginFilterFn(row, "age", filter("gt", "25"), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - gte operator", () => {
  it("matches when cell is greater than filter number", () => {
    const row = createMockRow({ age: 30 });
    expect(pluginFilterFn(row, "age", filter("gte", "25"), () => {})).toBe(
      true
    );
  });

  it("matches when cell is equal to filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("gte", "25"), () => {})).toBe(
      true
    );
  });

  it("does not match when cell is less than filter number", () => {
    const row = createMockRow({ age: 20 });
    expect(pluginFilterFn(row, "age", filter("gte", "25"), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - lt operator", () => {
  it("matches when cell is less than filter number", () => {
    const row = createMockRow({ age: 20 });
    expect(pluginFilterFn(row, "age", filter("lt", "25"), () => {})).toBe(true);
  });

  it("does not match when cell is equal to filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("lt", "25"), () => {})).toBe(
      false
    );
  });

  it("does not match when cell is greater than filter number", () => {
    const row = createMockRow({ age: 30 });
    expect(pluginFilterFn(row, "age", filter("lt", "25"), () => {})).toBe(
      false
    );
  });
});

describe("pluginFilterFn - lte operator", () => {
  it("matches when cell is less than filter number", () => {
    const row = createMockRow({ age: 20 });
    expect(pluginFilterFn(row, "age", filter("lte", "25"), () => {})).toBe(
      true
    );
  });

  it("matches when cell is equal to filter number", () => {
    const row = createMockRow({ age: 25 });
    expect(pluginFilterFn(row, "age", filter("lte", "25"), () => {})).toBe(
      true
    );
  });

  it("does not match when cell is greater than filter number", () => {
    const row = createMockRow({ age: 30 });
    expect(pluginFilterFn(row, "age", filter("lte", "25"), () => {})).toBe(
      false
    );
  });
});

// =============================================================================
// Date Operators
// =============================================================================

describe("pluginFilterFn - before operator", () => {
  it("matches when cell date is before filter date", () => {
    const row = createMockRow({ date: "2024-01-01" });
    expect(
      pluginFilterFn(row, "date", filter("before", "2024-06-01"), () => {})
    ).toBe(true);
  });

  it("does not match when cell date is after filter date", () => {
    const row = createMockRow({ date: "2024-12-01" });
    expect(
      pluginFilterFn(row, "date", filter("before", "2024-06-01"), () => {})
    ).toBe(false);
  });

  it("does not match when cell date equals filter date", () => {
    const row = createMockRow({ date: "2024-06-01" });
    expect(
      pluginFilterFn(row, "date", filter("before", "2024-06-01"), () => {})
    ).toBe(false);
  });

  it("returns false for invalid cell date", () => {
    const row = createMockRow({ date: "not a date" });
    expect(
      pluginFilterFn(row, "date", filter("before", "2024-06-01"), () => {})
    ).toBe(false);
  });

  it("returns false for invalid filter date", () => {
    const row = createMockRow({ date: "2024-01-01" });
    expect(
      pluginFilterFn(row, "date", filter("before", "invalid"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - after operator", () => {
  it("matches when cell date is after filter date", () => {
    const row = createMockRow({ date: "2024-12-01" });
    expect(
      pluginFilterFn(row, "date", filter("after", "2024-06-01"), () => {})
    ).toBe(true);
  });

  it("does not match when cell date is before filter date", () => {
    const row = createMockRow({ date: "2024-01-01" });
    expect(
      pluginFilterFn(row, "date", filter("after", "2024-06-01"), () => {})
    ).toBe(false);
  });

  it("does not match when cell date equals filter date", () => {
    const row = createMockRow({ date: "2024-06-01" });
    expect(
      pluginFilterFn(row, "date", filter("after", "2024-06-01"), () => {})
    ).toBe(false);
  });
});

// =============================================================================
// Enum Operators
// =============================================================================

describe("pluginFilterFn - is operator", () => {
  it("matches when cell equals filter value (case-insensitive)", () => {
    const row = createMockRow({ status: "Active" });
    expect(
      pluginFilterFn(row, "status", filter("is", "active"), () => {})
    ).toBe(true);
    expect(
      pluginFilterFn(row, "status", filter("is", "ACTIVE"), () => {})
    ).toBe(true);
  });

  it("does not match when cell does not equal filter value", () => {
    const row = createMockRow({ status: "Active" });
    expect(
      pluginFilterFn(row, "status", filter("is", "Inactive"), () => {})
    ).toBe(false);
  });
});

describe("pluginFilterFn - is_not operator", () => {
  it("matches when cell does not equal filter value", () => {
    const row = createMockRow({ status: "Active" });
    expect(
      pluginFilterFn(row, "status", filter("is_not", "Inactive"), () => {})
    ).toBe(true);
  });

  it("does not match when cell equals filter value (case-insensitive)", () => {
    const row = createMockRow({ status: "Active" });
    expect(
      pluginFilterFn(row, "status", filter("is_not", "active"), () => {})
    ).toBe(false);
  });
});

// =============================================================================
// autoRemove
// =============================================================================

describe("pluginFilterFn.autoRemove", () => {
  it("returns true for empty non-plugin filter values", () => {
    expect(pluginFilterFn.autoRemove!("", {} as never)).toBe(true);
    expect(pluginFilterFn.autoRemove!(null, {} as never)).toBe(true);
    expect(pluginFilterFn.autoRemove!(undefined, {} as never)).toBe(true);
  });

  it("returns false for non-empty non-plugin filter values", () => {
    expect(pluginFilterFn.autoRemove!("test", {} as never)).toBe(false);
  });

  it("returns false for is_empty operator", () => {
    expect(
      pluginFilterFn.autoRemove!(filter("is_empty", ""), {} as never)
    ).toBe(false);
  });

  it("returns false for is_not_empty operator", () => {
    expect(
      pluginFilterFn.autoRemove!(filter("is_not_empty", ""), {} as never)
    ).toBe(false);
  });

  it("returns true for plugin filter with empty value", () => {
    expect(
      pluginFilterFn.autoRemove!(filter("contains", ""), {} as never)
    ).toBe(true);
  });

  it("returns false for plugin filter with non-empty value", () => {
    expect(
      pluginFilterFn.autoRemove!(filter("contains", "test"), {} as never)
    ).toBe(false);
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe("pluginFilterFn - edge cases", () => {
  it("returns false for unknown operator", () => {
    const row = createMockRow({ name: "John" });
    expect(
      pluginFilterFn(
        row,
        "name",
        { operator: "unknown_operator" as never, value: "test" },
        () => {}
      )
    ).toBe(false);
  });

  it("handles boolean cell values", () => {
    const row = createMockRow({ active: true });
    expect(
      pluginFilterFn(row, "active", filter("contains", "true"), () => {})
    ).toBe(true);
  });

  it("handles object cell values (converts to string)", () => {
    const row = createMockRow({ data: { nested: "value" } });
    expect(
      pluginFilterFn(row, "data", filter("contains", "object"), () => {})
    ).toBe(true);
  });
});
