import * as migration_20261104_193317_initial from './20261104_193317_initial';
import * as migration_20261104_203510_blob_storage from './20261104_203510_blob_storage';
import * as migration_20261104_212803_school_settings from './20261104_212803_school_settings';
import * as migration_20261104_213220_lesson_progress from './20261104_213220_lesson_progress';
import * as migration_20261104_223330_certificates from './20261104_223330_certificates';

export const migrations = [
  {
    up: migration_20261104_193317_initial.up,
    down: migration_20261104_193317_initial.down,
    name: '20261104_193317_initial',
  },
  {
    up: migration_20261104_203510_blob_storage.up,
    down: migration_20261104_203510_blob_storage.down,
    name: '20261104_203510_blob_storage',
  },
  {
    up: migration_20261104_212803_school_settings.up,
    down: migration_20261104_212803_school_settings.down,
    name: '20261104_212803_school_settings',
  },
  {
    up: migration_20261104_213220_lesson_progress.up,
    down: migration_20261104_213220_lesson_progress.down,
    name: '20261104_213220_lesson_progress',
  },
  {
    up: migration_20261104_223330_certificates.up,
    down: migration_20261104_223330_certificates.down,
    name: '20261104_223330_certificates'
  },
];
