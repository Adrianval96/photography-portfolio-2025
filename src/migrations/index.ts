import * as migration_20250404_194237_initial from './20250404_194237_initial';
import * as migration_20260325_022748 from './20260325_022748';
import * as migration_20260325_052824 from './20260325_052824';
import * as migration_20260326_045825 from './20260326_045825';
import * as migration_20260326_053904 from './20260326_053904';

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
    name: '20260325_052824',
  },
  {
    up: migration_20260326_045825.up,
    down: migration_20260326_045825.down,
    name: '20260326_045825',
  },
  {
    up: migration_20260326_053904.up,
    down: migration_20260326_053904.down,
    name: '20260326_053904',
  },
];
