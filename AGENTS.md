# Agent Guidelines for PIMS App

This document provides guidelines for AI agents working on this codebase.

## Project Overview

PIMS (Procurement Information Management System) is a Next.js 16 application with Mantine UI v8 used by LGUs (Local Government Units) for procurement management. The app uses TypeScript, SWR for data fetching, and Axios for API calls.

---

## Build, Lint, and Test Commands

### Available Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start development server (Turbopack enabled) |
| `npm run format` | Run Prettier to format code                  |
| `npm run build`  | Create optimized production build            |
| `npm run start`  | Run production server                        |

### Running a Single Test

This project does not currently have a test framework configured. If tests are added later:

```bash
# Jest (if added)
npm run test -- --testPathPattern="component-name"

# Vitest (if added)
npm run test component-name
```

### Port Configuration

If port 3000 is in use, specify a different port:

```bash
npm run dev -- -p 3001
```

---

## Required Workflow for Code Changes

**ALWAYS run these commands in order after making ANY code changes:**

```bash
npm run format && npm run lint && npm run build
```

1. **Format first** (`npm run format`) - Ensures consistent code style
2. **Lint second** (`npm run lint`) - Checks for code quality issues
3. **Build last** (`npm run build`) - Verifies TypeScript compiles without errors

If any step fails, fix the errors before proceeding. Do not commit code that fails any of these steps.

---

## Known Issues

### baseline-browser-mapping Warning

When running `npm run dev`, you may see this warning:

```
[baseline-browser-mapping] The data in this module is over two months old.
```

This is a known issue with the `baseline-browser-mapping` package (v2.10.0). The warning is incorrectly displayed even though the package has the latest version. This is a bug in the package itself, not in our configuration. The warning does not affect application functionality and can be safely ignored.

### GET /sw.js 404 Warning

When running `npm run dev` with Turbopack enabled, you may see:

```
GET /sw.js 404 in Xms
```

This is a known Turbopack issue related to service worker checks. It's harmless and doesn't affect development. To avoid this warning, use `npm run dev` without the `--turbopack` flag.

---

## Refactoring Guidelines

### When to Refactor

Refactor when you encounter:

- Duplicate code that can be extracted to a reusable function
- Functions that are too long (consider splitting)
- Complex nested conditionals that can be simplified
- Magic numbers/strings that should be constants
- Missing type definitions that cause `any` usage

### Don't Over-Engineer

Avoid:

- Creating abstraction layers for simple operations
- Premature optimization
- Over-generic types that add complexity without benefit
- Extracting small functions that don't improve readability
- Adding unnecessary indirection or wrapper functions
- Creating new utility files when a simple inline solution suffices

### Refactoring Principles

1. **Keep it simple** - If a straightforward solution works, use it
2. **Follow existing patterns** - Match the codebase style even if you'd do it differently
3. **Minimal changes** - Fix only what's broken, don't refactor unrelated code
4. **Type safety first** - Prefer explicit types over `any` when possible
5. **Test locally** - Run `npm run build` after refactoring to ensure nothing breaks

### Common Refactoring Patterns in This Project

```typescript
// BAD: Over-abstracted
const getData = (x) => x?.data;

// GOOD: Simple, follows existing code style
const isLoading = true;

// BAD: Unnecessary utility for simple logic
const formatStatus = (status) => status?.toUpperCase();

// GOOD: Direct inline when simple
const errorMessages = getErrors(error);

// BAD: Creating new file for one-off helper
// Instead, add to existing utils/Helpers.ts if truly reusable

// GOOD: Add explicit types instead of 'any'
interface UserProps {
  id: string;
  name: string;
}
const [user, setUser] = useState<UserProps | null>(null);
```

---

## Code Style Guidelines

### Formatting (Prettier)

Configuration in `.prettierrc`:

- **Trailing commas**: ES5
- **Semicolons**: Enabled
- **Tab width**: 2 spaces
- **Single quotes**: Enabled for JS/TS
- **JSX Single quotes**: Enabled

Always run `npm run format` before committing.

### Linting (ESLint)

Configuration in `.eslintrc.json`:

- Uses TypeScript parser for .ts/.tsx files
- **Note**: TypeScript strict rules for unused vars/expressions are disabled

Run `npm run lint` before committing.

