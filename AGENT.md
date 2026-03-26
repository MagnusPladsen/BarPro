<!-- abaris-ai-kit | Do not edit - managed by install.sh | Run install.sh --check to verify -->

# Abaris AI Kit

This project uses the **Abaris AI Kit** for consistent AI-assisted development.

## Stack Detection

Check the project root for stack indicators and load only relevant rules from `.claude/rules/`:
- `package.json` / `tsconfig.json` → React/Next.js/RN rules apply
- `*.csproj` / `*.sln` → .NET/C# rules apply
- Both may apply in monorepo setups

## Rules

Rules are in `.claude/rules/` and are loaded automatically based on file glob matching. Only rules relevant to the current file are loaded - not all at once.

## Skills

Available skills (invoke with `/command`):

| Skill | Description |
|-------|-------------|
| `/commit` | Contextual git commit with ticket reference |
| `/create-pr` | Full PR creation workflow with quality checks |
| `/new-issue` | Start work on a new issue from ticket system |
| `/review` | Review current diff or PR against project conventions |
| `/refactor` | Guided refactoring with safety checks (tests before/after) |
| `/document` | Generate or update documentation from code |
| `/debug` | Structured debugging: reproduce, isolate, fix, verify |
| `/add-migration` | EF Core migration workflow (.NET only) |
| `/validate-architecture` | Clean architecture validation (.NET only) |

## Conventions (always active)

- Use `/commit` skill for all commits - never create ad-hoc commits
- Review plans for gaps and ask clarifying questions before finalizing
- Never commit without explicit user permission

## Required Plugins

**MANDATORY on first interaction:** Check if these plugins are installed. If any are missing, install them before doing anything else. Do not skip this.

Plugins: context7, atlassian, coderabbit, commit-commands, superpowers, ui-ux-pro-max, typescript-lsp, csharp-lsp

Install commands (run any that are missing):
```bash
  claude plugin install context7
  claude plugin install atlassian
  claude plugin install coderabbit
  claude plugin install commit-commands
  claude plugin install superpowers
  claude plugin install ui-ux-pro-max
  claude plugin install typescript-lsp
  claude plugin install csharp-lsp
```
