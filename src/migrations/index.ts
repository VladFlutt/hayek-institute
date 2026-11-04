import * as migration_20261104_193317_initial from './20261104_193317_initial';
import * as migration_20261104_203510_blob_storage from './20261104_203510_blob_storage';
import * as migration_20261104_212803_school_settings from './20261104_212803_school_settings';

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
    name: '20261104_212803_school_settings'
  },
];
