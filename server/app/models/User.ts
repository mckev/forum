import { GcpDatastore } from "../classes/GcpDatastore";


export class User {
    private static Kind: string = "users";
    private static NonIndexed: Set<string> = new Set(["password", "thumbsup_tot", "thumbsdown_tot"]);

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
                for (const key of Object.keys(user)) {
                    console.log(key + " : " + user[key]);
                }
                return resolve(user);
            });
        });
    }

    public static SetUser(user: any): Promise<void> {
        // To create, set user.id = null
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
}