---

## TypeScript Guidelines

### TypeScript Configuration

- **Strict mode**: Enabled in `tsconfig.json`
- **Module resolution**: Bundler
- **JSX**: react-jsx
- **Path alias**: `@/*` maps to project root

### Type Definitions

- Global types in `types/types.d.ts` - Contains all API response types matching backend pims-api models
- Component-specific types in `types/*.d.ts`
- Use explicit types for props and function returns
- Use optional properties (`?`) for nullable fields
- **NEVER use `any` type** - Always define proper types from the backend models

### API Response Formats

The backend Laravel API returns data in a consistent format:

**List endpoints (GET /api/v1/{resource})** - Returns paginated data:

```json
{
  "data": [...],
  "links": {
    "first": "http://localhost/api/v1/users?page=1",
    "last": "http://localhost/api/v1/users?page=5",
    "prev": null,
    "next": "http://localhost/api/v1/users?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 10,
    "to": 10,
    "total": 50
  }
}
```

**Single record endpoints (GET /api/v1/{resource}/{id})** - Returns a single object:

```json
{
  "data": { ...object }
}
```

When accessing pagination data, use `response.meta`:

```typescript
// CORRECT: Access pagination data from list response
const { data: listData } = useSWR(`/accounts/users`, (url) => API.get(url));
const lastPage = listData?.meta?.last_page;
const total = listData?.meta?.total;
```

When using SWR to fetch single records (e.g., for update forms), access the data as `response.data`, not `response.data.data`:

```typescript
// CORRECT: Access single record data
const { data: detailData } = useSWR(`/accounts/users/${id}`, (url) =>
  API.get(url)
);
const userData = detailData?.data;

// WRONG: This will be undefined
const wrongData = detailData?.data?.data;
```

### Backend Model Reference

All types should be derived from the Laravel backend models in `pims-api/app/Models/`. Key models include:

| Frontend Type                    | Backend Model                | File Location                                        |
| -------------------------------- | ---------------------------- | ---------------------------------------------------- |
| `UserType`                       | `User`                       | `pims-api/app/Models/User.php`                       |
| `PurchaseRequestType`            | `PurchaseRequest`            | `pims-api/app/Models/PurchaseRequest.php`            |
| `PurchaseRequestItemType`        | `PurchaseRequestItem`        | `pims-api/app/Models/PurchaseRequestItem.php`        |
| `PurchaseOrderType`              | `PurchaseOrder`              | `pims-api/app/Models/PurchaseOrder.php`              |
| `PurchaseOrderItemType`          | `PurchaseOrderItem`          | `pims-api/app/Models/PurchaseOrderItem.php`          |
| `RequestQuotationType`           | `RequestQuotation`           | `pims-api/app/Models/RequestQuotation.php`           |
| `RequestQuotationItemType`       | `RequestQuotationItem`       | `pims-api/app/Models/RequestQuotationItem.php`       |
| `AbstractQuotationType`          | `AbstractQuotation`          | `pims-api/app/Models/AbstractQuotation.php`          |
| `InspectionAcceptanceReportType` | `InspectionAcceptanceReport` | `pims-api/app/Models/InspectionAcceptanceReport.php` |
| `ObligationRequestType`          | `ObligationRequest`          | `pims-api/app/Models/ObligationRequest.php`          |
| `DisbursementVoucherType`        | `DisbursementVoucher`        | `pims-api/app/Models/DisbursementVoucher.php`        |
| `SupplierType`                   | `Supplier`                   | `pims-api/app/Models/Supplier.php`                   |
| `SignatoryType`                  | `Signatory`                  | `pims-api/app/Models/Signatory.php`                  |
| `DepartmentType`                 | `Department`                 | `pims-api/app/Models/Department.php`                 |
| `SectionType`                    | `Section`                    | `pims-api/app/Models/Section.php`                    |

### Avoiding `any` Type

**NEVER use `any`** - Always use proper TypeScript types. Here's how to handle common scenarios:

