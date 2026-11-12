# Claude SEO agent integration for Docvelio

**Upstream:** [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)  
**Upstream version inspected:** 2.6.0  
**Upstream licence:** MIT; see [CLAUDE-SEO-LICENSE](./CLAUDE-SEO-LICENSE).

## What was integrated

The 19 upstream specialist agent definitions have been copied into `.claude/agents/` so Claude Code can discover them as project subagents. The repository-root `AGENTS.md` provides project-wide instructions for compatible coding agents and prevents the upstream playbooks from assuming a runtime that Docvelio does not have.

The specialist set covers:
- Technical SEO, sitemap architecture and schema markup.
- Performance and visual QA.
- AI search/GEO and agent readiness.
- Content quality, topic clusters and search experience.
- SEO drift/change monitoring.
- Google data, backlinks and optional DataForSEO.
- E-commerce, local SEO, maps and image generation.

## Important scope limitation

This is an **agent-instruction integration**, not installation of the complete upstream Claude SEO plugin. The upstream repository also contains a managed Python runtime, 26 skills, 63 scripts, optional MCP integrations, reference data and extension dependencies. Those components were not copied or enabled. Several upstream agents refer to those helper scripts; the Docvelio root `AGENTS.md` explicitly instructs agents not to assume those commands exist and to use Docvelio's current build, scripts and workflows instead.

The agent definitions do not run continuously on the public website and do not themselves change Google Search Console, Cloudflare, DNS, backlinks or rankings. They are available to a compatible coding assistant working in this repository.

## Existing Docvelio systems retained

No public website page, shared header/footer, cookie banner, analytics integration, robots policy, sitemap, Cloudflare configuration or deployment workflow was intentionally changed as part of this agent import. Existing SEO scripts and scheduled workflows remain the source of executable checks until a separate, evidence-led implementation adds or improves them.

## Recommended use

Start with a read-only full audit, then review the evidence and prioritised actions before authorising code changes. For each fix, run the production build and relevant existing tests. Verify the live site and GitHub Actions separately; a commit is not proof of deployment or indexing.

## Attribution

The 19 agent definitions are derived from AgriciDaniel's Claude SEO project and are retained under its MIT licence. Upstream source: https://github.com/AgriciDaniel/claude-seo