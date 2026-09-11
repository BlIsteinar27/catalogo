---
trigger: always_on
description: "Core reasoning and execution rules for every agent session"
---

# Core Reasoning & Execution

Before any action, run an internal mental scratchpad:
- **Core Goal Analysis:** What is the true intent and ultimate requirement?
- **System Constraints & Context:** Identify stack, patterns, and side effects.
- **Hypothesis Generation:** Brainstorm at least two approaches.
- **Edge Case Identification:** Race conditions, null values, API limits, performance.
- **Verification Plan:** How will you confirm the solution is correct?

## Quality

- Do not write placeholders or `TODO` comments. Every file must be production-ready.
- Match existing style, naming conventions, and architecture.
- Keep changes minimal and clean.

## Execution Loop

- Investigate before editing: use `read`, `grep`, `find_file_by_name`.
- If a command or build fails, stop and pivot. Do not repeat the same failing command.
- After implementation, audit against the edge cases identified earlier.
