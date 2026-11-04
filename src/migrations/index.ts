import * as migration_20261104_193317_initial from './20261104_193317_initial';

export const migrations = [
  {
    up: migration_20261104_193317_initial.up,
    down: migration_20261104_193317_initial.down,
    name: '20261104_193317_initial'
  },
];
