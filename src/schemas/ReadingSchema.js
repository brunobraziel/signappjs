export default class ReadingSchema  {
    static schema = {
        name: 'Reading',
        primaryKey: 'id',
        properties: {
            id: { type: 'int', indexed: true },
            timeStamp: 'string',
            freqs: 'string',
            times: 'string'
        }
    }
}