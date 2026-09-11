---
name: after-action-review
description: "Use this skill immediately when the user points out an error, inconsistency, missing deliverable, or after completing a complex multi-step task. Performs a structured After Action Review (AAR) to learn from mistakes, fix them, and prevent recurrence. Do not use empty apologies."
triggers:
  - user
  - model
---

# After Action Review (AAR)

This skill is a structured learning loop. When something goes wrong or a complex task ends, run through these four questions.

## When to Use

Activate this skill when:
- The user reports an error, inconsistency, or missing deliverable
- The user says "you missed", "you forgot", "you were wrong", or similar
- A task with multiple sub-tasks completes
- Subagents produced incomplete or incorrect results
- You detect a mistake before the user does

## The Four Questions

### 1. Intención — What was supposed to happen?

State the original plan or user request in one sentence.
- What was the expected deliverable?
- What was the expected order or dependency?
- What guardrails were supposed to be followed?

### 2. Realidad — What actually happened?

Describe the facts. No excuses.
- What was actually delivered or done?
- What was missed, skipped, or done incorrectly?
- Which specific files, commands, or assumptions were wrong?

### 3. Causalidad — Why did it happen?

Find the root cause. Be specific.
- Which verification step was skipped?
- Which assumption was wrong?
- Which project-quality-guardrails rule was not followed?
- Was a subagent instruction unclear?
- Was the task list incomplete?

### 4. Acción — What will we do differently?

Propose concrete fixes and preventive updates.
- **Immediate fix**: what you will do now to correct the error
- **Verification step**: what you will check before declaring the next task complete
- **Guardrail update**: whether AGENTS.md, project-quality-guardrails, or this AAR skill needs updating
- **Process change**: how the same mistake will be avoided in the future

## Output Format

Respond with this exact structure:

```
## After Action Review

### 1. Intención
[Original expected outcome]

### 2. Realidad
[What actually happened]

### 3. Causalidad
[Root cause]

### 4. Acción
- **Fix now**: [concrete action]
- **Preventive update**: [file or skill to update]
- **Verification before completion**: [checklist]
```

## Rules

1. **Do not use empty apologies.** Phrases like "Tienes razón", "me equivoqué", "lo siento" are not useful. Replace them with the AAR structure.
2. **Focus on the process, not the person.** Use first person only to describe the action, not to apologize.
3. **Update the guardrails.** If a mistake is due to a missing guardrail, update `project-quality-guardrails` or `AGENTS.md`.
4. **Propose the fix immediately.** After the AAR, execute the fix or ask for confirmation to proceed.
5. **No repeated loops.** If the same AAR root cause appears twice, escalate by updating the guardrails instead of just doing another AAR.

## Example

**User says**: "You tried to create a folder that already exists."

**Bad response**:
> "Tienes razón, me equivoqué."

**Good AAR response**:
> ## After Action Review
> ### 1. Intención
> Create the required directory if it did not exist.
> ### 2. Realidad
> I assumed the directory did not exist and attempted to create it without using `find_file_by_name` first.
> ### 3. Causalidad
> I did not follow the guardrail "Verify before acting". The check `find_file_by_name` was skipped.
> ### 4. Acción
> - **Fix now**: Cancel the directory creation and verify the existing structure.
> - **Preventive update**: Add an explicit check to `project-quality-guardrails` for directory creation.
> - **Verification before completion**: Run `find_file_by_name` before any `mkdir` or `write` operation.
