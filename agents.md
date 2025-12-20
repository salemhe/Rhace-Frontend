# Agent Rules for Cursor

## Code Style & Conventions

### General Principles

- Write clean, maintainable, and well-documented code
- Follow DRY (Don't Repeat Yourself) principles
- Prioritize readability over cleverness
- Use meaningful variable and function names

## Architecture Patterns

### App Router Organization

- Keep `app/` directory **clean and minimal** - only routes, layouts, and route handlers
- Use route groups `(group-name)` for organization without affecting URL structure
- Use `loading.tsx` for loading states and `error.tsx` for error boundaries

### Component Structure

- Keep components small and focused on a single responsibility
- Extract complex logic into custom hooks
- Use composition over prop drilling
- Prefer colocation over abstraction

### Environment Variables

- **CRITICAL**: Never import from `.env` directly!
- Always use a centralized `clientConfig.ts` file to access public .env varabiels and other public global variables. Import this file where needed in the client.
- Always use a centralized `serverConfig.ts` file to access private .env varabiels and other private global variables. Import this file where needed in the server.

### Error Handling

- Provide meaningful error messages to users
- Never expose sensitive error details to the client
- Handle the error with a toast or an error message displayed at the correct location
- Use error boundaries for unexpected errors

## Documentation Standards

### Code Comments

- Use comments for complex logic and algorithms to explain "why", not "what".
- Keep comments up-to-date with code changes

## AI Agent Directives

### When Writing Code

1. **Understand before implementing**: Ask clarifying questions if requirements are unclear
2. **Show your work**: Explain key decisions and trade-offs, always give a 5-10 bullet points summary of the changes.
3. **Consider existing patterns**: Look at similar code in the project before implementing
4. **Think about edge cases**: Consider error states, empty states, loading states
5. **Security first**: Never introduce security vulnerabilities (SQL injection, XSS, etc.)
6. **Less is more**: Write pure, minimal and functional code.

### When Refactoring

1. Preserve existing functionality unless explicitly asked to change it
2. Make incremental changes when possible
3. Update related documentation

### When Debugging

1. Identify the root cause, not just symptoms
2. Check recent changes that might have introduced the issue
3. Look for similar issues elsewhere in the codebase

### When Reviewing Code

1. Check for adherence to project conventions
2. Identify potential bugs or edge cases
3. Suggest performance improvements where relevant
4. Recommend better patterns when appropriate

### Before Adding New Dependencies

1. Check if functionality already exists in the stack
2. Consider if it can be implemented with existing tools
3. Verify the package is actively maintained (recent updates, good GitHub activity)
4. Check bundle size impact for client-side dependencies
5. Prefer packages with TypeScript support
6. Document the reason for adding the dependency

### Questions to Ask Before Starting

When assigned a task, consider asking:

1. What is the expected behavior or outcome?
2. Are there any constraints or requirements I should know about?
3. Should this follow any existing patterns in the codebase?
4. Are there any performance or security considerations?

## Security Guidelines

### Input Validation

- Always validate and sanitize user input in server actions
- Never trust client-side validation alone
- Sanitize data before database insertion

### Common Vulnerabilities to Avoid

- SQL Injection: Use parameterized queries (Supabase handles this)
- XSS: Never use `dangerouslySetInnerHTML` without sanitization
- CSRF: Leverage Next.js built-in protections
- Exposed API Keys: Use environment variables properly
- Insecure Direct Object References: Always verify ownership
- Mass Assignment: Explicitly define allowed fields in updates

## Accessibility

### Semantic HTML

- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Use semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Use `<button>` for actions, `<a>` for navigation
- Add `aria-label` or `aria-labelledby` when needed

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Test with Tab, Enter, Space, and Arrow keys
- Use `:focus-visible` for focus styles
- Don't remove focus outlines without providing alternatives

### Color & Contrast

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Don't rely solely on color to convey information

---

**Remember:** These rules are guidelines to help maintain code quality and consistency. When in doubt, ask for clarification or discuss trade-offs before proceeding.