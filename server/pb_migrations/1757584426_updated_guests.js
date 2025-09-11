/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2047001084")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_MiLtu8Vyvc` ON `guests` (`email`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2047001084")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_MiLtu8Vyvc` ON `guests` (`email`)"
    ]
  }, collection)

  return app.save(collection)
})
