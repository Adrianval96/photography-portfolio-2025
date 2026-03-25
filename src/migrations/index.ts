import * as migration_20250404_194237_initial from './20250404_194237_initial';
import * as migration_20260325_022748 from './20260325_022748';
import * as migration_20260325_052824 from './20260325_052824';

export const migrations = [
  {
    up: migration_20250404_194237_initial.up,
    down: migration_20250404_194237_initial.down,
    name: '20250404_194237_initial',
  },
  {
    up: migration_20260325_022748.up,
    down: migration_20260325_022748.down,
    name: '20260325_022748',
  },
  {
    up: migration_20260325_052824.up,
    down: migration_20260325_052824.down,
    name: '20260325_052824'
  },
];
