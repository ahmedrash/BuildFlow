# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-24

### Added
- **Motion Engine (GSAP)**: High-performance animations using GSAP and ScrollTrigger.
- **Visual Animation Controls**: Granular control over Duration, Delay, Easing, and Trigger.
- **Targeted Animations**: Option to animate the container itself or its direct children with automatic staggering.
- **Global Components**: "Master-Instance" system allowing shared components across multiple pages with a single edit point.
- **Button Icons**: Added support for Left and Right icons in the Button component using Lucide.
- **Smart Forms**: Granular form building with individual Input, Textarea, Select, Radio, and Checkbox components.
- **Mega Menus**: Integrated mega-menu support targeting existing container IDs.
- **Layers Panel**: New tree-view sidebar for advanced element management and drag-and-drop reordering.
- **Professional Templates**: All-new "Nebula SaaS", "Aura Design Agency", and "Minimalist Portfolio" presets.

### Changed
- **Properties Panel Overhaul**: Split tabs for "Content", "Element Style", and "Container Style" to resolve styling conflicts.
- **Registry Pattern**: Moved all core components to a modular registration system for easier extension.
- **Tailwind JIT Integration**: Improved autocomplete and performance for custom utility classes in the editor.

### Fixed
- Fixed ID collision issues when duplicating complex nested elements.
- Fixed FOUC (Flash of Unstyled Content) in the editor preview frame.
- Resolved Z-index stacking issues with the sticky navbar and popups.
- Corrected ScrollTrigger refresh logic during dynamic element insertion.

### Removed
- Deprecated the monolithic form component in favor of the new Smart Form system.

---
*BuildFlow v1.1.0 is a milestone release focusing on production-grade design capabilities.*