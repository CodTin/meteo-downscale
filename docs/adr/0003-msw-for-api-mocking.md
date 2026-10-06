# MSW for API Mocking

We chose **MSW (Mock Service Worker)** for network-level API interception that works uniformly across dev, test, and Storybook environments. MSW v3.0 with improved tree-shaking operates at the Service Worker level, making it client-agnostic (works with fetch, axios, or any HTTP client). This eliminates the need for library-specific mocks and ensures test scenarios match real network behavior, reducing false positives from mocking at the wrong layer.
