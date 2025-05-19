
// This file serves as a compatibility layer to avoid breaking changes
// All functionality is now organized in the task/ directory
// Long-term plan: Migrate all imports to use the new module structure

// Re-export everything from the new task service modules
export * from './task';
