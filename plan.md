- [x] **Remove subject dropdown from ContactForm.vue**

  - Complexity: 3
  - Description: Modify `components/ContactForm.vue` to remove the subject dropdown, and instead, only display a single input field for the subject. This will involve updating the `formData` structure, `isValid` computed property, and the `handleSubmit` function.

- [ ] **Port Upcoming Works to Constants** (Complexity: 4)
  - **Description**: Move the hardcoded upcoming works data from `components/RecentAndUpcoming.vue` into `content/general/options.md` and then retrieve it using `useConstants`.
  - **Steps**:
    - [ ] Add `homepage.recentAndUpcoming.upcomingWorks` to `content/general/options.md` with the existing mock data.
    - [ ] Modify `components/RecentAndUpcoming.vue` to fetch upcoming works from `constants` instead of using the hardcoded array.
