import Realm from 'realm'
import ReadingSchema from '../schemas/ReadingSchema'

export default function getRealm() {
    return Realm.open({
        schema: [ReadingSchema],

    });
}