```typescript
// BAD: Using any
const [data, setData] = useState<any>(null);
const handleSubmit = (data: any) => { ... }

// GOOD: Using proper types
const [user, setUser] = useState<UserType | null>(null);
const handleSubmit = (data: PurchaseRequestType) => { ... }

// GOOD: Using unknown with type narrowing
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message);
  }
};

// GOOD: Using generic types for API responses
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// GOOD: Using Pick for partial types
type CreateUserInput = Pick<UserType, 'firstname' | 'lastname' | 'email'>;

// GOOD: Using Omit for excluding fields
type UserPublicData = Omit<UserType, 'password' | 'signature'>;
```

### Adding New Types from Backend

When adding new features that require API calls:

1. Check the backend model in `pims-api/app/Models/` for the database schema
2. Look at the model's `$fillable` array for database columns
3. Look at model's relationships (hasOne, belongsTo, hasMany) for nested objects
4. Add corresponding type in `types/types.d.ts`

Example - Adding a new type from a backend model:

```typescript
// Backend: pims-api/app/Models/Role.php
// $fillable = ['role_name', 'active', 'permissions']

// Frontend: types/types.d.ts
type RoleType = {
  id?: string;
  role_name?: string;
  active?: boolean;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
};
```

Example type pattern from codebase:

```typescript
type UserType = {
  id?: string;
  employee_id?: string;
  fullname?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  sex?: 'male' | 'female';
  department_id?: string;
  department?: DepartmentType;
  roles?: RoleType[];
  created_at?: string;
  updated_at?: string;
};
```

### Common Type Patterns

```typescript
// Status types using union types
type PurchaseRequestStatus =
  | 'draft'
  | 'pending'
  | 'approved_cash_available'
  | 'approved'
  | 'disapproved';

// Module types for permissions
type ModuleType = 'pr' | 'rfq' | 'po' | 'iar' | 'obr' | 'dv';

// Array types for list responses
type UserListResponse = {
  data: UserType[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
};
```

---

## Naming Conventions

### Files and Components

