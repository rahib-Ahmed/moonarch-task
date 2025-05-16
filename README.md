# Moonarch Dashboard

A modern dashboard application for visualizing population data across different states and years. This project was built as part of a take-home assignment using React, TypeScript, Redux Toolkit, and Recharts.

## Features

- Interactive dashboard with real-time data visualization
- Multiple chart types (bar, line, pie, heatmap) for data analysis
- Ability to add and remove charts dynamically
- Filters for selecting different states and years
- Responsive design for all screen sizes
- Data fetching from the DataUSA API

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **ESLint & Prettier** for code quality

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/rahib-Ahmed/moonarch-task.git>
   cd moonarch-task
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you prefer pnpm
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`

## Project Structure

- `/src` - Source code
  - `/assets` - Static assets
  - `/components` - Reusable components
  - `/context` - React context providers
  - `/hooks` - Custom React hooks
  - `/pages` - Application pages
  - `/store` - Redux store, slices, and API queries
  - `/types` - TypeScript type definitions
  - `/ui` - UI components (buttons, charts, filters, etc)
  - `/utils` - Utility functions

## Data Visualization

The charts in this application were created using Recharts. The custom chart components in the `/ui/Charts` and `/ui/Filter` directory were developed with the assistance of Claude Pro AI to ensure high-quality, reusable visualization components.

### Prompt used for chart development:

```
You are an experienced React developer tasked with creating a reusable, responsive filter dropdown component using React, Tailwind CSS 4.1, and Lucide icons. This component will be used across various data visualization charts to filter data by common parameters (years, US states, gender, etc.) while maintaining a consistent design language and user experience.
Key Responsibilities
Component Architecture

Design a modular, reusable dropdown filter component that can be easily configured for different filter types
Ensure the component handles various data types (strings, numbers, dates) appropriately
Implement proper state management for selected filter values
Create clean, production-ready code with appropriate TypeScript typing

UI/UX Design

Implement a responsive design that works across all device sizes
Create smooth transitions and animations for dropdown open/close states
Ensure the component meets WCAG accessibility standards (minimum AA level)
Maintain consistent styling with the application's design system

Performance Optimization

Implement virtualization for long dropdown lists (e.g., all US states)
Optimize render cycles to prevent unnecessary re-renders
Ensure efficient DOM updates when filter selections change

Approach & Methodology
1. Component Structure

Create a base FilterDropdown component that accepts various props:

options: Array of items to display in the dropdown
value: Currently selected value(s)
onChange: Callback function when selection changes
placeholder: Text to display when no option is selected
isMulti: Boolean to allow multiple selections
isSearchable: Boolean to enable search functionality
customStyles: Object for style customization
icon: Optional Lucide icon component



2. Filter Type Implementations

Create specific filter implementations for common use cases:

YearFilter: For selecting years (single or range)
StateFilter: For selecting US states with optional grouping by region
CategoryFilter: For generic categorical data (e.g., gender, product types)
RangeFilter: For numeric ranges with optional slider interface


3. Integration with Charts

Demonstrate how to connect the filter component to different chart libraries
Implement filter state management patterns (local state, context, or Redux)
Show examples of applying filters to chart data

Specific Implementation Tasks
Base Component Implementation

Set up the base component structure with proper React hooks and state management
Implement click-outside detection for closing the dropdown
Create smooth transition animations using Tailwind's transition classes
Add keyboard navigation support for accessibility

Year Filter Implementation

Create a specialized year selector with options for:

Single year selection
Year range selection
Relative time options (Last 5 years, Last decade, etc.)


Implement calendar-style year picker for decade navigation

US State Filter Implementation

Include complete list of all 50 US states plus territories
Add option to group states by region (Northeast, Midwest, South, West)
Implement search functionality for quick state finding
Add multi-select capability with "Select All" and "Clear All" options

Responsive Design Implementation

Use Tailwind's responsive utilities to adjust dropdown width based on screen size
Implement mobile-friendly touch targets (minimum 44x44px)
Create collapsible filter groups for small screens
Ensure dropdown positioning adapts to available screen space
```

## API Integration

The application fetches data from the DataUSA API:
- Base URL: `https://fargo-app.datausa.io/api/data`
- The API provides population data across different states and years

## Available Scripts

- `npm run dev` - Start the development server


## Future Improvements

- Add more chart types
- Implement user authentication
- Add ability to save dashboard configurations
- Implement data export functionality
- Add more data sources and integration options

---

This project was created as part of a take-home assignment.
