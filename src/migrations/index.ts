import * as migration_20250404_194237_initial from './20250404_194237_initial';
import * as migration_20260325_022748 from './20260325_022748';
import * as migration_20260325_052824 from './20260325_052824';
import * as migration_20260326_045825 from './20260326_045825';
import * as migration_20260326_053904 from './20260326_053904';
import * as migration_20260326_055411 from './20260326_055411';
import * as migration_20260326_060452 from './20260326_060452';
import * as migration_20260326_062713 from './20260326_062713';
import * as migration_20260326_085611 from './20260326_085611';
import * as migration_20260326_feature_flags from './20260326_feature_flags';
import * as migration_20260326_homepage_cta from './20260326_homepage_cta';
import * as migration_20260326_homepage_global from './20260326_homepage_global';
import * as migration_20260327_025519 from './20260327_025519';
import * as migration_20260327_121846 from './20260327_121846';
import * as migration_20260327_footer_copyright from './20260327_footer_copyright';
import * as migration_20260327_homepage_cta_section from './20260327_homepage_cta_section';
import * as migration_20260328_add_contact_global from './20260328_add_contact_global';

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
  {
    up: migration_20260326_055411.up,
    down: migration_20260326_055411.down,
    name: '20260326_055411',
  },
  {
    up: migration_20260326_060452.up,
    down: migration_20260326_060452.down,
    name: '20260326_060452',
  },
  {
    up: migration_20260326_062713.up,
    down: migration_20260326_062713.down,
    name: '20260326_062713',
  },
  {
    up: migration_20260326_085611.up,
    down: migration_20260326_085611.down,
    name: '20260326_085611',
  },
  {
    up: migration_20260326_feature_flags.up,
    down: migration_20260326_feature_flags.down,
    name: '20260326_feature_flags',
  },
  {
    up: migration_20260326_homepage_cta.up,
    down: migration_20260326_homepage_cta.down,
    name: '20260326_homepage_cta',
  },
  {
    up: migration_20260326_homepage_global.up,
    down: migration_20260326_homepage_global.down,
    name: '20260326_homepage_global',
  },
  {
    up: migration_20260327_025519.up,
    down: migration_20260327_025519.down,
    name: '20260327_025519',
  },
  {
    up: migration_20260327_121846.up,
    down: migration_20260327_121846.down,
    name: '20260327_121846',
  },
  {
    up: migration_20260327_footer_copyright.up,
    down: migration_20260327_footer_copyright.down,
    name: '20260327_footer_copyright',
  },
  {
    up: migration_20260327_homepage_cta_section.up,
    down: migration_20260327_homepage_cta_section.down,
    name: '20260327_homepage_cta_section'
  },
  {
    up: migration_20260328_add_contact_global.up,
    down: migration_20260328_add_contact_global.down,
    name: '20260328_add_contact_global',
  },
];
