import { Config } from "../Config";
import { GcpDatastore } from "../classes/GcpDatastore";


export class User {
    private static Kind: string = "users";
    private static NonIndexed: Set<string> = new Set(["password", "thumbsup_tot", "thumbsdown_tot"]);

    private static MakeKey(id: number) {
        return GcpDatastore.Datastore.key({
            "namespace": Config.GCPDatastoreNamespace,
            "path": [User.Kind, id],
        });
    }

    public static AddUser(username: string, password: string, thumbsup_tot: number, thumbsdown_tot: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const user = {
                "username": username,
                "password": password,
                "thumbsup_tot": thumbsup_tot,
                "thumbsdown_tot": thumbsdown_tot,
                "created": new Date(),
            };
            const entity = GcpDatastore.ToDatastore(user, User.Kind, User.NonIndexed);
            console.log(JSON.stringify(entity));
            GcpDatastore.Datastore.save(entity, (err, result) => {
                if (err) {
                    return reject(err);
                }
                const id = parseInt(result.mutationResults[0].key.path[0].id, 10);
                return resolve(id);
            });
        });
    }

    public static UpdateUser(user: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const entity = GcpDatastore.ToDatastore(user, User.Kind, User.NonIndexed);
            console.log(JSON.stringify(entity));
            GcpDatastore.Datastore.save(entity, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    public static GetUser(username: string): Promise<any> {
        // Ref: https://cloud.google.com/datastore/docs/concepts/queries#filters
        return new Promise<any>((resolve, reject) => {
            const query = GcpDatastore.Datastore.createQuery([User.Kind])
                .filter("username", "=", username)
                .limit(1);
            GcpDatastore.Datastore.runQuery(query, (err, entities, nextQuery) => {
                if (err) {
                    return reject(err);
                }
                if (entities.length === 0) {
                    return resolve(null);
                }
                const entity = entities[0];
                const user = GcpDatastore.FromDatastore(entity);
                return resolve(user);
            });
        });
    }

    public static DeleteUser(userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const key = User.MakeKey(userId);
            GcpDatastore.Datastore.delete(key, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

}
