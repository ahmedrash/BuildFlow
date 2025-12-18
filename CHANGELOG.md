# Changelog

All notable changes to this project will be documented in this file.

## [1.0.16] - 2025-02-15

### Fixed
- **htmlExporter**: Resolved a critical issue where mega menu sections were rendered twice—once in the main page flow and once inside the dropdown. They are now correctly hidden from the standard document flow.
- **htmlExporter**: Fixed `Uncaught SyntaxError: Unexpected end of input` caused by unescaped backticks and template literals within the generated script tags.
- **GSAP Animations**: Fixed ScrollTrigger functionality in exported HTML. The export now correctly handles:
    - Plugin registration within the standalone environment.
    - CSS specificity issues where `.gsap-reveal` would permanently hide elements if GSAP was slow to initialize.
    - Escaping interpolation characters for Babel standalone.
- **Layout**: Fixed `display: contents` behavior on animated containers which was preventing some child animations from triggering.

### Improved
- **Animation Reliability**: Added an aggressive ScrollTrigger refresh schedule (100ms, 500ms, 1s, 2s, 4s) in both the editor and exported HTML to ensure animations calculate correct positions after images and fonts load.
- **Portal Logic**: Refined the popup and mega menu scanning logic to recursively detect all hidden targets, ensuring a cleaner initial page load.
- **CSS**: Added `!important` flags to initial visibility states in the exporter to ensure consistent "reveal" behavior across different browser engines.