- **Components**: PascalCase (e.g., `DataTable.tsx`, `LoginForm.tsx`)
- **Utilities/Libs**: PascalCase (e.g., `API.ts`, `Helpers.ts`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.ts`)
- **Config**: PascalCase (e.g., `permissions.ts`, `menus.ts`)
- **Types**: PascalCase (e.g., `types.d.ts`)

### Variables and Functions

- **Variables**: camelCase
- **Functions**: camelCase
- **Constants**: PascalCase for class-like, SCREAMING_SNAKE_CASE for config
- **Boolean variables**: Prefix with `is`, `has`, `should`, `can`

```typescript
// Good
const isLoading = true;
const hasPermission = true;
const userData = ...;

// Component naming
const DataTableClient = () => { ... };
export default DataTableClient;
```

### CSS Classes and Mantine Props

- **Mantine props**: camelCase (`size`, `color`, `variant`)
- **CSS styles**: kebab-case in CSS, camelCase in Mantine `sx`/`style`

---

## Import Organization

### Import Order (Recommended)

1. Next.js/React built-ins
2. Third-party UI libraries (Mantine, Tabler icons)
3. Internal libs/utils
4. Internal hooks
5. Internal components
6. Type definitions
7. Config files

### Path Aliases

Use `@/` prefix for imports from project root:

```typescript
import API from '@/libs/API';
import useAuth from '@/hooks/useAuth';
import Helper from '@/utils/Helpers';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
```

### Example Import Block

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Stack } from '@mantine/core';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import useAuth from '@/hooks/useAuth';
import Helper from '@/utils/Helpers';
import CreateModal from '@/components/Generic/Modal/CreateModal';
import { API_REFRESH_INTERVAL } from '@/config/intervals';
```

---

## Component Patterns

### Client Components

All interactive components must include `'use client'` directive:

```typescript
'use client';

import React from 'react';
// ... component code
```

### Component Structure

```typescript
'use client';

import { useState } from 'react';
import { Button, Modal } from '@mantine/core';

interface ComponentProps {
  title: string;
  onSubmit: (data: PurchaseRequestType) => void;
  isLoading?: boolean;
}

const ComponentNameClient = ({
  title,
  onSubmit,
  isLoading = false,
}: ComponentProps) => {
  const [state, setState] = useState<string>('');

  const handleAction = () => {
    onSubmit(state);
  };

  return (
    <Modal opened onClose={() => {}} title={title}>
      <Button onClick={handleAction} loading={isLoading}>
        Submit
      </Button>
    </Modal>
  );
};

export default ComponentNameClient;
```

### Data Table Pattern

The codebase uses a standardized DataTable pattern with:

- Main table with collapsible sub-items
- Create/Update modals
- Pagination
- Search/filter
- Actions component

### PageHeader + PageHeaderActions Pattern

Pages can surface search/create/refresh controls inside the `PageHeader` (the colored banner at the top) instead of repeating them in the `DataTable`'s own actions bar.

**How it works:**

1. `PageHeader` (`components/Generic/PageHeader/index.tsx`) accepts an `actions` prop that renders buttons on the right side of the header banner.
2. `PageHeaderActionsClient` (`components/Generic/PageHeader/PageHeaderActions.tsx`) is a drop-in replacement for `DataTableActionsClient` styled for the white-on-color header. When a search is submitted it writes `?search=<value>` to the URL (via `useRouter`), which `DataTableClient` reads to update its internal `tableSearch` state.
3. `DataTableClient` accepts `showTableActions={false}` to hide its own duplicate actions bar when `PageHeaderActionsClient` is used instead.

**Wiring up a page (using PR page as the reference):**

```
page.tsx  (server component)
  └── MainContainerClient
        ├── actions={<PurchaseRequestPageActions />}   ← PageHeaderActionsClient lives here
        └── children={<PurchaseRequestPageContent />}  ← DataTableClient with showTableActions={false}
```

`client.tsx` exports two separate client components to keep React state out of the server component:

- **`PurchaseRequestPageActions`** — manages `search` state, renders `PageHeaderActionsClient`, syncs from `searchParams` on mount.
- **`PurchaseRequestPageContent`** — initializes `search` from `searchParams` on mount (no ongoing `searchParams` watcher — DataTable propagates search changes upward via `onChange`), renders the feature client component with `showTableActions={false}`.

**Search state flow:**

1. User types in SearchModal inside `PageHeaderActionsClient`
2. `handleSetSearch` updates local state **and** writes `?search=value` to URL
3. `DataTableClient`'s `useEffect` on `searchParams` picks up the URL param, sets `tableSearch`, then clears the URL with `router.replace(pathname)`
4. DataTable's `onChange` fires → feature client's `setSearch` → `PurchaseRequestPageContent.setSearch` → SWR re-fetches

**Key props:**

| Component                 | Prop                                | Purpose                                 |
| ------------------------- | ----------------------------------- | --------------------------------------- |
| `DataTableClient`         | `showTableActions` (default `true`) | Hide internal actions bar               |
| `MainProps`               | `showTableActions`                  | Thread the prop through feature clients |
| `PageHeaderActionsClient` | `setSearch`                         | Callback; internally also writes to URL |

### Printable Document Forms Pattern

Printable document forms (PR, RFQ, Abstract, PO, IAR, OBR, DV, ARE, ICS, RIS) follow a consistent "printed government document" aesthetic. Apply this pattern to all main procurement and inventory issuance form components.

**Structure:**

- Outer `Stack`: gray desk background + responsive padding
- `Card`: flat (radius 0), white background, gray border — looks like paper
- All editable inputs: `variant='unstyled'` with bottom border only (no box border/fill)
- Read-only inputs: `variant='unstyled'` with no border (plain text)

**Outer Stack wrapper:**

```typescript
<Stack
  p={{ base: 'xs', sm: 'md' }}
  justify={'center'}
  style={{ background: 'var(--mantine-color-gray-1)' }}
>
```

**Card (document paper):**

```typescript
<Card
  shadow={'sm'}
  padding={lgScreenAndBelow ? 'sm' : 'md'}
  radius={0}
  withBorder
  style={{
    borderColor: 'var(--mantine-color-gray-4)',
    background: 'white',
  }}
>
```

**Editable input fields (TextInput, Textarea, NumberInput, DateInput):**

```typescript
// Editable fields — underline only, no box
variant={'unstyled'}
sx={{ borderBottom: readOnly ? undefined : '1px solid var(--mantine-color-gray-5)' }}

// Always read-only display fields (e.g. document no, unit_issue)
variant={'unstyled'}
// no sx border needed
```

**Rules:**

1. Never use `variant='filled'` or `variant='default'` on form document inputs — always `variant='unstyled'`
2. Never use `variant={readOnly ? 'unstyled' : 'filled'}` — simplify to `variant={'unstyled'}`
3. Never use `variant={readOnly ? 'unstyled' : 'default'}` — simplify to `variant={'unstyled'}` + add `sx` border
4. Never use `radius={'xs'}` on document Cards — use `radius={0}`
5. Never use `shadow={'xs'}` on document Cards — use `shadow={'sm'}`
6. Outer Stack must always have `p={{ base: 'xs', sm: 'md' }}` (not a fixed `'md'`) for mobile responsiveness
7. For `DynamicSelect` inputs in edit mode, use `variant={'unstyled'}` + `sx={{ borderBottom: ... }}`

**When adding a new form component,** always use this pattern so it visually matches the others.

#### Inspect Content Toggle Pattern

The `InspectContent` component (`components/InspectionAcceptanceReports/ActionModalContents/InspectContent.tsx`) includes a toggle switch for each item to indicate if it should be included in the inventory system.

**Features:**

- "For Inventory" column with toggle switch per row
- When toggle is OFF: all fields (name, description, classification, document) are disabled
- When toggle is ON: fields are enabled and required validation applies
- Description field is always optional regardless of toggle state
- Required asterisk indicator only shows when at least one item has toggle ON
- Submit validates only included items

---

## Error Handling

### API Errors

Use the `getErrors` utility from `@/libs/Errors`:

```typescript
import { getErrors } from '@/libs/Errors';

try {
  await API.post('/endpoint', data);
} catch (error: unknown) {
  const errorMessages = getErrors(error);
  // Display errors to user
}
```

### Notification Pattern

Use the `notify` utility for user feedback:

```typescript
import { notify } from '@/libs/Notification';

notify({
  title: 'Success!',
  message: 'Record saved successfully',
  color: 'green', // or 'red' for errors
});
```

---

## State Management

### Local State

Use Mantine hooks and React hooks:

```typescript
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

const [opened, { open, close }] = useDisclosure(false);
const [data, setData] = useState<PurchaseRequestType | null>(null);
```

### Server State

Use SWR for server state:

```typescript
import useSWR from 'swr';
import API from '@/libs/API';
import { API_REFRESH_INTERVAL } from '@/config/intervals';

const { data, isLoading, mutate } = useSWR(
  endpoint ? `/api/v1/${endpoint}` : null,
  (url) => API.get(url),
  {
    refreshInterval: API_REFRESH_INTERVAL,
    revalidateOnFocus: true,
  }
);
```

---

## Mantine UI Guidelines

### Component Usage

- Use Mantine v8 components exclusively for UI
- Use Tabler icons (`@tabler/icons-react`)
- Follow Mantine prop conventions

### Theme Colors

The app uses a custom theme defined in `/config/theme.ts` with the following color palette:

#### Custom Color Palette

**Primary Colors** (Blue spectrum):

- `primary[0-1]`: Light backgrounds (`#EDF3FA`, `#DBE7F5`)
- `primary[2-4]`: Light accents (`#C9DBF0`, `#B8CFEB`, `#A6C3E7`)
- `primary[5-7]`: Medium accents (`#94B7E2`, `#83ABDD`, `#719FD8`)
- `primary[8-9]`: Dark accents (`#5F93D3`, `#4E88CF`)

**Secondary Colors** (Green-gray spectrum):

- `secondary[0-1]`: Light backgrounds (`#EBEDEB`, `#D8DCD8`)
- `secondary[2-4]`: Light accents (`#C5CAC4`, `#B1B9B1`, `#9EA89E`)
- `secondary[5-7]`: Medium accents (`#8B968A`, `#778577`, `#647363`)
- `secondary[8-9]`: Dark accents (`#516250`, `#3E513D`)

**Tertiary Colors** (Light gray spectrum):

- `tertiary[0-1]`: Very light backgrounds (`#F5F7F7`, `#ECF0F0`)
- `tertiary[2-4]`: Light accents (`#E3E8E9`, `#DAE1E2`, `#D1DADB`)
- `tertiary[5-7]`: Medium accents (`#C7D2D3`, `#BECBCC`, `#B5C3C5`)
- `tertiary[8-9]`: Dark accents (`#ACBCBE`, `#A3B5B7`)

#### Usage Guidelines

**Primary Colors**:

- `primary[8-9]`: Headers, primary buttons, active states
- `primary[5-7]`: Hover states, selected items
- `primary[0-2]`: Very light backgrounds

**Secondary Colors**:

- `secondary[7]`: Sub-table headers, toggle buttons
- `secondary[5-6]`: Secondary actions, carets
- `secondary[0-2]`: Alternative backgrounds

**Tertiary Colors**:

- `tertiary[0-1]`: Subtle backgrounds, collapsed areas
- `tertiary[3]`: Borders, dividers
- `tertiary[5-6]`: Reserved for special highlights

#### Theme Implementation

**In Components** (using `useMantineTheme`):

```typescript
const theme = useMantineTheme();
const primaryColor = theme.colors.primary[8];
const secondaryColor = theme.colors.secondary[7];
```

**In CSS/Styles**:

```css
var(--mantine-color-primary-8)   /* Main headers, primary buttons */
var(--mantine-color-primary-9)   /* Pagination, action icons */
var(--mantine-color-secondary-7) /* Sub-table headers, toggle buttons */
var(--mantine-color-tertiary-3)  /* Borders, dividers */
var(--mantine-color-tertiary-0)  /* Subtle backgrounds */
```

**Typography**:

- **Font Family**: `Poppins` (defined in theme)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

#### Theme Standards

1. **Always use theme colors** - Never hardcode hex values
2. **Use semantic color names** - `primary[8]` instead of specific hex codes
3. **Maintain contrast ratios** - Use appropriate color shades for text vs backgrounds
4. **Consistent usage** - Use the same color shades across similar components
5. **Responsive theming** - Colors automatically adapt to light/dark theme changes

### Modern Component Styling Standards

Keep components compact, clean, and mobile-responsive. Follow these conventions:

#### Buttons

- Use `variant='light'` for action icons and secondary buttons (not `variant='outline'`)
- Use `radius='md'` for rounded, modern button shapes
- Use `size='xs'` or `size='compact-xs'` for compact buttons
- Use `stroke={2.5}` for icon stroke weight inside buttons

```typescript
// Good: Modern light variant with rounded radius
<ActionIcon variant='light' size='md' radius='md' color='var(--mantine-color-primary-9)'>
  <IconSearch size={14} stroke={2.5} />
</ActionIcon>

// Good: Compact toggle button
<Button size='compact-xs' variant='light' radius='md' rightSection={<IconChevronDown size={12} />}>
  Show Items
</Button>

// Avoid: Outline variants for small action buttons
<ActionIcon variant='outline' radius='xl'>...</ActionIcon>
```

#### Tables

- Use `verticalSpacing='xs'` for compact table rows
- Use `borderRadius: '8px'` and `overflow: 'hidden'` on the table `sx` for rounded corners
- Use `borderColor: 'var(--mantine-color-gray-3)'` for subtle borders
- Header row: `bg='var(--mantine-color-primary-8)'`, `c='white'`, `fw={600}`
- Sub-table header row: `bg='var(--mantine-color-secondary-7)'`, `c='white'`
- Body cells: `py={8}`, responsive `px` and `fz`
- Sortable headers: wrap label in a transparent `Button` with `p={0}` on the `Table.Th` and matching `px`/`py` on the button; non-sortable headers use a `Box` wrapper with the same `px`/`py` for alignment
- Collapsed sub-table area: `bg='var(--mantine-color-gray-0)'`
- Active collapse border: `2px solid var(--mantine-color-primary-3)`

```typescript
// Good: Consistent header alignment
<Table.Th p={0} bg='var(--mantine-color-primary-8)' fz={lgScreenAndBelow ? 'xs' : 'sm'} fw={600}>
  {head.sortable ? (
    <Button variant='transparent' c='white' px={lgScreenAndBelow ? 'xs' : 'sm'} py={0} fullWidth>
      {head.label}
    </Button>
  ) : (
    <Box px={lgScreenAndBelow ? 'xs' : 'sm'} py={lgScreenAndBelow ? 8 : 10}>
      {head.label}
    </Box>
  )}
</Table.Th>

// Good: Body cells matching header padding
<Table.Td fz={lgScreenAndBelow ? 'xs' : 'sm'} py={8} px={lgScreenAndBelow ? 'xs' : 'sm'}>
  {content}
</Table.Td>
```

#### Spacing and Layout

- Use `gap='sm'` or `gap='xs'` on parent `Stack` components
- Avoid wrapping action bars in `Paper` with shadows; use plain `Group` for cleaner layouts
- Use `transition: 'background-color 150ms ease'` on hoverable rows

#### Pagination

- Use `radius='md'` for pagination buttons
- Use `siblings={isMobile ? 0 : 1}` and `boundaries={isMobile ? 0 : 1}` for compact mobile pagination
- Show per-page `Select` with `radius='md'` and `size='xs'`
- Display record count as `Text size='xs' c='dimmed'`

### Mobile Responsiveness (Component Level)

Use `useMediaQuery` breakpoints:

```typescript
const isMobile = useMediaQuery('(max-width: 600px)'); // Phone
const lgScreenAndBelow = useMediaQuery('(max-width: 900px)'); // Tablet and below
```

- **Phone (`isMobile`)**: Render card-based layouts instead of tables. Each row becomes a `Card` with label-value pairs stacked vertically.
- **Tablet (`lgScreenAndBelow`)**: Use `Table.ScrollContainer` with `minWidth` for horizontal scroll. Use `'xs'` sizing for fonts, padding, buttons.
- **Desktop**: Full table with sticky headers, `'sm'` sizing.

```typescript
// Good: Three-tier responsive rendering
{isMobile ? (
  <Stack gap='xs'>
    {data.map((item) => <Card key={item.id}>...</Card>)}
  </Stack>
) : lgScreenAndBelow ? (
  <Table.ScrollContainer minWidth={900}>
    {renderTable()}
  </Table.ScrollContainer>
) : (
  renderTable()
)}
```

---

## Permissions and Auth

### Permission Checking

Use the `getAllowedPermissions` utility:

```typescript
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';

const canView = getAllowedPermissions('pr', 'view')?.some((permission) =>
  permissions.includes(permission)
);
```

### Auth Hook

Use `useAuth` hook for authentication:

```typescript
import useAuth from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();
```

---

## File Organization

### Directory Structure

```
app/                    # Next.js App Router pages
├── page.tsx           # Main page
└── settings/          # Settings pages
    └── user-profile/
        └── page.tsx

components/           # React components
├── Generic/          # Reusable components (DataTable, Modal, etc.)
├── Login/            # Feature-specific components
├── PurchaseRequests/
├── PurchaseOrders/
└── ...

libs/                 # Utility classes and API client
├── API.ts           # Axios wrapper with interceptors
├── Auth.ts          # Authentication utilities
├── Cookie.ts        # Cookie management
├── Errors.ts        # Error handling
└── Notification.ts  # Toast notifications

hooks/               # Custom React hooks
├── useAuth.ts
└── useMediaAsset.ts

config/              # Configuration files
├── permissions.ts
├── menus.ts
├── theme.ts
└── intervals.ts

utils/               # Helper functions
├── Helpers.ts
└── GenerateAllowedPermissions.ts

types/               # TypeScript type definitions
└── types.d.ts
```

---

## Common Patterns

### Form Handling

Use Mantine `useForm` hook:

```typescript
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    field1: '',
    field2: '',
  },
  validate: {
    field1: (val) => val.length > 0 ? null : 'Required',
  },
});

// In JSX
<form onSubmit={form.onSubmit((values) => { ... })}>
  <TextInput {...form.getInputProps('field1')} />
</form>
```

### Modal Pattern

Use Mantine `useModalsStack` or `useDisclosure`:

```typescript
const [opened, { open, close }] = useDisclosure(false);

<Modal opened={opened} onClose={close} title="Title">
  {/* content */}
</Modal>;
```

---

## Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Git Conventions

- Run `npm run format && npm run lint && npm run build` before committing
- Use clear, descriptive commit messages
- Create feature branches for new features
- Never commit code that fails any of the above commands

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine UI v8](https://v8.mantine.dev/)
- [Tabler Icons](https://tabler-icons.io/)
- [SWR](https://swr.vercel.app/)

---

## Styling Guidelines

### CSS Modules

This project uses CSS Modules (`.module.css`) for component-specific styling. Follow these conventions:

```css
/* Good: Use Mantine CSS variables */
.root {
  padding: var(--mantine-spacing-lg);
  background-color: var(--mantine-color-gray-0);
}

/* Good: Mobile-first responsive design */
.container {
  display: flex;
  flex-direction: column;

  @media (min-width: var(--mantine-breakpoint-md)) {
    flex-direction: row;
  }
}

/* Good: Use Mantine theme colors */
.text {
  color: var(--mantine-color-primary-6);
}

/* Avoid: Hardcoded colors */
.bad {
  background-color: #000; /* Don't do this */
}
```

### Mantine CSS Variables

Use Mantine's built-in CSS variables instead of hardcoded values:

```css
/* Spacing */
var(--mantine-spacing-xs)
var(--mantine-spacing-sm)
var(--mantine-spacing-md)
var(--mantine-spacing-lg)
var(--mantine-spacing-xl)

/* Colors */
var(--mantine-color-primary-0) through var(--mantine-color-primary-9)
var(--mantine-color-gray-0) through var(--mantine-color-gray-9)
var(--mantine-color-dark-0) through var(--mantine-color-dark-9)

/* Breakpoints */
var(--mantine-breakpoint-xs)   /* ~36em */
var(--mantine-breakpoint-sm)  /* ~48em */
var(--mantine-breakpoint-md)  /* ~62em */
var(--mantine-breakpoint-lg)  /* ~75em */
var(--mantine-breakpoint-xl)  /* ~88em */

/* Fonts */
var(--mantine-font-family)
var(--mantine-font-size-xs)
var(--mantine-font-size-sm)
var(--mantine-font-size-md)
var(--mantine-font-size-lg)
var(--mantine-font-size-xl)
```

### Mobile Responsiveness

Always design for mobile first, then enhance for larger screens:

```css
/* Mobile-first (default) */
.card {
  padding: var(--mantine-spacing-md);
  width: 100%;
}

/* Tablet and up */
@media (min-width: var(--mantine-breakpoint-sm)) {
  .card {
    padding: var(--mantine-spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: var(--mantine-breakpoint-md)) {
  .card {
    padding: var(--mantine-spacing-xl);
    max-width: 800px;
  }
}

/* Large screens */
@media (min-width: var(--mantine-breakpoint-lg)) {
  .card {
    max-width: 1200px;
  }
}
```

### Modern CSS Patterns

```css
/* Use flexbox for layout */
.flexContainer {
  display: flex;
  gap: var(--mantine-spacing-md);
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* Use grid for complex layouts */
.gridContainer {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--mantine-spacing-md);

  @media (min-width: var(--mantine-breakpoint-sm)) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: var(--mantine-breakpoint-md)) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Smooth transitions */
.transition {
  transition: all 200ms ease;
}

.transition:hover {
  background-color: var(--mantine-color-primary-0);
}

/* Focus states for accessibility */
.focusable:focus-visible {
  outline: 2px solid var(--mantine-color-primary-6);
  outline-offset: 2px;
}
```

### Styling Don'ts

- **Don't use Tailwind** - This project uses Mantine + CSS Modules
- **Don't use inline styles** - Use CSS Modules instead
- **Don't use hardcoded pixel values** - Use Mantine spacing variables
- **Don't use `!important`** - Use more specific selectors
- **Don't use deprecated `@mixin`** - Use regular CSS and media queries
- **Don't forget mobile** - Always test on smaller screens
- **Don't use `variant='outline'` for small action icons** - Use `variant='light'` for a modern look
- **Don't use `radius='xl'` on small elements** - Use `radius='md'` for consistency
- **Don't wrap action bars in `Paper` with shadows** - Use plain `Group` for cleaner layouts
- **Don't use fixed font sizes across breakpoints** - Always use responsive `lgScreenAndBelow ? 'xs' : 'sm'`
- **Don't use `cursor: 'not-allowed'` on non-clickable rows** - Use `cursor: 'default'` instead

### File Organization

```
styles/
├── login/
│   ├── login.module.css
│   └── style.css (global login styles)
└── generic/
    ├── sidebar.module.css
    ├── navbarlinksgroup.module.css
    └── userbutton.module.css
```

### Using Styles in Components

```typescript
import styles from './Component.module.css';

const MyComponent = () => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
};
```
