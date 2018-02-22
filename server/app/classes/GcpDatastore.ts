import * as Datastore from "@google-cloud/datastore";
import { Config } from "../Config";


export class GcpDatastore {
    public static Datastore = Datastore({ "projectId": Config.GCPProjectId, "namespace": Config.GCPDatastoreNamespace });

    public static FromDatastore(entity) {
        // Ref: https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/2-structured-data/books/model-datastore.js
        // Translates from Datastore's entity format to the format expected by the application.
        //
        // Datastore format:
        //   {
        //     Symbol(KEY): [namespace, kind, id],
        //     property1: value1
        //     property2: value2
        //   }
        //
        // Application format:
        //   {
        //     id: id,
        //     property1: value1
        //     property2: value2
        //   }
        let obj = entity;
        // Ref: https://github.com/GoogleCloudPlatform/google-cloud-node/issues/2093
        obj.id = entity[Datastore.KEY].name || parseInt(entity[Datastore.KEY].id, 10);
        return obj;
    }

    public static ToDatastore(obj, kind: string, nonIndexed: Set<string>) {
        // Ref: https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/2-structured-data/books/model-datastore.js
        // Translates from the application's format to the datastore's extended entity format. It also handles marking any
        // specified properties as non-indexed.
        //
        // Application format:
        //   {
        //     id: id,
        //     property1: value1,
        //     unindexedProperty2: value2
        //   }
        //
        // Datastore format:
        //   {
        //     "key": [kind, id],
        //     "data": [
        //       {
        //         name: property1,
        //         value: value1
        //       },
        //       {
        //         name: unindexedProperty2,
        //         value: value2,
        //         excludeFromIndexes: true
        //       }
        //     ]
        //   ]
        let entity = { "key": null, "data": [] };
        if (obj.id) {
            // Update/Create the entity
            entity.key = GcpDatastore.Datastore.key([kind, obj.id]);
        } else {
            // Create a new entity
            entity.key = GcpDatastore.Datastore.key(kind);
        }
        delete (obj.id);
        for (const key of Object.keys(obj)) {
            entity.data.push({
                "name": key,
                "value": obj[key],
                "excludeFromIndexes": nonIndexed.has(key),
            });
        }
        return entity;
    }
}
