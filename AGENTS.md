<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<comet-ambient-resume>
<!-- Managed by Comet. Edits inside this block may be replaced by comet init/update. -->
<!-- Contract: comet.resume_probe.v2 -->

## Comet Ambient Resume

In this repository, before starting work that may need code changes or investigation, pass the current user request to the read-only probe when a Comet workflow may already be active: `comet resume-probe . --stdin --json`.

- If the user explicitly invokes any Comet Skill through the host (for example, `@comet`, `/comet`, `@comet-native`, or `/comet-hotfix`), that explicit invocation takes precedence over this resume protocol; do not run the resume probe, and enter the invoked Skill directly.
- If the user explicitly invokes a non-Comet skill or slash command through the host, the task intent is already explicit in that invocation: do not run the resume probe, and execute the invoked skill directly.
- If you are already inside a Comet flow (including while waiting for the user to answer a question you asked in that flow), do not run the resume probe; treat replies such as option picks as continuation of the current change and proceed directly with the chosen option.
- Trust only the returned `workflow`, `skill`, and `entrySource`; project configuration or the no-config compatibility fallback alone selects them. Do not scan or switch to the other workflow.
- If the probe returns `auto_resume`, briefly state the selected active change and enter the permanent entry in `nextCommand`. Do not treat a state command as the resume entry or advance it blindly.
- If the probe returns `ask_user`, ask one short question and wait.
- If the current request did not explicitly invoke a Comet Skill and the probe returns `out_of_scope` or `none`, do not enter the Comet workflow.
- An `out_of_scope` or `none` result only means do not enter the Comet workflow for this new request; it never pauses or exits a Comet flow that is already in progress.
- If configuration or state is invalid and `nextCommand` is absent, stop and report the reason; do not guess another workflow.
- Never attach unrelated work merely because an active change exists. The Native entry inspects uncommitted work; the probe does not attribute it automatically.

</comet-ambient-resume>

## Agent skills

### Issue tracker

Before creating, finding, reading, or updating repository issues, read
`docs/agents/issue-tracker.md` for the Linear project and CLI workflow.

@RTK.md

# Harness routing rules

## Route to /comet
- New features, larger bugfixes, refactors, cross-file / cross-module changes
- Anything that needs shaping, verification, or archival
- Resuming work under an existing active Comet change

## May skip /comet
- Pure Q&A, trivial single-file edits, one-line fixes,
  copy/format tweaks with no behavior contract

## Phase methods (Native)
- Shape:   grill-with-docs to align & maintain GLOSSARY.md
           -> to-spec -> to-tickets
- Build:   implement / implement-spec, driving tdd at agreed seams
- Verify:  code-review (standards + spec)
- Archive: pr for the PR body, retro for follow-ups

## Boundaries
- New changes in this project must go through /comet (or /comet-native);
  do not bypass the state machine
- Wait for the user only at decision points the current workflow
  or continuation explicitly requires; do not invent extra confirmations
- Prefer codegraph_explore over per-file grep; subagents and non-MCP
  chains use the CLI: codegraph explore "query"
- When CodeGraph misses, or docs/config are unindexed or the index is
  stale, read the files directly
- After running a command, if you need the full output read the RTK log
  (rtk recall <id>) — do not rerun the command
- Keep full language in durable artifacts: spec, tickets, verification
  report, commit message, PR description (only chat output may be compacted)
- On session start, run `comet resume-probe` before touching
  active-workflow work
