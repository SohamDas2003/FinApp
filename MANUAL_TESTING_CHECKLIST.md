# Manual Testing Checklist for Layout and Responsiveness Refactor

## 1. Layout Consistency

*   [ ] **Dashboard Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Income Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Expenses Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Investments Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Cards Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Account Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Settings Page:** Verify uses `SharedLayout` (left sidebar, main content, right sidebar with News).
*   [ ] **Profile Setup Page:** (If applicable) Verify layout consistency (this page might have a different layout, confirm if it's intended).
*   [ ] **Login/Register Pages:** Verify they have their own distinct, centered layout, not `SharedLayout`.

## 2. Responsiveness - Overflow/Overlap & Layout Shifts

**Test on various screen widths. Use browser developer tools to simulate:**

*   **A. Desktop / Large Screens (> 1200px)**
    *   [ ] Left sidebar is visible and full width (250px).
    *   [ ] Main content area is spacious.
    *   [ ] Right sidebar (News component) is visible and full width (280px).
    *   [ ] No horizontal scrollbars.
    *   [ ] No overlapping text or UI elements.
    *   [ ] Content flows correctly, nothing cut off.

*   **B. Medium Screens / Tablets (between 1200px and 768px)**
    *   [ ] Left sidebar is visible and full width (250px).
    *   [ ] Right sidebar (News component) is hidden.
    *   [ ] Main content area expands to fill the space previously occupied by the right sidebar.
    *   [ ] No horizontal scrollbars.
    *   [ ] No overlapping text or UI elements.
    *   [ ] Content flows correctly, nothing cut off.

*   **C. Small Tablets / Large Phones (between 768px and 576px)**
    *   [ ] Left sidebar collapses to icon-only (60px).
    *   [ ] Main content area is displayed below the (now effectively horizontal) collapsed sidebar due to `flex-direction: column` on the container.
    *   [ ] Right sidebar remains hidden.
    *   [ ] No horizontal scrollbars.
    *   [ ] No overlapping text or UI elements (especially between collapsed sidebar items and main content).
    *   [ ] Content flows correctly, nothing cut off.

*   **D. Small Phones (< 576px)**
    *   [ ] Left sidebar transforms into a top bar (full width, `height: auto`).
        *   [ ] "FinApp" logo/header is visible on the left.
        *   [ ] Menu items are displayed horizontally.
        *   [ ] Logout button is displayed appropriately within the top bar.
    *   [ ] Main content area is displayed below the top bar.
    *   [ ] Right sidebar remains hidden.
    *   [ ] No horizontal scrollbars.
    *   [ ] No overlapping text or UI elements.
    *   [ ] Content flows correctly, nothing cut off.

## 3. Orientation Changes (Simulate if possible, or by resizing viewport)

*   [ ] **Portrait to Landscape (and vice-versa) on tablet-like widths:**
    *   [ ] Layout adapts smoothly without breaking.
    *   [ ] Sidebar and content visibility rules are correctly applied based on the new width.
*   [ ] **Portrait to Landscape (and vice-versa) on phone-like widths:**
    *   [ ] Layout adapts smoothly without breaking.
    *   [ ] Top bar (at <576px) or collapsed sidebar (at <768px) behaves as expected.

## 4. Rounded Corners (Visual Inspection)

*   [ ] **Buttons:** Check various buttons across the application (e.g., Add Investment, form submission buttons, settings buttons). Expected: `var(--border-radius-small)`.
*   [ ] **Input Fields:** Check text inputs, select dropdowns in forms (Login, Register, Profile Setup, Settings, Investment form). Expected: `var(--border-radius-small)`.
*   [ ] **Cards/Containers:**
    *   [ ] `.dashboard-card` elements. Expected: `var(--border-radius-medium)`.
    *   [ ] `.content-section`. Expected: `var(--border-radius-large)`.
    *   [ ] `.news-container` (in right sidebar). Expected: `var(--border-radius-medium)`.
    *   [ ] `.goal-card`. Expected: `var(--border-radius-large)`.
    *   [ ] `.quote-container`. Expected: `var(--border-radius-medium)`.
    *   [ ] Settings page navigation and content panes. Expected: `var(--border-radius-medium)`.
    *   [ ] `.card-item` (in Cards page). Expected: `var(--border-radius-medium)`.
    *   [ ] `.financial-card` (in Cards page). Expected: `var(--border-radius-large)`.
    *   [ ] `.info-box` (in Cards page). Expected: `var(--border-radius-medium)`.
    *   [ ] `.feature-card` (in Settings). Expected: `var(--border-radius-large)`.
    *   [ ] `.auth-card` (Login/Register). Expected: `var(--border-radius-medium)`.
    *   [ ] `.auth-error` message box. Expected: `var(--border-radius-small)`.
    *   [ ] `.news-card` (in News page/component). Expected: `var(--border-radius-large)`.
*   [ ] **Pill Shapes:**
    *   [ ] `.goal-category` badge. Expected: `20px` (retained specific value).
    *   [ ] `.tab` in `News.css`. Expected: `20px` (retained specific value).
    *   [ ] `.toggle-slider` (for feature toggles). Expected: `34px` (retained specific value).
*   [ ] **Circular Elements:**
    *   [ ] `.profile-image`. Expected: `50%`.
    *   [ ] `.photo-action-button` (Settings). Expected: `50%`.
    *   [ ] `.health-score-circle` (Dashboard). Expected: `50%`.
    *   [ ] `.milestone` (Goals). Expected: `50%`.
    *   [ ] `.edit-button`, `.delete-button` (Goals). Expected: `50%`.
    *   [ ] `.card-action-button` (Cards page). Expected: `50%`.

## 5. Functionality

*   **Navigation:**
    *   [ ] Clicking all items in the left sidebar (or top bar on small screens) navigates to the correct page.
    *   [ ] Active page is correctly highlighted in the sidebar/top bar.
    *   [ ] Logout button functions correctly.
*   **Common Interactive Elements:**
    *   [ ] Forms can be filled and submitted (e.g., Login, Register, Add Investment, Settings changes).
    *   [ ] Buttons trigger expected actions (e.g., Add, Save, Cancel, Delete).
    *   [ ] Modals or pop-ups (if any were affected by layout changes) display correctly.
*   **News Component:**
    *   [ ] If visible (screens >1200px), News component loads articles.
    *   [ ] Articles are displayed correctly.
    *   [ ] Links within news items are clickable.
*   **Investments Page:**
    *   [ ] Page loads correctly within the new `SharedLayout`.
    *   [ ] All charts and data tables are displayed correctly.
    *   [ ] "Add Investment" form works.
*   **Settings Page:**
    *   [ ] Navigation between settings sections works.
    *   [ ] Forms within settings sections are functional.
*   **Cards Page:**
    *   [ ] Tabs for "My Cards" and "Add New Card" work.
    *   [ ] Existing cards are displayed correctly.
    *   [ ] Add new card form functions as expected.

## 6. Specific Regression Checks

*   [ ] **Sticky Positioning:**
    *   [ ] Left sidebar remains sticky on scroll (on screens >768px).
    *   [ ] Right sidebar remains sticky on scroll (on screens >1200px).
*   [ ] **No Unintended Horizontal Scrolling:** Confirm this on all pages and at all specified breakpoints.
*   [ ] **Text Truncation/Wrapping:** Check for places where text might overflow its container (e.g., long investment names, goal names, news headlines) and ensure it's handled gracefully (e.g., ellipsis, wrapping).
*   [ ] **Footer (if any):** Ensure it's correctly positioned and responsive. (Currently, no explicit footer seems to be part of `SharedLayout`).
*   [ ] **Console Errors:** Open browser developer tools and check for any new JavaScript errors or warnings related to layout or component rendering.
*   [ ] **Z-index issues:** Check for any elements that might be incorrectly layered, especially with sticky/fixed elements or modals.
