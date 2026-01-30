# AI Copilot Instructions: AI Prototypes

## Project Overview

This is a **GOV.UK Prototype Kit** project demonstrating multiple AI-powered proof-of-concepts for the Crown Prosecution Service. It's a rapid prototyping environment for exploring UX solutions for legal/prosecution workflows—not production code.

**Key Characteristics:**
- Built on GOV.UK Prototype Kit v13+ (Express.js-based prototyping framework)
- Multiple prototype experiments (Case Graph, Correspondence Drafter) in a single codebase
- Designed for design/UX validation, not backend integration
- Uses Nunjucks templating, vanilla JavaScript components, and SCSS

### Before Starting

> **Have you read the `ai-context.md` file? Confirm you understand the GOV.UK Prototype Kit conventions before we start.**

The `app/assets/ai-context.md` file contains essential guidelines for GOV.UK compliance, accessibility, content design, and coding standards. Review it for comprehensive conventions before beginning work.

## Architecture

### Directory Structure
```
app/
  ├── config.json           # Kit configuration (service name, plugins)
  ├── routes.js             # Express routes (add prototyping logic here)
  ├── filters.js            # Nunjucks custom filters
  ├── data/                 # Session data defaults (session-data-defaults.js)
  ├── views/
  │   ├── index.html        # Main landing page (task list overview)
  │   ├── layouts/          # Layout templates (overview.html inherits from govuk-branded)
  │   ├── _includes/        # Reusable includes (footer, navigation, breadcrumbs)
  │   ├── _components/      # Custom components (button-menu, identity-bar, filters)
  │   ├── case-graph/       # Case summary prototype (v1, v2 versions)
  │   └── correspondence-drafter/  # Letter editor prototype (v1)
  └── assets/
      ├── javascripts/
      │   ├── application.js         # Main app initialization
      │   ├── correspondence-drafter.js  # Letter-specific logic
      │   └── components/            # Reusable JS modules (ButtonMenu, ListFilter, etc.)
      └── sass/
          ├── application.scss        # Main stylesheet
          └── components/             # Component-specific SCSS
```

### Key Design Patterns

**Template Inheritance:**
- All content pages extend `layouts/overview.html` → `layouts/govuk-branded.njk`
- Use `{% block content %}` and `{% block beforeContent %}` for page-specific content
- Import components via Nunjucks macros: `{% from "_components/X/macro.njk" import appX %}`

**Component Architecture:**
- Custom components in `_components/*/` have both `macro.njk` (interface) and `template.njk` (implementation)
- JavaScript components (e.g., `App.ButtonMenu`) follow constructor + prototype pattern
- Components initialize on DOM ready (see `correspondence-drafter.js` for example)

**Styling:**
- SCSS uses GOV.UK Design System functions: `govuk-spacing()`, `govuk-colour()`, `govuk-font()`
- Component SCSS imported in `application.scss` (no automatic resolution)
- Media queries use `@include govuk-media-query($from: tablet)` pattern

**Data Flow:**
- `session-data-defaults.js` exports prototype session data structure
- Nunjucks can access session data in templates via `{{ variableName }}`
- Routes in `routes.js` can modify session data for form simulations

## Development Workflow

### Running the Prototype

```bash
npm install                  # Install GOV.UK Prototype Kit dependencies
npm run dev                  # Start dev server with auto-reload (localhost:3000)
npm run serve              # Production-like server (no auto-reload)
```

**Key Points:**
- Dev server watches `/app` directory and reloads on changes
- Routes, views, and static assets reload automatically
- Session data persists until page refresh

### Adding a New Page
1. Create `app/views/my-feature/index.html`
2. Extend `layouts/overview.html` and set `{% set pageName = "..." %}`
3. Add block content within `govuk-grid-row`
4. Link from landing page (`app/views/index.html`) in task list

### Creating a Custom Component
1. Create `app/views/_components/my-component/` directory
2. Add `macro.njk` (exports macro with params) and `template.njk` (renders HTML)
3. Example pattern (see `button-menu/`):
   ```nunjucks
   {# macro.njk #}
   {% macro appMyComponent(params) %}
     {%- include "./template.njk" -%}
   {% endmacro %}
   ```
4. Import in layouts: `{% from "_components/my-component/macro.njk" import appMyComponent %}`

### Adding JavaScript Interaction
1. Create module in `app/assets/javascripts/components/my-component.js`
2. Use constructor + prototype pattern: `App.MyComponent = function(params) { ... }`
3. Initialize in layout's `{% block pageScripts %}` (see `overview.html`)
4. Initialize on DOM ready: `App.myComponent = new App.MyComponent({ ... })`

## Prototype-Specific Knowledge

### Case Graph (`/case-graph`)
- **Purpose:** Summarize case details and surface relevant legal/policy info
- **Versions:** v1 (baseline), v2 (user-segmented: advocates + reviewing lawyers)
- **Key Files:** `layouts/case-graph/main.html`, `_includes/case-graph/`
- **Status:** Active exploration (as of Jan 26, 2026)

### Correspondence Drafter (`/correspondence-drafter`)
- **Purpose:** Letter composition tool with character/word counts and save timestamps
- **Version:** v1 only (replica of live system)
- **Key Logic:** `correspondence-drafter.js` (DOM manipulation, save indicator updates)
- **Features:** Real-time character count, "last saved" timestamp, contenteditable integration
- **Status:** Incomplete


## Important Conventions

1. **GOV.UK Design System First:** Always use GOV.UK components (buttons, form inputs, etc.) via `govuk-frontend` library—avoid custom HTML
2. **Accessibility:** Components must maintain ARIA roles/attributes (see `ButtonMenu` for `role="menu"`, `aria-expanded`)
3. **No Backend Persistence:** Session data is in-memory; use `app/data/session-data-defaults.js` for seed data, not a database
4. **Responsive First:** Use GOV.UK media queries (`@include govuk-media-query($from: tablet)`)
5. **Don't Modify Core Kit:** Leave `/node_modules/govuk-prototype-kit` and `/node_modules/govuk-frontend` untouched—configure via `app/config.json`
6. **No emojis or non-standard icons:** Do not use emojis or icons in headings, navigation, or content. Follow GOV.UK Design System and content guidelines as set out in `app/assets/ai-context.md`.

## External Dependencies

- **govuk-prototype-kit:** Rapid prototyping framework (Express.js wrapper)
- **govuk-frontend:** Official GOV.UK Design System components
- **@govuk-prototype-kit/task-list:** Task list pattern component
- **@govuk-prototype-kit/step-by-step:** Guided process component
- See `package.json` for exact versions

## Testing & Debugging

- **Prototype Kit Docs:** https://prototype-kit.service.gov.uk/docs/
- **GOV.UK Design System:** https://design-system.service.gov.uk/
- **Browser Console:** Check for JavaScript initialization errors (search for `console.log` calls)
- **Session Inspector:** Prototype Kit includes `/manage-prototype-data` for debugging session state

## Common Tasks

| Task | How To | File(s) |
|------|--------|---------|
| Add a new page to navigation | Update task list in `index.html` | `app/views/index.html` |
| Create a filterable list | Use `App.ListFilter` component | `assets/javascripts/components/list-filter.js` |
| Add custom styling to a component | Import in `application.scss` | `app/assets/sass/components/` |
| Modify page layout | Extend `layouts/overview.html` | `app/views/layouts/overview.html` |
| Store form answers across pages | Populate `app/data/session-data-defaults.js` | `app/data/session-data-defaults.js` |
